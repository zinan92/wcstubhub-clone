# Environment

Environment variables, external dependencies, and setup notes.

**What belongs here:** Required env vars, external API keys/services, dependency quirks, platform-specific notes.
**What does NOT belong here:** Service ports/commands (use `.factory/services.yaml`).

---

## Environment Variables

- `NEXTAUTH_SECRET` - Required for NextAuth.js session encryption (set in .env)
- `NEXTAUTH_URL` - Set to `http://localhost:3100`
- `DATABASE_URL` - Set to `file:./dev.db` for SQLite via Prisma
- `PORT` - Set to `3100` for dev server

## Platform Notes

- macOS (darwin 25.2.0), Apple Silicon
- Node.js v25.8.1, pnpm v10.30.3
- No Docker available
- No external database services - using SQLite
