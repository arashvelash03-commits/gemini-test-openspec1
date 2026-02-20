import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";
import fs from "fs";
import path from "path";

// Function to load env vars, prioritizing .env.local
function loadEnv() {
  const envLocalPath = path.resolve(process.cwd(), ".env.local");
  const envPath = path.resolve(process.cwd(), ".env");

  if (fs.existsSync(envLocalPath)) {
    dotenv.config({ path: envLocalPath });
  } else {
    dotenv.config({ path: envPath });
  }
}

loadEnv();

// Fallback for migration context if DATABASE_URL is still missing
if (!process.env.DATABASE_URL) {
  const dbUrlPath = path.resolve(process.cwd(), ".db_url_for_migrate");
  if (fs.existsSync(dbUrlPath)) {
    process.env.DATABASE_URL = fs.readFileSync(dbUrlPath, "utf-8").trim();
  }
}

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing");
}

export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
