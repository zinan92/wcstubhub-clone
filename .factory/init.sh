#!/bin/bash
set -e

cd /Users/wendy/wcstubhub-clone

# Install dependencies
pnpm install --frozen-lockfile 2>/dev/null || pnpm install

# Generate Prisma client
pnpm exec prisma generate

# Push schema and seed database
pnpm exec prisma db push
pnpm db:seed
