# My Korean Birdie Design System

Version: 0.1  
Status: Initial extraction from working frontend

This document defines the UI architecture and reusable components for the My Korean Birdie frontend.

The goal is to:
- simplify frontend code
- prevent UI duplication
- centralize branding (Magpie bird)
- enable reuse across future apps

This design system lives inside the monorepo under:

packages/design-system

Applications consume it via:

import { Button, LessonCard } from "@birdie/ui"

---

# Monorepo Structure

Root layout:

/apps
/web            → main learning app
/admin          → optional future admin UI

/packages
/design-system  → shared UI library

/docs
design-system.md

---

# Package Structure

packages/design-system/

src/
tokens/
colors.ts
spacing.ts
radius.ts
shadows.ts
typography.ts

icons/
BirdIcon.tsx
LessonStatusIcon.tsx

primitives/
Button.tsx
Badge.tsx
Card.tsx
Icon.tsx
Container.tsx

components/
LessonCard.tsx
ActivityCard.tsx
ProgressCard.tsx
SectionHeader.tsx
WeakAreaCard.tsx

patterns/
LessonList.tsx
ActivityGrid.tsx
DashboardLayout.tsx

styles/
globals.css

index.ts

---

# Design Tokens

All visual constants come from `@theme` in `apps/web/src/index.css` (Tailwind v4).

## Colors — "Korean Notebook" palette

Five semantic color scales, each with 50–950 shades:

| Token prefix  | Korean name       | Role                        | Key shade (500)  |
|---------------|-------------------|-----------------------------|------------------|
| `namsaek`     | 남색 Korean indigo | Primary actions, nav, links | `#2B4C7E`        |
| `cheongja`    | 청자 Celadon green | Success, mastery, XP bar    | `#3D8F7D`        |
| `dancheong`   | 단청 Coral-red     | Errors, wrong answers       | `#C75B4A`        |
| `geum`        | 금색 Gold          | XP, streaks, coins          | `#A67D30`        |
| `hanji`       | 한지 Warm paper    | Backgrounds, borders, text  | `#A89885`        |

Full shade range (50–950) defined per scale in `apps/web/src/index.css`. Usage:

- Light background: `bg-hanji-100` / Dark: `dark:bg-namsaek-950`
- Card surface: `bg-white` / Dark: `dark:bg-namsaek-900`
- Borders: `border-hanji-300` / Dark: `dark:border-namsaek-700`
- Body text: `text-namsaek-900` / Dark: `dark:text-hanji-200`

## Typography

```css
font-family: "Inter", "Pretendard", system-ui, -apple-system, sans-serif;
```

| Scale      | Tailwind class | Use                              |
|------------|---------------|----------------------------------|
| 12px       | `text-xs`     | Labels, keyboard hints, footnotes |
| 14px       | `text-sm`     | Body, descriptions               |
| 16px       | `text-base`   | Standard body                    |
| 18px       | `text-lg`     | Sub-headings                     |
| 20px       | `text-xl`     | Page titles                      |
| 24px       | `text-2xl`    | Scores, major prompts            |
| 36px       | `text-4xl`    | Flashcard Korean text            |

Weights: `font-normal` (400), `font-medium` (500), `font-semibold` (600), `font-bold` (700 — rare).

## Border Radius

| Tailwind class | Value | Use                              |
|----------------|-------|----------------------------------|
| `rounded-lg`   | 8px   | Tags, small badges               |
| `rounded-xl`   | 12px  | Buttons, inputs, small cards     |
| `rounded-2xl`  | 16px  | Medium cards, modals, icon wraps |
| `rounded-3xl`  | 24px  | Large content cards, PromptCard  |
| `rounded-full` | 50%   | Avatars, circular badges         |

## Spacing

Tailwind 4px base grid. Common values: `gap-1.5`, `gap-2`, `gap-3`, `gap-4`, `gap-6`, `p-2`–`p-6`.

## Shadows

| Class       | Use                        |
|-------------|----------------------------|
| `shadow-sm` | Cards, buttons (default)   |
| `shadow-md` | Hover states               |
| `shadow-lg` | Floating elements (toast)  |

