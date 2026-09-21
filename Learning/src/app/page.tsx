"use client";

import Link from "next/link";
import { authoredThrough, days } from "@/data";
import { useStore } from "@/lib/store";
import { currentDay } from "@/lib/progress";
import { DayDetail } from "@/components/DayDetail";
import { Card } from "@/components/ui";

/** Today: the first day not yet completed, and its tasks. */
export default function TodayPage() {
  const { state, hydrated } = useStore();
  const day = currentDay(days, state);

  // Progress lives in localStorage, so the server cannot know which day is next.
  if (!hydrated) {
    return <div className="py-24 text-center text-sm text-muted">Loading…</div>;
  }

  if (!day) {
    return (
      <Card>
        <div className="px-5 py-12 text-center">
          <p className="text-sm font-medium">
            You have completed all {authoredThrough} days written so far.
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">
            Daily tasks for the next phase get written when you reach it, so
            they can reflect what you have actually built.
          </p>
          <Link href="/topics" className="mt-4 inline-block text-sm text-accent hover:underline">
            See the topics ahead →
          </Link>
        </div>
      </Card>
    );
  }

  return <DayDetail day={day} />;
}
