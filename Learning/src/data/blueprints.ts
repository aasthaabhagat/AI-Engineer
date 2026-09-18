import type { Blueprint, Capability } from "./types";

/**
 * Architecture blueprints. These teach the mechanism and its failure modes —
 * a diagram alone teaches nothing. Read the failurePoints before building.
 */
export const blueprints: Blueprint[] = [
  {
    id: "bp-rag",
    name: "Retrieval-Augmented Generation",
    category: "Knowledge",
    problem:
      "Answer questions over a corpus too large for the context window and too specific for the model's training data.",
    whenToUse:
      "Large or frequently changing knowledge, answers that must cite sources, per-user document permissions.",
    whenNotToUse:
      "The knowledge fits in a prompt; the answer needs computation rather than recall; the corpus is tiny and static.",
    flow: [
      "User question",
      "Query processing: rewrite, expand, extract filters",
      "Retrieve: keyword search + vector search in parallel",
      "Rerank the merged candidates",
      "Assemble context within the token budget",
      "Generate with an instruction to cite and to refuse when unsupported",
      "Validate citations against the retrieved text",
      "Return answer with sources",
    ],
    components: [
      { name: "Ingestion pipeline", role: "Parse, chunk, embed, index. Must support incremental updates." },
      { name: "Chunker", role: "Splits documents. The single highest-leverage knob in the system." },
      { name: "Embedding model", role: "Maps text to vectors. Changing it invalidates the whole index." },
      { name: "Vector store", role: "Approximate nearest-neighbour search with metadata filtering." },
      { name: "Keyword index", role: "Exact terms, names and IDs — where embeddings are weakest." },
      { name: "Reranker", role: "Expensive, accurate second pass over the cheap first pass." },
      { name: "Context assembler", role: "Fits the best evidence into the budget; handles deduplication." },
      { name: "Generator", role: "The LLM. The least interesting component in a well-built RAG system." },
    ],
    tradeoffs: [
      "Small chunks retrieve precisely but lose surrounding context",
      "Large chunks preserve context but dilute the embedding and cost more tokens",
      "Reranking improves precision and adds latency and cost",
      "Hybrid retrieval improves recall and adds a second index to maintain",
    ],
    failurePoints: [
      "The answer is simply not in the retrieved chunks — a retrieval failure misdiagnosed as hallucination",
      "Chunk boundaries split the answer in half",
      "Embedding model mismatch between ingestion and query time",
      "Stale index after source documents change",
      "One user retrieving another user's documents",
      "Context window overrun silently truncating the most relevant chunk",
    ],
    evaluation: [
      "Recall@k on a labelled question-to-chunk set",
      "Groundedness: is every claim supported by retrieved text?",
      "Answer correctness against reference answers",
      "Citation accuracy: do the cited sources actually say it?",
      "Latency and cost per query",
    ],
    security: [
      "Enforce document permissions at retrieval time, never in the prompt",
      "Treat retrieved content as untrusted: it can contain injected instructions",
      "Log which documents were retrieved for every answer",
    ],
  },
  {
    id: "bp-agent",
    name: "Tool-Using Agent",
    category: "Agentic",
    problem:
      "A task requiring several steps whose sequence cannot be determined in advance.",
    whenToUse:
      "Genuinely dynamic tool selection, open-ended investigation, tasks where the path depends on intermediate findings.",
    whenNotToUse:
      "The steps are known in advance. A deterministic workflow is cheaper, faster, testable and debuggable — prefer it whenever it fits.",
    flow: [
      "User goal",
      "Plan or decompose (optionally explicit)",
      "Model selects a tool and arguments",
      "Validate arguments against the schema",
      "Check permissions; pause for human approval if consequential",
      "Execute the tool; capture the result or the error",
      "Append to state and loop until done or a step budget is hit",
      "Return the result with a trace of what was done",
    ],
    components: [
      { name: "Tool registry", role: "Schemas and descriptions. Bad descriptions cause bad tool choice." },
      { name: "Argument validator", role: "Never execute unvalidated model output." },
      { name: "Executor", role: "Runs tools with timeouts and permission scoping." },
      { name: "State/memory", role: "Carries context without exhausting the window." },
      { name: "Approval gate", role: "Human confirmation before irreversible actions." },
      { name: "Tracer", role: "Records every step, tool call, token and error." },
      { name: "Step budget", role: "Hard stop preventing infinite loops and runaway cost." },
    ],
    tradeoffs: [
      "More tools means more capability and worse selection accuracy",
      "Explicit planning improves coherence and adds latency and cost",
      "Long memory improves continuity and inflates every subsequent prompt",
      "Autonomy improves speed and reduces controllability",
    ],
    failurePoints: [
      "Wrong tool chosen because two descriptions overlap",
      "Loops repeating the same failing call",
      "Context window exhausted mid-task",
      "Tool errors swallowed and treated as success",
      "Injected instructions from tool output hijacking the agent",
      "Cost per task unbounded without a step budget",
    ],
    evaluation: [
      "Task success rate over repeated runs",
      "Tool selection accuracy against expected calls",
      "Steps and tokens per completed task",
      "Failure taxonomy: where it goes wrong, not just how often",
      "Cost and latency per task",
    ],
    security: [
      "Least-privilege tool scoping; read and write tools separated",
      "Human approval for anything irreversible",
      "Treat all tool output as untrusted input",
      "Audit log of every action taken on the user's behalf",
    ],
  },
  {
    id: "bp-classification",
    name: "LLM Classification and Extraction",
    category: "Integration",
    problem: "Turn unstructured text into a structured field a system can act on.",
    whenToUse:
      "Labels are nuanced, examples are few, or categories change often enough that retraining is impractical.",
    whenNotToUse:
      "High volume with stable labels and plentiful training data — a small fine-tuned classifier is cheaper, faster and more predictable.",
    flow: [
      "Input text",
      "Cheap pre-filter: rules or regex handle the obvious cases",
      "Prompt with the schema and the label definitions",
      "Validate output against the schema",
      "Route low-confidence cases to a human",
      "Log input, output and confidence for evaluation",
    ],
    components: [
      { name: "Label taxonomy", role: "Written definitions with boundary cases. Most errors originate here." },
      { name: "Schema", role: "Pydantic model or JSON schema the output must satisfy." },
      { name: "Validator", role: "Rejects and repairs malformed output." },
      { name: "Confidence routing", role: "Sends uncertain cases to review instead of guessing." },
      { name: "Evaluation set", role: "Labelled examples, built before shipping." },
    ],
    tradeoffs: [
      "LLM: no training data needed, higher per-item cost",
      "Fine-tuned classifier: cheap at volume, needs labelled data and a retraining loop",
      "Rules: free and exact, brittle to phrasing",
    ],
    failurePoints: [
      "Ambiguous label definitions producing inconsistent results",
      "Schema drift breaking downstream consumers",
      "Silent quality decay after a model version change",
      "No human path for the uncertain middle",
    ],
    evaluation: [
      "Precision and recall per class, not overall accuracy",
      "Confusion matrix to find the confusable pairs",
      "Cost per thousand items",
      "Agreement with human labels on a holdout set",
    ],
  },
  {
    id: "bp-ai-service",
    name: "Production AI Service",
    category: "Platform",
    problem: "Serve AI features to real users reliably and affordably.",
    whenToUse: "Any AI feature with users other than you.",
    whenNotToUse: "Prototypes and notebooks — this shape is overkill before the idea is proven.",
    flow: [
      "Client request",
      "Auth and rate limit",
      "Validate input",
      "Cache lookup",
      "Enqueue if the work is slow, or call the model inline if fast",
      "Model call with timeout, retry and fallback",
      "Validate output",
      "Persist result and telemetry",
      "Respond, streaming where it improves perceived latency",
    ],
    components: [
      { name: "API gateway", role: "Auth, rate limiting, request validation." },
      { name: "Cache", role: "Exact or semantic reuse of expensive calls." },
      { name: "Queue + workers", role: "Keeps slow AI work off the request path." },
      { name: "Model client", role: "Timeouts, retries, fallback model, cost accounting." },
      { name: "Store", role: "Results, prompts, versions and audit trail." },
      { name: "Telemetry", role: "Latency, tokens, cost, errors, per feature." },
    ],
    tradeoffs: [
      "Streaming improves perceived latency and complicates error handling",
      "Caching cuts cost and risks serving stale answers",
      "Queues improve resilience and add operational surface",
      "A bigger model improves quality and worsens cost and latency",
    ],
    failurePoints: [
      "Provider outage with no fallback path",
      "Rate limits under load with no backoff",
      "Cost spiral from an unbounded retry loop",
      "Prompt change deployed without evaluation",
      "No trace, so 'why did it answer that?' is unanswerable",
    ],
    evaluation: [
      "p50 and p95 latency",
      "Error and fallback rate",
      "Cost per request and per active user",
      "Quality scores from the regression suite, tracked over time",
    ],
    security: [
      "Keys in a secret manager, never in code or prompts",
      "Per-user rate limits and spend caps",
      "PII handling policy for anything sent to a provider",
    ],
  },
];

