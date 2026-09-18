"use client";

import { useEffect, useRef } from "react";
import { days } from "@/data";
import { useStore } from "@/lib/store";
import { currentDay, currentStreak, dateKey, scheduleStatus } from "@/lib/progress";
import {
  dailyReminderDue,
  dueReviews,
  streakMilestone,
  type ReviewKind,
} from "@/lib/notifications";
import { useCue } from "@/lib/useCue";

const CHECK_INTERVAL_MS = 60_000;

/**
 * Time-based cues: the daily reminder, recovery mode, review due dates and
 * streak milestones.
 *
 * Deliberate limitation: these only fire while the app is open in a tab.
 * Background delivery needs a service worker and push infrastructure, neither
 * of which exists here — so the Settings page says so plainly rather than
 * implying the app can reach you when it is closed.
 *
 * Renders nothing.
 */
export function CueRunner() {
  const { state, hydrated, recordCue } = useStore();
  const cue = useCue();
  // Milestones already fired this session, so a re-render cannot repeat them.
  const firedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!hydrated) return;

    const check = () => {
      const now = new Date();
      const todayKey = dateKey(now);

      // 1. Daily mission reminder, at most once per day, after the set time.
      if (dailyReminderDue(state.notifications, state.cues.dailyReminder, now, todayKey)) {
        const day = currentDay(days, state);
        if (day) {
          cue({
            category: "dailyMission",
            title: `Day ${day.dayNumber}: ${day.title}`,
            body: day.objective,
            tag: "daily-mission",
          });
          recordCue({ dailyReminder: todayKey });
        }
      }

      // 2. Recovery mode, announced once per day at most.
      const status = scheduleStatus(days, state, now);
      if (status.recoveryMode && state.cues.recoveryNotice !== todayKey) {
        cue({
          category: "recovery",
          title: "Recovery mode",
          body: `${status.behind} days behind. Essentials only until the rhythm returns.`,
          tag: "recovery",
        });
        recordCue({ recoveryNotice: todayKey });
      }

      // 3. Reviews that have come due. Daily reviews are deliberately excluded —
      // a nag every single day is how notifications get switched off for good.
      const lastByKind: Partial<Record<ReviewKind, string>> = {};
      for (const review of state.reviews) {
        if (review.kind === "daily") continue;
        if (!lastByKind[review.kind]) lastByKind[review.kind] = review.createdAt;
      }
      for (const kind of dueReviews(lastByKind, state.settings.startDate, now)) {
        const key = `review-${kind}-${todayKey}`;
        if (firedRef.current.has(key)) continue;
        firedRef.current.add(key);
        cue({
          category: "review",
          title: `${kind[0].toUpperCase()}${kind.slice(1)} review is due`,
          body:
            kind === "quarterly"
              ? "Run the capability audit — it should change what the next phase looks like."
              : "Ten honest minutes is enough.",
          tag: `review-${kind}`,
        });
      }

      // 4. Streak milestones, each announced only once ever.
      const streak = currentStreak(state, now);
      const milestone = streakMilestone(streak);
      if (milestone && (state.cues.streakMilestone ?? 0) < milestone) {
        cue({
          category: "milestone",
          title: `${milestone}-day streak`,
          body: "Consistency is the whole mechanism. Keep going.",
          tag: "streak",
        });
        recordCue({ streakMilestone: milestone });
      }
    };

    check();
    const id = window.setInterval(check, CHECK_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [hydrated, state, cue, recordCue]);

  return null;
}
