"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { authoredThrough, days } from "@/data";
import { useStore } from "@/lib/store";
import { currentDay } from "@/lib/progress";
import { DayDetail } from "@/components/DayDetail";
import { Card } from "@/components/ui";

function TodayContent() {
  const { state, hydrated } = useStore();
  const params = useSearchParams();
  const day = currentDay(days, state);

  if (!hydrated) {
    return <div className="py-24 text-center text-sm text-muted">Loading…</div>;
  }

  if (!day) {
    return (
      <Card>
        <div className="px-5 py-12 text-center">
          <p className="text-sm font-medium">
            Nothing scheduled — you have completed all {authoredThrough} authored days.
          </p>
          <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-muted">
            The next phase gets authored when you reach it, so it can reflect
            what you have actually built. Run a capability audit first.
          </p>
          <Link
            href="/reviews"
            className="mt-4 inline-block text-sm text-accent hover:underline"
          >
            Go to reviews →
          </Link>
        </div>
      </Card>
    );
  }

  return <DayDetail day={day} focusOnLoad={params.get("focus") === "1"} />;
}

export default function TodayPage() {
  return (
    <Suspense
      fallback={<div className="py-24 text-center text-sm text-muted">Loading…</div>}
    >
      <TodayContent />
    </Suspense>
  );
}
