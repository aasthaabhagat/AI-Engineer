"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { capabilities, days, projects, skillById, skills } from "@/data";
import { useStore } from "@/lib/store";
import {
  CAPABILITY_LABEL,
  assessCapability,
  missingEvidence,
  portfolioGaps,
  skillEvidenceCount,
  skillMaturity,
} from "@/lib/maturity";
import {
  Card,
  CardHeader,
  MaturityBadge,
  SectionHeader,
  Pill,
  ProgressBar,
} from "@/components/ui";

const LEVEL_TONE: Record<string, string> = {
  "not-ready": "text-faint",
  learning: "text-muted",
  "can-build-basic": "text-accent",
  "can-build-production": "text-ok",
};

export function PortfolioSection() {
  const { state } = useStore();

  const assessments = capabilities.map((c) =>
    assessCapability(c, skillById, state.evidence),
  );
  const gaps = portfolioGaps(skills, state.evidence, 6);

  const portfolioProjects = projects.filter((p) => p.portfolioTarget);
  const demonstrable = projects.filter((p) => {
    const status = state.projects[p.id]?.status ?? p.status;
    return status === "portfolio-ready" || status === "deploying";
  });

  /** Skill → project → evidence → maturity, for skills with any evidence. */
  const matrix = skills
    .map((s) => ({
      skill: s,
      maturity: skillMaturity(s, state.evidence),
      ...skillEvidenceCount(s, state.evidence),
      projects: projects.filter((p) => p.skills.includes(s.id)),
    }))
    .filter((r) => r.done > 0)
    .sort((a, b) => b.done / b.total - a.done / a.total);

  /** The next authored day that advances the weakest important skill. */
  const nextAction = (() => {
    const target = gaps[0]?.skill.id;
    if (!target) return undefined;
    return days.find(
      (d) => !state.completedDays[d.id] && d.skills.includes(target),
    );
  })();

  return (
    <div>
      <SectionHeader
        eyebrow="What can I actually show?"
        title="Portfolio"
        description="An honest answer to the only question a hiring manager asks: what have you built, what proves it works, and what is still missing."
      />

      <div className="space-y-6">
        <Card>
          <CardHeader
            title="Demonstrable today"
            hint="Projects an employer could look at right now"
          />
          {demonstrable.length === 0 ? (
            <div className="px-5 py-6">
              <p className="text-sm">Nothing is portfolio-ready yet.</p>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
                That is the correct answer this early, and stating it honestly is
                the point of this page. The Expense Tracker becomes a credible
                craft artifact at day 34; the first real AI portfolio project
                arrives in phase 6.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-line-soft">
              {demonstrable.map((p) => (
                <li key={p.id} className="px-5 py-3">
                  <Link href={`/plan/projects#${p.id}`} className="text-sm hover:underline">
                    {p.name}
                  </Link>
                  <p className="mt-1 text-xs text-muted">{p.description}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <CardHeader
            title="Can I build this?"
            hint="Limited by the weakest requirement, not the average — a RAG system without evaluation is not a production RAG system"
          />
          <ul className="divide-y divide-line-soft">
            {assessments.map((a) => (
              <li key={a.capability.id} className="px-5 py-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm">{a.capability.question}</p>
                  <span
                    className={`text-xs font-medium uppercase tracking-wider ${LEVEL_TONE[a.level]}`}
                  >
                    {CAPABILITY_LABEL[a.level]}
                  </span>
                </div>
                <ProgressBar
                  value={a.score / 7}
                  className="mt-2.5"
                  tone={a.level === "can-build-production" ? "teal" : "accent"}
                />
                {a.gaps.length > 0 && (
                  <p className="mt-2 text-sm leading-relaxed text-faint">
                    Weakest: {a.gaps.slice(0, 4).map((g) => skillById.get(g.skillId)?.name ?? g.skillId).join(", ")}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardHeader
            title="Gap analysis"
            hint="Weighted by how much the skill matters, not just how incomplete it is"
          />
          <ul className="divide-y divide-line-soft">
            {gaps.map(({ skill, maturity }) => {
              const missing = missingEvidence(skill, state.evidence);
              return (
                <li key={skill.id} className="px-5 py-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <Link href={`/plan/skills#${skill.id}`} className="text-sm hover:underline">
                      {skill.name}
                    </Link>
                    <div className="flex items-center gap-2">
                      <Pill>{skill.tier}</Pill>
                      <MaturityBadge maturity={maturity} />
                    </div>
                  </div>
                  {missing.length > 0 && (
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      Next evidence needed: {missing[0].label}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
          {nextAction && (
            <div className="border-t border-line-soft px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-faint">
                Next best training action
              </p>
              <Link
                href={`/day/${nextAction.dayNumber}`}
                className="mt-2 inline-flex items-center gap-2 text-sm text-accent hover:underline"
              >
                Day {nextAction.dayNumber}: {nextAction.title}
                <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </Card>

        <Card>
          <CardHeader
            title="Skill matrix"
            hint="Skill → project → evidence → maturity"
          />
          {matrix.length === 0 ? (
            <p className="px-5 py-6 text-xs text-muted">
              No evidence recorded yet. Complete days, then tick the evidence you
              can actually point at.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead>
                  <tr className="border-b border-line-soft text-xs uppercase tracking-[0.14em] text-faint">
                    <th className="px-5 py-2.5 font-semibold">Skill</th>
                    <th className="px-5 py-2.5 font-semibold">Projects</th>
                    <th className="px-5 py-2.5 font-semibold">Evidence</th>
                    <th className="px-5 py-2.5 font-semibold">Maturity</th>
                  </tr>
                </thead>
                <tbody>
                  {matrix.map(({ skill, maturity, done, total, projects: ps }) => (
                    <tr key={skill.id} className="border-b border-line-soft last:border-b-0">
                      <td className="px-5 py-3">
                        <Link href={`/plan/skills#${skill.id}`} className="hover:underline">
                          {skill.name}
                        </Link>
                      </td>
                      <td className="px-5 py-3 text-xs text-muted">
                        {ps.length === 0
                          ? "—"
                          : ps.map((p) => p.name).join(", ")}
                      </td>
                      <td className="px-5 py-3 text-xs tabular-nums text-muted">
                        {done}/{total}
                      </td>
                      <td className="px-5 py-3">
                        <MaturityBadge maturity={maturity} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <Card>
          <CardHeader title="Portfolio strategy" />
          <div className="space-y-3 px-5 py-4 text-sm leading-relaxed text-muted">
            <p>
              Two to four deep projects, not twenty shallow ones. At least one
              serious AI product, one demonstrating RAG, one demonstrating
              agentic AI, and one demonstrating AI integrated into a system that
              already existed. These can and should overlap.
            </p>
            <ul className="space-y-1.5">
              {portfolioProjects.map((p) => (
                <li key={p.id}>
                  <Link href={`/plan/projects#${p.id}`} className="text-ink hover:underline">
                    {p.name}
                  </Link>{" "}
                  — level {p.level},{" "}
                  {(state.projects[p.id]?.status ?? p.status).replace("-", " ")}
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
}
