# Architecture

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
