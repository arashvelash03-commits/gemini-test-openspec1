import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";
import fs from "fs";
import path from "path";

async function main() {
  console.log("Starting manual migration...");

  try {
    // 1. Check connection
    console.log("Checking DB connection...");
    await db.execute(sql`SELECT 1`);
    console.log("DB connection successful.");

    // 2. Check if migration table exists
    const migrationsFolder = path.join(process.cwd(), "drizzle");
    console.log(`Looking for migrations in: ${migrationsFolder}`);

    if (!fs.existsSync(migrationsFolder)) {
      console.error("Migrations folder not found!");
      process.exit(1);
    }

    // 3. Run migration
    console.log("Applying migrations...");
    await migrate(db, { migrationsFolder });
    console.log("Migrations applied successfully!");

  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

main();
