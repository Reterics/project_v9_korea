import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    BookOpen,
    Check,
    ChevronRight,
    Headphones,
    Keyboard,
    Layers,
    Play,
    Sparkles,
    Target,
    Timer,
    X,
} from "lucide-react";

// Single-file UI demo page (React + Tailwind).
// Drop this into your app and render <KoreanLearningDemoPage />.

type Mode = "hub" | "game" | "results";

export default function KoreanLearningDemoPage() {
    const [mode, setMode] = useState<Mode>("hub");
    const [dark, setDark] = useState(true);

    return (
        <div className={dark ? "dark" : ""}>
            <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
                <TopNav
                    dark={dark}
                    onToggleDark={() => setDark((v) => !v)}
                    mode={mode}
                    onMode={setMode}
                />

                <div className="mx-auto w-full max-w-6xl px-4 pb-12 pt-6">
                    <AnimatePresence mode="wait">
                        {mode === "hub" && (
                            <motion.div
                                key="hub"
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.18 }}
                            >
                                <LearnHub onStart={() => setMode("game")} />
                            </motion.div>
                        )}

                        {mode === "game" && (
                            <motion.div
                                key="game"
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.18 }}
                            >
                                <GameSessionMock
                                    onExit={() => setMode("hub")}
                                    onFinish={() => setMode("results")}
                                />
                            </motion.div>
                        )}

                        {mode === "results" && (
                            <motion.div
                                key="results"
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.18 }}
                            >
                                <ResultsMock
                                    onDone={() => setMode("hub")}
                                    onReplay={() => setMode("game")}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

function TopNav({
                    dark,
                    onToggleDark,
                    mode,
                    onMode,
                }: {
    dark: boolean;
    onToggleDark: () => void;
    mode: Mode;
    onMode: (m: Mode) => void;
}) {
    return (
        <div className="sticky top-0 z-30 border-b border-zinc-200/70 bg-zinc-50/70 backdrop-blur dark:border-zinc-800/60 dark:bg-zinc-950/60">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900">
                        <Sparkles className="h-5 w-5" />
                    </div>
                    <div className="leading-tight">
                        <div className="text-sm font-semibold">Suhana Korean</div>
                        <div className="text-xs text-zinc-500 dark:text-zinc-400">
                            Minimal trainer UI demo
                        </div>
                    </div>
                </div>

                <div className="hidden items-center gap-2 md:flex">
                    <NavPill active={mode === "hub"} onClick={() => onMode("hub")}>Hub</NavPill>
                    <NavPill active={mode === "game"} onClick={() => onMode("game")}>Game</NavPill>
                    <NavPill active={mode === "results"} onClick={() => onMode("results")}>Results</NavPill>
                </div>

                <div className="flex items-center gap-2">
                    <div className="hidden md:block">
                        <ProfileMini />
                    </div>
                    <button
                        onClick={onToggleDark}
                        className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-medium shadow-sm hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                    >
                        {dark ? "Dark" : "Light"}
                    </button>
                </div>
            </div>
        </div>
    );
}

