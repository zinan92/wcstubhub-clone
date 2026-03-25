---
name: ui-worker
description: Worker for visual/UX overhaul features - styling, animations, images, and polish
---

# UI Worker

NOTE: Startup and cleanup are handled by `worker-base`. This skill defines the WORK PROCEDURE.

## When to Use This Skill

Use for all features in the visual/UX overhaul mission: design system setup, image replacement, animation implementation, page visual polish, and cross-area integration.

## Required Skills

- **agent-browser**: MUST invoke for visual verification on every feature. Use to take screenshots at 375px viewport, verify animations, check layout, and test interactions. Invoke at the start of your verification phase.

## Work Procedure

### Step 1: Understand the Feature
Read the feature description, preconditions, and expectedBehavior carefully. Read AGENTS.md for coding conventions (especially Motion patterns, Tailwind tokens, Next.js Image usage).

### Step 2: Read Relevant Code
Read all files you'll modify. Understand current patterns before changing them. Check `.factory/library/architecture.md` for architectural decisions.

### Step 3: Write Tests First (TDD)
For new components (Button, Modal, Toast, Skeleton):
- Write render tests that verify the component mounts, accepts props, and has correct structure
- Tests go in `__tests__/` directory following existing patterns
- Run tests to confirm they fail (red phase)

For visual changes to existing components:
- Check existing tests. If they test specific class names you're changing, note which tests need updating.
- Update tests AFTER implementation to match new classes (but before verification).

### Step 4: Implement
Make the changes specified in the feature description. Follow AGENTS.md conventions strictly:
- Use `m` components (not `motion`) inside LazyMotion
- Import from `"motion/react"`
- Use semantic Tailwind tokens, NEVER arbitrary hex values
- Use Next.js `<Image>`, NEVER raw `<img>`
- Animate only transform/opacity for 60fps

### Step 5: Run Automated Checks
```bash
npx vitest run          # All tests pass
pnpm typecheck          # Zero errors
pnpm lint               # Zero errors
```
Fix any failures before proceeding.

### Step 6: Visual Verification with agent-browser
This is CRITICAL for a visual overhaul mission. Every feature must be visually verified.

```bash
# Start dev server if not running
PORT=3100 pnpm dev &
sleep 5

# Set mobile viewport
agent-browser set viewport 375 812

# Navigate and screenshot each affected page
agent-browser open http://localhost:3100/[page]
agent-browser wait --load networkidle
agent-browser screenshot /tmp/verify-[page].png
```

For each page you modified:
1. Take a screenshot at 375px width
2. Verify the visual change is visible and correct
3. Check for horizontal overflow (page should not scroll horizontally)
4. Test any interactions (press states, modals, toasts)
5. Record each check as an `interactiveChecks` entry

### Step 7: Commit
Commit all changes with a descriptive message.

## Example Handoff

```json
{
  "salientSummary": "Implemented shared Button component with whileTap scale(0.97), 4 variants (primary/secondary/outline/ghost), and replaced inline buttons on login page. Added 6 render tests. Verified at 375px viewport: press feedback visible, button sizing >= 44px, gradient renders correctly.",
  "whatWasImplemented": "Created components/ui/Button.tsx with m.button from motion/react, whileTap={{ scale: 0.97 }}, variant prop supporting primary (gradient bg), secondary (solid bg), outline (border only), ghost (transparent). TypeScript interface with variant, size, disabled, loading props. Replaced <button> elements on /login page with shared Button. Added corresponding tests in __tests__/components/ui/Button.test.tsx.",
  "whatWasLeftUndone": "",
  "verification": {
    "commandsRun": [
      { "command": "npx vitest run", "exitCode": 0, "observation": "256 tests pass, including 6 new Button tests" },
      { "command": "pnpm typecheck", "exitCode": 0, "observation": "Zero type errors" },
      { "command": "pnpm lint", "exitCode": 0, "observation": "Zero lint errors" }
    ],
    "interactiveChecks": [
      { "action": "Set viewport 375x812, navigated to /login", "observed": "Login button renders with gradient background, rounded-xl, proper text color" },
      { "action": "Clicked login button", "observed": "Button scales down to 0.97 on press, springs back on release. Smooth 100ms transition." },
      { "action": "Checked button dimensions", "observed": "Button height 48px, width 100%, exceeds 44px minimum touch target" }
    ]
  },
  "tests": {
    "added": [
      {
        "file": "__tests__/components/ui/Button.test.tsx",
        "cases": [
          { "name": "renders primary variant with gradient", "verifies": "Button renders with primary gradient classes" },
          { "name": "renders outline variant with border", "verifies": "Button renders with border and no background" },
          { "name": "applies whileTap animation prop", "verifies": "m.button has whileTap prop" },
          { "name": "forwards onClick handler", "verifies": "Click events propagate" },
          { "name": "shows loading state", "verifies": "Loading spinner visible when loading=true" },
          { "name": "disables when disabled prop", "verifies": "Button is disabled and has opacity" }
        ]
      }
    ],
    "coverage": "6 new tests for Button component"
  },
  "discoveredIssues": []
}
```

## When to Return to Orchestrator

- A test fails that you cannot fix without changing API behavior (off-limits)
- An image URL is broken and you need guidance on alternative sources
- A Tailwind token doesn't exist in the config and you need it added by the foundation feature
- An existing component pattern conflicts with the requested design approach
- motion/framer-motion has compatibility issues with the current React/Next.js version
