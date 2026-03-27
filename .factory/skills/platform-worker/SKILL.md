---
name: platform-worker
description: Worker for platform polish features — search, content expansion, carousels, navigation, and footer
---

# Platform Worker

NOTE: Startup and cleanup are handled by `worker-base`. This skill defines the WORK PROCEDURE.

## When to Use This Skill

Features involving:
- Search API and search overlay UI
- Seed data expansion
- Horizontal carousel components and homepage layout
- Top navigation bar and footer components
- Any cross-cutting layout or navigation changes

## Required Skills

- `agent-browser` — MUST invoke for interactive UI verification on mobile viewport (375x812). Use for verifying carousel scroll, search overlay behavior, navigation flows, and layout correctness.

## Work Procedure

1. **Read context**: Read `mission.md`, `AGENTS.md`, `.factory/services.yaml`, and `.factory/library/` files. Understand the feature requirements from features.json description, expectedBehavior, and verificationSteps.

2. **Write tests first (TDD)**: Write failing tests for the feature before implementing. For API features, test the endpoint responses. For components, test rendering, interaction, and edge cases. Commit to red-green-refactor.

3. **Implement**: Build the feature following existing patterns. Use Tailwind for styling, lucide-react for icons, motion/react for animations. For carousels, use CSS scroll-snap (no external library). For search, build a server-side API endpoint and client-side overlay component.

4. **Run validators**: Execute all three:
   - `npx vitest run` — all tests pass (existing + new)
   - `pnpm typecheck` — zero type errors
   - `pnpm lint` — zero lint warnings

5. **Interactive verification with agent-browser**: Invoke the `agent-browser` skill. Then:
   - Start dev server: `cd /Users/wendy/wcstubhub-clone && PORT=3000 pnpm dev &`
   - Wait for server: `agent-browser open http://localhost:3000 && agent-browser wait --load networkidle`
   - Set mobile viewport: `agent-browser set device "iPhone 14"`
   - Take annotated screenshots of every changed surface
   - Test all interactive behaviors (carousel scroll, search overlay open/close, nav taps, footer visibility)
   - Record each check as an `interactiveChecks` entry in the handoff

6. **Cleanup**: Kill any dev server processes you started. Ensure no orphaned processes.

7. **Commit**: Stage and commit all changes with a descriptive message.

## Example Handoff

```json
{
  "salientSummary": "Implemented unified search API at GET /api/search?q= with cross-type results and full-screen search overlay with trending items and autocomplete. 12 new tests pass, all 366 total tests green, typecheck and lint clean. Verified on mobile viewport: overlay opens from all pages, autocomplete shows mixed results, result taps navigate to correct detail pages.",
  "whatWasImplemented": "Created GET /api/search endpoint querying both Product and Event models with case-insensitive name matching. Built SearchOverlay component with full-screen modal, auto-focused input, trending items section (top 6 items by popularity), debounced autocomplete (300ms), grouped results by type with badges, and navigation on result tap. Integrated search icon trigger in all pages. Added 12 unit tests covering API responses, component rendering, and interaction flows.",
  "whatWasLeftUndone": "",
  "verification": {
    "commandsRun": [
      { "command": "npx vitest run", "exitCode": 0, "observation": "48 files, 366 tests passed, 0 failed" },
      { "command": "pnpm typecheck", "exitCode": 0, "observation": "No type errors" },
      { "command": "pnpm lint", "exitCode": 0, "observation": "No warnings or errors" }
    ],
    "interactiveChecks": [
      { "action": "Opened homepage at 375x812, tapped search bar", "observed": "Full-screen search overlay appeared with 6 trending items (3 products, 3 events), input auto-focused" },
      { "action": "Typed 'bra' in search overlay", "observed": "Autocomplete showed 'Brazil Home Jersey 2026' (product) and 'Brazil vs Argentina' (event) within 500ms" },
      { "action": "Tapped 'Brazil Home Jersey 2026' result", "observed": "Navigated to /products/product-stable-003, overlay closed, detail page loaded with correct data" },
      { "action": "Opened search on /football page", "observed": "Same search overlay appeared, trending items visible, consistent behavior" },
      { "action": "Typed 'xyznonexistent', checked results", "observed": "'No results found' message displayed, no errors" },
      { "action": "Tapped close button on overlay", "observed": "Overlay dismissed, returned to /football at previous scroll position" }
    ]
  },
  "tests": {
    "added": [
      { "file": "__tests__/api/search.test.ts", "cases": [
        { "name": "returns products matching query", "verifies": "Product search by name" },
        { "name": "returns events matching query", "verifies": "Event search by team/artist" },
        { "name": "returns empty arrays for no match", "verifies": "No match handling" },
        { "name": "is case insensitive", "verifies": "Case insensitivity" }
      ]},
      { "file": "__tests__/components/SearchOverlay.test.tsx", "cases": [
        { "name": "renders trending items when opened", "verifies": "Trending display" },
        { "name": "shows autocomplete results on input", "verifies": "Autocomplete" },
        { "name": "navigates to detail on result click", "verifies": "Result navigation" },
        { "name": "closes on back button", "verifies": "Overlay dismissal" }
      ]}
    ],
    "coverage": "12 new tests for search API and overlay component"
  },
  "discoveredIssues": []
}
```

## When to Return to Orchestrator

- Feature depends on a component or API that doesn't exist yet and isn't in this feature's scope
- Existing tests fail for reasons unrelated to current feature
- Requirements conflict with existing implementation patterns
- Search overlay interacts badly with existing modals (PurchaseFlowModal, ListingEntryModal)
