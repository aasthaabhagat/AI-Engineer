"use client";

import { useState } from "react";
import { days } from "@/data";
import { useStore } from "@/lib/store";
import { questionsByKind } from "@/lib/reviews";
import { completedMinutes, currentStreak, overallProgress } from "@/lib/progress";
import { Button, Card, CardHeader, EmptyState, PageHeader, Stat } from "@/components/ui";

type Kind = "daily" | "weekly" | "monthly" | "quarterly";

export default function ReviewsPage() {
  const { state, saveReview } = useStore();
  const [kind, setKind] = useState<Kind>("daily");
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const questions = questionsByKind[kind];
  const overall = overallProgress(days, state);
  const minutes = completedMinutes(days, state);

  const submit = () => {
    const filled = Object.fromEntries(
      Object.entries(answers).filter(([, v]) => v.trim()),
    );
    if (Object.keys(filled).length === 0) return;
    saveReview({ kind, answers: filled });
    setAnswers({});
  };

  return (
    <div>
      <PageHeader
        eyebrow="Reflection loop"
        title="Reviews"
        description="Daily for two minutes of noticing, weekly for course correction, monthly for direction, quarterly for a capability audit that actually changes the roadmap."
      />

      <Card className="mb-6 grid grid-cols-2 divide-x divide-y divide-line-soft sm:grid-cols-4 sm:divide-y-0">
        <Stat label="Days complete" value={overall.done} sub={`of ${overall.total}`} />
        <Stat label="Focused hours" value={Math.round(minutes / 60)} sub="estimated from tasks" />
        <Stat label="Streak" value={currentStreak(state)} sub="days" />
        <Stat label="Reviews written" value={state.reviews.length} />
      </Card>

      <div className="mb-6 flex flex-wrap gap-2">
        {(["daily", "weekly", "monthly", "quarterly"] as Kind[]).map((k) => (
          <button
            key={k}
            onClick={() => {
              setKind(k);
              setAnswers({});
            }}
            className={`rounded-full border px-3.5 py-1.5 text-xs capitalize transition ${
              kind === k
                ? "border-accent/50 bg-accent-soft text-accent"
                : "border-line bg-raised text-muted hover:text-ink"
            }`}
          >
            {k}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Card className="h-fit">
          <CardHeader
            title={`${kind} review`}
            hint={
              kind === "quarterly"
                ? "Answer these honestly — the next phase should change based on what you write."
                : undefined
            }
          />
          <div className="space-y-4 px-5 py-4">
            {questions.map((q) => (
              <label key={q.id} className="block">
                <span className="text-sm">{q.prompt}</span>
                {q.hint && (
                  <span className="mt-0.5 block text-[0.68rem] leading-relaxed text-faint">
                    {q.hint}
                  </span>
                )}
                <textarea
                  className="field mt-1.5 min-h-16 resize-y"
                  value={answers[q.id] ?? ""}
                  onChange={(e) =>
                    setAnswers({ ...answers, [q.id]: e.target.value })
                  }
                />
              </label>
            ))}
            <Button onClick={submit}>Save {kind} review</Button>
          </div>
        </Card>

        <div className="space-y-3">
          {state.reviews.length === 0 ? (
            <Card>
              <EmptyState
                title="No reviews saved"
                description="A week without a review is a week whose lessons evaporate. Ten honest minutes on Sunday is enough."
              />
            </Card>
          ) : (
            state.reviews.map((r) => {
              const qs = questionsByKind[r.kind];
              return (
                <Card key={r.id} as="article">
                  <div className="px-5 py-4">
                    <p className="text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-accent">
                      {r.kind} ·{" "}
                      {new Date(r.createdAt).toLocaleDateString(undefined, {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                    <dl className="mt-3 space-y-2.5">
                      {Object.entries(r.answers).map(([qid, value]) => (
                        <div key={qid}>
                          <dt className="text-[0.68rem] text-faint">
                            {qs.find((q) => q.id === qid)?.prompt ?? qid}
                          </dt>
                          <dd className="mt-0.5 whitespace-pre-wrap text-xs leading-relaxed text-muted">
                            {value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
