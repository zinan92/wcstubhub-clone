### VAL-SEARCH-001: Unified Search API Returns Products and Events
`GET /api/search?q=` endpoint exists and returns a JSON response containing both `products` and `events` arrays. Querying with `q=` (empty) returns a successful response with the expected schema. Response status is 200 and body has shape `{ products: [...], events: [...] }`.
Evidence: network(`GET /api/search?q=` → 200, response body shape)

### VAL-SEARCH-002: Search API Matches Products by Name
`GET /api/search?q=jersey` returns products whose `name` field contains "jersey" (case-insensitive). At least one product is returned from the seeded FIFA World Cup jersey data. Each product object includes `id`, `name`, `price`, `imageUrl`, and `remainingQty`.
Evidence: network(`GET /api/search?q=jersey` → 200, products array length ≥ 1)

### VAL-SEARCH-003: Search API Matches Football Events by Team Name
`GET /api/search?q=brazil` (or another seeded team) returns events where `team1` or `team2` matches. Returned events include `type: "football"` and the matching team name. Each event includes `id`, `title`, `type`, `team1`, `team2`, `price`, `venue`, `date`.
Evidence: network(`GET /api/search?q=brazil` → 200, events array with football type)

### VAL-SEARCH-004: Search API Matches Basketball Events by Team Name
`GET /api/search?q=lakers` (or another seeded basketball team) returns basketball events. Returned events include `type: "basketball"`.
Evidence: network(`GET /api/search?q=lakers` → 200, events filtered to basketball)

### VAL-SEARCH-005: Search API Matches Concert Events by Artist Name
`GET /api/search?q=` with a known seeded artist name returns concert events where `artistName` matches. Returned events include `type: "concert"` and `artistName`.
Evidence: network(`GET /api/search?q=<artist>` → 200, events with concert type)

### VAL-SEARCH-006: Search API Returns Empty Arrays for No Match
`GET /api/search?q=xyznonexistent12345` returns `{ products: [], events: [] }` with status 200 (not 404 or 500). No console errors.
Evidence: network(`GET /api/search?q=xyznonexistent12345` → 200, both arrays empty), console-errors(none)

### VAL-SEARCH-007: Search API Is Case-Insensitive
`GET /api/search?q=JERSEY` and `GET /api/search?q=jersey` return identical result sets. Both return the same products with matching names regardless of query casing.
Evidence: network(compare both responses, same items returned)

### VAL-SEARCH-008: Search API Handles Special Characters Gracefully
`GET /api/search?q=%26%3C%3E%22` (URL-encoded `&<>"`) returns status 200 with empty or valid results. No 500 error, no unhandled exception.
Evidence: network(status 200), console-errors(none)

### VAL-SEARCH-009: Search API Handles Very Long Query Strings
`GET /api/search?q=` with a 500-character string returns status 200 (empty results or truncated gracefully). No server crash or timeout.
Evidence: network(status 200, no timeout), console-errors(none)

### VAL-SEARCH-010: Tapping Search Bar Opens Full-Screen Search Overlay
On the homepage (`/`), tapping the search bar input opens a full-screen search overlay that covers the entire viewport. The overlay has a visible back/close button, an active text input field, and is layered above the main page content (z-index properly stacking above bottom tab bar).
Evidence: screenshot(full-screen overlay visible, input focused)

### VAL-SEARCH-011: Search Overlay Opens from Football Page
On `/football`, tapping the search bar opens the same full-screen search overlay. The overlay UI is consistent with the homepage overlay (same design, same behavior).
Evidence: screenshot(overlay on football page)

### VAL-SEARCH-012: Search Overlay Opens from Basketball Page
On `/basketball`, tapping the search bar opens the full-screen search overlay. Behavior is identical to other pages.
Evidence: screenshot(overlay on basketball page)

### VAL-SEARCH-013: Search Overlay Opens from Concert Page
On `/concert`, tapping the search bar opens the full-screen search overlay. Behavior is identical to other pages.
Evidence: screenshot(overlay on concert page)

