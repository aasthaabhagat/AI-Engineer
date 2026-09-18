"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { careerAreas } from "@/data/career";
import { days, skillById } from "@/data";
import type { Maturity } from "@/data/types";
import { MATURITY_ORDER } from "@/data/types";
import { useStore } from "@/lib/store";
import { missingEvidence, skillEvidenceCount, skillMaturity } from "@/lib/maturity";
import {
  Card,
  MaturityBadge,
  SectionHeader,
  Pill,
  ProgressBar,
} from "@/components/ui";

const GROUPS = ["AI", "Engineering", "Production", "Career"] as const;

/** An area is only as ready as its weakest skill — the same rule as capabilities. */
function areaMaturity(
  skillIds: string[],
  evidence: Record<string, string>,
): { maturity: Maturity; ratio: number; weakest?: string } {
  const entries = skillIds
    .map((id) => skillById.get(id))
    .filter((s): s is NonNullable<typeof s> => Boolean(s))
    .map((s) => ({
      id: s.id,
      name: s.name,
      maturity: skillMaturity(s, evidence),
      ...skillEvidenceCount(s, evidence),
    }));

  if (entries.length === 0) return { maturity: "not-started", ratio: 0 };

  const ranks = entries.map((e) => MATURITY_ORDER.indexOf(e.maturity));
  const weakestRank = Math.min(...ranks);
  const totalDone = entries.reduce((s, e) => s + e.done, 0);
  const totalAll = entries.reduce((s, e) => s + e.total, 0);

  return {
    maturity: MATURITY_ORDER[weakestRank],
    ratio: totalAll === 0 ? 0 : totalDone / totalAll,
    weakest: entries[ranks.indexOf(weakestRank)]?.name,
  };
}

export function CareerSection() {
  const { state } = useStore();
  const [open, setOpen] = useState<string | null>(null);

  const assessed = careerAreas.map((area) => ({
    area,
    ...areaMaturity(area.skills, state.evidence),
  }));

  const overallRatio =
    assessed.reduce((sum, a) => sum + a.ratio, 0) / (assessed.length || 1);

  return (
    <div>
      <SectionHeader
        eyebrow="Am I hireable yet?"
        title="Career Readiness"
        description="Each area is rated by its weakest evidenced skill, not its average. An interviewer probes the gap, not the strength."
      />

      <Card className="mb-6">
        <div className="px-5 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm">Overall evidence across all areas</p>
            <p className="text-sm tabular-nums text-muted">
              {Math.round(overallRatio * 100)}%
            </p>
          </div>
          <ProgressBar value={overallRatio} className="mt-3" />
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">
            This is a measure of evidence recorded, not of talent or potential.
            Early in the year it should be low — if it were high, the ladder
            would be measuring the wrong things.
          </p>
        </div>
      </Card>

      <div className="space-y-8">
        {GROUPS.map((group) => {
          const list = assessed.filter((a) => a.area.group === group);
          if (list.length === 0) return null;

          return (
            <section key={group}>
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-faint">
                {group}
              </h2>
              <div className="space-y-2">
                {list.map(({ area, maturity, ratio, weakest }) => {
                  const isOpen = open === area.id;
                  const gaps = area.skills
                    .map((id) => skillById.get(id))
                    .filter((s): s is NonNullable<typeof s> => Boolean(s))
                    .flatMap((s) =>
                      missingEvidence(s, state.evidence)
                        .slice(0, 1)
                        .map((e) => ({ skill: s.name, skillId: s.id, label: e.label })),
                    );

                  const nextDay = days.find(
                    (d) =>
                      !state.completedDays[d.id] &&
                      d.skills.some((s) => area.skills.includes(s)),
                  );

                  return (
                    <Card key={area.id} as="article" id={area.id} className="overflow-hidden">
                      <button
                        onClick={() => setOpen(isOpen ? null : area.id)}
                        aria-expanded={isOpen}
                        className="flex w-full items-start gap-4 px-5 py-3.5 text-left transition hover:bg-raised"
                      >
                        <span className="min-w-0 flex-1">
                          <span className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                            <span className="text-sm font-medium">{area.name}</span>
                            <MaturityBadge maturity={maturity} />
                            {weakest && maturity !== "strong" && (
                              <span className="text-xs text-faint">
                                limited by {weakest}
                              </span>
                            )}
                          </span>
                          <span className="mt-1.5 block max-w-2xl text-sm leading-relaxed text-muted">
                            {area.expected}
                          </span>
                          <span className="mt-2.5 block max-w-xs">
                            <ProgressBar value={ratio} />
                          </span>
                        </span>
                        <ChevronDown
                          size={15}
                          className={`mt-1 shrink-0 text-faint transition-transform ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <div className="border-t border-line-soft">
                          <div className="grid gap-px bg-line-soft sm:grid-cols-2">
                            <div className="bg-panel px-5 py-4">
                              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-faint">
                                What proves it
                              </p>
                              <ul className="mt-2 space-y-1.5">
                                {area.provenBy.map((p) => (
                                  <li key={p} className="text-sm leading-relaxed text-muted">
                                    · {p}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="bg-panel px-5 py-4">
                              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-faint">
                                You will be asked
                              </p>
                              <ul className="mt-2 space-y-1.5">
                                {area.probes.map((p) => (
                                  <li key={p} className="text-sm leading-relaxed text-muted">
                                    · {p}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          {gaps.length > 0 && (
                            <div className="border-t border-line-soft px-5 py-4">
                              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-faint">
                                Missing evidence
                              </p>
                              <ul className="mt-2 space-y-1.5">
                                {gaps.map((g) => (
                                  <li key={`${g.skillId}-${g.label}`} className="text-xs">
                                    <Link
                                      href={`/plan/skills#${g.skillId}`}
                                      className="text-accent hover:underline"
                                    >
                                      {g.skill}
                                    </Link>
                                    <span className="text-muted"> — {g.label}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          <div className="flex flex-wrap items-center gap-2 border-t border-line-soft px-5 py-3.5">
                            {area.skills.map((id) => (
                              <Link key={id} href={`/plan/skills#${id}`}>
                                <Pill>{skillById.get(id)?.name ?? id}</Pill>
                              </Link>
                            ))}
                            {nextDay && (
                              <Link
                                href={`/day/${nextDay.dayNumber}`}
                                className="ml-auto inline-flex items-center gap-1.5 text-xs text-accent hover:underline"
                              >
                                Next: day {nextDay.dayNumber} <ArrowRight size={12} />
                              </Link>
                            )}
                          </div>
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
