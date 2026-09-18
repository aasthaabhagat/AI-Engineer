"use client";

import { PortfolioSection } from "@/sections/Portfolio";
import { CareerSection } from "@/sections/Career";

/**
 * Portfolio and career readiness answer the same question from two sides —
 * what can you show, and what will you be asked about it — so they share a
 * page rather than competing for attention as two separate destinations.
 */
export default function ReadinessPage() {
  return (
    <div className="space-y-16">
      <PortfolioSection />
      <CareerSection />
    </div>
  );
}
