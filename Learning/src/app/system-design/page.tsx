"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Gauge, ShieldAlert, TriangleAlert } from "lucide-react";
import { designBriefs } from "@/data/systemDesigns";
import { blueprintById, skillById } from "@/data";
import { Card, PageHeader, Pill } from "@/components/ui";

const SECTION_TITLE = "text-xs font-semibold uppercase tracking-[0.14em] text-faint";

function List({ items, className = "" }: { items: string[]; className?: string }) {
  return (
    <ul className={`mt-2 space-y-1.5 ${className}`}>
      {items.map((i) => (
        <li key={i} className="text-sm leading-relaxed text-muted">
          · {i}
        </li>
      ))}
    </ul>
  );
}

export default function SystemDesignPage() {
  const [open, setOpen] = useState<string | null>(designBriefs[0]?.id ?? null);

  return (
    <div>
      <PageHeader
        eyebrow="Design rounds"
        title="AI System Design"
        description="Requirements first, then the shape, then the parts that decide whether it survives contact with production: failure, cost, security, evaluation."
      />

      <Card className="mb-6">
        <div className="px-5 py-4">
          <p className="text-sm font-medium">How to use these</p>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">
            Read the prompt and the scale, then close the page and design it
            yourself on paper for fifteen minutes. Only then open the brief and
            compare. Reading a finished design teaches almost nothing; failing
            to produce one and then seeing what you missed teaches a great deal.
            Record what you missed in the engineering journal.
          </p>
        </div>
      </Card>

      <div className="space-y-3">
        {designBriefs.map((brief) => {
          const isOpen = open === brief.id;
          return (
            <Card key={brief.id} as="article" id={brief.id} className="overflow-hidden">
              <button
                onClick={() => setOpen(isOpen ? null : brief.id)}
                aria-expanded={isOpen}
                className="flex w-full items-start gap-4 px-5 py-4 text-left transition hover:bg-raised"
              >
                <span className="min-w-0 flex-1">
                  <span className="text-[0.95rem] font-medium">{brief.title}</span>
                  <span className="mt-1.5 block max-w-3xl text-sm leading-relaxed text-muted">
                    {brief.prompt}
                  </span>
                  <span className="mt-2 flex items-center gap-1.5 text-xs text-faint">
                    <Gauge size={11} /> {brief.scale}
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
                      <p className={SECTION_TITLE}>Ask before designing</p>
                      <List items={brief.clarifying} />
                    </div>
                    <div className="bg-panel px-5 py-4">
                      <p className={SECTION_TITLE}>Requirements</p>
                      <List items={brief.requirements} />
                    </div>
                  </div>

                  <div className="border-t border-line-soft px-5 py-4">
                    <p className={SECTION_TITLE}>Components</p>
                    <dl className="mt-2 grid gap-3 sm:grid-cols-2">
                      {brief.components.map((c) => (
                        <div key={c.name}>
                          <dt className="text-xs font-medium">{c.name}</dt>
                          <dd className="mt-0.5 text-sm leading-relaxed text-muted">
                            {c.role}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>

                  <div className="border-t border-line-soft px-5 py-4">
                    <p className={SECTION_TITLE}>Data flow</p>
                    <ol className="mt-2 space-y-1.5">
                      {brief.dataFlow.map((step, i) => (
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
                    <p className={SECTION_TITLE}>
                      Key decisions — this is where the answer is won or lost
                    </p>
                    <dl className="mt-3 space-y-3">
                      {brief.keyDecisions.map((d) => (
                        <div
                          key={d.decision}
                          className="rounded-lg border border-line bg-raised px-3.5 py-3"
                        >
                          <dt className="text-xs font-medium text-accent">
                            {d.decision}
                          </dt>
                          <dd className="mt-1 text-sm leading-relaxed text-muted">
                            {d.tradeoff}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>

                  <div className="grid gap-px border-t border-line-soft bg-line-soft sm:grid-cols-2">
                    <div className="bg-panel px-5 py-4">
                      <p className={SECTION_TITLE}>Scaling</p>
                      <List items={brief.scaling} />
                    </div>
                    <div className="bg-panel px-5 py-4">
                      <p className={`${SECTION_TITLE} flex items-center gap-1.5`}>
                        <TriangleAlert size={11} className="text-danger" /> Failure modes
                      </p>
                      <List items={brief.failureModes} />
                    </div>
                    <div className="bg-panel px-5 py-4">
                      <p className={`${SECTION_TITLE} flex items-center gap-1.5`}>
                        <ShieldAlert size={11} /> Security
                      </p>
                      <List items={brief.security} />
                    </div>
                    <div className="bg-panel px-5 py-4">
                      <p className={SECTION_TITLE}>Observability</p>
                      <List items={brief.observability} />
                    </div>
                    <div className="bg-panel px-5 py-4">
                      <p className={SECTION_TITLE}>Evaluation</p>
                      <List items={brief.evaluation} />
                    </div>
                    <div className="bg-panel px-5 py-4">
                      <p className={SECTION_TITLE}>Cost drivers</p>
                      <List items={brief.costDrivers} />
                    </div>
                  </div>

                  <div className="border-t border-line-soft px-5 py-4">
                    <p className={SECTION_TITLE}>What a weak answer sounds like</p>
                    <List items={brief.commonMistakes} />
                  </div>

                  <div className="flex flex-wrap items-center gap-2 border-t border-line-soft px-5 py-3.5">
                    {brief.relatedBlueprints.map((id) => (
                      <Link key={id} href={`/blueprints#${id}`}>
                        <Pill tone="accent">{blueprintById.get(id)?.name ?? id}</Pill>
                      </Link>
                    ))}
                    {brief.relatedSkills.map((id) => (
                      <Link key={id} href={`/skills#${id}`}>
                        <Pill>{skillById.get(id)?.name ?? id}</Pill>
                      </Link>
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
