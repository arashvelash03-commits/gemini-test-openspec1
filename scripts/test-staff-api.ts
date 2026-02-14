
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load .env.local
const envLocalPath = path.resolve(process.cwd(), '.env.local');
dotenv.config({ path: envLocalPath });
dotenv.config();

if (!process.env.DATABASE_URL) {
  try {
    const dbUrl = fs.readFileSync(path.resolve(process.cwd(), '.db_url_for_migrate'), 'utf-8').trim();
    if (dbUrl) {
      process.env.DATABASE_URL = dbUrl;
      console.log('Loaded DATABASE_URL from .db_url_for_migrate');
    }
  } catch (e) {
    console.warn('Could not read .db_url_for_migrate');
  }
}

console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not Set');

import { appRouter } from "../src/server/index";
import { createCallerFactory } from "../src/server/trpc";

// Mock session context
const mockCtx = {
  session: {
    user: {
      id: "doctor-123",
      role: "doctor",
    },
    expires: new Date().toISOString(),
  },
};

const createCaller = createCallerFactory(appRouter);
const caller = createCaller(mockCtx as any);

async function main() {
  console.log("🚀 Testing Staff API...");

  try {
    // 1. Create Staff (Expected to fail initially as not implemented)
    console.log("👉 Testing createStaff...");
    // @ts-ignore - Ignoring TS error because staff router doesn't exist yet
    await caller.staff.createStaff({
      fullName: "Test Clerk",
      nationalCode: "1234567890",
      phoneNumber: "09123456789",
      role: "clerk",
      password: "password123",
    });
    console.log("✅ createStaff success");
  } catch (e: any) {
    console.error("❌ createStaff failed:", e);
  }

  try {
    // 2. Get My Staff
    console.log("👉 Testing getMyStaff...");
    // @ts-ignore
    const staff = await caller.staff.getMyStaff();
    console.log("✅ getMyStaff success:", staff);
  } catch (e: any) {
    console.error("❌ getMyStaff failed:", e);
  }
}

main();
