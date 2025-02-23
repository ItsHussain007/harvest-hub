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
                farm_id AS id, 
                farm_name AS name, 
                contact_name AS contact, 
                address, 
                postcode, 
                contact_email AS email, 
                contact_phone AS phone, 
                description 
            FROM Farms
        `);

        await client.end();

        return NextResponse.json(result.rows);
    } catch (error) {
        console.error("Error fetching profiles:", error);
        return NextResponse.json({ error: "Failed to fetch profiles" }, { status: 500 });
    }
}
