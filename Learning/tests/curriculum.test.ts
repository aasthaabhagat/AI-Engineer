import { describe, expect, it } from "vitest";
import { days, phases } from "@/data";
import { weeks, weekForDay, weeksForPhase } from "@/data/weeks";
import { blueprints, capabilities } from "@/data/blueprints";
import { designBriefs } from "@/data/systemDesigns";
import { careerAreas } from "@/data/career";
import { radarEntries } from "@/data/radar";
import { skills } from "@/data/skills";
import { projects } from "@/data/projects";

const skillIds = new Set(skills.map((s) => s.id));
const blueprintIds = new Set(blueprints.map((b) => b.id));
const projectIds = new Set(projects.map((p) => p.id));

describe("weeks", () => {
  it("covers every authored day exactly once", () => {
    const covered = weeks.flatMap((w) => w.days);
    expect(new Set(covered).size).toBe(covered.length);
    expect([...covered].sort((a, b) => a - b)).toEqual(
      days.map((d) => d.dayNumber),
    );
  });

  it("maps every day to a week", () => {
    for (const day of days) {
      expect(weekForDay(day.dayNumber), `day ${day.dayNumber}`).toBeDefined();
    }
  });

  it("does not span phases within a week", () => {
    for (const week of weeks) {
      const phaseIds = new Set(
        week.days.map((n) => days.find((d) => d.dayNumber === n)?.phaseId),
      );
      expect(phaseIds.size, `week ${week.number}`).toBe(1);
      expect([...phaseIds][0]).toBe(week.phaseId);
    }
  });

  it("numbers weeks contiguously from 1", () => {
    expect(weeks.map((w) => w.number)).toEqual(
      weeks.map((_, i) => i + 1),
    );
  });

  it("attaches weeks only to phases that have authored days", () => {
    for (const phase of phases) {
      const hasDays = days.some((d) => d.phaseId === phase.id);
      const hasWeeks = weeksForPhase(phase.id).length > 0;
      expect(hasWeeks, `phase ${phase.id}`).toBe(hasDays);
    }
  });

  it("gives every week a stated outcome", () => {
    for (const week of weeks) {
      expect(week.outcome.length).toBeGreaterThan(20);
    }
  });
});

describe("phase integrity", () => {
  it("marks a phase detailed only when it actually has days", () => {
    for (const phase of phases) {
      const hasDays = days.some((d) => d.phaseId === phase.id);
      expect(phase.authoring === "detailed", `phase ${phase.id}`).toBe(hasDays);
    }
  });

  it("references only real phases in dependsOn", () => {
    const ids = new Set(phases.map((p) => p.id));
    for (const phase of phases) {
      for (const dep of phase.dependsOn) {
        expect(ids.has(dep), `${phase.id} -> ${dep}`).toBe(true);
      }
    }
  });

  it("has no dependency cycles", () => {
    const byId = new Map(phases.map((p) => [p.id, p]));
    const state = new Map<string, "visiting" | "done">();

    const visit = (id: string, trail: string[]): void => {
      if (state.get(id) === "done") return;
      expect(state.get(id), `cycle: ${[...trail, id].join(" -> ")}`).not.toBe(
        "visiting",
      );
      state.set(id, "visiting");
      for (const dep of byId.get(id)?.dependsOn ?? []) {
        visit(dep, [...trail, id]);
      }
      state.set(id, "done");
    };

    for (const phase of phases) visit(phase.id, []);
  });

  it("orders phases 1..24 without gaps", () => {
    expect(phases.map((p) => p.order)).toEqual(
      phases.map((_, i) => i + 1),
    );
  });

  it("references only real skills from modules", () => {
    for (const phase of phases) {
      for (const mod of phase.modules) {
        for (const id of mod.skills) {
          expect(skillIds.has(id), `${mod.id} -> ${id}`).toBe(true);
        }
      }
    }
  });
});

