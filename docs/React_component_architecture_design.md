Here’s a **production-grade React component architecture** for Korean mini-games that scales cleanly from **Flashcards → Sentence Builder → Listening**, without turning into spaghetti.

I’ll assume: **React + TypeScript + Vite/Next**, Tailwind optional, and you already know React Query / state patterns.

---

## 1) Core idea

Separate into **three layers**:

1. **Content Layer** (words, patterns, audio, SRS data)
2. **Game Engine Layer** (game rules + state machine)
3. **UI Layer** (reusable game UI + specific game screens)

This lets you add new games by mostly writing:

* a new `engine` (rules)
* a new `Screen` (UI)
  …while reusing everything else.

---

## 2) Suggested folder structure

```
src/
  app/
    routes/ (or pages/)
    AppShell.tsx

  features/
    learn/
      LearnHubPage.tsx
      session/
        sessionTypes.ts
        useStudySession.ts
        sessionSelectors.ts
      content/
        wordTypes.ts
        grammarTypes.ts
        contentRepo.ts
        contentQueries.ts
      progress/
        progressTypes.ts
        progressRepo.ts
        srs.ts

      games/
        _core/
          GameRegistry.ts
          gameTypes.ts
          GameHost.tsx
          GameHeader.tsx
          GameFooter.tsx
          GameLayout.tsx
          GameResults.tsx
          useGameController.ts
          timers.ts
          input/
            useHotkeys.ts
            useGameInput.ts
          ui/
            ChoiceGrid.tsx
            PromptCard.tsx
            TokenTray.tsx
            DragDropZone.tsx
            AudioButton.tsx
            FeedbackToast.tsx
            ProgressDots.tsx

        flashcards/
          flashcardsEngine.ts
          FlashcardsScreen.tsx
          flashcardsTypes.ts

        match/
          matchEngine.ts
          MatchScreen.tsx
          matchTypes.ts

        sentence_builder/
          sentenceBuilderEngine.ts
          SentenceBuilderScreen.tsx
          sentenceBuilderTypes.ts

        particles/
          particlesEngine.ts
          ParticlesScreen.tsx
          particlesTypes.ts

        listening/
          listeningEngine.ts
          ListeningScreen.tsx
          listeningTypes.ts
```

---

## 3) Types: the “contract” every game follows

### `games/_core/gameTypes.ts`

Every game should look the same to the host:

```ts
export type GameId =
  | "flashcards"
  | "match"
  | "sentence_builder"
  | "particles"
  | "listening";

export type StudyItemRef = {
  kind: "word" | "pattern";
  id: string;
};

export type GameConfig = {
  totalQuestions: number;
  timeLimitSec?: number;
  difficulty?: "easy" | "normal" | "hard";
};

export type GameContext = {
  // what the game can "see"
  items: StudyItemRef[];
  locale: "en";
};

export type GameResult = {
  correct: number;
  wrong: number;
  streakMax: number;
  durationMs: number;
  // store per-item outcomes for SRS/progress updates
  itemOutcomes: Array<{
    ref: StudyItemRef;
    grade: "easy" | "good" | "hard" | "fail";
    latencyMs: number;
  }>;
};

export type GameStateStatus =
  | "idle"
  | "loading"
  | "in_progress"
  | "paused"
  | "finished";

export type GameState<TQuestion = unknown> = {
  status: GameStateStatus;
  questionIndex: number;
  question?: TQuestion;
  score: {
    correct: number;
    wrong: number;
    streak: number;
    streakMax: number;
  };
  startedAt?: number;
  finishedAt?: number;
};

export type GameAction =
  | { type: "START" }
  | { type: "ANSWER"; payload: unknown }
  | { type: "SKIP" }
  | { type: "PAUSE" }
  | { type: "RESUME" }
  | { type: "FINISH" };

export type GameEngine<TQuestion, TAnswer> = {
  id: GameId;
  title: string;

  // prepare the first question (async allowed)
  init(ctx: GameContext, config: GameConfig): Promise<GameState<TQuestion>>;

  // interpret actions & produce new state
  reduce(
    state: GameState<TQuestion>,
    action: GameAction,
    deps: {
      ctx: GameContext;
      config: GameConfig;
      // for content lookup
      getWord(id: string): any;
      getPattern(id: string): any;
      now(): number;
      rng(): number;
    }
  ): Promise<GameState<TQuestion>>;

  // when finished, build a final result object for progress update
  buildResult(state: GameState<TQuestion>): GameResult;
};
```

