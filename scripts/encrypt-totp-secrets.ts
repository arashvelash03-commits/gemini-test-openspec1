import { config } from "dotenv";
import path from "path";

// Load .env.local
config({ path: path.resolve(process.cwd(), ".env.local") });
config();

import { db } from "../src/lib/db";
import { users } from "../src/lib/db/schema";
import { encrypt } from "../src/lib/encryption";
import { eq, isNotNull } from "drizzle-orm";

async function main() {
  console.log("Starting TOTP secret encryption migration...");

  // Since we are running outside of next/server, verify DB connection or catch error
  if (!process.env.DATABASE_URL) {
      console.error("DATABASE_URL is missing");
      process.exit(1);
  }

  try {
      const allUsers = await db.query.users.findMany({
        where: isNotNull(users.totpSecret),
      });

      let count = 0;
      for (const user of allUsers) {
        if (!user.totpSecret) continue;

        const parts = user.totpSecret.split(":");
        // Check if already encrypted (IV:Tag:Ciphertext format)
        if (parts.length === 3 && parts[0].length === 32 && parts[1].length === 32) {
          // Already encrypted
          continue;
        }

        console.log(`Encrypting secret for user ${user.id}...`);
        const encrypted = encrypt(user.totpSecret);

        await db.update(users)
          .set({ totpSecret: encrypted })
          .where(eq(users.id, user.id));

        count++;
      }

      console.log(`Migration complete. Encrypted ${count} secrets.`);
      process.exit(0);
  } catch (error) {
      console.error("Error during migration:", error);
      process.exit(1);
  }
}

main();
