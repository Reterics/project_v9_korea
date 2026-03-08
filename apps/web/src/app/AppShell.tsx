import { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Sun, Moon, Home, BookOpen, BookText, Search, FileText } from "lucide-react";
import { useProfile } from "@/features/learn/profile/useProfile";
import { BrandLogo, BottomNav, BottomNavItem } from "@reterics/birdie-ui";

export function AppShell() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");

    root.classList.add("transitioning");
    const timer = window.setTimeout(() => root.classList.remove("transitioning"), 250);
    return () => window.clearTimeout(timer);
  }, [dark]);

  return (
    <div className="min-h-screen bg-hanji-100 text-namsaek-900 dark:bg-namsaek-950 dark:text-hanji-200">
      <TopNav dark={dark} onToggleDark={() => setDark((v) => !v)} />
      <div className="mx-auto w-full max-w-6xl px-4 pb-24 pt-6 md:pb-12">
        <Outlet />
      </div>
      <AppBottomNav />
    </div>
  );
}

function TopNav({ dark, onToggleDark }: { dark: boolean; onToggleDark: () => void }) {
  const { profile } = useProfile();
  const location = useLocation();
  const xpInLevel = profile.xp % 100;
  const xpTarget = 100;

  return (
    <div className="sticky top-0 z-30 border-b border-hanji-300/70 bg-hanji-100/80 backdrop-blur dark:border-namsaek-800/60 dark:bg-namsaek-950/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        {/* Logo */}
        <Link to="/" className="no-underline">
          <BrandLogo variant="primary" size={30} />
        </Link>

        {/* Nav pills â€” desktop only */}
        <div className="hidden items-center gap-2 md:flex">
          <NavPill to="/" active={location.pathname === "/"}>
            Hub
          </NavPill>
          <NavPill to="/hangeul-practice" active={location.pathname.startsWith("/hangeul-practice")}>
            Hangeul
          </NavPill>
          <NavPill to="/grammar" active={location.pathname.startsWith("/grammar")}>
            Grammar
          </NavPill>
          <NavPill to="/dictionary" active={location.pathname === "/dictionary"}>
            Dictionary
          </NavPill>
          <NavPill to="/notes" active={location.pathname === "/notes"}>
            Notes
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
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-hanji-300 bg-white shadow-sm hover:bg-hanji-50 dark:border-namsaek-700 dark:bg-namsaek-800 dark:hover:bg-namsaek-700"
            title={dark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {dark ? (
              <Sun className="h-4 w-4 text-geum-400" />
            ) : (
              <Moon className="h-4 w-4 text-namsaek-500" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function AppBottomNav() {
  const location = useLocation();

  const items = [
    { to: "/", label: "Hub", icon: Home, exact: true },
    { to: "/hangeul-practice", label: "Hangeul", icon: BookOpen, exact: false },
    { to: "/grammar", label: "Grammar", icon: BookText, exact: false },
    { to: "/dictionary", label: "Dictionary", icon: Search, exact: true },
    { to: "/notes", label: "Notes", icon: FileText, exact: true },
  ];

  return (
    <BottomNav className="fixed bottom-0 left-0 right-0 z-30 md:hidden">
      {items.map(({ to, label, icon: Icon, exact }) => {
        const active = exact ? location.pathname === to : location.pathname.startsWith(to);
        return (
          <Link key={to} to={to} className="flex-1 no-underline">
            <BottomNavItem
              icon={<Icon className="h-5 w-5" />}
              label={label}
              active={active}
            />
          </Link>
        );
      })}
    </BottomNav>
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
          ? "bg-namsaek-500 text-hanji-50"
          : "text-namsaek-600 hover:bg-hanji-200 dark:text-hanji-300 dark:hover:bg-namsaek-800")
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
    <div className="flex items-center gap-3 rounded-2xl border border-hanji-300 bg-white px-3 py-2 shadow-sm dark:border-namsaek-700 dark:bg-namsaek-800">
      {/* Streak */}
      <div className="grid">
        <div className="text-xs text-hanji-500 dark:text-hanji-400">Streak</div>
        <div className="text-sm font-semibold text-geum-500 dark:text-geum-400">
          {streak} {streak === 1 ? "day" : "days"}
        </div>
      </div>
      <div className="h-9 w-px bg-hanji-300 dark:bg-namsaek-700" />
      {/* XP bar */}
      <div className="grid min-w-[120px]">
        <div className="flex items-center justify-between text-xs text-hanji-500 dark:text-hanji-400">
          <span>XP</span>
          <span>{totalXp}</span>
        </div>
        <div className="mt-1 h-2 rounded-full bg-hanji-200 dark:bg-namsaek-700">
          <div
            className="h-2 rounded-full bg-cheongja-500 transition-all dark:bg-cheongja-400"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}


