import { describe, expect, it } from "vitest";
import type { Capability, Skill } from "@/data/types";
import {
  assessCapability,
  missingEvidence,
  portfolioGaps,
  skillMaturity,
} from "@/lib/maturity";
import { skills } from "@/data/skills";
import { days } from "@/data";
import { capabilities } from "@/data/blueprints";

const makeSkill = (id: string, evidenceCount: number, tier: Skill["tier"] = "core"): Skill => ({
  id,
  name: id,
  category: "Test",
  track: "ai",
  tier,
  summary: "",
  whyItExists: "",
  evidence: Array.from({ length: evidenceCount }, (_, i) => ({
    id: `${id}-e${i + 1}`,
    label: `rung ${i + 1}`,
  })),
  relatedProjects: [],
});

const ticks = (ids: string[]) =>
  Object.fromEntries(ids.map((id) => [id, "2026-01-01T00:00:00.000Z"]));

describe("skillMaturity", () => {
  const skill = makeSkill("s", 8);

  it("is not-started with no evidence", () => {
    expect(skillMaturity(skill, {})).toBe("not-started");
  });

  it("is strong only when every rung is ticked", () => {
    const all = skill.evidence.map((e) => e.id);
    expect(skillMaturity(skill, ticks(all))).toBe("strong");
    expect(skillMaturity(skill, ticks(all.slice(0, 7)))).not.toBe("strong");
  });

  it("climbs monotonically as evidence accumulates", () => {
    const order = [
      "not-started",
      "awareness",
      "understanding",
      "practicing",
      "implementing",
      "applied",
      "engineering",
      "strong",
    ];
    let previous = -1;
    for (let i = 0; i <= skill.evidence.length; i++) {
      const m = skillMaturity(skill, ticks(skill.evidence.slice(0, i).map((e) => e.id)));
      const rank = order.indexOf(m);
      expect(rank).toBeGreaterThanOrEqual(previous);
      previous = rank;
    }
  });

  it("cannot be claimed without evidence — a single tick is not engineering", () => {
    const one = ticks([skill.evidence[0].id]);
    expect(["awareness", "understanding"]).toContain(skillMaturity(skill, one));
  });

  it("handles a skill with no evidence defined", () => {
    expect(skillMaturity(makeSkill("empty", 0), {})).toBe("not-started");
  });
});

describe("missingEvidence", () => {
  it("returns unticked rungs in ladder order", () => {
    const skill = makeSkill("s", 4);
    const evidence = ticks(["s-e1", "s-e3"]);
    expect(missingEvidence(skill, evidence).map((e) => e.id)).toEqual([
      "s-e2",
      "s-e4",
    ]);
  });
});

describe("assessCapability", () => {
  const a = makeSkill("a", 4);
  const b = makeSkill("b", 4);
  const map = new Map([
    ["a", a],
    ["b", b],
  ]);
  const cap: Capability = { id: "c", question: "Can I?", requires: ["a", "b"] };

  it("is not-ready with no evidence", () => {
    expect(assessCapability(cap, map, {}).level).toBe("not-ready");
  });

  it("is limited by the weakest requirement, not the average", () => {
    // One skill fully evidenced, the other untouched.
    const lopsided = assessCapability(cap, map, ticks(a.evidence.map((e) => e.id)));
    expect(lopsided.level).not.toBe("can-build-production");
    expect(lopsided.gaps[0].skillId).toBe("b");
  });

  it("reaches production level only when both are strong", () => {
    const all = ticks([...a.evidence, ...b.evidence].map((e) => e.id));
    expect(assessCapability(cap, map, all).level).toBe("can-build-production");
  });

  it("tolerates requirements that reference a missing skill", () => {
    const broken: Capability = { id: "x", question: "?", requires: ["nope"] };
    expect(assessCapability(broken, map, {}).level).toBe("not-ready");
  });
});

describe("portfolioGaps", () => {
  it("ranks a neglected core skill above a neglected awareness skill", () => {
    const core = makeSkill("core-skill", 4, "core");
    const minor = makeSkill("minor-skill", 4, "awareness");
    const result = portfolioGaps([minor, core], {}, 2);
    expect(result[0].skill.id).toBe("core-skill");
  });
});

describe("curriculum data integrity", () => {
  it("every evidence id referenced by a day exists on a skill", () => {
    const known = new Set(skills.flatMap((s) => s.evidence.map((e) => e.id)));
    const referenced = days.flatMap((d) => d.evidence ?? []);
    const unknown = referenced.filter((id) => !known.has(id));
    expect(unknown).toEqual([]);
  });

  it("every skill id referenced by a day exists", () => {
    const known = new Set(skills.map((s) => s.id));
    const unknown = days.flatMap((d) => d.skills).filter((id) => !known.has(id));
    expect(unknown).toEqual([]);
  });

  it("every capability requirement names a real skill", () => {
    const known = new Set(skills.map((s) => s.id));
    const unknown = capabilities
      .flatMap((c) => c.requires)
      .filter((id) => !known.has(id));
    expect(unknown).toEqual([]);
  });

  it("day numbers are unique and contiguous from 1", () => {
    const numbers = days.map((d) => d.dayNumber);
    expect(new Set(numbers).size).toBe(numbers.length);
    numbers.forEach((n, i) => expect(n).toBe(i + 1));
  });

  it("task ids are unique across the whole curriculum", () => {
    const ids = days.flatMap((d) => d.tasks.map((t) => t.id));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every day has at least one essential task and a definition of done", () => {
    for (const d of days) {
      expect(d.tasks.some((t) => t.priority === "essential")).toBe(true);
      expect(d.definitionOfDone.length).toBeGreaterThan(0);
    }
  });
});
