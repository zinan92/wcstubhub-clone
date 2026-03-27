### VAL-CROSS-001: Search icon in top nav opens search overlay
Tapping the search icon in the top navigation bar opens a search overlay that contains a text input. The input is auto-focused and ready for typing. The overlay renders above all page content (z-index above carousels, cards, and footer). Pass: overlay visible with focused input within 300ms of tap. Fail: overlay does not appear, input is not focused, or overlay renders behind other content.
Evidence: screenshot, console-errors

### VAL-CROSS-002: Search overlay returns relevant results from all content areas
Typing a query in the search overlay returns results spanning products (goods), football events, basketball events, and concert events — not just the current tab's content. Pass: searching "World Cup" returns merchandise products AND football events. Fail: results limited to a single content area or no results returned for a known-existent item.
Evidence: screenshot, console-errors

### VAL-CROSS-003: Search result links navigate to correct detail page
Tapping a search result for a product navigates to `/products/[id]` and tapping a search result for an event navigates to `/events/[id]`. The detail page loads with correct data matching the tapped result. Pass: URL matches expected pattern and detail page content matches the search result title/image. Fail: 404, wrong detail page, or mismatched data.
Evidence: screenshot, console-errors

### VAL-CROSS-004: Detail page reached via search has top nav and footer
After navigating to a product or event detail page via a search result, both the top navigation bar and the footer are present. The top nav is fixed at the top and the footer is visible when scrolled to the bottom. Pass: both top nav and footer render on the detail page. Fail: either is missing.
Evidence: screenshot, console-errors

### VAL-CROSS-005: Homepage carousel cards link to correct detail pages
Tapping a carousel card on the homepage navigates to the correct detail page (`/products/[id]` for merchandise, `/events/[id]` for events). The detail page renders with matching title, image, and price. Pass: navigation succeeds and data matches. Fail: 404, blank page, or data mismatch.
Evidence: screenshot, console-errors

### VAL-CROSS-006: Back button from detail page returns to homepage at previous scroll position
After tapping a carousel card on the homepage, arriving at the detail page, then tapping the browser/app back button, the user returns to the homepage. The scroll position is restored to approximately where the user was before navigating away. Pass: homepage loads and scroll position is near the carousel card that was tapped. Fail: scroll resets to top or page is different.
Evidence: screenshot, console-errors

### VAL-CROSS-007: First-visit homepage renders top nav, carousels, footer, and search together
On a fresh first visit to the homepage (no prior navigation), all four feature areas render correctly in a single viewport scroll: (1) fixed top nav with logo, search icon, and user icon, (2) at least one content carousel with scrollable cards, (3) footer with company info, links, and trust banner, (4) search is accessible via top nav icon. Pass: all four areas are present and functional. Fail: any area is missing or broken.
Evidence: screenshot, console-errors

### VAL-CROSS-008: Guest user can browse via top nav search without authentication
An unauthenticated guest user can tap the search icon in the top nav, enter a query, see results, and tap a result to navigate to a detail page — all without being prompted to log in. Pass: full search-to-detail flow completes without login redirect. Fail: user is redirected to `/login` at any point during browsing.
Evidence: screenshot, console-errors

### VAL-CROSS-009: Guest user can navigate via bottom tab bar and all tabs render correctly
An unauthenticated guest user can tap each bottom tab (Goods, Football, Basketball, Concert, My) and each tab page loads its content. The top nav and footer persist across all tab switches. Pass: all 5 tabs load content, top nav and footer visible on each. Fail: any tab fails to load, or top nav/footer disappears on a tab.
Evidence: screenshot, console-errors

### VAL-CROSS-010: Guest user can navigate via carousel cards across different sections
A guest user on the homepage can tap a carousel card, view the detail page, go back, then tap a card from a different carousel section, and each detail page loads correctly. Pass: two different carousel card taps each lead to valid detail pages. Fail: second navigation fails or shows stale data from first.
Evidence: screenshot, console-errors

