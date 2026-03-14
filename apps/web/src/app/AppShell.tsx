import { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Sun, Moon, Home, BookOpen, BookText, Search, FileText, User, LogOut, Settings, HelpCircle, ShieldCheck } from "lucide-react";
import { useData } from "@/features/learn/data/DataProvider";
import { IS_LIVE } from "@/features/learn/data/types";
import { BrandLogo, Topbar, TopbarMenu, DropdownMenu, BottomNav, BottomNavItem } from "@reterics/birdie-ui";
import type { DropdownMenuItem } from "@reterics/birdie-ui";
import { useAuth } from "@/features/auth/AuthProvider";

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
    <div className="flex h-screen flex-col overflow-hidden text-namsaek-900 dark:text-hanji-200">
      <AppTopbar dark={dark} onToggleDark={() => setDark((v) => !v)} />
      <main className="flex-1 overflow-y-auto bg-hanji-100 [scrollbar-gutter:stable] dark:bg-namsaek-950">
        <div className="mx-auto w-full max-w-6xl px-4 pb-24 pt-6 md:pb-12">
          <Outlet />
        </div>
      </main>
      <AppBottomNav />
    </div>
  );
}

function AppTopbar({ dark, onToggleDark }: { dark: boolean; onToggleDark: () => void }) {
  const { profile: profileRepo } = useData();
  const profile = profileRepo.loadProfile();
  const location = useLocation();
  const navigate = useNavigate();
  const xpInLevel = profile.xp % 100;
  const xpTarget = 100;

  const navItems = [
    { id: "hub", label: "Hub", path: "/", exact: true },
    { id: "hangeul", label: "Hangeul", path: "/hangeul-practice", exact: false },
    { id: "grammar", label: "Grammar", path: "/grammar", exact: false },
    { id: "dictionary", label: "Dictionary", path: "/dictionary", exact: true },
    { id: "notes", label: "Notes", path: "/notes", exact: true },
  ];

  return (
    <Topbar
      sticky
      contentClassName="max-w-6xl mx-auto px-4"
      logo={
        <Link to="/" className="no-underline">
          <BrandLogo variant="primary" size={30} />
        </Link>
      }
      nav={
        <TopbarMenu
          items={navItems.map(({ id, label, path, exact }) => ({
            id,
            label,
            active: exact
              ? location.pathname === path
              : location.pathname.startsWith(path),
            onClick: () => navigate(path),
          }))}
        />
      }
      navPosition="center"
      actions={
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
          {IS_LIVE && <UserMenu />}
        </div>
      }
    />
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
    <BottomNav className="fixed bottom-0 left-0 right-0 z-30 lg:hidden">
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

function UserMenu() {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  if (auth.status !== "authenticated") return null;

  const menuItems: DropdownMenuItem[] = [
    {
      id: "settings",
      label: "Settings",
      icon: <Settings className="h-4 w-4" />,
      onClick: () => navigate("/settings"),
    },
    {
      id: "help",
      label: "Help & Support",
      icon: <HelpCircle className="h-4 w-4" />,
      onClick: () => navigate("/help"),
    },
    ...(auth.user.role === "admin"
      ? [
          {
            id: "admin",
            label: "Admin",
            icon: <ShieldCheck className="h-4 w-4" />,
            onClick: () => navigate("/admin"),
          },
        ]
      : []),
    {
      id: "logout",
      label: "Log out",
      icon: <LogOut className="h-4 w-4" />,
      onClick: logout,
      variant: "danger" as const,
      divider: true,
    },
  ];

  return (
    <DropdownMenu
      items={menuItems}
      title={auth.user.displayName}
      trigger={<User className="h-4 w-4 text-namsaek-500 dark:text-hanji-300" />}
    >
      <div className="text-sm font-medium truncate">{auth.user.displayName}</div>
      <div className="text-xs text-hanji-500 dark:text-hanji-400 truncate">{auth.user.email}</div>
    </DropdownMenu>
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
    <div className="flex items-center gap-3 rounded-2xl border border-hanji-300 bg-white px-3 py-1 shadow-sm dark:border-namsaek-700 dark:bg-namsaek-800">
      <div className="grid">
        <div className="text-xs text-hanji-500 dark:text-hanji-400">Streak</div>
        <div className="text-sm font-semibold text-geum-500 dark:text-geum-400">
          {streak} {streak === 1 ? "day" : "days"}
        </div>
      </div>
      <div className="h-9 w-px bg-hanji-300 dark:bg-namsaek-700" />
      <div className="grid min-w-30">
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

