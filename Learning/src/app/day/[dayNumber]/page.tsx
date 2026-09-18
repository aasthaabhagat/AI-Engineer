"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { dayByNumber, days } from "@/data";
import { DayDetail } from "@/components/DayDetail";
import { Card } from "@/components/ui";

export default function DayPage({
  params,
}: {
  params: Promise<{ dayNumber: string }>;
}) {
  const { dayNumber } = use(params);
  const n = Number(dayNumber);
  const day = dayByNumber.get(n);

  if (!day) {
    return (
      <Card>
        <div className="px-5 py-12 text-center">
          <p className="text-sm font-medium">Day {dayNumber} is not authored yet.</p>
          <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-muted">
            Days exist for phases 1 and 2. Later phases are outlined on the
            roadmap and get written as you approach them.
          </p>
          <Link href="/roadmap" className="mt-4 inline-block text-sm text-accent hover:underline">
            Open the roadmap →
          </Link>
        </div>
      </Card>
    );
  }

  const prev = days.find((d) => d.dayNumber === n - 1);
  const next = days.find((d) => d.dayNumber === n + 1);

  return (
    <div className="space-y-8">
      <DayDetail day={day} />

      <nav className="flex items-center justify-between border-t border-line-soft pt-5 text-sm">
        {prev ? (
          <Link
            href={`/day/${prev.dayNumber}`}
            className="inline-flex items-center gap-2 text-muted transition hover:text-ink"
          >
            <ArrowLeft size={14} /> Day {prev.dayNumber}
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link
            href={`/day/${next.dayNumber}`}
            className="inline-flex items-center gap-2 text-muted transition hover:text-ink"
          >
            Day {next.dayNumber} <ArrowRight size={14} />
          </Link>
        )}
      </nav>
    </div>
  );
}
