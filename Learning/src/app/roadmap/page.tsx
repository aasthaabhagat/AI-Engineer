"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Flag, Lock } from "lucide-react";
import { days, phaseById, phases } from "@/data";
import { TRACK_LABEL, type Track } from "@/data/types";
import { useStore } from "@/lib/store";
import { currentDay, phaseProgress } from "@/lib/progress";
import {
  Card,
  PageHeader,
  Pill,
  ProgressBar,
  TRACK_DOT,
  TrackBadge,
} from "@/components/ui";

const TRACKS: Track[] = ["software", "ai", "production", "career"];

export default function RoadmapPage() {
  const { state } = useStore();
  const [open, setOpen] = useState<string | null>(
    currentDay(days, state)?.phaseId ?? "p01-python",
  );
  const [trackFilter, setTrackFilter] = useState<Track | "all">("all");

  const active = currentDay(days, state);
  const visible =
    trackFilter === "all" ? phases : phases.filter((p) => p.track === trackFilter);

  return (
    <div>
      <PageHeader
        eyebrow="Year → Phase → Module → Day"
        title="Roadmap"
        description="Four tracks running in parallel, not a waterfall. Order is the centre of gravity; production and career work start early and keep growing."
      />

      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setTrackFilter("all")}
          className={`rounded-full border px-3 py-1.5 text-xs transition ${
            trackFilter === "all"
              ? "border-accent/50 bg-accent-soft text-accent"
              : "border-line bg-raised text-muted hover:text-ink"
          }`}
        >
          All tracks
        </button>
        {TRACKS.map((t) => (
          <button
            key={t}
            onClick={() => setTrackFilter(t)}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition ${
              trackFilter === t
                ? "border-accent/50 bg-accent-soft text-accent"
                : "border-line bg-raised text-muted hover:text-ink"
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${TRACK_DOT[t]}`} />
            {TRACK_LABEL[t]}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {visible.map((phase) => {
          const stats = phaseProgress(days, phase.id, state);
          const phaseDays = days.filter((d) => d.phaseId === phase.id);
          const isOpen = open === phase.id;
          const isCurrent = active?.phaseId === phase.id;

          const blockers = phase.dependsOn
            .map((id) => phaseById.get(id))
            .filter((p) => p && phaseProgress(days, p.id, state).done === 0);
          const locked = phase.authoring === "outline" && blockers.length > 0;

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
                    <TrackBadge track={phase.track} />
                    {isCurrent && <Pill tone="accent">Current</Pill>}
                    {phase.authoring === "outline" && (
                      <span className="text-[0.65rem] uppercase tracking-wider text-faint">
                        Outline
                      </span>
                    )}
                    {locked && (
                      <span className="inline-flex items-center gap-1 text-[0.65rem] uppercase tracking-wider text-faint">
                        <Lock size={10} /> Gated
                      </span>
                    )}
                  </span>

                  <span className="mt-1.5 block max-w-3xl text-xs leading-relaxed text-muted">
                    {phase.summary}
                  </span>

                  {phaseDays.length > 0 && (
                    <span className="mt-3 block max-w-sm">
                      <ProgressBar value={stats.ratio} />
                      <span className="mt-1.5 block text-[0.68rem] text-faint">
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
                <div className="border-t border-line-soft">
                  <div className="grid gap-px bg-line-soft sm:grid-cols-2">
                    {phase.modules.map((m) => (
                      <div key={m.id} className="bg-panel px-5 py-4">
                        <p className="text-sm font-medium">{m.title}</p>
                        <p className="mt-1.5 text-xs leading-relaxed text-muted">
                          {m.description}
                        </p>
                        <ul className="mt-2.5 space-y-1">
                          {m.outcomes.map((o) => (
                            <li key={o} className="text-xs text-faint">
                              · {o}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  {phaseDays.length > 0 && (
                    <div className="border-t border-line-soft px-5 py-4">
                      <p className="mb-3 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-faint">
                        Days
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {phaseDays.map((d) => {
                          const done = Boolean(state.completedDays[d.id]);
                          const current = active?.id === d.id;
                          return (
                            <Link
                              key={d.id}
                              href={`/day/${d.dayNumber}`}
                              title={d.title}
                              className={`rounded-md border px-2 py-1 font-mono text-[0.7rem] tabular-nums transition ${
                                current
                                  ? "border-accent bg-accent text-[#0a0b0e]"
                                  : done
                                    ? "border-ok/40 bg-ok/10 text-ok"
                                    : "border-line bg-raised text-muted hover:text-ink"
                              }`}
                            >
                              {d.dayNumber}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap items-start gap-x-6 gap-y-3 border-t border-line-soft px-5 py-4">
                    <p className="flex items-start gap-2 text-xs text-muted">
                      <Flag size={13} className="mt-0.5 shrink-0 text-accent" />
                      <span>
                        <span className="text-faint">Milestone: </span>
                        {phase.milestone}
                      </span>
                    </p>
                    {phase.dependsOn.length > 0 && (
                      <p className="text-xs text-faint">
                        Depends on:{" "}
                        {phase.dependsOn
                          .map((id) => phaseById.get(id)?.title ?? id)
                          .join(", ")}
                      </p>
                    )}
                    <p className="text-xs text-faint">
                      ~{phase.estimatedDays} days
                    </p>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      <p className="mt-8 text-xs leading-relaxed text-faint">
        Phases marked <span className="text-muted">Outline</span> have modules,
        outcomes and milestones but no day-by-day missions yet. That is
        deliberate: writing them months in advance would lock in assumptions
        about your pace and about code that does not exist yet.
      </p>
    </div>
  );
}
