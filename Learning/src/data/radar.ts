/**
 * AI Engineering Radar.
 *
 * Deliberately NOT a news feed and NOT a list of "the best tools right now" —
 * that list is wrong within weeks and this app has no live data source, so
 * claiming otherwise would be a fabricated integration.
 *
 * Instead each entry is a durable category with the questions that let you
 * evaluate anything new that appears in it. The monthly update is where you
 * check the category and classify what you find. Rule: BUILD > READ.
 */

export type RadarStance = "keep" | "learn" | "experiment" | "ignore";

export const RADAR_STANCES: { id: RadarStance; label: string; meaning: string }[] = [
  { id: "keep", label: "Keep", meaning: "Already using it; stay current, do not re-evaluate." },
  { id: "learn", label: "Learn", meaning: "Matters for the roadmap; schedule real study." },
  { id: "experiment", label: "Experiment", meaning: "Worth one timeboxed spike inside a project." },
  { id: "ignore", label: "Ignore", meaning: "Not relevant now. Revisit at the next quarterly audit." },
];

export interface RadarEntry {
  id: string;
  category: string;
  name: string;
  /** Why this category exists at all. */
  what: string;
  /** Why it matters to an AI engineer specifically. */
  whyItMatters: string;
  /** The questions that separate a real advance from a press release. */
  evaluateBy: string[];
  /** The predictable trap in this category. */
  trap: string;
  /** Roadmap phase where this becomes relevant. */
  relevantFrom: string;
  relatedSkills: string[];
}

