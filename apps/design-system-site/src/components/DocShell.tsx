import { useState, useEffect, type ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { BrandLogo, Container } from "@reterics/birdie-ui";
import {
  Home,
  Compass,
  Palette,
  LayoutGrid,
  Layers,
  Stamp,
  BookOpen,
  Download,
  Sun,
  Moon,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { to: "/", label: "Overview", icon: Home },
  { to: "/principles", label: "Principles", icon: Compass },
  { to: "/foundations", label: "Foundations", icon: Palette },
  { to: "/components", label: "Components", icon: LayoutGrid },
  { to: "/patterns", label: "Patterns", icon: Layers },
  { to: "/brand", label: "Brand", icon: Stamp },
  { to: "/storybook", label: "Storybook", icon: BookOpen },
  { to: "/resources", label: "Resources", icon: Download },
];

export function DocShell({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState(() => {
    const stored = localStorage.getItem("theme");
    if (stored) return stored === "dark";
    return document.documentElement.classList.contains("dark");
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  const sidebar = (
    <nav className="flex flex-col gap-0.5">
      {navItems.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/"}
          onClick={() => setMobileOpen(false)}
          className={({ isActive }) =>
            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition " +
            (isActive
              ? "bg-namsaek-500 text-hanji-50"
              : "text-namsaek-600 hover:bg-hanji-200 dark:text-hanji-300 dark:hover:bg-namsaek-800")
          }
        >
          <Icon className="h-4 w-4 shrink-0" />
          {label}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-hanji-200 bg-white/80 backdrop-blur dark:border-namsaek-800 dark:bg-namsaek-950/80">
        <Container className="flex h-14 items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="rounded-lg p-2 text-namsaek-600 hover:bg-hanji-100 lg:hidden dark:text-hanji-300 dark:hover:bg-namsaek-800"
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
            <BrandLogo size={24} />
            <span className="text-xs font-semibold text-namsaek-400 dark:text-hanji-500">
              Design System
            </span>
          </div>
          <button
            onClick={() => setDark(!dark)}
            className="rounded-lg p-2 text-namsaek-600 hover:bg-hanji-100 dark:text-hanji-300 dark:hover:bg-namsaek-800 transition"
          >
            {dark ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>
        </Container>
      </header>

      <Container className="flex gap-8 py-8">
        {/* Desktop sidebar */}
        <aside className="hidden w-52 shrink-0 lg:block">{sidebar}</aside>

        {/* Mobile sidebar overlay */}
        {mobileOpen && (
          <div className="fixed inset-0 top-14 z-20 bg-white p-6 lg:hidden dark:bg-namsaek-950">
            {sidebar}
          </div>
        )}

        {/* Main content */}
        <main className="min-w-0 flex-1">{children}</main>
      </Container>
    </div>
  );
}
