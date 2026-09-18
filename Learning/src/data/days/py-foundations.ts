import type { Day } from "../types";

const REPO = "01-Python-Foundations/projects/expense-tracker";

/**
 * Phase 1, Days 1-9: files, structure and errors.
 *
 * Days 1-3 record work already completed (see git history: "Build expense
 * tracker CLI v0.1", "Add dot spot painting project", "Refactor expense
 * tracker into modules"). Days 4+ are grounded in real defects found in that
 * code, not generic exercises.
 */
export const pyFoundationDays: Day[] = [
  {
    id: "day-001",
    dayNumber: 1,
    phaseId: "p01-python",
    moduleId: "m-py-files",
    title: "Expense Tracker CLI v0.1",
    objective:
      "Build a CLI that stores expenses in JSON and survives being closed and reopened.",
    whyItMatters:
      "Persistence is the first thing that turns a script into an application. Everything you build later — databases, vector stores, model checkpoints — is this same problem with more layers.",
    careerConnection:
      "Every backend system you will build reads and writes state safely.",
    estimatedMinutes: 150,
    projectId: "expense-tracker",
    repoPath: REPO,
    skills: ["python-core", "python-errors", "cli-apps"],
    evidence: ["ev-py-1", "ev-py-3", "ev-cli-1", "ev-git-1"],
    tasks: [
      {
        id: "d01-t1",
        title: "Standard library, file operations and file paths",
        type: "learn",
        minutes: 45,
        priority: "essential",
      },
      {
        id: "d01-t2",
        title: "Experiments: read JSON, write JSON, update and save, pathlib, missing file",
        type: "practice",
        minutes: 30,
        priority: "essential",
        repoPath: `${REPO}/experiments.py`,
      },
      {
        id: "d01-t3",
        title: "Build the menu loop: add, view, total, category summary, exit",
        type: "build",
        minutes: 60,
        priority: "essential",
        repoPath: `${REPO}/expense_tracker.py`,
      },
      {
        id: "d01-t4",
        title: "Test persistence, invalid amounts, invalid menu options, missing file",
        type: "test",
        minutes: 15,
        priority: "essential",
      },
    ],
    deliverables: ["Working CLI", "expenses.json persisting between runs", "README"],
    definitionOfDone: [
      "Data survives restarting the program",
      "Invalid amount does not crash the program",
      "Invalid menu option is handled",
      "Missing expenses.json is handled",
      "README written",
      "Committed to git",
    ],
    gitTask: { commitMessage: "Build expense tracker CLI v0.1" },
    resources: [
      { label: "pathlib", kind: "docs", ref: "https://docs.python.org/3/library/pathlib.html" },
      { label: "json", kind: "docs", ref: "https://docs.python.org/3/library/json.html" },
    ],
  },
  {
    id: "day-002",
    dayNumber: 2,
    phaseId: "p01-python",
    moduleId: "m-py-files",
    title: "Turtle Graphics and Randomness",
    objective:
      "Practise loops, functions and randomness with a visual feedback loop.",
    whyItMatters:
      "Immediate visual output makes loop and function bugs obvious, which is why it is a good place to practise them.",
    careerConnection:
      "Low stakes, but function decomposition and parameterisation are the same skills at any scale.",
    estimatedMinutes: 90,
    projectId: "dot-spot-painting",
    repoPath: "01-Python-Foundations/projects/dot-spot-painting",
    skills: ["python-core"],
    evidence: ["ev-py-1"],
    tasks: [
      {
        id: "d02-t1",
        title: "Turtle basics, loops, random choice",
        type: "learn",
        minutes: 30,
        priority: "essential",
      },
      {
        id: "d02-t2",
        title: "Draw shapes with a parameterised draw_shape function",
        type: "build",
        minutes: 45,
        priority: "essential",
        repoPath: "01-Python-Foundations/projects/dot-spot-painting/main.py",
      },
      {
        id: "d02-t3",
        title: "Commit the project",
        type: "git",
        minutes: 10,
        priority: "essential",
      },
    ],
    deliverables: ["Running turtle program committed to the repo"],
    definitionOfDone: ["Program runs", "Shape drawing is a reusable function", "Committed"],
    gitTask: { commitMessage: "Add dot spot painting project" },
  },
  {
    id: "day-003",
    dayNumber: 3,
    phaseId: "p01-python",
    moduleId: "m-py-structure",
    title: "Refactor Into Modules",
    objective:
      "Split the tracker into data access, analysis and interface, and understand imports.",
    whyItMatters:
      "One file stops scaling the moment a project has more than one responsibility. Separation of concerns is the foundation of every architecture you will learn later.",
    careerConnection:
      "The same layering — storage, logic, interface — reappears in FastAPI services, RAG pipelines and agent systems.",
    estimatedMinutes: 120,
    projectId: "expense-tracker",
    repoPath: REPO,
    skills: ["python-core", "code-architecture"],
    evidence: ["ev-py-2", "ev-arch-1"],
    tasks: [
      {
        id: "d03-t1",
        title: "Modules, imports, __init__ and __pycache__",
        type: "learn",
        minutes: 30,
        priority: "essential",
      },
      {
        id: "d03-t2",
        title: "Extract data.py (storage) and analyzer.py (logic), leaving main.py as interface",
        type: "build",
        minutes: 70,
        priority: "essential",
        repoPath: REPO,
      },
      {
        id: "d03-t3",
        title: "Add __pycache__/ to .gitignore",
        type: "git",
        minutes: 10,
        priority: "essential",
      },
    ],
    deliverables: ["data.py", "analyzer.py", "main.py"],
    definitionOfDone: [
      "Each module has one clear responsibility",
      "Application still runs",
      "__pycache__ ignored by git",
      "Committed",
    ],
    gitTask: { commitMessage: "Refactor expense tracker into modules" },
  },
  {
    id: "day-004",
    dayNumber: 4,
    phaseId: "p01-python",
    moduleId: "m-py-errors",
    title: "The Refactor Lost a Feature, and Two Real Bugs",
    objective:
      "Audit your own refactor: find what it dropped, find the path bug, and find the silent data-loss bug.",
    whyItMatters:
      "A refactor that quietly removes behaviour is the most common way working software breaks. Learning to audit your own change is worth more than any new syntax.",
    careerConnection:
      "Reviewing a diff for lost behaviour is the core of professional code review.",
    estimatedMinutes: 120,
    projectId: "expense-tracker",
    repoPath: REPO,
    skills: ["python-errors", "code-architecture", "code-review"],
    evidence: ["ev-err-1", "ev-err-4", "ev-cr-1"],
    tasks: [
      {
        id: "d04-t1",
        title: "Compare expense_tracker.py against main.py + data.py + analyzer.py",
        detail:
          "Which features exist in the old single file but not in the new modular app? Write the list down before changing anything.",
        type: "review",
        minutes: 25,
        priority: "essential",
        repoPath: REPO,
      },
      {
        id: "d04-t2",
        title: "Find the path bug",
        detail:
          "data.py uses Path(__file__).parent / 'expenses.json'. expense_tracker.py uses Path('expenses.json'). Run each from a different working directory and observe what differs. Decide which is correct and why.",
        type: "practice",
        minutes: 20,
        priority: "essential",
      },
      {
        id: "d04-t3",
        title: "Find the silent data-loss bug",
        detail:
          "data.py catches json.JSONDecodeError and returns []. Ask: if the file is corrupt and the app then saves, what happens to the user's data? Do not fix it yet — write down what SHOULD happen.",
        type: "review",
        minutes: 20,
        priority: "essential",
      },
      {
        id: "d04-t4",
        title: "Write the findings into a short DEFECTS.md",
        type: "document",
        minutes: 25,
        priority: "important",
        repoPath: `${REPO}/DEFECTS.md`,
      },
      {
        id: "d04-t5",
        title: "Add encoding='utf-8' to every open() call",
        detail:
          "On Windows the default encoding is not UTF-8. Your data contains non-ASCII text and your output prints a rupee sign. This will bite you eventually.",
        type: "build",
        minutes: 15,
        priority: "important",
      },
    ],
    deliverables: ["DEFECTS.md listing what the refactor lost and the two bugs"],
    definitionOfDone: [
      "Missing features listed",
      "Path behaviour tested from two different working directories",
      "Data-loss scenario described in writing",
      "Encoding specified on file operations",
      "Committed",
    ],
    gitTask: {
      commitMessage: "Document defects found in modular refactor",
      note: "Commit the audit before the fix. The history should show you found it, then fixed it.",
    },
  },
  {
    id: "day-005",
    dayNumber: 5,
    phaseId: "p01-python",
    moduleId: "m-py-errors",
    title: "Safe Writes: Never Destroy Good Data",
    objective:
      "Restore Add Expense in the modular app, and make saving safe against corruption and crashes.",
    whyItMatters:
      "open(path, 'w') truncates the file immediately. If your program dies mid-write — or if you write over data you failed to read — the user's data is gone. Atomic writes are how real systems avoid this.",
    careerConnection:
      "Database transactions, checkpoint files and index rebuilds all solve this same problem.",
    estimatedMinutes: 120,
    projectId: "expense-tracker",
    repoPath: REPO,
    skills: ["python-errors", "python-core", "reliability"],
    evidence: ["ev-err-4", "ev-py-3", "ev-rel-4"],
    tasks: [
      {
        id: "d05-t1",
        title: "Read about atomic file replacement",
        detail:
          "Look up os.replace and why writing to a temp file then replacing is safer than writing in place.",
        type: "learn",
        minutes: 25,
        priority: "essential",
        repoPath: undefined,
      },
      {
        id: "d05-t2",
        title: "Implement save_expenses in data.py using a temp file and os.replace",
        type: "build",
        minutes: 35,
        priority: "essential",
        repoPath: `${REPO}/data.py`,
      },
      {
        id: "d05-t3",
        title: "Make load_expenses distinguish missing, empty and corrupt",
        detail:
          "Missing file: start empty, fine. Empty file: start empty, fine. Corrupt file: refuse to continue silently — raise, or back the file up and warn loudly. Your choice, but make it deliberate.",
        type: "build",
        minutes: 30,
        priority: "essential",
        repoPath: `${REPO}/data.py`,
      },
      {
        id: "d05-t4",
        title: "Restore the Add Expense menu option in main.py",
        type: "build",
        minutes: 20,
        priority: "essential",
        repoPath: `${REPO}/main.py`,
      },
      {
        id: "d05-t5",
        title: "Test: corrupt the JSON deliberately, run the app, confirm no data is lost",
        type: "test",
        minutes: 10,
        priority: "essential",
      },
    ],
    deliverables: ["Safe save_expenses", "Add Expense restored", "Corruption handled deliberately"],
    definitionOfDone: [
      "Adding an expense persists it",
      "Deliberately corrupted JSON does not result in lost data",
      "Empty file and missing file both start cleanly",
      "Old expense_tracker.py either removed or clearly marked as superseded",
      "Committed",
    ],
    gitTask: { commitMessage: "Add safe expense saving and restore add-expense flow" },
  },
  {
    id: "day-006",
    dayNumber: 6,
    phaseId: "p01-python",
    moduleId: "m-py-errors",
    title: "Validation at the Boundary",
    objective:
      "Push all input validation to the edge of the system so the logic can trust its data.",
    whyItMatters:
      "analyzer.py currently assumes every record has a numeric 'amount'. One malformed row crashes it. Validating at the boundary means the core never has to defend itself.",
    careerConnection:
      "This is exactly what Pydantic does for FastAPI request bodies and LLM structured output — the same principle, one layer up.",
    estimatedMinutes: 110,
    projectId: "expense-tracker",
    repoPath: REPO,
    skills: ["python-errors", "code-architecture"],
    evidence: ["ev-err-2", "ev-arch-1"],
    tasks: [
      {
        id: "d06-t1",
        title: "Break it first: add a record with amount as a string, then run every menu option",
        type: "practice",
        minutes: 20,
        priority: "essential",
      },
      {
        id: "d06-t2",
        title: "Write a validate_expense function that checks shape and types",
        detail:
          "Required keys, amount is a positive number, category non-empty after stripping, date parseable as ISO.",
        type: "build",
        minutes: 35,
        priority: "essential",
        repoPath: `${REPO}/data.py`,
      },
      {
        id: "d06-t3",
        title: "Validate on load and on add; decide what to do with bad records",
        detail: "Skip and warn, or refuse to load? Write your reasoning in a comment.",
        type: "build",
        minutes: 30,
        priority: "essential",
      },
      {
        id: "d06-t4",
        title: "Normalise categories so 'Food', 'food ' and 'FOOD' aggregate together",
        type: "build",
        minutes: 15,
        priority: "important",
        repoPath: `${REPO}/analyzer.py`,
      },
      {
        id: "d06-t5",
        title: "Re-run all menu options against the malformed data",
        type: "test",
        minutes: 10,
        priority: "essential",
      },
    ],
    deliverables: ["validate_expense", "Category normalisation"],
    definitionOfDone: [
      "Malformed record no longer crashes any menu option",
      "Validation lives at the boundary, not scattered through the analyser",
      "Category summary aggregates case variants together",
      "Committed",
    ],
    gitTask: { commitMessage: "Validate expense records at the data boundary" },
  },
  {
    id: "day-007",
    dayNumber: 7,
    phaseId: "p01-python",
    moduleId: "m-py-errors",
    title: "Custom Exceptions",
    objective:
      "Define domain-specific exception types and let errors carry meaning instead of strings.",
    whyItMatters:
      "A caller can handle CorruptDataError differently from InvalidExpenseError. It cannot do anything useful with a generic ValueError or a printed message.",
    careerConnection:
      "API error contracts, agent tool failures and retry logic all depend on distinguishing error types programmatically.",
    estimatedMinutes: 100,
    projectId: "expense-tracker",
    repoPath: REPO,
    skills: ["python-errors", "python-oop"],
    evidence: ["ev-err-3", "ev-err-1"],
    tasks: [
      {
        id: "d07-t1",
        title: "Exception hierarchy, raise, raise from, and why bare except is a bug",
        type: "learn",
        minutes: 30,
        priority: "essential",
        detail: "docs.python.org/3/tutorial/errors.html",
      },
      {
        id: "d07-t2",
        title: "Create errors.py with an ExpenseError base and specific subclasses",
        type: "build",
        minutes: 30,
        priority: "essential",
        repoPath: `${REPO}/errors.py`,
      },
      {
        id: "d07-t3",
        title: "Raise them from the data layer; handle them at the interface layer only",
        detail:
          "The rule: low layers raise, the top layer decides what the user sees. main.py prints a friendly message; data.py never prints.",
        type: "build",
        minutes: 30,
        priority: "essential",
      },
      {
        id: "d07-t4",
        title: "Confirm no print() calls remain in data.py or analyzer.py",
        type: "review",
        minutes: 10,
        priority: "important",
      },
    ],
    deliverables: ["errors.py with a real exception hierarchy"],
    definitionOfDone: [
      "Custom exceptions defined and raised",
      "Only the interface layer prints",
      "No bare except anywhere",
      "Committed",
    ],
    gitTask: { commitMessage: "Add domain exceptions and layer error handling" },
  },
  {
    id: "day-008",
    dayNumber: 8,
    phaseId: "p01-python",
    moduleId: "m-py-datamodel",
    title: "Dataclasses and Type Hints",
    objective:
      "Replace loose dictionaries with an Expense dataclass and annotate every function.",
    whyItMatters:
      "expense['amuont'] fails at runtime, in production, silently. expense.amuont fails immediately, and a type checker catches it before you even run.",
    careerConnection:
      "Typed models are the interface language of FastAPI, Pydantic and every LLM structured-output schema you will write.",
    estimatedMinutes: 120,
    projectId: "expense-tracker",
    repoPath: REPO,
    skills: ["python-oop", "python-typing"],
    evidence: ["ev-oop-1", "ev-ty-1", "ev-ty-2"],
    tasks: [
      {
        id: "d08-t1",
        title: "Dataclasses and type hints",
        type: "learn",
        minutes: 30,
        priority: "essential",
        detail: "docs.python.org/3/library/dataclasses.html",
      },
      {
        id: "d08-t2",
        title: "Define an Expense dataclass with from_dict and to_dict",
        detail:
          "JSON gives you dicts; your logic wants objects. The conversion belongs in one place.",
        type: "build",
        minutes: 40,
        priority: "essential",
        repoPath: `${REPO}/models.py`,
      },
      {
        id: "d08-t3",
        title: "Update analyzer.py to work on Expense objects",
        type: "build",
        minutes: 30,
        priority: "essential",
        repoPath: `${REPO}/analyzer.py`,
      },
      {
        id: "d08-t4",
        title: "Annotate every function signature in the project",
        type: "build",
        minutes: 20,
        priority: "important",
      },
    ],
    deliverables: ["models.py with an Expense dataclass", "Fully annotated functions"],
    definitionOfDone: [
      "Expense is a dataclass, not a dict, inside the application",
      "Serialisation happens only at the storage boundary",
      "Every function has type hints",
      "Application still runs",
      "Committed",
    ],
    gitTask: { commitMessage: "Model expenses as a typed dataclass" },
  },
  {
    id: "day-009",
    dayNumber: 9,
    phaseId: "p01-python",
    moduleId: "m-py-craft",
    title: "Virtual Environment and Dependencies",
    objective:
      "Put the project in a venv with pinned dependencies and a documented setup.",
    whyItMatters:
      "'It works on my machine' starts here. An environment you cannot recreate is an application you cannot deploy.",
    careerConnection:
      "Every Docker image, CI run and cloud deployment reproduces an environment from a dependency file.",
    estimatedMinutes: 90,
    projectId: "expense-tracker",
    repoPath: REPO,
    skills: ["python-core", "cli-apps"],
    evidence: ["ev-py-5"],
    tasks: [
      {
        id: "d09-t1",
        title: "Virtual environments, pip, and why global installs cause pain",
        type: "learn",
        minutes: 25,
        priority: "essential",
      },
      {
        id: "d09-t2",
        title: "Create a venv at the repo root and activate it in VS Code",
        type: "build",
        minutes: 25,
        priority: "essential",
      },
      {
        id: "d09-t3",
        title: "Add .venv/ to .gitignore and create requirements.txt",
        type: "build",
        minutes: 15,
        priority: "essential",
      },
      {
        id: "d09-t4",
        title: "Document setup steps in the project README",
        type: "document",
        minutes: 25,
        priority: "essential",
        repoPath: `${REPO}/README.md`,
      },
    ],
    deliverables: ["Working venv", "requirements.txt", "Setup section in README"],
    definitionOfDone: [
      "Project runs from inside the venv",
      ".venv/ is ignored by git",
      "A stranger could set the project up from the README alone",
      "Committed",
    ],
    gitTask: { commitMessage: "Add virtual environment setup and requirements" },
  },
];
