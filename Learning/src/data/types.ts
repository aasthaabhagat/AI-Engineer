/**
 * Core domain model for the AI Engineer study plan.
 *
 * Design rule: curriculum content lives in /src/data as plain data.
 * UI components must never hard-code roadmap content.
 */

/** What kind of work a task is. Drives the icon beside it. */
export type TaskType =
  | "learn"
  | "practice"
  | "build"
  | "test"
  | "document"
  | "git"
  | "deploy"
  | "evaluate"
  | "review";

/** Time triage. If only the essentials are done, the day still counts. */
export type Priority = "essential" | "important" | "optional";

export interface Task {
  id: string;
  title: string;
  detail?: string;
  type: TaskType;
  minutes: number;
  priority: Priority;
  /** Repo-relative path this task touches, e.g. "01-Python-Foundations/projects/expense-tracker". */
  repoPath?: string;
}

export interface Day {
  id: string;
  dayNumber: number;
  phaseId: string;
  moduleId: string;
  title: string;
  objective: string;
  estimatedMinutes: number;
  tasks: Task[];
}

/** A study topic: a module within a phase, with the points it covers. */
export interface Module {
  id: string;
  phaseId: string;
  title: string;
  description: string;
  outcomes: string[];
}

/**
 * "detailed" = daily tasks exist in /src/data/days.
 * "outline"  = topics exist; daily tasks get written on approach,
 *              so they can adapt to actual pace and prior work.
 */
export type PhaseAuthoring = "detailed" | "outline";

export interface Phase {
  id: string;
  order: number;
  title: string;
  summary: string;
  modules: Module[];
  authoring: PhaseAuthoring;
}
