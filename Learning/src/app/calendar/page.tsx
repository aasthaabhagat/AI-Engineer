"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { days } from "@/data";
import { useStore } from "@/lib/store";
import { currentDay, dateKey, isStudyDay, scheduledDate } from "@/lib/progress";
import { Card, PageHeader } from "@/components/ui";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function CalendarPage() {
  const { state } = useStore();
  const [month, setMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const active = currentDay(days, state);
  const todayKey = dateKey(new Date());

  /** Planned schedule: which day number falls on which date. */
  const plannedByDate = useMemo(() => {
    const map = new Map<string, number>();
    for (const d of days) {
      map.set(dateKey(scheduledDate(d.dayNumber, state.settings)), d.dayNumber);
    }
    return map;
  }, [state.settings]);

  /** Actual completions, keyed by the date they happened. */
  const completedByDate = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const [dayId, record] of Object.entries(state.completedDays)) {
      const key = dateKey(new Date(record.completedAt));
      map.set(key, [...(map.get(key) ?? []), dayId]);
    }
    return map;
  }, [state.completedDays]);

  const cells = useMemo(() => {
    const first = new Date(month.getFullYear(), month.getMonth(), 1);
    const start = new Date(first);
    start.setDate(1 - first.getDay());

    return Array.from({ length: 42 }, (_, i) => {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      return date;
    });
  }, [month]);

  return (
    <div>
      <PageHeader
        eyebrow="Schedule"
        title="Calendar"
        description="Planned days against what actually happened. Gaps are information, not failure — the recovery logic on the dashboard responds to them."
      />

      <Card>
        <div className="flex items-center justify-between border-b border-line-soft px-5 py-3.5">
          <h2 className="text-sm font-medium">
            {month.toLocaleDateString(undefined, { month: "long", year: "numeric" })}
          </h2>
          <div className="flex gap-1">
            <button
              onClick={() =>
                setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))
              }
              className="rounded-lg border border-line p-1.5 text-muted transition hover:text-ink"
              aria-label="Previous month"
            >
              <ChevronLeft size={15} />
            </button>
            <button
              onClick={() =>
                setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))
              }
              className="rounded-lg border border-line p-1.5 text-muted transition hover:text-ink"
              aria-label="Next month"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 border-b border-line-soft">
          {WEEKDAYS.map((d) => (
            <div
              key={d}
              className="px-2 py-2 text-center text-[0.62rem] font-semibold uppercase tracking-wider text-faint"
            >
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-px bg-line-soft">
          {cells.map((date) => {
            const key = dateKey(date);
            const inMonth = date.getMonth() === month.getMonth();
            const planned = plannedByDate.get(key);
            const completed = completedByDate.get(key);
            const isToday = key === todayKey;
            const isPast = key < todayKey;
            const studyDay = isStudyDay(date, state.settings);
            const missed =
              isPast && planned !== undefined && !completed && studyDay;

            const content = (
              <div
                className={`flex min-h-[74px] flex-col gap-1 bg-panel p-2 transition ${
                  inMonth ? "" : "opacity-35"
                } ${planned !== undefined ? "hover:bg-raised" : ""}`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs tabular-nums ${
                      isToday
                        ? "rounded bg-accent px-1.5 py-0.5 font-semibold text-[#0a0b0e]"
                        : "text-faint"
                    }`}
                  >
                    {date.getDate()}
                  </span>
                  {!studyDay && inMonth && (
                    <span className="text-[0.6rem] uppercase text-faint">off</span>
                  )}
                </div>

                {completed && (
                  <span className="rounded bg-ok/15 px-1.5 py-0.5 text-[0.62rem] text-ok">
                    {completed.length > 1
                      ? `${completed.length} days done`
                      : "Completed"}
                  </span>
                )}

                {!completed && planned !== undefined && (
                  <span
                    className={`rounded px-1.5 py-0.5 text-[0.62rem] ${
                      missed
                        ? "bg-amber/15 text-amber"
                        : active?.dayNumber === planned
                          ? "bg-accent-soft text-accent"
                          : "bg-raised text-muted"
                    }`}
                  >
                    Day {planned}
                  </span>
                )}
              </div>
            );

            return planned !== undefined ? (
              <Link key={key} href={`/day/${planned}`} className="block">
                {content}
              </Link>
            ) : (
              <div key={key}>{content}</div>
            );
          })}
        </div>
      </Card>

      <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted">
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded bg-ok/40" /> Completed
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded bg-accent" /> Current
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded bg-amber/40" /> Planned but missed
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded bg-raised" /> Scheduled ahead
        </span>
      </div>
    </div>
  );
}
