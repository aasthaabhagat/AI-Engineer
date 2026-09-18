# AI Engineer Training OS

A personal training system for a one-year transition into AI engineering. It
answers one question every evening: **what exactly should I do today?**

It is not a roadmap website. Each day is a mission with an objective, tasks
scoped to the time actually available, a definition of done, a git task, and
explicit paths into the projects elsewhere in this repository.

## Run it

```bash
cd Learning
npm install
npm run dev      # http://localhost:3000
npm test         # logic tests
npm run build    # production build
```

Requires Node.js 20+.

## How it works

**Days drive everything.** A day names the objective, why it matters, the career
connection, and tasks tagged `essential` / `important` / `optional`. On a
90-minute evening the essentials still fit; the rest defers. Finishing the
essentials is what makes a day count.

**Maturity is derived, never declared.** You cannot mark yourself "Engineering"
at RAG. Each skill has an ordered evidence ladder, and maturity is computed from
which rungs are ticked. The hard rungs — evaluation, deployment, observability —
sit at the top, so the ladder cannot be climbed cheaply.

**Capabilities are limited by their weakest requirement.** "Can I build a
production RAG system?" is answered by the weakest of its ten required skills,
not the average. A RAG system without retrieval evaluation is not a production
RAG system however good the retrieval feels.

**Missing days are not a debt.** Three or more days behind schedule triggers
recovery mode: essentials only until the rhythm returns. The backlog is
compressed, never accumulated.

**Nothing is faked.** There is no GitHub sync, no AI mentor, no cloud sync — and
the app says so on the Settings page rather than showing a plausible-looking
number. Those arrive when there is a backend to support them, in phases 11-14.

## Structure

```text
src/
├── data/            Curriculum as plain data — never hard-coded in components
│   ├── types.ts     Domain model
│   ├── phases.ts    24 phases, modules, outcomes, dependencies
│   ├── skills.ts    Skill graph with evidence ladders
│   ├── projects.ts  Projects with milestones and quality gates
│   ├── blueprints.ts Architecture references and capability checks
│   └── days/        Day-by-day missions (phases 1-2)
├── lib/             Pure logic: progress, maturity, persistence
├── components/      UI primitives, mission views, focus mode
└── app/             Routes
```

## Authored vs outlined

Phases 1 and 2 (days 1-46) have full day-by-day missions, grounded in the actual
state of `01-Python-Foundations/projects/expense-tracker` — including its real
defects.

Phases 3-24 have modules, outcomes, skills, dependencies and milestones, but no
daily missions yet. That is deliberate. Writing month nine in month one would
lock in assumptions about pace and about code that does not exist. Author each
phase as you reach it, following the shape in `src/data/days/`.

## Persistence

State lives in `localStorage` under `ai-engineer-training-os`. Corrupt or partial
data falls back to defaults rather than crashing — the same rule the Expense
Tracker learns on day 5. Export a JSON backup from Settings before clearing site
data.

The persistence layer is deliberately isolated in `src/lib/state.ts` and
`src/lib/store.tsx` so that swapping it for a FastAPI backend and PostgreSQL in
phase 14 touches those two files, not the pages.

## Adding the next phase

1. Create `src/data/days/<phase-name>.ts` exporting a `Day[]`.
2. Import and spread it in `src/data/index.ts`.
3. Flip that phase's `authoring` to `"detailed"` in `src/data/phases.ts`.
4. Run `npm test` — the integrity tests check that every skill and evidence id a
   day references actually exists, that day numbers stay contiguous, and that
   every day has at least one essential task.