Why this is good:

* Every game plugs into the same `GameHost`
* Engines can be unit tested without UI
* UI screens are “dumb” renderers + dispatchers

---

## 4) The Game Registry (plug-in style)

### `games/_core/GameRegistry.ts`

```ts
import { flashcardsEngine } from "../flashcards/flashcardsEngine";
import { matchEngine } from "../match/matchEngine";
import { sentenceBuilderEngine } from "../sentence_builder/sentenceBuilderEngine";
import { particlesEngine } from "../particles/particlesEngine";
import { listeningEngine } from "../listening/listeningEngine";

export const GameRegistry = {
  flashcards: flashcardsEngine,
  match: matchEngine,
  sentence_builder: sentenceBuilderEngine,
  particles: particlesEngine,
  listening: listeningEngine,
} as const;
```

---

## 5) The Game Host (one host for all games)

### `games/_core/GameHost.tsx`

Responsibilities:

* loads session items
* initializes engine
* owns the engine state
* passes state + dispatch into the screen
* writes results to progress/SRS at the end

Conceptually:

```tsx
type GameHostProps = {
  gameId: GameId;
  ctx: GameContext;
  config: GameConfig;
  onExit(): void;
};

export function GameHost({ gameId, ctx, config, onExit }: GameHostProps) {
  const engine = GameRegistry[gameId];

  const {
    state,
    dispatch,
    result,
    isLoading,
  } = useGameController(engine, ctx, config);

  if (isLoading) return <div>Loading…</div>;

  if (state.status === "finished" && result) {
    return (
      <GameResults
        title={engine.title}
        result={result}
        onDone={onExit}
      />
    );
  }

  return (
    <GameLayout
      header={<GameHeader title={engine.title} state={state} onExit={onExit} />}
      footer={<GameFooter state={state} dispatch={dispatch} />}
    >
      <GameScreenRouter
        gameId={gameId}
        state={state}
        dispatch={dispatch}
      />
    </GameLayout>
  );
}
```

---

## 6) The controller hook (engine runner)

### `games/_core/useGameController.ts`

Responsibilities:

* `init()`
* `dispatch(action)` → calls engine.reduce
* when finished, call `engine.buildResult()`

Also integrates:

* timers
* keyboard shortcuts
* analytics / events

This is where you keep logic consistent across games.

---

## 7) Screen router: map gameId → Screen component

### `games/_core/GameScreenRouter.tsx`

```tsx
import { FlashcardsScreen } from "../flashcards/FlashcardsScreen";
import { MatchScreen } from "../match/MatchScreen";
import { SentenceBuilderScreen } from "../sentence_builder/SentenceBuilderScreen";
import { ParticlesScreen } from "../particles/ParticlesScreen";
import { ListeningScreen } from "../listening/ListeningScreen";

export function GameScreenRouter({ gameId, state, dispatch }: any) {
  switch (gameId) {
    case "flashcards":
      return <FlashcardsScreen state={state} dispatch={dispatch} />;
    case "match":
      return <MatchScreen state={state} dispatch={dispatch} />;
    case "sentence_builder":
      return <SentenceBuilderScreen state={state} dispatch={dispatch} />;
    case "particles":
      return <ParticlesScreen state={state} dispatch={dispatch} />;
    case "listening":
      return <ListeningScreen state={state} dispatch={dispatch} />;
    default:
      return null;
  }
}
```

---

## 8) Shared UI components (reusability = speed)

Build a small UI kit just for games:

* `PromptCard` (question text + hint + example)
* `ChoiceGrid` (multiple choice)
* `TokenTray` (sentence builder tokens)
* `AudioButton` (play TTS / audio)
* `FeedbackToast` (Correct / Wrong)
* `ProgressDots` (question count)
* `GameHeader/Footer/Layout` (consistent look)

This makes your “new game UI” mostly assembling Lego pieces.

---

## 9) Content & Progress (clean separation)

### Content repo (words/patterns)

* can be local JSON at first
* later Firestore / backend
* but UI/games don’t care

`contentRepo.ts`:

* `getWord(id)`
* `getPattern(id)`
* `listWordsByLevel("A1")`

### Progress repo (SRS + stats)

* `recordOutcome(ref, grade, latency)`
* `getDueItems()`
* `getMastery(ref)`

Games only emit outcomes; progress system decides scheduling.

---

## 10) Recommended state approach

For reliability, do one of:

