
const { db } = require('../src/lib/db');
const { users } = require('../src/lib/db/schema');
const bcrypt = require('bcrypt');
require('dotenv').config();

async function seed() {
  const passwordHash = await bcrypt.hash('password123', 10);

  try {
    await db.insert(users).values({
      nationalCode: '1234567890',
      phoneNumber: '09123456789',
      passwordHash: passwordHash,
      role: 'doctor',
      fullName: 'Dr. Test User',
      resourceType: 'Practitioner'
    });
    console.log('Seed user created successfully');
  } catch (e) {
    console.error('Error creating seed user:', e);
  }
}

seed().then(() => process.exit(0));
