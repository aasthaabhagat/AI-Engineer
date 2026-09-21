import { describe, expect, it } from "vitest";
import type { Day, Task } from "@/data/types";
import {
  STATE_VERSION,
  createInitialState,
  migrateState,
  type PersistedState,
} from "@/lib/state";
import {
  currentDay,
  dayTaskProgress,
  essentialTasksComplete,
  phaseProgress,
} from "@/lib/progress";

const task = (id: string, minutes: number, priority: Task["priority"]): Task => ({
  id,
  title: id,
  type: "build",
  minutes,
  priority,
});

const makeDay = (n: number, tasks: Task[], phaseId = "p01-python"): Day => ({
  id: `day-${String(n).padStart(3, "0")}`,
  dayNumber: n,
  phaseId,
  moduleId: "m-py-files",
  title: `Day ${n}`,
  objective: "",
  estimatedMinutes: tasks.reduce((s, t) => s + t.minutes, 0),
  tasks,
});

const emptyState = (): PersistedState => ({
  ...createInitialState(),
  completedTasks: {},
  completedDays: {},
});

describe("day completion", () => {
  const day = makeDay(1, [
    task("t1", 30, "essential"),
    task("t2", 30, "essential"),
    task("t3", 30, "optional"),
  ]);

  it("requires every essential task", () => {
    const state = emptyState();
    state.completedTasks = { t1: "2026-01-01T00:00:00.000Z" };
    expect(essentialTasksComplete(day, state)).toBe(false);

    state.completedTasks.t2 = "2026-01-01T00:00:00.000Z";
    expect(essentialTasksComplete(day, state)).toBe(true);
  });

  it("does not require optional tasks", () => {
    const state = emptyState();
    state.completedTasks = {
      t1: "2026-01-01T00:00:00.000Z",
      t2: "2026-01-01T00:00:00.000Z",
    };
    expect(essentialTasksComplete(day, state)).toBe(true);
    expect(dayTaskProgress(day, state).ratio).toBeCloseTo(2 / 3);
  });

  it("never counts a day with no essential tasks as done", () => {
    const optionalOnly = makeDay(2, [task("o1", 10, "optional")]);
    expect(essentialTasksComplete(optionalOnly, emptyState())).toBe(false);
  });
});

describe("currentDay", () => {
  const days = [makeDay(1, []), makeDay(2, []), makeDay(3, [])];

  it("returns the first incomplete day", () => {
    const state = emptyState();
    state.completedDays = {
      "day-001": { completedAt: "2026-01-01T00:00:00.000Z" },
    };
    expect(currentDay(days, state)?.dayNumber).toBe(2);
  });

  it("returns an earlier day left open after later ones were finished", () => {
    const state = emptyState();
    state.completedDays = {
      "day-001": { completedAt: "2026-01-01T00:00:00.000Z" },
      "day-003": { completedAt: "2026-01-02T00:00:00.000Z" },
    };
    expect(currentDay(days, state)?.dayNumber).toBe(2);
  });

  it("returns undefined when everything is done", () => {
    const state = emptyState();
    for (const d of days) {
      state.completedDays[d.id] = { completedAt: "2026-01-01T00:00:00.000Z" };
    }
    expect(currentDay(days, state)).toBeUndefined();
  });
});

describe("phaseProgress", () => {
  it("counts only the days of the given phase", () => {
    const days = [makeDay(1, []), makeDay(2, []), makeDay(3, [], "p02-git")];
    const state = emptyState();
    state.completedDays = {
      "day-001": { completedAt: "2026-01-01T00:00:00.000Z" },
      "day-003": { completedAt: "2026-01-01T00:00:00.000Z" },
    };
    expect(phaseProgress(days, "p01-python", state)).toEqual({
      done: 1,
      total: 2,
      ratio: 0.5,
    });
  });

  it("reports zero rather than NaN for a phase with no days", () => {
    expect(phaseProgress([], "p24-career", emptyState()).ratio).toBe(0);
  });
});

describe("migrateState", () => {
  it("returns usable defaults for junk input", () => {
    expect(migrateState(null).version).toBe(STATE_VERSION);
    expect(migrateState("not an object").settings.theme).toBe("light");
    expect(migrateState(42).completedDays).toBeDefined();
    expect(migrateState([]).completedTasks).toBeDefined();
  });

  it("keeps readable fields and replaces unreadable ones", () => {
    const result = migrateState({
      version: 3,
      completedTasks: { "d01-t1": "2026-01-01T00:00:00.000Z" },
      completedDays: "corrupted",
      settings: { theme: "dark" },
    });
    expect(result.completedTasks["d01-t1"]).toBeDefined();
    expect(result.completedDays["day-001"]).toBeDefined();
    expect(result.settings.theme).toBe("dark");
  });

  it("rejects an invalid theme without losing the rest", () => {
    const result = migrateState({ version: 4, settings: { theme: "neon" } });
    expect(result.settings.theme).toBe("light");
  });

  it("carries data from earlier versions forward instead of deleting it", () => {
    const notes = [{ id: "n1", title: "kept" }];
    const result = migrateState({ version: 3, notes }) as PersistedState & {
      notes?: unknown;
    };
    expect(result.notes).toEqual(notes);
    expect(result.version).toBe(STATE_VERSION);
  });
});

describe("seeded state", () => {
  it("records the three days the git history proves, and nothing more", () => {
    const state = createInitialState();
    expect(Object.keys(state.completedDays)).toEqual([
      "day-001",
      "day-002",
      "day-003",
    ]);
    expect(state.completedDays["day-004"]).toBeUndefined();
  });
});
