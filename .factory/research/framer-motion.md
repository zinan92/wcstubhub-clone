# Framer Motion / Motion for React — Research Findings

**Date:** 2026-03-26
**Sources:** motion.dev official docs, npm registry, StackOverflow, inhaq.com 2026 guide, GitHub issues

---

## 1. Package Name & Current Status

### The package has been renamed from `framer-motion` to `motion`

- **Current package:** `motion` (v12.38.0 as of March 2026)
- **Legacy package:** `framer-motion` (still published, same version 12.38.0, still maintained)
- **Both packages are identical** — `framer-motion` is kept for backward compatibility
- **New import path:** `import { motion } from "motion/react"` (replaces `import { motion } from "framer-motion"`)
- **For new projects:** Use `npm install motion` and import from `"motion/react"`
- **For existing projects:** `framer-motion` imports still work, migration is just swapping import paths

### Migration Steps (from framer-motion to motion)
```bash
npm install motion
npm uninstall framer-motion
```
```tsx
// Before:
import { motion, AnimatePresence } from "framer-motion";
// After:
import { motion, AnimatePresence } from "motion/react";
```

---

## 2. React 19 & Next.js 15 Compatibility

### React 19 Support
- **Motion v12.x supports React 18.2+ and React 19** ✅
- Earlier versions (v11 and below) only supported React 18
- There was a known incompatibility issue (GitHub #2668) that was resolved in v12
- v12 was released specifically to add React 19 support (initially as alpha, now stable)

### Next.js 15 Support
- **Fully compatible with Next.js 15 App Router** ✅
- Supports both Pages Router and App Router
- SSR-compatible — initial state is reflected in server-generated output

### Version Compatibility Matrix
| Motion Version | React Support | Notes |
|---|---|---|
| v12.x (current) | React 18.2 - 19 | Recommended for new projects |
| v11.x | React 18 | Stable, production-ready |
| v10.x | React 18 | Minimum for useAnimate, LazyMotion improvements |

---

## 3. "use client" & Server Components

### Critical: Motion components MUST be client components

Motion components use browser APIs and React hooks internally, so they require `"use client"`.

**Two approaches for Next.js App Router:**

#### Approach A: Add "use client" to the importing file (most common)
```tsx
"use client";
import { motion } from "motion/react";

export default function MyComponent() {
  return <motion.div animate={{ scale: 1.5 }} />;
}
```

#### Approach B: Use "motion/react-client" import (reduces client JS)
```tsx
// No "use client" needed in this file
import * as motion from "motion/react-client";

export default function MyComponent() {
  return <motion.div animate={{ scale: 1.5 }} />;
}
```

### Gotchas
- Forgetting `"use client"` causes cryptic errors about hooks being used outside of component context
- Any component that uses `motion.*`, `AnimatePresence`, `useAnimate`, etc. must be a client component
- Server Components CAN import and render client components that use motion — the boundary just needs to be correct
- `layout.tsx` remains a Server Component; wrap animated children in a separate client component

---

## 4. Page Transitions in Next.js App Router

### This is the HARDEST part of using Motion with App Router

There are **two approaches**, each with trade-offs:

### Approach A: `template.tsx` (Recommended for simplicity — enter animations only)

Next.js `template.tsx` creates a new instance for each route change, naturally triggering mount animations:

```tsx
// app/template.tsx
"use client";
import { motion } from "motion/react";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ ease: "easeInOut", duration: 0.75 }}
    >
      {children}
    </motion.div>
  );
}
```

**Pros:**
- Simple, clean, officially supported Next.js pattern
- Works with Server Components (template itself is client, children can be server)
- Can have different templates per route group
- No hacks or workarounds needed

**Cons:**
- **No exit animations** — only enter/mount animations work
- The old page disappears instantly before the new one animates in

### Approach B: FrozenRouter + AnimatePresence (Full enter + exit animations)

This is a **workaround** for a known Next.js App Router limitation ([vercel/next.js#49279](https://github.com/vercel/next.js/issues/49279)).

```tsx
"use client";
import { motion, AnimatePresence } from "motion/react";
import { usePathname } from "next/navigation";
import { LayoutRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useContext, useRef } from "react";

function FrozenRouter(props: { children: React.ReactNode }) {
  const context = useContext(LayoutRouterContext ?? {});
  const frozen = useRef(context).current;
  return (
    <LayoutRouterContext.Provider value={frozen}>
      {props.children}
    </LayoutRouterContext.Provider>
  );
}

const variants = {
  hidden: { opacity: 0 },
  enter: { opacity: 1 },
  exit: { opacity: 0 },
};

export default function PageTransitionEffect({ children }: { children: React.ReactNode }) {
  const key = usePathname();
  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        key={key}
        initial="hidden"
        animate="enter"
        exit="exit"
        variants={variants}
        transition={{ duration: 0.3 }}
      >
        <FrozenRouter>{children}</FrozenRouter>
      </motion.div>
    </AnimatePresence>
  );
}
```

**Pros:**
- Full enter AND exit animations
- Feels like a real page transition

**Cons:**
- Uses internal Next.js API (`LayoutRouterContext`) — may break on upgrades
- Known warning: "Detected multiple renderers concurrently rendering the same context provider"
- The FrozenRouter pattern is a community workaround, not officially supported
- Can have issues with browser back/forward navigation

### Recommendation
- **For most apps:** Use `template.tsx` with enter-only animations. It's simpler and more reliable.
- **If exit animations are critical:** Use the FrozenRouter pattern but be aware it's fragile.
- **Alternative:** Consider the native View Transitions API for simple cross-fades (browser support improving).

---

## 5. Best Patterns for Common Animations

### Modal Animations
```tsx
const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1, scale: 1, y: 0,
    transition: { type: "spring", damping: 25, stiffness: 300 },
  },
  exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } },
};

export function Modal({ isOpen, onClose, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div key="backdrop" variants={backdropVariants}
            initial="hidden" animate="visible" exit="hidden"
            onClick={onClose} className="fixed inset-0 z-40 bg-black/50" />
          <motion.div key="modal" variants={modalVariants}
            initial="hidden" animate="visible" exit="exit"
            className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
```

### List Item Animations (Staggered)
```tsx
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function StaggeredList({ items }) {
  return (
    <motion.ul variants={containerVariants} initial="hidden" animate="visible">
      {items.map((item) => (
        <motion.li key={item.id} variants={itemVariants}>
          {item.name}
        </motion.li>
      ))}
    </motion.ul>
  );
}
```

### Animated List Item Removal
```tsx
<AnimatePresence mode="popLayout">
  {items.map((item) => (
    <motion.div
      key={item.id}
      layout
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
    >
      {item.content}
    </motion.div>
  ))}
</AnimatePresence>
```

### Tab Switching
```tsx
// Use layoutId for the active indicator
{tabs.map((tab) => (
  <button key={tab.id} onClick={() => setActiveTab(tab.id)}>
    {tab.label}
    {activeTab === tab.id && (
      <motion.div layoutId="activeTab" className="absolute bottom-0 h-0.5 bg-blue-500 w-full" />
    )}
  </button>
))}

// Use AnimatePresence for tab content
<AnimatePresence mode="wait">
  <motion.div
    key={activeTab}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.2 }}
  >
    {tabContent}
  </motion.div>
</AnimatePresence>
```

### Skeleton-to-Content Transition
```tsx
<AnimatePresence mode="wait">
  {isLoading ? (
    <motion.div
      key="skeleton"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Skeleton />
    </motion.div>
  ) : (
    <motion.div
      key="content"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <ActualContent data={data} />
    </motion.div>
  )}
</AnimatePresence>
```

---

## 6. Performance Best Practices

### Animate Only Transform & Opacity
- **S-Tier (compositor-only):** `x`, `y`, `scale`, `rotate`, `opacity` — 60fps, GPU-accelerated
- **D-Tier (triggers layout):** `width`, `height`, `margin`, `padding` — causes jank

### Use `layout` Prop Instead of Animating Dimensions
```tsx
// ❌ Bad: Animating width triggers layout every frame
<motion.div animate={{ width: isExpanded ? 400 : 200 }} />

// ✅ Good: Use layout prop for automatic transform-based animation
<motion.div layout style={{ width: isExpanded ? 400 : 200 }} />
```

### LazyMotion for Bundle Size
- Full motion: ~30kb
- With `LazyMotion` + `domAnimation`: ~15kb
```tsx
import { LazyMotion, domAnimation, m } from "motion/react";

export function App({ children }) {
  return (
    <LazyMotion features={domAnimation}>
      <m.div animate={{ opacity: 1 }} /> {/* Use m instead of motion */}
    </LazyMotion>
  );
}
```

### Accessibility: Reduced Motion
```tsx
import { MotionConfig } from "motion/react";

// Wrap app to auto-respect user's reduced motion preference
<MotionConfig reducedMotion="user">
  {children}
</MotionConfig>
```

Or per-component:
```tsx
import { useReducedMotion } from "motion/react";

function Component() {
  const shouldReduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -100 }}
      animate={{ opacity: 1, x: 0 }}
    />
  );
}
```

---

## 7. Key Gotchas & Known Issues

1. **AnimatePresence requires 3 things:** (a) wraps the conditional, (b) unique `key` on the motion child, (c) motion component is a direct child
2. **Page exit animations are not natively supported** in Next.js App Router — requires FrozenRouter workaround
3. **`layout` animations + `position: fixed`** — need `layoutRoot` on the fixed container
4. **`layout` animations in scrollable containers** — need `layoutScroll` on the scroll container
5. **Hydration mismatches** can occur with layout animations; `data-projection-id` may differ between server and client
6. **Don't call `motion.create()` inside render** — creates new component every render, breaking animations
7. **React 19 `ref` handling:** `forwardRef` is no longer needed in React 19; pass ref via props instead
8. **`exitBeforeEnter` is removed** — use `mode="wait"` on AnimatePresence instead

---

## 8. Recommendation for This Project

For a StubHub clone with Next.js 15 App Router:

1. **Install `motion` package** (the new name), import from `"motion/react"`
2. **Use `template.tsx`** for page enter animations (simple, reliable)
3. **Use `AnimatePresence`** for modals, drawers, toast notifications
4. **Use `layoutId`** for shared element transitions (e.g., event card → event detail)
5. **Use variants with `staggerChildren`** for list animations (event listings, search results)
6. **Use `whileInView`** for scroll-triggered entrance animations
7. **Wrap animated components with `"use client"`** — keep the boundary narrow
8. **Use `MotionConfig reducedMotion="user"`** at the app level for accessibility
9. **Stick to transform/opacity animations** for 60fps performance
10. **Consider `LazyMotion`** if bundle size becomes a concern
