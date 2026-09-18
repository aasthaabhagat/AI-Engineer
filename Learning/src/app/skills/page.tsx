"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { days, skills } from "@/data";
import { TRACK_LABEL, type SkillTier } from "@/data/types";
import { useStore } from "@/lib/store";
import { skillEvidenceCount, skillMaturity } from "@/lib/maturity";
import {
  Card,
  MaturityBadge,
  PageHeader,
  Pill,
  ProgressBar,
  TrackBadge,
} from "@/components/ui";

const TIER_LABEL: Record<SkillTier, string> = {
  core: "Core",
  important: "Important",
  supporting: "Supporting",
  awareness: "Awareness",
};

const TIER_ORDER: SkillTier[] = ["core", "important", "supporting", "awareness"];

export default function SkillsPage() {
  const { state, toggleEvidence } = useStore();
  const [open, setOpen] = useState<string | null>(null);
  const [tier, setTier] = useState<SkillTier | "all">("all");

  const grouped = useMemo(() => {
    const filtered = tier === "all" ? skills : skills.filter((s) => s.tier === tier);
    const map = new Map<string, typeof skills>();
    for (const s of filtered) {
      map.set(s.category, [...(map.get(s.category) ?? []), s]);
    }
    return [...map.entries()];
  }, [tier]);

  const daysForSkill = useMemo(() => {
    const map = new Map<string, number[]>();
    for (const d of days) {
      for (const s of d.skills) {
        map.set(s, [...(map.get(s) ?? []), d.dayNumber]);
      }
    }
    return map;
  }, []);

  return (
    <div>
      <PageHeader
        eyebrow="Evidence-based"
        title="Skills"
        description="Maturity is derived from evidence, never declared. Tick a rung only when you can point at the code, the commit or the measurement that proves it."
      />

      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setTier("all")}
          className={`rounded-full border px-3 py-1.5 text-xs transition ${
            tier === "all"
              ? "border-accent/50 bg-accent-soft text-accent"
              : "border-line bg-raised text-muted hover:text-ink"
          }`}
        >
          All
        </button>
        {TIER_ORDER.map((t) => (
          <button
            key={t}
            onClick={() => setTier(t)}
            className={`rounded-full border px-3 py-1.5 text-xs transition ${
              tier === t
                ? "border-accent/50 bg-accent-soft text-accent"
                : "border-line bg-raised text-muted hover:text-ink"
            }`}
          >
            {TIER_LABEL[t]}
          </button>
        ))}
      </div>

      <div className="space-y-8">
        {grouped.map(([category, list]) => (
          <section key={category}>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-faint">
              {category}
            </h2>
            <div className="space-y-2">
              {list.map((skill) => {
                const maturity = skillMaturity(skill, state.evidence);
                const { done, total } = skillEvidenceCount(skill, state.evidence);
                const isOpen = open === skill.id;
                const relatedDays = daysForSkill.get(skill.id) ?? [];

                return (
                  <Card key={skill.id} as="article" className="overflow-hidden">
                    <button
                      id={skill.id}
                      onClick={() => setOpen(isOpen ? null : skill.id)}
                      aria-expanded={isOpen}
                      className="flex w-full items-start gap-4 px-5 py-3.5 text-left transition hover:bg-raised"
                    >
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                          <span className="text-sm font-medium">{skill.name}</span>
                          <MaturityBadge maturity={maturity} />
                          <span className="text-xs uppercase tracking-wider text-faint">
                            {TIER_LABEL[skill.tier]}
                          </span>
                        </span>
                        <span className="mt-1.5 block max-w-2xl text-sm leading-relaxed text-muted">
                          {skill.summary}
                        </span>
                        <span className="mt-2.5 block max-w-xs">
                          <ProgressBar
                            value={total === 0 ? 0 : done / total}
                            tone={done === total ? "teal" : "accent"}
                          />
                          <span className="mt-1 block text-xs text-faint">
                            {done}/{total} evidence
                          </span>
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
                              Why it exists
                            </p>
                            <p className="mt-1.5 text-sm leading-relaxed text-muted">
                              {skill.whyItExists}
                            </p>
                          </div>
                          <div className="bg-panel px-5 py-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-faint">
                              When not to use it
                            </p>
                            <p className="mt-1.5 text-sm leading-relaxed text-muted">
                              {skill.whenNotToUse ??
                                "No strong counter-indication — but never reach for it without a problem that needs it."}
                            </p>
                          </div>
                        </div>

                        <div className="border-t border-line-soft px-5 py-4">
                          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-faint">
                            Evidence ladder
                          </p>
                          <ul className="space-y-2.5">
                            {skill.evidence.map((ev) => {
                              const checked = Boolean(state.evidence[ev.id]);
                              return (
                                <li key={ev.id} className="flex items-start gap-3">
                                  <input
                                    type="checkbox"
                                    className="checkbox mt-0.5"
                                    checked={checked}
                                    onChange={() => toggleEvidence(ev.id)}
                                    aria-label={ev.label}
                                  />
                                  <span
                                    className={`text-sm ${
                                      checked ? "text-muted" : "text-ink"
                                    }`}
                                  >
                                    {ev.label}
                                  </span>
                                </li>
                              );
                            })}
                          </ul>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line-soft px-5 py-3.5">
                          <TrackBadge track={skill.track} />
                          <span className="text-xs text-faint">
                            {TRACK_LABEL[skill.track]}
                          </span>
                          {relatedDays.length > 0 && (
                            <span className="flex flex-wrap items-center gap-1.5 text-xs text-faint">
                              Days:
                              {relatedDays.slice(0, 10).map((n) => (
                                <Link
                                  key={n}
                                  href={`/day/${n}`}
                                  className="rounded border border-line bg-raised px-1.5 py-0.5 font-mono text-xs text-muted transition hover:text-ink"
                                >
                                  {n}
                                </Link>
                              ))}
                            </span>
                          )}
                          {skill.relatedProjects.length > 0 && (
                            <span className="flex flex-wrap items-center gap-1.5">
                              {skill.relatedProjects.map((p) => (
                                <Link key={p} href={`/projects#${p}`}>
                                  <Pill>{p}</Pill>
                                </Link>
                              ))}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
