---
name: marketplace-worker
description: Worker for trust architecture, pseudo transaction flows, account lifecycle, and marketplace behavior
---

# Marketplace Worker

## When to Use This Skill
Use for guest browsing, trust modules, pseudo order/listing persistence, My Tickets/My Listings, and listing-intelligence features.

## Required Skills
- agent-browser: required for verifying guest browsing, gated transaction flows, and account surfaces.

## Work Procedure
1. Read the feature, mission AGENTS.md, and current relevant schema/routes.
2. Write tests first for model/API changes where applicable.
3. Implement persisted behavior before polishing UI around it.
4. Run `npx vitest run`, `pnpm typecheck`, and `pnpm lint`.
5. Use agent-browser to verify real user flows, especially guest->login->purchase/listing->account.
6. Stop any dev server you started.

## Example Handoff
```json
{
  "salientSummary": "Implemented pseudo listing creation with persisted DB record and My Listings rendering. Verified guest sell gating and post-login callback return to the original detail page.",
  "whatWasImplemented": "Added Listing model, create-listing API, and My Listings page rendering real seeded and user-created listing records with active/sold statuses.",
  "whatWasLeftUndone": "",
  "verification": {
    "commandsRun": [
      { "command": "npx vitest run", "exitCode": 0, "observation": "All tests passed" },
      { "command": "pnpm typecheck", "exitCode": 0, "observation": "No type errors" },
      { "command": "pnpm lint", "exitCode": 0, "observation": "No lint errors" }
    ],
    "interactiveChecks": [
      { "action": "Guest clicked For sale on event detail", "observed": "Redirected to /login with callbackUrl to the same event detail page" },
      { "action": "After login completed listing flow", "observed": "Redirected to My Listings and saw the newly created listing" }
    ]
  },
  "tests": {
    "added": [
      { "file": "__tests__/api/listings.test.ts", "cases": [
        { "name": "creates listing for authenticated user", "verifies": "Persisted listing row is created" }
      ] }
    ],
    "coverage": "Listing API + account rendering covered"
  },
  "discoveredIssues": []
}
```

## When to Return to Orchestrator
- If the schema change needed is larger than the current feature scope can safely absorb
- If auth/routing behavior conflicts with mission boundaries
- If a required pseudo transaction state cannot be represented cleanly with the current data model
