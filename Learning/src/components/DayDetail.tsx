"use client";

import { useEffect, useRef, useState } from "react";
import {
  BookOpen,
  Boxes,
  CheckCircle2,
  Dumbbell,
  FileText,
  FlaskConical,
  GitCommitHorizontal,
  Rocket,
  RotateCcw,
  ScanSearch,
} from "lucide-react";
import type { Day, Task, TaskType } from "@/data/types";
import { moduleById, phaseById } from "@/data";
import { useStore } from "@/lib/store";
import { dayTaskProgress, essentialTasksComplete } from "@/lib/progress";
import { Button, Card, CardHeader, Pill, PriorityTag, ProgressBar, RepoPath } from "./ui";

const TASK_ICON: Record<TaskType, typeof BookOpen> = {
  learn: BookOpen,
  practice: Dumbbell,
  build: Boxes,
  test: FlaskConical,
  document: FileText,
  git: GitCommitHorizontal,
  deploy: Rocket,
  evaluate: ScanSearch,
  review: ScanSearch,
};

function TaskRow({ task }: { task: Task }) {
  const { state, toggleTask } = useStore();
  const done = Boolean(state.completedTasks[task.id]);
  const Icon = TASK_ICON[task.type];

  // Flash only on the transition into "done" — not on mount, and not on undo.
  const [justDone, setJustDone] = useState(false);
  const wasDone = useRef(done);
  useEffect(() => {
    if (done && !wasDone.current) {
      setJustDone(true);
      const timer = window.setTimeout(() => setJustDone(false), 900);
      wasDone.current = done;
      return () => window.clearTimeout(timer);
    }
    wasDone.current = done;
  }, [done]);

  return (
    <li
      className={`task-row border-b border-line-soft last:border-b-0 ${
        justDone ? "task-row-just-done" : ""
      }`}
    >
      <label className="flex cursor-pointer gap-3 px-5 py-3">
        <input
          type="checkbox"
          className="checkbox mt-0.5"
          checked={done}
          onChange={() => toggleTask(task.id)}
        />
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
            <Icon size={13} className="shrink-0 text-faint" strokeWidth={1.75} aria-hidden />
            <span
              className={`task-label text-sm ${done ? "task-label-done text-faint" : "text-ink"}`}
            >
              {task.title}
            </span>
            <PriorityTag priority={task.priority} />
            <span className="text-xs tabular-nums text-faint">{task.minutes}m</span>
          </span>
          {task.detail && (
            <span className="mt-1.5 block text-sm leading-relaxed text-muted">
              {task.detail}
            </span>
          )}
          {task.repoPath && (
            <span className="mt-1.5 block">
              <RepoPath path={task.repoPath} />
            </span>
          )}
        </span>
      </label>
    </li>
  );
}

export function DayDetail({ day }: { day: Day }) {
  const { state, completeDay, reopenDay } = useStore();

  const record = state.completedDays[day.id];
  const complete = Boolean(record);
  const progress = dayTaskProgress(day, state);
  const essentialsDone = essentialTasksComplete(day, state);

  const phase = phaseById.get(day.phaseId);
  const mod = moduleById.get(day.moduleId);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
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
        <p className="mt-2 text-sm leading-relaxed text-muted">{day.objective}</p>

        {phase && (
          <p className="mt-3 text-xs text-faint">
            Phase {phase.order}: {phase.title}
            {mod && ` · ${mod.title}`}
          </p>
        )}

        <div className="mt-5">
          <div className="flex items-center justify-between text-xs text-muted">
            <span>
              {progress.done}/{progress.total} tasks
            </span>
            <span className="tabular-nums">{Math.round(progress.ratio * 100)}%</span>
          </div>
          <ProgressBar value={progress.ratio} className="mt-2" />
        </div>
      </header>

      <Card>
        <CardHeader
          title="Tasks"
          hint="Essential tasks are enough for the day to count."
        />
        <ul>
          {day.tasks.map((t) => (
            <TaskRow key={t.id} task={t} />
          ))}
        </ul>
      </Card>

      <div className="flex flex-wrap items-center gap-3">
        {complete ? (
          <>
            <p className="text-sm text-muted">
              Completed{" "}
              {new Date(record!.completedAt).toLocaleDateString(undefined, {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
              .
            </p>
            <Button variant="ghost" onClick={() => reopenDay(day.id)}>
              <span className="flex items-center gap-2">
                <RotateCcw size={14} /> Reopen day
              </span>
            </Button>
          </>
        ) : (
          <>
            <Button onClick={() => completeDay(day.id)}>Mark day complete</Button>
            {!essentialsDone && (
              <p className="text-sm text-faint">
                This also ticks any essential tasks still open.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
