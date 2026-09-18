import type { Track } from "./types";

/**
 * The week layer: Year → Phase → Module → WEEK → Day.
 *
 * A week is the unit at which you can actually feel progress. Days are too
 * granular to judge and phases take months. Each week names a theme, the days
 * it contains and the one thing that should be true at the end of it.
 *
 * Weeks exist only for authored days. Outlined phases get weeks when they get
 * days — inventing them earlier would be guessing at a pace that has not
 * happened yet.
 */
export interface Week {
  id: string;
  number: number;
  phaseId: string;
  title: string;
  theme: string;
  /** Day numbers in this week, in order. */
  days: number[];
  /** The single thing that should be true by Sunday. */
  outcome: string;
  track: Track;
}

export const weeks: Week[] = [
  {
    id: "w01",
    number: 1,
    phaseId: "p01-python",
    title: "Files, structure and an honest audit",
    theme:
      "Persistence, module boundaries, and finding what your own refactor broke.",
    days: [1, 2, 3, 4, 5, 6],
    outcome:
      "The Expense Tracker saves without risking data loss, validates its input, and you have written down the defects you found in your own code.",
    track: "software",
  },
  {
    id: "w02",
    number: 2,
    phaseId: "p01-python",
    title: "Types, errors and the first tests",
    theme:
      "Making the shape of data explicit, then proving behaviour automatically.",
    days: [7, 8, 9, 10, 11, 12],
    outcome:
      "A typed domain model, domain exceptions, and a pytest suite that covers edge cases and runs against a temp directory rather than your real data.",
    track: "software",
  },
  {
    id: "w03",
    number: 3,
    phaseId: "p01-python",
    title: "Interface, logging and configuration",
    theme:
      "Turning a script into something scriptable, observable and deployable.",
    days: [13, 14, 15, 16, 17, 18],
    outcome:
      "A CLI with subcommands and exit codes, real logging instead of prints, config from the environment, and a retry decorator you will reuse on LLM calls in phase 11.",
    track: "software",
  },
  {
    id: "w04",
    number: 4,
    phaseId: "p01-python",
    title: "The standard library and the network",
    theme:
      "Collections, dates, a second data format, and the first unreliable dependency.",
    days: [19, 20, 21, 22, 23, 24],
    outcome:
      "CSV import/export sharing one validation path, and an HTTP client with a timeout, retries and a cache — the exact shape of every model call you will write later.",
    track: "software",
  },
  {
    id: "w05",
    number: 5,
    phaseId: "p01-python",
    title: "Objects, packaging and tooling",
    theme: "Structure that survives a database swap, and automated quality gates.",
    days: [25, 26, 27, 28, 29, 30],
    outcome:
      "An installable package with pluggable storage backends, passing a type checker and a linter, with a profiled bottleneck fixed and measured.",
    track: "software",
  },
  {
    id: "w06",
    number: 6,
    phaseId: "p01-python",
    title: "Document, clean up, release",
    theme: "Finishing properly — the part most people skip.",
    days: [31, 32, 33, 34],
    outcome:
      "Expense Tracker v1.0.0 tagged, documented and defensible out loud, with dead code deleted and the phase audited honestly.",
    track: "software",
  },
  {
    id: "w07",
    number: 7,
    phaseId: "p02-git",
    title: "The Git model and branching",
    theme: "What a commit really is, how to undo safely, and working on a branch.",
    days: [35, 36, 37, 38, 39, 40],
    outcome:
      "A feature built entirely on a branch, a conflict resolved deliberately rather than by picking a side, and a commit you deleted and recovered without panic.",
    track: "software",
  },
  {
    id: "w08",
    number: 8,
    phaseId: "p02-git",
    title: "Review, releases and your first pipeline",
    theme:
      "Production engineering starts here, on day 44 — not in month eleven.",
    days: [41, 42, 43, 44, 45, 46],
    outcome:
      "GitHub Actions running tests, lint and type checks on every push, a tagged release with notes, and a feature shipped issue → branch → PR → green CI → merge.",
    track: "production",
  },
];

export const weekByNumber = new Map(weeks.map((w) => [w.number, w]));

/** Which week a day belongs to, if any. */
export function weekForDay(dayNumber: number): Week | undefined {
  return weeks.find((w) => w.days.includes(dayNumber));
}

export function weeksForPhase(phaseId: string): Week[] {
  return weeks.filter((w) => w.phaseId === phaseId);
}
