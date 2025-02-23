import { Pool } from 'pg';
import { NextRequest, NextResponse } from 'next/server';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function POST(req: NextRequest): Promise<NextResponse> {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ available: false, message: 'Email required' }, { status: 400 });

  const { rows } = await pool.query('SELECT * FROM harvesthub_users WHERE email = $1', [email]);
  return NextResponse.json({
    available: rows.length === 0,
    message: rows.length === 0 ? 'Email is available' : 'Email not available. If it’s yours, please log in.',
  });
}