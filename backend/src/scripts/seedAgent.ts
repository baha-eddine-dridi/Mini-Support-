import bcrypt from 'bcryptjs';
import { connectDatabase } from '../config/database.js';
import { User } from '../models/User.js';

async function seed(): Promise<void> {
  await connectDatabase();
  const email = 'agent@minisupport.local';
  const passwordHash = await bcrypt.hash('Agent123!', 12);
  await User.findOneAndUpdate(
    { email },
    { name: 'Support Agent', email, passwordHash, role: 'agent' },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  console.log(`Agent ready: ${email} / Agent123!`);
  process.exit(0);
}

void seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
