"use client";

import Link from "next/link";
import { projects, skillById } from "@/data";
import { PROJECT_STATUS_LABEL, type ProjectStatus } from "@/data/types";
import { useStore } from "@/lib/store";
import {
  Card,
  CardHeader,
  PageHeader,
  Pill,
  ProgressBar,
  RepoPath,
} from "@/components/ui";

const STATUSES: ProjectStatus[] = [
  "idea",
  "planning",
  "building",
  "testing",
  "evaluating",
  "deploying",
  "portfolio-ready",
  "archived",
];

/** A project is not portfolio-ready because it runs. These are the gates. */
const QUALITY_GATES = [
  "Clear problem and defined user",
  "Architecture documented",
  "Clean, reviewed code",
  "Error handling",
  "Tests",
  "README with setup instructions",
  "Environment configuration",
  "Readable git history",
  "API documentation",
  "Evaluation results",
  "Security reviewed",
  "Logging and observability",
  "Deployed",
  "Demo or walkthrough",
  "Limitations stated",
  "Technical explanation written",
];

export default function ProjectsPage() {
  const { state, setProjectStatus, toggleMilestone, setProjectField } = useStore();

  return (
    <div>
      <PageHeader
        eyebrow="Few and deep"
        title="Projects"
        description="Projects are first-class. The ladder runs from scripts to a production capstone, and later projects absorb earlier ones rather than replacing them."
      />

      <div className="space-y-5">
        {projects.map((project) => {
          const st = state.projects[project.id];
          const status = st?.status ?? project.status;
          const doneMilestones = st?.milestonesDone ?? [];
          const ratio =
            project.milestones.length === 0
              ? 0
              : doneMilestones.length / project.milestones.length;

          return (
            <Card key={project.id} as="article" id={project.id}>
              <div className="border-b border-line-soft px-5 py-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h2 className="text-base font-medium">{project.name}</h2>
                      <Pill tone={project.portfolioTarget ? "accent" : "default"}>
                        Level {project.level}
                      </Pill>
                      {project.portfolioTarget && <Pill tone="accent">Portfolio target</Pill>}
                    </div>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
                      {project.description}
                    </p>
                  </div>

                  <label className="text-xs">
                    <span className="mb-1 block text-[0.66rem] uppercase tracking-wider text-faint">
                      Status
                    </span>
                    <select
                      className="field"
                      value={status}
                      onChange={(e) =>
                        setProjectStatus(project.id, e.target.value as ProjectStatus)
                      }
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {PROJECT_STATUS_LABEL[s]}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-faint">
                      Problem
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-muted">
                      {project.problem}
                    </p>
                  </div>
                  <div>
                    <p className="text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-faint">
                      Target user
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-muted">
                      {project.targetUser}
                    </p>
                  </div>
                </div>

                {project.aiComponent && (
                  <div className="mt-4">
                    <p className="text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-faint">
                      AI component
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-muted">
                      {project.aiComponent}
                    </p>
                  </div>
                )}

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {project.repoPath && <RepoPath path={project.repoPath} />}
                  {project.techStack.map((t) => (
                    <Pill key={t}>{t}</Pill>
                  ))}
                </div>
              </div>

              <div className="grid gap-px bg-line-soft lg:grid-cols-2">
                <div className="bg-panel">
                  <CardHeader title="Milestones" />
                  <div className="px-5 pb-4 pt-3">
                    <ProgressBar value={ratio} />
                    <p className="mt-1.5 text-[0.68rem] text-faint">
                      {doneMilestones.length}/{project.milestones.length} complete
                    </p>
                    <ul className="mt-3 space-y-2">
                      {project.milestones.map((m) => {
                        const checked = doneMilestones.includes(m.id);
                        return (
                          <li key={m.id} className="flex items-start gap-3">
                            <input
                              type="checkbox"
                              className="checkbox mt-0.5"
                              checked={checked}
                              onChange={() => toggleMilestone(project.id, m.id)}
                              aria-label={m.title}
                            />
                            <span className="min-w-0">
                              <span
                                className={`block text-sm ${
                                  checked ? "text-muted line-through" : "text-ink"
                                }`}
                              >
                                {m.title}
                              </span>
                              {m.detail && (
                                <span className="block text-[0.68rem] text-faint">
                                  {m.detail}
                                </span>
                              )}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>

                <div className="bg-panel">
                  <CardHeader title="Skills demonstrated" />
                  <div className="space-y-4 px-5 pb-4 pt-3">
                    <ul className="flex flex-wrap gap-1.5">
                      {project.skills.map((id) => {
                        const skill = skillById.get(id);
                        return (
                          <li key={id}>
                            <Link href={`/skills#${id}`}>
                              <Pill>{skill?.name ?? id}</Pill>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>

                    <div className="space-y-2">
                      <label className="block">
                        <span className="text-[0.66rem] uppercase tracking-wider text-faint">
                          GitHub URL
                        </span>
                        <input
                          className="field mt-1"
                          placeholder="https://github.com/…"
                          value={st?.githubUrl ?? project.githubUrl ?? ""}
                          onChange={(e) =>
                            setProjectField(project.id, { githubUrl: e.target.value })
                          }
                        />
                      </label>
                      <label className="block">
                        <span className="text-[0.66rem] uppercase tracking-wider text-faint">
                          Deployment URL
                        </span>
                        <input
                          className="field mt-1"
                          placeholder="Not deployed yet"
                          value={st?.deploymentUrl ?? project.deploymentUrl ?? ""}
                          onChange={(e) =>
                            setProjectField(project.id, {
                              deploymentUrl: e.target.value,
                            })
                          }
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {project.portfolioTarget && (
                <details className="border-t border-line-soft px-5 py-3.5">
                  <summary className="cursor-pointer text-xs text-muted">
                    Portfolio quality gates ({QUALITY_GATES.length})
                  </summary>
                  <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
                    {QUALITY_GATES.map((g) => (
                      <li key={g} className="text-xs text-faint">
                        · {g}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-[0.68rem] leading-relaxed text-faint">
                    Track these per project when you get there — a running system
                    is the beginning of portfolio readiness, not the end.
                  </p>
                </details>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
