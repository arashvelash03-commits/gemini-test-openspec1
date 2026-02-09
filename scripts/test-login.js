
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const path = require('path');

// Load .env.local
const envLocalPath = path.resolve(process.cwd(), '.env.local');
dotenv.config({ path: envLocalPath });
dotenv.config();

async function testLogin() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not defined.');
    process.exit(1);
  }

  const identifier = process.argv[2] || '09123456789';
  const password = process.argv[3] || 'password123';

  console.log(`Testing login for identifier: ${identifier}`);

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    const client = await pool.connect();

    // Manual query to mimic Drizzle
    const res = await client.query(
      `SELECT * FROM users WHERE phone_number = $1 OR national_code = $1`,
      [identifier]
    );

    if (res.rows.length === 0) {
      console.log('❌ User NOT FOUND in database.');
    } else {
      const user = res.rows[0];
      console.log('✅ User FOUND:', {
          id: user.id,
          role: user.role,
          totp_enabled: user.totp_enabled,
          password_hash_prefix: user.password_hash ? user.password_hash.substring(0, 10) + '...' : 'null'
      });

      if (!user.password_hash) {
          console.log('❌ User has no password hash.');
      } else {
          console.log('Verifying password...');
          const match = await bcrypt.compare(password, user.password_hash);
          if (match) {
              console.log('✅ Password MATCHES.');
          } else {
              console.log('❌ Password mismatch.');
          }
      }
    }

    client.release();
  } catch (e) {
    console.error('Error:', e);
  } finally {
    await pool.end();
  }
}

testLogin();