function NavPill({
                     active,
                     children,
                     onClick,
                 }: {
    active?: boolean;
    children: React.ReactNode;
    onClick?: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={
                "rounded-xl px-3 py-2 text-sm font-medium transition " +
                (active
                    ? "bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900"
                    : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900")
            }
        >
            {children}
        </button>
    );
}

function ProfileMini() {
    return (
        <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white px-3 py-2 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="grid">
                <div className="text-xs text-zinc-500 dark:text-zinc-400">Daily streak</div>
                <div className="text-sm font-semibold">7 days</div>
            </div>
            <div className="h-9 w-px bg-zinc-200 dark:bg-zinc-800" />
            <div className="grid min-w-[140px]">
                <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                    <span>XP</span>
                    <span>840 / 1000</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-zinc-200 dark:bg-zinc-800">
                    <div className="h-2 w-[84%] rounded-full bg-zinc-900 dark:bg-zinc-100" />
                </div>
            </div>
        </div>
    );
}

function LearnHub({ onStart }: { onStart: () => void }) {
    return (
        <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-6">
                <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                                Today
                            </div>
                            <div className="mt-1 text-xl font-semibold">
                                Continue your A1 sprint
                            </div>
                            <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
                                5–7 minutes. Focus: particles + core verbs.
                            </div>
                        </div>
                        <button
                            onClick={onStart}
                            className="group inline-flex items-center gap-2 rounded-2xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-zinc-50 shadow-sm hover:opacity-95 dark:bg-zinc-100 dark:text-zinc-900"
                        >
                            Start session
                            <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                        </button>
                    </div>

                    <div className="mt-5 grid gap-3 md:grid-cols-3">
                        <StatChip icon={<Target className="h-4 w-4" />} label="Due today" value="18 items" />
                        <StatChip icon={<Timer className="h-4 w-4" />} label="Avg pace" value="3.1s" />
                        <StatChip icon={<Layers className="h-4 w-4" />} label="Mastery" value="A1 22%" />
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <GameCard
                        icon={<BookOpen className="h-5 w-5" />}
                        title="Flashcards"
                        desc="Recall 300 core words with spaced repetition."
                        meta="2–4 min"
                        onClick={onStart}
                    />
                    <GameCard
                        icon={<Layers className="h-5 w-5" />}
                        title="Sentence Builder"
                        desc="Drag tokens to build Korean word order patterns."
                        meta="3–6 min"
                        onClick={onStart}
                    />
                    <GameCard
                        icon={<Target className="h-5 w-5" />}
                        title="Particles"
                        desc="Fill 은/는, 이/가, 을/를 with instant explanations."
                        meta="2–5 min"
                        onClick={onStart}
                    />
                    <GameCard
                        icon={<Headphones className="h-5 w-5" />}
                        title="Listening"
                        desc="Hear a word, choose meaning, train sound recognition."
                        meta="2–4 min"
                        onClick={onStart}
                    />
                </div>
            </div>

            <div className="space-y-6">
                <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm font-semibold">Weak area</div>
                            <div className="text-xs text-zinc-500 dark:text-zinc-400">
                                Based on last 3 sessions
                            </div>
                        </div>
                        <div className="rounded-xl bg-zinc-100 px-3 py-2 text-xs font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                            Particles
                        </div>
                    </div>

                    <div className="mt-4 space-y-3">
                        <MiniRow
                            left="을/를 (object)"
                            right="62%"
                            hint="사과를 먹어요"
                        />
                        <MiniRow
                            left="은/는 (topic)"
                            right="68%"
                            hint="저는 학생이에요"
                        />
                        <MiniRow
                            left="이/가 (subject)"
                            right="73%"
                            hint="비가 와요"
                        />
                    </div>

                    <div className="mt-4 flex items-center gap-2 rounded-2xl border border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-300">
                        <Keyboard className="h-4 w-4" />
                        Tip: use <span className="font-semibold">1–4</span> to answer, <span className="font-semibold">Space</span> next.
                    </div>
                </div>

                <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="text-sm font-semibold">Mastery preview</div>
                    <div className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                        300 words (A1) — tiles fill as mastery grows.
                    </div>
                    <MasteryGrid />
                </div>
            </div>
        </div>
    );
}

function StatChip({
                      icon,
                      label,
                      value,
                  }: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-3 dark:border-zinc-800 dark:bg-zinc-950/40">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-white shadow-sm dark:bg-zinc-900">
                {icon}
            </div>
            <div className="leading-tight">
                <div className="text-xs text-zinc-500 dark:text-zinc-400">{label}</div>
                <div className="text-sm font-semibold">{value}</div>
            </div>
        </div>
    );
}

function GameCard({
                      icon,
                      title,
                      desc,
                      meta,
                      onClick,
                  }: {
    icon: React.ReactNode;
    title: string;
    desc: string;
    meta: string;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className="group rounded-3xl border border-zinc-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
        >
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
                        {icon}
                    </div>
                    <div>
                        <div className="text-sm font-semibold">{title}</div>
                        <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                            {meta}
                        </div>
                    </div>
                </div>
                <ChevronRight className="mt-1 h-4 w-4 text-zinc-400 transition group-hover:translate-x-0.5 dark:text-zinc-500" />
            </div>
            <div className="mt-3 text-sm text-zinc-600 dark:text-zinc-300">{desc}</div>
        </button>
    );
}

function MiniRow({ left, right, hint }: { left: string; right: string; hint: string }) {
    return (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-zinc-200 bg-white px-3 py-3 dark:border-zinc-800 dark:bg-zinc-950/30">
            <div>
                <div className="text-sm font-semibold">{left}</div>
                <div className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">{hint}</div>
            </div>
            <div className="text-sm font-semibold">{right}</div>
        </div>
    );
}