### VAL-SEARCH-014: Search Input Auto-Focuses When Overlay Opens
When the search overlay opens, the text input is automatically focused and the virtual keyboard is ready for input (on mobile) or cursor is active (on desktop). No additional tap is required to begin typing.
Evidence: screenshot(cursor blinking in input field)

### VAL-SEARCH-015: Trending/Popular Items Shown Before Typing
When the search overlay first opens and no text has been typed, a "Trending" or "Popular" section is displayed showing suggested items (products and/or events). At least 3 trending items are visible. Each item shows a name and is tappable.
Evidence: screenshot(trending section visible with ≥ 3 items, input is empty)

### VAL-SEARCH-016: Trending Items Include Both Products and Events
The trending/popular items section contains a mix of content types — at least one product (e.g., a jersey) and at least one event (football, basketball, or concert). Content type is visually distinguishable (icon, label, or category tag).
Evidence: screenshot(trending section with product and event items identifiable)

### VAL-SEARCH-017: Autocomplete Results Appear While Typing
After typing at least 2 characters in the search input (e.g., "je"), autocomplete/suggestion results appear below the input within 500ms. Results update dynamically as more characters are typed.
Evidence: screenshot(autocomplete results visible after typing "je"), network(`GET /api/search?q=je` fired)

### VAL-SEARCH-018: Autocomplete Results Show Both Products and Events
When typing a query that matches both a product and an event (or a broad term), the autocomplete results include items from both content types. Results are grouped or labeled by type (e.g., "Products" section and "Events" section, or type badges on each result).
Evidence: screenshot(mixed results with type indicators)

### VAL-SEARCH-019: Autocomplete Results Show Relevant Metadata
Each autocomplete result item shows at minimum: item name and content type indicator. Products should show price. Events should show date or venue. No result item is blank or shows only an ID.
Evidence: screenshot(result items with name, type, and metadata visible)

### VAL-SEARCH-020: Clicking Product Result Navigates to Product Detail
Tapping a product result in the autocomplete list navigates to `/products/[id]`. The product detail page loads correctly with the matching product name, price, and image. The search overlay closes.
Evidence: screenshot(product detail page after tap), network(`GET /api/products/<id>` → 200)

### VAL-SEARCH-021: Clicking Event Result Navigates to Event Detail
Tapping an event result in the autocomplete list navigates to `/events/[id]`. The event detail page loads correctly with matching event title, date, and venue. The search overlay closes.
Evidence: screenshot(event detail page after tap), network(`GET /api/events/<id>` → 200)

### VAL-SEARCH-022: Back/Close Button Dismisses Search Overlay
Tapping the back arrow or close (X) button on the search overlay dismisses it and returns the user to the page they were on before opening search. The previous page content is fully restored and scrollable.
Evidence: screenshot(original page restored after closing overlay)

### VAL-SEARCH-023: Search Overlay Dismisses with Hardware Back (Mobile)
On mobile viewport, pressing the browser back button (or swipe-back gesture) dismisses the search overlay rather than navigating away from the current page. The user returns to the previous view state.
Evidence: screenshot(overlay dismissed via back navigation)

### VAL-SEARCH-024: No Results State Shown for Unmatched Query
Typing a query with no matches (e.g., "xyznonexistent12345") displays a clear "No results found" empty state message within the overlay. The message is user-friendly (not a blank screen or raw error). A suggestion to try different keywords may be shown.
Evidence: screenshot(no results state with friendly message)

### VAL-SEARCH-025: Search Input Can Be Cleared
The search input has a clear/reset button (X icon) that appears when text is present. Tapping it clears the input text and returns to the trending/popular items view. The autocomplete results disappear.
Evidence: screenshot(clear button visible when text present; trending shown after clear)

### VAL-SEARCH-026: Search Debounces API Calls
Rapidly typing "football" character by character does NOT fire 8 separate API requests. Network tab shows that requests are debounced — the total number of `GET /api/search` calls is fewer than the number of keystrokes (e.g., ≤ 3 calls for 8 keystrokes at normal typing speed).
Evidence: network(count of `/api/search` calls < character count)

