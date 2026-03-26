# Known Issues

## Concert artist imagery state

**Status: Current behavior as of page-polish scrutiny**

The `prisma/seed.ts` file currently sets concert `artistImageUrl` fields to empty strings, and `components/concert/ConcertCard.tsx` does not render the `artistImageUrl` prop. Concert cards currently use a CSS-only gradient treatment instead of image-backed artwork. Any future work expecting real concert imagery must update both the seed data and the card component together.

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
