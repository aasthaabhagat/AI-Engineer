"use client";

import { useEffect, useRef, useState } from "react";
import {
  BookOpen,
  Boxes,
  Check,
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
import { RepoPath } from "./ui";

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

const PRIORITY_DOT: Record<Task["priority"], string> = {
  essential: "bg-accent",
  important: "bg-line",
  optional: "bg-transparent border border-line",
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
      const t = window.setTimeout(() => setJustDone(false), 900);
      wasDone.current = done;
      return () => window.clearTimeout(t);
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
      <label className="flex cursor-pointer gap-3.5 px-3 py-3.5 sm:px-4">
        <input
          type="checkbox"
          className="checkbox mt-0.5"
          checked={done}
          onChange={toggle}
        />
        <span className="min-w-0 flex-1">
          <span className="flex items-baseline gap-2.5">
            <span
              className={`task-label text-[0.95rem] leading-snug ${
                done ? "task-label-done text-faint" : "text-ink"
              }`}
            >
              {task.title}
            </span>
          </span>

          <span className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-faint">
            <span className="inline-flex items-center gap-1.5">
              <span
                className={`h-1.5 w-1.5 rounded-full ${PRIORITY_DOT[task.priority]}`}
                aria-hidden
              />
              {task.priority}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Icon size={12} strokeWidth={1.75} aria-hidden />
              {task.type}
            </span>
            <span className="tabular-nums">{task.minutes} min</span>
          </span>

          {task.detail && !done && (
            <span className="mt-2 block text-sm leading-relaxed text-muted">
              {task.detail}
            </span>
          )}
          {task.repoPath && !done && (
            <span className="mt-2 block">
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
    <ul className="rounded-xl border border-line bg-panel">
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
    <ul className="space-y-2.5">
      {day.definitionOfDone.map((item) => (
        <li key={item} className="flex gap-3 text-[0.95rem] leading-relaxed">
          <Check
            size={15}
            strokeWidth={2.5}
            className={`mt-1 shrink-0 ${complete ? "text-ok" : "text-faint"}`}
            aria-hidden
          />
          <span className={complete ? "text-muted" : "text-ink"}>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function WhyItMatters({ day }: { day: Day }) {
  return (
    <div className="space-y-5 text-[0.95rem] leading-relaxed text-muted">
      <p>{day.whyItMatters}</p>
      <div>
        <p className="mb-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-faint">
          Career connection
        </p>
        <p>{day.careerConnection}</p>
      </div>
    </div>
  );
}

export function Deliverables({ day }: { day: Day }) {
  return (
    <div className="space-y-5">
      <ul className="space-y-2">
        {day.deliverables.map((d) => (
          <li
            key={d}
            className="flex gap-3 text-[0.95rem] leading-relaxed text-ink"
          >
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-faint" aria-hidden />
            {d}
          </li>
        ))}
      </ul>
      {day.gitTask && (
        <div className="rounded-lg border border-line bg-raised px-4 py-3">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-faint">
            <GitCommitHorizontal size={12} aria-hidden /> Git
          </p>
          <code className="mt-2 block font-mono text-sm leading-relaxed text-teal">
            git commit -m &quot;{day.gitTask.commitMessage}&quot;
          </code>
          {day.gitTask.note && (
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {day.gitTask.note}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
