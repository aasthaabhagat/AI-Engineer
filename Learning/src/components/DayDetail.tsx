"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, ExternalLink, RotateCcw, Timer } from "lucide-react";
import type { Day } from "@/data/types";
import { moduleById, phaseById, projectById, skillById } from "@/data";
import { useStore } from "@/lib/store";
import { availableMinutes, dayTaskProgress, planForTime } from "@/lib/progress";
import {
  Button,
  Card,
  CardHeader,
  Pill,
  ProgressBar,
  RepoPath,
  TrackBadge,
} from "./ui";
import { Deliverables, DefinitionOfDone, TaskList, WhyItMatters } from "./mission";
import { FocusMode } from "./FocusMode";

export function DayDetail({ day, focusOnLoad = false }: { day: Day; focusOnLoad?: boolean }) {
  const { state, completeDay, reopenDay } = useStore();
  const [focus, setFocus] = useState(focusOnLoad);
  const [reflection, setReflection] = useState("");
  const [evidenceNote, setEvidenceNote] = useState("");
  const [showAll, setShowAll] = useState(false);

  const record = state.completedDays[day.id];
  const complete = Boolean(record);
  const progress = dayTaskProgress(day, state);
  const minutes = availableMinutes(new Date(), state.settings);
  const plan = planForTime(day, minutes);
  const visibleTasks = showAll ? day.tasks : plan.included;

  const phase = phaseById.get(day.phaseId);
  const mod = moduleById.get(day.moduleId);
  const project = day.projectId ? projectById.get(day.projectId) : undefined;

  return (
    <>
      {focus && <FocusMode day={day} onExit={() => setFocus(false)} />}

      <div className="space-y-6">
        <header>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            {phase && <TrackBadge track={phase.track} />}
            <Pill tone="accent">Day {day.dayNumber}</Pill>
            <Pill>{day.estimatedMinutes} min</Pill>
            {complete && (
              <Pill tone="ok">
                <CheckCircle2 size={12} /> Complete
              </Pill>
            )}
          </div>

          <h1 className="mt-3 text-2xl font-semibold tracking-tight sm:text-[1.7rem]">
            {day.title}
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">
            {day.objective}
          </p>

          {phase && (
            <p className="mt-3 text-xs text-faint">
              Phase {phase.order}: {phase.title}
              {mod && ` · ${mod.title}`}
            </p>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-3">
            {!complete && (
              <Button onClick={() => setFocus(true)}>
                <span className="flex items-center gap-2">
                  <Timer size={15} /> Focus mode
                </span>
              </Button>
            )}
            {day.repoPath && <RepoPath path={day.repoPath} />}
            {project && (
              <Link
                href={`/projects#${project.id}`}
                className="inline-flex items-center gap-1.5 text-xs text-accent hover:underline"
              >
                {project.name} <ExternalLink size={11} />
              </Link>
            )}
          </div>

          <div className="mt-5">
            <div className="flex items-center justify-between text-xs text-muted">
              <span>
                {progress.done}/{progress.total} tasks
              </span>
              <span className="tabular-nums">
                {Math.round(progress.ratio * 100)}%
              </span>
            </div>
            <ProgressBar value={progress.ratio} className="mt-2" />
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-6">
            <Card>
              <CardHeader
                title="Tasks"
                hint={
                  showAll
                    ? `All ${day.tasks.length} tasks`
                    : `Fitted to ${minutes} minutes available today`
                }
                action={
                  plan.deferred.length > 0 && (
                    <button
                      onClick={() => setShowAll((v) => !v)}
                      className="text-xs text-accent hover:underline"
                    >
                      {showAll ? "Fit to my time" : `Show all (${day.tasks.length})`}
                    </button>
                  )
                }
              />
              <TaskList tasks={visibleTasks} />
            </Card>

            <Card>
              <CardHeader title="Definition of done" />
              <DefinitionOfDone day={day} />
            </Card>

            <Card>
              <CardHeader title="Why this day exists" />
              <WhyItMatters day={day} />
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader title="Deliverables" />
              <Deliverables day={day} />
            </Card>

            {day.skills.length > 0 && (
              <Card>
                <CardHeader title="Skills advanced" />
                <ul className="flex flex-wrap gap-2 px-5 py-4">
                  {day.skills.map((id) => {
                    const skill = skillById.get(id);
                    if (!skill) return null;
                    return (
                      <li key={id}>
                        <Link href={`/skills#${id}`}>
                          <Pill>{skill.name}</Pill>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </Card>
            )}

            {day.resources && day.resources.length > 0 && (
              <Card>
                <CardHeader title="Resources" />
                <ul className="space-y-2 px-5 py-4">
                  {day.resources.map((r) => (
                    <li key={r.ref} className="text-xs">
                      <span className="text-ink">{r.label}</span>
                      <span className="ml-2 break-all text-faint">{r.ref}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            <Card>
              <CardHeader title={complete ? "Mission complete" : "Finish the day"} />
              <div className="space-y-3 px-5 py-4">
                {complete ? (
                  <>
                    <p className="text-xs text-muted">
                      Completed{" "}
                      {new Date(record!.completedAt).toLocaleDateString(undefined, {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                      .
                    </p>
                    {record?.reflection && (
                      <p className="rounded-lg border border-line bg-raised px-3 py-2.5 text-xs leading-relaxed text-muted">
                        {record.reflection}
                      </p>
                    )}
                    <Button variant="ghost" onClick={() => reopenDay(day.id)}>
                      <span className="flex items-center gap-2">
                        <RotateCcw size={14} /> Reopen day
                      </span>
                    </Button>
                  </>
                ) : (
                  <>
                    <label className="block">
                      <span className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-faint">
                        Evidence produced
                      </span>
                      <input
                        className="field mt-1.5"
                        placeholder="Commit SHA, file, test count…"
                        value={evidenceNote}
                        onChange={(e) => setEvidenceNote(e.target.value)}
                      />
                    </label>
                    <label className="block">
                      <span className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-faint">
                        Reflection
                      </span>
                      <textarea
                        className="field mt-1.5 min-h-20 resize-y"
                        placeholder="What was hard? What surprised you?"
                        value={reflection}
                        onChange={(e) => setReflection(e.target.value)}
                      />
                    </label>
                    <Button
                      className="w-full"
                      onClick={() =>
                        completeDay(day.id, {
                          reflection: reflection.trim() || undefined,
                          evidenceNote: evidenceNote.trim() || undefined,
                        })
                      }
                    >
                      Mark day complete
                    </Button>
                    <p className="text-[0.68rem] leading-relaxed text-faint">
                      This marks the essential tasks and the day&apos;s declared skill
                      evidence as done. Only do it if that is actually true.
                    </p>
                  </>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
