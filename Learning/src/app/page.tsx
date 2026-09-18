"use client";

import Link from "next/link";
import { ArrowRight, Flame, TriangleAlert } from "lucide-react";
import {
  authoredThrough,
  days,
  moduleById,
  phaseById,
  projectById,
  skills,
  weekForDay,
} from "@/data";
import { useStore } from "@/lib/store";
import {
  availableMinutes,
  currentDay,
  currentStreak,
  overallProgress,
  phaseProgress,
  planForTime,
  scheduleStatus,
} from "@/lib/progress";
import { skillEvidenceCount, skillMaturity } from "@/lib/maturity";
import {
  Card,
  CardHeader,
  MaturityBadge,
  Pill,
  ProgressBar,
  RepoPath,
  Stat,
  TrackBadge,
} from "@/components/ui";
import { Deliverables, DefinitionOfDone, TaskList } from "@/components/mission";

export default function DashboardPage() {
  const { state, hydrated } = useStore();

  const today = currentDay(days, state);
  const overall = overallProgress(days, state);
  const streak = currentStreak(state);
  const status = scheduleStatus(days, state);
  const minutes = availableMinutes(new Date(), state.settings);

  const phase = today ? phaseById.get(today.phaseId) : undefined;
  const mod = today ? moduleById.get(today.moduleId) : undefined;
  const week = today ? weekForDay(today.dayNumber) : undefined;
  const phaseStats = today
    ? phaseProgress(days, today.phaseId, state)
    : { done: 0, total: 0, ratio: 0 };

  const plan = today ? planForTime(today, minutes) : { included: [], deferred: [] };

  const inProgress = skills
    .map((s) => ({ skill: s, maturity: skillMaturity(s, state.evidence), ...skillEvidenceCount(s, state.evidence) }))
    .filter((s) => s.done > 0 && s.done < s.total)
    .sort((a, b) => b.done / b.total - a.done / a.total)
    .slice(0, 5);

  const upNext = today
    ? days.filter((d) => d.dayNumber > today.dayNumber).slice(0, 3)
    : [];

  const project = today?.projectId ? projectById.get(today.projectId) : undefined;

  if (!hydrated) {
    return (
      <div className="py-24 text-center text-sm text-muted">Loading your progress…</div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            AI Engineer Training System
          </p>
          <h1 className="mt-1.5 text-2xl font-semibold tracking-tight sm:text-3xl">
            {state.settings.name ? `Evening, ${state.settings.name}.` : "Today's mission"}
          </h1>
          {phase && (
            <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
              <TrackBadge track={phase.track} />
              <span>
                Phase {phase.order}: {phase.title}
              </span>
              {mod && <span className="text-faint">· {mod.title}</span>}
              {week && (
                <span className="text-faint">
                  · Week {week.number}: {week.title}
                </span>
              )}
            </p>
          )}
        </div>
        {today && (
          <Link
            href="/today"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-on-accent transition hover:brightness-110"
          >
            Start day {today.dayNumber} <ArrowRight size={15} />
          </Link>
        )}
      </header>

      {status.recoveryMode && (
        <div className="flex gap-3 rounded-xl border border-amber/30 bg-amber/10 px-5 py-4">
          <TriangleAlert size={17} className="mt-0.5 shrink-0 text-amber" />
          <div>
            <p className="text-sm font-medium text-amber">Recovery mode</p>
            <p className="mt-1 text-sm leading-relaxed text-muted">{status.message}</p>
          </div>
        </div>
      )}

      <Card className="grid grid-cols-2 divide-x divide-y divide-line-soft sm:grid-cols-4 sm:divide-y-0">
        <Stat
          label="Day"
          value={today ? today.dayNumber : authoredThrough}
          sub={`of ${authoredThrough} authored`}
        />
        <Stat
          label="Phase progress"
          value={`${Math.round(phaseStats.ratio * 100)}%`}
          sub={`${phaseStats.done}/${phaseStats.total} days`}
        />
        <Stat
          label="Streak"
          value={
            <span className="flex items-center gap-1.5">
              {streak}
              {streak > 0 && <Flame size={15} className="text-amber" />}
            </span>
          }
          sub={streak === 1 ? "day" : "days"}
        />
        <Stat
          label="Overall"
          value={`${Math.round(overall.ratio * 100)}%`}
          sub={`${overall.done} days complete`}
        />
      </Card>

      {today ? (
        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-6">
            <Card>
              <div className="border-b border-line-soft px-5 py-5">
                <div className="flex flex-wrap items-center gap-2">
                  <Pill tone="accent">Day {today.dayNumber}</Pill>
                  <Pill>{today.estimatedMinutes} min planned</Pill>
                  <Pill>{minutes} min available today</Pill>
                </div>
                <h2 className="mt-3 text-xl font-semibold tracking-tight">
                  {today.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {today.objective}
                </p>
                {today.repoPath && (
                  <p className="mt-3">
                    <RepoPath path={today.repoPath} />
                  </p>
                )}
              </div>

              <TaskList tasks={plan.included} />

              {plan.deferred.length > 0 && (
                <div className="border-t border-line-soft px-5 py-3">
                  <p className="text-xs text-muted">
                    {plan.deferred.length} optional task
                    {plan.deferred.length > 1 ? "s" : ""} deferred to fit{" "}
                    {minutes} minutes.{" "}
                    <Link href="/today" className="text-accent hover:underline">
                      See everything
                    </Link>
                  </p>
                </div>
              )}
            </Card>

            <Card>
              <CardHeader title="Definition of done" />
              <DefinitionOfDone day={today} />
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader title="Deliverables" />
              <Deliverables day={today} />
            </Card>

            {project && (
              <Card>
                <CardHeader title="Current project" />
                <div className="px-5 py-4">
                  <p className="text-sm font-medium">{project.name}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">
                    {project.description}
                  </p>
                  {project.repoPath && (
                    <p className="mt-3">
                      <RepoPath path={project.repoPath} />
                    </p>
                  )}
                </div>
              </Card>
            )}

            <Card>
              <CardHeader title="Skills in progress" />
              {inProgress.length === 0 ? (
                <p className="px-5 py-4 text-xs text-muted">
                  No skills partially evidenced yet.
                </p>
              ) : (
                <ul className="divide-y divide-line-soft">
                  {inProgress.map(({ skill, maturity, done, total }) => (
                    <li key={skill.id} className="px-5 py-3">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm">{skill.name}</span>
                        <MaturityBadge maturity={maturity} />
                      </div>
                      <ProgressBar value={done / total} className="mt-2" />
                      <p className="mt-1.5 text-xs text-faint">
                        {done}/{total} evidence
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            <Card>
              <CardHeader title="Up next" />
              <ul className="divide-y divide-line-soft">
                {upNext.map((d) => (
                  <li key={d.id}>
                    <Link
                      href={`/day/${d.dayNumber}`}
                      className="block px-5 py-3 transition hover:bg-raised"
                    >
                      <p className="text-xs uppercase tracking-wider text-faint">
                        Day {d.dayNumber}
                      </p>
                      <p className="mt-0.5 text-sm">{d.title}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      ) : (
        <Card>
          <div className="px-5 py-10 text-center">
            <p className="text-sm font-medium">
              Every authored day is complete. Day {authoredThrough} was the last one.
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">
              Phases 3 onward are outlined but not yet written day by day — by
              design, so they can match the pace and the code you actually have.
              Run a quarterly capability audit, then author the next phase.
            </p>
            <Link
              href="/reviews"
              className="mt-4 inline-block text-sm text-accent hover:underline"
            >
              Go to reviews →
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}
