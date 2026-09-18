import type { Phase } from "./types";

/**
 * The 24-phase curriculum.
 *
 * Phases are NOT a waterfall. Order is the suggested centre of gravity, but the
 * four tracks run in parallel: production and career work start early (CI in
 * Phase 2) and keep growing, rather than being saved for the final months.
 *
 * authoring: "detailed" phases have day-by-day missions in /src/data/days.
 * "outline" phases are authored on approach so they adapt to real pace.
 */
export const phases: Phase[] = [
  {
    id: "p01-python",
    order: 1,
    title: "Python Engineering Foundations",
    track: "software",
    summary:
      "Move from writing scripts that work to writing Python another engineer would accept: modules, error handling, types, tests, logging and project structure.",
    estimatedDays: 34,
    dependsOn: [],
    authoring: "detailed",
    milestone:
      "Expense Tracker becomes a tested, typed, logged, installable CLI package with a real README.",
    modules: [
      {
        id: "m-py-files",
        phaseId: "p01-python",
        title: "Files, Paths and JSON",
        description:
          "Reading and writing data that survives the program exiting, without corrupting it.",
        outcomes: [
          "Resolve paths correctly regardless of working directory",
          "Distinguish missing file, empty file and corrupt file, and handle each differently",
          "Write data without risking loss on a partial write",
        ],
        skills: ["python-core", "python-errors"],
      },
      {
        id: "m-py-structure",
        phaseId: "p01-python",
        title: "Modules, Packages and Project Structure",
        description:
          "Splitting a growing program into parts with clear responsibilities.",
        outcomes: [
          "Separate data access, business logic and presentation",
          "Understand imports, __init__.py and why __pycache__ exists",
          "Explain why a function belongs in one module and not another",
        ],
        skills: ["python-core", "code-architecture"],
      },
      {
        id: "m-py-errors",
        phaseId: "p01-python",
        title: "Exceptions and Defensive Input",
        description:
          "Failing usefully: validation at the edges, custom exceptions, and never swallowing errors silently.",
        outcomes: [
          "Validate user input at the boundary, not deep in the logic",
          "Write and raise custom exception types",
          "Explain why a bare except is a bug",
        ],
        skills: ["python-errors", "reliability"],
      },
      {
        id: "m-py-datamodel",
        phaseId: "p01-python",
        title: "OOP, Dataclasses and Type Hints",
        description:
          "Modelling the domain with classes and dataclasses, and making the shape of data explicit.",
        outcomes: [
          "Choose between a dict, a dataclass and a class deliberately",
          "Use type hints a checker can verify",
          "Implement the magic methods that make objects behave naturally",
        ],
        skills: ["python-oop", "python-typing"],
      },
      {
        id: "m-py-testing",
        phaseId: "p01-python",
        title: "Testing with pytest",
        description:
          "Automated verification: the skill that separates a script from software.",
        outcomes: [
          "Write tests for happy path, edge case and failure",
          "Use fixtures and tmp_path to test file I/O safely",
          "Explain what your tests do not cover",
        ],
        skills: ["python-testing"],
      },
      {
        id: "m-py-craft",
        phaseId: "p01-python",
        title: "Logging, Config, venv and Packaging",
        description:
          "The surrounding engineering: environments, dependencies, configuration, logging and a runnable CLI.",
        outcomes: [
          "Run the project in a virtual environment with pinned dependencies",
          "Replace print debugging with real logging",
          "Read configuration from environment variables, not hard-coded constants",
        ],
        skills: ["python-core", "cli-apps", "observability"],
      },
      {
        id: "m-py-advanced",
        phaseId: "p01-python",
        title: "Comprehensions, Generators, Decorators, Context Managers",
        description:
          "The Python-specific tools you will meet constantly in AI and backend codebases.",
        outcomes: [
          "Read and write generator pipelines over large data",
          "Write a decorator that adds retry or timing behaviour",
          "Write a context manager that guarantees cleanup",
        ],
        skills: ["python-core", "python-advanced"],
      },
    ],
  },
  {
    id: "p02-git",
    order: 2,
    title: "Git, GitHub and Developer Workflow",
    track: "software",
    summary:
      "Git as a daily engineering practice: branches, pull requests, review, conflict resolution and a history someone else can read. Ends with your first CI pipeline.",
    estimatedDays: 12,
    dependsOn: ["p01-python"],
    authoring: "detailed",
    milestone:
      "A feature shipped through a branch and a self-reviewed pull request, with CI running your tests on every push.",
    modules: [
      {
        id: "m-git-core",
        phaseId: "p02-git",
        title: "Core Git Model",
        description:
          "What a commit actually is, and why that makes branching cheap.",
        outcomes: [
          "Explain working tree, staging area and commit",
          "Write commit messages that explain why, not what",
          "Recover from common mistakes without panic",
        ],
        skills: ["git"],
      },
      {
        id: "m-git-branching",
        phaseId: "p02-git",
        title: "Branches, Merges and Conflicts",
        description:
          "Working on more than one thing, and reconciling divergent history.",
        outcomes: [
          "Use a branch per feature by default",
          "Resolve a merge conflict deliberately",
          "Explain merge vs rebase and when each is appropriate",
        ],
        skills: ["git"],
      },
      {
        id: "m-git-collab",
        phaseId: "p02-git",
        title: "GitHub, Pull Requests and Review",
        description:
          "The collaboration layer: PRs, review comments, issues and releases.",
        outcomes: [
          "Open a pull request with a description that stands alone",
          "Review your own diff critically before merging",
          "Track work with issues instead of memory",
        ],
        skills: ["git", "code-review"],
      },
      {
        id: "m-git-ci",
        phaseId: "p02-git",
        title: "First CI Pipeline",
        description:
          "GitHub Actions running your tests on every push. Production engineering starts here, not in month eleven.",
        outcomes: [
          "Explain triggers, jobs, steps and actions",
          "Run lint and pytest automatically on push",
          "Read a failing CI log and fix the cause",
        ],
        skills: ["github-actions", "cicd", "python-testing"],
      },
    ],
  },
  {
    id: "p03-cs",
    order: 3,
    title: "Computer Science Foundations",
    track: "software",
    summary:
      "Data structures, algorithms and complexity, practised continuously rather than crammed. Plus the OS and networking concepts production work assumes.",
    estimatedDays: 40,
    dependsOn: ["p01-python"],
    authoring: "outline",
    milestone:
      "A sustained DSA practice habit, plus the ability to reason about the cost of your own code.",
    modules: [
      {
        id: "m-cs-complexity",
        phaseId: "p03-cs",
        title: "Big O and Core Structures",
        description: "Arrays, hash tables, stacks, queues, linked lists.",
        outcomes: [
          "State the time and space cost of code you wrote",
          "Choose the structure that makes the hot operation cheap",
        ],
        skills: ["dsa"],
      },
      {
        id: "m-cs-algorithms",
        phaseId: "p03-cs",
        title: "Recursion, Sorting, Searching, Trees, Graphs, DP",
        description:
          "The algorithm families that interviews and real systems both use.",
        outcomes: [
          "Implement traversal and search from scratch",
          "Recognise which family a new problem belongs to",
        ],
        skills: ["dsa"],
      },
      {
        id: "m-cs-systems",
        phaseId: "p03-cs",
        title: "Processes, Threads, Concurrency",
        description: "What actually runs when your program runs.",
        outcomes: [
          "Explain concurrency vs parallelism and the GIL's real effect",
          "Choose threads, processes or async for a given workload",
        ],
        skills: ["cs-systems", "python-async"],
      },
      {
        id: "m-cs-network",
        phaseId: "p03-cs",
        title: "Networking, HTTP, DNS, REST",
        description: "How a request actually reaches your API and comes back.",
        outcomes: [
          "Trace an HTTP request end to end",
          "Read status codes, headers and payloads fluently",
        ],
        skills: ["cs-networking", "api-design"],
      },
      {
        id: "m-cs-design",
        phaseId: "p03-cs",
        title: "SOLID, Design Patterns, Clean Architecture",
        description: "Structuring code that keeps changing without rotting.",
        outcomes: [
          "Identify which principle a painful refactor violated",
          "Apply a pattern because it fits, not to look sophisticated",
        ],
        skills: ["code-architecture"],
      },
    ],
  },
  {
    id: "p04-math",
    order: 4,
    title: "Mathematics and Statistics for AI",
    track: "ai",
    summary:
      "Linear algebra, probability, statistics and calculus taught against real ML code, so the maths explains model behaviour instead of sitting beside it.",
    estimatedDays: 30,
    dependsOn: ["p01-python"],
    authoring: "outline",
    milestone:
      "Able to explain gradient descent, a covariance matrix and a p-value in terms of code you have run.",
    modules: [
      {
        id: "m-math-linalg",
        phaseId: "p04-math",
        title: "Linear Algebra",
        description: "Vectors, matrices, operations, eigenvalues, PCA.",
        outcomes: [
          "Express a model's forward pass as matrix operations",
          "Explain what an embedding's dimensions mean geometrically",
        ],
        skills: ["math-linalg", "numpy"],
      },
      {
        id: "m-math-prob",
        phaseId: "p04-math",
        title: "Probability",
        description:
          "Conditional probability, Bayes, distributions, expectation, variance.",
        outcomes: [
          "Reason about a classifier's confidence honestly",
          "Apply Bayes to a real base-rate problem",
        ],
        skills: ["math-prob"],
      },
      {
        id: "m-math-stats",
        phaseId: "p04-math",
        title: "Statistics",
        description:
          "Sampling, hypothesis testing, confidence intervals, correlation.",
        outcomes: [
          "Say whether a measured improvement is real",
          "Avoid concluding causation from correlation in your own analysis",
        ],
        skills: ["math-stats"],
      },
      {
        id: "m-math-calc",
        phaseId: "p04-math",
        title: "Calculus and Optimisation",
        description: "Derivatives, partial derivatives, gradients, chain rule.",
        outcomes: [
          "Derive backpropagation for a tiny network by hand",
          "Explain why a learning rate can diverge",
        ],
        skills: ["math-calc"],
      },
    ],
  },
  {
    id: "p05-data",
    order: 5,
    title: "Data Engineering Basics: NumPy, Pandas, SQL",
    track: "software",
    summary:
      "Getting data in, cleaning it, and querying it properly. The unglamorous work most AI failures trace back to.",
    estimatedDays: 28,
    dependsOn: ["p01-python"],
    authoring: "outline",
    milestone:
      "Expense Tracker's JSON store replaced by PostgreSQL, with analysis done in SQL and pandas.",
    modules: [
      {
        id: "m-data-numpy",
        phaseId: "p05-data",
        title: "NumPy",
        description: "Arrays, vectorisation, broadcasting, shapes.",
        outcomes: [
          "Replace loops with vectorised operations",
          "Debug a shape mismatch confidently",
        ],
        skills: ["numpy", "math-linalg"],
      },
      {
        id: "m-data-pandas",
        phaseId: "p05-data",
        title: "Pandas and Data Cleaning",
        description:
          "Loading, cleaning, reshaping, grouping and joining real messy data.",
        outcomes: [
          "Handle missing and malformed values on purpose",
          "Explain what a groupby actually computed",
        ],
        skills: ["pandas"],
      },
      {
        id: "m-data-sql",
        phaseId: "p05-data",
        title: "SQL and PostgreSQL",
        description: "Schema design, joins, aggregation, indexes, transactions.",
        outcomes: [
          "Design a normalised schema for a real application",
          "Explain why a query is slow and fix it with an index",
        ],
        skills: ["sql", "postgres"],
      },
    ],
  },
  {
    id: "p06-ml",
    order: 6,
    title: "Classical Machine Learning",
    track: "ai",
    summary:
      "Supervised and unsupervised learning with honest evaluation. The judgement to say when ML is the wrong tool starts here.",
    estimatedDays: 40,
    dependsOn: ["p05-data", "p04-math"],
    authoring: "outline",
    milestone:
      "An end-to-end ML project with a defensible metric choice, a leakage check, and a written explanation of why the model is appropriate.",
    modules: [
      {
        id: "m-ml-prep",
        phaseId: "p06-ml",
        title: "Preprocessing and Feature Engineering",
        description:
          "Missing values, encoding, scaling, splits, cross-validation.",
        outcomes: ["Build a leak-free pipeline", "Justify every transformation"],
        skills: ["ml-core"],
      },
      {
        id: "m-ml-supervised",
        phaseId: "p06-ml",
        title: "Regression and Classification",
        description:
          "Linear models, trees, random forests, gradient boosting, SVM, KNN, Naive Bayes.",
        outcomes: [
          "Pick a model family for a reason",
          "Tune hyperparameters without fooling yourself",
        ],
        skills: ["ml-core"],
      },
      {
        id: "m-ml-unsupervised",
        phaseId: "p06-ml",
        title: "Clustering and Dimensionality Reduction",
        description: "K-means, DBSCAN, hierarchical clustering, PCA.",
        outcomes: [
          "Evaluate clusters without labels",
          "Use PCA without treating it as magic",
        ],
        skills: ["ml-core", "math-linalg"],
      },
      {
        id: "m-ml-eval",
        phaseId: "p06-ml",
        title: "Evaluation, Bias/Variance, Leakage",
        description:
          "Accuracy, precision, recall, F1, ROC-AUC, MAE/MSE/RMSE, R-squared, thresholds, class imbalance.",
        outcomes: [
          "Choose a metric from the cost of each error type",
          "Detect data leakage before it reaches production",
        ],
        skills: ["ml-eval"],
      },
    ],
  },
  {
    id: "p07-dl",
    order: 7,
    title: "Deep Learning and PyTorch",
    track: "ai",
    summary:
      "Neural networks understood from the gradient up, then built properly with PyTorch.",
    estimatedDays: 35,
    dependsOn: ["p06-ml"],
    authoring: "outline",
    milestone:
      "A network implemented from scratch once, then a trained PyTorch model with checkpoints and a validation curve you can interpret.",
    modules: [
      {
        id: "m-dl-fundamentals",
        phaseId: "p07-dl",
        title: "Networks from Scratch",
        description:
          "Forward pass, loss, backpropagation, gradient descent, activations.",
        outcomes: [
          "Implement backprop without a framework once",
          "Explain a dead or exploding gradient",
        ],
        skills: ["dl-core", "math-calc"],
      },
      {
        id: "m-dl-pytorch",
        phaseId: "p07-dl",
        title: "PyTorch in Practice",
        description:
          "Tensors, autograd, Datasets, DataLoaders, training loops, checkpoints, GPU basics.",
        outcomes: [
          "Write a training loop from memory",
          "Diagnose overfitting from the curves",
        ],
        skills: ["pytorch"],
      },
      {
        id: "m-dl-arch",
        phaseId: "p07-dl",
        title: "CNNs, Transfer Learning, Sequence Models",
        description:
          "Convolution, pretrained backbones, fine-tuning, recurrence and its limits.",
        outcomes: [
          "Fine-tune rather than train from zero",
          "Explain why attention replaced recurrence",
        ],
        skills: ["dl-core", "pytorch"],
      },
    ],
  },
  {
    id: "p08-cv",
    order: 8,
    title: "Computer Vision",
    track: "ai",
    summary:
      "Image data, convolutional models, transfer learning and vision-language models. Kept proportionate: deep enough to build, not a specialisation.",
    estimatedDays: 18,
    dependsOn: ["p07-dl"],
    authoring: "outline",
    milestone: "An image task solved with transfer learning and evaluated honestly.",
    modules: [
      {
        id: "m-cv-core",
        phaseId: "p08-cv",
        title: "Image Pipelines and CNNs",
        description: "Loading, augmentation, training, evaluation.",
        outcomes: ["Build an image classifier that generalises"],
        skills: ["cv", "pytorch"],
      },
      {
        id: "m-cv-modern",
        phaseId: "p08-cv",
        title: "Vision Transformers and VLMs",
        description:
          "Modern multimodal models and when they beat a task-specific CNN.",
        outcomes: [
          "Choose between a small fine-tuned model and a large multimodal one",
        ],
        skills: ["cv", "llm-eng"],
      },
    ],
  },
  {
    id: "p09-nlp",
    order: 9,
    title: "Natural Language Processing",
    track: "ai",
    summary:
      "Text as data: tokenisation, classical representations, embeddings and sequence modelling — the ground LLMs stand on.",
    estimatedDays: 22,
    dependsOn: ["p07-dl"],
    authoring: "outline",
    milestone:
      "A text classification system built twice — once with TF-IDF, once with embeddings — with the tradeoff written up.",
    modules: [
      {
        id: "m-nlp-classical",
        phaseId: "p09-nlp",
        title: "Tokenisation, BoW, TF-IDF",
        description: "Classical text representation and where it still wins.",
        outcomes: [
          "Beat an LLM on cost and latency for a simple classification task",
        ],
        skills: ["nlp"],
      },
      {
        id: "m-nlp-embeddings",
        phaseId: "p09-nlp",
        title: "Embeddings and Semantic Similarity",
        description:
          "Dense representations, similarity metrics, the geometry of meaning.",
        outcomes: [
          "Explain what cosine similarity does and does not capture",
        ],
        skills: ["nlp", "embeddings"],
      },
      {
        id: "m-nlp-hf",
        phaseId: "p09-nlp",
        title: "Hugging Face and Pretrained Models",
        description: "Using, fine-tuning and evaluating encoder models.",
        outcomes: ["Fine-tune a BERT-style model for a real task"],
        skills: ["nlp", "transformers"],
      },
    ],
  },
  {
    id: "p10-transformers",
    order: 10,
    title: "Transformers",
    track: "ai",
    summary:
      "Attention, self-attention, positional information and the full architecture — implemented small before being used large.",
    estimatedDays: 18,
    dependsOn: ["p09-nlp"],
    authoring: "outline",
    milestone:
      "Self-attention implemented from scratch, and the ability to explain a context window's cost in terms of the maths.",
    modules: [
      {
        id: "m-tf-attention",
        phaseId: "p10-transformers",
        title: "Attention from Scratch",
        description:
          "Queries, keys, values, multi-head attention, positional encoding.",
        outcomes: [
          "Implement scaled dot-product attention",
          "Explain quadratic cost in context length",
        ],
        skills: ["transformers", "math-linalg"],
      },
      {
        id: "m-tf-arch",
        phaseId: "p10-transformers",
        title: "Architecture and Inference",
        description: "Encoder, decoder, tokenisation, sampling, KV cache.",
        outcomes: ["Explain what temperature and top-p actually change"],
        skills: ["transformers", "llm-eng"],
      },
    ],
  },
  {
    id: "p11-llm",
    order: 11,
    title: "LLM Engineering",
    track: "ai",
    summary:
      "The deepest phase. Building reliable systems on top of models that are non-deterministic, rate-limited, expensive and occasionally wrong.",
    estimatedDays: 45,
    dependsOn: ["p10-transformers", "p14-backend"],
    authoring: "outline",
    milestone:
      "An LLM feature in production shape: structured output, retries, fallbacks, caching, tracked cost and latency, and an evaluation suite that catches regressions.",
    modules: [
      {
        id: "m-llm-api",
        phaseId: "p11-llm",
        title: "Working with LLM APIs",
        description:
          "Messages, system prompts, streaming, token accounting, rate limits, errors.",
        outcomes: [
          "Handle every failure mode an API call has",
          "Track cost per request",
        ],
        skills: ["llm-eng"],
      },
      {
        id: "m-llm-prompt",
        phaseId: "p11-llm",
        title: "Prompt Engineering and Structured Output",
        description:
          "Instructions, examples, schemas, Pydantic validation, prompt versioning.",
        outcomes: [
          "Get reliably parseable output and validate it",
          "Version prompts like code, with tests",
        ],
        skills: ["prompt-eng", "structured-output"],
      },
      {
        id: "m-llm-selection",
        phaseId: "p11-llm",
        title: "Model Selection, Cost and Latency",
        description:
          "Frontier vs small vs open models, local inference, the real tradeoffs.",
        outcomes: [
          "Choose a model from measured cost, latency and quality, not reputation",
        ],
        skills: ["llm-eng", "open-models"],
      },
      {
        id: "m-llm-reliability",
        phaseId: "p11-llm",
        title: "Reliability: Retries, Fallbacks, Caching",
        description:
          "Timeouts, backoff, circuit breakers, exact and semantic caching, graceful degradation.",
        outcomes: ["Keep a feature usable when the model provider is down"],
        skills: ["llm-eng", "reliability", "redis"],
      },
      {
        id: "m-llm-eval",
        phaseId: "p11-llm",
        title: "LLM Evaluation",
        description:
          "Test sets, rubrics, LLM-as-judge and its limits, regression suites.",
        outcomes: [
          "Prove a prompt change was an improvement",
          "Catch a regression before shipping",
        ],
        skills: ["ai-eval"],
      },
    ],
  },
  {
    id: "p12-rag",
    order: 12,
    title: "RAG and Knowledge Systems",
    track: "ai",
    summary:
      "Retrieval built up in layers, with retrieval quality measured separately from answer quality. Most RAG systems fail at retrieval, not generation.",
    estimatedDays: 35,
    dependsOn: ["p11-llm"],
    authoring: "outline",
    milestone:
      "A serious RAG system with hybrid retrieval, reranking, citations, a retrieval evaluation set, and measured groundedness.",
    modules: [
      {
        id: "m-rag-basic",
        phaseId: "p12-rag",
        title: "Baseline RAG",
        description:
          "Chunking, embedding, vector search, context assembly, citation.",
        outcomes: ["Ship a working document Q&A, then find where it fails"],
        skills: ["rag", "embeddings", "vector-db"],
      },
      {
        id: "m-rag-retrieval",
        phaseId: "p12-rag",
        title: "Retrieval Quality",
        description:
          "Chunking strategies, metadata filtering, hybrid search, reranking, query rewriting.",
        outcomes: [
          "Justify chunk size from measurement, not folklore",
          "Improve recall@k and prove it",
        ],
        skills: ["rag", "retrieval-eval"],
      },
      {
        id: "m-rag-eval",
        phaseId: "p12-rag",
        title: "Groundedness and Faithfulness",
        description:
          "Evaluating whether the answer is actually supported by retrieved context.",
        outcomes: [
          "Measure hallucination rate",
          "Diagnose whether a bad answer was retrieval or generation",
        ],
        skills: ["retrieval-eval", "ai-eval"],
      },
      {
        id: "m-rag-prod",
        phaseId: "p12-rag",
        title: "Production RAG",
        description:
          "Ingestion pipelines, incremental updates, permissions, cost, latency, caching.",
        outcomes: [
          "Keep an index fresh without reprocessing everything",
          "Enforce per-user document access",
        ],
        skills: ["rag", "ai-security", "observability"],
      },
    ],
  },
  {
    id: "p13-agents",
    order: 13,
    title: "AI Agents and Agentic Systems",
    track: "ai",
    summary:
      "Built up through 13 levels from a single tool call to a production agent — and always weighed against the simpler deterministic workflow.",
    estimatedDays: 45,
    dependsOn: ["p12-rag"],
    authoring: "outline",
    milestone:
      "A production-shaped agent: tools, planning, memory, guardrails, human approval, tracing and an evaluation suite.",
    modules: [
      {
        id: "m-agent-tools",
        phaseId: "p13-agents",
        title: "Levels 1-4: Tools and Execution",
        description:
          "Tool schemas, tool calling, selection among many tools, multi-step loops.",
        outcomes: [
          "Write a tool an LLM uses correctly",
          "Debug a wrong tool choice",
        ],
        skills: ["agents", "tool-calling"],
      },
      {
        id: "m-agent-state",
        phaseId: "p13-agents",
        title: "Levels 5-7: Planning, Memory, Retrieval",
        description:
          "Task decomposition, short and long-term memory, RAG inside an agent.",
        outcomes: [
          "Keep an agent coherent across many steps without blowing the context window",
        ],
        skills: ["agents", "rag"],
      },
      {
        id: "m-agent-safety",
        phaseId: "p13-agents",
        title: "Levels 8-10: Approval, Failure Handling, Observability",
        description:
          "Human-in-the-loop, retries, guardrails, permissions, tracing every step.",
        outcomes: ["Make an agent's actions reversible and auditable"],
        skills: ["agents", "ai-security", "observability"],
      },
      {
        id: "m-agent-prod",
        phaseId: "p13-agents",
        title: "Levels 11-13: Evaluation, Production, Multi-Agent",
        description:
          "Task success rate, tool accuracy, cost per task, and when multi-agent is worth it.",
        outcomes: [
          "Measure agent reliability numerically",
          "Argue honestly for a workflow instead of an agent when that is correct",
        ],
        skills: ["agents", "agent-eval", "system-design"],
      },
    ],
  },
  {
    id: "p14-backend",
    order: 14,
    title: "Backend Engineering with FastAPI",
    track: "software",
    summary:
      "The layer that turns a model into a service: APIs, validation, auth, async, background work and tests.",
    estimatedDays: 30,
    dependsOn: ["p05-data", "p02-git"],
    authoring: "outline",
    milestone:
      "A tested, authenticated, documented API serving a model, with async endpoints and background jobs.",
    modules: [
      {
        id: "m-be-fastapi",
        phaseId: "p14-backend",
        title: "FastAPI and Pydantic",
        description:
          "Routing, request/response models, validation, dependency injection, OpenAPI docs.",
        outcomes: [
          "Design an API contract before implementing it",
          "Reject bad input at the boundary",
        ],
        skills: ["fastapi", "api-design"],
      },
      {
        id: "m-be-auth",
        phaseId: "p14-backend",
        title: "Authentication and Authorization",
        description:
          "Sessions, tokens, password hashing, roles, middleware, rate limiting.",
        outcomes: [
          "Explain the difference between authn and authz in your own code",
        ],
        skills: ["auth", "ai-security"],
      },
      {
        id: "m-be-async",
        phaseId: "p14-backend",
        title: "Async, Background Tasks and Queues",
        description:
          "asyncio, long-running AI calls, task queues, webhooks, streaming responses.",
        outcomes: ["Keep a request fast when the model call is slow"],
        skills: ["python-async", "queues", "fastapi"],
      },
      {
        id: "m-be-test",
        phaseId: "p14-backend",
        title: "API Testing and Error Handling",
        description: "Test clients, fixtures, error contracts, logging.",
        outcomes: ["Test an endpoint without calling a real model provider"],
        skills: ["python-testing", "reliability"],
      },
    ],
  },
  {
    id: "p15-fullstack",
    order: 15,
    title: "Full-Stack AI Engineering",
    track: "software",
    summary:
      "Enough frontend to make AI systems usable: React, TypeScript, Next.js, streaming chat interfaces and dashboards.",
    estimatedDays: 30,
    dependsOn: ["p14-backend"],
    authoring: "outline",
    milestone:
      "A full-stack AI application: React frontend, FastAPI backend, database, streaming responses, auth.",
    modules: [
      {
        id: "m-fs-ts",
        phaseId: "p15-fullstack",
        title: "JavaScript and TypeScript",
        description:
          "The language, the type system, and why types matter at a boundary.",
        outcomes: ["Type an API response end to end"],
        skills: ["typescript"],
      },
      {
        id: "m-fs-react",
        phaseId: "p15-fullstack",
        title: "React and Next.js",
        description:
          "Components, state, effects, data fetching, routing, server components.",
        outcomes: [
          "Build a UI that handles loading, error and empty states properly",
        ],
        skills: ["react", "nextjs"],
      },
      {
        id: "m-fs-ai-ux",
        phaseId: "p15-fullstack",
        title: "AI Interfaces",
        description:
          "Streaming, chat, citations, file upload, latency perception, failure UX.",
        outcomes: [
          "Design an interface that stays honest when the model is uncertain",
        ],
        skills: ["react", "ai-product"],
      },
    ],
  },
  {
    id: "p16-data-systems",
    order: 16,
    title: "Databases, Caching and Async Systems",
    track: "production",
    summary:
      "The state layer under an AI product: Postgres in anger, Redis caching, queues for expensive work.",
    estimatedDays: 20,
    dependsOn: ["p14-backend"],
    authoring: "outline",
    milestone:
      "An AI service whose expensive calls are cached and whose slow work runs on a queue.",
    modules: [
      {
        id: "m-ds-postgres",
        phaseId: "p16-data-systems",
        title: "PostgreSQL in Production",
        description:
          "Migrations, indexes, transactions, connection pools, query plans, pgvector.",
        outcomes: ["Read an EXPLAIN plan", "Run a schema migration safely"],
        skills: ["postgres", "vector-db"],
      },
      {
        id: "m-ds-redis",
        phaseId: "p16-data-systems",
        title: "Redis and Caching",
        description:
          "Cache keys, TTLs, invalidation, sessions, rate limiting, LLM response caching.",
        outcomes: [
          "Cut LLM spend measurably with a cache",
          "Explain your invalidation strategy",
        ],
        skills: ["redis"],
      },
      {
        id: "m-ds-queues",
        phaseId: "p16-data-systems",
        title: "Queues and Async Processing",
        description: "Workers, retries, dead letters, idempotency, backpressure.",
        outcomes: ["Process a long AI job without holding an HTTP request open"],
        skills: ["queues", "reliability"],
      },
    ],
  },
  {
    id: "p17-devops",
    order: 17,
    title: "Linux, Docker, Cloud and CI/CD",
    track: "production",
    summary:
      "Packaging and shipping. Started early in Phase 2 with CI, completed here into real deployment.",
    estimatedDays: 30,
    dependsOn: ["p02-git", "p14-backend"],
    authoring: "outline",
    milestone:
      "An AI application containerised, built by CI, deployed to a cloud provider with health checks and secrets handled properly.",
    modules: [
      {
        id: "m-ops-linux",
        phaseId: "p17-devops",
        title: "Practical Linux",
        description:
          "Filesystem, permissions, processes, env vars, shell, pipes, logs, ssh.",
        outcomes: ["Debug a running service from a shell"],
        skills: ["linux"],
      },
      {
        id: "m-ops-docker",
        phaseId: "p17-devops",
        title: "Docker and Compose",
        description:
          "Images, layers, Dockerfiles, volumes, networks, multi-container systems, image size.",
        outcomes: [
          "Containerise an AI service",
          "Explain why your image is 2GB and fix it",
        ],
        skills: ["docker"],
      },
      {
        id: "m-ops-cicd",
        phaseId: "p17-devops",
        title: "CI/CD Pipelines",
        description:
          "Test, lint, build, image push, deploy, health check, rollback.",
        outcomes: ["Ship by merging, not by copying files to a server"],
        skills: ["github-actions", "cicd"],
      },
      {
        id: "m-ops-cloud",
        phaseId: "p17-devops",
        title: "One Cloud, Deeply",
        description:
          "Compute, storage, networking, managed databases, secrets, IAM, logging, cost.",
        outcomes: [
          "Deploy and operate a real service",
          "Explain your IAM and secret handling",
        ],
        skills: ["cloud"],
      },
    ],
  },
  {
    id: "p18-mlops",
    order: 18,
    title: "MLOps, LLMOps and AI Observability",
    track: "production",
    summary:
      "The lifecycle after 'it works on my machine': versioning, serving, tracing, cost tracking and regression testing for AI systems.",
    estimatedDays: 25,
    dependsOn: ["p17-devops", "p11-llm"],
    authoring: "outline",
    milestone:
      "An AI system with traced model calls, tracked token cost, versioned prompts and automated evaluation running in CI.",
    modules: [
      {
        id: "m-mlops-lifecycle",
        phaseId: "p18-mlops",
        title: "ML and LLM Lifecycles",
        description:
          "Data, training, artifacts, versioning, serving, monitoring, drift.",
        outcomes: ["Reproduce a model result months later"],
        skills: ["mlops"],
      },
      {
        id: "m-mlops-obs",
        phaseId: "p18-mlops",
        title: "Observability for AI",
        description:
          "Logs, metrics, traces, token usage, latency, tool calls, retrieval traces.",
        outcomes: ["Answer 'why did it do that?' from traces, not guesses"],
        skills: ["observability", "llmops"],
      },
      {
        id: "m-mlops-regression",
        phaseId: "p18-mlops",
        title: "Evaluation in CI",
        description: "Golden sets, thresholds, regression gates, cost budgets.",
        outcomes: ["Block a merge that makes the AI worse"],
        skills: ["ai-eval", "cicd"],
      },
    ],
  },
  {
    id: "p19-security",
    order: 19,
    title: "AI Security and Reliability",
    track: "production",
    summary:
      "Prompt injection, tool abuse, data leakage, and the engineering that keeps an AI system trustworthy when things fail.",
    estimatedDays: 18,
    dependsOn: ["p13-agents", "p14-backend"],
    authoring: "outline",
    milestone:
      "An agent whose tools are permission-scoped and audited, with a written threat model.",
    modules: [
      {
        id: "m-sec-ai",
        phaseId: "p19-security",
        title: "AI-Specific Threats",
        description:
          "Prompt injection, indirect injection, data exfiltration, tool abuse, jailbreaks.",
        outcomes: ["Attack your own agent successfully, then fix it"],
        skills: ["ai-security", "agents"],
      },
      {
        id: "m-sec-app",
        phaseId: "p19-security",
        title: "Application Security",
        description:
          "Secrets, authn/authz, input and output validation, sandboxing, audit logs.",
        outcomes: ["Keep credentials out of prompts, logs and git history"],
        skills: ["ai-security", "auth"],
      },
      {
        id: "m-sec-reliability",
        phaseId: "p19-security",
        title: "Reliability Engineering",
        description:
          "Retries, timeouts, fallbacks, circuit breakers, idempotency, graceful degradation, rollback.",
        outcomes: ["Design a feature that degrades instead of breaking"],
        skills: ["reliability"],
      },
    ],
  },
  {
    id: "p20-integration",
    order: 20,
    title: "AI Into Existing Systems",
    track: "career",
    summary:
      "The highest-leverage career skill: finding where AI creates real value inside software that already exists, and retrofitting it safely.",
    estimatedDays: 25,
    dependsOn: ["p12-rag", "p14-backend"],
    authoring: "outline",
    milestone:
      "A conventional application retrofitted stage by stage: classification, summarisation, retrieval, suggested actions, tool calling, human approval, evaluation, deployment.",
    modules: [
      {
        id: "m-int-opportunity",
        phaseId: "p20-integration",
        title: "Finding the AI Opportunity",
        description:
          "Reading an existing architecture, locating the expensive human step, defining success.",
        outcomes: [
          "Write an AI opportunity assessment for a real system",
          "Say no to AI where a rule or a query is better",
        ],
        skills: ["ai-product", "ai-integration"],
      },
      {
        id: "m-int-retrofit",
        phaseId: "p20-integration",
        title: "Staged Retrofit",
        description:
          "Adding AI incrementally without destabilising the existing system.",
        outcomes: ["Ship an AI feature behind a flag with a measurable baseline"],
        skills: ["ai-integration", "reliability"],
      },
      {
        id: "m-int-impact",
        phaseId: "p20-integration",
        title: "Measuring Impact",
        description:
          "Baseline, success metrics, business value, monitoring after launch.",
        outcomes: ["State the impact of your AI feature in business terms"],
        skills: ["ai-product", "ai-eval"],
      },
    ],
  },
  {
    id: "p21-system-design",
    order: 21,
    title: "AI System Design",
    track: "career",
    summary:
      "Designing complete AI systems on a whiteboard: requirements, components, data flow, scaling, failure, cost and security.",
    estimatedDays: 25,
    dependsOn: ["p17-devops", "p13-agents"],
    authoring: "outline",
    milestone:
      "Ten AI system designs written up, each with tradeoffs, failure modes and cost analysis.",
    modules: [
      {
        id: "m-sd-fundamentals",
        phaseId: "p21-system-design",
        title: "Design Fundamentals",
        description:
          "Requirements, constraints, components, data flow, scaling, caching, queues.",
        outcomes: ["Drive a design conversation from requirements, not technologies"],
        skills: ["system-design"],
      },
      {
        id: "m-sd-ai",
        phaseId: "p21-system-design",
        title: "AI System Designs",
        description:
          "Chatbot, RAG platform, AI search, document intelligence, agent platform, multi-tenant AI SaaS.",
        outcomes: ["Design a multi-tenant RAG platform with per-tenant isolation"],
        skills: ["system-design", "rag", "agents"],
      },
      {
        id: "m-sd-tradeoffs",
        phaseId: "p21-system-design",
        title: "Cost, Latency and Scale",
        description:
          "Token economics, caching strategy, model tiering, batching, autoscaling.",
        outcomes: ["Estimate the monthly cost of a design before building it"],
        skills: ["system-design", "llmops"],
      },
    ],
  },
  {
    id: "p22-production",
    order: 22,
    title: "Production AI: The Capstone",
    track: "career",
    summary:
      "Assembling everything into one serious system, built from capabilities already proven in earlier projects.",
    estimatedDays: 45,
    dependsOn: ["p18-mlops", "p19-security", "p15-fullstack"],
    authoring: "outline",
    milestone:
      "A deployed AI product: frontend, backend, database, auth, LLM, RAG, tools, evaluation, Docker, CI/CD, observability.",
    modules: [
      {
        id: "m-cap-design",
        phaseId: "p22-production",
        title: "Design and Plan",
        description:
          "Problem, users, requirements, architecture, decision records, milestones.",
        outcomes: ["Write a design document before writing code"],
        skills: ["system-design", "ai-product"],
      },
      {
        id: "m-cap-build",
        phaseId: "p22-production",
        title: "Build and Harden",
        description:
          "Implementation, tests, security, reliability, evaluation, observability.",
        outcomes: ["Pass every production readiness gate deliberately"],
        skills: ["ai-integration", "reliability", "observability"],
      },
      {
        id: "m-cap-operate",
        phaseId: "p22-production",
        title: "Deploy and Operate",
        description:
          "Deployment, monitoring, cost control, incident handling, iteration.",
        outcomes: ["Run your own system and fix it when it breaks"],
        skills: ["cloud", "cicd", "observability"],
      },
    ],
  },
  {
    id: "p23-portfolio",
    order: 23,
    title: "Portfolio Engineering",
    track: "career",
    summary:
      "Turning built systems into evidence an employer can evaluate in five minutes.",
    estimatedDays: 15,
    dependsOn: ["p22-production"],
    authoring: "outline",
    milestone:
      "Two to four deep projects, each with architecture, evaluation results, a demo and a written technical explanation.",
    modules: [
      {
        id: "m-port-projects",
        phaseId: "p23-portfolio",
        title: "Project Presentation",
        description:
          "READMEs, architecture diagrams, demos, evaluation results, limitations.",
        outcomes: ["Make a reviewer understand the system without running it"],
        skills: ["portfolio"],
      },
      {
        id: "m-port-profile",
        phaseId: "p23-portfolio",
        title: "GitHub, Resume and Writing",
        description:
          "Repository hygiene, commit history, resume project descriptions, technical writing.",
        outcomes: [
          "Describe each project in three resume lines that survive scrutiny",
        ],
        skills: ["portfolio"],
      },
    ],
  },
  {
    id: "p24-interview",
    order: 24,
    title: "Interview and Career Preparation",
    track: "career",
    summary:
      "Explaining what you built, under questioning, plus the DSA, ML and system design rounds.",
    estimatedDays: 30,
    dependsOn: ["p23-portfolio"],
    authoring: "outline",
    milestone:
      "Able to defend every architectural decision in your projects and pass a mock loop.",
    modules: [
      {
        id: "m-iv-technical",
        phaseId: "p24-interview",
        title: "Technical Rounds",
        description: "DSA, Python, SQL, ML fundamentals, LLM and RAG questions.",
        outcomes: ["Solve and explain, not just solve"],
        skills: ["interview", "dsa"],
      },
      {
        id: "m-iv-design",
        phaseId: "p24-interview",
        title: "AI System Design Rounds",
        description: "Designing under questioning, defending tradeoffs.",
        outcomes: ["Handle 'why not just use X?' calmly and specifically"],
        skills: ["interview", "system-design"],
      },
      {
        id: "m-iv-project",
        phaseId: "p24-interview",
        title: "Project Deep Dives",
        description: "Walking through your own systems, failures included.",
        outcomes: ["Tell the story of a bug you fixed and what it taught you"],
        skills: ["interview", "portfolio"],
      },
    ],
  },
];

export const phaseById = new Map(phases.map((p) => [p.id, p]));
export const moduleById = new Map(
  phases.flatMap((p) => p.modules).map((m) => [m.id, m]),
);
