
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
import { db } from "../src/lib/db";
import { users } from "../src/lib/db/schema";
import { eq } from "drizzle-orm";

async function main() {
  console.log("🚀 Testing Staff API...");

  // 1. Setup Context (Find or Create Doctor)
  let doctorId = "doctor-test-script";
  try {
      const existingDoctor = await db.query.users.findFirst({
          where: eq(users.role, 'doctor'),
      });

      if (existingDoctor) {
          doctorId = existingDoctor.id;
          console.log(`Using existing doctor: ${doctorId}`);
      } else {
          console.warn("⚠️ No doctor found. Using fake ID. Tests needing FK might fail.");
      }
  } catch (e) {
      console.error("Failed to query doctor:", e);
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

  const createCaller = createCallerFactory(appRouter);
  const caller = createCaller(mockCtx as any);

  const testSuffix = Math.floor(Math.random() * 100000);
  const nationalCode = `999${String(testSuffix).padStart(7, '0')}`;
  const phoneNumber = `0999${String(testSuffix).padStart(7, '0')}`;

  let createdStaffId: string | null = null;

  try {
    // 2. Create Staff
    console.log(`👉 Testing createStaff (NC: ${nationalCode})...`);
    await caller.staff.createStaff({
      fullName: `Test Clerk ${testSuffix}`,
      nationalCode: nationalCode,
      phoneNumber: phoneNumber,
      role: "clerk",
      password: "password123",
      gender: "female",
      birthDate: "1990-01-01",
    });
    console.log("✅ createStaff success");

    // 3. Get My Staff and verify
    console.log("👉 Testing getMyStaff...");
    const staffList = await caller.staff.getMyStaff();
    const createdStaff = staffList.find(s => s.nationalCode === nationalCode);

    if (createdStaff) {
        console.log("✅ Staff found in list:", createdStaff.fullName);
        createdStaffId = createdStaff.id;

        // Verify gender and birthDate
        if (createdStaff.gender === 'female' && createdStaff.birthDate === '1990-01-01') {
             console.log("✅ Gender and BirthDate persisted correctly");
        } else {
             console.error("❌ Gender/BirthDate mismatch:", createdStaff);
        }

    } else {
        console.error("❌ Created staff not found in list!");
        // We can't proceed with update tests if creation failed validation
        process.exit(1);
    }

  } catch (e: any) {
    console.error("❌ createStaff/getMyStaff failed:", e);
    process.exit(1);
  }

  if (createdStaffId) {
      try {
          // 4. Update Staff
          console.log("👉 Testing updateStaff...");
          const newName = `Updated Clerk ${testSuffix}`;
          const newGender = "male";

          await caller.staff.updateStaff({
              id: createdStaffId,
              fullName: newName,
              nationalCode: nationalCode, // Keep same
              phoneNumber: phoneNumber, // Keep same
              gender: newGender,
              // Update password optionally
              password: "newpassword123"
          });
          console.log("✅ updateStaff success");

          // Verify update
          const staffList = await caller.staff.getMyStaff();
          const updatedStaff = staffList.find(s => s.id === createdStaffId);
          if (updatedStaff) {
             if (updatedStaff.fullName === newName && updatedStaff.gender === newGender) {
                console.log("✅ Staff updated correctly");
             } else {
                console.error("❌ Staff update verification failed:", updatedStaff);
             }
          }

      } catch (e: any) {
          console.error("❌ updateStaff failed:", e);
      }

      try {
          // 5. Toggle Status
          console.log("👉 Testing toggleStaffStatus...");
          // Initial status is active
          await caller.staff.toggleStaffStatus({ id: createdStaffId });
          console.log("✅ Toggled to inactive");

          let staffList = await caller.staff.getMyStaff();
          let toggledStaff = staffList.find(s => s.id === createdStaffId);

          if (toggledStaff && toggledStaff.status === 'inactive') {
               console.log("✅ Staff deactivated successfully (status: inactive)");
          } else {
               console.error("❌ Staff deactivation failed. Status:", toggledStaff?.status);
          }

          // Toggle back
          await caller.staff.toggleStaffStatus({ id: createdStaffId });
          console.log("✅ Toggled back to active");

          staffList = await caller.staff.getMyStaff();
          toggledStaff = staffList.find(s => s.id === createdStaffId);

          if (toggledStaff && toggledStaff.status === 'active') {
               console.log("✅ Staff reactivated successfully (status: active)");
          } else {
               console.error("❌ Staff reactivation failed. Status:", toggledStaff?.status);
          }

      } catch (e: any) {
           console.error("❌ toggleStaffStatus failed:", e);
      }
  }

  console.log("🏁 Test script finished.");
  process.exit(0);
}

main();