/** "Can I build this?" checks. Learning aids, not certifications. */
export const capabilities: Capability[] = [
  {
    id: "cap-cli",
    question: "Can I build a maintainable Python application?",
    requires: [
      "python-core",
      "python-errors",
      "python-typing",
      "python-testing",
      "code-architecture",
      "git",
    ],
  },
  {
    id: "cap-api",
    question: "Can I build and deploy a backend API?",
    requires: ["fastapi", "api-design", "postgres", "auth", "python-testing", "docker"],
  },
  {
    id: "cap-ml",
    question: "Can I build and serve an ML model?",
    requires: ["pandas", "ml-core", "ml-eval", "fastapi", "docker", "mlops"],
  },
  {
    id: "cap-llm",
    question: "Can I build a reliable LLM feature?",
    requires: ["llm-eng", "prompt-eng", "structured-output", "reliability", "ai-eval", "observability"],
  },
  {
    id: "cap-rag",
    question: "Can I build a production RAG system?",
    requires: [
      "python-core",
      "fastapi",
      "embeddings",
      "vector-db",
      "rag",
      "retrieval-eval",
      "llm-eng",
      "docker",
      "cloud",
      "observability",
    ],
  },
  {
    id: "cap-agent",
    question: "Can I build a production agent?",
    requires: [
      "agents",
      "tool-calling",
      "agent-eval",
      "ai-security",
      "reliability",
      "observability",
      "fastapi",
      "docker",
    ],
  },
  {
    id: "cap-fullstack",
    question: "Can I ship a full-stack AI product?",
    requires: [
      "react",
      "typescript",
      "fastapi",
      "postgres",
      "llm-eng",
      "docker",
      "cicd",
      "cloud",
      "ai-security",
    ],
  },
  {
    id: "cap-integration",
    question: "Can I retrofit AI into an existing system?",
    requires: ["ai-integration", "ai-product", "llm-eng", "ai-eval", "reliability", "api-design"],
  },
];

export const blueprintById = new Map(blueprints.map((b) => [b.id, b]));
