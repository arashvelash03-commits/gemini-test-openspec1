import { db } from "@/lib/db";
import { sql } from "drizzle-orm";

async function checkSchema() {
  console.log("Checking DB schema for audit_logs...");

  try {
    // Check if table exists
    const result = await db.execute(sql`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'audit_logs'
    `);

    if (result.rows.length === 0) {
      console.log("❌ Table 'audit_logs' DOES NOT exist.");
    } else {
      console.log("✅ Table 'audit_logs' FOUND. Columns:");
      result.rows.forEach((row: any) => {
        console.log(`  - ${row.column_name} (${row.data_type})`);
      });
    }

  } catch (error) {
    console.error("Schema check failed (likely connection error):", error);
  } finally {
    process.exit(0);
  }
}

checkSchema();
