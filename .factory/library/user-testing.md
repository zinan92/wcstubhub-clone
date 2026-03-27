# User Testing

## Validation Surface

- **Primary surface**: Browser (agent-browser) at mobile viewport 375x812 (iPhone 14)
- **Dev server**: http://localhost:3000 (PORT=3000 pnpm dev)
- **Test credentials**: test@example.com / password123
- **Admin credentials**: admin@example.com / admin123
- **Seed command**: `pnpm db:seed`

## Validation Concurrency

**Machine**: 16GB RAM, 10 CPU cores
**Dev server footprint**: ~200MB RAM
**Per agent-browser instance**: ~300MB RAM
**Max concurrent validators**: 5 (1.5GB + 200MB = 1.7GB, well within 70% of ~10GB headroom)

## Key Testing Notes

- Carousels must be tested with horizontal swipe via agent-browser
- Search overlay is full-screen modal — test open/close/dismiss behavior
- Top nav is sticky/fixed — verify it stays pinned while scrolling
- Footer appears at bottom of content, above bottom tab bar
- Admin pages should NOT show top nav or footer
- All browsing pages are guest-accessible (no auth needed)
