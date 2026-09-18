import type { Project } from "./types";

/**
 * Projects are first-class entities. The rule of this roadmap is few and deep,
 * not many and shallow: the level ladder runs 1 (scripts) to 10 (capstone),
 * and later projects absorb earlier ones rather than replacing them.
 *
 * Status here is the SEED value. Live status is stored per user and can be
 * changed on the Projects page.
 */
export const projects: Project[] = [
  {
    id: "expense-tracker",
    name: "Expense Tracker",
    description:
      "A CLI expense tracker and analyser. The vehicle for Phase 1 and 2: every Python engineering concept lands here rather than in a throwaway exercise.",
    problem:
      "Personal spending is recorded ad hoc and never analysed, so patterns are invisible.",
    targetUser: "You, tracking real spending.",
    status: "building",
    level: 2,
    techStack: ["Python", "JSON", "pytest", "argparse"],
    skills: [
      "python-core",
      "python-errors",
      "python-oop",
      "python-typing",
      "python-testing",
      "cli-apps",
      "code-architecture",
      "git",
    ],
    repoPath: "01-Python-Foundations/projects/expense-tracker",
    portfolioTarget: false,
    milestones: [
      { id: "et-m1", title: "v0.1 CLI with JSON persistence", detail: "Done — day 1" },
      { id: "et-m2", title: "Refactored into modules", detail: "Done — day 3" },
      { id: "et-m3", title: "Safe writes and validated input", detail: "Days 4-6" },
      { id: "et-m4", title: "Typed domain model", detail: "Days 7-8" },
      { id: "et-m5", title: "Test suite with fixtures", detail: "Days 10-12" },
      { id: "et-m6", title: "Scriptable CLI, logging, config", detail: "Days 13-15" },
      { id: "et-m7", title: "Installable package, typed and linted", detail: "Days 26-28" },
      { id: "et-m8", title: "v1.0.0 released", detail: "Day 34" },
      { id: "et-m9", title: "CI running tests on every push", detail: "Days 44-45" },
      { id: "et-m10", title: "Migrated to PostgreSQL", detail: "Phase 5" },
      { id: "et-m11", title: "Exposed as a FastAPI service", detail: "Phase 14" },
    ],
  },
  {
    id: "dot-spot-painting",
    name: "Dot Spot Painting",
    description:
      "Turtle graphics practice project. A learning artifact, not portfolio material — kept because deleting your own history is a bad habit.",
    problem: "Practising loops, functions and randomness with immediate visual feedback.",
    targetUser: "Nobody. This one is purely practice.",
    status: "archived",
    level: 1,
    techStack: ["Python", "turtle"],
    skills: ["python-core"],
    repoPath: "01-Python-Foundations/projects/dot-spot-painting",
    portfolioTarget: false,
    milestones: [{ id: "dsp-m1", title: "Shapes and colour randomisation", detail: "Done" }],
  },
  {
    id: "training-os",
    name: "AI Engineer Training OS",
    description:
      "This application. A Next.js command centre for the year, and later a real full-stack project once Phase 14-15 gives it a backend.",
    problem:
      "Deciding what to study after a full day of work consumes the energy that should go into studying.",
    targetUser: "You, opening it every evening.",
    status: "building",
    level: 4,
    techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    skills: ["typescript", "react", "nextjs"],
    repoPath: "Learning",
    portfolioTarget: false,
    aiComponent:
      "None yet. An AI mentor layer is designed for but deliberately not faked — see the Mentor page.",
    milestones: [
      { id: "tos-m1", title: "v1: local-first training system", detail: "Current" },
      { id: "tos-m2", title: "FastAPI backend replacing localStorage", detail: "Phase 14" },
      { id: "tos-m3", title: "PostgreSQL persistence with auth", detail: "Phase 14-16" },
      { id: "tos-m4", title: "AI mentor: hints, quizzes, code review", detail: "Phase 11+" },
      { id: "tos-m5", title: "Deployed with CI/CD", detail: "Phase 17" },
    ],
  },
  {
    id: "ml-service",
    name: "ML Prediction Service",
    description:
      "First real ML system: a trained model served behind an API, evaluated honestly and deployed.",
    problem: "To be chosen in Phase 6 from a dataset with a genuine decision attached to it.",
    targetUser: "To be defined — a real user, not 'a data scientist'.",
    status: "idea",
    level: 5,
    techStack: ["Python", "scikit-learn", "pandas", "FastAPI", "Docker"],
    skills: ["ml-core", "ml-eval", "fastapi", "docker"],
    portfolioTarget: true,
    aiComponent: "Supervised model with a documented metric choice and baseline.",
    milestones: [
      { id: "mls-m1", title: "Problem and baseline defined" },
      { id: "mls-m2", title: "Model trained and evaluated" },
      { id: "mls-m3", title: "Served behind an API" },
      { id: "mls-m4", title: "Containerised and deployed" },
      { id: "mls-m5", title: "Monitored in production" },
    ],
  },
  {
    id: "rag-assistant",
    name: "Knowledge Assistant (RAG)",
    description:
      "A serious retrieval system over a real corpus, with retrieval measured separately from generation.",
    problem:
      "Answering questions from a document set that is too large to read and too specific for a general model.",
    targetUser: "To be defined in Phase 12.",
    status: "idea",
    level: 6,
    techStack: ["Python", "FastAPI", "PostgreSQL + pgvector", "React", "Docker"],
    skills: ["rag", "embeddings", "vector-db", "retrieval-eval", "llm-eng", "fastapi"],
    portfolioTarget: true,
    aiComponent: "Hybrid retrieval, reranking, grounded generation with citations.",
    milestones: [
      { id: "rag-m1", title: "Baseline document Q&A" },
      { id: "rag-m2", title: "Evaluation set and recall@k baseline" },
      { id: "rag-m3", title: "Hybrid retrieval and reranking" },
      { id: "rag-m4", title: "Citations and groundedness measured" },
      { id: "rag-m5", title: "Incremental ingestion and permissions" },
      { id: "rag-m6", title: "Deployed with cost and latency tracking" },
    ],
  },
  {
    id: "agent-system",
    name: "Agentic Assistant",
    description:
      "A tool-using agent built through the 13 levels, with approval gates, tracing and measured task success.",
    problem:
      "A multi-step task that genuinely needs dynamic tool selection — chosen only after proving a workflow cannot do it.",
    targetUser: "To be defined in Phase 13.",
    status: "idea",
    level: 7,
    techStack: ["Python", "FastAPI", "LangGraph or hand-rolled loop", "PostgreSQL", "Docker"],
    skills: ["agents", "tool-calling", "agent-eval", "ai-security", "observability"],
    portfolioTarget: true,
    aiComponent: "Planning loop, tool calling, memory, human-in-the-loop approval.",
    milestones: [
      { id: "ag-m1", title: "Levels 1-4: tools and multi-step execution" },
      { id: "ag-m2", title: "Levels 5-7: planning, memory, retrieval" },
      { id: "ag-m3", title: "Levels 8-10: approval, failure handling, tracing" },
      { id: "ag-m4", title: "Levels 11-12: evaluation suite and deployment" },
      { id: "ag-m5", title: "Written comparison against a deterministic workflow" },
    ],
  },
  {
    id: "ai-retrofit",
    name: "AI Retrofit of an Existing System",
    description:
      "Taking software that already works and adding AI in stages: classification, summarisation, retrieval, suggested actions, approval, evaluation.",
    problem:
      "The career-relevant case: most AI work is integration into existing systems, not greenfield.",
    targetUser: "Users of the existing system, whose workflow should get faster.",
    status: "idea",
    level: 8,
    techStack: ["Python", "FastAPI", "PostgreSQL", "LLM API", "Docker", "CI/CD"],
    skills: ["ai-integration", "ai-product", "rag", "llm-eng", "reliability", "ai-eval"],
    portfolioTarget: true,
    aiComponent: "Staged: classification first, then summarisation, retrieval and tool calling.",
    milestones: [
      { id: "ar-m1", title: "Existing architecture documented" },
      { id: "ar-m2", title: "Opportunity assessment with a baseline" },
      { id: "ar-m3", title: "Stage 1: classification shipped behind a flag" },
      { id: "ar-m4", title: "Stages 2-4: summarisation, retrieval, suggestions" },
      { id: "ar-m5", title: "Stages 5-7: tool calling with human approval" },
      { id: "ar-m6", title: "Impact measured against the baseline" },
    ],
  },
  {
    id: "capstone",
    name: "Capstone AI Product",
    description:
      "One deployed system demonstrating the full stack. Assembled from capabilities already proven in earlier projects — never started from scratch.",
    problem: "Defined in Phase 22, from a real problem you care about.",
    targetUser: "Real users, or a convincing proxy for them.",
    status: "idea",
    level: 10,
    techStack: [
      "Next.js",
      "FastAPI",
      "PostgreSQL",
      "Redis",
      "LLM API",
      "Docker",
      "GitHub Actions",
      "Cloud",
    ],
    skills: [
      "llm-eng",
      "rag",
      "agents",
      "fastapi",
      "react",
      "postgres",
      "docker",
      "cicd",
      "observability",
      "ai-security",
      "ai-eval",
      "system-design",
    ],
    portfolioTarget: true,
    aiComponent: "LLM, RAG and tool calling, all evaluated and observable.",
    milestones: [
      { id: "cap-m1", title: "Design document and architecture" },
      { id: "cap-m2", title: "Core system built and tested" },
      { id: "cap-m3", title: "Evaluation suite with baselines" },
      { id: "cap-m4", title: "Security review and threat model" },
      { id: "cap-m5", title: "Containerised with CI/CD" },
      { id: "cap-m6", title: "Deployed, monitored, cost-tracked" },
      { id: "cap-m7", title: "Demo, docs and architecture write-up" },
    ],
  },
];

export const projectById = new Map(projects.map((p) => [p.id, p]));
