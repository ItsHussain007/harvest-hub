import { NextResponse } from "next/server";
import { Client } from "pg";

export async function GET() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log("Connected to database successfully");

    const result = await client.query(`
      SELECT 
        promotion_id AS id,
        product_name AS title, 
        discount_percentage AS discount,
        description 
      FROM Promotions
      JOIN Products ON Promotions.product_id = Products.product_id
    `);

    await client.end();

    return NextResponse.json(result.rows);
  } catch (error: unknown) {
    console.error("Error fetching promotions:", error);
    return NextResponse.json({ error: "Failed to fetch promotions" }, { status: 500 });
  }
}
