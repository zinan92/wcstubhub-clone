import { PrismaClient } from '@prisma/client';
import { existsSync, copyFileSync } from 'fs';
import path from 'path';

declare global {
  var prisma: PrismaClient | undefined;
}

function getDatabaseUrl(): string {
  if (process.env.VERCEL) {
    const tmpDb = '/tmp/dev.db';
    if (!existsSync(tmpDb)) {
      // Copy the build-time database to /tmp (writable on Vercel)
      const sourceDb = path.join(process.cwd(), 'prisma', 'dev.db');
      if (existsSync(sourceDb)) {
        copyFileSync(sourceDb, tmpDb);
      }
    }
    return `file:${tmpDb}`;
  }
  return process.env.DATABASE_URL || 'file:./prisma/dev.db';
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: getDatabaseUrl(),
    },
  },
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
