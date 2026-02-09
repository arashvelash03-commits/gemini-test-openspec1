
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const path = require('path');

// Explicitly load .env.local from the project root
const envLocalPath = path.resolve(process.cwd(), '.env.local');
const resultLocal = dotenv.config({ path: envLocalPath });

if (resultLocal.error) {
  // .env.local not found, try .env
  dotenv.config();
}

async function seed() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not defined. Please check your .env.local or .env file.');
    console.log('Current working directory:', process.cwd());
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const passwordHash = await bcrypt.hash('password123', 10);

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
                resource_type,
                totp_enabled,
                fhir_data
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `, [
            '1234567890',
            '09123456789',
            passwordHash,
            'doctor',
            'Dr. Test User',
            'Practitioner',
            false,
            '{}'
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
