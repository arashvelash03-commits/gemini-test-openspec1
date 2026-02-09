
const { Pool } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

// Load .env.local
const envLocalPath = path.resolve(process.cwd(), '.env.local');
dotenv.config({ path: envLocalPath });
dotenv.config(); // Fallback

async function debug() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not defined.');
    process.exit(1);
  }

  console.log('Connecting to database...');
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    const client = await pool.connect();
    console.log('Connected successfully.');

    console.log('Checking for "users" table...');
    const res = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
    `);

    console.log('Tables in public schema:');
    if (res.rows.length === 0) {
        console.log('  (None)');
    } else {
        res.rows.forEach(row => console.log(`  - ${row.table_name}`));
    }

    const usersTable = res.rows.find(row => row.table_name === 'users');
    if (usersTable) {
        console.log('✅ "users" table FOUND.');
    } else {
        console.error('❌ "users" table NOT FOUND.');
    }

    client.release();
  } catch (e) {
    console.error('Connection error:', e);
  } finally {
    await pool.end();
  }
}

debug();
