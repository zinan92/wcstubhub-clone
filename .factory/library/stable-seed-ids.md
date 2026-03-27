# Stable Seed IDs

For validation testing reliability, the seed script uses deterministic IDs that remain stable across reseeds.

## Products
- `product-stable-001`: Argentina Home Jersey 2026 ($29.99)
- `product-stable-002`: Germany Away Kit 2026 ($27.99)
- `product-stable-003`: Brazil Home Jersey 2026 ($32.99)
- `product-stable-004`: France National Team #10 Jersey 2026 ($34.99)
- `product-stable-005`: USA National Team Jersey 2026 ($28.99)
- `product-stable-006`: Spain Home Kit 2026 ($31.99)

## Events

### Football
- `event-stable-001`: Jordan VS Argentina (2026-06-15, $89.99)
- `event-stable-002`: Algeria VS Austria (2026-06-18, $75.00)
- `event-stable-003`: Brazil VS Germany (2026-07-01, $120.00)
- `event-stable-004`: Spain VS France (2026-07-10, $110.00)

### Basketball
- `event-stable-005`: Phoenix Suns VS Los Angeles Lakers (2026-05-20, $145.00)
- `event-stable-006`: Los Angeles Lakers VS San Antonio Spurs (2026-05-25, $135.00)
- `event-stable-007`: Golden State Warriors VS Boston Celtics (2026-06-01, $175.00)
- `event-stable-008`: Milwaukee Bucks VS Brooklyn Nets (2026-06-05, $155.00)

### Concerts
- `event-stable-009`: Taylor Swift: The Eras Tour (2026-08-15, $299.99)
- `event-stable-010`: Ed Sheeran: Mathematics Tour (2026-08-22, $189.99)
- `event-stable-011`: The Weeknd: After Hours Til Dawn (2026-09-05, $249.99)
- `event-stable-012`: Beyoncé: Renaissance World Tour (2026-09-12, $349.99)

## Expanded Dataset

Beyond the 6 stable products and 12 stable events above, the seed script creates additional items (30 products total, 42 events total). The expanded dataset includes:
- **Products**: 5 categories (Football Jersey, Scarf, Cap, Memorabilia, Accessories), 18 distinct price points ($9.99-$49.99)
- **Events**: 14 per type (football, basketball, concert), 37 distinct event price points
- **Images**: Each product uses a unique flagcdn.com country code — no duplicate imageUrls allowed

## Usage in Validation

Validation flows can now reliably reference these stable routes:
- `/products/product-stable-001` - Always resolves to Argentina Home Jersey
- `/events/event-stable-001` - Always resolves to Jordan VS Argentina match

This prevents validation failures due to CUID drift after reseeding.
