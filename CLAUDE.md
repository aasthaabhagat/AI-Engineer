# CLAUDE.md — Operating Instructions for This Repository

Persistent instructions for any Claude session working in `AI-Engineer/`.
Read this before touching anything.

---

## 1. The Goal

The repository owner is transitioning from a systems/assistant engineering role
into a strong **AI Engineer / Applied AI Engineer / AI Product Engineer /
AI-ML Software Engineer**, over roughly one year, while working full-time.

AI is the **deepest specialization**. But the target is someone who can build
complete systems, not someone who can only call an LLM API. Four tracks develop
**in parallel**, never as a waterfall:

1. **AI depth** — ML, DL, PyTorch, CV, NLP, transformers, LLM engineering,
   embeddings, RAG, vector search, reranking, tool calling, agents, memory,
   planning, evaluation, multi-agent systems.
2. **Software engineering** — Python, OOP, clean code, testing, debugging, DSA,
   async, concurrency, design patterns, TypeScript, React, Next.js, FastAPI,
   PostgreSQL, Redis, REST, auth, system design.
3. **Production / DevOps / MLOps** — Linux, Docker, Compose, GitHub Actions,
   CI/CD, cloud, logging, metrics, tracing, observability, security,
   reliability, secrets, rate limiting, retries, timeouts, fallbacks, caching,
   queues, performance, cost, deployment, rollback.
4. **AI product / portfolio / career** — AI into existing systems, AI system
   design, portfolio engineering, interview preparation.

**Never** structure this as `Python → ML → LLM → Docker`. Production
engineering and career work appear throughout, not only at the end.

---

## 2. What The Learning Website Is

`AI-Engineer/Learning/` is the owner's **personal AI Engineer Training
Operating System**. It is not a roadmap brochure. It answers one question every
evening, after a full day of work:

> **What exactly should I do today to become the engineer I want to become?**

It must tell the owner what to learn, practise, build, test, document, commit
and deploy; why it matters; and what evidence proves competency. Wherever
possible it links learning tasks to **real projects in this repository**.

Example of the intended coupling:

```
Task:       Improve Expense Tracker exception handling
Repository: 01-Python-Foundations/projects/expense-tracker/
```

The website **names** that path. It never edits that code.

---

## 3. Scope — What Claude Builds

### IN SCOPE (build, edit, run, test, fix, iterate)

- `AI-Engineer/Learning/` — everything inside it
- `AI-Engineer/CLAUDE.md` — this file
- Root-level files **only** when strictly necessary and only with the owner's
  agreement (e.g. adding a `.gitignore` entry). Prefer `Learning/.gitignore`.

### OUT OF SCOPE (read-only, never modify)

- `01-Python-Foundations/` and everything under it
- `01-Python-Foundations/projects/expense-tracker/`
- `01-Python-Foundations/projects/dot-spot-painting/`
- `01-Python-Foundations/01-file-handling/`
- Every future numbered learning folder (`02-…`, `03-…`, …)
- Any Python project, notebook or exercise anywhere in the repo

These are the owner's **actual learning work and evidence**. They may be read
for context — and the curriculum should be grounded in what they really contain,
including their real defects — but Claude must not modify, refactor, rename,
reorganize or "clean up" a single file in them. The owner does that work. That
is the point of the whole repository.

If a fix is needed in one of those projects, **describe it as a learning task**
in the Learning app, or explain it in chat. Do not apply it.

---

## 4. Git Safety Rules

- The **entire** `AI-Engineer/` directory is **ONE** git repository.
- **NEVER** run `git init` inside `Learning/` or any subdirectory.
- **NEVER** create a nested `.git` directory. Exactly one `.git` exists, at the
  repo root. Verify with `find . -name ".git" -maxdepth 4` if ever unsure.
- Before committing: run `git status` and inspect the relevant diff. Confirm
  nothing outside scope was touched.
- Local commits may be made autonomously, with clear messages, when work
  reaches a sensible checkpoint.
- **`git push` requires confirmation every time.** So does anything destructive
  (`reset --hard`, `clean -fd`, force operations, branch deletion, history
  rewriting).
- Remote: `https://github.com/aasthaabhagat/AI-Engineer.git`, branch `main`.

---

## 5. Autonomy Rules

Operate autonomously for normal, reversible development work. **Do not ask
permission for:**

- reading any file, inspecting any directory
- creating, editing or deleting files **inside `Learning/`**
- creating folders inside `Learning/`
- running tests, type checks, lint, builds
- starting and stopping the local dev server
- debugging, diagnosing, fixing, iterating
- `git status`, `git diff`, `git log`, `git add`, `git commit`

Do not stop after writing code. Run it. Fix what breaks. Iterate until it
actually works. Do not hand the owner a list of commands to run when the
terminal is available.

---

