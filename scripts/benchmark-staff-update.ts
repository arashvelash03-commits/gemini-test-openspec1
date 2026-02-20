import { db } from "../src/lib/db";
import { users } from "../src/lib/db/schema";
import { eq } from "drizzle-orm";

async function benchmark() {
  console.log("🚀 Starting Benchmark: Staff Existence Check");

  // This script intends to measure the difference between SELECT * and SELECT id
  // Note: Requires a running database and valid environment variables.

  const nationalCode = "1234567890"; // Example NC

  try {
    // 1. Baseline: Select All (Current implementation)
    console.time("Baseline (SELECT *)");
    for (let i = 0; i < 100; i++) {
        await db.query.users.findFirst({
            where: eq(users.nationalCode, nationalCode),
        });
    }
    console.timeEnd("Baseline (SELECT *)");

    // 2. Optimized: Select ID only
    console.time("Optimized (SELECT id)");
    for (let i = 0; i < 100; i++) {
        await db.query.users.findFirst({
            where: eq(users.nationalCode, nationalCode),
            columns: { id: true },
        });
    }
    console.timeEnd("Optimized (SELECT id)");

  } catch (e) {
    console.error("Benchmark failed (likely due to missing DB connection or dependencies):");
    console.error(e);
  }
}

benchmark();