### VAL-CROSS-011: Category "See All" from carousel navigates to category page with nav and footer
If a carousel section has a "See All" link/button, tapping it navigates to a category page that displays the full listing for that category. The category page has the top navigation bar, footer, and bottom tab bar. Pass: category page loads with matching content and all nav/footer elements. Fail: 404, missing nav/footer, or empty content.
Evidence: screenshot, console-errors

### VAL-CROSS-012: Long homepage with many carousels scrolls smoothly to footer
On the homepage populated with 70+ items across multiple carousels, the user can scroll from top to bottom without jank. The footer is visible at the bottom of the page above the bottom tab bar. The top nav remains fixed during the entire scroll. Pass: smooth scroll from top to footer with no frame drops visible, footer fully visible above tab bar. Fail: visible jank, footer hidden behind tab bar, or top nav scrolls away.
Evidence: screenshot, console-errors

### VAL-CROSS-013: Top nav remains fixed while scrolling through long carousel content
On any page with extensive carousel content, scrolling down keeps the top navigation bar pinned at the top of the viewport. Carousel content scrolls underneath the top nav without z-index conflicts. Pass: top nav stays fixed at scroll positions of 0px, 500px, and 1000px+. Fail: top nav scrolls away or content renders above it.
Evidence: screenshot, console-errors

### VAL-CROSS-014: Footer at bottom of page does not overlap bottom tab bar
The footer renders fully visible above the bottom tab bar. There is adequate padding/margin between the last footer element and the top of the bottom tab bar so no content is clipped. Pass: all footer content (including trust banner and legal links) is fully visible and not overlapped by the tab bar. Fail: any footer content is hidden behind or clipped by the bottom tab bar.
Evidence: screenshot, console-errors

### VAL-CROSS-015: Existing purchase flow still works after new features added
Navigating to a product detail page and initiating a purchase flow (quantity selection → order summary → confirmation) completes successfully without errors. The new top nav, footer, and search overlay do not interfere with the multi-step purchase modal/flow. Pass: purchase flow completes end-to-end with successful order creation in DB. Fail: purchase flow crashes, is visually obscured, or fails to write to DB.
Evidence: screenshot, console-errors

### VAL-CROSS-016: Existing listing flow still works after new features added
Navigating to create a new listing via the listing flow (pricing → summary → confirmation) completes successfully. The new nav/footer/search components do not interfere. Pass: listing creation flow completes and listing appears in DB. Fail: flow crashes or is blocked by new UI elements.
Evidence: screenshot, console-errors

### VAL-CROSS-017: Trust badges still render on detail pages
Product and event detail pages continue to display trust architecture badges (Verified Seller, Official Merchandise, Secure Delivery, Buyer Protection). The addition of top nav and footer does not displace or hide existing trust components. Pass: trust badges visible on at least 2 different detail pages. Fail: any trust badge is missing or visually broken.
Evidence: screenshot, console-errors

### VAL-CROSS-018: Listing intelligence badges still render correctly
Products with listing intelligence badges (Best Value, Selling Fast, Only X Left, Verified Listing) continue to display these badges on product cards and detail pages. New carousel and search result UI does not break badge rendering. Pass: badges visible where expected on cards and detail pages. Fail: badges missing or visually corrupt.
Evidence: screenshot, console-errors

### VAL-CROSS-019: Admin panel remains accessible and unaffected by new features
Navigating to `/admin/login` and logging in with admin credentials reaches the admin dashboard. The admin panel does NOT display the public top nav, footer, or bottom tab bar. All admin CRUD operations for products, events, users, orders, owned-assets, and listings function correctly. Pass: admin login succeeds, dashboard loads, and at least one CRUD operation completes. Fail: admin pages show public nav/footer, or admin functionality is broken.
Evidence: screenshot, console-errors