## 6. Confirmation Rules

**Ask immediately before**, then **wait**:

1. Installing Node.js, Python or any system-level software
2. Installing project dependencies or packages
3. Installing global packages
4. Changing system or environment configuration
5. Deleting important files or directories
6. Destructive git operations
7. `git push`
8. `git push --force`
9. Deployment or publication
10. Connecting or changing external accounts/services
11. Anything that could permanently destroy or overwrite existing work

Format:

```
Confirmation required.

Action:  <exact action>
Why:     <brief reason>
Command: <exact command>

Proceed?
```

After approval, **execute it yourself** and carry on with the rest of the task
without further prompting. Never tell the owner to run it manually.

---

## 7. Dependency Rules

Before proposing any package:

1. Check `Learning/package.json` for what already exists.
2. Check whether a **native browser / Node / Next.js capability** is sufficient.
   It usually is. Notifications need the `Notification` API; sound needs
   `AudioContext`; storage needs `localStorage`/IndexedDB; dates need `Intl`.
   None of those need a library.
3. Only if genuinely required, ask once, with the reason and what it replaces.
4. After approval, install it and continue. **Do not ask again about a package
   already approved.**

Currently declared in `Learning/package.json`:

- Runtime: `next`, `react`, `react-dom`, `lucide-react`
- Dev: `tailwindcss`, `@tailwindcss/postcss`, `typescript`, `vitest`,
  `@types/node`, `@types/react`, `@types/react-dom`

---

## 8. Notifications and Sound Requirements

The Learning app should support training notifications, using **native browser
APIs**, no library:

- daily mission reminder
- task completion
- focus-session completion
- break reminders
- timer completion
- missed-day / recovery reminders
- review reminders (weekly, monthly, quarterly)
- streak and progress milestones

Rules:

- Browser notifications only after **explicit permission** via a user gesture.
  Never request permission on page load.
- Sound is **off by default**; respect autoplay restrictions; initialise
  `AudioContext` only from a user gesture. Never play unexpected audio.
- Settings must control: notifications on/off, sound on/off, per-category
  toggles, and volume.
- Preferences persist locally with the rest of the app state.
- Useful, not nagging. No streak-shaming, no anxiety mechanics.

---

## 9. Roadmap Requirements

Hierarchy: **Year → Phase → Module → Week → Day → Task → Deliverable →
Evidence.**

Every day carries: objective, why it matters, career connection, estimated
time, essential / important / optional tasks, practice, build, test,
documentation, git task, definition of done, evidence, next step, and the
repository path it touches where applicable.

**Time budget** (configurable in Settings): weekdays 1.5–2.5h, weekends 3–5h.
If only the essentials fit, the day still counts as done.

**Curriculum — 24 phases:**

1. Python Engineering · 2. Git & GitHub · 3. Computer Science ·
4. Mathematics & Statistics for AI · 5. Data & SQL · 6. Classical ML ·
7. Deep Learning · 8. Computer Vision · 9. NLP · 10. Transformers ·
11. LLM Engineering · 12. RAG & Knowledge Systems · 13. AI Agents ·
14. Backend Engineering · 15. Full-Stack AI · 16. Databases / Caching / Async ·
17. Docker / Cloud / DevOps / CI-CD · 18. MLOps / LLMOps / Observability ·
19. AI Security & Reliability · 20. AI into Existing Systems ·
21. AI System Design · 22. Production AI · 23. Portfolio Engineering ·
24. Interview & Career Preparation

**Authored vs outlined.** A phase is either `detailed` (day-by-day missions
exist) or `outline` (modules, outcomes, dependencies, milestone only). Later
phases stay outlined until the owner approaches them, so they can adapt to real
pace and to code that actually exists. Never pad an outlined phase with generic
filler to make it look complete — the UI states the distinction plainly.

**Adaptive behaviour:** finish early → extension work; struggle → reinforcement;
demonstrated competence → acceleration; several days missed → **recovery mode**
(essentials only until the rhythm returns). Never accumulate an impossible
backlog, and never use guilt as a mechanic.

**RAG progression:** basic RAG → chunking → embeddings → vector search →
metadata filtering → hybrid retrieval → reranking → query transformation →
multi-document retrieval → evaluation → production RAG.

**Agent progression:** LLM + one tool → multiple tools → tool selection →
multi-step execution → planning → state → memory → RAG + tools → human approval
→ retries → guardrails → observability → evaluation → production → multi-agent.
Also teach deterministic workflow vs AI workflow vs agent vs multi-agent, and
**when not to use an agent**. Agents are engineering, not magic.

**AI into existing systems:** classification → summarization → retrieval →
suggested responses → tool calling → human approval → agentic workflow →
evaluation → observability → production. Applied to ticket systems, support,
enterprise search, documentation, CRM, workflow automation, copilots, anomaly
detection, internal tools.

