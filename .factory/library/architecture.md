# Architecture

## App Structure

- Next.js 15 App Router with TypeScript strict mode
- Prisma ORM with SQLite (file-based)
- Tailwind CSS with custom design tokens
- Motion (Framer Motion v12) for animations
- lucide-react for icons
- NextAuth for authentication

## Layout Architecture

- `LayoutWrapper` wraps all pages (SessionProvider, LazyMotion, ToastProvider, BottomTabNavigation)
- `BottomTabNavigation` hidden on: /login, /register, /admin/*, /products/*, /events/*
- Admin pages use separate layout at app/admin/layout.tsx

## Component Patterns

- Shared UI primitives in components/ui/ (Button, AnimatedModal, Toast, Skeleton, EmptyState)
- Trust components in components/trust/ (BuyerProtection, TrustBadges, TrustMessaging)
- Listing intelligence in components/listing-intelligence/
- Category cards: MatchCard (football), BasketballCard, ConcertCard, ProductCard
- Modals: PurchaseFlowModal, ListingEntryModal

## API Patterns

- Public routes: /api/products, /api/events, /api/vip-tiers, /api/search
- User routes: /api/user/profile, /api/user/orders, /api/user/owned-assets, /api/user/listings
- Admin routes: /api/admin/* (stats, products, events, orders, users, listings, owned-assets)
- All use Prisma client from lib/prisma.ts singleton

## API Error Handling

- Custom error classes in lib/errors.ts (OwnedAssetNotFoundError, InsufficientQuantityError)
- API routes use prisma.$transaction() for atomic operations
- Toast component for user-facing error feedback (replaced alert())

## Vercel Deployment

- SQLite DB created during build (prisma db push + seed in build script)
- lib/prisma.ts copies DB to /tmp at runtime on Vercel (serverless writable dir)
- outputFileTracingIncludes in next.config.ts bundles prisma/dev.db
- No output: standalone (not needed for Vercel)