## Borders

- Default: `border` (1px) + `border-hanji-300` / `dark:border-namsaek-700`
- Accent: `border-namsaek-300`, `border-cheongja-200`, `border-dancheong-200`
- Dashed: `border-2 border-dashed` (sentence builder drop zone)

---

# Icon System

Icons: `lucide-react` library. Common sizes: `h-4 w-4`, `h-5 w-5`, `h-9 w-9`.

Bird icon: 28x17 natural aspect ratio (custom magpie SVG).

---

# Dark Mode

Strategy: class-based via `@custom-variant dark (&:where(.dark, .dark *))` (Tailwind v4).

Toggle: `document.documentElement.classList.add/remove("dark")`, persisted to `localStorage("theme")`.
Falls back to `prefers-color-scheme: dark`.

Smooth transition: `html.transitioning` class applies `transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease`.

Common mappings:

| Light               | Dark                        |
|----------------------|-----------------------------|
| `bg-hanji-100`       | `dark:bg-namsaek-950`       |
| `bg-white`           | `dark:bg-namsaek-900`       |
| `border-hanji-300`   | `dark:border-namsaek-700`   |
| `text-namsaek-900`   | `dark:text-hanji-200`       |
| `text-namsaek-500`   | `dark:text-cheongja-400`    |

---

# Animation

Uses `framer-motion`. Standard patterns:

- **Toast/overlay:** `initial={{ opacity: 0, y: 18 }}` / `animate={{ opacity: 1, y: 0 }}` / `duration: 0.15`
- **Page transition:** `initial={{ opacity: 0, y: 8 }}` / `exit={{ opacity: 0, y: -8 }}` / `duration: 0.18`
- **Hover lift:** `hover:-translate-y-0.5 hover:shadow-md`
- **Feedback auto-hide:** 750–900ms timeout

---

# Bird Branding Rules

The magpie represents progress.

Use bird icon ONLY for:

completed lesson
milestones
achievement states

Never use bird for:

navigation
neutral UI
input icons

---

# Component Standards

Each component must:

- be stateless (or use props-driven local state)
- accept props only, no API logic
- support className overrides where needed
- support both light and dark mode via Tailwind variants

---

# Core Game UI (`apps/web/src/features/learn/games/_core/ui/`)

## PromptCard

Main question/prompt display.

- Container: `rounded-3xl border border-hanji-300 bg-hanji-50 p-5`
- Dark: `dark:border-namsaek-700 dark:bg-namsaek-950/40`
- Title label: `text-xs font-semibold text-hanji-500`
- Main text: `text-4xl font-semibold tracking-tight`

## ChoiceGrid

2-column answer grid with keyboard shortcuts (1–4).

- Container: `grid grid-cols-2 gap-3`
- Button: `rounded-3xl border p-4 shadow-sm`
- Hover: `hover:-translate-y-0.5 hover:border-namsaek-300 hover:shadow-md`
- Correct: `border-cheongja-400 bg-cheongja-50 text-cheongja-700`
- Wrong: `border-dancheong-300 bg-dancheong-50 text-dancheong-700`
- Key badge: `rounded-2xl bg-hanji-100 px-2 py-1 text-xs font-semibold`

## FeedbackToast

Fixed-position toast after answer.

- Position: `fixed bottom-6 left-1/2 z-50`
- Container: `rounded-2xl border px-4 py-3 shadow-lg`
- Success: `border-cheongja-200 bg-cheongja-50`
- Error: `border-dancheong-200 bg-dancheong-50`
- Animates in/out with framer-motion (opacity + y:18)

## ProgressDots

Horizontal dot progress indicator.

- Dot: `h-2.5 w-2.5 rounded-full`
- Current: `bg-namsaek-500` / `dark:bg-cheongja-400`
- Done: `bg-cheongja-400` / `dark:bg-cheongja-600`
- Pending: `bg-hanji-200` / `dark:bg-namsaek-700`

## AudioButton

TTS trigger button.

- `rounded-2xl border border-hanji-300 bg-white px-3 py-2 shadow-sm`

---

# Button Styles

