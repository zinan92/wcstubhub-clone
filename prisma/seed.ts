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
      avatarUrl: '',
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
      avatarUrl: '',
    },
  });

  // Create products (FIFA World Cup 2026 jerseys)
  const product1 = await prisma.product.create({
    data: {
      name: 'Argentina Home Jersey 2026',
      description: 'Official FIFA World Cup 2026 Argentina national team home jersey. Iconic blue and white stripes with AFA badge.',
      imageUrl: 'https://flagcdn.com/w640/ar.png',
      price: 29.99,
      category: 'Football Jersey',
      stock: 100,
      remainingQty: 85,
      isVerified: true,
      isBuyerProtected: true,
      hasSecureDelivery: true,
    },
  });

  await prisma.product.create({
    data: {
      name: 'Germany Away Kit 2026',
      description: 'Germany national team FIFA World Cup 2026 away jersey. Modern design with DFB crest.',
      imageUrl: 'https://flagcdn.com/w640/de.png',
      price: 27.99,
      category: 'Football Jersey',
      stock: 120,
      remainingQty: 95,
      isVerified: false,
      isBuyerProtected: true,
      hasSecureDelivery: false,
    },
  });

  await prisma.product.create({
    data: {
      name: 'Brazil Home Jersey 2026',
      description: 'Brazil FIFA World Cup 2026 home jersey. Classic yellow with green details and CBF badge.',
      imageUrl: 'https://flagcdn.com/w640/br.png',
      price: 32.99,
      category: 'Football Jersey',
      stock: 90,
      remainingQty: 78,
      isVerified: true,
      isBuyerProtected: true,
      hasSecureDelivery: false,
    },
  });

  await prisma.product.create({
    data: {
      name: 'France National Team #10 Jersey 2026',
      description: 'France FIFA World Cup 2026 jersey. Defending champions kit with FFF badge and number 10.',
      imageUrl: 'https://flagcdn.com/w640/fr.png',
      price: 34.99,
      category: 'Football Jersey',
      stock: 80,
      remainingQty: 65,
      isVerified: true,
      isBuyerProtected: true,
      hasSecureDelivery: true,
    },
  });

  await prisma.product.create({
    data: {
      name: 'USA National Team Jersey 2026',
      description: 'USA FIFA World Cup 2026 host nation jersey. Stars and stripes design with USSF crest.',
      imageUrl: 'https://flagcdn.com/w640/us.png',
      price: 28.99,
      category: 'Football Jersey',
      stock: 75,
      remainingQty: 60,
      isVerified: false,
      isBuyerProtected: true,
      hasSecureDelivery: true,
    },
  });

  await prisma.product.create({
    data: {
      name: 'Spain Home Kit 2026',
      description: 'Spain national team FIFA World Cup 2026 home kit. Red jersey with RFEF badge.',
      imageUrl: 'https://flagcdn.com/w640/es.png',
      price: 31.99,
      category: 'Football Jersey',
      stock: 110,
      remainingQty: 92,
      isVerified: true,
      isBuyerProtected: true,
      hasSecureDelivery: false,
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
      isOfficial: true,
      isBuyerProtected: true,
      hasSecureDelivery: true,
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
      isOfficial: false,
      isBuyerProtected: true,
      hasSecureDelivery: false,
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
      isOfficial: true,
      isBuyerProtected: true,
      hasSecureDelivery: true,
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
      isOfficial: true,
      isBuyerProtected: true,
      hasSecureDelivery: false,
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
      isOfficial: true,
      isBuyerProtected: true,
      hasSecureDelivery: true,
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
      isOfficial: false,
      isBuyerProtected: true,
      hasSecureDelivery: true,
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
      isOfficial: true,
      isBuyerProtected: true,
      hasSecureDelivery: false,
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
      isOfficial: false,
      isBuyerProtected: true,
      hasSecureDelivery: false,
    },
  });

  // Create concert events
  await prisma.event.create({
    data: {
      title: 'Taylor Swift: The Eras Tour',
      type: 'concert',
      artistName: 'Taylor Swift',
      artistImageUrl: '',
      date: new Date('2026-08-15T20:00:00Z'),
      venue: 'SoFi Stadium, Los Angeles',
      price: 299.99,
      description: 'Taylor Swift brings The Eras Tour to Los Angeles. A journey through her entire discography.',
      remainingQty: 800,
      isOfficial: true,
      isBuyerProtected: true,
      hasSecureDelivery: true,
    },
  });

  await prisma.event.create({
    data: {
      title: 'Ed Sheeran: Mathematics Tour',
      type: 'concert',
      artistName: 'Ed Sheeran',
      artistImageUrl: '',
      date: new Date('2026-08-22T19:30:00Z'),
      venue: 'Wembley Stadium, London',
      price: 189.99,
      description: 'Ed Sheeran performs hits from his Mathematics album series and greatest hits.',
      remainingQty: 1200,
      isOfficial: true,
      isBuyerProtected: true,
      hasSecureDelivery: false,
    },
  });

  await prisma.event.create({
    data: {
      title: 'The Weeknd: After Hours Til Dawn',
      type: 'concert',
      artistName: 'The Weeknd',
      artistImageUrl: '',
      date: new Date('2026-09-05T21:00:00Z'),
      venue: 'MetLife Stadium, New Jersey',
      price: 249.99,
      description: 'The Weeknd performs After Hours and Dawn FM albums with stunning visuals.',
      remainingQty: 950,
      isOfficial: false,
      isBuyerProtected: true,
      hasSecureDelivery: true,
    },
  });

  await prisma.event.create({
    data: {
      title: 'Beyoncé: Renaissance World Tour',
      type: 'concert',
      artistName: 'Beyoncé',
      artistImageUrl: '',
      date: new Date('2026-09-12T20:30:00Z'),
      venue: 'Mercedes-Benz Stadium, Atlanta',
      price: 349.99,
      description: 'Queen Bey brings the Renaissance World Tour to Atlanta with spectacular production.',
      remainingQty: 600,
      isOfficial: true,
      isBuyerProtected: true,
      hasSecureDelivery: false,
    },
  });

  // Create orders for test user
  await prisma.order.create({
    data: {
      userId: testUser.id,
      itemType: 'product',
      itemId: product1.id,
      itemName: 'Argentina Home Jersey 2026',
      itemImageUrl: 'https://flagcdn.com/w640/ar.png',
      purchasePrice: 29.99,
      currentPrice: 32.00,
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
      itemImageUrl: '',
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
