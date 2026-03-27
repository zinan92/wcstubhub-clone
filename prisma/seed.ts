import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clear existing data (in correct order due to foreign keys)
  await prisma.listing.deleteMany();
  await prisma.ownedAsset.deleteMany();
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

  // Create products (FIFA World Cup 2026 jerseys + accessories)
  // Use stable IDs for validation testing reliability
  // STABLE PRODUCTS (6 - must preserve)
  const product1 = await prisma.product.create({
    data: {
      id: 'product-stable-001',
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
      isBestValue: true,
      isSellingFast: false,
      urgencyThreshold: 10,
    },
  });

  await prisma.product.create({
    data: {
      id: 'product-stable-002',
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
      isBestValue: false,
      isSellingFast: true,
      urgencyThreshold: 15,
    },
  });

  await prisma.product.create({
    data: {
      id: 'product-stable-003',
      name: 'Brazil Home Jersey 2026',
      description: 'Brazil FIFA World Cup 2026 home jersey. Classic yellow with green details and CBF badge.',
      imageUrl: 'https://flagcdn.com/w640/br.png',
      price: 32.99,
      category: 'Football Jersey',
      stock: 90,
      remainingQty: 7,
      isVerified: true,
      isBuyerProtected: true,
      hasSecureDelivery: false,
      isBestValue: false,
      isSellingFast: false,
      urgencyThreshold: 10,
    },
  });

  await prisma.product.create({
    data: {
      id: 'product-stable-004',
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
      isBestValue: false,
      isSellingFast: true,
      urgencyThreshold: 20,
    },
  });

  await prisma.product.create({
    data: {
      id: 'product-stable-005',
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
      isBestValue: true,
      isSellingFast: false,
      urgencyThreshold: 12,
    },
  });

  await prisma.product.create({
    data: {
      id: 'product-stable-006',
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
      isBestValue: false,
      isSellingFast: false,
      urgencyThreshold: 15,
    },
  });

  // NEW PRODUCTS (24 additional to reach 30+)
  // Jerseys (8 more)
  await prisma.product.create({
    data: {
      name: 'Italy Away Jersey 2026',
      description: 'Italy national team FIFA World Cup 2026 away jersey. Stylish white design with FIGC badge.',
      imageUrl: 'https://flagcdn.com/w640/it.png',
      price: 29.99,
      category: 'Football Jersey',
      stock: 85,
      remainingQty: 70,
      isVerified: true,
      isBuyerProtected: true,
      hasSecureDelivery: true,
      isBestValue: false,
      isSellingFast: false,
      urgencyThreshold: 10,
    },
  });

  await prisma.product.create({
    data: {
      name: 'England Home Jersey 2026',
      description: 'England national team FIFA World Cup 2026 home jersey. Classic white with Three Lions crest.',
      imageUrl: 'https://flagcdn.com/w640/gb-eng.png',
      price: 33.99,
      category: 'Football Jersey',
      stock: 95,
      remainingQty: 80,
      isVerified: true,
      isBuyerProtected: true,
      hasSecureDelivery: false,
      isBestValue: true,
      isSellingFast: true,
      urgencyThreshold: 15,
    },
  });

  await prisma.product.create({
    data: {
      name: 'Portugal Home Jersey 2026',
      description: 'Portugal national team FIFA World Cup 2026 home jersey. Deep red with FPF badge.',
      imageUrl: 'https://flagcdn.com/w640/pt.png',
      price: 35.99,
      category: 'Football Jersey',
      stock: 70,
      remainingQty: 55,
      isVerified: false,
      isBuyerProtected: true,
      hasSecureDelivery: true,
      isBestValue: false,
      isSellingFast: true,
      urgencyThreshold: 12,
    },
  });

  await prisma.product.create({
    data: {
      name: 'Netherlands Away Kit 2026',
      description: 'Netherlands national team FIFA World Cup 2026 away jersey. Classic orange with KNVB crest.',
      imageUrl: 'https://flagcdn.com/w640/nl.png',
      price: 30.99,
      category: 'Football Jersey',
      stock: 80,
      remainingQty: 65,
      isVerified: true,
      isBuyerProtected: true,
      hasSecureDelivery: false,
      isBestValue: false,
      isSellingFast: false,
      urgencyThreshold: 10,
    },
  });

  await prisma.product.create({
    data: {
      name: 'Belgium Home Jersey 2026',
      description: 'Belgium national team FIFA World Cup 2026 home jersey. Red devils design with KBVB badge.',
      imageUrl: 'https://flagcdn.com/w640/be.png',
      price: 28.99,
      category: 'Football Jersey',
      stock: 90,
      remainingQty: 75,
      isVerified: true,
      isBuyerProtected: true,
      hasSecureDelivery: true,
      isBestValue: true,
      isSellingFast: false,
      urgencyThreshold: 15,
    },
  });

  await prisma.product.create({
    data: {
      name: 'Croatia Home Jersey 2026',
      description: 'Croatia national team FIFA World Cup 2026 home jersey. Iconic checkered pattern with HNS badge.',
      imageUrl: 'https://flagcdn.com/w640/hr.png',
      price: 31.99,
      category: 'Football Jersey',
      stock: 75,
      remainingQty: 60,
      isVerified: false,
      isBuyerProtected: true,
      hasSecureDelivery: false,
      isBestValue: false,
      isSellingFast: true,
      urgencyThreshold: 10,
    },
  });

  await prisma.product.create({
    data: {
      name: 'Mexico Home Jersey 2026',
      description: 'Mexico national team FIFA World Cup 2026 home jersey. Green with FMF badge.',
      imageUrl: 'https://flagcdn.com/w640/mx.png',
      price: 29.99,
      category: 'Football Jersey',
      stock: 85,
      remainingQty: 70,
      isVerified: true,
      isBuyerProtected: true,
      hasSecureDelivery: true,
      isBestValue: false,
      isSellingFast: false,
      urgencyThreshold: 12,
    },
  });

  await prisma.product.create({
    data: {
      name: 'Japan Away Kit 2026',
      description: 'Japan national team FIFA World Cup 2026 away jersey. Samurai blue with JFA badge.',
      imageUrl: 'https://flagcdn.com/w640/jp.png',
      price: 32.99,
      category: 'Football Jersey',
      stock: 65,
      remainingQty: 50,
      isVerified: true,
      isBuyerProtected: true,
      hasSecureDelivery: false,
      isBestValue: false,
      isSellingFast: true,
      urgencyThreshold: 8,
    },
  });

  // Scarves (6) - using unique country codes
  await prisma.product.create({
    data: {
      name: 'Poland Fan Scarf',
      description: 'Official Poland national team scarf. White and red with PZPN logo.',
      imageUrl: 'https://flagcdn.com/w640/pl.png',
      price: 15.99,
      category: 'Scarf',
      stock: 120,
      remainingQty: 100,
      isVerified: true,
      isBuyerProtected: true,
      hasSecureDelivery: false,
      isBestValue: true,
      isSellingFast: false,
      urgencyThreshold: 20,
    },
  });

  await prisma.product.create({
    data: {
      name: 'Sweden Fan Scarf',
      description: 'Official Sweden national team scarf. Blue and yellow with SvFF logo.',
      imageUrl: 'https://flagcdn.com/w640/se.png',
      price: 15.99,
      category: 'Scarf',
      stock: 110,
      remainingQty: 95,
      isVerified: true,
      isBuyerProtected: true,
      hasSecureDelivery: false,
      isBestValue: true,
      isSellingFast: true,
      urgencyThreshold: 20,
    },
  });

  await prisma.product.create({
    data: {
      name: 'Turkey Fan Scarf',
      description: 'Official Turkey national team scarf. Red and white with TFF logo.',
      imageUrl: 'https://flagcdn.com/w640/tr.png',
      price: 15.99,
      category: 'Scarf',
      stock: 100,
      remainingQty: 85,
      isVerified: false,
      isBuyerProtected: true,
      hasSecureDelivery: false,
      isBestValue: false,
      isSellingFast: false,
      urgencyThreshold: 18,
    },
  });

  await prisma.product.create({
    data: {
      name: 'South Korea Fan Scarf',
      description: 'Official South Korea national team scarf. Red with KFA logo.',
      imageUrl: 'https://flagcdn.com/w640/kr.png',
      price: 15.99,
      category: 'Scarf',
      stock: 95,
      remainingQty: 80,
      isVerified: true,
      isBuyerProtected: true,
      hasSecureDelivery: true,
      isBestValue: true,
      isSellingFast: false,
      urgencyThreshold: 20,
    },
  });

  await prisma.product.create({
    data: {
      name: 'Uruguay Fan Scarf',
      description: 'Official Uruguay national team scarf. Sky blue with AUF logo.',
      imageUrl: 'https://flagcdn.com/w640/uy.png',
      price: 15.99,
      category: 'Scarf',
      stock: 105,
      remainingQty: 90,
      isVerified: true,
      isBuyerProtected: true,
      hasSecureDelivery: false,
      isBestValue: false,
      isSellingFast: true,
      urgencyThreshold: 22,
    },
  });

  await prisma.product.create({
    data: {
      name: 'Colombia Fan Scarf',
      description: 'Official Colombia national team scarf. Yellow, blue, and red with FCF logo.',
      imageUrl: 'https://flagcdn.com/w640/co.png',
      price: 15.99,
      category: 'Scarf',
      stock: 98,
      remainingQty: 85,
      isVerified: true,
      isBuyerProtected: true,
      hasSecureDelivery: false,
      isBestValue: true,
      isSellingFast: false,
      urgencyThreshold: 20,
    },
  });

  // Caps (4) - using unique country codes
  await prisma.product.create({
    data: {
      name: 'Denmark Team Cap',
      description: 'Denmark national team baseball cap. Red with DBU badge.',
      imageUrl: 'https://flagcdn.com/w640/dk.png',
      price: 24.99,
      category: 'Cap',
      stock: 150,
      remainingQty: 130,
      isVerified: true,
      isBuyerProtected: true,
      hasSecureDelivery: true,
      isBestValue: false,
      isSellingFast: false,
      urgencyThreshold: 30,
    },
  });

  await prisma.product.create({
    data: {
      name: 'Switzerland Team Cap',
      description: 'Switzerland national team baseball cap. Red with SFV badge.',
      imageUrl: 'https://flagcdn.com/w640/ch.png',
      price: 19.99,
      category: 'Cap',
      stock: 120,
      remainingQty: 105,
      isVerified: true,
      isBuyerProtected: true,
      hasSecureDelivery: false,
      isBestValue: true,
      isSellingFast: true,
      urgencyThreshold: 25,
    },
  });

  await prisma.product.create({
    data: {
      name: 'Norway Team Cap',
      description: 'Norway national team baseball cap. Red with NFF badge.',
      imageUrl: 'https://flagcdn.com/w640/no.png',
      price: 19.99,
      category: 'Cap',
      stock: 115,
      remainingQty: 100,
      isVerified: false,
      isBuyerProtected: true,
      hasSecureDelivery: false,
      isBestValue: false,
      isSellingFast: false,
      urgencyThreshold: 20,
    },
  });

  await prisma.product.create({
    data: {
      name: 'Australia Team Cap',
      description: 'Australia national team baseball cap. Gold with FA badge.',
      imageUrl: 'https://flagcdn.com/w640/au.png',
      price: 19.99,
      category: 'Cap',
      stock: 110,
      remainingQty: 95,
      isVerified: true,
      isBuyerProtected: true,
      hasSecureDelivery: false,
      isBestValue: true,
      isSellingFast: false,
      urgencyThreshold: 22,
    },
  });

  // Memorabilia (3) - using unique country codes
  await prisma.product.create({
    data: {
      name: 'Canada Team Match Ball',
      description: 'Canada national team official match ball replica. Premium quality, size 5.',
      imageUrl: 'https://flagcdn.com/w640/ca.png',
      price: 49.99,
      category: 'Memorabilia',
      stock: 60,
      remainingQty: 45,
      isVerified: true,
      isBuyerProtected: true,
      hasSecureDelivery: true,
      isBestValue: false,
      isSellingFast: true,
      urgencyThreshold: 10,
    },
  });

  await prisma.product.create({
    data: {
      name: 'Greece Championship Pin Set',
      description: 'Collectible pin set celebrating Greece\'s Euro 2004 victory. Limited edition.',
      imageUrl: 'https://flagcdn.com/w640/gr.png',
      price: 12.99,
      category: 'Memorabilia',
      stock: 200,
      remainingQty: 180,
      isVerified: false,
      isBuyerProtected: true,
      hasSecureDelivery: false,
      isBestValue: false,
      isSellingFast: false,
      urgencyThreshold: 40,
    },
  });

  await prisma.product.create({
    data: {
      name: 'Chile Legend Poster Collection',
      description: 'Premium poster set featuring Chile football legends. High-quality prints.',
      imageUrl: 'https://flagcdn.com/w640/cl.png',
      price: 22.99,
      category: 'Memorabilia',
      stock: 80,
      remainingQty: 70,
      isVerified: true,
      isBuyerProtected: true,
      hasSecureDelivery: false,
      isBestValue: false,
      isSellingFast: false,
      urgencyThreshold: 15,
    },
  });

  // Accessories (3) - using unique country codes
  await prisma.product.create({
    data: {
      name: 'Nigeria Team Water Bottle',
      description: 'Nigeria national team insulated water bottle. 750ml capacity.',
      imageUrl: 'https://flagcdn.com/w640/ng.png',
      price: 18.99,
      category: 'Accessories',
      stock: 140,
      remainingQty: 120,
      isVerified: true,
      isBuyerProtected: true,
      hasSecureDelivery: false,
      isBestValue: true,
      isSellingFast: false,
      urgencyThreshold: 28,
    },
  });

  await prisma.product.create({
    data: {
      name: 'Egypt Team Badge Keychain Set',
      description: 'Metal keychain set featuring Egypt national team badge. Collectible quality.',
      imageUrl: 'https://flagcdn.com/w640/eg.png',
      price: 14.99,
      category: 'Accessories',
      stock: 180,
      remainingQty: 160,
      isVerified: true,
      isBuyerProtected: true,
      hasSecureDelivery: false,
      isBestValue: false,
      isSellingFast: true,
      urgencyThreshold: 35,
    },
  });

  await prisma.product.create({
    data: {
      name: 'Morocco Football Fan Face Paint Kit',
      description: 'Professional face paint kit in Morocco team colors. Safe, non-toxic.',
      imageUrl: 'https://flagcdn.com/w640/ma.png',
      price: 9.99,
      category: 'Accessories',
      stock: 220,
      remainingQty: 200,
      isVerified: false,
      isBuyerProtected: true,
      hasSecureDelivery: false,
      isBestValue: false,
      isSellingFast: false,
      urgencyThreshold: 45,
    },
  });

  // Create football matches
  // Use stable IDs for validation testing reliability
  // STABLE FOOTBALL EVENTS (4 - must preserve)
  await prisma.event.create({
    data: {
      id: 'event-stable-001',
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
      isBestValue: false,
      isSellingFast: true,
      urgencyThreshold: 500,
    },
  });

  await prisma.event.create({
    data: {
      id: 'event-stable-002',
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
      isBestValue: true,
      isSellingFast: false,
      urgencyThreshold: 600,
    },
  });

  await prisma.event.create({
    data: {
      id: 'event-stable-003',
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
      remainingQty: 320,
      isOfficial: true,
      isBuyerProtected: true,
      hasSecureDelivery: true,
      isBestValue: false,
      isSellingFast: false,
      urgencyThreshold: 500,
    },
  });

  await prisma.event.create({
    data: {
      id: 'event-stable-004',
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
      isBestValue: false,
      isSellingFast: true,
      urgencyThreshold: 800,
    },
  });

  // NEW FOOTBALL EVENTS (10 more to reach 14 total)
  await prisma.event.create({
    data: {
      title: 'England VS Italy',
      type: 'football',
      team1: 'England',
      team2: 'Italy',
      team1Flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
      team2Flag: '🇮🇹',
      date: new Date('2026-06-20T19:00:00Z'),
      venue: 'Wembley Stadium, London',
      price: 95.00,
      description: 'UEFA Nations League clash between England and Italy.',
      remainingQty: 2800,
      isOfficial: true,
      isBuyerProtected: true,
      hasSecureDelivery: true,
      isBestValue: true,
      isSellingFast: false,
      urgencyThreshold: 550,
    },
  });

  await prisma.event.create({
    data: {
      title: 'Portugal VS Netherlands',
      type: 'football',
      team1: 'Portugal',
      team2: 'Netherlands',
      team1Flag: '🇵🇹',
      team2Flag: '🇳🇱',
      date: new Date('2026-06-22T20:30:00Z'),
      venue: 'Estádio da Luz, Lisbon',
      price: 105.00,
      description: 'International friendly featuring Portugal and Netherlands.',
      remainingQty: 1900,
      isOfficial: true,
      isBuyerProtected: true,
      hasSecureDelivery: false,
      isBestValue: false,
      isSellingFast: true,
      urgencyThreshold: 400,
    },
  });

  await prisma.event.create({
    data: {
      title: 'Belgium VS Croatia',
      type: 'football',
      team1: 'Belgium',
      team2: 'Croatia',
      team1Flag: '🇧🇪',
      team2Flag: '🇭🇷',
      date: new Date('2026-06-25T18:30:00Z'),
      venue: 'King Baudouin Stadium, Brussels',
      price: 82.00,
      description: 'UEFA Nations League: Belgium hosts Croatia.',
      remainingQty: 3100,
      isOfficial: false,
      isBuyerProtected: true,
      hasSecureDelivery: true,
      isBestValue: false,
      isSellingFast: false,
      urgencyThreshold: 620,
    },
  });

  await prisma.event.create({
    data: {
      title: 'USA VS Mexico',
      type: 'football',
      team1: 'USA',
      team2: 'Mexico',
      team1Flag: '🇺🇸',
      team2Flag: '🇲🇽',
      date: new Date('2026-06-28T21:00:00Z'),
      venue: 'MetLife Stadium, New Jersey',
      price: 98.00,
      description: 'CONCACAF Gold Cup: Historic rivalry between USA and Mexico.',
      remainingQty: 2400,
      isOfficial: true,
      isBuyerProtected: true,
      hasSecureDelivery: true,
      isBestValue: true,
      isSellingFast: true,
      urgencyThreshold: 480,
    },
  });

  await prisma.event.create({
    data: {
      title: 'Argentina VS Uruguay',
      type: 'football',
      team1: 'Argentina',
      team2: 'Uruguay',
      team1Flag: '🇦🇷',
      team2Flag: '🇺🇾',
      date: new Date('2026-07-05T19:30:00Z'),
      venue: 'La Bombonera, Buenos Aires',
      price: 115.00,
      description: 'Copa America qualifier: Argentina vs Uruguay in Buenos Aires.',
      remainingQty: 1500,
      isOfficial: true,
      isBuyerProtected: true,
      hasSecureDelivery: false,
      isBestValue: false,
      isSellingFast: true,
      urgencyThreshold: 300,
    },
  });

  await prisma.event.create({
    data: {
      title: 'Japan VS South Korea',
      type: 'football',
      team1: 'Japan',
      team2: 'South Korea',
      team1Flag: '🇯🇵',
      team2Flag: '🇰🇷',
      date: new Date('2026-07-08T18:00:00Z'),
      venue: 'National Stadium, Tokyo',
      price: 88.00,
      description: 'East Asian Cup: Japan takes on South Korea.',
      remainingQty: 2700,
      isOfficial: false,
      isBuyerProtected: true,
      hasSecureDelivery: true,
      isBestValue: true,
      isSellingFast: false,
      urgencyThreshold: 540,
    },
  });

  await prisma.event.create({
    data: {
      title: 'Poland VS Sweden',
      type: 'football',
      team1: 'Poland',
      team2: 'Sweden',
      team1Flag: '🇵🇱',
      team2Flag: '🇸🇪',
      date: new Date('2026-07-12T19:00:00Z'),
      venue: 'PGE Narodowy, Warsaw',
      price: 72.00,
      description: 'International friendly: Poland vs Sweden.',
      remainingQty: 3500,
      isOfficial: true,
      isBuyerProtected: true,
      hasSecureDelivery: false,
      isBestValue: false,
      isSellingFast: false,
      urgencyThreshold: 700,
    },
  });

  await prisma.event.create({
    data: {
      title: 'Turkey VS Greece',
      type: 'football',
      team1: 'Turkey',
      team2: 'Greece',
      team1Flag: '🇹🇷',
      team2Flag: '🇬🇷',
      date: new Date('2026-07-15T20:00:00Z'),
      venue: 'Atatürk Olympic Stadium, Istanbul',
      price: 78.00,
      description: 'UEFA Nations League: Turkey hosts Greece.',
      remainingQty: 2900,
      isOfficial: true,
      isBuyerProtected: true,
      hasSecureDelivery: true,
      isBestValue: false,
      isSellingFast: true,
      urgencyThreshold: 580,
    },
  });

  await prisma.event.create({
    data: {
      title: 'Colombia VS Chile',
      type: 'football',
      team1: 'Colombia',
      team2: 'Chile',
      team1Flag: '🇨🇴',
      team2Flag: '🇨🇱',
      date: new Date('2026-07-18T21:30:00Z'),
      venue: 'Estadio Metropolitano, Barranquilla',
      price: 85.00,
      description: 'Copa America qualifier: Colombia vs Chile.',
      remainingQty: 2200,
      isOfficial: false,
      isBuyerProtected: true,
      hasSecureDelivery: false,
      isBestValue: true,
      isSellingFast: false,
      urgencyThreshold: 440,
    },
  });

  await prisma.event.create({
    data: {
      title: 'Egypt VS Nigeria',
      type: 'football',
      team1: 'Egypt',
      team2: 'Nigeria',
      team1Flag: '🇪🇬',
      team2Flag: '🇳🇬',
      date: new Date('2026-07-22T19:00:00Z'),
      venue: 'Cairo International Stadium, Cairo',
      price: 68.00,
      description: 'Africa Cup of Nations qualifier: Egypt vs Nigeria.',
      remainingQty: 3800,
      isOfficial: true,
      isBuyerProtected: true,
      hasSecureDelivery: true,
      isBestValue: false,
      isSellingFast: false,
      urgencyThreshold: 760,
    },
  });

  // Create basketball games
  // STABLE BASKETBALL EVENTS (4 - must preserve)
  await prisma.event.create({
    data: {
      id: 'event-stable-005',
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
      isBestValue: true,
      isSellingFast: false,
      urgencyThreshold: 400,
    },
  });

  await prisma.event.create({
    data: {
      id: 'event-stable-006',
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
      isBestValue: false,
      isSellingFast: false,
      urgencyThreshold: 500,
    },
  });

  await prisma.event.create({
    data: {
      id: 'event-stable-007',
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
      isBestValue: false,
      isSellingFast: true,
      urgencyThreshold: 300,
    },
  });

  await prisma.event.create({
    data: {
      id: 'event-stable-008',
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
      isBestValue: false,
      isSellingFast: false,
      urgencyThreshold: 350,
    },
  });

  // NEW BASKETBALL EVENTS (10 more to reach 14 total)
  await prisma.event.create({
    data: {
      title: 'Dallas Mavericks VS Denver Nuggets',
      type: 'basketball',
      team1: 'Dallas Mavericks',
      team2: 'Denver Nuggets',
      date: new Date('2026-05-22T20:30:00Z'),
      venue: 'American Airlines Center, Dallas',
      price: 140.00,
      description: 'Western Conference playoff intensity: Mavericks vs Nuggets.',
      remainingQty: 1700,
      isOfficial: true,
      isBuyerProtected: true,
      hasSecureDelivery: true,
      isBestValue: false,
      isSellingFast: true,
      urgencyThreshold: 380,
    },
  });

  await prisma.event.create({
    data: {
      title: 'Miami Heat VS Philadelphia 76ers',
      type: 'basketball',
      team1: 'Miami Heat',
      team2: 'Philadelphia 76ers',
      date: new Date('2026-05-28T19:00:00Z'),
      venue: 'FTX Arena, Miami',
      price: 150.00,
      description: 'Eastern Conference battle: Heat take on the 76ers.',
      remainingQty: 1600,
      isOfficial: true,
      isBuyerProtected: true,
      hasSecureDelivery: false,
      isBestValue: true,
      isSellingFast: false,
      urgencyThreshold: 320,
    },
  });

  await prisma.event.create({
    data: {
      title: 'Toronto Raptors VS Chicago Bulls',
      type: 'basketball',
      team1: 'Toronto Raptors',
      team2: 'Chicago Bulls',
      date: new Date('2026-06-03T19:30:00Z'),
      venue: 'Scotiabank Arena, Toronto',
      price: 125.00,
      description: 'Raptors host the Bulls in an Eastern Conference matchup.',
      remainingQty: 2200,
      isOfficial: false,
      isBuyerProtected: true,
      hasSecureDelivery: true,
      isBestValue: false,
      isSellingFast: false,
      urgencyThreshold: 440,
    },
  });

  await prisma.event.create({
    data: {
      title: 'Portland Trail Blazers VS Sacramento Kings',
      type: 'basketball',
      team1: 'Portland Trail Blazers',
      team2: 'Sacramento Kings',
      date: new Date('2026-06-08T20:00:00Z'),
      venue: 'Moda Center, Portland',
      price: 110.00,
      description: 'Western Conference clash: Blazers vs Kings.',
      remainingQty: 2400,
      isOfficial: true,
      isBuyerProtected: true,
      hasSecureDelivery: true,
      isBestValue: true,
      isSellingFast: false,
      urgencyThreshold: 480,
    },
  });

  await prisma.event.create({
    data: {
      title: 'New York Knicks VS Atlanta Hawks',
      type: 'basketball',
      team1: 'New York Knicks',
      team2: 'Atlanta Hawks',
      date: new Date('2026-06-12T19:00:00Z'),
      venue: 'Madison Square Garden, New York',
      price: 165.00,
      description: 'MSG showdown: Knicks vs Hawks in prime time.',
      remainingQty: 1400,
      isOfficial: true,
      isBuyerProtected: true,
      hasSecureDelivery: false,
      isBestValue: false,
      isSellingFast: true,
      urgencyThreshold: 280,
    },
  });

  await prisma.event.create({
    data: {
      title: 'Houston Rockets VS Oklahoma City Thunder',
      type: 'basketball',
      team1: 'Houston Rockets',
      team2: 'Oklahoma City Thunder',
      date: new Date('2026-06-15T20:30:00Z'),
      venue: 'Toyota Center, Houston',
      price: 130.00,
      description: 'Southwest Division rivalry: Rockets take on Thunder.',
      remainingQty: 1950,
      isOfficial: false,
      isBuyerProtected: true,
      hasSecureDelivery: true,
      isBestValue: false,
      isSellingFast: false,
      urgencyThreshold: 390,
    },
  });

  await prisma.event.create({
    data: {
      title: 'Memphis Grizzlies VS Utah Jazz',
      type: 'basketball',
      team1: 'Memphis Grizzlies',
      team2: 'Utah Jazz',
      date: new Date('2026-06-18T19:00:00Z'),
      venue: 'FedExForum, Memphis',
      price: 115.00,
      description: 'Western Conference matchup: Grizzlies host the Jazz.',
      remainingQty: 2100,
      isOfficial: true,
      isBuyerProtected: true,
      hasSecureDelivery: false,
      isBestValue: true,
      isSellingFast: false,
      urgencyThreshold: 420,
    },
  });

  await prisma.event.create({
    data: {
      title: 'Cleveland Cavaliers VS Indiana Pacers',
      type: 'basketball',
      team1: 'Cleveland Cavaliers',
      team2: 'Indiana Pacers',
      date: new Date('2026-06-21T18:30:00Z'),
      venue: 'Rocket Mortgage FieldHouse, Cleveland',
      price: 120.00,
      description: 'Central Division battle: Cavaliers vs Pacers.',
      remainingQty: 2050,
      isOfficial: true,
      isBuyerProtected: true,
      hasSecureDelivery: true,
      isBestValue: false,
      isSellingFast: false,
      urgencyThreshold: 410,
    },
  });

  await prisma.event.create({
    data: {
      title: 'Minnesota Timberwolves VS LA Clippers',
      type: 'basketball',
      team1: 'Minnesota Timberwolves',
      team2: 'LA Clippers',
      date: new Date('2026-06-24T20:00:00Z'),
      venue: 'Target Center, Minneapolis',
      price: 138.00,
      description: 'Western Conference showdown: Timberwolves vs Clippers.',
      remainingQty: 1750,
      isOfficial: false,
      isBuyerProtected: true,
      hasSecureDelivery: false,
      isBestValue: false,
      isSellingFast: true,
      urgencyThreshold: 350,
    },
  });

  await prisma.event.create({
    data: {
      title: 'Charlotte Hornets VS Orlando Magic',
      type: 'basketball',
      team1: 'Charlotte Hornets',
      team2: 'Orlando Magic',
      date: new Date('2026-06-27T19:30:00Z'),
      venue: 'Spectrum Center, Charlotte',
      price: 105.00,
      description: 'Southeast Division matchup: Hornets host the Magic.',
      remainingQty: 2300,
      isOfficial: true,
      isBuyerProtected: true,
      hasSecureDelivery: true,
      isBestValue: true,
      isSellingFast: false,
      urgencyThreshold: 460,
    },
  });

  // Create concert events
  // STABLE CONCERT EVENTS (4 - must preserve)
  await prisma.event.create({
    data: {
      id: 'event-stable-009',
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
      isBestValue: false,
      isSellingFast: true,
      urgencyThreshold: 200,
    },
  });

  await prisma.event.create({
    data: {
      id: 'event-stable-010',
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
      isBestValue: true,
      isSellingFast: false,
      urgencyThreshold: 250,
    },
  });

  await prisma.event.create({
    data: {
      id: 'event-stable-011',
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
      isBestValue: false,
      isSellingFast: false,
      urgencyThreshold: 200,
    },
  });

  await prisma.event.create({
    data: {
      id: 'event-stable-012',
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
      isBestValue: false,
      isSellingFast: true,
      urgencyThreshold: 150,
    },
  });

  // NEW CONCERT EVENTS (10 more to reach 14 total)
  await prisma.event.create({
    data: {
      title: 'Drake: All a Blur Tour',
      type: 'concert',
      artistName: 'Drake',
      artistImageUrl: '',
      date: new Date('2026-08-18T21:00:00Z'),
      venue: 'Scotiabank Arena, Toronto',
      price: 225.00,
      description: 'Drake returns home to Toronto for an unforgettable night of hip-hop hits.',
      remainingQty: 950,
      isOfficial: true,
      isBuyerProtected: true,
      hasSecureDelivery: true,
      isBestValue: false,
      isSellingFast: true,
      urgencyThreshold: 190,
    },
  });

  await prisma.event.create({
    data: {
      title: 'Coldplay: Music of the Spheres',
      type: 'concert',
      artistName: 'Coldplay',
      artistImageUrl: '',
      date: new Date('2026-08-25T19:30:00Z'),
      venue: 'Wembley Stadium, London',
      price: 199.99,
      description: 'Coldplay\'s spectacular Music of the Spheres world tour with immersive visuals.',
      remainingQty: 1100,
      isOfficial: true,
      isBuyerProtected: true,
      hasSecureDelivery: false,
      isBestValue: true,
      isSellingFast: false,
      urgencyThreshold: 220,
    },
  });

  await prisma.event.create({
    data: {
      title: 'Bad Bunny: Most Wanted Tour',
      type: 'concert',
      artistName: 'Bad Bunny',
      artistImageUrl: '',
      date: new Date('2026-08-28T20:30:00Z'),
      venue: 'Hard Rock Stadium, Miami',
      price: 275.00,
      description: 'Bad Bunny brings reggaeton heat to Miami with the Most Wanted Tour.',
      remainingQty: 750,
      isOfficial: true,
      isBuyerProtected: true,
      hasSecureDelivery: true,
      isBestValue: false,
      isSellingFast: true,
      urgencyThreshold: 150,
    },
  });

  await prisma.event.create({
    data: {
      title: 'Bruno Mars: 24K Magic Returns',
      type: 'concert',
      artistName: 'Bruno Mars',
      artistImageUrl: '',
      date: new Date('2026-09-01T21:00:00Z'),
      venue: 'T-Mobile Arena, Las Vegas',
      price: 215.00,
      description: 'Bruno Mars performs his greatest hits in an electrifying Las Vegas show.',
      remainingQty: 880,
      isOfficial: false,
      isBuyerProtected: true,
      hasSecureDelivery: false,
      isBestValue: true,
      isSellingFast: false,
      urgencyThreshold: 175,
    },
  });

  await prisma.event.create({
    data: {
      title: 'Harry Styles: Love On Tour 2026',
      type: 'concert',
      artistName: 'Harry Styles',
      artistImageUrl: '',
      date: new Date('2026-09-08T20:00:00Z'),
      venue: 'Madison Square Garden, New York',
      price: 285.00,
      description: 'Harry Styles continues Love On Tour with a special New York performance.',
      remainingQty: 700,
      isOfficial: true,
      isBuyerProtected: true,
      hasSecureDelivery: true,
      isBestValue: false,
      isSellingFast: true,
      urgencyThreshold: 140,
    },
  });

  await prisma.event.create({
    data: {
      title: 'Billie Eilish: Happier Than Ever Tour',
      type: 'concert',
      artistName: 'Billie Eilish',
      artistImageUrl: '',
      date: new Date('2026-09-15T19:30:00Z'),
      venue: 'The Forum, Los Angeles',
      price: 195.00,
      description: 'Billie Eilish performs her iconic hits in an intimate LA venue.',
      remainingQty: 1050,
      isOfficial: true,
      isBuyerProtected: true,
      hasSecureDelivery: false,
      isBestValue: true,
      isSellingFast: false,
      urgencyThreshold: 210,
    },
  });

  await prisma.event.create({
    data: {
      title: 'Post Malone: Twelve Carat Tour',
      type: 'concert',
      artistName: 'Post Malone',
      artistImageUrl: '',
      date: new Date('2026-09-19T21:00:00Z'),
      venue: 'United Center, Chicago',
      price: 175.00,
      description: 'Post Malone brings the Twelve Carat Tour to Chicago with special guests.',
      remainingQty: 1150,
      isOfficial: false,
      isBuyerProtected: true,
      hasSecureDelivery: true,
      isBestValue: false,
      isSellingFast: false,
      urgencyThreshold: 230,
    },
  });

  await prisma.event.create({
    data: {
      title: 'Dua Lipa: Future Nostalgia World Tour',
      type: 'concert',
      artistName: 'Dua Lipa',
      artistImageUrl: '',
      date: new Date('2026-09-22T20:00:00Z'),
      venue: 'Rogers Centre, Toronto',
      price: 210.00,
      description: 'Dua Lipa delivers an electrifying pop spectacle in Toronto.',
      remainingQty: 920,
      isOfficial: true,
      isBuyerProtected: true,
      hasSecureDelivery: false,
      isBestValue: false,
      isSellingFast: true,
      urgencyThreshold: 185,
    },
  });

  await prisma.event.create({
    data: {
      title: 'Kendrick Lamar: Big Steppers Tour',
      type: 'concert',
      artistName: 'Kendrick Lamar',
      artistImageUrl: '',
      date: new Date('2026-09-26T21:30:00Z'),
      venue: 'Crypto.com Arena, Los Angeles',
      price: 265.00,
      description: 'Kendrick Lamar performs Mr. Morale & The Big Steppers in his hometown LA.',
      remainingQty: 780,
      isOfficial: true,
      isBuyerProtected: true,
      hasSecureDelivery: true,
      isBestValue: false,
      isSellingFast: true,
      urgencyThreshold: 155,
    },
  });

  await prisma.event.create({
    data: {
      title: 'Ariana Grande: Eternal Sunshine Tour',
      type: 'concert',
      artistName: 'Ariana Grande',
      artistImageUrl: '',
      date: new Date('2026-09-29T19:30:00Z'),
      venue: 'American Airlines Arena, Miami',
      price: 240.00,
      description: 'Ariana Grande brings vocal powerhouse performance to Miami.',
      remainingQty: 850,
      isOfficial: true,
      isBuyerProtected: true,
      hasSecureDelivery: false,
      isBestValue: true,
      isSellingFast: false,
      urgencyThreshold: 170,
    },
  });

  // Create orders for test user (legacy order model, retained for backwards compatibility)
  await prisma.order.create({
    data: {
      userId: testUser.id,
      itemType: 'product',
      itemId: 'product-stable-001',
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
      itemId: 'event-stable-005',
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

  // Create pseudo-owned assets for test user in various statuses
  const ownedAsset1 = await prisma.ownedAsset.create({
    data: {
      userId: testUser.id,
      itemType: 'event',
      itemId: 'event-stable-003',
      itemName: 'Brazil VS Germany',
      itemImageUrl: '',
      purchasePrice: 120.00,
      quantity: 2,
      quantityAvailable: 2,
      status: 'delivered',
      referenceNumber: 'ASSET-2026-00001',
      purchasedAt: new Date('2026-03-15T10:00:00Z'),
      deliveredAt: new Date('2026-03-16T14:30:00Z'),
    },
  });

  const ownedAsset2 = await prisma.ownedAsset.create({
    data: {
      userId: testUser.id,
      itemType: 'event',
      itemId: 'event-stable-009',
      itemName: 'Taylor Swift: The Eras Tour',
      itemImageUrl: '',
      purchasePrice: 299.99,
      quantity: 4,
      quantityAvailable: 2, // 2 listed, 2 available
      status: 'listed',
      referenceNumber: 'ASSET-2026-00002',
      purchasedAt: new Date('2026-03-18T15:30:00Z'),
      deliveredAt: new Date('2026-03-19T09:00:00Z'),
    },
  });

  await prisma.ownedAsset.create({
    data: {
      userId: testUser.id,
      itemType: 'product',
      itemId: 'product-stable-004',
      itemName: 'France National Team #10 Jersey 2026',
      itemImageUrl: 'https://flagcdn.com/w640/fr.png',
      purchasePrice: 34.99,
      quantity: 3,
      quantityAvailable: 3,
      status: 'confirmed',
      referenceNumber: 'ASSET-2026-00003',
      purchasedAt: new Date('2026-03-22T11:15:00Z'),
    },
  });

  await prisma.ownedAsset.create({
    data: {
      userId: testUser.id,
      itemType: 'event',
      itemId: 'event-stable-007',
      itemName: 'Golden State Warriors VS Boston Celtics',
      itemImageUrl: '',
      purchasePrice: 175.00,
      quantity: 2,
      quantityAvailable: 0, // All sold
      status: 'sold',
      referenceNumber: 'ASSET-2026-00004',
      purchasedAt: new Date('2026-03-12T14:00:00Z'),
      deliveredAt: new Date('2026-03-13T10:00:00Z'),
    },
  });

  await prisma.ownedAsset.create({
    data: {
      userId: testUser.id,
      itemType: 'event',
      itemId: 'event-stable-001',
      itemName: 'Jordan VS Argentina',
      itemImageUrl: '',
      purchasePrice: 89.99,
      quantity: 1,
      quantityAvailable: 1,
      status: 'pending',
      referenceNumber: 'ASSET-2026-00005',
      purchasedAt: new Date('2026-03-25T16:45:00Z'),
    },
  });

  // Create pseudo listings for test user in various statuses
  await prisma.listing.create({
    data: {
      sellerId: testUser.id,
      ownedAssetId: ownedAsset2.id,
      itemType: 'event',
      itemId: 'event-stable-009',
      itemName: 'Taylor Swift: The Eras Tour',
      itemImageUrl: '',
      askPrice: 349.99, // Listed higher than purchase price
      quantity: 2,
      status: 'active',
      referenceNumber: 'LIST-2026-00001',
      listedAt: new Date('2026-03-20T10:00:00Z'),
    },
  });

  await prisma.listing.create({
    data: {
      sellerId: testUser.id,
      ownedAssetId: ownedAsset1.id,
      itemType: 'event',
      itemId: 'event-stable-003',
      itemName: 'Brazil VS Germany',
      itemImageUrl: '',
      askPrice: 150.00,
      quantity: 1,
      status: 'sold',
      referenceNumber: 'LIST-2026-00002',
      listedAt: new Date('2026-03-17T12:00:00Z'),
      soldAt: new Date('2026-03-21T14:30:00Z'),
    },
  });

  await prisma.listing.create({
    data: {
      sellerId: testUser.id,
      itemType: 'event',
      itemId: 'event-stable-004',
      itemName: 'Spain VS France',
      itemImageUrl: '',
      askPrice: 125.00,
      quantity: 2,
      status: 'cancelled',
      referenceNumber: 'LIST-2026-00003',
      listedAt: new Date('2026-03-14T09:00:00Z'),
      cancelledAt: new Date('2026-03-16T11:00:00Z'),
    },
  });

  await prisma.listing.create({
    data: {
      sellerId: testUser.id,
      itemType: 'event',
      itemId: 'event-stable-006',
      itemName: 'Los Angeles Lakers VS San Antonio Spurs',
      itemImageUrl: '',
      askPrice: 145.00,
      quantity: 1,
      status: 'pending_sale',
      referenceNumber: 'LIST-2026-00004',
      listedAt: new Date('2026-03-23T13:00:00Z'),
    },
  });

  await prisma.listing.create({
    data: {
      sellerId: testUser.id,
      itemType: 'product',
      itemId: 'product-stable-002',
      itemName: 'Germany Away Kit 2026',
      itemImageUrl: 'https://flagcdn.com/w640/de.png',
      askPrice: 35.00,
      quantity: 1,
      status: 'draft',
      referenceNumber: 'LIST-2026-00005',
      listedAt: new Date('2026-03-24T15:00:00Z'),
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
