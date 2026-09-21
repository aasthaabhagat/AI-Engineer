import type { Day } from "@/data/types";
import type { PersistedState } from "./state";

/** The next day to work on: the lowest-numbered day not yet completed. */
export function currentDay(days: Day[], state: PersistedState): Day | undefined {
  return days.find((d) => !state.completedDays[d.id]);
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
