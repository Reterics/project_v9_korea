import { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { useProfile } from "@/features/learn/profile/useProfile";

export function AppShell() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("transitioning");
    if (dark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", dark ? "dark" : "light");
    const t = setTimeout(() => root.classList.remove("transitioning"), 250);
    return () => clearTimeout(t);
  }, [dark]);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <TopNav dark={dark} onToggleDark={() => setDark((v) => !v)} />
      <div className="mx-auto w-full max-w-6xl px-4 pb-12 pt-6">
        <Outlet />
      </div>
    </div>
  );
}

function TopNav({ dark, onToggleDark }: { dark: boolean; onToggleDark: () => void }) {
  const { profile } = useProfile();
  const location = useLocation();
  const xpInLevel = profile.xp % 100;
  const xpTarget = 100;

  return (
    <div className="sticky top-0 z-30 border-b border-zinc-200/70 bg-zinc-50/70 backdrop-blur dark:border-zinc-800/60 dark:bg-zinc-950/60">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 no-underline">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Korean Trainer
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400">
              A1 Sprint
            </div>
          </div>
        </Link>

        {/* Nav pills — desktop only */}
        <div className="hidden items-center gap-2 md:flex">
          <NavPill to="/" active={location.pathname === "/"}>
            Hub
          </NavPill>
        </div>

        {/* Right side: profile + dark toggle */}
        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <ProfileMini
              streak={profile.dailyStreak}
              xp={xpInLevel}
              xpTarget={xpTarget}
              totalXp={profile.xp}
            />
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
  to,
  active,
  children,
}: {
  to: string;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className={
        "rounded-xl px-3 py-2 text-sm font-medium no-underline transition " +
        (active
          ? "bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900"
          : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900")
      }
    >
      {children}
    </Link>
  );
}

function ProfileMini({
  streak,
  xp,
  xpTarget,
  totalXp,
}: {
  streak: number;
  xp: number;
  xpTarget: number;
  totalXp: number;
}) {
  const pct = Math.min(100, Math.round((xp / xpTarget) * 100));

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white px-3 py-2 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="grid">
        <div className="text-xs text-zinc-500 dark:text-zinc-400">Streak</div>
        <div className="text-sm font-semibold">
          {streak} {streak === 1 ? "day" : "days"}
        </div>
      </div>
      <div className="h-9 w-px bg-zinc-200 dark:bg-zinc-800" />
      <div className="grid min-w-[120px]">
        <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
          <span>XP</span>
          <span>
            {totalXp}
          </span>
        </div>
        <div className="mt-1 h-2 rounded-full bg-zinc-200 dark:bg-zinc-800">
          <div
            className="h-2 rounded-full bg-zinc-900 transition-all dark:bg-zinc-100"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
