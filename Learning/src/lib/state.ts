import type { ProjectStatus } from "@/data/types";
import type { RadarStance } from "@/data/radar";
import {
  defaultNotificationPrefs,
  normalizePrefs,
  type NotificationPrefs,
} from "./notifications";

/** v2 added notification preferences and cue bookkeeping. */
export const STATE_VERSION = 2;
export const STORAGE_KEY = "ai-engineer-training-os";

export interface Settings {
  name: string;
  /** ISO date (YYYY-MM-DD) the programme started. */
  startDate: string;
  weekdayMinutes: number;
  weekendMinutes: number;
  /** Days of the week available to study. 0 = Sunday. */
  studyDays: number[];
  theme: "dark" | "light";
}

export interface DayRecord {
  completedAt: string;
  reflection?: string;
  /** Free-text notes on evidence produced, e.g. a commit SHA. */
  evidenceNote?: string;
}

export interface ProjectState {
  status?: ProjectStatus;
  milestonesDone: string[];
  githubUrl?: string;
  deploymentUrl?: string;
  notes?: string;
}

export interface Note {
  id: string;
  createdAt: string;
  title: string;
  body: string;
  /** "concept" | "mistake" | "decision" | "snippet" | "question" */
  kind: string;
  tags: string[];
  skillId?: string;
  projectId?: string;
}

export interface JournalEntry {
  id: string;
  createdAt: string;
  title: string;
  /** What happened, what caused it, how it was fixed, what it taught. */
  problem: string;
  cause: string;
  fix: string;
  lesson: string;
  dayId?: string;
  projectId?: string;
}

export interface Review {
  id: string;
  createdAt: string;
  kind: "daily" | "weekly" | "monthly" | "quarterly";
  /** Question id -> answer. Questions live in lib/reviews.ts. */
  answers: Record<string, string>;
}

/** Dedupe bookkeeping so a cue fires once, not on every render. */
export interface CueLog {
  /** Local date key of the last daily mission reminder. */
  dailyReminder?: string;
  /** Highest streak milestone already announced. */
  streakMilestone?: number;
  /** Local date key of the last recovery-mode notice. */
  recoveryNotice?: string;
}

export interface PersistedState {
  version: number;
  settings: Settings;
  notifications: NotificationPrefs;
  cues: CueLog;
  /** taskId -> ISO completion timestamp. */
  completedTasks: Record<string, string>;
  /** dayId -> record. */
  completedDays: Record<string, DayRecord>;
  /** evidenceId -> ISO timestamp. */
  evidence: Record<string, string>;
  projects: Record<string, ProjectState>;
  /** Radar entry id -> your stance on it. */
  radar: Record<string, RadarStance>;
  notes: Note[];
  journal: JournalEntry[];
  reviews: Review[];
}

export const defaultSettings: Settings = {
  name: "",
  // Seeded from the first commit in the repository.
  startDate: "2026-09-13",
  weekdayMinutes: 120,
  weekendMinutes: 240,
  studyDays: [0, 1, 2, 3, 4, 5, 6],
  theme: "dark",
};

/**
 * Days 1-3 are recorded as complete because the git history proves the work:
 * "Build expense tracker CLI v0.1", "Add dot spot painting project",
 * "Refactor expense tracker into modules". Nothing else is pre-filled —
 * the system must never claim progress that has not happened.
 */
const seededDays: Record<string, DayRecord> = {
  "day-001": { completedAt: "2026-09-13T20:00:00.000Z" },
  "day-002": { completedAt: "2026-09-14T20:00:00.000Z" },
  "day-003": { completedAt: "2026-09-16T20:00:00.000Z" },
};

const seededEvidence: Record<string, string> = {
  "ev-py-1": "2026-09-13T20:00:00.000Z",
  "ev-py-3": "2026-09-13T20:00:00.000Z",
  "ev-cli-1": "2026-09-13T20:00:00.000Z",
  "ev-git-1": "2026-09-13T20:00:00.000Z",
  "ev-py-2": "2026-09-16T20:00:00.000Z",
  "ev-arch-1": "2026-09-16T20:00:00.000Z",
};

export function createInitialState(): PersistedState {
  const completedTasks: Record<string, string> = {};
  for (const dayId of Object.keys(seededDays)) {
    const n = dayId.slice(-3);
    // Seed the tasks of completed days so per-day progress reads correctly.
    for (let i = 1; i <= 5; i++) {
      completedTasks[`d${n.slice(1)}-t${i}`] = seededDays[dayId].completedAt;
    }
  }

  return {
    version: STATE_VERSION,
    settings: { ...defaultSettings },
    notifications: { ...defaultNotificationPrefs },
    cues: {},
    completedTasks,
    completedDays: { ...seededDays },
    evidence: { ...seededEvidence },
    projects: {},
    radar: {},
    notes: [],
    journal: [],
    reviews: [],
  };
}

/**
 * Accepts anything and returns valid state. Corrupt or partial data must never
 * crash the app or silently destroy what is still readable — the same rule the
 * Expense Tracker learns on day 5.
 */
export function migrateState(raw: unknown): PersistedState {
  const base = createInitialState();
  if (!raw || typeof raw !== "object") return base;

  const input = raw as Partial<PersistedState>;
  const isRecord = (v: unknown): v is Record<string, string> =>
    !!v && typeof v === "object" && !Array.isArray(v);

  return {
    version: STATE_VERSION,
    settings: { ...base.settings, ...(input.settings ?? {}) },
    // v1 state has no notifications key; normalizePrefs supplies safe defaults
    // (notifications and sound both OFF) rather than assuming consent.
    notifications: normalizePrefs(input.notifications),
    cues:
      input.cues && typeof input.cues === "object" && !Array.isArray(input.cues)
        ? (input.cues as CueLog)
        : {},
    completedTasks: isRecord(input.completedTasks)
      ? input.completedTasks
      : base.completedTasks,
    completedDays:
      input.completedDays && typeof input.completedDays === "object"
        ? (input.completedDays as Record<string, DayRecord>)
        : base.completedDays,
    evidence: isRecord(input.evidence) ? input.evidence : base.evidence,
    projects:
      input.projects && typeof input.projects === "object"
        ? (input.projects as Record<string, ProjectState>)
        : {},
    radar:
      input.radar && typeof input.radar === "object" && !Array.isArray(input.radar)
        ? (input.radar as Record<string, RadarStance>)
        : {},
    notes: Array.isArray(input.notes) ? input.notes : [],
    journal: Array.isArray(input.journal) ? input.journal : [],
    reviews: Array.isArray(input.reviews) ? input.reviews : [],
  };
}
