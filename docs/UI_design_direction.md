# UI Design Direction

## Goals
- Zero clutter during questions
- Big readable Hangul
- Instant feedback (correct/wrong + tiny explanation)
- Keyboard-first (1-4 choices, Space reveal/next, H hint, S skip, R replay)
- Progress always visible (streak / XP / question count)
- Mobile usable, desktop-first

## App Layout: 3 Shells

### A) Learn Hub (home)
- "Continue", "Due today", Game cards, Stats panel

### B) Game Session (during play)
- Header: back, game name, progress dots, timer (optional)
- Center: prompt card (the "stage")
- Bottom: answer area (choices / tokens / input)
- Footer: hint + hotkeys + skip

### C) Results (after play)
- XP gained, Accuracy, Weak items list, "Play again" / "Next game"

## Visual Style: "Modern Notebook"
- Background: soft neutral (zinc)
- Cards: white / near-black in dark mode
- Accent: one strong color (teal or violet)
- Feedback: muted green/red
- Tailwind + shadcn/ui style components
- Framer Motion for feedback animations (light usage)
- Single compact spacing scale

## Design System (10 Core Components)

1. **AppShell** — sidebar/top nav
2. **TopBarProfile** — xp bar, streak, user avatar
3. **GameLayout** — header/body/footer structure
4. **PromptCard** — big Hangul, subtext, audio button
5. **ChoiceGrid** — 2x2 / 2x3 options with hotkey labels
6. **TokenTray + SentenceBar** — sentence builder drag/click
7. **FeedbackToast** — Correct/Wrong + explanation (0.6–1.2s)
8. **ProgressDots** — question index indicator
9. **HotkeyHints** — small, consistent hotkey display
10. **ResultsSummary** — XP + mistakes list

## Game Screen Patterns

### Flashcards
- Center: huge Korean word (학교) + optional romanization toggle
- Bottom: [Reveal] → [Fail / Hard / Good / Easy] (hotkeys 1-4)

### Word Match
- Two columns of chips/cards
- Click left then right to match
- Correct pair animates out, small timer in header

### Sentence Builder
- Top: English meaning / scenario
- Middle: sentence bar (empty slots)
- Bottom: token tray (draggable/clickable words)
- On correct: one-line grammar note ("Object + 을/를 + Verb")

### Particles Quiz
- Prompt: "저__ 학생이에요" (large)
- Particle choices (은/는/이/가/을/를)
- On answer: 1-sentence reason ("저는 = topic marker")

### Listening
- Giant audio button in PromptCard
- After audio: choices appear
- "Replay" button (limited in hard mode)

## Hotkeys
| Key | Action |
|-----|--------|
| 1-4 | Select choice |
| Space | Reveal / Next |
| H | Hint |
| S | Skip |
| R | Replay audio |

## UX Details
- Micro-feedback after every answer (0.6–1.2s), auto-advance optional
- "Mistake bank" after each session with "Drill mistakes" option
- Korean font size bigger than English
- Normal letter spacing for Hangul (wide spacing is bad)
- No ALL CAPS in English UI

## Page Map
1. `/learn` → Hub
2. `/learn/session?game=flashcards` → GameHost
3. `/learn/progress` → Mastery (300 words grid)
4. `/learn/profile` → Profile + streak + stats
5. `/learn/settings` → Audio/romanization/hard mode toggles

## Learn Hub Content
- **Top:** XP bar + streak
- **Main:** "Continue (5 min)", "Due today: 18 words", "Weak area: particles"
- **Game cards:** Each shows estimated time, difficulty, what it trains

## Korean Vibe (Subtle)
- No flags, k-pop neon, or cartoon mascots
- Thin line patterns, paper texture, minimal stamps
- Small "한글" label styling, professional tone
