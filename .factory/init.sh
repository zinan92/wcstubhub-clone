#!/bin/bash
set -e

cd /Users/wendy/wcstubhub-clone

# Install dependencies if node_modules missing or package.json changed
if [ ! -d "node_modules" ] || [ "package.json" -nt "node_modules/.package-lock.json" ] 2>/dev/null; then
  pnpm install
fi

# Generate Prisma client if schema exists
if [ -f "prisma/schema.prisma" ]; then
  pnpm exec prisma generate 2>/dev/null || true
  pnpm exec prisma db push 2>/dev/null || true
fi

# Seed database if seed script exists and db is empty
if [ -f "prisma/seed.ts" ] || [ -f "prisma/seed.js" ]; then
  pnpm db:seed 2>/dev/null || true
fi

echo "Init complete"
