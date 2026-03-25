import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clear existing data
  await prisma.user.deleteMany();

  // Hash password for test users
  const hashedPassword = await bcrypt.hash('password123', 10);
  const hashedAdminPassword = await bcrypt.hash('admin123', 10);

  // Create test user
  await prisma.user.create({
    data: {
      email: 'test@example.com',
      password: hashedPassword,
      name: 'Test User',
      role: 'user',
      vipLevel: 2,
      balance: 35640.00,
      sharesHeld: 300,
      integrationPoints: 3240,
      creditPoints: 1000,
      inviteCode: 'TEST123',
      avatarUrl: 'https://i.pravatar.cc/150?u=test',
    },
  });

  // Create admin user
  await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: hashedAdminPassword,
      name: 'Admin User',
      role: 'admin',
      vipLevel: 8,
      balance: 0,
      sharesHeld: 0,
      integrationPoints: 0,
      creditPoints: 0,
      inviteCode: 'ADMIN123',
      avatarUrl: 'https://i.pravatar.cc/150?u=admin',
    },
  });

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
