import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

async function getUserViews(sql: any, userId: string) {
  return await sql`
    SELECT * FROM user_product_views 
    WHERE user_id = ${userId}
  `;
}

async function deleteOldestView(sql: any, userId: string) {
  return await sql`
    DELETE FROM user_product_views 
    WHERE user_id = ${userId}
    AND viewed_at = (
      SELECT MIN(viewed_at) 
      FROM user_product_views 
      WHERE user_id = ${userId}
    )
    RETURNING *
  `;
}

async function addNewView(sql: any, userId: string, productId: string) {
  return await sql`
    INSERT INTO user_product_views (user_id, product_id)
    VALUES (${userId}, ${productId})
    RETURNING *
  `;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  const sql = neon(process.env.DATABASE_URL!);
  const userViews = await getUserViews(sql, userId);

  return NextResponse.json({ userViews, length: userViews.length });
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  const sql = neon(process.env.DATABASE_URL!);
  const deletedRecord = await deleteOldestView(sql, userId);

  if (deletedRecord.length === 0) {
    return NextResponse.json(
      { message: "No records found to delete" },
      { status: 404 }
    );
  }

  return NextResponse.json({ deletedRecord: deletedRecord[0] });
}

export async function POST(req: Request) {
  const { userId, productId } = await req.json();

  if (!userId || !productId) {
    return NextResponse.json(
      { error: "userId and productId are required" },
      { status: 400 }
    );
  }

  const sql = neon(process.env.DATABASE_URL!);

  const userViews = await getUserViews(sql, userId);

  if (userViews.length >= 5) {
    await deleteOldestView(sql, userId);
  }

  const newView = await addNewView(sql, userId, productId);

  return NextResponse.json({ newView: newView[0] });
}
