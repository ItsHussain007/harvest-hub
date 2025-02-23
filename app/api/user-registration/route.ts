import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import nodemailer from 'nodemailer';
import speakeasy from 'speakeasy';
import { NextRequest, NextResponse } from 'next/server';
import { RateLimiterMemory, RateLimiterRes } from 'rate-limiter-flexible';

const getClientIp = (req: NextRequest): string => {
  const forwardedFor = req.headers.get('x-forwarded-for');
  return forwardedFor ? forwardedFor.split(',')[0].trim() : 'unknown';
};

const rateLimiter = new RateLimiterMemory({
  points: 10, // 10 requests
  duration: 3600, // per hour
});

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const jwtSecret = process.env.JWT_SECRET!;
const brevoSmtpUsername = process.env.BREVO_SMTP_USERNAME!;
const brevoSmtpPassword = process.env.BREVO_SMTP_PASSWORD!;
const senderEmail = process.env.SENDER_EMAIL!;

const registrationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  firstName: Joi.string().min(3).max(255).required(),
  lastName: Joi.string().min(3).max(255).required(),
  phoneNumber: Joi.string().optional().allow(''),
  dateOfBirth: Joi.date().optional().allow(''),
  accountType: Joi.string().valid('individual', 'business').required(),
  businessName: Joi.string().when('accountType', { is: 'business', then: Joi.required(), otherwise: Joi.optional().allow('') }),
  registrationNumber: Joi.string().when('accountType', { is: 'business', then: Joi.required(), otherwise: Joi.optional().allow('') }),
});

async function sendVerificationEmail(email: string, verificationToken: string): Promise<void> {
  const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    auth: { user: brevoSmtpUsername, pass: brevoSmtpPassword },
  });
  
  const verificationLink = `http://localhost:3000/api/user-registration-verify-email?token=${verificationToken}`;
  
  // HTML email template
  const htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email - HarvestHub</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 20px auto;
        background: #ffffff;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        text-align: center;
      }
      .logo {
        width: 150px;
      }
      h1 {
        color: #4CAF50;
      }
      p {
        color: #555;
        font-size: 16px;
        line-height: 1.6;
      }
      .button {
        display: inline-block;
        padding: 12px 24px;
        margin: 20px 0;
        color: #fff;
        background-color: #4CAF50;
        text-decoration: none;
        font-size: 18px;
        border-radius: 5px;
      }
      .footer {
        margin-top: 20px;
        font-size: 12px;
        color: #888;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <img src="YOUR_LOGO_URL" alt="HarvestHub Logo" class="logo">
      <h1>Welcome to HarvestHub! 🌱</h1>
      <p>Thank you for joining us! You're just one step away from accessing the best fresh and local produce.</p>
      <p>Click the button below to verify your email and activate your account:</p>
      <a href="${verificationLink}" class="button">Verify My Email</a>
      <p>If you did not sign up for HarvestHub, you can safely ignore this email.</p>
      <p class="footer">HarvestHub | Fresh, Local, Sustainable</p>
    </div>
  </body>
  </html>
  `;
  
  await transporter.sendMail({
    from: senderEmail,
    to: email,
    subject: 'Verify Your Email Address',
    html: htmlContent,
  });
  console.log('Verification email sent to:', email);
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const clientIp = getClientIp(req);
  try {
    await rateLimiter.consume(clientIp); // This throws RateLimiterRes if limit exceeded

    const body = await req.json();
    const { error, value } = registrationSchema.validate(body);
    if (error) return NextResponse.json({ error: error.details[0].message }, { status: 400 });

    const {
      email, password, firstName, lastName, phoneNumber, dateOfBirth, accountType,
      businessName, registrationNumber,
    } = value;

    const { rows } = await pool.query('SELECT * FROM harvesthub_users WHERE email = $1', [email]);
    if (rows.length > 0) return NextResponse.json({ error: 'Email already registered' }, { status: 400 });

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = jwt.sign({ email }, jwtSecret, { expiresIn: '24h' });
    const twoFactorSecret = speakeasy.generateSecret({ name: `HarvestHub:${email}` });
    const backupCodes = Array(10).fill(0).map(() => speakeasy.generateSecret().base32.slice(0, 10));
    const mockDocumentUrl = businessName ? `https://mock-s3.com/${businessName.replace(/\s/g, '-')}-doc.pdf` : null;

    const newUser = await pool.query(
      `INSERT INTO harvesthub_users (
        email, password, first_name, last_name, phone_number, date_of_birth, account_type,
        business_name, registration_number, business_document_url, verification_token,
        two_factor_secret, two_factor_backup_codes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id`,
      [
        email, hashedPassword, firstName, lastName, phoneNumber || null, dateOfBirth || null, accountType,
        businessName || null, registrationNumber || null, mockDocumentUrl, verificationToken,
        twoFactorSecret.base32, JSON.stringify(backupCodes),
      ]
    );
    const userId = newUser.rows[0].id;

    await sendVerificationEmail(email, verificationToken);

    return NextResponse.json({
      message: 'Registration successful. Please verify your email and set up 2FA.',
      userId,
      twoFactorSecret: twoFactorSecret.otpauth_url,
      backupCodes,
    }, { status: 201 });
  } catch (err: any) {
    console.error(err);
    if (err instanceof RateLimiterRes) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }
    if (err.code === '23505') return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const config = {
  api: {
    externalResolver: true,
    headers: {
      'Access-Control-Allow-Origin': 'http://localhost:3000',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  },
};
