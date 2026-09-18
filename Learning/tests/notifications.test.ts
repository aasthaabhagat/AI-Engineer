import { describe, expect, it } from "vitest";
import {
  breakDue,
  dailyReminderDue,
  defaultNotificationPrefs,
  dueReviews,
  formatDuration,
  normalizePrefs,
  shouldNotify,
  shouldPlaySound,
  streakMilestone,
  type NotificationPrefs,
  type ReviewKind,
} from "@/lib/notifications";
import {
  STATE_VERSION,
  createInitialState,
  migrateState,
} from "@/lib/state";

const prefs = (patch: Partial<NotificationPrefs> = {}): NotificationPrefs => ({
  ...defaultNotificationPrefs,
  ...patch,
});

describe("defaults", () => {
  it("ships with notifications and sound OFF", () => {
    // Consent is never assumed. This is the whole contract with the user.
    expect(defaultNotificationPrefs.enabled).toBe(false);
    expect(defaultNotificationPrefs.sound).toBe(false);
  });

  it("defaults the noisiest category off", () => {
    expect(defaultNotificationPrefs.categories.taskComplete).toBe(false);
  });
});

describe("shouldNotify / shouldPlaySound", () => {
  it("needs both the master switch and the category", () => {
    expect(shouldNotify(prefs({ enabled: false }), "milestone")).toBe(false);
    expect(shouldNotify(prefs({ enabled: true }), "milestone")).toBe(true);
    expect(
      shouldNotify(
        prefs({ enabled: true, categories: { ...defaultNotificationPrefs.categories, milestone: false } }),
        "milestone",
      ),
    ).toBe(false);
  });

  it("gates sound on the sound switch, independently of notifications", () => {
    expect(shouldPlaySound(prefs({ enabled: true, sound: false }), "milestone")).toBe(false);
    expect(shouldPlaySound(prefs({ enabled: false, sound: true }), "milestone")).toBe(true);
  });
});

describe("normalizePrefs", () => {
  it("returns safe defaults for junk", () => {
    expect(normalizePrefs(null).enabled).toBe(false);
    expect(normalizePrefs("nonsense").sound).toBe(false);
    expect(normalizePrefs(7).volume).toBe(defaultNotificationPrefs.volume);
  });

  it("clamps volume into range", () => {
    expect(normalizePrefs({ volume: 9 }).volume).toBe(1);
    expect(normalizePrefs({ volume: -3 }).volume).toBe(0);
    expect(normalizePrefs({ volume: Number.NaN }).volume).toBe(
      defaultNotificationPrefs.volume,
    );
  });

  it("rejects a malformed reminder time", () => {
    expect(normalizePrefs({ dailyReminderTime: "half past six" }).dailyReminderTime).toBe(
      "19:30",
    );
    expect(normalizePrefs({ dailyReminderTime: "07:05" }).dailyReminderTime).toBe("07:05");
  });

  it("keeps unknown-shaped categories from dropping known ones", () => {
    const result = normalizePrefs({ categories: { milestone: false } });
    expect(result.categories.milestone).toBe(false);
    expect(result.categories.review).toBe(true);
  });

  it("never lets a corrupt file silently enable notifications", () => {
    expect(normalizePrefs({ enabled: "yes" }).enabled).toBe(false);
  });
});

describe("streakMilestone", () => {
  it("fires only on listed milestones", () => {
    expect(streakMilestone(3)).toBe(3);
    expect(streakMilestone(7)).toBe(7);
    expect(streakMilestone(4)).toBeNull();
    expect(streakMilestone(0)).toBeNull();
  });
});

describe("dueReviews", () => {
  const start = "2026-01-01";

  it("counts from the start date when nothing was written", () => {
    expect(dueReviews({}, start, new Date(2026, 0, 5))).toEqual([]);
    expect(dueReviews({}, start, new Date(2026, 0, 9))).toEqual(["weekly"]);
    expect(dueReviews({}, start, new Date(2026, 3, 5))).toEqual([
      "weekly",
      "monthly",
      "quarterly",
    ]);
  });

  it("counts from the last review of that kind", () => {
    const last: Partial<Record<ReviewKind, string>> = {
      weekly: new Date(2026, 0, 8).toISOString(),
    };
    expect(dueReviews(last, start, new Date(2026, 0, 12))).toEqual([]);
    expect(dueReviews(last, start, new Date(2026, 0, 16))).toEqual(["weekly"]);
  });

  it("tolerates an unparseable start date instead of throwing", () => {
    expect(dueReviews({}, "not-a-date", new Date())).toEqual([]);
  });
});

