/**
 * Core domain model for the AI Engineer Training OS.
 *
 * Design rule: curriculum content lives in /src/data as plain data.
 * UI components must never hard-code roadmap content.
 */

/** The four parallel tracks. Every phase, skill and day belongs to one. */
export type Track = "ai" | "software" | "production" | "career";

export const TRACK_LABEL: Record<Track, string> = {
  ai: "AI Depth",
  software: "Software Engineering",
  production: "Production / DevOps / MLOps",
  career: "AI Product, Portfolio & Career",
};

/** What kind of work a task is. Drives the icon and the daily balance check. */
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

export interface Resource {
  label: string;
  kind: "course" | "docs" | "reference" | "repo";
  /** Course section name, doc URL, or repo-relative path. Never an invented URL. */
  ref: string;
  note?: string;
}

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

export interface GitTask {
  commitMessage: string;
  note?: string;
}

export interface Day {
  id: string;
  dayNumber: number;
  phaseId: string;
  moduleId: string;
  title: string;
  objective: string;
  whyItMatters: string;
  careerConnection: string;
  estimatedMinutes: number;
  tasks: Task[];
  deliverables: string[];
  definitionOfDone: string[];
  gitTask?: GitTask;
  projectId?: string;
  repoPath?: string;
  resources?: Resource[];
  /** Skill ids this day advances. */
  skills: string[];
  /** Evidence ids this day is expected to unlock. */
  evidence?: string[];
}

export interface Module {
  id: string;
  phaseId: string;
  title: string;
  description: string;
  outcomes: string[];
  skills: string[];
}

/**
 * "detailed" = day-by-day missions exist in /src/data/days.
 * "outline"  = modules and outcomes exist; days get authored on approach,
 *              so they can adapt to actual pace and prior work.
 */
export type PhaseAuthoring = "detailed" | "outline";

export interface Phase {
  id: string;
  order: number;
  title: string;
  track: Track;
  summary: string;
  /** Rough size, used for roadmap planning only. Not a deadline. */
  estimatedDays: number;
  modules: Module[];
  milestone: string;
  /** Phase ids that should be underway before this one starts. */
  dependsOn: string[];
  authoring: PhaseAuthoring;
}

/** Evidence-based maturity ladder. Deliberately not a percentage. */
export type Maturity =
  | "not-started"
  | "awareness"
  | "understanding"
  | "practicing"
  | "implementing"
  | "applied"
  | "engineering"
  | "strong";

export const MATURITY_ORDER: Maturity[] = [
  "not-started",
  "awareness",
  "understanding",
  "practicing",
  "implementing",
  "applied",
  "engineering",
  "strong",
];

export const MATURITY_LABEL: Record<Maturity, string> = {
  "not-started": "Not started",
  awareness: "Awareness",
  understanding: "Understanding",
  practicing: "Practicing",
  implementing: "Implementing",
  applied: "Applied",
  engineering: "Engineering",
  strong: "Strong",
};

/** How deeply this technology needs to be learned, and why. */
export type SkillTier = "core" | "important" | "supporting" | "awareness";

export interface Evidence {
  id: string;
  label: string;
  /** Ordered rungs: evidence is a ladder, not a checklist of equals. */
  weight?: number;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  track: Track;
  tier: SkillTier;
  summary: string;
  /** Why this technology exists / what problem it solves. */
  whyItExists: string;
  /** When NOT to reach for it. Guards against technology collecting. */
  whenNotToUse?: string;
  evidence: Evidence[];
  relatedProjects: string[];
}

export type ProjectStatus =
  | "idea"
  | "planning"
  | "building"
  | "testing"
  | "evaluating"
  | "deploying"
  | "portfolio-ready"
  | "archived";

export const PROJECT_STATUS_LABEL: Record<ProjectStatus, string> = {
  idea: "Idea",
  planning: "Planning",
  building: "Building",
  testing: "Testing",
  evaluating: "Evaluating",
  deploying: "Deploying",
  "portfolio-ready": "Portfolio ready",
  archived: "Archived",
};

export interface Milestone {
  id: string;
  title: string;
  detail?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  problem: string;
  targetUser: string;
  status: ProjectStatus;
  /** 1-10 project progression ladder. */
  level: number;
  techStack: string[];
  skills: string[];
  repoPath?: string;
  githubUrl?: string;
  deploymentUrl?: string;
  milestones: Milestone[];
  /** True if this is intended to become a deep portfolio project. */
  portfolioTarget: boolean;
  aiComponent?: string;
}

/** Architecture reference: teaches the shape of a system, not just a diagram. */
export interface Blueprint {
  id: string;
  name: string;
  category: string;
  problem: string;
  whenToUse: string;
  whenNotToUse: string;
  flow: string[];
  components: { name: string; role: string }[];
  tradeoffs: string[];
  failurePoints: string[];
  evaluation: string[];
  security?: string[];
}

/** "Can I build this?" capability check. */
export interface Capability {
  id: string;
  question: string;
  requires: string[]; // skill ids
}