* `useReducer + engine.reduce()` (simple, testable)
* `xstate` (best for complex flows like match + drag/drop)

Given your background: start with `useReducer` pattern and add xstate only if needed.

---

## 11) How each game is implemented (minimal steps)

To add a new game:

1. Create `myGameEngine.ts` implementing the engine interface
2. Create `MyGameScreen.tsx`
3. Register it in `GameRegistry`
4. Add entry in `LearnHubPage` list

That’s it.

---
## 11) User profile independent from game 

Yes — this architecture **supports user profiles, points, and progress tracking** cleanly. The trick is: games should **not** own progress logic. Games should only emit **standardized outcomes**, and a separate **Progress/Profiles layer** updates XP, streaks, mastery, SRS, etc.

Here’s how it fits.

---

## Where user profiles live

Add a `profile/` feature module and make it independent from games:

```
features/learn/
  profile/
    profileTypes.ts
    profileRepo.ts
    useProfile.ts
  progress/
    progressTypes.ts
    progressRepo.ts
    srs.ts
    mastery.ts
  games/
    _core/
      ...
```

### `profileTypes.ts`

```ts
export type UserProfile = {
  userId: string;
  displayName: string;
  createdAt: number;
  lastActiveAt: number;

  // gamification
  xp: number;
  level: number;
  coins: number;

  // daily motivation
  dailyStreak: number;
  streakUpdatedAt: number; // day boundary logic
};
```

---

## Points (XP) + Progress tracking flow

### ✅ Data flow (recommended)

1. Game finishes
2. Engine creates a `GameResult` with per-item outcomes
3. `GameHost` calls `progressService.applyGameResult(userId, result)`
4. That service updates:

* mastery (per word/pattern)
* SRS schedule (next review times)
* XP, coins, streak
* stats (accuracy, time spent)

Games remain reusable and dumb.

---

## What to store for progress (practical + scalable)

### `progressTypes.ts`

```ts
export type ItemProgress = {
  ref: { kind: "word" | "pattern"; id: string };

  // mastery 0..1 (or 0..100)
  mastery: number;

  // SRS scheduling
  srs: {
    intervalDays: number;
    ease: number;        // e.g. 1.3..2.6
    dueAt: number;       // timestamp
    lastReviewedAt?: number;
  };

  // stats
  seenCount: number;
  correctCount: number;
  wrongCount: number;
  avgLatencyMs?: number;
};

export type DailyStats = {
  dayKey: string; // "2026-03-04"
  xpGained: number;
  minutesStudied: number;
  correct: number;
  wrong: number;
};
```

---

## Where progress updates happen

In `GameHost`, after finish:

* `result.itemOutcomes` → update per-item mastery/SRS
* `result.correct/wrong` and duration → compute XP + streak + daily stats

Example conceptual pseudo-flow:

* `applyOutcomes(userId, itemOutcomes)`
* `awardXp(userId, result)`
* `updateStreak(userId)`
* `writeDailyStats(userId, result)`

---

## SRS and mastery integration (why this is powerful)

Because every game emits the same outcome type:

```ts
grade: "easy" | "good" | "hard" | "fail"
latencyMs: number
ref: { kind, id }
```

You can apply **the same scheduling algorithm** no matter what game was played.

That’s exactly how you get:

* “Review due words today”
* “Mastery map”
* “Weak words”
* “Grammar patterns you keep failing”

---

## UI that becomes easy with this model

Once progress exists, you can show:

### Profile widget (header)

* Level, XP bar
* daily streak
* coins

### Progress screens

* A1 word mastery grid (300 tiles)
* “Due today” list
* accuracy charts (later)

### Game selection personalization

* “Recommended: Particles drill (you missed 을/를 7 times)”
* “Review 12 words due today”

---

## Storage options (fits your stack)

Because you already use Firebase a lot, this fits perfectly:

### Firestore suggested collections

```
users/{userId}
users/{userId}/progress/{kind}_{id}
users/{userId}/dailyStats/{dayKey}
```

* `users/{userId}` → profile (xp, level, streak)
* `progress/word_학교` → per-item mastery + SRS
* `dailyStats/2026-03-04` → daily tracking

This structure scales well, is easy to query, and doesn’t need complex joins.

---

## What you need to add to the current architecture

Minimal additions:

1. `profile/` module (read/update user profile)
2. `progress/` module (per item progress + SRS)
3. In `GameHost`, call one function after finish:

* `progressService.applyGameResult(userId, result)`

Everything else stays the same.

