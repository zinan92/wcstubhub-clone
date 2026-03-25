import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clear existing data (in correct order due to foreign keys)
  await prisma.order.deleteMany();
  await prisma.user.deleteMany();
  await prisma.product.deleteMany();
  await prisma.event.deleteMany();
  await prisma.vipTier.deleteMany();

  // Hash password for test users
  const hashedPassword = await bcrypt.hash('password123', 10);
  const hashedAdminPassword = await bcrypt.hash('admin123', 10);

  // Create test user
  const testUser = await prisma.user.create({
    data: {
      email: 'test@example.com',
      phone: '1234567890',
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

  // Create products (sports jerseys)
  const product1 = await prisma.product.create({
    data: {
      name: 'Lionel Messi #10 Argentina Jersey',
      description: 'Official 2022 World Cup Argentina home jersey with Messi #10 print. Made with breathable fabric.',
      imageUrl: 'https://picsum.photos/seed/messi/400/400',
      price: 149.99,
      category: 'Football Jersey',
      stock: 100,
      remainingQty: 85,
    },
  });

  await prisma.product.create({
    data: {
      name: 'Cristiano Ronaldo #7 Portugal Jersey',
      description: 'Portugal national team home jersey with Ronaldo #7. Premium quality material.',
      imageUrl: 'https://picsum.photos/seed/ronaldo/400/400',
      price: 139.99,
      category: 'Football Jersey',
      stock: 120,
      remainingQty: 95,
    },
  });

  await prisma.product.create({
    data: {
      name: 'Neymar Jr #10 Brazil Jersey',
      description: 'Brazil national team classic yellow jersey with Neymar Jr #10. Lightweight and comfortable.',
      imageUrl: 'https://picsum.photos/seed/neymar/400/400',
      price: 129.99,
      category: 'Football Jersey',
      stock: 90,
      remainingQty: 78,
    },
  });

  await prisma.product.create({
    data: {
      name: 'Kylian Mbappé #10 France Jersey',
      description: 'France World Cup champion jersey with Mbappé #10. Official replica with embroidered badge.',
      imageUrl: 'https://picsum.photos/seed/mbappe/400/400',
      price: 159.99,
      category: 'Football Jersey',
      stock: 80,
      remainingQty: 65,
    },
  });

  await prisma.product.create({
    data: {
      name: 'Karim Benzema #9 Real Madrid Jersey',
      description: 'Real Madrid home jersey with Benzema #9. Classic white design with gold details.',
      imageUrl: 'https://picsum.photos/seed/benzema/400/400',
      price: 169.99,
      category: 'Club Jersey',
      stock: 75,
      remainingQty: 60,
    },
  });

  await prisma.product.create({
    data: {
      name: 'Mohamed Salah #11 Liverpool Jersey',
      description: 'Liverpool home jersey with Salah #11. Premier League champions edition.',
      imageUrl: 'https://picsum.photos/seed/salah/400/400',
      price: 154.99,
      category: 'Club Jersey',
      stock: 110,
      remainingQty: 92,
    },
  });

  // Create football matches
  await prisma.event.create({
    data: {
      title: 'Jordan VS Argentina',
      type: 'football',
      team1: 'Jordan',
      team2: 'Argentina',
      team1Flag: '🇯🇴',
      team2Flag: '🇦🇷',
      date: new Date('2026-06-15T18:00:00Z'),
      venue: 'King Abdullah II Stadium, Amman',
      price: 89.99,
      description: 'International friendly match between Jordan and World Cup champions Argentina.',
      remainingQty: 2500,
    },
  });

  await prisma.event.create({
    data: {
      title: 'Algeria VS Austria',
      type: 'football',
      team1: 'Algeria',
      team2: 'Austria',
      team1Flag: '🇩🇿',
      team2Flag: '🇦🇹',
      date: new Date('2026-06-18T20:00:00Z'),
      venue: 'Stade 5 Juillet 1962, Algiers',
      price: 75.00,
      description: 'International friendly between Algeria and Austria national teams.',
      remainingQty: 3200,
    },
  });

  await prisma.event.create({
    data: {
      title: 'Brazil VS Germany',
      type: 'football',
      team1: 'Brazil',
      team2: 'Germany',
      team1Flag: '🇧🇷',
      team2Flag: '🇩🇪',
      date: new Date('2026-07-01T21:00:00Z'),
      venue: 'Maracanã Stadium, Rio de Janeiro',
      price: 120.00,
      description: 'Epic rivalry: Brazil vs Germany. Classic international showdown.',
      remainingQty: 5000,
    },
  });

  await prisma.event.create({
    data: {
      title: 'Spain VS France',
      type: 'football',
      team1: 'Spain',
      team2: 'France',
      team1Flag: '🇪🇸',
      team2Flag: '🇫🇷',
      date: new Date('2026-07-10T19:00:00Z'),
      venue: 'Santiago Bernabéu, Madrid',
      price: 110.00,
      description: 'UEFA Nations League: Spain hosts World Cup champions France.',
      remainingQty: 4200,
    },
  });

  // Create basketball games
  await prisma.event.create({
    data: {
      title: 'Phoenix Suns VS Los Angeles Lakers',
      type: 'basketball',
      team1: 'Phoenix Suns',
      team2: 'Los Angeles Lakers',
      date: new Date('2026-05-20T19:30:00Z'),
      venue: 'Footprint Center, Phoenix',
      price: 145.00,
      description: 'NBA Western Conference clash: Suns take on the Lakers.',
      remainingQty: 1800,
    },
  });

  await prisma.event.create({
    data: {
      title: 'Los Angeles Lakers VS San Antonio Spurs',
      type: 'basketball',
      team1: 'Los Angeles Lakers',
      team2: 'San Antonio Spurs',
      date: new Date('2026-05-25T20:00:00Z'),
      venue: 'Crypto.com Arena, Los Angeles',
      price: 135.00,
      description: 'Lakers host the Spurs in a historic rivalry matchup.',
      remainingQty: 2100,
    },
  });

  await prisma.event.create({
    data: {
      title: 'Golden State Warriors VS Boston Celtics',
      type: 'basketball',
      team1: 'Golden State Warriors',
      team2: 'Boston Celtics',
      date: new Date('2026-06-01T18:00:00Z'),
      venue: 'Chase Center, San Francisco',
      price: 175.00,
      description: 'NBA Finals rematch: Warriors vs Celtics. Championship contenders collide.',
      remainingQty: 1500,
    },
  });

  await prisma.event.create({
    data: {
      title: 'Milwaukee Bucks VS Brooklyn Nets',
      type: 'basketball',
      team1: 'Milwaukee Bucks',
      team2: 'Brooklyn Nets',
      date: new Date('2026-06-05T19:00:00Z'),
      venue: 'Fiserv Forum, Milwaukee',
      price: 155.00,
      description: 'Eastern Conference showdown: Bucks take on the Nets.',
      remainingQty: 1900,
    },
  });

  // Create concert events
  await prisma.event.create({
    data: {
      title: 'Taylor Swift: The Eras Tour',
      type: 'concert',
      artistName: 'Taylor Swift',
      artistImageUrl: 'https://i.pravatar.cc/300?u=taylorswift',
      date: new Date('2026-08-15T20:00:00Z'),
      venue: 'SoFi Stadium, Los Angeles',
      price: 299.99,
      description: 'Taylor Swift brings The Eras Tour to Los Angeles. A journey through her entire discography.',
      remainingQty: 800,
    },
  });

  await prisma.event.create({
    data: {
      title: 'Ed Sheeran: Mathematics Tour',
      type: 'concert',
      artistName: 'Ed Sheeran',
      artistImageUrl: 'https://i.pravatar.cc/300?u=edsheeran',
      date: new Date('2026-08-22T19:30:00Z'),
      venue: 'Wembley Stadium, London',
      price: 189.99,
      description: 'Ed Sheeran performs hits from his Mathematics album series and greatest hits.',
      remainingQty: 1200,
    },
  });

  await prisma.event.create({
    data: {
      title: 'The Weeknd: After Hours Til Dawn',
      type: 'concert',
      artistName: 'The Weeknd',
      artistImageUrl: 'https://i.pravatar.cc/300?u=theweeknd',
      date: new Date('2026-09-05T21:00:00Z'),
      venue: 'MetLife Stadium, New Jersey',
      price: 249.99,
      description: 'The Weeknd performs After Hours and Dawn FM albums with stunning visuals.',
      remainingQty: 950,
    },
  });

  await prisma.event.create({
    data: {
      title: 'Beyoncé: Renaissance World Tour',
      type: 'concert',
      artistName: 'Beyoncé',
      artistImageUrl: 'https://i.pravatar.cc/300?u=beyonce',
      date: new Date('2026-09-12T20:30:00Z'),
      venue: 'Mercedes-Benz Stadium, Atlanta',
      price: 349.99,
      description: 'Queen Bey brings the Renaissance World Tour to Atlanta with spectacular production.',
      remainingQty: 600,
    },
  });

  // Create orders for test user
  await prisma.order.create({
    data: {
      userId: testUser.id,
      itemType: 'product',
      itemId: product1.id,
      itemName: 'Lionel Messi #10 Argentina Jersey',
      itemImageUrl: 'https://picsum.photos/seed/messi/400/400',
      purchasePrice: 149.99,
      currentPrice: 155.00,
      quantity: 2,
      sharesHeld: 150,
      status: 'paid',
      orderNumber: 'ORD-2026-001234',
      transactionTime: new Date('2026-03-10T14:30:00Z'),
    },
  });

  await prisma.order.create({
    data: {
      userId: testUser.id,
      itemType: 'event',
      itemId: 'evt-001',
      itemName: 'Phoenix Suns VS Los Angeles Lakers',
      itemImageUrl: 'https://i.pravatar.cc/400?u=suns-lakers',
      purchasePrice: 145.00,
      currentPrice: 145.00,
      quantity: 1,
      sharesHeld: 150,
      status: 'to_be_paid',
      orderNumber: 'ORD-2026-001235',
      transactionTime: new Date('2026-03-24T10:15:00Z'),
    },
  });

  // Create VIP tiers
  await prisma.vipTier.create({
    data: {
      level: 1,
      name: 'VIP1',
      threshold: 1000.00,
    },
  });

  await prisma.vipTier.create({
    data: {
      level: 2,
      name: 'VIP2',
      threshold: 5000.00,
    },
  });

  await prisma.vipTier.create({
    data: {
      level: 3,
      name: 'VIP3',
      threshold: 10000.00,
    },
  });

  await prisma.vipTier.create({
    data: {
      level: 4,
      name: 'VIP4',
      threshold: 50000.00,
    },
  });

  await prisma.vipTier.create({
    data: {
      level: 5,
      name: 'VIP5',
      threshold: 100000.00,
    },
  });

  await prisma.vipTier.create({
    data: {
      level: 6,
      name: 'VIP6',
      threshold: 500000.00,
    },
  });

  await prisma.vipTier.create({
    data: {
      level: 7,
      name: 'VIP7',
      threshold: 1000000.00,
    },
  });

  await prisma.vipTier.create({
    data: {
      level: 8,
      name: 'VIP8',
      threshold: 10000000.00,
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