### VAL-CROSS-020: Homepage with 70+ items loads within acceptable performance threshold
The homepage, seeded with 70+ products/events, completes initial render (First Contentful Paint) and becomes interactive (Time to Interactive) without visible jank. Carousels render with skeleton loading states that transition to real content. No layout shift after content loads. Pass: page loads and all carousels populated within 3 seconds on a simulated 4G connection, no CLS > 0.1. Fail: load time exceeds 5 seconds, visible jank during carousel population, or large layout shifts.
Evidence: screenshot, console-errors

### VAL-CROSS-021: Search overlay does not break carousel scroll behavior
After opening and closing the search overlay on the homepage, horizontal carousel scroll still works correctly. Carousels can be swiped/scrolled left and right without stuck scroll or ghost event listeners. Pass: carousel horizontal scroll works identically before and after search overlay interaction. Fail: carousel scroll is frozen or erratic after closing search overlay.
Evidence: screenshot, console-errors

### VAL-CROSS-022: No console errors on full homepage interaction flow
Performing the complete homepage interaction sequence — load page, scroll through carousels, tap search icon, search for a term, close search, tap a carousel card, view detail page, go back — produces zero JavaScript errors or unhandled promise rejections in the browser console. Pass: console.error count is 0 throughout the entire flow. Fail: any console error appears.
Evidence: console-errors

### VAL-CROSS-023: Search, carousel, nav, and footer render correctly at 375px viewport
At a 375px × 667px viewport (iPhone SE), all new features render without horizontal overflow: top nav fits, search overlay is full-width, carousel cards are appropriately sized, footer text is readable, and bottom tab bar is visible. Pass: no horizontal scrollbar, all elements visible and tappable. Fail: any element overflows or is cut off.
Evidence: screenshot, console-errors

### VAL-CROSS-024: Deep-link to detail page renders all layout elements
Directly navigating to a detail page URL (e.g., `/products/[id]` or `/events/[id]`) without first visiting the homepage renders the top nav, the detail content, and the footer. The page does not depend on homepage state or carousel pre-loading. Pass: all layout elements present on direct URL load. Fail: missing top nav, footer, or broken content.
Evidence: screenshot, console-errors

### VAL-CROSS-025: Rapid navigation between search results and carousel cards does not cause stale state
Quickly alternating between opening search, tapping a search result, going back, tapping a carousel card, going back, and repeating does not produce stale data, zombie API calls, or memory leaks. Each detail page shows fresh, correct data for the item tapped. Pass: 5 rapid navigation cycles produce correct detail pages each time. Fail: any detail page shows wrong data or previous result's content.
Evidence: screenshot, console-errors

### VAL-CROSS-026: Bottom tab bar active state updates correctly when navigating via search or carousel
When a user navigates to a detail page from search or a carousel and then returns, the bottom tab bar highlights the correct active tab matching the current route. Pass: after returning from a product detail to homepage, the "Goods" tab is highlighted. Fail: wrong tab highlighted or no tab highlighted.
Evidence: screenshot, console-errors

### VAL-CROSS-027: Auth-gated actions from new UI paths still redirect to login
When an unauthenticated guest user reaches a detail page via search or carousel and attempts to purchase/list, they are redirected to `/login` with a `callbackUrl` that returns them to the detail page after login. Pass: login redirect occurs with correct callbackUrl, and post-login returns to the detail page. Fail: no redirect, wrong callbackUrl, or post-login lands on homepage instead of detail page.
Evidence: screenshot, console-errors

### VAL-CROSS-028: Vercel deployment serves all new features correctly
After deployment to Vercel, the production URL renders the homepage with top nav, carousels, search icon, footer, and bottom tab bar. Search overlay opens and returns results. Carousel card taps navigate to detail pages. No 500 errors or build-time failures related to new components. Pass: all VAL-CROSS-001 through VAL-CROSS-027 behaviors are reproducible on the deployed Vercel URL. Fail: any feature that works locally but fails on deployed version.
Evidence: screenshot, console-errors
