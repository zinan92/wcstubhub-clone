# Content & Layout — Validation Contract Assertions

### VAL-CONTENT-001: Minimum Product Volume
The `/api/products` endpoint returns at least 30 products. On the homepage, scrolling past all carousel sections reveals product content populated from this expanded dataset. Fewer than 30 products returned is a fail.
Evidence: network response JSON length, screenshot of homepage scrolled to bottom

### VAL-CONTENT-002: Minimum Event Volume
The database contains at least 40 events spanning all three `EventType` values (football, basketball, concert). Querying the events API or Prisma directly returns ≥ 40 records. Fewer than 40 or missing any category is a fail.
Evidence: network response JSON length, console query

### VAL-CONTENT-003: Category Diversity in Seed Data
Products span at least 4 distinct `category` values (e.g., jerseys, merchandise, accessories, memorabilia). Events span all 3 `EventType` values with at least 10 events per type. Monoculture data (all same category, same price, or same image) is a fail.
Evidence: database query output, screenshot showing varied cards

### VAL-CONTENT-004: Price Variety Across Items
Products exhibit at least 5 distinct price points (not all $29.99). Events exhibit at least 8 distinct price points. Visible price labels on cards confirm variety. All items sharing the same price is a fail.
Evidence: screenshot of homepage carousels, network response inspection

### VAL-CONTENT-005: Image Variety Across Items
No two products share the same `imageUrl`. No two events share the same artist image or team flag combination. Duplicate placeholder images across cards is a fail.
Evidence: screenshot comparison, database query for distinct imageUrl count

### VAL-CONTENT-006: Homepage Carousel Sections Rendered
The homepage renders exactly 5 horizontal carousel sections with these headings (in any order): "Popular Events", "Football Matches", "Live Concerts", "Basketball Games", "Team Merchandise". Each heading is visible when scrolling the page. Missing any section or incorrect heading text is a fail.
Evidence: full-page screenshot at 375px width

### VAL-CONTENT-007: Carousel Section Structure — Heading + See All Link
Each carousel section contains a visible section heading (`<h2>` or semantic equivalent) and a "See All" link/button adjacent to it. The "See All" element must be tappable (minimum 44×44px touch target or equivalent) and visually distinct. Missing heading or missing "See All" in any section is a fail.
Evidence: screenshot of each section header area, DOM inspection

### VAL-CONTENT-008: See All Link Navigation
Tapping "See All" on each carousel section navigates to the corresponding category page: "Popular Events" → `/events`, "Football Matches" → `/football`, "Live Concerts" → `/concert`, "Basketball Games" → `/basketball`, "Team Merchandise" → `/products`. Navigation to wrong route or broken link is a fail.
Evidence: screenshot of destination page after tap, URL bar

### VAL-CONTENT-009: Horizontal Scroll Within Carousel
Each carousel section supports horizontal scrolling (touch swipe on mobile, scroll wheel or click-drag on desktop). The scroll container has `overflow-x: auto` or `overflow-x: scroll` and `scroll-snap-type: x mandatory` (or `x proximity`). Unable to scroll horizontally or missing scroll-snap is a fail.
Evidence: computed CSS on scroll container, screen recording of swipe gesture

### VAL-CONTENT-010: Scroll-Snap Alignment on Cards
After a horizontal swipe within any carousel, the scroll position snaps to align a card edge (left-aligned). Each card within the carousel container has `scroll-snap-align: start` (or `center`). Cards settling at arbitrary mid-positions after swipe is a fail.
Evidence: computed CSS on card elements, screen recording showing snap behavior

### VAL-CONTENT-011: Peek of Next Card Visible
At any scroll position within a carousel, a partial "peek" of the next off-screen card is visible (approximately 20–60px of the next card exposed). This visual cue signals scrollability. If the last fully visible card fills exactly to the container edge with no peek, it is a fail.
Evidence: screenshot at 375px viewport showing partial card at right edge

### VAL-CONTENT-012: Smooth Scroll Behavior
Carousel scroll containers apply `scroll-behavior: smooth` (CSS) or equivalent JS-based smooth scrolling. Scrolling appears visually smooth without jarring jumps. Abrupt position jumps during programmatic scroll or CSS-triggered snap is a fail.
Evidence: screen recording of scroll interaction, computed CSS inspection

### VAL-CONTENT-013: Carousel Card Tap to Detail Page
Tapping any card within a carousel navigates to the correct detail page: event cards navigate to `/events/[id]`, product cards navigate to `/products/[id]`. The detail page displays content matching the tapped card. Navigation to wrong item or 404 is a fail.
Evidence: screenshot of detail page after tap, URL showing correct ID

### VAL-CONTENT-014: Carousel Card Content Completeness
Each card within a carousel displays at minimum: item name/title, price, and a visual element (image, gradient, or icon). Event cards also display date and venue. Any card missing name, price, or visual element is a fail.
Evidence: screenshot of carousel cards at 375px

### VAL-CONTENT-015: Minimum Cards Per Carousel Section
Each carousel section contains at least 5 cards. Sections with fewer than 5 items do not provide meaningful horizontal scroll. Fewer than 5 cards in any section is a fail.
Evidence: DOM inspection of card count per section, screenshot

### VAL-CONTENT-016: Loading Skeleton for Carousels
While carousel data is being fetched, each carousel section displays skeleton/placeholder elements (shimmer, pulse, or placeholder cards) matching the carousel layout. A blank empty area or layout shift during load is a fail.
Evidence: screenshot captured during loading state (throttle network to Slow 3G), DOM inspection

