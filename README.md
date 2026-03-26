# wcstubhub-clone

A sports merchandise and event ticket marketplace, built as a clone of wcstubhub.com (SAE-A Trading). Users can browse and purchase goods, football and basketball event tickets, and concert tickets. Includes a full admin panel for managing products, events, users, and orders.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS with custom design tokens
- **Animations:** Motion (Framer Motion v12)
- **Typography:** Inter (Google Fonts, Next.js optimized)
- **Database:** SQLite via Prisma ORM
- **Authentication:** NextAuth.js
- **Icons:** Lucide React
- **Testing:** Vitest, React Testing Library
- **Package Manager:** pnpm

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm

### Installation

```bash
pnpm install
```

### Database Setup

Generate the Prisma client and push the schema to SQLite:

```bash
pnpm exec prisma generate
pnpm exec prisma db push
```

### Seed the Database

Populate the database with sample products, events, users, and VIP tiers:

```bash
pnpm db:seed
```

### Run the Dev Server

```bash
PORT=3100 pnpm dev
```

The app will be available at [http://localhost:3100](http://localhost:3100).

## Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `pnpm dev` | Start the development server |
| `build` | `pnpm build` | Build for production |
| `start` | `pnpm start` | Start the production server |
| `lint` | `pnpm lint` | Run ESLint |
| `typecheck` | `pnpm typecheck` | Run TypeScript type checking |
| `test` | `pnpm test` | Run tests with Vitest |
| `db:seed` | `pnpm db:seed` | Seed the database |

## Project Structure

```
wcstubhub-clone/
├── app/
│   ├── page.tsx                # Home (Goods tab)
│   ├── layout.tsx              # Root layout
│   ├── football/               # Football events tab
│   ├── basketball/             # Basketball events tab
│   ├── concert/                # Concert events tab
│   ├── events/                 # Event detail pages
│   ├── products/               # Product detail pages
│   ├── login/                  # Login page
│   ├── register/               # Registration page
│   ├── my/                     # Profile tab and settings
│   │   ├── orders/             # Order history
│   │   ├── vip/                # VIP membership info
│   │   ├── personal/           # Personal info
│   │   ├── bank-card/          # Bank card management
│   │   ├── security/           # Security settings
│   │   ├── notification/       # Notification settings
│   │   ├── language/           # Language settings
│   │   └── company/            # Company info
│   ├── admin/                  # Admin panel
│   │   ├── login/              # Admin login
│   │   ├── dashboard/          # Admin dashboard
│   │   ├── products/           # Product management (CRUD)
│   │   ├── events/             # Event management (CRUD)
│   │   ├── users/              # User management
│   │   └── orders/             # Order management
│   └── api/                    # API routes
│       ├── auth/               # NextAuth endpoints
│       ├── products/           # Product API
│       ├── events/             # Event API
│       ├── user/               # User API
│       ├── vip-tiers/          # VIP tier API
│       └── admin/              # Admin API routes
├── components/                 # Shared UI components
│   ├── ui/                     # Design system primitives
│   │   ├── AnimatedModal.tsx   # Animated modal with backdrop
│   │   ├── Button.tsx          # Styled button component
│   │   ├── Skeleton.tsx        # Skeleton loading placeholders
│   │   └── Toast.tsx           # Toast notification system
│   ├── BottomTabNavigation.tsx # Frosted glass bottom tab bar
│   ├── LayoutWrapper.tsx       # Layout wrapper
│   ├── goods/                  # Goods page components
│   ├── football/               # Football page components
│   ├── basketball/             # Basketball page components
│   └── concert/                # Concert page components
├── lib/
│   ├── auth.ts                 # NextAuth configuration
│   └── prisma.ts               # Prisma client singleton
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── seed.ts                 # Database seed script
├── types/                      # TypeScript type definitions
├── __tests__/                  # Test suite (36 files, 250+ tests)
│   ├── api/                    # API route tests
│   ├── components/             # Component tests
│   ├── layouts/                # Layout tests
│   └── cross-area-flows.test.tsx
├── middleware.ts               # Auth and route protection middleware
└── vitest.config.ts            # Vitest configuration
```

## Features

### User-Facing

- **Goods tab (Home):** Browse FIFA World Cup 2026 jersey merchandise with real product images (country flag CDN), sports-themed gradient banners, categories, and detailed product pages
- **Football tab:** Upcoming football matches displayed as country-flag VS layout cards with staggered entrance animations
- **Basketball tab:** Basketball games in distinctive dark-themed cards with staggered animations
- **Concert tab:** Music events presented in purple gradient concert cards
- **Product/Event detail pages:** Polished detail pages with image galleries, pricing, and remaining quantity
- **User authentication:** Premium login and registration pages with gradient backgrounds and animated transitions
- **Profile (My tab):** Account info, VIP level with tier gradients, balance, points, and order history
- **Order management:** Track purchase and sale orders with status indicators
- **Settings:** Personal info, bank card, security, notifications, language, company info

### Design System and UX

- **Design tokens:** 6 semantic color groups (primary, accent, success, warning, error, surface), custom shadows (soft, card, elevated), and border-radius tokens (card, modal) defined in Tailwind config
- **Shared UI components:** AnimatedModal, Toast notifications, Skeleton loading placeholders, and styled Button -- all in `components/ui/`
- **Page transitions:** Animated route transitions via `app/template.tsx` using Motion (Framer Motion v12)
- **Mobile-first navigation:** Frosted glass bottom tab bar (`backdrop-blur-xl`) with animated active indicators and 44px+ touch targets
- **Loading states:** Skeleton placeholders replace spinners across all data-fetching pages
- **Animations:** Staggered card entrance animations, modal transitions, and toast slide-ins powered by Motion
- **Typography:** Inter font loaded via Next.js font optimization
- **Empty states:** Dedicated empty-state illustrations for pages with no data

### Admin Panel

- **Dashboard:** Overview of platform metrics, styled with the shared design tokens
- **Product management:** Create, read, update, and delete merchandise listings
- **Event management:** Create, read, update, and delete football, basketball, and concert events
- **User management:** View and manage registered users
- **Order management:** View and manage all orders

## Data Model

The database includes five main models:

- **User** -- Accounts with email/phone, VIP level, balance, points, and invite codes
- **Product** -- Merchandise items with name, description, image, price, category, and stock
- **Event** -- Football, basketball, or concert events with teams/artists, venue, date, and price
- **Order** -- Purchase records linking users to products or events with status tracking
- **VipTier** -- VIP level definitions with thresholds

## Test Credentials

| Role | Email | Password |
|------|-------|----------|
| User | test@example.com | password123 |
| Admin | admin@example.com | admin123 |

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

The default configuration uses a local SQLite database and requires a `NEXTAUTH_SECRET` value.
