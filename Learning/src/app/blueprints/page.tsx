"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { blueprints } from "@/data";
import { Card, PageHeader, Pill } from "@/components/ui";

export default function BlueprintsPage() {
  const [open, setOpen] = useState<string | null>(blueprints[0]?.id ?? null);

  return (
    <div>
      <PageHeader
        eyebrow="Architecture references"
        title="Blueprints"
        description="How these systems are actually shaped, where they fail, and how to tell whether one is working. Read the failure points before you build."
      />

      <div className="space-y-3">
        {blueprints.map((bp) => {
          const isOpen = open === bp.id;
          return (
            <Card key={bp.id} as="article" id={bp.id} className="overflow-hidden">
              <button
                onClick={() => setOpen(isOpen ? null : bp.id)}
                aria-expanded={isOpen}
                className="flex w-full items-start gap-4 px-5 py-4 text-left transition hover:bg-raised"
              >
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2.5">
                    <span className="text-[0.95rem] font-medium">{bp.name}</span>
                    <Pill>{bp.category}</Pill>
                  </span>
                  <span className="mt-1.5 block max-w-3xl text-sm leading-relaxed text-muted">
                    {bp.problem}
                  </span>
                </span>
                <ChevronDown
                  size={16}
                  className={`mt-0.5 shrink-0 text-faint transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="border-t border-line-soft">
                  <div className="grid gap-px bg-line-soft sm:grid-cols-2">
                    <div className="bg-panel px-5 py-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ok">
                        When to use
                      </p>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted">
                        {bp.whenToUse}
                      </p>
                    </div>
                    <div className="bg-panel px-5 py-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber">
                        When not to
                      </p>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted">
                        {bp.whenNotToUse}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-line-soft px-5 py-4">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-faint">
                      Data flow
                    </p>
                    <ol className="space-y-1.5">
                      {bp.flow.map((step, i) => (
                        <li key={step} className="flex gap-3 text-xs">
                          <span className="font-mono tabular-nums text-faint">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="text-ink">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="border-t border-line-soft px-5 py-4">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-faint">
                      Components
                    </p>
                    <dl className="grid gap-3 sm:grid-cols-2">
                      {bp.components.map((c) => (
                        <div key={c.name}>
                          <dt className="text-xs font-medium">{c.name}</dt>
                          <dd className="mt-0.5 text-sm leading-relaxed text-muted">
                            {c.role}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>

                  <div className="grid gap-px border-t border-line-soft bg-line-soft sm:grid-cols-2">
                    <div className="bg-panel px-5 py-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-faint">
                        Tradeoffs
                      </p>
                      <ul className="mt-2 space-y-1.5">
                        {bp.tradeoffs.map((t) => (
                          <li key={t} className="text-sm leading-relaxed text-muted">
                            · {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-panel px-5 py-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-danger">
                        Failure points
                      </p>
                      <ul className="mt-2 space-y-1.5">
                        {bp.failurePoints.map((f) => (
                          <li key={f} className="text-sm leading-relaxed text-muted">
                            · {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="grid gap-px border-t border-line-soft bg-line-soft sm:grid-cols-2">
                    <div className="bg-panel px-5 py-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-faint">
                        How to evaluate it
                      </p>
                      <ul className="mt-2 space-y-1.5">
                        {bp.evaluation.map((e) => (
                          <li key={e} className="text-sm leading-relaxed text-muted">
                            · {e}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {bp.security && (
                      <div className="bg-panel px-5 py-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-faint">
                          Security
                        </p>
                        <ul className="mt-2 space-y-1.5">
                          {bp.security.map((s) => (
                            <li key={s} className="text-sm leading-relaxed text-muted">
                              · {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
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
