import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

// Load .env.local first, then fall back to .env if needed (or just load .env.local as requested)
dotenv.config({ path: ".env.local" });
dotenv.config(); // Load .env as fallback

export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
