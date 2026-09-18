"use client";

import {
  BookOpen,
  Boxes,
  CheckCircle2,
  Dumbbell,
  FileText,
  FlaskConical,
  GitCommitHorizontal,
  Rocket,
  ScanSearch,
} from "lucide-react";
import type { Day, Task, TaskType } from "@/data/types";
import { useStore } from "@/lib/store";
import { PriorityTag, RepoPath } from "./ui";

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

export function TaskRow({ task }: { task: Task }) {
  const { state, toggleTask } = useStore();
  const done = Boolean(state.completedTasks[task.id]);
  const Icon = TASK_ICON[task.type];

  return (
    <li className="group flex gap-3 border-b border-line-soft px-5 py-3 last:border-b-0">
      <input
        type="checkbox"
        className="checkbox mt-0.5"
        checked={done}
        onChange={() => toggleTask(task.id)}
        aria-label={task.title}
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
          <Icon size={13} className="shrink-0 text-faint" strokeWidth={1.75} />
          <span
            className={`text-sm ${done ? "text-faint line-through" : "text-ink"}`}
          >
            {task.title}
          </span>
          <PriorityTag priority={task.priority} />
          <span className="text-[0.68rem] tabular-nums text-faint">
            {task.minutes}m
          </span>
        </div>
        {task.detail && (
          <p className="mt-1.5 text-xs leading-relaxed text-muted">{task.detail}</p>
        )}
        {task.repoPath && (
          <p className="mt-1.5">
            <RepoPath path={task.repoPath} />
          </p>
        )}
      </div>
    </li>
  );
}

export function TaskList({ tasks }: { tasks: Task[] }) {
  return (
    <ul>
      {tasks.map((t) => (
        <TaskRow key={t.id} task={t} />
      ))}
    </ul>
  );
}

export function DefinitionOfDone({ day }: { day: Day }) {
  const { state } = useStore();
  const complete = Boolean(state.completedDays[day.id]);

  return (
    <ul className="space-y-2 px-5 py-4">
      {day.definitionOfDone.map((item) => (
        <li key={item} className="flex gap-2.5 text-sm">
          <CheckCircle2
            size={15}
            strokeWidth={1.75}
            className={`mt-0.5 shrink-0 ${complete ? "text-ok" : "text-faint"}`}
          />
          <span className={complete ? "text-muted" : "text-ink"}>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function WhyItMatters({ day }: { day: Day }) {
  return (
    <div className="space-y-4 px-5 py-4">
      <div>
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-faint">
          Why it matters
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-muted">
          {day.whyItMatters}
        </p>
      </div>
      <div>
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-faint">
          Career connection
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-muted">
          {day.careerConnection}
        </p>
      </div>
    </div>
  );
}

export function Deliverables({ day }: { day: Day }) {
  return (
    <div className="space-y-3 px-5 py-4">
      <div>
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-faint">
          Evidence you will have
        </p>
        <ul className="mt-2 space-y-1.5">
          {day.deliverables.map((d) => (
            <li key={d} className="text-sm text-ink">
              · {d}
            </li>
          ))}
        </ul>
      </div>
      {day.gitTask && (
        <div className="rounded-lg border border-line bg-raised px-3 py-2.5">
          <p className="flex items-center gap-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-faint">
            <GitCommitHorizontal size={12} /> Git
          </p>
          <code className="mt-1.5 block font-mono text-xs text-teal">
            git commit -m &quot;{day.gitTask.commitMessage}&quot;
          </code>
          {day.gitTask.note && (
            <p className="mt-1.5 text-xs leading-relaxed text-muted">
              {day.gitTask.note}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
