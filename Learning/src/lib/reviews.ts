export interface ReviewQuestion {
  id: string;
  prompt: string;
  hint?: string;
}

/** Two minutes at the end of a session. Long enough to notice, short enough to do. */
export const dailyQuestions: ReviewQuestion[] = [
  { id: "d-built", prompt: "What did I actually build or change today?" },
  { id: "d-stuck", prompt: "Where did I get stuck, and what unstuck me?" },
  {
    id: "d-evidence",
    prompt: "What evidence exists now that did not exist this morning?",
    hint: "A commit, a test, a working feature, a measurement. If the answer is nothing, that is worth knowing too.",
  },
  { id: "d-tomorrow", prompt: "What is the first thing to pick up tomorrow?" },
];

export const weeklyQuestions: ReviewQuestion[] = [
  { id: "w-learned", prompt: "What did I learn?" },
  { id: "w-built", prompt: "What did I build?" },
  { id: "w-shipped", prompt: "What did I ship or commit?" },
  { id: "w-struggled", prompt: "What did I struggle with?" },
  {
    id: "w-avoided",
    prompt: "What did I avoid?",
    hint: "The honest answer here is usually the most useful sentence of the week.",
  },
  { id: "w-revise", prompt: "What should I revise?" },
  { id: "w-evidence", prompt: "What evidence did I create?" },
  { id: "w-change", prompt: "What should change next week?" },
];

export const monthlyQuestions: ReviewQuestion[] = [
  { id: "m-skills", prompt: "Which skills moved up a maturity rung, and what proves it?" },
  { id: "m-projects", prompt: "What happened to each project?" },
  { id: "m-output", prompt: "What does my GitHub output look like this month?" },
  { id: "m-strong", prompt: "What am I noticeably stronger at?" },
  { id: "m-weak", prompt: "What is still weak or untouched?" },
  { id: "m-portfolio", prompt: "What improved in my portfolio?" },
  {
    id: "m-ecosystem",
    prompt: "AI ecosystem check: what changed, and what do I classify as KEEP / LEARN / EXPERIMENT / IGNORE?",
    hint: "30-60 minutes maximum. Build beats read; the fundamentals do not move as fast as the headlines.",
  },
  { id: "m-next", prompt: "What is the focus for next month?" },
];

export const quarterlyQuestions: ReviewQuestion[] = [
  { id: "q-build", prompt: "What can I build now that I could not three months ago?" },
  { id: "q-explain", prompt: "What can I explain without notes?" },
  { id: "q-debug", prompt: "What can I debug confidently?" },
  { id: "q-deploy", prompt: "What can I deploy and operate?" },
  { id: "q-evaluate", prompt: "What can I evaluate properly?" },
  { id: "q-integrate", prompt: "What can I integrate into an existing system?" },
  { id: "q-weak", prompt: "Where am I genuinely weak?" },
  { id: "q-outdated", prompt: "What have I learned that is now outdated?" },
  {
    id: "q-adapt",
    prompt: "How should the next phase change as a result?",
    hint: "This is the point of the audit: the roadmap adapts to the evidence, not the other way round.",
  },
];

export const questionsByKind = {
  daily: dailyQuestions,
  weekly: weeklyQuestions,
  monthly: monthlyQuestions,
  quarterly: quarterlyQuestions,
} as const;