function MasteryGrid() {
    const tiles = useMemo(() => {
        const n = 90; // demo
        const arr = Array.from({ length: n }).map((_, i) => {
            // deterministic-ish wave for nicer preview
            const mastery = Math.max(0, Math.min(1, (Math.sin(i / 6) + 1) / 2));
            const filled = mastery > 0.55;
            const strong = mastery > 0.8;
            return { filled, strong };
        });
        return arr;
    }, []);

    return (
        <div className="mt-4 grid grid-cols-10 gap-2">
            {tiles.map((t, i) => (
                <div
                    key={i}
                    className={
                        "h-4 w-full rounded-lg border " +
                        (t.filled
                            ? "border-zinc-900 bg-zinc-900 dark:border-zinc-100 dark:bg-zinc-100"
                            : "border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900")
                    }
                />
            ))}
        </div>
    );
}

function GameSessionMock({ onExit, onFinish }: { onExit: () => void; onFinish: () => void }) {
    const [idx, setIdx] = useState(2);
    const total = 10;
    const [showFeedback, setShowFeedback] = useState<null | { ok: boolean; msg: string }>(null);

    const prompt = {
        title: "Fill the particle",
        korean: "저__ 학생이에요",
        sub: "Choose the correct topic marker.",
        choices: ["은", "는", "이", "가"],
        correct: 1,
        explain: "저는 uses 는 after a vowel (저). 은/는 marks the topic.",
    };

    function answer(i: number) {
        const ok = i === prompt.correct;
        setShowFeedback({
            ok,
            msg: ok ? "Correct" : `Wrong — answer: ${prompt.choices[prompt.correct]}`,
        });

        window.setTimeout(() => {
            setShowFeedback(null);
            const next = idx + 1;
            if (next >= total) onFinish();
            else setIdx(next);
        }, 900);
    }

    return (
        <div className="mx-auto max-w-3xl">
            <div className="rounded-3xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                {/* Header */}
                <div className="flex items-center justify-between gap-3 border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
                    <button
                        onClick={onExit}
                        className="inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Exit
                    </button>

                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                            <Timer className="h-4 w-4" />
                            <span>00:{String(18).padStart(2, "0")}</span>
                        </div>
                        <ProgressDots current={idx} total={total} />
                    </div>

                    <div className="rounded-2xl bg-zinc-100 px-3 py-2 text-xs font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                        +12 XP
                    </div>
                </div>

                {/* Body */}
                <div className="p-5">
                    <PromptCard
                        title={prompt.title}
                        korean={prompt.korean}
                        sub={prompt.sub}
                        rightSlot={
                            <button className="inline-flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold shadow-sm hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950/30 dark:hover:bg-zinc-800">
                                <Play className="h-4 w-4" />
                                Audio
                            </button>
                        }
                    />

                    <div className="mt-4 grid grid-cols-2 gap-3">
                        {prompt.choices.map((c, i) => (
                            <ChoiceButton key={c} index={i} label={c} onClick={() => answer(i)} />
                        ))}
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                            <Keyboard className="h-4 w-4" />
                            1–4 answer • Space next • H hint
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold shadow-sm hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950/30 dark:hover:bg-zinc-800">
                                Hint
                            </button>
                            <button className="rounded-2xl border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold shadow-sm hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950/30 dark:hover:bg-zinc-800">
                                Skip
                            </button>
                        </div>
                    </div>

                    <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-300">
                        <span className="font-semibold">Why:</span> {prompt.explain}
                    </div>
                </div>
            </div>

            <FeedbackToast data={showFeedback} />
        </div>
    );
}

