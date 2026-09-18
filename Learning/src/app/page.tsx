"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { authoredThrough, days } from "@/data";
import { useStore } from "@/lib/store";
import {
  currentDay,
  currentStreak,
  overallProgress,
  scheduleStatus,
} from "@/lib/progress";
import { DayDetail } from "@/components/DayDetail";

/**
 * Today.
 *
 * This used to be two pages — a dashboard that summarised the mission and a
 * Today page that showed it. They said the same thing twice, so there is now
 * one screen: the mission, with a thin strip of context above it.
 */
function TodayContent() {
  const { state, hydrated } = useStore();
  const params = useSearchParams();

  const day = currentDay(days, state);
  const streak = currentStreak(state);
  const overall = overallProgress(days, state);
  const status = scheduleStatus(days, state);

  if (!hydrated) {
    // Progress lives in localStorage, so the server cannot know it.
    return (
      <div className="py-24 text-center text-sm text-muted">
        Loading your progress…
      </div>
    );
  }

  if (!day) {
    return (
      <div className="rounded-xl border border-line bg-panel px-6 py-14 text-center">
        <p className="text-base font-medium">
          Every authored day is complete.
        </p>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
          Day {authoredThrough} was the last one. Phases 3 onward are outlined
          but not yet written day by day — deliberately, so they can match the
          pace and the code you actually have. Run a capability audit, then
          author the next phase.
        </p>
        <Link
          href="/plan/reviews"
          className="mt-5 inline-flex items-center gap-1.5 text-sm text-accent hover:underline"
        >
          Go to reviews <ArrowRight size={14} aria-hidden />
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-faint">
        {state.settings.name && (
          <span className="text-muted">Evening, {state.settings.name}.</span>
        )}
        <span className="tabular-nums">
          {overall.done} of {overall.total} days complete
        </span>
        {streak > 0 && (
          <span className="tabular-nums">
            {streak} day streak
          </span>
        )}
        {status.behind > 0 && !status.recoveryMode && (
          <span className="tabular-nums text-amber">
            {status.behind} day{status.behind === 1 ? "" : "s"} behind
          </span>
        )}
      </div>

      <DayDetail
        day={day}
        variant="today"
        focusOnLoad={params.get("focus") === "1"}
      />
    </>
  );
}

export default function TodayPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center text-sm text-muted">Loading…</div>
      }
    >
      <TodayContent />
    </Suspense>
  );
}
