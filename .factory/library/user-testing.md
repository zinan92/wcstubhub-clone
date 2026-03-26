# User Testing

Testing surface, required testing skills/tools, resource cost classification per surface.

---

## Validation Surface

- **Primary surface:** Web browser (Next.js app at http://localhost:3100)
- **Layout:** Mobile-first responsive (375px primary viewport)
- **Tool:** `agent-browser` for all UI validation
- **Auth credentials:**
  - Test user: `test@example.com` / `password123`
  - Admin user: `admin@example.com` / `admin123`

### Setup Procedure

1. Ensure dependencies installed: `pnpm install`
2. Generate Prisma client: `pnpm exec prisma generate`
3. Push schema: `pnpm exec prisma db push`
4. Seed database: `pnpm db:seed`
5. Start dev server: `PORT=3100 pnpm dev`
6. Wait for server: `curl -sf http://localhost:3100` (healthcheck)

### Testing Notes

- User-facing pages are mobile-first; set viewport to 375x812 for accurate testing
- Admin pages are desktop-friendly; use default viewport
- Bottom tab navigation is the primary navigation mechanism for user pages
- Floating customer service icon is non-functional placeholder
- Purchase/For Sale buttons trigger auth gates for guests and show pseudo transaction flows for authenticated users

### Guest Browsing Boundaries

**Public pages (no authentication required):**
- `/` - Home page
- `/football` - Football events listing
- `/basketball` - Basketball events listing
- `/concert` - Concert events listing
- `/products/[id]` - Product detail pages
- `/events/[id]` - Event detail pages
- `/login` - Login page
- `/register` - Registration page

**Auth-protected pages (redirect to /login with callback):**
- `/my` - Account landing page
- `/my/**` - All account subpages (orders, profile, VIP, etc.)
- `/admin/**` - Admin panel and all admin pages

**Auth gates during interaction:**
- Purchase action on detail pages - guests redirected to login with callbackUrl
- For Sale action on detail pages - guests redirected to login with callbackUrl
- After login, users return to the original detail page to complete their intended action

## Flow Validator Guidance: Web Browser

### Testing Tool
Use `agent-browser` skill (invoke via Skill tool at session start). Set viewport to **375x812** for mobile-first pages. Use default viewport for admin pages.

### App URL
- Base URL: `http://localhost:3100`
- Login page: `http://localhost:3100/login`
- Register page: `http://localhost:3100/register`

### Auth Credentials
- Test user: `test@example.com` / `password123`
- Admin user: `admin@example.com` / `admin123`

### Isolation Rules
- Each subagent MUST use its own browser session (via `--session` flag).
- Subagents share the same dev server and database — this is expected.
- Auth state is per-browser-session (NextAuth cookies), so subagents don't interfere on auth.
- **Do not** delete or modify seed data records. Only create new records if needed.
- **Do not** modify any server-side code or configuration files.
- If a test needs to register a new user, use a unique email not used by other groups (e.g., `testgroup3_<random>@example.com`).

### Evidence Collection
- Take screenshots for key steps and save to the evidence directory provided.
- Note any console errors visible in the browser.
- For network assertions, observe redirects and page content after actions.

### Common Patterns
- Login flow: Navigate to `/login`, enter credentials, click Login button, verify redirect to `/` (Goods page).
- Unauthenticated access: Navigate directly to a protected route (e.g., `/my`) without logging in first, verify redirect to `/login`.
- Tab navigation: After login, the bottom tab bar has 5 tabs: Goods, Football, Basketball, Concert, My.

## Validation Concurrency

- **Machine:** 16GB RAM, 10 CPU cores, ~6GB baseline usage
- **Headroom:** ~10GB available * 0.7 = 7GB usable
- **Per agent-browser instance:** ~300MB RAM
- **Dev server:** ~200MB RAM (shared across all validators)
- **Max concurrent validators:** 2 (conservative due to observed high memory pressure - 7.2GB in compressor during dry run. If background processes are reduced, can go to 3-4.)

## Visual Overhaul Validation Notes

This mission is a VISUAL overhaul. Validation focuses on:
- **Visual quality:** Screenshots at 375px viewport. Check styling, layout, colors, shadows, typography.
- **Animation presence:** Verify animations trigger (page transitions, modal slide-up, staggered cards, press feedback).
- **Content correctness:** Product images show jerseys (not landscapes), banners show sports content, flags on match cards.
- **No functional regression:** Login, navigation, data fetching, modals all work as before.
- **No horizontal overflow:** At 375px, no page should scroll horizontally.
- **Design token compliance:** No hard-coded hex colors in components (verified via grep).


## Trust & Transaction Mission Notes
- Public guest validation is required on home, category, and detail pages.
- Account and admin surfaces remain auth-protected.
- Validate pseudo purchase and pseudo listing persistence through account surfaces.
- Keep max concurrent browser validators at 2.
