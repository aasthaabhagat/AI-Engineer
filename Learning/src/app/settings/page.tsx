"use client";

import { useState } from "react";
import { AlertTriangle, Download, Upload } from "lucide-react";
import { useStore } from "@/lib/store";
import { Button, Card, CardHeader, PageHeader } from "@/components/ui";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function SettingsPage() {
  const { state, updateSettings, resetAll, exportState, importState } = useStore();
  const [confirmReset, setConfirmReset] = useState(false);
  const [importText, setImportText] = useState("");
  const [importResult, setImportResult] = useState<string | null>(null);

  const s = state.settings;

  const toggleStudyDay = (d: number) => {
    const next = s.studyDays.includes(d)
      ? s.studyDays.filter((x) => x !== d)
      : [...s.studyDays, d].sort();
    updateSettings({ studyDays: next });
  };

  const download = () => {
    const blob = new Blob([exportState()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `training-os-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <PageHeader
        eyebrow="Configuration"
        title="Settings"
        description="Time available drives how each day's tasks are fitted. Set it to what is realistic on a working week, not what is aspirational."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="h-fit">
          <CardHeader title="Profile" />
          <div className="space-y-4 px-5 py-4">
            <label className="block">
              <span className="text-xs text-muted">Name</span>
              <input
                className="field mt-1.5"
                value={s.name}
                placeholder="Shown on the dashboard"
                onChange={(e) => updateSettings({ name: e.target.value })}
              />
            </label>
            <label className="block">
              <span className="text-xs text-muted">Start date</span>
              <input
                type="date"
                className="field mt-1.5"
                value={s.startDate}
                onChange={(e) => updateSettings({ startDate: e.target.value })}
              />
              <span className="mt-1 block text-[0.68rem] text-faint">
                Used to compare planned schedule against actual progress.
              </span>
            </label>
            <label className="block">
              <span className="text-xs text-muted">Theme</span>
              <select
                className="field mt-1.5"
                value={s.theme}
                onChange={(e) =>
                  updateSettings({ theme: e.target.value as "dark" | "light" })
                }
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
              </select>
            </label>
          </div>
        </Card>

        <Card className="h-fit">
          <CardHeader title="Available time" />
          <div className="space-y-4 px-5 py-4">
            <label className="block">
              <span className="text-xs text-muted">
                Weekday minutes: {s.weekdayMinutes}
              </span>
              <input
                type="range"
                min={30}
                max={360}
                step={15}
                className="mt-2 w-full accent-[var(--color-accent)]"
                value={s.weekdayMinutes}
                onChange={(e) =>
                  updateSettings({ weekdayMinutes: Number(e.target.value) })
                }
              />
            </label>
            <label className="block">
              <span className="text-xs text-muted">
                Weekend minutes: {s.weekendMinutes}
              </span>
              <input
                type="range"
                min={30}
                max={480}
                step={15}
                className="mt-2 w-full accent-[var(--color-accent)]"
                value={s.weekendMinutes}
                onChange={(e) =>
                  updateSettings({ weekendMinutes: Number(e.target.value) })
                }
              />
            </label>
            <div>
              <span className="text-xs text-muted">Study days</span>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {DAY_NAMES.map((name, i) => (
                  <button
                    key={name}
                    onClick={() => toggleStudyDay(i)}
                    aria-pressed={s.studyDays.includes(i)}
                    className={`rounded-lg border px-2.5 py-1.5 text-xs transition ${
                      s.studyDays.includes(i)
                        ? "border-accent/50 bg-accent-soft text-accent"
                        : "border-line bg-raised text-faint hover:text-ink"
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-[0.68rem] leading-relaxed text-faint">
                Non-study days are skipped when the schedule is projected onto the
                calendar. Rest days are part of the plan, not a failure of it.
              </p>
            </div>
          </div>
        </Card>

        <Card className="h-fit">
          <CardHeader
            title="Backup"
            hint="Progress lives in this browser's local storage. Export before clearing site data or switching machines."
          />
          <div className="space-y-4 px-5 py-4">
            <Button variant="ghost" onClick={download}>
              <span className="flex items-center gap-2">
                <Download size={14} /> Export progress as JSON
              </span>
            </Button>
            <div>
              <textarea
                className="field min-h-24 resize-y font-mono text-xs"
                placeholder="Paste a previously exported JSON backup here"
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
              />
              <div className="mt-2 flex items-center gap-3">
                <Button
                  variant="ghost"
                  disabled={!importText.trim()}
                  onClick={() => {
                    const ok = importState(importText);
                    setImportResult(
                      ok
                        ? "Imported. Anything unreadable fell back to defaults."
                        : "That is not valid JSON — nothing was changed.",
                    );
                    if (ok) setImportText("");
                  }}
                >
                  <span className="flex items-center gap-2">
                    <Upload size={14} /> Import
                  </span>
                </Button>
                {importResult && (
                  <span className="text-xs text-muted">{importResult}</span>
                )}
              </div>
            </div>
          </div>
        </Card>

        <Card className="h-fit">
          <CardHeader title="Danger zone" />
          <div className="space-y-3 px-5 py-4">
            <p className="text-xs leading-relaxed text-muted">
              Resetting clears every completed task, day, evidence tick, note,
              journal entry and review. Days 1-3 are restored to their seeded
              state. This cannot be undone — export a backup first.
            </p>
            {confirmReset ? (
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="danger"
                  onClick={() => {
                    resetAll();
                    setConfirmReset(false);
                  }}
                >
                  <span className="flex items-center gap-2">
                    <AlertTriangle size={14} /> Yes, erase everything
                  </span>
                </Button>
                <Button variant="ghost" onClick={() => setConfirmReset(false)}>
                  Cancel
                </Button>
              </div>
            ) : (
              <Button variant="danger" onClick={() => setConfirmReset(true)}>
                Reset all progress
              </Button>
            )}
          </div>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader title="Not built yet" hint="Listed honestly rather than faked" />
        <ul className="space-y-2 px-5 py-4 text-xs leading-relaxed text-muted">
          <li>
            · <span className="text-ink">GitHub sync</span> — no integration
            exists. Commit counts and repository state are not read from
            anywhere. Coming when there is a backend to hold a token safely.
          </li>
          <li>
            · <span className="text-ink">AI mentor</span> — explain, hint, quiz,
            review code, analyse weaknesses. Architected for, deliberately not
            stubbed with fake output. It needs an API key and a server, which
            arrives in phase 11 and 14.
          </li>
          <li>
            · <span className="text-ink">Cloud sync</span> — state is local to
            this browser only. Use export/import until the FastAPI backend exists.
          </li>
        </ul>
      </Card>
    </div>
  );
}
