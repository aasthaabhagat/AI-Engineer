/**
 * v4 reduced the app to study topics and daily tasks. Fields written by
 * earlier versions (notes, journal, reviews, projects…) are carried forward
 * untouched rather than deleted — they are no longer shown, but they are the
 * owner's data.
 */
export const STATE_VERSION = 4;
export const STORAGE_KEY = "ai-engineer-training-os";

export interface Settings {
  theme: "dark" | "light";
}

export interface DayRecord {
  completedAt: string;
}

export interface PersistedState {
  version: number;
  settings: Settings;
  /** taskId -> ISO completion timestamp. */
  completedTasks: Record<string, string>;
  /** dayId -> record. */
  completedDays: Record<string, DayRecord>;
}

export const defaultSettings: Settings = {
  theme: "light",
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
    completedTasks,
    completedDays: { ...seededDays },
  };
}

const isRecord = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === "object" && !Array.isArray(v);

/**
 * Accepts anything and returns valid state. Corrupt or partial data must never
 * crash the app or silently destroy what is still readable — the same rule the
 * Expense Tracker learns on day 5.
 */
export function migrateState(raw: unknown): PersistedState {
  const base = createInitialState();
  if (!isRecord(raw)) return base;

  const input = raw as Partial<PersistedState> & Record<string, unknown>;
  const settings: Settings = {
    ...base.settings,
    ...(isRecord(input.settings) ? input.settings : {}),
  };
  if (settings.theme !== "dark" && settings.theme !== "light") {
    settings.theme = base.settings.theme;
  }

  // v3 changed the default theme from dark to light. Everyone who had used
  // the app already had "dark" written to storage by the first save, so the
  // new default would never be seen. Adopt it once, on the way to v3; after
  // that the theme is the user's own choice and is never touched again.
  const fromVersion = typeof input.version === "number" ? input.version : 0;
  if (fromVersion < 3) settings.theme = base.settings.theme;

  return {
    // Keys from older versions ride along so nothing readable is destroyed.
    ...input,
    version: STATE_VERSION,
    settings,
    completedTasks: isRecord(input.completedTasks)
      ? (input.completedTasks as Record<string, string>)
      : base.completedTasks,
    completedDays: isRecord(input.completedDays)
      ? (input.completedDays as Record<string, DayRecord>)
      : base.completedDays,
  };
}