describe("blueprints", () => {
  it("covers every pattern the operating instructions require", () => {
    const required = [
      "bp-rag",
      "bp-agent",
      "bp-copilot",
      "bp-ai-search",
      "bp-doc-intelligence",
      "bp-workflow",
      "bp-multi-agent",
      "bp-ai-saas",
      "bp-ai-service",
      "bp-classification",
    ];
    for (const id of required) {
      expect(blueprintIds.has(id), `missing blueprint ${id}`).toBe(true);
    }
  });

  it("states failure points and when not to use each pattern", () => {
    for (const bp of blueprints) {
      expect(bp.failurePoints.length, bp.id).toBeGreaterThan(0);
      expect(bp.whenNotToUse.length, bp.id).toBeGreaterThan(20);
      expect(bp.evaluation.length, bp.id).toBeGreaterThan(0);
    }
  });

  it("uses unique ids", () => {
    expect(blueprintIds.size).toBe(blueprints.length);
  });
});

describe("system design briefs", () => {
  it("reference only real blueprints and skills", () => {
    for (const brief of designBriefs) {
      for (const id of brief.relatedBlueprints) {
        expect(blueprintIds.has(id), `${brief.id} -> ${id}`).toBe(true);
      }
      for (const id of brief.relatedSkills) {
        expect(skillIds.has(id), `${brief.id} -> ${id}`).toBe(true);
      }
    }
  });

  it("each state failure modes, evaluation and cost drivers", () => {
    for (const brief of designBriefs) {
      expect(brief.failureModes.length, brief.id).toBeGreaterThan(0);
      expect(brief.evaluation.length, brief.id).toBeGreaterThan(0);
      expect(brief.costDrivers.length, brief.id).toBeGreaterThan(0);
      expect(brief.keyDecisions.length, brief.id).toBeGreaterThan(0);
    }
  });
});

describe("career areas", () => {
  it("reference only real skills", () => {
    for (const area of careerAreas) {
      for (const id of area.skills) {
        expect(skillIds.has(id), `${area.id} -> ${id}`).toBe(true);
      }
      expect(area.skills.length, area.id).toBeGreaterThan(0);
    }
  });

  it("cover every core skill somewhere", () => {
    const covered = new Set(careerAreas.flatMap((a) => a.skills));
    const uncoveredCore = skills
      .filter((s) => s.tier === "core" && !covered.has(s.id))
      .map((s) => s.id);
    expect(uncoveredCore).toEqual([]);
  });
});

describe("radar", () => {
  it("references only real skills", () => {
    for (const entry of radarEntries) {
      for (const id of entry.relatedSkills) {
        expect(skillIds.has(id), `${entry.id} -> ${id}`).toBe(true);
      }
    }
  });

  it("gives every entry evaluation questions and a trap", () => {
    for (const entry of radarEntries) {
      expect(entry.evaluateBy.length, entry.id).toBeGreaterThan(1);
      expect(entry.trap.length, entry.id).toBeGreaterThan(20);
    }
  });
});

describe("capabilities and projects", () => {
  it("capability requirements name real skills", () => {
    for (const cap of capabilities) {
      for (const id of cap.requires) {
        expect(skillIds.has(id), `${cap.id} -> ${id}`).toBe(true);
      }
    }
  });

  it("projects reference real skills, and days reference real projects", () => {
    for (const project of projects) {
      for (const id of project.skills) {
        expect(skillIds.has(id), `${project.id} -> ${id}`).toBe(true);
      }
    }
    for (const day of days) {
      if (day.projectId) {
        expect(projectIds.has(day.projectId), `${day.id} -> ${day.projectId}`).toBe(
          true,
        );
      }
    }
  });

  it("skills referencing a project use a real project id", () => {
    for (const skill of skills) {
      for (const id of skill.relatedProjects) {
        expect(projectIds.has(id), `${skill.id} -> ${id}`).toBe(true);
      }
    }
  });
});