**AI Engineering Radar + monthly Modern AI Update** (30–60 min): models,
open-source models, providers, agent frameworks, RAG tools, vector databases,
inference, evaluation, observability, multimodal, fine-tuning, quantization, AI
coding tools. Classify as KEEP / LEARN / EXPERIMENT / IGNORE. **BUILD > READ** —
this must never become a news feed.

---

## 10. Learning Philosophy

Output-driven, always:

```
LEARN → PRACTICE → BUILD → TEST → DOCUMENT → COMMIT
      → DEPLOY → EVALUATE → IMPROVE → EXPLAIN
```

The measure is **demonstrated capability**, never course completion. Watching a
lecture is not evidence. Evidence is: code, a project, a test, a git commit, a
deployment, an evaluation, documentation, an architecture, a technical
explanation, a debugging or failure analysis.

**Skill maturity ladder** — Not Started · Awareness · Understanding ·
Practicing · Implementing · Applied · Engineering · Strong.

Maturity is **derived from ticked evidence, never self-declared**. Keep the
distinction between *completing a learning task* and *demonstrating a skill*.
Never mark an advanced skill as mastered because it appears in the roadmap.

---

## 11. Technical Requirements

**Stack:** Next.js (App Router) · React · TypeScript · Tailwind CSS ·
Lucide icons. Add nothing else without approval.

**Data-driven architecture — non-negotiable.** Curriculum content lives in
`Learning/src/data/` as typed plain data. UI components must never hard-code
roadmap content. Typed entities: phases, modules, days, tasks, skills, evidence,
projects, milestones, resources, blueprints, capabilities, reviews.

**Persistence:** V1 is local — `localStorage`, IndexedDB where it earns its
place. Persist progress, task completion, settings, notes, journal, projects,
skills, reviews, roadmap state, notification preferences. **Corrupt or partial
data must degrade gracefully, never crash and never silently destroy readable
data.** Keep persistence isolated (`src/lib/state.ts`, `src/lib/store.tsx`) so a
future FastAPI + PostgreSQL + auth backend replaces those files, not the pages.

**Pages:** Dashboard · Today · Roadmap · Calendar · Skills · Projects ·
Portfolio · Knowledge / Engineering Journal · AI Patterns / Blueprints ·
System Design · Reviews · Career Readiness · Settings.
Plus: Focus Mode, timer, progress tracking, recovery mode, capability checks,
skill matrix, gap analysis, command palette / global search.

**Dashboard:** today's mission is the dominant element. Header shows
`AI ENGINEER TRAINING SYSTEM`, day X, current phase, current module, progress,
streak. Mission shows objective, estimated time, why it matters, required
output, learn / practice / build / test / ship, definition of done. Then current
project, skills in progress, up next. Do not overload it.

**Projects & portfolio engine:** purpose, required skills, milestones, quality
gates, tests, docs, deployment, evidence, repository path, GitHub link.
Portfolio shows **capability**, not project titles: capability checks, skill
gaps, portfolio readiness, evidence mapping. Target 2–4 deep projects
demonstrating serious AI product engineering, RAG, agentic AI, and AI integrated
into an existing software system.

**Capability checker** — "Can I build this?" is limited by the **weakest**
required skill, not the average. A RAG system with no evaluation is not a
production RAG system.

**Blueprints:** RAG, AI Agent, AI Copilot, AI Search, Document Intelligence, AI
Workflow, Multi-Agent, AI SaaS, Model Serving, Evaluation Pipeline. Each with
architecture, components, tradeoffs, **failure points**, security, evaluation.

**Engineering journal:** bugs, causes, fixes, lessons, architecture decisions,
tradeoffs, AI failures, retrieval failures, agent failures, deployment failures.
Failure is evidence of engineering learning.

**Reviews:** daily, weekly, monthly, quarterly capability audit.

**UI:** premium AI engineering command centre. Dark-first, modern, minimal,
technical, focused, professional. Strong typography, subtle borders, generous
spacing, restrained motion. Avoid childish gamification, neon, heavy
glassmorphism, large decorative graphics, meaningless statistics and card soup.
Responsive down to phone width; accessible — semantic HTML, keyboard
navigation, visible focus states, ARIA where needed, adequate contrast.

---

## 12. Quality and Verification

**Never claim "working", "complete", "fixed", "tests pass" or "build passes"
without having actually run the relevant command in this session.** If it was
not run, say plainly that it was not run.

After any implementation or modification, run the real project commands from
`Learning/`:

```bash
npm test          # vitest
npx tsc --noEmit  # type check
npm run lint      # if configured
npm run build     # production build
npm run dev       # confirm it renders
```

On failure: read the error → find the root cause → fix it → rerun → continue
until verified. Do not paper over an error by loosening types or deleting a test.

