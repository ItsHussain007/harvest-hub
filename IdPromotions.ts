import { NextResponse } from "next/server";
import { Client } from "pg";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();

    // Fetch promotion by ID
    const result = await client.query(
      `
      SELECT 
        p.promotion_id AS id,
        pr.product_name,
        pr.category,
        pr.unit_price,
        pr.image_url,
        p.discount_percentage,
        ROUND(pr.unit_price * (1 - (p.discount_percentage / 100)), 2) AS discounted_price,
        p.start_date,
        p.end_date
      FROM Promotions p
      INNER JOIN Products pr
      ON p.product_id = pr.product_id
      WHERE p.promotion_id = $1
    `,
      [params.id]
    );

    await client.end();

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Promotion not found" }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]); // Return single promotion
  } catch (error) {
    console.error("Error fetching promotion details:", error);
    return NextResponse.json(
      { error: "Failed to fetch promotion details" },
      { status: 500 }
    );
  }
}
