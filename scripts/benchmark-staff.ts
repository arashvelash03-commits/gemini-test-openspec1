import { router, createCallerFactory } from "../src/server/trpc";
import { staffRouter } from "../src/server/routers/staff";
import { db } from "../src/lib/db";
import { users } from "../src/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { randomUUID } from "crypto";

// Load .env.local
const envLocalPath = path.resolve(process.cwd(), '.env.local');
dotenv.config({ path: envLocalPath });
dotenv.config();

// Fallback DB URL
if (!process.env.DATABASE_URL) {
  try {
    if (fs.existsSync('.db_url_for_migrate')) {
        const dbUrl = fs.readFileSync('.db_url_for_migrate', 'utf-8').trim();
        if (dbUrl) process.env.DATABASE_URL = dbUrl;
    }
  } catch (e) {
    // ignore
  }
}

// Construct a minimal router for testing
const benchmarkRouter = router({
    staff: staffRouter
});

async function main() {
  console.log("🚀 Benchmarking Staff API...");

  // 1. Setup Context
  let doctorId: string | undefined;

  // Try to find an existing doctor
  const existingDoctor = await db.query.users.findFirst({
      where: eq(users.role, 'doctor'),
  });

  if (existingDoctor) {
      doctorId = existingDoctor.id;
      console.log(`Using existing doctor: ${doctorId}`);
  } else {
      // Create a dummy doctor user
      const newId = randomUUID();
      await db.insert(users).values({
          id: newId,
          nationalCode: "1000000000",
          role: "doctor",
          fullName: "Benchmark Doctor",
          status: "active",
          resourceType: "Practitioner",
          createdAt: new Date(),
          updatedAt: new Date(),
      }).onConflictDoNothing();
      doctorId = newId;
      console.log(`Created new benchmark doctor: ${doctorId}`);
  }

  const mockCtx = {
    session: {
      user: {
        id: doctorId,
        role: "doctor",
      },
      expires: new Date().toISOString(),
    },
  };

  const createCaller = createCallerFactory(benchmarkRouter);
  const caller = createCaller(mockCtx as any);

  // 2. Check current staff count
  const currentCountRes = await db.select({ count: sql<number>`count(*)` })
    .from(users)
    .where(eq(users.createdBy, doctorId));
  const currentCount = Number(currentCountRes[0].count);

  console.log(`Initial staff count for doctor: ${currentCount}`);

  // 3. Seed if necessary (ensure at least 1000 items)
  const targetCount = 1000;
  if (currentCount < targetCount) {
      const toCreate = targetCount - currentCount;
      console.log(`Seeding ${toCreate} staff members...`);

      const batchSize = 100;
      let created = 0;

      while (created < toCreate) {
          const batch = [];
          const currentBatchSize = Math.min(batchSize, toCreate - created);

          for (let i = 0; i < currentBatchSize; i++) {
              const uniqueSuffix = Math.floor(Math.random() * 1000000000) + created + Date.now();
              batch.push({
                  id: randomUUID(),
                  fullName: `Staff ${created + i}`,
                  nationalCode: `${uniqueSuffix}`.slice(0, 10).padEnd(10, '0'),
                  phoneNumber: `09${uniqueSuffix}`.slice(0, 11).padEnd(11, '0'),
                  role: "clerk" as const,
                  status: "active" as const,
                  createdBy: doctorId,
                  resourceType: "Practitioner",
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  fhirData: {},
              });
          }

          try {
              await db.insert(users).values(batch).onConflictDoNothing();
          } catch (e) {
              console.error("Batch insert failed", e);
          }
          created += currentBatchSize;
          process.stdout.write('.');
      }
      console.log("\nSeeding complete.");
  }

  // 4. Measure Latency
  console.log("Measuring 'getMyStaff' latency (fetching all)...");

  const iterations = 5;
  let totalTime = 0;
  let lastCount = 0;

  for (let i = 0; i < iterations; i++) {
      const start = performance.now();
      // Typescript might complain if getMyStaff signature changes later
      const res: any = await caller.staff.getMyStaff({});
      const end = performance.now();
      totalTime += (end - start);

      if (Array.isArray(res)) {
          lastCount = res.length;
      } else if (res && typeof res === 'object' && 'items' in res) {
          lastCount = res.items.length;
      }
  }

  const avgTime = totalTime / iterations;
  console.log(`Average Latency (5 runs): ${avgTime.toFixed(2)}ms for ${lastCount} items`);

  process.exit(0);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
