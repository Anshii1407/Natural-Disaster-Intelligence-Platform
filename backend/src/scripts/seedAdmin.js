import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDatabase, { getDatabaseStatus } from '../config/db.js';
import User from '../models/User.js';

dotenv.config();

const seedAdmin = async () => {
  const email = (process.argv[2] || process.env.SEED_ADMIN_EMAIL || '').trim().toLowerCase();
  const password = process.argv[3] || process.env.SEED_ADMIN_PASSWORD || '';
  const name = (process.argv[4] || process.env.SEED_ADMIN_NAME || 'National Disaster Authority Admin').trim();

  console.log('=== NDIP Admin Provisioning Script ===');

  if (!email || !password) {
    console.error('[Error] Missing required admin credentials.');
    console.log('Usage:');
    console.log('  node src/scripts/seedAdmin.js <email> <password> [name]');
    console.log('Or configure in your local .env:');
    console.log('  SEED_ADMIN_EMAIL=admin@ndip.gov');
    console.log('  SEED_ADMIN_PASSWORD=your_secure_password');
    process.exit(1);
  }

  if (password.length < 8) {
    console.error('[Error] Admin password must be at least 8 characters long for security compliance.');
    process.exit(1);
  }

  console.log(`[Database] Attempting connection to MongoDB Atlas...`);
  const connected = await connectDatabase();
  const dbStatus = getDatabaseStatus();

  if (!connected || !dbStatus.isConnected) {
    console.error('[Database Error] Could not establish connection to MongoDB Atlas.');
    console.error('Admin provisioning requires a live, accessible database.');
    process.exit(1);
  }

  try {
    const existing = await User.findOne({ email });

    if (existing) {
      if (existing.role === 'ADMIN') {
        console.log(`[Seed Info] Admin user already exists for "${email}". Updating password...`);
        existing.password = password;
        if (name) existing.name = name;
        await existing.save();
        console.log(`[Seed Success] Admin account password successfully updated for: ${email}`);
      } else {
        console.log(`[Seed Info] Existing user found with role "${existing.role}". Promoting to ADMIN...`);
        existing.role = 'ADMIN';
        existing.password = password;
        if (name) existing.name = name;
        await existing.save();
        console.log(`[Seed Success] User account promoted to ADMIN for: ${email}`);
      }
    } else {
      const newAdmin = await User.create({
        name,
        email,
        password,
        role: 'ADMIN',
      });
      console.log(`[Seed Success] New ADMIN account created successfully.`);
      console.log(`  ID:    ${newAdmin._id}`);
      console.log(`  Name:  ${newAdmin.name}`);
      console.log(`  Email: ${newAdmin.email}`);
      console.log(`  Role:  ${newAdmin.role}`);
    }
  } catch (error) {
    console.error(`[Seed Error] Failed to provision admin: ${error.message}`);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('[Database] Disconnected cleanly.');
  }

  process.exit(0);
};

seedAdmin();