function ResultsMock({ onDone, onReplay }: { onDone: () => void; onReplay: () => void }) {
    return (
        <div className="mx-auto max-w-3xl space-y-4">
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                            Session complete
                        </div>
                        <div className="mt-1 text-2xl font-semibold">Nice work.</div>
                        <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
                            You practiced particles and core sentence structure.
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onReplay}
                            className="rounded-2xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-zinc-50 shadow-sm hover:opacity-95 dark:bg-zinc-100 dark:text-zinc-900"
                        >
                            Replay
                        </button>
                        <button
                            onClick={onDone}
                            className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold shadow-sm hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                        >
                            Back to hub
                        </button>
                    </div>
                </div>

                <div className="mt-6 grid gap-3 md:grid-cols-3">
                    <StatChip icon={<Sparkles className="h-4 w-4" />} label="XP gained" value="+84" />
                    <StatChip icon={<Target className="h-4 w-4" />} label="Accuracy" value="80%" />
                    <StatChip icon={<Timer className="h-4 w-4" />} label="Time" value="5:12" />
                </div>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <div className="text-sm font-semibold">Mistakes to review</div>
                <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    Quick drill (2 minutes)
                </div>

                <div className="mt-4 grid gap-3">
                    <MistakeRow korean="사과__ 먹어요" answer="를" note="Object marker (을/를)." />
                    <MistakeRow korean="비__ 와요" answer="가" note="Subject marker (이/가)." />
                    <MistakeRow korean="저__ 회사원이에요" answer="는" note="Topic marker (은/는)." />
                </div>

                <div className="mt-5 flex items-center justify-between gap-3">
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">
                        Tip: drill mistakes daily to raise mastery fast.
                    </div>
                    <button className="rounded-2xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-zinc-50 shadow-sm hover:opacity-95 dark:bg-zinc-100 dark:text-zinc-900">
                        Drill mistakes
                    </button>
                </div>
            </div>
        </div>
    );
}

function MistakeRow({ korean, answer, note }: { korean: string; answer: string; note: string }) {
    return (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950/40">
            <div>
                <div className="text-lg font-semibold tracking-tight">{korean}</div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">{note}</div>
            </div>
            <div className="flex items-center gap-2">
                <div className="rounded-xl bg-white px-3 py-2 text-sm font-semibold shadow-sm dark:bg-zinc-900">
                    {answer}
                </div>
                <button className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold shadow-sm hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800">
                    Practice
                </button>
            </div>
        </div>
    );
}

function ProgressDots({ current, total }: { current: number; total: number }) {
    return (
        <div className="flex items-center gap-1.5" aria-label={`Progress ${current + 1} of ${total}`}>
            {Array.from({ length: total }).map((_, i) => (
                <div
                    key={i}
                    className={
                        "h-2.5 w-2.5 rounded-full transition " +
                        (i === current
                            ? "bg-zinc-900 dark:bg-zinc-100"
                            : i < current
                                ? "bg-zinc-400 dark:bg-zinc-600"
                                : "bg-zinc-200 dark:bg-zinc-800")
                    }
                />
            ))}
        </div>
    );
}

function PromptCard({
                        title,
                        korean,
                        sub,
                        rightSlot,
                    }: {
    title: string;
    korean: string;
    sub?: string;
    rightSlot?: React.ReactNode;
}) {
    return (
        <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-950/40">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                        {title}
                    </div>
                    <div className="mt-2 text-4xl font-semibold tracking-tight">{korean}</div>
                    {sub ? (
                        <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{sub}</div>
                    ) : null}
                </div>
                {rightSlot ? <div className="shrink-0">{rightSlot}</div> : null}
            </div>
        </div>
    );
}

function ChoiceButton({
                          index,
                          label,
                          onClick,
                      }: {
    index: number;
    label: string;
    onClick: () => void;
}) {
    const key = index + 1;
    return (
        <button
            onClick={onClick}
            className="group relative rounded-3xl border border-zinc-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
        >
            <div className="flex items-start justify-between gap-3">
                <div>
                    <div className="text-2xl font-semibold tracking-tight">{label}</div>
                    <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                        Press {key}
                    </div>
                </div>
                <div className="rounded-2xl bg-zinc-100 px-2 py-1 text-xs font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                    {key}
                </div>
            </div>
        </button>
    );
}

function FeedbackToast({ data }: { data: null | { ok: boolean; msg: string } }) {
    return (
        <AnimatePresence>
            {data ? (
                <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 18 }}
                    transition={{ duration: 0.15 }}
                    className="pointer-events-none fixed bottom-6 left-1/2 z-50 w-[min(520px,calc(100vw-24px))] -translate-x-1/2"
                >
                    <div className="flex items-center justify-between gap-3 rounded-2xl border border-zinc-200 bg-white px-4 py-3 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
                        <div className="flex items-center gap-2">
                            <div
                                className={
                                    "flex h-9 w-9 items-center justify-center rounded-2xl " +
                                    (data.ok
                                        ? "bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900"
                                        : "bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100")
                                }
                            >
                                {data.ok ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
                            </div>
                            <div className="text-sm font-semibold">{data.msg}</div>
                        </div>
                        <div className="text-xs text-zinc-500 dark:text-zinc-400">Auto next</div>
                    </div>
                </motion.div>
            ) : null}
        </AnimatePresence>
    );
}
