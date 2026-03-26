# Known Issues

## Empty artistImageUrl in Seed Data

The `prisma/seed.ts` file has empty strings for `artistImageUrl` on all concert events (lines ~256, 270, 284, 298). The `ConcertCard.tsx` component passes this directly to Next.js `<Image src={artistImageUrl}>` without a fallback guard. On a fresh database seed, this causes a Next.js Image runtime warning/error for empty src strings. Workers modifying ConcertCard or seed data should add a conditional render or fallback placeholder for empty image URLs.
