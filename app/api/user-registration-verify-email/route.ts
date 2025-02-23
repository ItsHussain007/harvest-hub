import { Pool } from 'pg';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const jwtSecret = process.env.JWT_SECRET!;

export async function GET(req: NextRequest): Promise<NextResponse> {
  const token = req.nextUrl.searchParams.get('token');
  if (!token) return NextResponse.json({ error: 'Token required' }, { status: 400 });

  try {
    const decoded = jwt.verify(token, jwtSecret) as { email: string };
    const result = await pool.query(
      'UPDATE harvesthub_users SET email_verified = TRUE, verification_token = NULL WHERE email = $1 AND verification_token = $2 RETURNING id',
      [decoded.email, token]
    );
    if (result.rowCount === 0) return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });

    return NextResponse.json({ message: 'Email verified successfully' }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
  }
}

export const config = {
  api: {
    headers: {
      'Access-Control-Allow-Origin': 'http://localhost:3000',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  },
};