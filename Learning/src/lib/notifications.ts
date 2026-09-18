/**
 * Notification model and pure scheduling logic.
 *
 * Everything here is side-effect free and unit tested. Browser APIs
 * (Notification, AudioContext) live in notifier.ts, which is client-only.
 */

export type NotificationCategory =
  | "dailyMission"
  | "taskComplete"
  | "focusComplete"
  | "breakReminder"
  | "timerComplete"
  | "recovery"
  | "review"
  | "milestone";

export const NOTIFICATION_CATEGORIES: {
  id: NotificationCategory;
  label: string;
  description: string;
}[] = [
  {
    id: "dailyMission",
    label: "Daily mission reminder",
    description:
      "A nudge at your chosen time, if the app is open in a tab. There is no background scheduling.",
  },
  {
    id: "taskComplete",
    label: "Task completed",
    description: "A short tone when you tick a task off.",
  },
  {
    id: "focusComplete",
    label: "Focus session finished",
    description: "When you finish the last task of a focus session.",
  },
  {
    id: "breakReminder",
    label: "Break reminder",
    description: "After a long unbroken stretch in focus mode.",
  },
  {
    id: "timerComplete",
    label: "Timer reached the estimate",
    description: "When a task passes its planned minutes. Informational, not a deadline.",
  },
  {
    id: "recovery",
    label: "Recovery mode",
    description: "When you fall far enough behind that the plan should compress.",
  },
  {
    id: "review",
    label: "Review due",
    description: "Weekly, monthly and quarterly reviews.",
  },
  {
    id: "milestone",
    label: "Progress milestones",
    description: "Day completed, phase finished, streak milestones.",
  },
];

export interface NotificationPrefs {
  /** Master switch for browser notifications. */
  enabled: boolean;
  /** Master switch for sound. Off by default — never surprise the user with audio. */
  sound: boolean;
  /** 0-1. */
  volume: number;
  categories: Record<NotificationCategory, boolean>;
  /** HH:MM local time for the daily mission reminder. */
  dailyReminderTime: string;
  /** Minutes of unbroken focus before a break is suggested. */
  breakAfterMinutes: number;
}

export const defaultNotificationPrefs: NotificationPrefs = {
  enabled: false,
  sound: false,
  volume: 0.4,
  categories: {
    dailyMission: true,
    taskComplete: false,
    focusComplete: true,
    breakReminder: true,
    timerComplete: true,
    recovery: true,
    review: true,
    milestone: true,
  },
  dailyReminderTime: "19:30",
  breakAfterMinutes: 50,
};

export function normalizePrefs(input: unknown): NotificationPrefs {
  if (!input || typeof input !== "object") return { ...defaultNotificationPrefs };
  const p = input as Partial<NotificationPrefs>;
  const volume =
    typeof p.volume === "number" && Number.isFinite(p.volume)
      ? Math.min(1, Math.max(0, p.volume))
      : defaultNotificationPrefs.volume;

  return {
    enabled: typeof p.enabled === "boolean" ? p.enabled : false,
    sound: typeof p.sound === "boolean" ? p.sound : false,
    volume,
    categories: {
      ...defaultNotificationPrefs.categories,
      ...(p.categories && typeof p.categories === "object" ? p.categories : {}),
    },
    dailyReminderTime:
      typeof p.dailyReminderTime === "string" && /^\d{2}:\d{2}$/.test(p.dailyReminderTime)
        ? p.dailyReminderTime
        : defaultNotificationPrefs.dailyReminderTime,
    breakAfterMinutes:
      typeof p.breakAfterMinutes === "number" && p.breakAfterMinutes > 0
        ? Math.min(180, p.breakAfterMinutes)
        : defaultNotificationPrefs.breakAfterMinutes,
  };
}

/** A notification fires only if the master switch AND its category are on. */
export function shouldNotify(
  prefs: NotificationPrefs,
  category: NotificationCategory,
): boolean {
  return prefs.enabled && prefs.categories[category] === true;
}

export function shouldPlaySound(
  prefs: NotificationPrefs,
  category: NotificationCategory,
): boolean {
  return prefs.sound && prefs.categories[category] === true;
}

/** Streaks worth marking. Deliberately sparse — no daily confetti. */
export const STREAK_MILESTONES = [3, 7, 14, 30, 50, 100, 200, 365];

export function streakMilestone(streak: number): number | null {
  return STREAK_MILESTONES.includes(streak) ? streak : null;
}

export type ReviewKind = "weekly" | "monthly" | "quarterly";

const REVIEW_INTERVAL_DAYS: Record<ReviewKind, number> = {
  weekly: 7,
  monthly: 28,
  quarterly: 90,
};

const DAY_MS = 86_400_000;

/**
 * Which reviews are due, given when each kind was last written.
 *
 * A review is due when the interval has elapsed since the last one of that
 * kind, or since the start date if none was ever written. Gentle, not nagging:
 * being overdue is reported once, not escalated.
 */
export function dueReviews(
  lastByKind: Partial<Record<ReviewKind, string>>,
  startDate: string,
  now: Date,
): ReviewKind[] {
  const due: ReviewKind[] = [];
  const startMs = new Date(`${startDate}T00:00:00`).getTime();
  if (Number.isNaN(startMs)) return due;

  for (const kind of ["weekly", "monthly", "quarterly"] as ReviewKind[]) {
    const last = lastByKind[kind];
    const lastMs = last ? new Date(last).getTime() : startMs;
    if (Number.isNaN(lastMs)) continue;
    const elapsedDays = (now.getTime() - lastMs) / DAY_MS;
    if (elapsedDays >= REVIEW_INTERVAL_DAYS[kind]) due.push(kind);
  }
  return due;
}

/** True once an unbroken focus stretch passes the configured break threshold. */
export function breakDue(
  focusSeconds: number,
  prefs: NotificationPrefs,
): boolean {
  return focusSeconds >= prefs.breakAfterMinutes * 60;
}

/**
 * Is it time for the daily reminder?
 *
 * Fires only while the app is open, only after the configured time, and at
 * most once per calendar day. Background delivery would need a service worker
 * and push infrastructure, which does not exist here and is not pretended.
 */
export function dailyReminderDue(
  prefs: NotificationPrefs,
  lastSentDateKey: string | undefined,
  now: Date,
  todayKey: string,
): boolean {
  if (!shouldNotify(prefs, "dailyMission")) return false;
  if (lastSentDateKey === todayKey) return false;

  const [h, m] = prefs.dailyReminderTime.split(":").map(Number);
  if (!Number.isFinite(h) || !Number.isFinite(m)) return false;

  const minutesNow = now.getHours() * 60 + now.getMinutes();
  return minutesNow >= h * 60 + m;
}

/** mm:ss for the focus timer. Hours appear only once they are needed. */
export function formatDuration(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(s / 3600);
  const minutes = Math.floor((s % 3600) / 60);
  const seconds = s % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return hours > 0
    ? `${hours}:${pad(minutes)}:${pad(seconds)}`
    : `${pad(minutes)}:${pad(seconds)}`;
}
