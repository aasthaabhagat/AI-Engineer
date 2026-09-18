"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Bell, Download, Upload, Volume2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { NOTIFICATION_CATEGORIES } from "@/lib/notifications";
import {
  notificationSupport,
  playCue,
  requestNotificationPermission,
  unlockAudio,
  type PermissionState,
} from "@/lib/notifier";
import { Button, Card, CardHeader, PageHeader, Pill } from "@/components/ui";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function SettingsPage() {
  const {
    state,
    updateSettings,
    updateNotifications,
    toggleNotificationCategory,
    resetAll,
    exportState,
    importState,
  } = useStore();
  const [confirmReset, setConfirmReset] = useState(false);
  const [importText, setImportText] = useState("");
  const [importResult, setImportResult] = useState<string | null>(null);
  const [permission, setPermission] = useState<PermissionState>("default");

  const s = state.settings;
  const n = state.notifications;

  // Read the real browser permission after mount; it is not available on the
  // server and must never be guessed.
  useEffect(() => {
    setPermission(notificationSupport());
  }, []);

  const enableNotifications = async () => {
    const result = await requestNotificationPermission();
    setPermission(result);
    updateNotifications({ enabled: result === "granted" });
  };

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

        <Card className="h-fit lg:col-span-2">
          <CardHeader
            title="Notifications and sound"
            hint="Both are off until you turn them on. Nothing plays or pops up without permission."
          />
          <div className="space-y-5 px-5 py-4">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 text-sm">
                    <Bell size={14} className="text-faint" /> Browser notifications
                  </span>
                  {permission === "granted" ? (
                    <label className="flex items-center gap-2 text-xs text-muted">
                      <input
                        type="checkbox"
                        className="checkbox"
                        checked={n.enabled}
                        onChange={(e) => updateNotifications({ enabled: e.target.checked })}
                      />
                      Enabled
                    </label>
                  ) : (
                    <Button
                      variant="ghost"
                      onClick={enableNotifications}
                      disabled={permission === "unsupported" || permission === "denied"}
                    >
                      Allow
                    </Button>
                  )}
                </div>
                <p className="mt-2 text-[0.68rem] leading-relaxed text-faint">
                  {permission === "unsupported" &&
                    "This browser does not support the Notification API."}
                  {permission === "denied" &&
                    "Permission was denied. Re-enable it in the browser's site settings — the page cannot ask again."}
                  {permission === "default" &&
                    "Requires your explicit permission. The prompt only appears when you press Allow."}
                  {permission === "granted" &&
                    "Granted. Notifications appear only when this tab is in the background — no popup for something already on screen."}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2 text-sm">
                    <Volume2 size={14} className="text-faint" /> Sound
                  </span>
                  <label className="flex items-center gap-2 text-xs text-muted">
                    <input
                      type="checkbox"
                      className="checkbox"
                      checked={n.sound}
                      onChange={(e) => {
                        if (e.target.checked) unlockAudio();
                        updateNotifications({ sound: e.target.checked });
                      }}
                    />
                    Enabled
                  </label>
                </div>
                <label className="mt-3 block">
                  <span className="text-xs text-muted">
                    Volume: {Math.round(n.volume * 100)}%
                  </span>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    disabled={!n.sound}
                    className="mt-2 w-full accent-[var(--color-accent)] disabled:opacity-40"
                    value={Math.round(n.volume * 100)}
                    onChange={(e) =>
                      updateNotifications({ volume: Number(e.target.value) / 100 })
                    }
                  />
                </label>
                <button
                  disabled={!n.sound}
                  onClick={() => {
                    unlockAudio();
                    playCue("milestone", n.volume);
                  }}
                  className="mt-1 text-xs text-accent hover:underline disabled:text-faint disabled:no-underline"
                >
                  Play a test tone
                </button>
                <p className="mt-2 text-[0.68rem] leading-relaxed text-faint">
                  Short synthesized tones, generated with the Web Audio API. No
                  audio files, no library.
                </p>
              </div>
            </div>

            <div>
              <p className="text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-faint">
                Categories
              </p>
              <ul className="mt-3 space-y-2.5">
                {NOTIFICATION_CATEGORIES.map((c) => (
                  <li key={c.id} className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      className="checkbox mt-0.5"
                      checked={n.categories[c.id]}
                      onChange={() => toggleNotificationCategory(c.id)}
                      aria-label={c.label}
                    />
                    <span className="min-w-0">
                      <span className="block text-sm">{c.label}</span>
                      <span className="block text-[0.68rem] leading-relaxed text-faint">
                        {c.description}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs text-muted">Daily reminder time</span>
                <input
                  type="time"
                  className="field mt-1.5"
                  value={n.dailyReminderTime}
                  onChange={(e) =>
                    updateNotifications({ dailyReminderTime: e.target.value })
                  }
                />
              </label>
              <label className="block">
                <span className="text-xs text-muted">
                  Suggest a break after {n.breakAfterMinutes} minutes
                </span>
                <input
                  type="range"
                  min={15}
                  max={120}
                  step={5}
                  className="mt-3 w-full accent-[var(--color-accent)]"
                  value={n.breakAfterMinutes}
                  onChange={(e) =>
                    updateNotifications({ breakAfterMinutes: Number(e.target.value) })
                  }
                />
              </label>
            </div>

            <p className="rounded-lg border border-line bg-raised px-3.5 py-3 text-[0.68rem] leading-relaxed text-muted">
              <Pill tone="warn">Limitation</Pill>{" "}
              <span className="mt-1.5 block">
                Cues only fire while this app is open in a tab. Reaching you when
                the browser is closed needs a service worker and push
                infrastructure, which this version does not have — so it does not
                pretend to. The daily reminder fires on the first check after
                your chosen time, once per day.
              </span>
            </p>
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
            · <span className="text-ink">Background notifications</span> — cues
            fire only while a tab is open. Waking you when the browser is closed
            needs a service worker and a push service.
          </li>
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
