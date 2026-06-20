# Twitter/X Design System — MUI Monorepo

A pixel-perfect Twitter/X design system built on MUI v5, following the
**MUI Shared-Theme Architecture** with a clean pnpm monorepo structure.

---

## Monorepo Structure

```
twitter-design-system/
├── packages/
│   ├── tokens/                    # @twitter-ds/tokens
│   │   └── src/
│   │       ├── colors.ts          # All colour values + semantic maps
│   │       ├── typography.ts      # Font, size, weight, line-height tokens
│   │       ├── layout.ts          # Spacing, radius, shadows, breakpoints, motion, z-index
│   │       └── index.ts           # Public barrel
│   │
│   ├── theme/                     # @twitter-ds/theme
│   │   └── src/
│   │       ├── shared-theme/
│   │       │   ├── themePrimitives.ts        # Maps tokens → MUI palette/typography/shape
│   │       │   ├── AppTheme.tsx              # ThemeProvider + ColorModeContext
│   │       │   └── customizations/
│   │       │       ├── inputs.ts             # Button, TextField, Switch, Checkbox…
│   │       │       ├── navigation.ts         # Tabs, AppBar, Drawer, BottomNav…
│   │       │       ├── surfaces.ts           # Card, Paper, Divider, CssBaseline
│   │       │       ├── feedback.ts           # Dialog, Snackbar, Alert, Skeleton…
│   │       │       ├── dataDisplay.ts        # Avatar, Chip, List, Popover, Table…
│   │       │       └── index.ts              # Merges all slices → getCustomizations()
│   │       └── index.ts           # Public API
│   │
│   └── ui/                        # @twitter-ds/ui
│       └── src/
│           ├── components/
│           │   ├── TweetCard.tsx      # Tweet card with actions, media, verified badge
│           │   ├── TweetComposer.tsx  # Compose area with char counter
│           │   ├── TweetSkeleton.tsx  # Loading skeleton matching TweetCard layout
│           │   ├── TwitterButton.tsx  # follow / following / primary / danger variants
│           │   ├── UserCard.tsx       # "Who to follow" card
│           │   └── SidebarNav.tsx     # Left sidebar, responsive (full/compact)
│           └── index.ts           # Public barrel
│
└── apps/
    └── demo/                      # Vite + React demo app
        └── src/
            ├── App.tsx            # Full three-column Twitter layout
            └── main.tsx
```

---

## Two-Layer Architecture

```
┌─────────────────────────────────────────────────────┐
│  EXTENSIONS / UI LAYER  (@twitter-ds/ui)            │
│  TweetCard · TweetComposer · SidebarNav · UserCard  │
│  → Consumes theme tokens. Never defines them.       │
├─────────────────────────────────────────────────────┤
│  THEME LAYER  (@twitter-ds/theme)                   │
│  shared-theme/AppTheme  +  customizations/          │
│  → No layout logic. No business logic.              │
├─────────────────────────────────────────────────────┤
│  TOKENS  (@twitter-ds/tokens)                       │
│  Raw values: colours, type scale, spacing, motion   │
│  → Zero framework dependency.                       │
└─────────────────────────────────────────────────────┘
```

**Rule**: Each layer only imports from the layer below it. Never upward.

---

## Getting Started

```bash
# Install dependencies (pnpm workspaces)
pnpm install

# Run the demo app
cd apps/demo
pnpm dev

# Build all packages
pnpm build
```

---

## Usage in Your App

```tsx
// 1. Wrap your app with AppTheme
import AppTheme from '@twitter-ds/theme';

export default function Root() {
  return (
    <AppTheme defaultMode="light">
      <YourApp />
    </AppTheme>
  );
}

// 2. Toggle dark mode from any child
import { useColorMode } from '@twitter-ds/theme';

function DarkModeToggle() {
  const { mode, toggleMode } = useColorMode();
  return <button onClick={toggleMode}>Switch to {mode === 'light' ? 'dark' : 'light'}</button>;
}

// 3. Use components
import { TweetCard, TweetComposer, TwitterButton } from '@twitter-ds/ui';

// 4. Use raw tokens for custom components
import { blue, neutral, borderRadius } from '@twitter-ds/tokens';
```

---

## Pixel-Perfect Spec

### Measurements reverse-engineered from twitter.com

| Element | Value |
|---------|-------|
| Base font size | 15px |
| H1 font size | 31px / weight 900 |
| H2 font size | 23px / weight 800 |
| Tweet body | 15px / weight 400 / lh 1.5 |
| Avatar (feed) | 40×40px |
| Avatar (reply) | 32×32px |
| Tweet card padding | 12px 16px |
| Nav item height | 52px |
| Tab height | 53px |
| Tab indicator | 4px / radius 2px top |
| Button border-radius | 9999px (pill) |
| Card border-radius | 0px (feed) / 16px (panel) |
| Sidebar width (lg+) | 275px |
| Sidebar width (md) | 88px |
| Feed max-width | 600px |
| Right sidebar width | 350px |
| AppBar blur | backdrop-filter: blur(12px) |
| Action hover zone | 36×36px circular |

### Motion

| Property | Value |
|---------|-------|
| Default transition | 150ms ease-in-out |
| Scale on press | 0.98 |
| Reduced-motion | All transitions → none |

---

## Accessibility

- All interactive elements have `:focus-visible` ring (`2px solid #1DA1F2`)
- Button scale animations respect `prefers-reduced-motion`
- Avatar and verified badges have `aria-label`
- Feed has `role="feed"` + `aria-label`
- Composer textarea has `aria-label` matching placeholder
- Character counter has `aria-label` for screen readers
- Nav items have `aria-current="page"` on active route

---

## Extending the Theme

### Add a new component customization

```ts
// packages/theme/src/shared-theme/customizations/mySlice.ts
import type { Theme, Components } from '@mui/material/styles';

export default function mySlice(theme: Theme): Components {
  return {
    MuiChip: {
      styleOverrides: {
        root: { /* your overrides */ },
      },
    },
  };
}
```

```ts
// customizations/index.ts — add to getCustomizations()
import mySlice from './mySlice';

export function getCustomizations(theme: Theme): Components {
  return {
    ...mySlice(theme),
    // … existing slices
  };
}
```

### Add a new design token

```ts
// packages/tokens/src/colors.ts
export const purple = {
  500: '#7856FF',
} as const;
```

Then export from `packages/tokens/src/index.ts` and use in theme slices.

---

## Package Dependency Graph

```
@twitter-ds/tokens
       ↑
@twitter-ds/theme  ← depends on tokens
       ↑
@twitter-ds/ui     ← depends on tokens + theme
       ↑
apps/demo          ← depends on all three
```