### VAL-SEARCH-027: Search Overlay Viewport Fills Entire Screen on Mobile
At 375×812 viewport (iPhone X), the search overlay covers the full screen including the area behind the bottom tab bar. No content from the underlying page is visible or interactive. The overlay has proper safe-area padding (no content hidden under notch or home indicator).
Evidence: screenshot(375×812 viewport, full-screen overlay, no bleed-through)

### VAL-SEARCH-028: Search Overlay Scrollable When Many Results
When a search query returns more results than fit in the viewport (e.g., a broad query matching many items), the results list is scrollable within the overlay. Scrolling is smooth and does not scroll the underlying page.
Evidence: screenshot(scrolled results list, underlying page static)

### VAL-SEARCH-029: Bottom Tab Bar Hidden or Behind Overlay
When the search overlay is open, the bottom tab navigation bar is either hidden or completely obscured by the overlay. Tapping the bottom area does NOT activate tab navigation while the overlay is open.
Evidence: screenshot(no tab bar visible or tappable during search)

### VAL-SEARCH-030: Search Query Preserved on Navigate Back
After typing a query, tapping a result to navigate to a detail page, then pressing back to return — the search overlay re-opens (or the search state is accessible) with the previous query still populated. The user does not have to retype their search.
Evidence: screenshot(search overlay with previous query after back navigation)

### VAL-SEARCH-031: Trending Items Are Tappable and Navigate Correctly
Tapping a trending item navigates to the correct detail page (`/products/[id]` for products or `/events/[id]` for events). The detail page loads with matching content. The search overlay dismisses.
Evidence: screenshot(detail page after tapping trending item), network(correct API call)

### VAL-SEARCH-032: Search Works for Partial Matches
Typing "bra" matches products/events containing "Brazil" (partial prefix match). Results include at least one item with "Brazil" or "bra" in the name. Partial mid-word matches also work (e.g., "azil" matches "Brazil").
Evidence: network(`GET /api/search?q=bra` returns items containing "bra")

### VAL-SEARCH-033: Search Results Have Correct Navigation URLs
Each search result links to the correct detail route. Product results link to `/products/<product-id>`. Event results link to `/events/<event-id>`. No broken links (404s) when tapping results.
Evidence: network(no 404 on navigation), console-errors(none)

### VAL-SEARCH-034: No Console Errors During Search Flow
Complete flow — open overlay → view trending → type query → view results → tap result → navigate to detail → press back — produces zero `console.error` or unhandled exceptions in the browser console.
Evidence: console-errors(none throughout entire flow)

### VAL-SEARCH-035: Search Overlay Has Accessible Focus Management
When the overlay opens, focus moves to the search input (screen reader announces the input). When the overlay closes, focus returns to the element that triggered it (the search bar). Tab order within the overlay cycles through input → results → close button without escaping to the underlying page.
Evidence: screenshot(focus ring on input), console-errors(no a11y violations)

### VAL-SEARCH-036: Search Overlay Escape Key Closes (Desktop)
On desktop viewport, pressing the `Escape` key while the search overlay is open closes the overlay and returns focus to the search bar on the main page.
Evidence: screenshot(overlay closed after Escape key press)

### VAL-SEARCH-037: Search Overlay Animation Is Smooth
The search overlay opens and closes with a visible animation/transition (e.g., slide-up, fade-in). The animation completes without janky frames. Opening and closing transitions are both present and smooth (no abrupt pop-in or pop-out).
Evidence: screenshot(mid-transition frame showing animation in progress)

### VAL-SEARCH-038: Search API Handles Concurrent Requests
Rapidly opening search, typing "a", clearing, typing "b", clearing, typing "c" does not produce stale results. The final displayed results correspond to the final query "c" — not to an earlier query whose response arrived late (race condition prevention).
Evidence: screenshot(results match final query "c"), network(responses arrive in order or stale ones discarded)

