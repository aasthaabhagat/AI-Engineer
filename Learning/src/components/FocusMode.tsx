"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Coffee, Pause, Play, RotateCcw, X } from "lucide-react";
import type { Day } from "@/data/types";
import { useStore } from "@/lib/store";
import { breakDue, formatDuration } from "@/lib/notifications";
import { useAudioUnlock, useCue } from "@/lib/useCue";
import { PriorityTag, ProgressBar, RepoPath } from "./ui";

/**
 * Distraction-free single-task view with a timer.
 * Everything not needed to do the work right now is removed.
 */
export function FocusMode({ day, onExit }: { day: Day; onExit: () => void }) {
  const { state, toggleTask } = useStore();
  const cue = useCue();
  const unlockAudio = useAudioUnlock();
  const [index, setIndex] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(true);
  /** Unbroken focus across tasks, for the break reminder. */
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [breakSuggested, setBreakSuggested] = useState(false);
  const overrunFiredRef = useRef<Set<string>>(new Set());

  const tasks = day.tasks;
  const task = tasks[index];
  const next = tasks[index + 1];
  const done = task ? Boolean(state.completedTasks[task.id]) : false;

  const completedCount = useMemo(
    () => tasks.filter((t) => state.completedTasks[t.id]).length,
    [tasks, state.completedTasks],
  );

  // Entering focus mode is a user gesture, which is the only moment a browser
  // will let us start an AudioContext.
  useEffect(() => {
    unlockAudio();
  }, [unlockAudio]);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setSeconds((s) => s + 1);
      setSessionSeconds((s) => s + 1);
    }, 1000);
    return () => window.clearInterval(id);
  }, [running]);

  // Passing the planned minutes is information, not a deadline — fired once
  // per task so a long task does not nag every second.
  useEffect(() => {
    if (!task) return;
    if (seconds !== task.minutes * 60) return;
    if (overrunFiredRef.current.has(task.id)) return;
    overrunFiredRef.current.add(task.id);
    cue({
      category: "timerComplete",
      title: `${task.minutes} minutes on: ${task.title}`,
      body: "Planned time reached. Keep going if you are mid-thought.",
      tag: `timer-${task.id}`,
    });
  }, [seconds, task, cue]);

  // Break reminder after an unbroken stretch.
  useEffect(() => {
    if (breakSuggested) return;
    if (!breakDue(sessionSeconds, state.notifications)) return;
    setBreakSuggested(true);
    cue({
      category: "breakReminder",
      title: "Time for a break",
      body: `${Math.round(sessionSeconds / 60)} minutes of unbroken focus. Stand up for five.`,
      tag: "break",
    });
  }, [sessionSeconds, breakSuggested, state.notifications, cue]);

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

  const elapsed = formatDuration(seconds);
  const overrun = seconds > task.minutes * 60;

  /** Tick a task, advance, and cue the session end when it was the last one. */
  const completeCurrent = () => {
    const wasDone = done;
    toggleTask(task.id);

    if (!wasDone) {
      cue({
        category: "taskComplete",
        title: "Task done",
        body: task.title,
        tag: `task-${task.id}`,
      });

      const remaining = tasks.filter(
        (t) => t.id !== task.id && !state.completedTasks[t.id],
      );
      if (remaining.length === 0) {
        cue({
          category: "focusComplete",
          title: `Day ${day.dayNumber} tasks complete`,
          body: `${formatDuration(sessionSeconds)} of focus. Mark the day done and record the evidence.`,
          tag: "focus-complete",
        });
      } else if (next) {
        setIndex(index + 1);
      }
    }
  };

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
            {elapsed}
          </p>

          {breakSuggested && (
            <div className="mx-auto mt-5 flex max-w-sm items-center gap-2.5 rounded-lg border border-amber/30 bg-amber/10 px-3.5 py-2.5">
              <Coffee size={15} className="shrink-0 text-amber" />
              <p className="text-sm leading-relaxed text-muted">
                {Math.round(sessionSeconds / 60)} minutes unbroken. Take five —
                you will debug better after.
              </p>
              <button
                onClick={() => {
                  setBreakSuggested(false);
                  setSessionSeconds(0);
                }}
                className="ml-auto shrink-0 text-xs text-amber hover:underline"
              >
                Reset
              </button>
            </div>
          )}

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
              onClick={completeCurrent}
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
              <span className="ml-3 text-faint">
                session {formatDuration(sessionSeconds)}
              </span>
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
