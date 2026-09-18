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
  ScanSearch,
} from "lucide-react";
import type { Day, Task, TaskType } from "@/data/types";
import { useStore } from "@/lib/store";
import { useAudioUnlock, useCue } from "@/lib/useCue";
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
  const cue = useCue();
  const unlockAudio = useAudioUnlock();
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

  const toggle = () => {
    // The click is the gesture browsers require before audio may start.
    unlockAudio();
    if (!done) {
      cue({
        category: "taskComplete",
        title: task.title,
        body: "Task complete",
        tag: task.id,
      });
    }
    toggleTask(task.id);
  };

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
          onChange={toggle}
        />
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
            <Icon
              size={13}
              className="shrink-0 text-faint"
              strokeWidth={1.75}
              aria-hidden
            />
            <span
              className={`task-label text-sm ${
                done ? "task-label-done text-faint" : "text-ink"
              }`}
            >
              {task.title}
            </span>
            <PriorityTag priority={task.priority} />
            <span className="text-xs tabular-nums text-faint">
              {task.minutes}m
            </span>
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
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-faint">
          Why it matters
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-muted">
          {day.whyItMatters}
        </p>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-faint">
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
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-faint">
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
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-faint">
            <GitCommitHorizontal size={12} /> Git
          </p>
          <code className="mt-1.5 block font-mono text-xs text-teal">
            git commit -m &quot;{day.gitTask.commitMessage}&quot;
          </code>
          {day.gitTask.note && (
            <p className="mt-1.5 text-sm leading-relaxed text-muted">
              {day.gitTask.note}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
