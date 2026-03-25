---
name: admin-worker
description: Worker for admin panel features - dashboard, CRUD management pages, role-based access
---

# Admin Worker

NOTE: Startup and cleanup are handled by `worker-base`. This skill defines the WORK PROCEDURE.

## When to Use This Skill

Use for features involving:
- Admin panel pages (dashboard, product/event/user/order management)
- Admin authentication and role-based access control
- CRUD operations for admin management
- Admin-specific API endpoints

## Required Skills

- `agent-browser` - For manual verification of admin UI. Invoke when verifying admin pages, CRUD operations, and access control.

## Work Procedure

1. **Read the feature description** carefully. Check `preconditions` - verify they are met before starting. If not, return to orchestrator.

2. **Read shared state**: Check `AGENTS.md` for conventions (especially admin section), `.factory/library/` for patterns, `.factory/services.yaml` for commands.

3. **Write tests first (TDD)**:
   - API route tests for admin endpoints (auth, CRUD operations)
   - Test role-based access: admin-only endpoints reject non-admin tokens
   - Test validation: invalid inputs return 400 with error details
   - Run `pnpm test` to confirm tests fail (red phase)

4. **Implement admin API routes**:
   - All admin endpoints under `app/api/admin/`
   - Verify admin role on every request (middleware or per-route check)
   - Full CRUD: create (POST), read (GET), update (PUT), delete (DELETE)
   - Input validation with proper error messages
   - Run `pnpm test` to confirm passing (green phase)

5. **Implement admin UI pages**:
   - Admin pages under `app/admin/`
   - Desktop-friendly layout (not mobile-first like user side)
   - Use tables for list views, forms for create/edit
   - Confirmation dialogs for destructive actions (delete)
   - Dashboard with stat cards showing counts
   - Navigation sidebar/menu linking all admin sections

6. **Run all checks**:
   - `pnpm test` - all tests pass
   - `pnpm typecheck` - no type errors
   - `pnpm lint` - no lint errors

7. **Manual verification with agent-browser**:
   - Start dev server if not running
   - Login as admin (`admin@example.com` / `admin123`)
   - Verify CRUD operations work end-to-end
   - Verify non-admin users are denied access
   - Stop any processes you started

8. **Commit** your work with a descriptive message.

## Example Handoff

```json
{
  "salientSummary": "Implemented admin product management with full CRUD. Created 4 API routes (GET/POST/PUT/DELETE /api/admin/products) with admin role verification. Built list view with table, create/edit forms, delete confirmation. 8 tests all passing. Verified with agent-browser - created product, edited price, deleted product, confirmed non-admin gets 403.",
  "whatWasImplemented": "Admin product management: GET /api/admin/products (list), POST (create with validation), PUT /api/admin/products/[id] (update), DELETE (soft delete). Admin UI: product list table with edit/delete actions, create product form with validation, edit product form pre-populated, delete confirmation modal.",
  "whatWasLeftUndone": "",
  "verification": {
    "commandsRun": [
      { "command": "pnpm test", "exitCode": 0, "observation": "8 tests passed" },
      { "command": "pnpm typecheck", "exitCode": 0, "observation": "No type errors" },
      { "command": "pnpm lint", "exitCode": 0, "observation": "Clean" }
    ],
    "interactiveChecks": [
      { "action": "Logged in as admin, navigated to /admin/products", "observed": "Product list table with 6 seeded products showing name, price, stock" },
      { "action": "Clicked Create, filled form, submitted", "observed": "New product appears in list with correct data" },
      { "action": "Clicked Edit on product, changed price, saved", "observed": "Updated price reflected in list" },
      { "action": "Clicked Delete, confirmed in dialog", "observed": "Product removed from list" },
      { "action": "Logged in as regular user, navigated to /admin/products", "observed": "Redirected to home page, admin content not visible" }
    ]
  },
  "tests": {
    "added": [
      { "file": "__tests__/api/admin/products.test.ts", "cases": [
        { "name": "GET returns all products for admin", "verifies": "Admin can list products" },
        { "name": "POST creates product with valid data", "verifies": "Product creation" },
        { "name": "POST rejects invalid data with 400", "verifies": "Input validation" },
        { "name": "PUT updates existing product", "verifies": "Product update" },
        { "name": "DELETE removes product", "verifies": "Product deletion" },
        { "name": "All endpoints return 403 for non-admin", "verifies": "Role-based access" }
      ]}
    ]
  },
  "discoveredIssues": []
}
```

## When to Return to Orchestrator

- Auth system not set up or admin role not supported
- Database schema missing required tables
- Seed data for admin user not available
- User-facing API endpoints that admin depends on don't exist yet
