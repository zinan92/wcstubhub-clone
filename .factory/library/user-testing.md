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

## Flow Validator Guidance: curl

- Use `curl -sf` for API testing
- Base URL: http://localhost:3000
- All search/content APIs are public (no auth needed)
- Parse JSON output with `jq` for assertions
- Save evidence as JSON files in the assigned evidence directory

## Flow Validator Guidance: agent-browser

- Always use the assigned `--session` parameter
- Set viewport to 375x812 (mobile) using agent-browser's viewport command
- Base URL: http://localhost:3000
- No login needed — all browsing pages are guest-accessible
- Search overlay is triggered by tapping search bar/icon on any public page
- The search overlay is a full-screen modal component at `/components/search-overlay`
- Take screenshots as evidence for visual assertions
- Check console errors via agent-browser's console capture capabilities
- Close your session when done with `agent-browser --session "<session>" close`
- **Isolation**: Each agent-browser session is independent. No shared state between browser sessions.
- **Read-only testing**: These are read-only tests — no data mutation. Multiple browser sessions can safely run concurrently against the same dev server.

## Key Testing Notes

- Carousels must be tested with horizontal swipe via agent-browser
- Search overlay is full-screen modal — test open/close/dismiss behavior
- Top nav is sticky/fixed — verify it stays pinned while scrolling
- Footer appears at bottom of content, above bottom tab bar
- Admin pages should NOT show top nav or footer
- All browsing pages are guest-accessible (no auth needed)
