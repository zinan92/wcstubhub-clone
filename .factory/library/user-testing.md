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
- Purchase/For Sale buttons show confirmation dialogs (mock actions)

## Validation Concurrency

- **Machine:** 16GB RAM, 10 CPU cores, ~6GB baseline usage
- **Headroom:** ~10GB available * 0.7 = 7GB usable
- **Per agent-browser instance:** ~300MB RAM
- **Dev server:** ~200MB RAM (shared across all validators)
- **Max concurrent validators:** 5 (5 * 300MB + 200MB = 1.7GB, well within 7GB)