| Variant       | Classes                                                                     |
|---------------|-----------------------------------------------------------------------------|
| Primary       | `bg-namsaek-500 text-hanji-50 px-4 py-3 text-sm font-semibold shadow-sm`   |
| Secondary     | `border border-hanji-300 bg-white rounded-2xl px-3 py-2 text-xs shadow-sm` |
| Nav active    | `rounded-xl px-3 py-2 bg-namsaek-500 text-hanji-50 text-sm font-medium`   |
| Nav inactive  | `text-namsaek-600 hover:bg-hanji-200`                                       |
| Disabled      | `opacity-50 cursor-not-allowed`                                             |

---

# Semantic Color Usage in Games

Flashcard grade buttons (4-col):

| Grade  | Border             | Background       | Text               |
|--------|--------------------|------------------|---------------------|
| Again  | `dancheong-200`    | `dancheong-50`   | `dancheong-700`     |
| Hard   | `geum-200`         | `geum-50`        | `geum-700`          |
| Good   | `cheongja-200`     | `cheongja-50`    | `cheongja-700`      |
| Easy   | `namsaek-200`      | `namsaek-50`     | `namsaek-700`       |

Sentence builder token roles:

| Role     | Color scale  |
|----------|-------------|
| Subject  | `namsaek`   |
| Object   | `cheongja`  |
| Verb     | `dancheong` |
| Location | `geum`      |

Mastery tiles (VocabProgressCard):

| State              | Color          |
|--------------------|----------------|
| Mastered (>=0.8)   | `cheongja-500` |
| Learning (0.4–0.8) | `cheongja-300` |
| Seen (0–0.4)       | `cheongja-100` |
| New                | `hanji-200`    |

---

# Page Components

## LessonCard

Displays grammar lesson with status: `done`, `in_progress`, `locked`.

## ActivityCard

Dashboard entry point for games (Hangeul, Flashcards, Sentence Builder, Particles).

## ProgressCard

Vocabulary progress with count and optional mastery grid.

---

# Layout Patterns

## AppShell (`apps/web/src/app/AppShell.tsx`)

- Root: `min-h-screen bg-hanji-100 dark:bg-namsaek-950`
- TopNav: `sticky top-0 z-30 border-b bg-hanji-100/80 backdrop-blur`
- Content: `mx-auto max-w-6xl px-4 pb-24 pt-6 md:pb-12`
- BottomNav (mobile): `fixed bottom-0 z-30 border-t bg-hanji-100/95 backdrop-blur md:hidden`

## LearnHub

- Grid: `grid gap-6 md:grid-cols-[1.2fr_0.8fr]` (main + sidebar)

## GameLayout

- Container: `flex min-h-screen flex-col`
- Content: `flex flex-1 items-start justify-center p-2 sm:p-4`

## Responsive breakpoints

- `sm:` (640px) — tablets
- `md:` (768px) — desktops
- Mobile-first: `hidden md:block` for desktop-only elements

---

# Development Rules

1. No inline styles
2. No duplicated components
3. All UI comes from design-system package
4. Pages may compose components but never reimplement them

---

# Inputs

Search field pattern:

```
rounded-xl border border-hanji-300 bg-white py-2 pl-9 pr-3 text-sm shadow-sm
focus:border-namsaek-400 focus:ring-1 focus:ring-namsaek-400
dark:border-namsaek-700 dark:bg-namsaek-900
```

---

# Keyboard Shortcuts (Games)

| Key       | Action       |
|-----------|-------------|
| 1–4       | Select answer |
| Space     | Advance      |
| H         | Hint         |
| S         | Skip         |
| R         | Replay audio |
| Backspace | Undo (Sentence Builder) |

---

# Future Expansion

Potential components:

StreakCard, AchievementBadge, GrammarHint, BirdTip

---

# Migration Plan

Step 1

Move reusable components from app to:

packages/design-system/src/components

Step 2

Replace local imports with:

@birdie/ui

Step 3

Remove duplicate UI logic from app.

---

# Success Criteria

The design system is complete when:

- dashboard uses only design-system components
- no UI duplication exists
- styling comes only from tokens