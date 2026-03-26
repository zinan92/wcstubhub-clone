# Marketplace Trust

Trust architecture and StubHub-like marketplace guidance for this mission.

## What belongs here
- Buyer Protection wording
- badge semantics (Verified, Official, Secure Delivery, Buyer Protected)
- listing intelligence semantics (Best Value, Selling Fast, Only X left)
- guest-browse vs auth-required boundary decisions

## Listing Intelligence Fields

Product and Event models include intelligence fields:
- `isBestValue` (Boolean, default false)
- `isSellingFast` (Boolean, default false)
- `urgencyThreshold` (Int?, nullable)

These fields are returned by all API routes that query Products/Events (no explicit `select` clauses are used). The `ListingIntelligenceBadges` component at `components/listing-intelligence/ListingIntelligenceBadges.tsx` renders badges based on these props plus `remainingQty` comparison against `urgencyThreshold` for "Only X left" urgency.

⚠️ Future workers adding `select` clauses to Product/Event queries must include these fields to avoid breaking browse card intelligence badges.

## Notes
- Trust signals should appear before login is required.
- Pseudo transaction states shown in UI must be backed by persisted data.
