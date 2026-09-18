/**
 * Career readiness areas.
 *
 * Each area maps to the skills that actually evidence it, states what a strong
 * candidate can show, and lists the questions an interviewer will probe with.
 * Readiness is computed from skill evidence — never declared.
 */

export interface CareerArea {
  id: string;
  name: string;
  /** Which of the four tracks this belongs to. */
  group: "AI" | "Engineering" | "Production" | "Career";
  /** Skill ids that evidence this area. */
  skills: string[];
  /** What someone hiring for this expects to see. */
  expected: string;
  /** Concrete artifacts that prove it. */
  provenBy: string[];
  /** Questions you must be able to answer out loud. */
  probes: string[];
}

export const careerAreas: CareerArea[] = [
  {
    id: "ca-python",
    name: "Python",
    group: "Engineering",
    skills: ["python-core", "python-errors", "python-oop", "python-typing", "python-advanced"],
    expected:
      "Writes Python another engineer would accept without comment: structured, typed, error-handled, tested.",
    provenBy: [
      "A project with modules, types and a test suite",
      "Custom exceptions used where they help",
      "A decorator and a context manager you wrote and can explain",
    ],
    probes: [
      "When would you use a dataclass over a dict, and over a class?",
      "What does a bare except cost you?",
      "Explain a generator's memory behaviour versus a list.",
    ],
  },
  {
    id: "ca-testing",
    name: "Testing and Debugging",
    group: "Engineering",
    skills: ["python-testing", "code-review"],
    expected:
      "Tests failure paths as readily as happy paths, and can say what the suite does not cover.",
    provenBy: [
      "A suite covering edge cases and failures",
      "Fixtures isolating tests from real data",
      "Tests running in CI on every push",
    ],
    probes: [
      "What does your test suite not cover?",
      "How do you test code that calls an external API?",
      "Describe a bug your tests would not have caught.",
    ],
  },
  {
    id: "ca-dsa",
    name: "Data Structures and Algorithms",
    group: "Engineering",
    skills: ["dsa", "cs-systems"],
    expected:
      "Chooses structures deliberately and can state the cost of their own code. Solves while explaining.",
    provenBy: [
      "Sustained problem practice, not a pre-interview cram",
      "Complexity stated for your own functions",
      "A performance problem found by measurement and fixed",
    ],
    probes: [
      "What is the complexity of the code you wrote last week?",
      "When is a hash table the wrong choice?",
      "Walk through your approach before you start typing.",
    ],
  },
  {
    id: "ca-sql",
    name: "SQL and Databases",
    group: "Engineering",
    skills: ["sql", "postgres"],
    expected:
      "Designs a workable schema, writes non-trivial queries, and can explain why one is slow.",
    provenBy: [
      "A normalised schema you designed for a real application",
      "An index added with a measured before and after",
      "A migration run against existing data without loss",
    ],
    probes: [
      "Walk me through your schema and why it is shaped that way.",
      "How would you find and fix a slow query?",
      "When would you denormalise?",
    ],
  },
  {
    id: "ca-ml",
    name: "Machine Learning",
    group: "AI",
    skills: ["ml-core", "ml-eval", "pandas", "numpy"],
    expected:
      "Picks a model for a stated reason, evaluates honestly, and knows when ML is the wrong tool.",
    provenBy: [
      "An end-to-end project with a baseline and a defended metric choice",
      "A leakage check you actually performed",
      "A case where you chose rules over ML",
    ],
    probes: [
      "Why that metric and not accuracy?",
      "How did you know there was no leakage?",
      "What would make this problem unsuitable for ML?",
    ],
  },
  {
    id: "ca-dl",
    name: "Deep Learning",
    group: "AI",
    skills: ["dl-core", "pytorch", "math-calc", "math-linalg"],
    expected:
      "Understands the gradient path well enough to debug training, not only to run it.",
    provenBy: [
      "Backpropagation implemented once from scratch",
      "A training run you diagnosed from the curves",
      "A fine-tuned model with checkpoints",
    ],
    probes: [
      "Your loss is not decreasing. What do you check, in order?",
      "Why did attention displace recurrence?",
      "What does the learning rate actually control?",
    ],
  },
  {
    id: "ca-llm",
    name: "LLM Engineering",
    group: "AI",
    skills: ["llm-eng", "prompt-eng", "structured-output", "transformers", "open-models"],
    expected:
      "Builds reliable software on an unreliable, non-deterministic, metered dependency.",
    provenBy: [
      "Structured output validated and repaired on failure",
      "Retries, timeouts and a fallback path",
      "Cost and latency tracked per request",
      "Prompts versioned in the repo with tests",
    ],
    probes: [
      "What happens when the provider returns a 429 at 3am?",
      "How do you know a prompt change was an improvement?",
      "Why this model and not a cheaper one — with numbers.",
    ],
  },
  {
    id: "ca-rag",
    name: "RAG",
    group: "AI",
    skills: ["rag", "embeddings", "vector-db", "retrieval-eval"],
    expected:
      "Treats retrieval as the hard part and measures it separately from generation.",
    provenBy: [
      "Hybrid retrieval with reranking",
      "A labelled evaluation set and a recall@k number that improved",
      "Citations verified against source text",
      "An answer to why this chunk size",
    ],
    probes: [
      "A user got a wrong answer. Retrieval or generation — how do you tell?",
      "Why that chunking strategy?",
      "How do you keep the index fresh, and enforce permissions?",
    ],
  },
  {
    id: "ca-agents",
    name: "AI Agents",
    group: "AI",
    skills: ["agents", "tool-calling", "agent-eval"],
    expected:
      "Builds tool-using systems with guardrails and measurement — and argues for a workflow when that is right.",
    provenBy: [
      "Tool schemas an LLM uses correctly, with validated arguments",
      "Human approval before consequential actions",
      "Step traces and a measured task success rate",
      "A written comparison against a deterministic workflow",
    ],
    probes: [
      "When should you not use an agent?",
      "How do you stop a runaway loop?",
      "What is your agent's task success rate, and how do you know?",
    ],
  },
  {
    id: "ca-backend",
    name: "Backend Engineering",
    group: "Engineering",
    skills: ["fastapi", "api-design", "auth", "python-async", "queues", "redis"],
    expected:
      "Ships APIs that validate input, fail predictably and stay fast when the model call is slow.",
    provenBy: [
      "A tested, documented API with auth",
      "Slow work moved onto a queue",
      "Caching with a stated invalidation strategy",
    ],
    probes: [
      "How do you keep a request fast when the model takes eight seconds?",
      "Authentication versus authorization in your own code.",
      "What is your error contract?",
    ],
  },
  {
    id: "ca-fullstack",
    name: "Full-Stack",
    group: "Engineering",
    skills: ["react", "typescript", "nextjs"],
    expected:
      "Builds an interface that makes an AI system usable, including when the model is uncertain or broken.",
    provenBy: [
      "A UI handling loading, error and empty states properly",
      "Streaming responses rendered",
      "An honest failure state when the AI is unavailable",
    ],
    probes: [
      "How does your UI behave when the model is down?",
      "How do you show uncertainty without lying to the user?",
    ],
  },
  {
    id: "ca-devops",
    name: "Docker, Cloud and CI/CD",
    group: "Production",
    skills: ["docker", "cicd", "github-actions", "cloud", "linux"],
    expected:
      "Ships by merging. Can containerise, deploy, observe and roll back a real service.",
    provenBy: [
      "A containerised AI service with a sensible image size",
      "CI running tests, lint and type checks on every push",
      "A deployed service with health checks and a rollback you performed",
    ],
    probes: [
      "Walk me through your pipeline from commit to running service.",
      "Your image is 2GB. What do you do?",
      "How do you handle secrets?",
    ],
  },
  {
    id: "ca-mlops",
    name: "MLOps, LLMOps and Observability",
    group: "Production",
    skills: ["mlops", "llmops", "observability"],
    expected:
      "Can answer 'why did it do that?' from telemetry rather than guesswork, and reproduce a result months later.",
    provenBy: [
      "Every model call traced with tokens, cost and version",
      "Prompts versioned with the code",
      "Evaluation running automatically on change",
      "An incident diagnosed from traces alone",
    ],
    probes: [
      "A user says the answer was wrong yesterday. Can you reconstruct what happened?",
      "How do you detect quality decay after a provider upgrades a model?",
    ],
  },
  {
    id: "ca-eval",
    name: "AI Evaluation",
    group: "AI",
    skills: ["ai-eval", "retrieval-eval", "agent-eval", "ml-eval"],
    expected:
      "Defines success before building, and can prove an improvement rather than assert it.",
    provenBy: [
      "A golden set built before shipping",
      "A baseline number, then a measured improvement",
      "A regression caught by evaluation in CI",
    ],
    probes: [
      "How do you know your system got better this month?",
      "What are the limits of LLM-as-judge?",
      "How large does your eval set need to be?",
    ],
  },
  {
    id: "ca-security",
    name: "AI Security and Reliability",
    group: "Production",
    skills: ["ai-security", "reliability"],
    expected:
      "Treats an AI system with tools as an attack surface that takes instructions from text.",
    provenBy: [
      "Prompt injection reproduced against your own system, then fixed",
      "Least-privilege tool scoping and an audit log",
      "Timeouts, retries and a fallback on every external call",
      "A written threat model",
    ],
    probes: [
      "How would you attack your own agent?",
      "What happens when your model provider is down?",
      "Where could a secret leak in your system?",
    ],
  },
  {
    id: "ca-system-design",
    name: "AI System Design",
    group: "Career",
    skills: ["system-design", "code-architecture", "cs-networking"],
    expected:
      "Drives a design from requirements, names tradeoffs, and estimates cost before building.",
    provenBy: [
      "Written designs with tradeoffs and failure modes",
      "A cost estimate made before implementation",
      "An architecture decision recorded with its alternatives",
    ],
    probes: [
      "Design a multi-tenant RAG platform. Start with questions.",
      "Why not just use X?",
      "What breaks first at ten times the load?",
    ],
  },
  {
    id: "ca-integration",
    name: "AI Into Existing Systems",
    group: "Career",
    skills: ["ai-integration", "ai-product"],
    expected:
      "Finds where AI creates value in software that already exists, and ships it without destabilising anything.",
    provenBy: [
      "An opportunity assessment with a measured baseline",
      "A feature shipped behind a flag",
      "Impact stated in business terms",
    ],
    probes: [
      "Where would you add AI to our product, and why there?",
      "How would you prove it worked?",
      "When would you tell a stakeholder that AI is the wrong answer?",
    ],
  },
  {
    id: "ca-portfolio",
    name: "Portfolio and Communication",
    group: "Career",
    skills: ["portfolio", "interview", "git"],
    expected:
      "Two to four deep projects a stranger can evaluate in five minutes, and can defend under questioning.",
    provenBy: [
      "READMEs that explain the problem, architecture and limitations",
      "Published evaluation results",
      "A readable git history",
      "Each project explained in two minutes",
    ],
    probes: [
      "Walk me through your hardest project.",
      "What would you do differently?",
      "Tell me about a bug that taught you something.",
    ],
  },
];

export const careerAreaById = new Map(careerAreas.map((a) => [a.id, a]));
