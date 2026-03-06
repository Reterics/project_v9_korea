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
  lessonSentenceIds?: string[];
  lessonId?: string;
};

export type GameContext = {
  items: StudyItemRef[];
  locale: "en";
};

export type GameResult = {
  correct: number;
  wrong: number;
  streakMax: number;
  durationMs: number;
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

export type GameEngine<TQuestion = unknown> = {
  id: GameId;
  title: string;

  init(ctx: GameContext, config: GameConfig): Promise<GameState<TQuestion>>;

  reduce(
    state: GameState<TQuestion>,
    action: GameAction,
    deps: {
      ctx: GameContext;
      config: GameConfig;
      getWord(id: string): import("@/features/learn/content/wordTypes").Word | undefined;
      getPattern(id: string): import("@/features/learn/content/grammarTypes").Pattern | undefined;
      now(): number;
      rng(): number;
    }
  ): Promise<GameState<TQuestion>>;

  buildResult(state: GameState<TQuestion>): GameResult;
};
