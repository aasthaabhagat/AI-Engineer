"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Search, Settings } from "lucide-react";
import { useStore } from "@/lib/store";
import { days, phaseById, weekForDay } from "@/data";
import { currentDay, scheduleStatus } from "@/lib/progress";

/**
 * Three destinations, not fourteen.
 *
 * TODAY is the working surface. PLAN is everything about where you are going.
 * LIBRARY is reference you consult, not work you do. Settings is a gear, not a
 * peer of the other three — you visit it twice a year.
 */
const NAV = [
  { href: "/", label: "Today" },
  { href: "/plan", label: "Plan" },
  { href: "/library", label: "Library" },
];

function openPalette() {
  window.dispatchEvent(new CustomEvent("palette:open"));
}

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { state, hydrated, storageError } = useStore();

  useEffect(() => {
    document.documentElement.dataset.theme = state.settings.theme;
  }, [state.settings.theme]);

  // Today is a reading surface and wants a narrow measure; Plan and Library
  // hold tables, grids and matrices and need the room.
  const wide = pathname.startsWith("/plan") || pathname.startsWith("/library");
  const width = wide ? "max-w-5xl" : "max-w-3xl";

  const today = currentDay(days, state);
  const status = scheduleStatus(days, state);
  const phase = today ? phaseById.get(today.phaseId) : undefined;
  const week = today ? weekForDay(today.dayNumber) : undefined;

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-line-soft bg-bg/85 backdrop-blur">
        <div className={`mx-auto flex h-14 ${width} items-center gap-1 px-5 sm:px-8`}>
          <Link
            href="/"
            className="mr-4 shrink-0 text-sm font-semibold tracking-tight sm:mr-6"
          >
            AI Engineer
          </Link>

          <nav className="flex items-center gap-1">
            {NAV.map(({ href, label }) => {
              const active =
                href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-full px-3.5 py-1.5 text-sm transition ${
                    active
                      ? "bg-raised font-medium text-ink"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-1">
            {hydrated && today && (
              <p className="mr-2 hidden text-xs text-faint sm:block">
                Day {today.dayNumber}
                {week && ` · Week ${week.number}`}
                {phase && ` · ${phase.title}`}
              </p>
            )}
            <button
              onClick={openPalette}
              aria-label="Search everything"
              title="Search (Ctrl K)"
              className="rounded-full p-2 text-muted transition hover:bg-raised hover:text-ink"
            >
              <Search size={16} strokeWidth={1.75} />
            </button>
            <Link
              href="/settings"
              aria-label="Settings"
              aria-current={pathname === "/settings" ? "page" : undefined}
              className={`rounded-full p-2 transition hover:bg-raised hover:text-ink ${
                pathname === "/settings" ? "text-ink" : "text-muted"
              }`}
            >
              <Settings size={16} strokeWidth={1.75} />
            </Link>
          </div>
        </div>
      </header>

      {storageError && (
        <div className="border-b border-amber/30 bg-amber/10 px-5 py-2 text-center text-xs text-amber">
          Local storage problem: {storageError} Progress may not be saved this
          session.
        </div>
      )}

      {hydrated && status.recoveryMode && pathname === "/" && (
        <div className="border-b border-amber/20 bg-amber/5 px-5 py-2 text-center text-xs text-amber">
          Recovery mode — essential tasks only until the rhythm returns.
        </div>
      )}

      <main className={`mx-auto ${width} px-5 pb-24 pt-10 sm:px-8`}>{children}</main>
    </div>
  );
}
