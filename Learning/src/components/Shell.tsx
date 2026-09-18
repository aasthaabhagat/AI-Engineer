"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BookMarked,
  CalendarDays,
  ClipboardCheck,
  Command,
  Compass,
  FolderGit2,
  LayoutDashboard,
  Layers,
  Menu,
  Settings,
  Sparkles,
  Target,
  Trophy,
  X,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { days } from "@/data";
import { currentDay, scheduleStatus } from "@/lib/progress";

const NAV = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/today", label: "Today", icon: Target },
  { href: "/roadmap", label: "Roadmap", icon: Compass },
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/skills", label: "Skills", icon: Layers },
  { href: "/projects", label: "Projects", icon: FolderGit2 },
  { href: "/knowledge", label: "Knowledge", icon: BookMarked },
  { href: "/blueprints", label: "Blueprints", icon: Sparkles },
  { href: "/portfolio", label: "Portfolio", icon: Trophy },
  { href: "/reviews", label: "Reviews", icon: ClipboardCheck },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { state, hydrated, storageError } = useStore();

  // Theme is applied to the document root so CSS variables can switch.
  useEffect(() => {
    document.documentElement.dataset.theme = state.settings.theme;
  }, [state.settings.theme]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const today = currentDay(days, state);
  const status = scheduleStatus(days, state);

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[236px_1fr]">
      {/* Mobile bar */}
      <div className="flex items-center justify-between border-b border-line bg-panel px-4 py-3 lg:hidden">
        <Link href="/" className="text-sm font-semibold tracking-tight">
          Training OS
        </Link>
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          className="rounded-lg border border-line p-1.5 text-muted"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      <aside
        className={`${
          open ? "block" : "hidden"
        } border-b border-line bg-panel lg:sticky lg:top-0 lg:block lg:h-screen lg:border-b-0 lg:border-r`}
      >
        <div className="flex h-full flex-col">
          <div className="hidden px-5 py-5 lg:block">
            <Link href="/" className="block">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-faint">
                AI Engineer
              </p>
              <p className="text-[0.95rem] font-semibold tracking-tight">
                Training OS
              </p>
            </Link>
          </div>

          <nav className="flex-1 space-y-0.5 px-3 pb-4 lg:px-3">
            {NAV.map(({ href, label, icon: Icon }) => {
              const active =
                href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition ${
                    active
                      ? "bg-accent-soft text-accent"
                      : "text-muted hover:bg-raised hover:text-ink"
                  }`}
                >
                  <Icon size={16} strokeWidth={1.75} />
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-line-soft px-5 py-4">
            {hydrated && today ? (
              <>
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-faint">
                  Up next
                </p>
                <p className="mt-1 text-xs leading-snug text-muted">
                  Day {today.dayNumber} · {today.title}
                </p>
              </>
            ) : (
              <p className="text-xs text-muted">All authored days complete.</p>
            )}
            {status.recoveryMode && (
              <p className="mt-2 text-[0.68rem] leading-snug text-amber">
                Recovery mode active
              </p>
            )}
            <p className="mt-3 flex items-center gap-1.5 text-[0.68rem] text-faint">
              <Command size={11} /> K for the command palette
            </p>
          </div>
        </div>
      </aside>

      <main className="min-w-0">
        {storageError && (
          <div className="border-b border-amber/30 bg-amber/10 px-6 py-2 text-xs text-amber">
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
