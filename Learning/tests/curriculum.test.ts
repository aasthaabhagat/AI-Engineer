import { describe, expect, it } from "vitest";
import { days, moduleById, phaseById, phases } from "@/data";

describe("phase integrity", () => {
  it("orders phases 1..24 without gaps", () => {
    expect(phases).toHaveLength(24);
    expect(phases.map((p) => p.order)).toEqual(phases.map((_, i) => i + 1));
  });

  it("marks a phase detailed only when it actually has days", () => {
    for (const phase of phases) {
      const hasDays = days.some((d) => d.phaseId === phase.id);
      expect(phase.authoring === "detailed", `phase ${phase.id}`).toBe(hasDays);
    }
  });

  it("gives every phase at least one topic, and every topic its points", () => {
    for (const phase of phases) {
      expect(phase.modules.length, phase.id).toBeGreaterThan(0);
      for (const mod of phase.modules) {
        expect(mod.phaseId, mod.id).toBe(phase.id);
        expect(mod.outcomes.length, mod.id).toBeGreaterThan(0);
      }
    }
  });

  it("uses unique phase and module ids", () => {
    const moduleIds = phases.flatMap((p) => p.modules.map((m) => m.id));
    expect(new Set(phases.map((p) => p.id)).size).toBe(phases.length);
    expect(new Set(moduleIds).size).toBe(moduleIds.length);
  });
});

describe("day integrity", () => {
  it("numbers days contiguously from 1", () => {
    expect(days.map((d) => d.dayNumber)).toEqual(days.map((_, i) => i + 1));
  });

  it("references real phases and a module inside that phase", () => {
    for (const day of days) {
      expect(phaseById.has(day.phaseId), day.id).toBe(true);
      expect(moduleById.get(day.moduleId)?.phaseId, day.id).toBe(day.phaseId);
    }
  });

  it("gives every day at least one essential task", () => {
    for (const day of days) {
      expect(
        day.tasks.some((t) => t.priority === "essential"),
        day.id,
      ).toBe(true);
    }
  });

  it("uses unique task ids across the whole curriculum", () => {
    const ids = days.flatMap((d) => d.tasks.map((t) => t.id));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("gives every task a positive time estimate", () => {
    for (const task of days.flatMap((d) => d.tasks)) {
      expect(task.minutes, task.id).toBeGreaterThan(0);
    }
  });
});
