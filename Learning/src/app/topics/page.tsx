"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { days, phases } from "@/data";
import { useStore } from "@/lib/store";
import { currentDay, phaseProgress } from "@/lib/progress";
import { Card, PageHeader, Pill, ProgressBar } from "@/components/ui";

export default function TopicsPage() {
  const { state } = useStore();
  const active = currentDay(days, state);
  const [open, setOpen] = useState<string | null>(active?.phaseId ?? "p01-python");

  return (
    <div>
      <PageHeader
        eyebrow="24 phases"
        title="Study topics"
        description="Every phase and the topics inside it. Phases with daily tasks link to the days that cover each topic."
      />

      <div className="space-y-3">
        {phases.map((phase) => {
          const stats = phaseProgress(days, phase.id, state);
          const isOpen = open === phase.id;
          const isCurrent = active?.phaseId === phase.id;

          return (
            <Card key={phase.id} as="article" className="overflow-hidden">
              <button
                id={phase.id}
                onClick={() => setOpen(isOpen ? null : phase.id)}
                aria-expanded={isOpen}
                className="flex w-full items-start gap-4 px-5 py-4 text-left transition hover:bg-raised"
              >
                <span className="mt-0.5 font-mono text-xs tabular-nums text-faint">
                  {String(phase.order).padStart(2, "0")}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                    <span className="text-[0.95rem] font-medium">{phase.title}</span>
                    {isCurrent && <Pill tone="accent">Current</Pill>}
                    {phase.authoring === "outline" && (
                      <span className="text-xs uppercase tracking-wider text-faint">
                        Topics only
                      </span>
                    )}
                  </span>

                  <span className="mt-1.5 block max-w-3xl text-sm leading-relaxed text-muted">
                    {phase.summary}
                  </span>

                  {stats.total > 0 && (
                    <span className="mt-3 block max-w-sm">
                      <ProgressBar value={stats.ratio} />
                      <span className="mt-1.5 block text-xs text-faint">
                        {stats.done}/{stats.total} days complete
                      </span>
                    </span>
                  )}
                </span>

                <ChevronDown
                  size={16}
                  className={`mt-1 shrink-0 text-faint transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="grid gap-px border-t border-line-soft bg-line-soft sm:grid-cols-2">
                  {phase.modules.map((m) => {
                    const moduleDays = days.filter((d) => d.moduleId === m.id);
                    return (
                      <div key={m.id} className="bg-panel px-5 py-4">
                        <p className="text-sm font-medium">{m.title}</p>
                        <p className="mt-1.5 text-sm leading-relaxed text-muted">
                          {m.description}
                        </p>
                        <ul className="mt-2.5 space-y-1">
                          {m.outcomes.map((o) => (
                            <li key={o} className="text-xs text-faint">
                              · {o}
                            </li>
                          ))}
                        </ul>

                        {moduleDays.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {moduleDays.map((d) => {
                              const done = Boolean(state.completedDays[d.id]);
                              const current = active?.id === d.id;
                              return (
                                <Link
                                  key={d.id}
                                  href={`/day/${d.dayNumber}`}
                                  title={d.title}
                                  className={`rounded-md border px-2 py-1 font-mono text-xs tabular-nums transition ${
                                    current
                                      ? "border-accent bg-accent text-on-accent"
                                      : done
                                        ? "border-ok/40 bg-ok/10 text-ok"
                                        : "border-line bg-raised text-muted hover:text-ink"
                                  }`}
                                >
                                  Day {d.dayNumber}
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
