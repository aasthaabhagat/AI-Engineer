"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, TriangleAlert } from "lucide-react";
import {
  RADAR_STANCES,
  monthlyUpdateSteps,
  radarCategories,
  radarEntries,
  type RadarStance,
} from "@/data/radar";
import { skillById } from "@/data";
import { useStore } from "@/lib/store";
import { Card, CardHeader, PageHeader, Pill } from "@/components/ui";

const STANCE_STYLE: Record<RadarStance, string> = {
  keep: "border-ok/50 bg-ok/10 text-ok",
  learn: "border-accent/50 bg-accent-soft text-accent",
  experiment: "border-amber/50 bg-amber/10 text-amber",
  ignore: "border-line bg-raised text-faint",
};

export default function RadarPage() {
  const { state, setRadarStance } = useStore();
  const [open, setOpen] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const visible =
    filter === "all"
      ? radarEntries
      : radarEntries.filter((e) => e.category === filter);

  const classified = Object.keys(state.radar).length;

  return (
    <div>
      <PageHeader
        eyebrow="Awareness, not news"
        title="AI Engineering Radar"
        description="Durable categories and the questions that let you judge anything new in them. There is no live feed here — that would be a fabricated integration, and a list of today's best tools is wrong within weeks."
      />

      <div className="mb-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHeader
            title="Monthly update"
            hint="30-60 minutes, once a month. Set a timer."
          />
          <ol className="space-y-2 px-5 py-4">
            {monthlyUpdateSteps.map((step, i) => (
              <li key={step} className="flex gap-3 text-sm leading-relaxed">
                <span className="font-mono tabular-nums text-faint">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-muted">{step}</span>
              </li>
            ))}
          </ol>
          <div className="border-t border-line-soft px-5 py-3">
            <p className="text-xs font-medium text-accent">BUILD &gt; READ</p>
            <p className="mt-1 text-sm leading-relaxed text-faint">
              A month spent reading about agents while building nothing is a
              wasted month, however current it leaves you.
            </p>
          </div>
        </Card>

        <Card>
          <CardHeader title="Stances" hint={`${classified} of ${radarEntries.length} classified`} />
          <dl className="space-y-2.5 px-5 py-4">
            {RADAR_STANCES.map((s) => (
              <div key={s.id} className="flex gap-3">
                <dt>
                  <span
                    className={`rounded border px-2 py-0.5 text-xs font-semibold uppercase tracking-wider ${STANCE_STYLE[s.id]}`}
                  >
                    {s.label}
                  </span>
                </dt>
                <dd className="text-sm leading-relaxed text-muted">
                  {s.meaning}
                </dd>
              </div>
            ))}
          </dl>
        </Card>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`rounded-full border px-3 py-1.5 text-xs transition ${
            filter === "all"
              ? "border-accent/50 bg-accent-soft text-accent"
              : "border-line bg-raised text-muted hover:text-ink"
          }`}
        >
          All
        </button>
        {radarCategories.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`rounded-full border px-3 py-1.5 text-xs transition ${
              filter === c
                ? "border-accent/50 bg-accent-soft text-accent"
                : "border-line bg-raised text-muted hover:text-ink"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {visible.map((entry) => {
          const isOpen = open === entry.id;
          const stance = state.radar[entry.id];

          return (
            <Card key={entry.id} as="article" id={entry.id} className="overflow-hidden">
              <button
                onClick={() => setOpen(isOpen ? null : entry.id)}
                aria-expanded={isOpen}
                className="flex w-full items-start gap-4 px-5 py-3.5 text-left transition hover:bg-raised"
              >
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2.5">
                    <span className="text-sm font-medium">{entry.name}</span>
                    <span className="text-xs uppercase tracking-wider text-faint">
                      {entry.category}
                    </span>
                    {stance && (
                      <span
                        className={`rounded border px-1.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${STANCE_STYLE[stance]}`}
                      >
                        {stance}
                      </span>
                    )}
                  </span>
                  <span className="mt-1.5 block max-w-2xl text-sm leading-relaxed text-muted">
                    {entry.what}
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
                  <div className="px-5 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-faint">
                      Why it matters
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">
                      {entry.whyItMatters}
                    </p>
                  </div>

                  <div className="border-t border-line-soft px-5 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-faint">
                      Evaluate anything new here by asking
                    </p>
                    <ul className="mt-2 space-y-1.5">
                      {entry.evaluateBy.map((q) => (
                        <li key={q} className="text-sm leading-relaxed text-muted">
                          · {q}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="border-t border-line-soft px-5 py-4">
                    <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-amber">
                      <TriangleAlert size={11} /> The trap
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">
                      {entry.trap}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 border-t border-line-soft px-5 py-3.5">
                    <span className="text-xs text-faint">
                      Relevant from: {entry.relevantFrom}
                    </span>
                    {entry.relatedSkills.map((id) => (
                      <Link key={id} href={`/plan/skills#${id}`}>
                        <Pill>{skillById.get(id)?.name ?? id}</Pill>
                      </Link>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 border-t border-line-soft px-5 py-3.5">
                    <span className="mr-1 text-xs uppercase tracking-wider text-faint">
                      My stance
                    </span>
                    {RADAR_STANCES.map((s) => (
                      <button
                        key={s.id}
                        onClick={() =>
                          setRadarStance(entry.id, stance === s.id ? null : s.id)
                        }
                        aria-pressed={stance === s.id}
                        className={`rounded-lg border px-2.5 py-1 text-xs transition ${
                          stance === s.id
                            ? STANCE_STYLE[s.id]
                            : "border-line bg-raised text-muted hover:text-ink"
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
