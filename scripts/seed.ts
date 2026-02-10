import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

async function seed() {
  console.log("Seeding database...");

  const password = "password123";
  const hashedPassword = await bcrypt.hash(password, 10);
  const secret = "KVKFKRCPNZQUYMLXOVYDSQKJKZDTSRLD"; // Known secret for testing

  const usersData = [
    {
      nationalCode: "0000000000",
      phoneNumber: "09120000000",
      role: "admin" as const,
      fullName: "Admin User",
      resourceType: "Practitioner",
      status: "active" as const,
      totpEnabled: false,
    },
    {
      nationalCode: "1111111111",
      phoneNumber: "09121111111",
      role: "doctor" as const,
      fullName: "Doctor No 2FA",
      resourceType: "Practitioner",
      status: "active" as const,
      totpEnabled: false,
    },
    {
      nationalCode: "2222222222",
      phoneNumber: "09122222222",
      role: "doctor" as const,
      fullName: "Doctor With 2FA",
      resourceType: "Practitioner",
      status: "active" as const,
      totpEnabled: true,
      totpSecret: secret,
    },
    {
      nationalCode: "3333333333",
      phoneNumber: "09123333333",
      role: "clerk" as const,
      fullName: "Clerk User",
      resourceType: "Practitioner",
      status: "active" as const,
      totpEnabled: false,
    },
    {
      nationalCode: "4444444444",
      phoneNumber: "09124444444",
      role: "patient" as const,
      fullName: "Patient User",
      resourceType: "Patient",
      status: "active" as const,
      totpEnabled: false,
    },
  ];

  for (const userData of usersData) {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.nationalCode, userData.nationalCode),
    });

    if (!existingUser) {
      console.log(`Creating user: ${userData.fullName} (${userData.role})`);
      await db.insert(users).values({
        ...userData,
        passwordHash: hashedPassword,
      });
    } else {
      console.log(`Updating user: ${userData.fullName} (${userData.role})`);
      await db.update(users)
        .set({
          role: userData.role,
          totpEnabled: userData.totpEnabled,
          totpSecret: userData.totpSecret || null,
          passwordHash: hashedPassword,
        })
        .where(eq(users.nationalCode, userData.nationalCode));
    }
  }

  console.log("Seeding complete.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
