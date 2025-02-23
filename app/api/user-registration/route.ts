import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import nodemailer from 'nodemailer';
import speakeasy from 'speakeasy';
import { NextRequest, NextResponse } from 'next/server';
import { RateLimiterMemory } from 'rate-limiter-flexible';

// Function to extract IP from request
const getClientIp = (req: NextRequest): string => {
  const forwardedFor = req.headers.get('x-forwarded-for');
  return forwardedFor ? forwardedFor.split(',')[0].trim() : 'unknown'; // First IP in chain, fallback to 'unknown'
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
  await transporter.sendMail({
    from: senderEmail,
    to: email,
    subject: 'Verify Your Email Address',
    html: `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`,
  });
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const clientIp = getClientIp(req);
    await rateLimiter.consume(clientIp); // Use extracted IP

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
      twoFactorSecret: twoFactorSecret.otpauth_url, // For QR code
      backupCodes,
    }, { status: 201 });
  } catch (err: any) {
    console.error(err);
    if (err.code === '23505') return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    if (err.points) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
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