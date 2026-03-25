---
name: fullstack-worker
description: Full-stack worker for Next.js pages, API routes, database schema, and UI components
---

# Fullstack Worker

NOTE: Startup and cleanup are handled by `worker-base`. This skill defines the WORK PROCEDURE.

## When to Use This Skill

Use for features that involve:
- Next.js pages (App Router) with both server and client components
- API route handlers
- Prisma schema changes and migrations
- UI components with Tailwind CSS
- Authentication flows
- Seed data scripts

## Required Skills

- `agent-browser` - For manual verification of UI after implementation. Invoke when verifying page renders, user flows, and responsive layout.

## Work Procedure

1. **Read the feature description** carefully. Check `preconditions` - verify they are met before starting. If not, return to orchestrator.

2. **Read shared state**: Check `AGENTS.md` for conventions, `.factory/library/` for architecture patterns, `.factory/services.yaml` for commands.

3. **Schema changes first** (if needed):
   - Update `prisma/schema.prisma`
   - Run `pnpm exec prisma db push` to apply
   - Run `pnpm exec prisma generate` to update client
   - Update seed script if new models need seed data

4. **Write tests first (TDD)**:
   - Create test files for API routes: `__tests__/api/[route].test.ts`
   - Create test files for components: `__tests__/components/[component].test.tsx`
   - Tests should cover: happy path, error states, edge cases
   - Run `pnpm test` to confirm tests fail (red phase)

5. **Implement API routes**:
   - Create route handlers in `app/api/`
   - Use Prisma for all database operations
   - Validate inputs, return proper HTTP status codes
   - Run `pnpm test` to confirm API tests pass (green phase)

6. **Implement UI pages/components**:
   - Use Server Components for data fetching pages
   - Use Client Components (`"use client"`) for interactive elements
   - Tailwind CSS for all styling - mobile-first (375px base)
   - Blue/cyan color scheme (#0066FF primary, #00CCFF accent)
   - Run component tests

7. **Run all checks**:
   - `pnpm test` - all tests pass
   - `pnpm typecheck` - no type errors
   - `pnpm lint` - no lint errors

8. **Manual verification with agent-browser**:
   - Start dev server if not running: `PORT=3100 pnpm dev &`
   - Use `agent-browser` to navigate and verify:
     - Page renders correctly at mobile viewport
     - All interactive elements work (buttons, links, forms)
     - Data displays correctly from database
     - Error states render properly
   - Stop any processes you started

9. **Update seed data** if feature adds new data models that need initial data.

10. **Commit** your work with a descriptive message.

## Example Handoff

```json
{
  "salientSummary": "Implemented the Goods home page with banner carousel, product grid, and search. Created GET /api/products endpoint with search filter. Wrote 6 tests (3 API, 3 component) all passing. Verified with agent-browser at mobile viewport - products render in grid, search filters correctly, banner shows.",
  "whatWasImplemented": "Goods home page (app/page.tsx) with banner carousel component, product card grid with images and prices, search bar with real-time filtering via GET /api/products?q=. Mobile-first layout with sticky bottom tab navigation.",
  "whatWasLeftUndone": "",
  "verification": {
    "commandsRun": [
      { "command": "pnpm test", "exitCode": 0, "observation": "6 tests passed (3 API route tests, 3 component render tests)" },
      { "command": "pnpm typecheck", "exitCode": 0, "observation": "No type errors" },
      { "command": "pnpm lint", "exitCode": 0, "observation": "No lint warnings or errors" }
    ],
    "interactiveChecks": [
      { "action": "Opened localhost:3100, verified Goods tab active, banner visible, 6 product cards in grid", "observed": "All products render with images, names, and prices in $XXX.XX format" },
      { "action": "Typed 'Messi' in search bar", "observed": "Grid filtered to show only Messi jersey product" },
      { "action": "Cleared search", "observed": "All 6 products restored in grid" }
    ]
  },
  "tests": {
    "added": [
      { "file": "__tests__/api/products.test.ts", "cases": [
        { "name": "GET /api/products returns all products", "verifies": "Products endpoint returns full list" },
        { "name": "GET /api/products?q=messi filters by name", "verifies": "Search parameter filters results" },
        { "name": "GET /api/products returns empty array for no matches", "verifies": "No matches returns empty array not error" }
      ]},
      { "file": "__tests__/components/ProductGrid.test.tsx", "cases": [
        { "name": "renders product cards with images and prices", "verifies": "Product card rendering" },
        { "name": "displays empty state when no products", "verifies": "Empty state message" },
        { "name": "search input filters displayed products", "verifies": "Client-side search interaction" }
      ]}
    ]
  },
  "discoveredIssues": []
}
```

## When to Return to Orchestrator

- Prisma schema conflicts with existing migrations
- Required API endpoint from another feature doesn't exist yet
- Auth system not set up (for features requiring authentication)
- Seed data dependencies not available
- Port 3100 is occupied and cannot be freed