**Test the logic that matters:** task completion, progress calculation,
persistence and corrupt-data recovery, skill progression, project state,
recovery mode, roadmap logic, reset, notification preferences, timer logic, and
curriculum data integrity (ids referenced by days must exist; day numbers
contiguous; every day has an essential task and a definition of done).

**No fake features.** Do not fake GitHub sync, cloud sync, an AI mentor,
external integrations, analytics or agent execution. No buttons that do nothing.
Unimplemented functionality is **labelled as not implemented, in the UI**, with
the reason. An honest empty state beats a plausible fabricated number.

---

## 13. Current State (update this section as it changes)

**Repository**

```
AI-Engineer/
├── .git/                      ← the ONLY .git in the tree
├── .gitignore                 (__pycache__/, *.pyc)
├── CLAUDE.md                  ← this file
├── README.md
├── 01-Python-Foundations/     OUT OF SCOPE — owner's work
│   ├── 01-file-handling/
│   └── projects/
│       ├── expense-tracker/   main.py, data.py, analyzer.py,
│       │                      expense_tracker.py, experiments.py,
│       │                      expenses.json, README.md
│       └── dot-spot-painting/ main.py, experiments.ipynb (0 bytes — invalid),
│                              image.jpg
└── Learning/                  IN SCOPE — the Training OS
```

**Environment: installed and verified.** Node.js 24.19.0 LTS and npm 11.17.0
(installed via winget with the owner's approval). `Learning/node_modules/`
present, `package-lock.json` committed. Python remains Anaconda 3.13.

**Learning app — 57 files, ~14,500 lines, VERIFIED**

`src/data/`: types, 24 phases, 8 weeks, 56 skills with evidence ladders, 8
projects, 10 blueprints, 8 capability checks, 8 system design briefs, 18 career
areas, 12 radar entries, 46 authored days for phases 1–2.
`src/lib/`: state (v2), store, progress, maturity, reviews, notifications,
notifier, useCue.
`src/components/`: ui, Shell, CommandPalette, mission, DayDetail, FocusMode,
CueRunner.
`src/app/`: dashboard, today, day/[n], roadmap, calendar, skills, projects,
knowledge, blueprints, system-design, radar, portfolio, career, reviews,
settings.
`tests/`: four vitest suites, 82 tests.

**Verification status (re-run after every change):**

- `npm test` — 82 passing
- `npm run typecheck` — clean
- `npm run build` — succeeds, 17 routes
- `npm run dev` — all 17 routes return 200, content assertions pass

There is no `lint` script. `next lint` is deprecated in Next 15 and no ESLint
config or dependency exists, so the dead script was removed rather than left
pretending to work. `npm run check` runs typecheck + test + build.

**Known behaviours worth remembering:**

- The dashboard renders a loading state during SSR because progress lives in
  localStorage. Not a bug.
- After many file edits the dev server can throw
  `__webpack_modules__[moduleId] is not a function`. It is a stale HMR cache:
  stop node, delete `.next`, restart. It is not a code fault.
- Git warns `LF will be replaced by CRLF` on Windows. Harmless.

**Still outstanding:**

- Client-side rendering is unverified. Route HTML and SSR output are checked,
  but no browser drives the app, so hydration, clicks, focus mode, the timer
  and the cue wiring have never been exercised end to end. This needs either
  jsdom + Testing Library or Playwright — both are new dependencies and need
  approval.
- IndexedDB — localStorage only. It is sufficient at this data size; revisit if
  state grows past a few MB.
- Days for phases 3–24 (deliberately outlined until approached).
- Background notifications (needs a service worker and push infrastructure).
- GitHub sync, cloud sync, AI mentor — all labelled as not implemented in the
  Settings UI.

**Git:** `7478e0b`. Three commits made this session: `ba231c0` (app + CLAUDE.md),
`c96571d` (notifications, sound, system design, career, radar), `7478e0b`
(weeks, blueprints, integrity tests). Nothing pushed — push always needs
approval.

**Immediate next step:** decide on browser-level testing, then continue with
the remaining gaps above.

---

## 14. Behavioural Reminders

- Act as **the engineer building this system**, not as a tutorial describing how
  to build it.
- Do not ask questions that inspecting the repository would answer.
- Do not stop after writing files. Run, verify, fix, iterate.
- Ground the curriculum in the owner's **real code and its real defects** —
  generic exercises are worth far less than a bug that actually exists in
  `expense-tracker`.
- Keep the owner pointed at the goal. If time drains into watching lectures,
  collecting frameworks, polishing beginner projects or perfecting this
  dashboard instead of doing the day's mission, say so: *what are we building,
  why, and what does it prove?*
- The Learning app is **a tool**, not the training. It should never become the
  thing that replaces the learning it exists to direct.