### VAL-CONTENT-017: Mobile Viewport Layout at 375px
At 375px viewport width, all carousel sections render without horizontal page-level overflow (no unintended horizontal scrollbar on `<body>`). Carousel scroll is contained within each section. Cards are appropriately sized (not clipped or overflowing the section bounds except for the intentional peek). Page-level horizontal scroll caused by carousel content is a fail.
Evidence: screenshot at 375px, check `document.documentElement.scrollWidth <= 375`

### VAL-CONTENT-018: Mobile Viewport — Cards Readable at 375px
At 375px viewport width, carousel cards have a minimum width of 140px and maximum width of 280px. Text on cards (name, price) is legible without truncation of the primary title (single-line ellipsis is acceptable, full hiding is not). Cards smaller than 140px or text completely hidden is a fail.
Evidence: screenshot at 375px, computed width of card elements

### VAL-CONTENT-019: Homepage Scroll Order and Density
The homepage, when scrolled from top to bottom at 375px width, shows content in this general order: banner carousel → search bar → first carousel section → subsequent carousel sections → footer/protection section. At least 3 carousel sections are partially visible within the first 3 screen-heights of scroll (content density check). Fewer than 3 sections within 3 viewport heights is a fail.
Evidence: full-page screenshot at 375px, measurement of section positions

### VAL-CONTENT-020: No Console Errors on Homepage Load
Loading the homepage produces zero `console.error` entries related to carousel rendering, data fetching failures, missing keys in lists, or hydration mismatches. Any `console.error` during initial load and first scroll interaction is a fail.
Evidence: browser console output captured during page load and scroll

### VAL-CONTENT-021: Category Page Content Volume
Each category page (`/football`, `/basketball`, `/concert`, `/products`) displays at least 8 items. The page shows all items in the category, not just the carousel subset. Fewer than 8 items on any category page is a fail.
Evidence: screenshot of each category page scrolled to bottom, item count

### VAL-CONTENT-022: Category Pages — Carousel Treatment Where Appropriate
Category pages with sub-groupings (e.g., Football page with "Upcoming Matches" and "Past Matches", or Concert page grouped by genre) use horizontal carousel sections for at least one sub-grouping. A fully flat vertical-only list on all category pages is acceptable only if there is no logical sub-grouping in the data. If sub-groupings exist but are rendered as flat list only, it is a fail.
Evidence: screenshot of category pages, DOM structure inspection

### VAL-CONTENT-023: Banner Carousel Still Functional
The existing `BannerCarousel` component at the top of the homepage continues to auto-advance, supports touch swipe, and displays dot indicators. Regression causing banner carousel to break or disappear is a fail.
Evidence: screenshot of banner area, screen recording of auto-advance

### VAL-CONTENT-024: Empty State Handling for Filtered Results
When a search query in the search bar produces zero matching products, the product section shows the existing `EmptyState` component ("No products found"). The carousel sections remain visible and unaffected by the product search filter. Carousels disappearing when search returns empty results is a fail.
Evidence: screenshot with search query that matches no products, carousels still visible below

### VAL-CONTENT-025: Carousel Keyboard Accessibility
Each carousel section is navigable via keyboard. Tab focuses into the carousel, and arrow keys (Left/Right) scroll the carousel. At minimum, the carousel container has `tabindex="0"` and responds to keyboard arrow events. Complete lack of keyboard interaction on carousels is a fail.
Evidence: screen recording of keyboard navigation, DOM inspection for tabindex

### VAL-CONTENT-026: Unique Content Across Carousels
Items appearing in one carousel section are contextually appropriate (football events in "Football Matches", concerts in "Live Concerts", etc.). An item must not appear in a mismatched section (e.g., a concert appearing in "Basketball Games"). Cross-contaminated carousel content is a fail.
Evidence: DOM inspection of card data attributes, visual review of each section

### VAL-CONTENT-027: Product Grid Replaced or Augmented by Carousels
The homepage no longer displays the previous flat 2-column `ProductGrid` as the sole content area. The grid is either replaced by carousel sections or the carousels are added as new sections above/around it. If the homepage still shows only the original 6-product flat grid with no carousels, it is a fail.
Evidence: screenshot of full homepage, DOM structure comparison

### VAL-CONTENT-028: Carousel Overflow Hidden on Container
The outer page container (`<main>` or `<body>`) has `overflow-x: hidden` or equivalent to prevent the carousel's scroll-able area from causing page-level horizontal scroll. Each carousel's scroll container is the only element with horizontal overflow enabled. Page-level horizontal scrollbar appearing is a fail.
Evidence: computed CSS on `<main>`, `<body>`, and carousel containers

### VAL-CONTENT-029: Data Fetch Error Resilience
If any individual carousel section's data fetch fails (simulate by returning 500 from one category endpoint), the other carousel sections still render successfully. A single failed section shows an error state or graceful fallback (not a blank gap). One failing section crashing the entire homepage is a fail.
Evidence: network tab showing simulated 500, screenshot of page with one section errored and others intact

### VAL-CONTENT-030: See All Link Visible Without Scrolling Section
The "See All" link for each carousel section is visible in the section header without requiring any horizontal scroll within the carousel. It must be positioned in the heading row, not inside the scrollable card area. "See All" hidden until scroll is a fail.
Evidence: screenshot of section header at initial scroll position
