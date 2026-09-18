/**
 * AI system design briefs.
 *
 * These are practice material, not architecture diagrams to admire. Each one
 * is framed the way a design round is: requirements first, then the shape,
 * then the parts that actually decide whether it works — failure, cost,
 * security, evaluation.
 */

export interface DesignBrief {
  id: string;
  title: string;
  /** One-line framing of the problem as an interviewer would state it. */
  prompt: string;
  scale: string;
  /** Functional and non-functional requirements worth pinning down first. */
  requirements: string[];
  /** The questions to ask before designing anything. */
  clarifying: string[];
  components: { name: string; role: string }[];
  dataFlow: string[];
  /** The decisions that actually differentiate a good answer. */
  keyDecisions: { decision: string; tradeoff: string }[];
  scaling: string[];
  failureModes: string[];
  security: string[];
  observability: string[];
  evaluation: string[];
  costDrivers: string[];
  /** What a weak answer sounds like. */
  commonMistakes: string[];
  relatedBlueprints: string[];
  relatedSkills: string[];
}

export const designBriefs: DesignBrief[] = [
  {
    id: "sd-chatbot",
    title: "LLM Chat Assistant",
    prompt:
      "Design a chat assistant for a product with 50k users, with conversation history and streaming responses.",
    scale: "50k users, 5k daily conversations, p95 first token under 1s",
    requirements: [
      "Streaming responses, conversation persistence, multi-turn context",
      "Per-user rate limits and a spend ceiling",
      "Graceful behaviour when the model provider degrades",
      "Content safety on input and output",
    ],
    clarifying: [
      "Is history per-user private, or shared in a workspace?",
      "Do we need the assistant to act, or only to answer?",
      "What is the acceptable cost per conversation?",
      "What happens when the model is wrong — who notices, and how?",
    ],
    components: [
      { name: "Chat API", role: "Auth, rate limiting, request validation, SSE streaming." },
      { name: "Conversation store", role: "Postgres: messages, metadata, token accounting." },
      { name: "Context builder", role: "Selects which turns to send; summarises or truncates the rest." },
      { name: "Model client", role: "Timeouts, retries, fallback model, per-request cost capture." },
      { name: "Safety filter", role: "Input and output checks before anything reaches a user." },
      { name: "Cache", role: "Exact-match reuse for repeated prompts; system-prompt caching." },
    ],
    dataFlow: [
      "Client opens a streaming connection",
      "Auth, rate limit, spend check",
      "Load conversation, build context within the token budget",
      "Safety check the input",
      "Call model with timeout; stream tokens back as they arrive",
      "Safety check the accumulated output",
      "Persist the exchange with token counts and cost",
      "Emit telemetry: latency, tokens, model version, prompt version",
    ],
    keyDecisions: [
      {
        decision: "How much history to send",
        tradeoff:
          "Full history gives coherence and grows cost quadratically. Summarised history is cheap and loses detail. Usually: recent turns verbatim, older turns summarised.",
      },
      {
        decision: "Streaming vs single response",
        tradeoff:
          "Streaming transforms perceived latency but complicates error handling — a failure mid-stream has already shown the user text you cannot retract.",
      },
      {
        decision: "Where safety runs",
        tradeoff:
          "Output filtering after streaming has begun is too late. Either filter in chunks or accept the exposure window and say so.",
      },
    ],
    scaling: [
      "Stateless API behind a load balancer; state lives in Postgres",
      "Connection limits matter more than CPU — streaming holds connections open",
      "Cache system prompts at the provider where supported",
      "Queue anything not user-facing (titles, summaries, embeddings)",
    ],
    failureModes: [
      "Provider outage or 429 storm with no fallback",
      "Context window overflow silently dropping the user's actual question",
      "Runaway retry loop multiplying spend",
      "A prompt change deployed with no evaluation, degrading quality invisibly",
      "Conversation history leaking between users through a caching bug",
    ],
    security: [
      "Treat all model output as untrusted before rendering (XSS through markdown)",
      "Never put secrets or other users' data in the context",
      "Per-user spend caps to make abuse bounded",
      "Log prompts with a retention policy — they contain user data",
    ],
    observability: [
      "Per-request: latency to first token, total latency, tokens in/out, cost, model and prompt version",
      "Fallback rate and retry rate as first-class metrics",
      "Sampled conversation traces for quality review",
    ],
    evaluation: [
      "Golden set of real conversations scored against a rubric",
      "Regression run on every prompt or model change",
      "Track refusal rate and hallucination rate separately",
      "Thumbs-down feedback wired into the evaluation set",
    ],
    costDrivers: [
      "Context length per turn — the dominant term",
      "Model tier chosen per request vs one model for everything",
      "Cache hit rate on system prompts",
      "Retries and the fallback path",
    ],
    commonMistakes: [
      "Jumping to the model choice before the requirements",
      "No answer for what happens when the provider is down",
      "Treating evaluation as something added later",
      "Ignoring cost until it is a production incident",
    ],
    relatedBlueprints: ["bp-ai-service"],
    relatedSkills: ["llm-eng", "fastapi", "postgres", "reliability", "observability"],
  },
  {
    id: "sd-rag-platform",
    title: "Multi-Tenant RAG Platform",
    prompt:
      "Design a platform where each customer uploads their own documents and asks questions over them.",
    scale: "200 tenants, 10M chunks total, strict isolation, p95 under 3s",
    requirements: [
      "Hard tenant isolation — no cross-tenant retrieval, ever",
      "Incremental ingestion as documents change",
      "Answers cite their sources",
      "Per-tenant usage and cost accounting",
    ],
    clarifying: [
      "Do permissions vary per user inside a tenant, or only per tenant?",
      "How fresh must the index be after a document changes?",
      "What document types, and how large?",
      "What is the cost of a wrong answer in this domain?",
    ],
    components: [
      { name: "Ingestion pipeline", role: "Parse, chunk, embed, index. Idempotent and resumable." },
      { name: "Document store", role: "Originals plus version and permission metadata." },
      { name: "Vector index", role: "pgvector or a dedicated store, partitioned by tenant." },
      { name: "Keyword index", role: "Exact terms, IDs and names, where embeddings are weakest." },
      { name: "Reranker", role: "Expensive precise pass over the cheap recall pass." },
      { name: "Query service", role: "Rewrite, retrieve, rerank, assemble, generate, verify citations." },
    ],
    dataFlow: [
      "Upload → virus scan → parse → chunk → embed → index with tenant and permission metadata",
      "Query → resolve tenant and user permissions → rewrite query",
      "Hybrid retrieve (vector + keyword) with a mandatory tenant filter",
      "Rerank the merged candidates",
      "Assemble context within budget, deduplicate near-identical chunks",
      "Generate with instructions to cite and to refuse when unsupported",
      "Verify each citation against the retrieved text before returning",
    ],
    keyDecisions: [
      {
        decision: "Isolation: shared index with filters, or index per tenant",
        tradeoff:
          "Shared is cheap and one bug leaks data. Per-tenant is safer and multiplies operational cost. Whichever you choose, the filter must be enforced server-side, never in the prompt.",
      },
      {
        decision: "Chunk size and overlap",
        tradeoff:
          "Small chunks retrieve precisely and lose context; large chunks preserve context and dilute the embedding. Decide from measured recall, not folklore.",
      },
      {
        decision: "Re-embedding on model change",
        tradeoff:
          "Changing embedding model invalidates the whole index. Version the index and migrate deliberately.",
      },
    ],
    scaling: [
      "Partition the vector index by tenant; keep hot tenants warm",
      "Ingestion on a queue with per-tenant fairness so one bulk upload cannot starve others",
      "Cache frequent queries per tenant, keyed including the permission set",
      "Rerank only the top ~50 candidates, never the whole corpus",
    ],
    failureModes: [
      "The answer simply is not in the retrieved chunks — a retrieval failure blamed on the model",
      "Chunk boundaries splitting the answer in half",
      "Stale index after a source document changed",
      "Permission filter applied after retrieval instead of during it",
      "Embedding model mismatch between ingestion and query time",
    ],
    security: [
      "Enforce permissions at retrieval, in the query, not in the prompt",
      "Treat retrieved document text as untrusted — it can carry injected instructions",
      "Log which chunks fed every answer, for audit",
      "Per-tenant encryption keys if the data justifies it",
    ],
    observability: [
      "Retrieval traces: query, rewritten query, candidates, scores, what was sent",
      "Recall@k tracked continuously on a labelled set, per tenant if possible",
      "Groundedness score and refusal rate",
      "Ingestion lag: document changed → searchable",
    ],
    evaluation: [
      "Retrieval measured separately from generation — most failures are retrieval",
      "Labelled question → expected-chunk set per tenant type",
      "Citation accuracy: do the cited sources actually support the claim?",
      "Regression gate in CI on both retrieval and answer quality",
    ],
    costDrivers: [
      "Embedding cost at ingestion, and again on any re-embed",
      "Reranker calls per query",
      "Context tokens per answer",
      "Vector store memory footprint",
    ],
    commonMistakes: [
      "Treating RAG as embed-and-pray, with no retrieval evaluation",
      "Filtering by tenant in the prompt rather than in the query",
      "One chunk size for every document type",
      "No plan for document updates or deletions",
    ],
    relatedBlueprints: ["bp-rag"],
    relatedSkills: ["rag", "vector-db", "retrieval-eval", "postgres", "ai-security"],
  },
  {
    id: "sd-agent-platform",
    title: "Agent Platform with Tool Access",
    prompt:
      "Design a platform where agents perform multi-step tasks using tools that touch real systems.",
    scale: "Thousands of tasks/day, some irreversible actions, full auditability",
    requirements: [
      "Tools scoped per user and per agent",
      "Human approval before consequential actions",
      "Every step traced and replayable",
      "Bounded cost and step count per task",
    ],
    clarifying: [
      "Which actions are irreversible, and who is accountable for them?",
      "Is a deterministic workflow genuinely insufficient here?",
      "What is the acceptable task failure rate?",
      "Does the agent act as the user, or as a service account?",
    ],
    components: [
      { name: "Task orchestrator", role: "Owns the loop, the step budget and the state." },
      { name: "Tool registry", role: "Schemas, descriptions, permission scopes, rate limits." },
      { name: "Argument validator", role: "Nothing executes on unvalidated model output." },
      { name: "Approval gate", role: "Pauses and persists state awaiting a human decision." },
      { name: "Trace store", role: "Every prompt, tool call, result and token, replayable." },
      { name: "Memory", role: "Short-term working state; long-term facts, retrieved not accumulated." },
    ],
    dataFlow: [
      "Task submitted with the acting user's identity",
      "Orchestrator plans or decomposes",
      "Model proposes a tool call",
      "Validate arguments against the schema; check permission scope",
      "If consequential: persist state, request approval, suspend",
      "Execute with timeout; capture result or structured error",
      "Append to state; loop until done, budget exhausted, or blocked",
      "Return result plus the full trace",
    ],
    keyDecisions: [
      {
        decision: "Agent vs deterministic workflow",
        tradeoff:
          "If the steps are known in advance, a workflow is cheaper, faster, testable and debuggable. Agents earn their cost only when the path genuinely depends on intermediate findings. Be able to argue this either way.",
      },
      {
        decision: "How many tools to expose",
        tradeoff:
          "More tools means more capability and measurably worse selection accuracy. Group and route rather than flattening fifty tools into one prompt.",
      },
      {
        decision: "Where the step budget binds",
        tradeoff:
          "A hard cap prevents runaway cost and truncates legitimate long tasks. Make it per-task and observable.",
      },
    ],
    scaling: [
      "Tasks on a queue with workers; agents are long-running, not request-scoped",
      "Suspended-for-approval tasks must survive a deploy — state in Postgres, not memory",
      "Per-tenant concurrency limits so one runaway task cannot exhaust the pool",
    ],
    failureModes: [
      "Wrong tool chosen because two descriptions overlap",
      "Loop repeating the same failing call until the budget dies",
      "Context exhausted mid-task, losing the goal",
      "Tool errors swallowed and reported as success",
      "Injected instructions in tool output hijacking the agent",
      "An irreversible action taken without approval because the gate was keyed on the wrong field",
    ],
    security: [
      "Least privilege per tool; read and write tools separated",
      "Human approval for anything irreversible or externally visible",
      "All tool output treated as untrusted input",
      "Immutable audit log of every action taken on a user's behalf",
      "Agent acts with the user's permissions, never broader",
    ],
    observability: [
      "Full step trace: prompt, tool, arguments, result, tokens, latency",
      "Tool selection accuracy and tool error rate",
      "Steps and cost per completed task",
      "Approval queue depth and time-to-approval",
    ],
    evaluation: [
      "Task suite with expected outcomes, run repeatedly — reliability is a distribution, not an anecdote",
      "Task success rate, tool selection accuracy, cost per task",
      "A failure taxonomy: where it goes wrong, not just how often",
      "Adversarial suite: prompt injection through tool output",
    ],
    costDrivers: [
      "Steps per task, and context growth across steps",
      "Planning and reflection calls",
      "Retries after tool failures",
    ],
    commonMistakes: [
      "Reaching for an agent where a workflow would do",
      "No step budget",
      "Tools that return unstructured strings the model must guess at",
      "Treating 'it worked when I tried it' as evaluation",
    ],
    relatedBlueprints: ["bp-agent"],
    relatedSkills: ["agents", "tool-calling", "agent-eval", "ai-security", "observability"],
  },
  {
    id: "sd-document-intelligence",
    title: "Document Intelligence Pipeline",
    prompt:
      "Design a system that extracts structured fields from incoming documents — invoices, contracts, forms.",
    scale: "20k documents/day, mixed quality scans, fields feed a billing system",
    requirements: [
      "Structured output conforming to a schema",
      "Confidence routing: uncertain documents go to a human",
      "Auditable: every field traceable to a place in the document",
      "Throughput over latency — this is a batch problem",
    ],
    clarifying: [
      "What does a wrong field cost? That decides the confidence threshold.",
      "Are documents born-digital or scanned? OCR changes everything.",
      "How often does the schema change?",
      "Is there a labelled set, or must one be built?",
    ],
    components: [
      { name: "Intake", role: "Queue, deduplicate, classify document type." },
      { name: "OCR / parser", role: "Text and layout. Layout is signal, not noise." },
      { name: "Extractor", role: "Schema-constrained model call, or a fine-tuned model at volume." },
      { name: "Validator", role: "Schema, types, business rules, cross-field arithmetic." },
      { name: "Review queue", role: "Humans resolve low-confidence and failed-validation cases." },
      { name: "Feedback loop", role: "Human corrections become evaluation and training data." },
    ],
    dataFlow: [
      "Document arrives → queued → classified by type",
      "Parse text and layout",
      "Extract fields against the type's schema",
      "Validate: types, required fields, totals that must reconcile",
      "Score confidence; route below threshold to human review",
      "Emit structured record; store provenance for every field",
      "Corrections feed back into the evaluation set",
    ],
    keyDecisions: [
      {
        decision: "LLM extraction vs a fine-tuned extraction model",
        tradeoff:
          "LLM needs no labels and costs per document. A fine-tuned model is far cheaper at 20k/day and needs a labelled set plus a retraining loop. At this volume the economics usually favour the specialised model, with an LLM fallback for rare types.",
      },
      {
        decision: "Confidence threshold",
        tradeoff:
          "Directly trades human review cost against error cost. Set it from the cost of a wrong field, not from a round number.",
      },
      {
        decision: "Schema evolution",
        tradeoff:
          "Versioned schemas let old documents stay valid; a single mutable schema breaks history.",
      },
    ],
    scaling: [
      "Queue-based, horizontally scaled workers",
      "Batch model calls where the API supports it",
      "Cheap classifier first, expensive extraction only where needed",
    ],
    failureModes: [
      "Poor scan quality silently producing confident nonsense",
      "Schema drift breaking the downstream billing system",
      "Model version change degrading extraction with no alarm",
      "Review queue growing faster than humans can drain it",
    ],
    security: [
      "Documents contain personal and financial data — encryption at rest, retention limits",
      "Redact before sending to a third-party model, or use a private deployment",
      "Access control on the review queue",
    ],
    observability: [
      "Per-field extraction confidence distribution",
      "Human override rate per field — the single best quality signal",
      "Queue depth and processing lag",
      "Cost per document",
    ],
    evaluation: [
      "Labelled holdout set per document type",
      "Per-field precision and recall, not document-level accuracy",
      "Track the confusion pairs — which fields get mixed up",
      "Regression on every model or prompt change",
    ],
    costDrivers: [
      "Tokens per document, driven by document length",
      "Human review hours",
      "OCR cost for scanned input",
    ],
    commonMistakes: [
      "Reporting one accuracy number across all fields",
      "No human path for uncertain cases",
      "Ignoring layout and feeding the model flattened text",
      "Using a frontier model at volume where a small model would do",
    ],
    relatedBlueprints: ["bp-classification"],
    relatedSkills: ["llm-eng", "structured-output", "ml-eval", "queues", "ai-product"],
  },
  {
    id: "sd-support-copilot",
    title: "AI Copilot Inside an Existing Support System",
    prompt:
      "An existing ticketing system handles 5k tickets/day. Add AI without destabilising it.",
    scale: "5k tickets/day, 200 agents, existing Postgres and REST API",
    requirements: [
      "Suggest, never auto-send, at first",
      "Measurable impact on handle time",
      "No change to the existing ticket schema that would require a migration",
      "Fully reversible: a flag turns it all off",
    ],
    clarifying: [
      "Where does an agent actually lose time — triage, searching, or writing?",
      "What is today's baseline handle time? Without it, impact is unprovable.",
      "Is there historical resolved-ticket data to retrieve from?",
      "Who is accountable when a suggestion is wrong?",
    ],
    components: [
      { name: "Sidecar service", role: "New service alongside the existing app; no schema changes." },
      { name: "Classifier", role: "Category and priority on ticket creation." },
      { name: "Retriever", role: "Similar resolved tickets and documentation." },
      { name: "Draft generator", role: "Suggested reply, grounded in retrieved material, with sources." },
      { name: "Feedback capture", role: "Accepted, edited, or discarded — the impact metric." },
      { name: "Feature flags", role: "Per-stage, per-team rollout and instant rollback." },
    ],
    dataFlow: [
      "Ticket created → webhook to the sidecar",
      "Stage 1: classify → write category back through the existing API",
      "Stage 2: summarise long threads for the agent",
      "Stage 3: retrieve similar resolved tickets and docs",
      "Stage 4: draft a suggested reply with citations",
      "Agent accepts, edits or discards — all three recorded",
      "Metrics compared against the pre-AI baseline",
    ],
    keyDecisions: [
      {
        decision: "Stage the rollout rather than shipping a copilot",
        tradeoff:
          "Classification first proves the pipeline, the integration and the measurement with the lowest blast radius. Drafting replies is the highest value and the highest risk — it comes later, once trust exists.",
      },
      {
        decision: "Sidecar vs modifying the existing application",
        tradeoff:
          "A sidecar keeps the existing system's reliability intact and is trivially reversible. It costs an extra network hop and a second deployment.",
      },
      {
        decision: "Suggest vs auto-send",
        tradeoff:
          "Auto-send multiplies both value and damage. Earn it with measured acceptance rates over months, not weeks.",
      },
    ],
    scaling: [
      "Async processing off the ticket-creation path so the existing system never waits",
      "Cache retrieval for recurring issue types",
      "Cheap classifier inline, expensive generation on demand only when the agent opens the ticket",
    ],
    failureModes: [
      "AI service down blocking ticket creation — it must degrade invisibly",
      "Confidently wrong suggestions eroding agent trust permanently",
      "Retrieval surfacing an outdated resolution",
      "Silent quality decay after a model upgrade",
    ],
    security: [
      "Tickets contain customer PII — redaction policy before any external call",
      "Agent permissions respected in retrieval: no surfacing tickets they cannot see",
      "Audit which suggestions were shown and used",
    ],
    observability: [
      "Suggestion acceptance, edit and discard rates per stage",
      "Handle time against the baseline cohort",
      "Latency budget: suggestion must arrive before the agent starts typing",
      "Cost per ticket",
    ],
    evaluation: [
      "Baseline measured before anything ships",
      "Classification: precision and recall per category",
      "Drafts: agent acceptance rate, and edit distance when edited",
      "Business metric: handle time and reopen rate, flagged cohort vs control",
    ],
    costDrivers: [
      "Generation calls per opened ticket",
      "Embedding refresh as the knowledge base changes",
      "Retrieval frequency",
    ],
    commonMistakes: [
      "Shipping the copilot first and the measurement never",
      "Changing the existing schema on day one",
      "No baseline, so impact is a story rather than a number",
      "No off switch",
    ],
    relatedBlueprints: ["bp-classification", "bp-rag"],
    relatedSkills: ["ai-integration", "ai-product", "rag", "ai-eval", "reliability"],
  },
  {
    id: "sd-semantic-search",
    title: "Semantic Search Over a Large Catalogue",
    prompt:
      "Replace keyword search with something that understands intent, over 5M items.",
    scale: "5M items, 500 queries/second at peak, p95 under 200ms",
    requirements: [
      "Sub-200ms at p95 — this rules out an LLM in the request path",
      "Exact matches (IDs, model numbers) must still win",
      "Filters and facets combine with relevance",
      "Ranking quality measurable against current keyword search",
    ],
    clarifying: [
      "What does a successful search look like — a click, a purchase, no reformulation?",
      "How often does the catalogue change?",
      "Is there query and click history to learn from?",
    ],
    components: [
      { name: "Keyword index", role: "BM25. Still the best answer for exact terms." },
      { name: "Vector index", role: "Intent and synonym matching." },
      { name: "Fusion", role: "Reciprocal rank fusion or weighted merge of both result sets." },
      { name: "Reranker", role: "Cross-encoder over the top N, within the latency budget." },
      { name: "Embedding pipeline", role: "Keeps vectors current as the catalogue changes." },
    ],
    dataFlow: [
      "Query → normalise → detect exact-match patterns (IDs, codes)",
      "Run keyword and vector retrieval in parallel",
      "Fuse the result sets",
      "Rerank the top candidates if the latency budget allows",
      "Apply filters and business rules",
      "Return results, log the query and what was clicked",
    ],
    keyDecisions: [
      {
        decision: "Hybrid, not pure vector",
        tradeoff:
          "Embeddings are poor at exact identifiers and rare terms. Keyword search is poor at intent. Neither alone is good enough; the interesting work is in the fusion weights.",
      },
      {
        decision: "Rerank or not",
        tradeoff:
          "A cross-encoder meaningfully improves precision and costs 20-50ms. At 500 qps that is a real capacity decision.",
      },
      {
        decision: "No LLM in the hot path",
        tradeoff:
          "Query rewriting with an LLM helps quality and destroys the latency budget. Precompute rewrites for common queries instead.",
      },
    ],
    scaling: [
      "Both indexes replicated and read-scaled",
      "Cache the head of the query distribution — it is extremely skewed",
      "Incremental index updates, never full rebuilds during traffic",
    ],
    failureModes: [
      "Exact identifier searches returning 'similar' items instead of the item",
      "Embedding model change silently reordering everything",
      "Index lag after a catalogue update",
      "Reranker timeout degrading to unranked results with no alarm",
    ],
    security: [
      "Respect per-user visibility rules inside the query, not after",
      "Rate limit to prevent catalogue scraping",
    ],
    observability: [
      "Click-through rate at position, zero-result rate, reformulation rate",
      "Latency split by stage: retrieve, fuse, rerank",
      "Index freshness lag",
    ],
    evaluation: [
      "Offline: labelled query → relevant item set, measured with NDCG and recall@k",
      "Online: interleaving or A/B against the existing keyword search",
      "Never ship on offline metrics alone",
    ],
    costDrivers: [
      "Embedding refresh as the catalogue churns",
      "Reranker compute at peak qps",
      "Vector index memory",
    ],
    commonMistakes: [
      "Replacing keyword search entirely instead of combining",
      "Putting an LLM in a 200ms path",
      "No offline evaluation set, so quality is anecdotal",
    ],
    relatedBlueprints: ["bp-rag"],
    relatedSkills: ["embeddings", "vector-db", "retrieval-eval", "system-design"],
  },
  {
    id: "sd-model-serving",
    title: "ML Model Serving",
    prompt:
      "Serve a trained model to production traffic, with versioning and safe rollout.",
    scale: "2k requests/second, p99 under 100ms, weekly retraining",
    requirements: [
      "Reproducible: any prediction traceable to a model version and input",
      "Safe rollout with fast rollback",
      "Drift detected before users notice",
      "Training and serving features computed identically",
    ],
    clarifying: [
      "What is the cost of a wrong prediction, and is it symmetric?",
      "Can features be computed at request time, or must they be precomputed?",
      "How quickly does the world change — what is the retraining cadence?",
    ],
    components: [
      { name: "Model registry", role: "Versioned artifacts with metrics and lineage." },
      { name: "Inference service", role: "Loads a pinned version, exposes a typed API." },
      { name: "Feature source", role: "The same code path for training and serving." },
      { name: "Shadow deployment", role: "New version scored on live traffic without serving it." },
      { name: "Monitoring", role: "Input distribution, prediction distribution, outcome lag." },
    ],
    dataFlow: [
      "Request → validate → fetch or compute features",
      "Predict with the pinned model version",
      "Return prediction with version and confidence",
      "Log input, features, prediction and version",
      "Join with the outcome when it arrives, for true performance",
    ],
    keyDecisions: [
      {
        decision: "Training/serving skew prevention",
        tradeoff:
          "Sharing one feature implementation is more constrained to write and eliminates the single most common cause of models that look good offline and fail in production.",
      },
      {
        decision: "Shadow, canary or straight swap",
        tradeoff:
          "Shadow costs double inference and catches problems before any user sees them. For a model with asymmetric error cost this is cheap insurance.",
      },
      {
        decision: "Batch vs real-time features",
        tradeoff:
          "Precomputed is fast and stale; real-time is fresh and adds latency plus a dependency.",
      },
    ],
    scaling: [
      "Horizontal replicas behind a load balancer; models are stateless",
      "Batch requests within a few milliseconds where throughput matters more than p99",
      "Keep the model in memory; never load per request",
    ],
    failureModes: [
      "Training/serving skew — different feature code in each path",
      "Silent drift: inputs change, metrics look fine because labels lag",
      "A new version deployed with no rollback path",
      "Feature store outage taking down inference",
    ],
    security: [
      "Model artifacts are intellectual property — access controlled",
      "Input validation: adversarial inputs can extract training data",
      "PII in features needs the same protection as anywhere else",
    ],
    observability: [
      "Prediction distribution over time, versus training distribution",
      "Feature null and out-of-range rates",
      "Latency by stage; model load time",
      "Performance against labels once they arrive",
    ],
    evaluation: [
      "Offline metrics on a holdout set, chosen from error cost",
      "Shadow comparison against the incumbent on live traffic",
      "Ongoing evaluation against delayed ground truth",
    ],
    costDrivers: [
      "Inference compute at peak; GPU vs CPU",
      "Feature computation and storage",
      "Shadow running doubles inference cost during rollout",
    ],
    commonMistakes: [
      "No model versioning, so a regression cannot be traced",
      "Monitoring latency but not prediction quality",
      "Assuming offline metrics transfer to production",
    ],
    relatedBlueprints: ["bp-ai-service"],
    relatedSkills: ["mlops", "ml-eval", "fastapi", "docker", "observability"],
  },
  {
    id: "sd-eval-pipeline",
    title: "Evaluation Pipeline for an AI Product",
    prompt:
      "Design the system that tells you whether your AI got better or worse this week.",
    scale: "Runs on every merge; 500-case golden set; must finish in under 15 minutes",
    requirements: [
      "Deterministic enough to compare runs",
      "Blocks a merge that degrades quality",
      "Cheap enough to run constantly",
      "Distinguishes retrieval failures from generation failures",
    ],
    clarifying: [
      "What does 'better' mean here — correctness, groundedness, tone, cost?",
      "Who owns the golden set, and how does it grow?",
      "Is there human-labelled ground truth, or only judgements?",
    ],
    components: [
      { name: "Golden set", role: "Versioned cases with expected outputs or rubrics." },
      { name: "Runner", role: "Executes cases against a pinned system version, in parallel." },
      { name: "Scorers", role: "Exact match, similarity, rubric-based judge — per case type." },
      { name: "Comparison", role: "This run against the baseline, per metric and per slice." },
      { name: "Gate", role: "Fails CI on regression beyond a threshold." },
    ],
    dataFlow: [
      "Merge triggers the pipeline",
      "Load the golden set at its pinned version",
      "Run cases in parallel against the candidate build",
      "Score each case; aggregate overall and by slice",
      "Compare to the stored baseline",
      "Pass, or fail with the specific regressed cases named",
      "Store results so trends outlive any single run",
    ],
    keyDecisions: [
      {
        decision: "LLM-as-judge or human labels",
        tradeoff:
          "A judge scales and is biased — toward verbosity, toward its own family's style. Calibrate it against human labels on a subset, and re-calibrate when you change the judge model.",
      },
      {
        decision: "Gate hard or report only",
        tradeoff:
          "A hard gate stops regressions and will eventually block a legitimate change at an inconvenient moment. Non-blocking reports get ignored within a month. Gate on a small high-confidence subset; report the rest.",
      },
      {
        decision: "Sample size",
        tradeoff:
          "Small sets are cheap, fast and noisy enough to miss real regressions. Compute how large the set must be to detect the change you care about.",
      },
    ],
    scaling: [
      "Parallelise cases; the bottleneck is provider rate limits, not compute",
      "Cache model responses keyed by (prompt, model, params) for unchanged cases",
      "Tier it: fast subset per commit, full set nightly",
    ],
    failureModes: [
      "Golden set overfitted — the system passes it and fails reality",
      "Judge drift when the judge model is silently upgraded",
      "Flaky cases training everyone to ignore failures",
      "Cost of evaluation exceeding the cost of serving",
    ],
    security: [
      "Golden sets often contain real user data — treat accordingly",
      "Evaluation API keys scoped and budgeted separately",
    ],
    observability: [
      "Quality trend per metric over time, not just pass/fail",
      "Cost and duration per run",
      "Per-slice breakdown so a regression in one document type is visible",
    ],
    evaluation: [
      "Evaluate the evaluator: agreement between judge and human labels",
      "Track how often the gate was right when it blocked",
    ],
    costDrivers: [
      "Cases × runs per day × tokens per case",
      "Judge calls, which are often larger than the system call itself",
    ],
    commonMistakes: [
      "Building this after shipping instead of before",
      "One aggregate number hiding a regression in a subgroup",
      "Never updating the golden set as the product changes",
    ],
    relatedBlueprints: ["bp-ai-service", "bp-rag"],
    relatedSkills: ["ai-eval", "retrieval-eval", "cicd", "llmops"],
  },
];

export const designBriefById = new Map(designBriefs.map((d) => [d.id, d]));
