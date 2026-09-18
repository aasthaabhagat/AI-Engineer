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
  currentStreak,
  dayTaskProgress,
  elapsedStudyDays,
  essentialTasksComplete,
  overallProgress,
  planForTime,
  scheduledDate,
  scheduleStatus,
  dateKey,
} from "@/lib/progress";

const task = (id: string, minutes: number, priority: Task["priority"]): Task => ({
  id,
  title: id,
  type: "build",
  minutes,
  priority,
});

const makeDay = (n: number, tasks: Task[]): Day => ({
  id: `day-${String(n).padStart(3, "0")}`,
  dayNumber: n,
  phaseId: "p01-python",
  moduleId: "m-py-files",
  title: `Day ${n}`,
  objective: "",
  whyItMatters: "",
  careerConnection: "",
  estimatedMinutes: tasks.reduce((s, t) => s + t.minutes, 0),
  tasks,
  deliverables: [],
  definitionOfDone: [],
  skills: [],
});

const emptyState = (): PersistedState => ({
  ...createInitialState(),
  completedTasks: {},
  completedDays: {},
  evidence: {},
});

describe("planForTime", () => {
  const day = makeDay(1, [
    task("t1", 60, "essential"),
    task("t2", 45, "essential"),
    task("t3", 30, "important"),
    task("t4", 30, "optional"),
  ]);

  it("keeps every essential task even when they exceed the budget", () => {
    const { included, deferred } = planForTime(day, 30);
    expect(included.map((t) => t.id)).toEqual(["t1", "t2"]);
    expect(deferred.map((t) => t.id)).toEqual(["t3", "t4"]);
  });

  it("adds lower-priority work when time allows", () => {
    const { included, deferred } = planForTime(day, 180);
    expect(included).toHaveLength(4);
    expect(deferred).toHaveLength(0);
  });

  it("fills in priority order, not declaration order", () => {
    const { included } = planForTime(day, 140);
    expect(included.map((t) => t.id)).toEqual(["t1", "t2", "t3"]);
  });
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

  it("skips ahead over out-of-order completions", () => {
    const state = emptyState();
    state.completedDays = {
      "day-001": { completedAt: "2026-01-01T00:00:00.000Z" },
      "day-002": { completedAt: "2026-01-02T00:00:00.000Z" },
    };
    expect(currentDay(days, state)?.dayNumber).toBe(3);
  });

  it("returns undefined when everything is done", () => {
    const state = emptyState();
    for (const d of days) {
      state.completedDays[d.id] = { completedAt: "2026-01-01T00:00:00.000Z" };
    }
    expect(currentDay(days, state)).toBeUndefined();
    expect(overallProgress(days, state).ratio).toBe(1);
  });
});

describe("currentStreak", () => {
  const dayAgo = (n: number) => {
    const d = new Date(2026, 0, 10);
    d.setDate(d.getDate() - n);
    return d.toISOString();
  };
  const today = new Date(2026, 0, 10);

  it("counts consecutive days ending today", () => {
    const state = emptyState();
    state.completedDays = {
      a: { completedAt: dayAgo(0) },
      b: { completedAt: dayAgo(1) },
      c: { completedAt: dayAgo(2) },
    };
    expect(currentStreak(state, today)).toBe(3);
  });

  it("allows one grace day so an unstarted today does not break it", () => {
    const state = emptyState();
    state.completedDays = {
      b: { completedAt: dayAgo(1) },
      c: { completedAt: dayAgo(2) },
    };
    expect(currentStreak(state, today)).toBe(2);
  });

  it("breaks after a two-day gap", () => {
    const state = emptyState();
    state.completedDays = {
      c: { completedAt: dayAgo(2) },
      d: { completedAt: dayAgo(3) },
    };
    expect(currentStreak(state, today)).toBe(0);
  });

  it("is zero with no completions", () => {
    expect(currentStreak(emptyState(), today)).toBe(0);
  });
});

describe("elapsedStudyDays", () => {
  it("counts only configured study days", () => {
    const state = emptyState();
    // 2026-01-05 is a Monday.
    state.settings.startDate = "2026-01-05";
    state.settings.studyDays = [1, 2, 3, 4, 5];
    // Through Sunday 2026-01-11: five weekdays.
    expect(elapsedStudyDays(state.settings, new Date(2026, 0, 11))).toBe(5);
  });

  it("never returns less than one", () => {
    const state = emptyState();
    state.settings.startDate = "2026-06-01";
    expect(elapsedStudyDays(state.settings, new Date(2026, 0, 1))).toBe(1);
  });
});

describe("scheduleStatus", () => {
  const days = Array.from({ length: 20 }, (_, i) => makeDay(i + 1, []));

  it("enters recovery mode once three or more days behind", () => {
    const state = emptyState();
    state.settings.startDate = "2026-01-05";
    state.settings.studyDays = [0, 1, 2, 3, 4, 5, 6];
    // Ten days elapsed, none completed.
    const status = scheduleStatus(days, state, new Date(2026, 0, 14));
    expect(status.expected).toBe(10);
    expect(status.actual).toBe(1);
    expect(status.recoveryMode).toBe(true);
    expect(status.message).toBeDefined();
  });

  it("stays calm when on schedule", () => {
    const state = emptyState();
    state.settings.startDate = "2026-01-05";
    for (let i = 1; i <= 9; i++) {
      state.completedDays[`day-${String(i).padStart(3, "0")}`] = {
        completedAt: "2026-01-10T00:00:00.000Z",
      };
    }
    const status = scheduleStatus(days, state, new Date(2026, 0, 14));
    expect(status.recoveryMode).toBe(false);
    expect(status.behind).toBe(0);
  });
});

describe("scheduledDate", () => {
  it("skips non-study days when projecting onto the calendar", () => {
    const settings = { ...emptyState().settings, startDate: "2026-01-05", studyDays: [1, 2, 3, 4, 5] };
    // Day 1 Mon 5th, day 5 Fri 9th, day 6 skips the weekend to Mon 12th.
    expect(dateKey(scheduledDate(1, settings))).toBe("2026-01-05");
    expect(dateKey(scheduledDate(5, settings))).toBe("2026-01-09");
    expect(dateKey(scheduledDate(6, settings))).toBe("2026-01-12");
  });
});

describe("migrateState", () => {
  it("returns usable defaults for junk input", () => {
    expect(migrateState(null).version).toBe(STATE_VERSION);
    expect(migrateState("not an object").settings).toBeDefined();
    expect(migrateState(42).notes).toEqual([]);
  });

  it("keeps readable fields and replaces unreadable ones", () => {
    const result = migrateState({
      completedTasks: { "d01-t1": "2026-01-01T00:00:00.000Z" },
      notes: "corrupted, should not be a string",
      settings: { weekdayMinutes: 45 },
    });
    expect(result.completedTasks["d01-t1"]).toBeDefined();
    expect(result.notes).toEqual([]);
    expect(result.settings.weekdayMinutes).toBe(45);
    // Untouched settings keep their defaults rather than becoming undefined.
    expect(result.settings.weekendMinutes).toBe(240);
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