### VAL-SEARCH-039: Product Results Show Listing Intelligence Badges
Product search results that have `isBestValue`, `isSellingFast`, or low `remainingQty` (near `urgencyThreshold`) show the corresponding listing intelligence badge(s) (Best Value, Selling Fast, Only X Left) in the autocomplete results or at minimum on the linked detail page.
Evidence: screenshot(badge visible on result or detail page)

### VAL-SEARCH-040: Event Results Differentiate by Type Visually
In search results, football events, basketball events, and concert events are visually distinguishable — via an icon (Trophy/🏀/Music), color accent, or explicit type label. A user can tell at a glance which category each event belongs to.
Evidence: screenshot(different visual treatment per event type)

### VAL-SEARCH-041: Search Works on 320px Width Viewport
At the minimum reasonable mobile width (320×568, iPhone SE), the search overlay renders correctly. The input field is fully visible, results are readable (not truncated or overflowing), and the close button is tappable. No horizontal scroll appears.
Evidence: screenshot(320×568 viewport, no overflow, all elements accessible)

### VAL-SEARCH-042: Search Works on Tablet Viewport
At 768×1024 viewport (iPad), the search overlay renders properly. Content is appropriately sized (not stretched too wide). The overlay may be centered or full-width but must remain usable and visually balanced.
Evidence: screenshot(768×1024 viewport, overlay properly rendered)

### VAL-SEARCH-043: Search Overlay Does Not Persist Across Tab Navigation
If the user opens the search overlay then taps a bottom tab (if accessible) or navigates via URL to a different tab page (e.g., `/football`), the search overlay should not remain open on the new page. Each page's search starts fresh.
Evidence: screenshot(new page loaded without residual overlay)

### VAL-SEARCH-044: Search with Whitespace-Only Query Shows Trending
Typing only spaces in the search input (e.g., "   ") is treated as empty — trending/popular items are shown instead of firing an API call for whitespace. No error state is displayed.
Evidence: screenshot(trending items shown for whitespace query), network(no `/api/search?q=%20%20%20` call or call returns trending)

### VAL-SEARCH-045: Search API Response Time Under 500ms
`GET /api/search?q=jersey` completes within 500ms on localhost. The response is not artificially delayed. User-perceived latency from typing to seeing results is under 800ms (including debounce).
Evidence: network(response time < 500ms for `/api/search`)

### VAL-SEARCH-046: Search Overlay Prevents Body Scroll
While the search overlay is open, scrolling within the overlay does NOT scroll the page body behind it. The body scroll is locked. Closing the overlay restores normal page scrolling.
Evidence: screenshot(body scroll position unchanged after scrolling in overlay)

### VAL-SEARCH-047: Trending Items Reflect Actual Database Content
The trending/popular items shown before typing correspond to real items in the database (products and events from the seed data). They are not hardcoded placeholder text. Tapping any trending item navigates to a valid detail page that loads real data.
Evidence: network(trending items match seeded data), screenshot(detail page with real content)

### VAL-SEARCH-048: Search Result Count or Summary Shown
When results are returned, a count or summary is visible (e.g., "3 products, 2 events found" or section headers showing counts). The user can gauge how many matches exist at a glance. If counts are not shown, at minimum section labels ("Products", "Events") with visible item counts pass this check.
Evidence: screenshot(result count or section headers visible)

### VAL-SEARCH-049: Empty Search Overlay Has No Layout Shift
Opening the search overlay and viewing trending items, then typing a query that returns results, then clearing the query — the layout does not "jump" or shift unexpectedly. Transitions between trending → results → trending are smooth with no content flash.
Evidence: screenshot(no visible layout jump during state transitions)

### VAL-SEARCH-050: Search Does Not Break Navigation State
After using search to navigate to a detail page and pressing back multiple times, the browser history stack is correct. The user can navigate back to the original page they started from. No infinite loops or duplicate history entries are created by the search overlay.
Evidence: screenshot(correct page after multiple back presses), console-errors(none)