export const radarEntries: RadarEntry[] = [
  {
    id: "rd-frontier",
    category: "Models",
    name: "Frontier hosted models",
    what: "The large general models served by API from the major providers.",
    whyItMatters:
      "They set the ceiling on what an application can do, and the floor on what it costs. Most production AI features call one.",
    evaluateBy: [
      "Does it change what you can build, or only the benchmark table?",
      "Cost per 1M tokens against the model you use now, at your real context length",
      "Latency at your p95, not the marketing number",
      "Does it break your existing prompts? Version pinning and migration cost is real",
      "Context window: useful, or does quality degrade long before the limit?",
    ],
    trap: "Upgrading because a benchmark moved, then discovering your evaluation suite regressed.",
    relevantFrom: "Phase 11 — LLM Engineering",
    relatedSkills: ["llm-eng", "ai-eval"],
  },
  {
    id: "rd-small",
    category: "Models",
    name: "Small and open-weight models",
    what: "Models small enough to run locally or self-host cheaply.",
    whyItMatters:
      "Cost, privacy and latency. For a narrow task at volume, a small fine-tuned model often beats a frontier model on every axis that matters.",
    evaluateBy: [
      "Is your task narrow enough that a small model can match quality?",
      "Total cost including the GPU, not just the token price",
      "Licence — genuinely open, or open-ish with restrictions?",
      "What breaks when you cannot call the big model?",
    ],
    trap: "Self-hosting for ideology rather than economics, then paying more in engineering time than the API would have cost.",
    relevantFrom: "Phase 11 — LLM Engineering",
    relatedSkills: ["open-models", "llm-eng"],
  },
  {
    id: "rd-multimodal",
    category: "Models",
    name: "Multimodal and vision-language models",
    what: "Models that take images, audio or video alongside text.",
    whyItMatters:
      "Document understanding, screenshots, diagrams and scanned forms stop needing a separate OCR and vision stack.",
    evaluateBy: [
      "Does it beat a dedicated OCR plus text model on your documents?",
      "Cost per image at your volume",
      "How does it fail on poor-quality input — gracefully, or confidently wrong?",
    ],
    trap: "Assuming a VLM reads a bad scan better than a purpose-built pipeline. Measure on your worst inputs.",
    relevantFrom: "Phase 8 — Computer Vision",
    relatedSkills: ["cv", "llm-eng"],
  },
  {
    id: "rd-agent-frameworks",
    category: "Tooling",
    name: "Agent frameworks and orchestration",
    what: "Libraries that structure planning, tool calling, state and multi-step execution.",
    whyItMatters:
      "They remove boilerplate. They also hide the mechanism, which is exactly what you need to understand to debug an agent.",
    evaluateBy: [
      "Can you see and control the actual prompts it sends?",
      "How does it handle a tool that fails or times out?",
      "Can you get a full trace of every step?",
      "Could you have written this loop yourself in a day? If yes, do that first.",
    ],
    trap: "Learning a framework's abstractions instead of agent engineering. Build the loop by hand once before adopting one.",
    relevantFrom: "Phase 13 — AI Agents",
    relatedSkills: ["agents", "tool-calling"],
  },
  {
    id: "rd-protocols",
    category: "Tooling",
    name: "Tool and context protocols",
    what: "Standards for how models discover and call external tools and data sources.",
    whyItMatters:
      "A shared protocol means tools become reusable across applications and models instead of being rewritten per integration.",
    evaluateBy: [
      "Is it adopted by more than one vendor?",
      "What is the security model — who authorises a tool call, and with whose permissions?",
      "Does it survive the model provider changing?",
    ],
    trap: "Adopting a protocol before you have two things that need to interoperate.",
    relevantFrom: "Phase 13 — AI Agents",
    relatedSkills: ["tool-calling", "ai-security"],
  },
  {
    id: "rd-vector",
    category: "Retrieval",
    name: "Vector stores and indexes",
    what: "Databases and index structures for approximate nearest-neighbour search.",
    whyItMatters:
      "The storage layer under every RAG system. The choice affects filtering, scale, cost and operational burden.",
    evaluateBy: [
      "Does your existing Postgres with pgvector already do this? Usually yes, below ~10M vectors",
      "Metadata filtering: applied during search, or after — the difference is a security boundary",
      "Recall at your latency budget, measured on your data",
      "Operational cost: another service to run, monitor and back up",
    ],
    trap: "Adding a dedicated vector database for 50k documents that Postgres would have served fine.",
    relevantFrom: "Phase 12 — RAG",
    relatedSkills: ["vector-db", "rag", "postgres"],
  },
  {
    id: "rd-retrieval",
    category: "Retrieval",
    name: "Rerankers and retrieval techniques",
    what: "Cross-encoders, hybrid fusion, query rewriting, late chunking and their successors.",
    whyItMatters:
      "Retrieval quality is where most RAG systems actually fail. This is the highest-leverage category in the entire radar for an AI engineer.",
    evaluateBy: [
      "Does it improve recall@k on YOUR labelled set, or only on a public benchmark?",
      "Added latency and cost per query",
      "Does it help most where you are weakest — long documents, rare terms, multi-hop questions?",
    ],
    trap: "Chasing a new technique before building the evaluation set that would tell you whether it helped.",
    relevantFrom: "Phase 12 — RAG",
    relatedSkills: ["rag", "retrieval-eval", "embeddings"],
  },
  {
    id: "rd-eval",
    category: "Evaluation",
    name: "Evaluation frameworks and judges",
    what: "Tooling for golden sets, rubric scoring, LLM-as-judge and regression gates.",
    whyItMatters:
      "Without evaluation you cannot tell improvement from coincidence. This is the skill that separates AI engineers from people who call APIs.",
    evaluateBy: [
      "Does it fit into CI, or does it need a hosted dashboard you will stop opening?",
      "Can you inspect and version the golden set as code?",
      "How is judge bias handled — is it calibrated against human labels?",
    ],
    trap: "Adopting an evaluation tool before defining what 'better' means for your product.",
    relevantFrom: "Phase 11 — LLM Engineering",
    relatedSkills: ["ai-eval", "retrieval-eval", "cicd"],
  },
  {
    id: "rd-observability",
    category: "Production",
    name: "LLM observability and tracing",
    what: "Tracing model calls, tool calls, retrieval steps, tokens and cost.",
    whyItMatters:
      "Answering 'why did it do that?' is impossible without traces. Non-deterministic systems need better observability than deterministic ones, not worse.",
    evaluateBy: [
      "Does it capture prompt version, model version, tokens and cost per call?",
      "Can you trace one user request end to end through retrieval, tools and generation?",
      "What is the data residency story — your prompts contain user data",
      "Does OpenTelemetry already cover it?",
    ],
    trap: "Sending full prompts and user data to a third-party dashboard without checking what that implies.",
    relevantFrom: "Phase 18 — MLOps / LLMOps",
    relatedSkills: ["observability", "llmops", "ai-security"],
  },
  {
    id: "rd-inference",
    category: "Production",
    name: "Inference optimisation and serving",
    what: "Batching, KV caching, speculative decoding, quantisation and serving runtimes.",
    whyItMatters:
      "Determines whether self-hosting is economically viable, and how far your latency budget stretches.",
    evaluateBy: [
      "Throughput and latency on your hardware, with your sequence lengths",
      "Quality cost of quantisation, measured rather than assumed",
      "Operational complexity against the saving",
    ],
    trap: "Optimising inference before you have a model in production worth optimising.",
    relevantFrom: "Phase 18 — MLOps / LLMOps",
    relatedSkills: ["llmops", "open-models", "cloud"],
  },
  {
    id: "rd-finetuning",
    category: "Training",
    name: "Fine-tuning, LoRA and adapters",
    what: "Parameter-efficient adaptation of an existing model to a task or style.",
    whyItMatters:
      "The right answer when prompting plateaus and you have data. The wrong answer when you have neither.",
    evaluateBy: [
      "Have you exhausted prompting and retrieval first?",
      "Do you have enough labelled examples, and a held-out set?",
      "What is the retraining and evaluation loop once the data shifts?",
      "Cost per training run against the cost of just using a bigger model",
    ],
    trap: "Fine-tuning to teach facts. Fine-tuning teaches form and behaviour; retrieval teaches facts.",
    relevantFrom: "Phase 11 — LLM Engineering",
    relatedSkills: ["open-models", "dl-core", "ai-eval"],
  },
  {
    id: "rd-coding-tools",
    category: "Developer",
    name: "AI coding tools",
    what: "Assistants and agents that write, review and refactor code.",
    whyItMatters:
      "They change your throughput, and understanding their failure modes is directly transferable to building agents yourself.",
    evaluateBy: [
      "Does it make you faster at things you understand, or confident about things you do not?",
      "Can you review everything it produces? If not, that is the limit of how much to use it",
      "What does it do to your learning while you are still building foundations?",
    ],
    trap:
      "Accepting generated code you could not have written and cannot debug. Early in this roadmap that trades short-term speed for the exact skills you are here to build.",
    relevantFrom: "Now — with care",
    relatedSkills: ["code-review", "python-core"],
  },
];

export const radarCategories = [
  ...new Set(radarEntries.map((e) => e.category)),
];

export const radarEntryById = new Map(radarEntries.map((e) => [e.id, e]));

/** The monthly ritual. Timeboxed, deliberately small. */
export const monthlyUpdateSteps = [
  "Pick two or three categories below — never all of them.",
  "Spend 30-60 minutes total. Set a timer; when it ends, stop reading.",
  "For anything new you find, answer that category's evaluate-by questions.",
  "Classify it: Keep, Learn, Experiment or Ignore. Most things are Ignore.",
  "Anything marked Learn or Experiment must attach to a project or a day, or it does not happen.",
  "Write one line in the engineering journal about what changed and what you decided.",
];
