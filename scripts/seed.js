
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

async function seed() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not defined');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const passwordHash = await bcrypt.hash('password123', 10);

  // UUID generation in SQL if pgcrypto/uuid-ossp is not available or handled by defaultRandom()
  // But standard postgres usually needs `gen_random_uuid()` (v13+) or extension.
  // We'll rely on the default value if we can, or generate one in JS.
  // Ideally, we just INSERT and let the default handle it.

  const client = await pool.connect();

  try {
    // Check if user exists
    const res = await client.query(
        'SELECT id FROM users WHERE national_code = $1',
        ['1234567890']
    );

    if (res.rows.length > 0) {
        console.log('Seed user already exists');
    } else {
        await client.query(`
            INSERT INTO users (
                national_code,
                phone_number,
                password_hash,
                role,
                full_name,
                resource_type
            ) VALUES ($1, $2, $3, $4, $5, $6)
        `, [
            '1234567890',
            '09123456789',
            passwordHash,
            'doctor',
            'Dr. Test User',
            'Practitioner'
        ]);
        console.log('Seed user created successfully');
    }
  } catch (e) {
    console.error('Error creating seed user:', e);
  } finally {
    client.release();
    await pool.end();
  }
}

seed().then(() => process.exit(0));
