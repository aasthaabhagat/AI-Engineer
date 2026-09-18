import type { Capability, Maturity, Skill } from "@/data/types";
import { MATURITY_ORDER } from "@/data/types";

/**
 * Maturity is derived from evidence, never self-declared.
 *
 * Zero evidence is "not-started"; all evidence is "strong". In between, the
 * completed fraction maps onto the ladder. This is why the evidence lists are
 * ordered from first contact to production use: you cannot reach "engineering"
 * on RAG by ticking three easy boxes, because the hard rungs are still there.
 */
export function skillMaturity(
  skill: Skill,
  evidence: Record<string, string>,
): Maturity {
  const total = skill.evidence.length;
  if (total === 0) return "not-started";

  const done = skill.evidence.filter((e) => evidence[e.id]).length;
  if (done === 0) return "not-started";
  if (done === total) return "strong";

  // Ladder positions 1..6 between "not-started" (0) and "strong" (7).
  const ratio = done / total;
  const index = Math.max(1, Math.min(6, Math.ceil(ratio * 6)));
  return MATURITY_ORDER[index];
}

export function skillEvidenceCount(
  skill: Skill,
  evidence: Record<string, string>,
): { done: number; total: number } {
  return {
    done: skill.evidence.filter((e) => evidence[e.id]).length,
    total: skill.evidence.length,
  };
}

/** Evidence the skill still needs, in ladder order — the "what's missing" list. */
export function missingEvidence(skill: Skill, evidence: Record<string, string>) {
  return skill.evidence.filter((e) => !evidence[e.id]);
}

export type CapabilityLevel =
  | "not-ready"
  | "learning"
  | "can-build-basic"
  | "can-build-production";

export const CAPABILITY_LABEL: Record<CapabilityLevel, string> = {
  "not-ready": "Not ready",
  learning: "Learning",
  "can-build-basic": "Can build basic",
  "can-build-production": "Can build production-oriented",
};

const MATURITY_SCORE: Record<Maturity, number> = {
  "not-started": 0,
  awareness: 1,
  understanding: 2,
  practicing: 3,
  implementing: 4,
  applied: 5,
  engineering: 6,
  strong: 7,
};

export interface CapabilityAssessment {
  capability: Capability;
  level: CapabilityLevel;
  /** Average maturity score across required skills, 0-7. */
  score: number;
  /** Required skills that are the weakest link, worst first. */
  gaps: { skillId: string; maturity: Maturity }[];
}

/**
 * A capability is limited by its weakest requirement, not its average — a RAG
 * system with no evaluation is not a production RAG system however good the
 * retrieval is.
 */
export function assessCapability(
  capability: Capability,
  skillsById: Map<string, Skill>,
  evidence: Record<string, string>,
): CapabilityAssessment {
  const entries = capability.requires
    .map((id) => skillsById.get(id))
    .filter((s): s is Skill => Boolean(s))
    .map((s) => ({ skillId: s.id, maturity: skillMaturity(s, evidence) }));

  if (entries.length === 0) {
    return { capability, level: "not-ready", score: 0, gaps: [] };
  }

  const scores = entries.map((e) => MATURITY_SCORE[e.maturity]);
  const average = scores.reduce((a, b) => a + b, 0) / scores.length;
  const weakest = Math.min(...scores);

  let level: CapabilityLevel = "not-ready";
  if (weakest >= 5 && average >= 5.5) level = "can-build-production";
  else if (weakest >= 3 && average >= 4) level = "can-build-basic";
  else if (average >= 1.5) level = "learning";

  const gaps = [...entries]
    .sort((a, b) => MATURITY_SCORE[a.maturity] - MATURITY_SCORE[b.maturity])
    .filter((e) => MATURITY_SCORE[e.maturity] < 5);

  return { capability, level, score: average, gaps };
}

/** Skills with the largest gap between importance and evidence — what to do next. */
export function portfolioGaps(
  skills: Skill[],
  evidence: Record<string, string>,
  limit = 6,
) {
  const TIER_WEIGHT = { core: 3, important: 2, supporting: 1, awareness: 0.5 };
  return skills
    .map((skill) => {
      const maturity = skillMaturity(skill, evidence);
      const deficit = (7 - MATURITY_SCORE[maturity]) * TIER_WEIGHT[skill.tier];
      return { skill, maturity, deficit };
    })
    .sort((a, b) => b.deficit - a.deficit)
    .slice(0, limit);
}