describe("breakDue", () => {
  it("triggers at the configured threshold", () => {
    const p = prefs({ breakAfterMinutes: 50 });
    expect(breakDue(49 * 60, p)).toBe(false);
    expect(breakDue(50 * 60, p)).toBe(true);
  });
});

describe("dailyReminderDue", () => {
  const at = (h: number, m: number) => new Date(2026, 0, 5, h, m);

  it("stays silent before the configured time", () => {
    const p = prefs({ enabled: true, dailyReminderTime: "19:30" });
    expect(dailyReminderDue(p, undefined, at(18, 0), "2026-01-05")).toBe(false);
    expect(dailyReminderDue(p, undefined, at(19, 30), "2026-01-05")).toBe(true);
    expect(dailyReminderDue(p, undefined, at(22, 0), "2026-01-05")).toBe(true);
  });

  it("fires at most once per day", () => {
    const p = prefs({ enabled: true });
    expect(dailyReminderDue(p, "2026-01-05", at(21, 0), "2026-01-05")).toBe(false);
    expect(dailyReminderDue(p, "2026-01-04", at(21, 0), "2026-01-05")).toBe(true);
  });

  it("respects the master switch and the category", () => {
    expect(dailyReminderDue(prefs({ enabled: false }), undefined, at(21, 0), "2026-01-05")).toBe(
      false,
    );
    expect(
      dailyReminderDue(
        prefs({
          enabled: true,
          categories: { ...defaultNotificationPrefs.categories, dailyMission: false },
        }),
        undefined,
        at(21, 0),
        "2026-01-05",
      ),
    ).toBe(false);
  });
});

describe("formatDuration", () => {
  it("formats mm:ss and grows to hours only when needed", () => {
    expect(formatDuration(0)).toBe("00:00");
    expect(formatDuration(65)).toBe("01:05");
    expect(formatDuration(599)).toBe("09:59");
    expect(formatDuration(3600)).toBe("1:00:00");
    expect(formatDuration(3725)).toBe("1:02:05");
  });

  it("never renders negative time", () => {
    expect(formatDuration(-10)).toBe("00:00");
  });
});

describe("state migration", () => {
  it("gives v1 state notification defaults without enabling anything", () => {
    const v1 = {
      version: 1,
      settings: { weekdayMinutes: 90 },
      completedTasks: { "d01-t1": "2026-01-01T00:00:00.000Z" },
    };
    const migrated = migrateState(v1);
    expect(migrated.version).toBe(STATE_VERSION);
    expect(migrated.notifications.enabled).toBe(false);
    expect(migrated.notifications.sound).toBe(false);
    expect(migrated.cues).toEqual({});
    // Existing progress survives the migration.
    expect(migrated.completedTasks["d01-t1"]).toBeDefined();
    expect(migrated.settings.weekdayMinutes).toBe(90);
  });

  it("adopts the new default theme once, when coming from before v3", () => {
    // Everyone who used v1 or v2 had "dark" written to storage by the first
    // save, so the new light default would otherwise never be seen.
    const migrated = migrateState({
      version: 2,
      settings: { theme: "dark", weekdayMinutes: 120 },
    });
    expect(migrated.settings.theme).toBe("light");
    // Everything else about the settings survives.
    expect(migrated.settings.weekdayMinutes).toBe(120);
  });

  it("never overrides a theme chosen at v3 or later", () => {
    const migrated = migrateState({
      version: STATE_VERSION,
      settings: { theme: "dark" },
    });
    expect(migrated.settings.theme).toBe("dark");
  });

  it("repairs a corrupt cue log rather than crashing", () => {
    expect(migrateState({ cues: "broken" }).cues).toEqual({});
    expect(migrateState({ cues: ["also broken"] }).cues).toEqual({});
  });

  it("initial state carries notification prefs", () => {
    expect(createInitialState().notifications).toEqual(defaultNotificationPrefs);
  });
});
