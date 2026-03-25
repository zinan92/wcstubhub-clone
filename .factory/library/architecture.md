# Architecture

## Visual Overhaul Architecture Decisions

- **Animation library**: `motion` package (Framer Motion v12+), imported from `"motion/react"`
- **LazyMotion**: Wraps app tree with `domAnimation` features for bundle optimization. Use `m` components (not `motion`) inside LazyMotion.
- **Page transitions**: Use `app/template.tsx` with enter-only animations (fade + slide-up). No exit animations (FrozenRouter pattern too fragile).
- **Shared UI components**: `components/ui/` directory for Button, AnimatedModal, Toast, Skeleton
- **Design tokens**: All colors, shadows, radius defined in tailwind.config.ts. NO arbitrary hex values in components.
- **Font**: Inter via next/font/google, applied to root element
- **Images**: All use Next.js `<Image>` component. For flags: emoji flags or flagcdn.com.

Architectural decisions, patterns discovered, and conventions.

**What belongs here:** Architectural patterns, component structure decisions, state management approach.
**What does NOT belong here:** Environment-specific details (use environment.md).

---

## Key Decisions

- Next.js App Router with Server Components for data fetching
- Client Components only for interactive elements (forms, modals, tab switching)
- Prisma ORM with SQLite - single file database
- NextAuth.js credentials provider for both user and admin auth
- Admin uses role-based access control (user.role === 'admin')
- Mobile-first design: all user-facing pages designed for 375px viewport first
- Bottom tab navigation: fixed position at viewport bottom, 5 tabs
- Mock purchase/sale: confirmation dialogs only, no real payment processing

## Layout Conventions

- **Bottom padding on user pages**: All user-facing pages (those with bottom tab bar) MUST use `pb-20` (or equivalent ~5rem bottom padding) to prevent content from being hidden behind the fixed bottom tab navigation bar.
- **LayoutWrapper**: The root layout uses a client-side `LayoutWrapper` component that conditionally shows/hides the `BottomTabNavigation` based on the current route. Auth pages (`/login`, `/register`) and admin pages (`/admin/*`) do not show the tab bar.

## Auth Patterns

- **SessionProvider**: The `LayoutWrapper` component wraps the app in a NextAuth `SessionProvider`, enabling client-side `useSession()` hooks throughout the application. Multiple pages (login, my/page, my/orders, my/vip, my/personal) rely on `useSession()` for auth state. The `signIn()` function works via direct API calls, and middleware handles server-side route protection.
- **API validation**: Input validation in API routes (e.g., `/api/auth/register`) is currently hand-written (no schema validation library like zod). The email/phone format validation is permissive — Prisma unique constraints provide a safety net.
