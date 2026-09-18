"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, RotateCcw, Timer } from "lucide-react";
import type { Day } from "@/data/types";
import { moduleById, phaseById, projectById, skillById, weekForDay } from "@/data";
import { useStore } from "@/lib/store";
import {
  availableMinutes,
  dayTaskProgress,
  essentialTasksComplete,
  planForTime,
} from "@/lib/progress";
import { useAudioUnlock, useCue } from "@/lib/useCue";
import { Button, Disclosure, Pill, ProgressBar, RepoPath } from "./ui";
import { Deliverables, DefinitionOfDone, TaskList, WhyItMatters } from "./mission";
import { FocusMode } from "./FocusMode";

/**
 * The one screen that matters: what to do, right now.
 *
 * It is a single column on purpose. The old two-column dashboard put six cards
 * of equal weight side by side, which meant nothing on it was the answer to
 * "what do I do tonight". Here the task list is the page, and everything else
 * is either one line above it or folded away below it.
 */
export function DayDetail({
  day,
  focusOnLoad = false,
  variant = "day",
}: {
  day: Day;
  focusOnLoad?: boolean;
  variant?: "day" | "today";
}) {
  const { state, completeDay, reopenDay } = useStore();
  const cue = useCue();
  const unlockAudio = useAudioUnlock();
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
  const essentialsDone = essentialTasksComplete(day, state);

  const phase = phaseById.get(day.phaseId);
  const mod = moduleById.get(day.moduleId);
  const project = day.projectId ? projectById.get(day.projectId) : undefined;
  const week = weekForDay(day.dayNumber);

  const remaining = visibleTasks
    .filter((t) => !state.completedTasks[t.id])
    .reduce((sum, t) => sum + t.minutes, 0);

  return (
    <>
      {focus && <FocusMode day={day} onExit={() => setFocus(false)} />}

      <div>
        <header>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            {variant === "today" ? "Tonight’s mission" : `Day ${day.dayNumber}`}
          </p>

          <h1 className="mt-2 text-[1.75rem] font-semibold leading-tight tracking-tight sm:text-[2.1rem]">
            {day.title}
          </h1>

          <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted">
            {day.objective}
          </p>

          <p className="mt-4 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-xs text-faint">
            {variant === "today" && <span>Day {day.dayNumber}</span>}
            {week && (
              <>
                <span aria-hidden>·</span>
                <span>Week {week.number}</span>
              </>
            )}
            {phase && (
              <>
                <span aria-hidden>·</span>
                <span>
                  Phase {phase.order}: {phase.title}
                </span>
              </>
            )}
            {mod && (
              <>
                <span aria-hidden>·</span>
                <span>{mod.title}</span>
              </>
            )}
            {day.repoPath && <RepoPath path={day.repoPath} />}
          </p>

          {/* Progress and the single primary action, on one line. */}
          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-4">
            <div className="min-w-48 flex-1">
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="tabular-nums">
                  <span
                    key={progress.done}
                    className="bump inline-block font-semibold text-ink"
                  >
                    {progress.done}
                  </span>
                  <span className="text-muted"> of {progress.total} tasks</span>
                </span>
                <span className="text-xs tabular-nums text-faint">
                  {complete
                    ? "Day complete"
                    : remaining > 0
                      ? `~${remaining} min left`
                      : "Nothing left in the plan"}
                </span>
              </div>
              <ProgressBar
                value={progress.ratio}
                tone={complete ? "teal" : "accent"}
                className="mt-2.5"
              />
            </div>

            {!complete && (
              <Button
                onClick={() => {
                  // Audio must start inside the gesture, not in an effect.
                  unlockAudio();
                  setFocus(true);
                }}
              >
                <span className="flex items-center gap-2">
                  <Timer size={15} aria-hidden /> Focus
                </span>
              </Button>
            )}

            {complete && (
              <Pill tone="ok">
                <CheckCircle2 size={12} aria-hidden /> Complete
              </Pill>
            )}
          </div>
        </header>

        {/* Appears the moment the last essential task is ticked. */}
        {essentialsDone && !complete && (
          <div className="rise-in mt-6 flex flex-wrap items-center gap-3 rounded-xl border border-ok/30 bg-ok/5 px-4 py-3.5">
            <CheckCircle2 size={16} className="shrink-0 text-ok" aria-hidden />
            <p className="text-sm text-ink">
              Every essential task is done. This day counts.
            </p>
            <a
              href="#finish"
              className="ml-auto inline-flex items-center gap-1.5 text-sm text-accent hover:underline"
            >
              Finish the day <ArrowRight size={14} aria-hidden />
            </a>
          </div>
        )}

        <section className="mt-9">
          <div className="mb-3 flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-faint">
              Tasks
            </h2>
            {plan.deferred.length > 0 && (
              <button
                onClick={() => setShowAll((v) => !v)}
                className="text-xs text-accent hover:underline"
              >
                {showAll
                  ? `Fit to my ${minutes} minutes`
                  : `Show all ${day.tasks.length}`}
              </button>
            )}
          </div>

          <TaskList tasks={visibleTasks} />

          {!showAll && plan.deferred.length > 0 && (
            <p className="mt-2.5 text-xs text-faint">
              {plan.deferred.length} optional task
              {plan.deferred.length > 1 ? "s" : ""} hidden to fit the {minutes}{" "}
              minutes you have today.
            </p>
          )}
        </section>

        <section className="mt-9">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-faint">
            Definition of done
          </h2>
          <DefinitionOfDone day={day} />
        </section>

        <section className="mt-10 border-t border-line-soft">
          <Disclosure title="Why this day exists">
            <WhyItMatters day={day} />
          </Disclosure>

          <Disclosure
            title="Evidence you will have"
            hint={`${day.deliverables.length} deliverable${
              day.deliverables.length === 1 ? "" : "s"
            }`}
          >
            <Deliverables day={day} />
          </Disclosure>

          {day.skills.length > 0 && (
            <Disclosure title="Skills advanced" hint={`${day.skills.length}`}>
              <ul className="flex flex-wrap gap-2">
                {day.skills.map((id) => {
                  const skill = skillById.get(id);
                  if (!skill) return null;
                  return (
                    <li key={id}>
                      <Link href={`/plan/skills#${id}`}>
                        <Pill>{skill.name}</Pill>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </Disclosure>
          )}

          {project && (
            <Disclosure title="Project this feeds">
              <p className="text-[0.95rem] font-medium">{project.name}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">
                {project.description}
              </p>
              <p className="mt-3 flex flex-wrap items-center gap-3">
                {project.repoPath && <RepoPath path={project.repoPath} />}
                <Link
                  href={`/plan/projects#${project.id}`}
                  className="text-sm text-accent hover:underline"
                >
                  Open project →
                </Link>
              </p>
            </Disclosure>
          )}

          {day.resources && day.resources.length > 0 && (
            <Disclosure title="Resources" hint={`${day.resources.length}`}>
              <ul className="space-y-2.5">
                {day.resources.map((r) => (
                  <li key={r.ref} className="text-sm">
                    <span className="text-ink">{r.label}</span>
                    <span className="ml-2 break-all text-faint">{r.ref}</span>
                  </li>
                ))}
              </ul>
            </Disclosure>
          )}
        </section>

        <section id="finish" className="mt-10 scroll-mt-20">
          {complete ? (
            <div className="rounded-xl border border-line bg-panel px-5 py-5">
              <p className="text-sm text-muted">
                Completed{" "}
                {new Date(record!.completedAt).toLocaleDateString(undefined, {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
                .
              </p>
              {record?.reflection && (
                <p className="mt-3 border-l-2 border-line pl-4 text-sm leading-relaxed text-muted">
                  {record.reflection}
                </p>
              )}
              <Button
                variant="ghost"
                className="mt-4"
                onClick={() => reopenDay(day.id)}
              >
                <span className="flex items-center gap-2">
                  <RotateCcw size={14} aria-hidden /> Reopen day
                </span>
              </Button>
            </div>
          ) : (
            <div className="rounded-xl border border-line bg-panel px-5 py-5">
              <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-faint">
                Finish the day
              </h2>
              <div className="mt-4 space-y-4">
                <label className="block">
                  <span className="text-xs font-medium text-muted">
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
                  <span className="text-xs font-medium text-muted">Reflection</span>
                  <textarea
                    className="field mt-1.5 min-h-20 resize-y"
                    placeholder="What was hard? What surprised you?"
                    value={reflection}
                    onChange={(e) => setReflection(e.target.value)}
                  />
                </label>
                <Button
                  className="w-full"
                  onClick={() => {
                    unlockAudio();
                    completeDay(day.id, {
                      reflection: reflection.trim() || undefined,
                      evidenceNote: evidenceNote.trim() || undefined,
                    });
                    cue({
                      category: "milestone",
                      title: `Day ${day.dayNumber} complete`,
                      body: day.deliverables[0] ?? day.title,
                      tag: `day-${day.id}`,
                    });
                  }}
                >
                  Mark day complete
                </Button>
                <p className="text-sm leading-relaxed text-faint">
                  This marks the essential tasks and the day&apos;s declared skill
                  evidence as done. Only do it if that is actually true.
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
