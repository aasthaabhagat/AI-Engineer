"use client";

import { useEffect, useMemo, useState } from "react";
import { Pause, Play, RotateCcw, X } from "lucide-react";
import type { Day } from "@/data/types";
import { useStore } from "@/lib/store";
import { PriorityTag, ProgressBar, RepoPath } from "./ui";

/**
 * Distraction-free single-task view with a timer.
 * Everything not needed to do the work right now is removed.
 */
export function FocusMode({ day, onExit }: { day: Day; onExit: () => void }) {
  const { state, toggleTask } = useStore();
  const [index, setIndex] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(true);

  const tasks = day.tasks;
  const task = tasks[index];
  const next = tasks[index + 1];
  const done = task ? Boolean(state.completedTasks[task.id]) : false;

  const completedCount = useMemo(
    () => tasks.filter((t) => state.completedTasks[t.id]).length,
    [tasks, state.completedTasks],
  );

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [running]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onExit();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onExit]);

  // Start each task with a fresh clock.
  useEffect(() => {
    setSeconds(0);
    setRunning(true);
  }, [index]);

  if (!task) return null;

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  const overrun = seconds > task.minutes * 60;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-bg">
      <div className="flex items-center justify-between border-b border-line px-5 py-3">
        <p className="text-xs uppercase tracking-[0.16em] text-faint">
          Day {day.dayNumber} · Focus
        </p>
        <button
          onClick={onExit}
          className="rounded-lg border border-line p-1.5 text-muted transition hover:text-ink"
          aria-label="Exit focus mode"
        >
          <X size={16} />
        </button>
      </div>

      <div className="flex flex-1 items-center justify-center px-5 py-8">
        <div className="w-full max-w-xl">
          <div className="flex items-center justify-center gap-3">
            <PriorityTag priority={task.priority} />
            <span className="text-xs text-faint">
              Task {index + 1} of {tasks.length} · planned {task.minutes}m
            </span>
          </div>

          <h2 className="mt-5 text-center text-xl font-semibold leading-snug tracking-tight sm:text-2xl">
            {task.title}
          </h2>

          {task.detail && (
            <p className="mx-auto mt-3 max-w-lg text-center text-sm leading-relaxed text-muted">
              {task.detail}
            </p>
          )}

          {task.repoPath && (
            <p className="mt-4 text-center">
              <RepoPath path={task.repoPath} />
            </p>
          )}

          <p
            className={`mt-8 text-center font-mono text-5xl tabular-nums tracking-tight sm:text-6xl ${
              overrun ? "text-amber" : "text-ink"
            }`}
            aria-live="off"
          >
            {mm}:{ss}
          </p>

          <div className="mt-5 flex justify-center gap-2">
            <button
              onClick={() => setRunning((v) => !v)}
              className="inline-flex items-center gap-2 rounded-lg border border-line bg-raised px-3.5 py-2 text-sm text-muted transition hover:text-ink"
            >
              {running ? <Pause size={14} /> : <Play size={14} />}
              {running ? "Pause" : "Resume"}
            </button>
            <button
              onClick={() => setSeconds(0)}
              className="inline-flex items-center gap-2 rounded-lg border border-line bg-raised px-3.5 py-2 text-sm text-muted transition hover:text-ink"
            >
              <RotateCcw size={14} /> Reset
            </button>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => {
                toggleTask(task.id);
                if (!done && next) setIndex(index + 1);
              }}
              className="rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-[#0a0b0e] transition hover:brightness-110"
            >
              {done ? "Mark not done" : next ? "Done — next task" : "Mark done"}
            </button>
            <button
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
              disabled={index === 0}
              className="rounded-lg border border-line px-3.5 py-2.5 text-sm text-muted transition hover:text-ink disabled:opacity-30"
            >
              Previous
            </button>
            <button
              onClick={() => setIndex((i) => Math.min(tasks.length - 1, i + 1))}
              disabled={index === tasks.length - 1}
              className="rounded-lg border border-line px-3.5 py-2.5 text-sm text-muted transition hover:text-ink disabled:opacity-30"
            >
              Skip
            </button>
          </div>

          {next && (
            <p className="mt-8 text-center text-xs text-faint">
              Next: {next.title}
            </p>
          )}
        </div>
      </div>

      <div className="border-t border-line px-5 py-4">
        <div className="mx-auto max-w-xl">
          <div className="flex items-center justify-between text-xs text-muted">
            <span>
              {completedCount}/{tasks.length} tasks done
            </span>
            <span className="tabular-nums">
              {Math.round((completedCount / tasks.length) * 100)}%
            </span>
          </div>
          <ProgressBar value={completedCount / tasks.length} className="mt-2" />
        </div>
      </div>
    </div>
  );
}
