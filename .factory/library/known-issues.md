# Known Issues

## Empty artistImageUrl in Seed Data (RESOLVED)

**Status: Fixed in commit 9a75986 (fix-img-tags-and-seed feature)**

The `prisma/seed.ts` file previously had empty strings for `artistImageUrl` on all concert events. This was fixed by adding picsum.photos placeholder URLs for all 4 concert entries. The `ConcertCard.tsx` component also has fallback rendering for empty `artistImageUrl` values.

## Testing Next.js Image Components

When testing components that use Next.js `<Image>` with the `fill` prop, **do not assert on the `src` attribute** — Next.js transforms the `src` at build/render time (e.g., adding `/_next/image?url=...` prefix). Instead, verify image presence via `alt` text:

```tsx
// ❌ Don't do this — src is transformed by Next.js
expect(img).toHaveAttribute('src', '/images/jersey.jpg');

// ✅ Do this — verify by alt text
const img = screen.getByAltText('Product image');
expect(img).toBeInTheDocument();
```

This pattern is used in `ProductDetailPage.test.tsx` and `PersonalCenterPage.test.tsx`.
