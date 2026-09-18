"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { skills } from "@/data";
import { useStore } from "@/lib/store";
import { Button, Card, CardHeader, EmptyState, PageHeader, Pill } from "@/components/ui";

const NOTE_KINDS = ["concept", "mistake", "decision", "snippet", "question"];

export default function KnowledgePage() {
  const {
    state,
    addNote,
    deleteNote,
    addJournalEntry,
    deleteJournalEntry,
  } = useStore();
  const [tab, setTab] = useState<"notes" | "journal">("notes");

  const [note, setNote] = useState({
    title: "",
    body: "",
    kind: "concept",
    tags: "",
    skillId: "",
  });

  const [entry, setEntry] = useState({
    title: "",
    problem: "",
    cause: "",
    fix: "",
    lesson: "",
  });

  const submitNote = () => {
    if (!note.title.trim()) return;
    addNote({
      title: note.title.trim(),
      body: note.body.trim(),
      kind: note.kind,
      tags: note.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      skillId: note.skillId || undefined,
    });
    setNote({ title: "", body: "", kind: "concept", tags: "", skillId: "" });
  };

  const submitEntry = () => {
    if (!entry.title.trim()) return;
    addJournalEntry({
      title: entry.title.trim(),
      problem: entry.problem.trim(),
      cause: entry.cause.trim(),
      fix: entry.fix.trim(),
      lesson: entry.lesson.trim(),
    });
    setEntry({ title: "", problem: "", cause: "", fix: "", lesson: "" });
  };

  return (
    <div>
      <PageHeader
        eyebrow="Notes and failures"
        title="Knowledge"
        description="Concepts worth keeping, and an engineering journal of bugs and their causes. The journal is the best interview material you will produce all year."
      />

      <div className="mb-6 flex gap-2">
        {(["notes", "journal"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full border px-3.5 py-1.5 text-xs capitalize transition ${
              tab === t
                ? "border-accent/50 bg-accent-soft text-accent"
                : "border-line bg-raised text-muted hover:text-ink"
            }`}
          >
            {t === "notes" ? `Notes (${state.notes.length})` : `Journal (${state.journal.length})`}
          </button>
        ))}
      </div>

      {tab === "notes" ? (
        <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
          <Card className="h-fit">
            <CardHeader title="New note" />
            <div className="space-y-3 px-5 py-4">
              <input
                className="field"
                placeholder="Title"
                value={note.title}
                onChange={(e) => setNote({ ...note, title: e.target.value })}
              />
              <textarea
                className="field min-h-28 resize-y"
                placeholder="What is worth remembering, in your own words?"
                value={note.body}
                onChange={(e) => setNote({ ...note, body: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-3">
                <select
                  className="field"
                  value={note.kind}
                  onChange={(e) => setNote({ ...note, kind: e.target.value })}
                >
                  {NOTE_KINDS.map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
                </select>
                <select
                  className="field"
                  value={note.skillId}
                  onChange={(e) => setNote({ ...note, skillId: e.target.value })}
                >
                  <option value="">No skill</option>
                  {skills.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <input
                className="field"
                placeholder="Tags, comma separated"
                value={note.tags}
                onChange={(e) => setNote({ ...note, tags: e.target.value })}
              />
              <Button onClick={submitNote} disabled={!note.title.trim()}>
                Save note
              </Button>
            </div>
          </Card>

          <div className="space-y-3">
            {state.notes.length === 0 ? (
              <Card>
                <EmptyState
                  title="No notes yet"
                  description="Write notes in your own words. Copying a definition teaches nothing; rephrasing it forces you to understand it."
                />
              </Card>
            ) : (
              state.notes.map((n) => (
                <Card key={n.id} as="article">
                  <div className="flex items-start justify-between gap-4 px-5 py-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-medium">{n.title}</h3>
                        <Pill>{n.kind}</Pill>
                      </div>
                      {n.body && (
                        <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-muted">
                          {n.body}
                        </p>
                      )}
                      <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs text-faint">
                        <span>
                          {new Date(n.createdAt).toLocaleDateString(undefined, {
                            day: "numeric",
                            month: "short",
                          })}
                        </span>
                        {n.tags.map((t) => (
                          <span key={t}>#{t}</span>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => deleteNote(n.id)}
                      className="shrink-0 text-faint transition hover:text-danger"
                      aria-label={`Delete ${n.title}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
          <Card className="h-fit">
            <CardHeader
              title="New journal entry"
              hint="Problem, cause, fix, lesson. The cause is the part people skip and the part that matters."
            />
            <div className="space-y-3 px-5 py-4">
              <input
                className="field"
                placeholder="What broke?"
                value={entry.title}
                onChange={(e) => setEntry({ ...entry, title: e.target.value })}
              />
              <textarea
                className="field min-h-16 resize-y"
                placeholder="Symptom — what you observed"
                value={entry.problem}
                onChange={(e) => setEntry({ ...entry, problem: e.target.value })}
              />
              <textarea
                className="field min-h-16 resize-y"
                placeholder="Root cause — why it actually happened"
                value={entry.cause}
                onChange={(e) => setEntry({ ...entry, cause: e.target.value })}
              />
              <textarea
                className="field min-h-16 resize-y"
                placeholder="Fix — what you changed"
                value={entry.fix}
                onChange={(e) => setEntry({ ...entry, fix: e.target.value })}
              />
              <textarea
                className="field min-h-16 resize-y"
                placeholder="Lesson — what you will do differently"
                value={entry.lesson}
                onChange={(e) => setEntry({ ...entry, lesson: e.target.value })}
              />
              <Button onClick={submitEntry} disabled={!entry.title.trim()}>
                Save entry
              </Button>
            </div>
          </Card>

          <div className="space-y-3">
            {state.journal.length === 0 ? (
              <Card>
                <EmptyState
                  title="No entries yet"
                  description="Every bug you debug is a story you can tell in an interview. Record it while the cause is still fresh."
                />
              </Card>
            ) : (
              state.journal.map((j) => (
                <Card key={j.id} as="article">
                  <div className="flex items-start justify-between gap-4 px-5 py-4">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-medium">{j.title}</h3>
                      <dl className="mt-3 space-y-2.5">
                        {[
                          ["Symptom", j.problem],
                          ["Cause", j.cause],
                          ["Fix", j.fix],
                          ["Lesson", j.lesson],
                        ]
                          .filter(([, v]) => v)
                          .map(([k, v]) => (
                            <div key={k}>
                              <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-faint">
                                {k}
                              </dt>
                              <dd className="mt-0.5 text-sm leading-relaxed text-muted">
                                {v}
                              </dd>
                            </div>
                          ))}
                      </dl>
                      <p className="mt-3 text-xs text-faint">
                        {new Date(j.createdAt).toLocaleDateString(undefined, {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteJournalEntry(j.id)}
                      className="shrink-0 text-faint transition hover:text-danger"
                      aria-label={`Delete ${j.title}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
