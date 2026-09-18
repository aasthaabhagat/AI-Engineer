import type { Day } from "./types";
import { pyFoundationDays } from "./days/py-foundations";
import { pyQualityDays } from "./days/py-quality";
import { pyCraftDays } from "./days/py-craft";
import { gitWorkflowDays } from "./days/git-workflow";

export * from "./types";
export { phases, phaseById, moduleById } from "./phases";
export { skills, skillById, allEvidenceIds } from "./skills";
export { projects, projectById } from "./projects";
export { blueprints, blueprintById, capabilities } from "./blueprints";
export { weeks, weekByNumber, weekForDay, weeksForPhase } from "./weeks";

/**
 * All authored days, in order.
 *
 * Phases 3-24 are outlined rather than day-authored: their missions get written
 * as you approach them, so they can reflect your actual pace and the code you
 * have actually built. That is a deliberate design choice, not missing content.
 */
export const days: Day[] = [
  ...pyFoundationDays,
  ...pyQualityDays,
  ...pyCraftDays,
  ...gitWorkflowDays,
].sort((a, b) => a.dayNumber - b.dayNumber);

export const dayById = new Map(days.map((d) => [d.id, d]));
export const dayByNumber = new Map(days.map((d) => [d.dayNumber, d]));

/** The last day currently authored. Beyond this, the roadmap is outline-level. */
export const authoredThrough = days.length > 0 ? days[days.length - 1].dayNumber : 0;

export const allTasks = days.flatMap((d) => d.tasks);
export const taskById = new Map(allTasks.map((t) => [t.id, t]));

/** Which day contains a given task. */
export const dayIdByTaskId = new Map(
  days.flatMap((d) => d.tasks.map((t) => [t.id, d.id] as const)),
);
