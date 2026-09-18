import type { Day, Priority, Task } from "@/data/types";
import type { PersistedState, Settings } from "./state";

/** Local-date ISO key (YYYY-MM-DD), avoiding UTC shifts from toISOString(). */
export function dateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function parseDateKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

export function addDays(d: Date, n: number): Date {
  const next = new Date(d);
  next.setDate(next.getDate() + n);
  return next;
}

export function isStudyDay(date: Date, settings: Settings): boolean {
  return settings.studyDays.includes(date.getDay());
}

/** Minutes available on a given date, from settings. */
export function availableMinutes(date: Date, settings: Settings): number {
  const weekend = date.getDay() === 0 || date.getDay() === 6;
  return weekend ? settings.weekendMinutes : settings.weekdayMinutes;
}

/** How many study days have elapsed, inclusive of today. Never below 1. */
export function elapsedStudyDays(settings: Settings, today = new Date()): number {
  const start = parseDateKey(settings.startDate);
  if (today < start) return 1;

  let count = 0;
  const cursor = new Date(start);
  while (dateKey(cursor) <= dateKey(today)) {
    if (isStudyDay(cursor, settings)) count++;
    cursor.setDate(cursor.getDate() + 1);
    // Defensive bound: a corrupted start date must not hang the UI.
    if (count > 2000) break;
  }
  return Math.max(1, count);
}

/** The next day to work on: the lowest-numbered day not yet completed. */
export function currentDay(days: Day[], state: PersistedState): Day | undefined {
  return days.find((d) => !state.completedDays[d.id]);
}

export function isDayComplete(day: Day, state: PersistedState): boolean {
  return Boolean(state.completedDays[day.id]);
}

/** A day counts as done when every ESSENTIAL task is done. */
export function essentialTasksComplete(day: Day, state: PersistedState): boolean {
  const essentials = day.tasks.filter((t) => t.priority === "essential");
  if (essentials.length === 0) return false;
  return essentials.every((t) => Boolean(state.completedTasks[t.id]));
}

export function dayTaskProgress(
  day: Day,
  state: PersistedState,
): { done: number; total: number; ratio: number } {
  const total = day.tasks.length;
  const done = day.tasks.filter((t) => state.completedTasks[t.id]).length;
  return { done, total, ratio: total === 0 ? 0 : done / total };
}

const PRIORITY_ORDER: Record<Priority, number> = {
  essential: 0,
  important: 1,
  optional: 2,
};

/**
 * Fit today's work into the time actually available, essentials first.
 * Essentials are always included even if they overflow the budget — dropping
 * them would mean the day cannot count as done.
 */
export function planForTime(
  day: Day,
  minutes: number,
): { included: Task[]; deferred: Task[] } {
  const ordered = [...day.tasks].sort(
    (a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority],
  );

  const included: Task[] = [];
  const deferred: Task[] = [];
  let used = 0;

  for (const task of ordered) {
    if (task.priority === "essential" || used + task.minutes <= minutes) {
      included.push(task);
      used += task.minutes;
    } else {
      deferred.push(task);
    }
  }
  return { included, deferred };
}

/** Consecutive calendar days ending today (or yesterday) with a completed day. */
export function currentStreak(state: PersistedState, today = new Date()): number {
  const doneKeys = new Set(
    Object.values(state.completedDays).map((r) => dateKey(new Date(r.completedAt))),
  );
  if (doneKeys.size === 0) return 0;

  // Grace: finishing yesterday and not yet working today keeps the streak.
  let cursor = new Date(today);
  if (!doneKeys.has(dateKey(cursor))) {
    cursor = addDays(cursor, -1);
    if (!doneKeys.has(dateKey(cursor))) return 0;
  }

  let streak = 0;
  while (doneKeys.has(dateKey(cursor))) {
    streak++;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

export interface ScheduleStatus {
  /** Day number the schedule expects you to be on. */
  expected: number;
  /** Day number you are actually on. */
  actual: number;
  /** Positive means behind schedule. */
  behind: number;
  recoveryMode: boolean;
  /** Present only in recovery mode. */
  message?: string;
}

const RECOVERY_THRESHOLD = 3;

/**
 * Schedule comparison, deliberately gentle. Missing days is expected with a
 * full-time job; the response is to compress and prioritise, never to pile up
 * an impossible backlog.
 */
export function scheduleStatus(
  days: Day[],
  state: PersistedState,
  today = new Date(),
): ScheduleStatus {
  const expected = Math.min(elapsedStudyDays(state.settings, today), days.length);
  const current = currentDay(days, state);
  const actual = current ? current.dayNumber : days.length + 1;
  const behind = Math.max(0, expected - actual);
  const recoveryMode = behind >= RECOVERY_THRESHOLD;

  return {
    expected,
    actual,
    behind,
    recoveryMode,
    message: recoveryMode
      ? `${behind} days behind the original schedule. Recovery mode: do the essential tasks only until you are back in rhythm. The backlog is not a debt to repay.`
      : undefined,
  };
}

export function phaseProgress(
  days: Day[],
  phaseId: string,
  state: PersistedState,
): { done: number; total: number; ratio: number } {
  const phaseDays = days.filter((d) => d.phaseId === phaseId);
  const done = phaseDays.filter((d) => state.completedDays[d.id]).length;
  return {
    done,
    total: phaseDays.length,
    ratio: phaseDays.length === 0 ? 0 : done / phaseDays.length,
  };
}

/** Overall progress against authored days, not against a fictional 365. */
export function overallProgress(
  days: Day[],
  state: PersistedState,
): { done: number; total: number; ratio: number } {
  const done = days.filter((d) => state.completedDays[d.id]).length;
  return { done, total: days.length, ratio: days.length === 0 ? 0 : done / days.length };
}

/** Total focused minutes recorded, estimated from completed tasks. */
export function completedMinutes(days: Day[], state: PersistedState): number {
  return days
    .flatMap((d) => d.tasks)
    .filter((t) => state.completedTasks[t.id])
    .reduce((sum, t) => sum + t.minutes, 0);
}

/** Calendar date a day is scheduled for, skipping non-study days. */
export function scheduledDate(dayNumber: number, settings: Settings): Date {
  const cursor = parseDateKey(settings.startDate);
  let remaining = dayNumber - 1;
  let guard = 0;
  while (remaining > 0 && guard < 5000) {
    cursor.setDate(cursor.getDate() + 1);
    if (isStudyDay(cursor, settings)) remaining--;
    guard++;
  }
  return cursor;
}
