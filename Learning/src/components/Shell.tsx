"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BookMarked,
  Briefcase,
  CalendarDays,
  ClipboardCheck,
  Command,
  Compass,
  FolderGit2,
  LayoutDashboard,
  Layers,
  Menu,
  Moon,
  Network,
  Radar,
  Settings,
  Sparkles,
  Sun,
  Target,
  Trophy,
  X,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { days } from "@/data";
import { currentDay, scheduleStatus } from "@/lib/progress";

/**
 * Every destination stays one click away. The group labels are presentation
 * only — they give the fourteen links a shape to scan instead of one long
 * undifferentiated list.
 */
const NAV: { group: string; items: { href: string; label: string; icon: typeof Target }[] }[] = [
  {
    group: "Daily",
    items: [
      { href: "/", label: "Dashboard", icon: LayoutDashboard },
      { href: "/today", label: "Today", icon: Target },
    ],
  },
  {
    group: "Plan",
    items: [
      { href: "/roadmap", label: "Roadmap", icon: Compass },
      { href: "/calendar", label: "Calendar", icon: CalendarDays },
      { href: "/skills", label: "Skills", icon: Layers },
      { href: "/projects", label: "Projects", icon: FolderGit2 },
    ],
  },
  {
    group: "Library",
    items: [
      { href: "/knowledge", label: "Knowledge", icon: BookMarked },
      { href: "/blueprints", label: "Blueprints", icon: Sparkles },
      { href: "/system-design", label: "System Design", icon: Network },
      { href: "/radar", label: "AI Radar", icon: Radar },
    ],
  },
  {
    group: "Progress",
    items: [
      { href: "/portfolio", label: "Portfolio", icon: Trophy },
      { href: "/career", label: "Career Readiness", icon: Briefcase },
      { href: "/reviews", label: "Reviews", icon: ClipboardCheck },
      { href: "/settings", label: "Settings", icon: Settings },
    ],
  },
];

function ThemeToggle() {
  const { state, updateSettings } = useStore();
  const dark = state.settings.theme === "dark";

  return (
    <button
      onClick={() => updateSettings({ theme: dark ? "light" : "dark" })}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      title={dark ? "Switch to light theme" : "Switch to dark theme"}
      className="flex items-center gap-2 rounded-lg border border-line bg-panel px-2.5 py-1.5 text-xs text-muted transition hover:border-accent/50 hover:text-ink"
    >
      {dark ? <Moon size={13} aria-hidden /> : <Sun size={13} aria-hidden />}
      {dark ? "Dark" : "Light"}
    </button>
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { state, hydrated, storageError } = useStore();

  // Theme is applied to the document root so the CSS variables can switch.
  // The inline script in the layout has already done this before first paint;
  // this keeps it in step when the toggle is used.
  useEffect(() => {
    document.documentElement.dataset.theme = state.settings.theme;
  }, [state.settings.theme]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const today = currentDay(days, state);
  const status = scheduleStatus(days, state);

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[248px_1fr]">
      {/* Mobile bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-panel/90 px-4 py-3 backdrop-blur lg:hidden">
        <Link href="/" className="text-sm font-semibold tracking-tight">
          Training OS
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            className="rounded-lg border border-line p-1.5 text-muted transition hover:text-ink"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <aside
        className={`${
          open ? "block" : "hidden"
        } border-b border-line bg-panel lg:sticky lg:top-0 lg:block lg:h-screen lg:border-b-0 lg:border-r`}
      >
        <div className="flex h-full flex-col">
          <div className="hidden items-center gap-2.5 px-5 py-5 lg:flex">
            <Link href="/" className="flex items-center gap-2.5">
              <span
                className="grid h-7 w-7 shrink-0 place-content-center rounded-lg bg-accent text-xs font-bold text-on-accent"
                aria-hidden
              >
                AI
              </span>
              <span>
                <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-faint">
                  AI Engineer
                </span>
                <span className="block text-[0.95rem] font-semibold tracking-tight">
                  Training OS
                </span>
              </span>
            </Link>
          </div>

          <nav className="flex-1 overflow-y-auto px-3 pb-4">
            {NAV.map(({ group, items }) => (
              <div key={group} className="mb-4 last:mb-0">
                <p className="px-3 pb-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-faint">
                  {group}
                </p>
                <ul className="space-y-0.5">
                  {items.map(({ href, label, icon: Icon }) => {
                    const active =
                      href === "/" ? pathname === "/" : pathname.startsWith(href);
                    return (
                      <li key={href}>
                        <Link
                          href={href}
                          aria-current={active ? "page" : undefined}
                          className={`relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition ${
                            active
                              ? "bg-accent-soft font-medium text-accent"
                              : "text-muted hover:bg-raised hover:text-ink"
                          }`}
                        >
                          {active && (
                            <span
                              className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-accent"
                              aria-hidden
                            />
                          )}
                          <Icon size={16} strokeWidth={1.75} aria-hidden />
                          {label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>

          <div className="border-t border-line-soft px-5 py-4">
            {hydrated && today ? (
              <>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-faint">
                  Up next
                </p>
                <p className="mt-1 text-sm leading-snug text-muted">
                  Day {today.dayNumber} · {today.title}
                </p>
              </>
            ) : (
              <p className="text-sm text-muted">All authored days complete.</p>
            )}
            {hydrated && status.recoveryMode && (
              <p className="mt-2 text-xs leading-snug text-amber">
                Recovery mode active
              </p>
            )}

            <div className="mt-4 flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 text-xs text-faint">
                <Command size={11} aria-hidden /> K
              </span>
              <div className="hidden lg:block">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </aside>

      <main className="min-w-0">
        {storageError && (
          <div className="border-b border-amber/30 bg-amber/10 px-6 py-2 text-sm text-amber">
            Local storage problem: {storageError} Progress may not be saved this
            session.
          </div>
        )}
        <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
          {children}
        </div>
      </main>
    </div>
  );
}
