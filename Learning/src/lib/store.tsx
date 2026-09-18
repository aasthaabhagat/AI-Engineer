"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { dayById } from "@/data";
import type { ProjectStatus } from "@/data/types";
import type { RadarStance } from "@/data/radar";
import type { NotificationPrefs } from "./notifications";
import {
  STORAGE_KEY,
  createInitialState,
  migrateState,
  type CueLog,
  type JournalEntry,
  type Note,
  type PersistedState,
  type Review,
  type Settings,
} from "./state";

interface StoreValue {
  state: PersistedState;
  /** False during the first render, before localStorage has been read. */
  hydrated: boolean;
  /** Set when saved data could not be read, so the UI can say so honestly. */
  storageError: string | null;

  toggleTask: (taskId: string) => void;
  completeDay: (dayId: string, record?: { reflection?: string; evidenceNote?: string }) => void;
  reopenDay: (dayId: string) => void;
  toggleEvidence: (evidenceId: string) => void;
  updateSettings: (patch: Partial<Settings>) => void;
  updateNotifications: (patch: Partial<NotificationPrefs>) => void;
  toggleNotificationCategory: (category: keyof NotificationPrefs["categories"]) => void;
  recordCue: (patch: Partial<CueLog>) => void;
  setRadarStance: (entryId: string, stance: RadarStance | null) => void;
  setProjectStatus: (projectId: string, status: ProjectStatus) => void;
  toggleMilestone: (projectId: string, milestoneId: string) => void;
  setProjectField: (
    projectId: string,
    patch: { githubUrl?: string; deploymentUrl?: string; notes?: string },
  ) => void;
  addNote: (note: Omit<Note, "id" | "createdAt">) => void;
  deleteNote: (id: string) => void;
  addJournalEntry: (entry: Omit<JournalEntry, "id" | "createdAt">) => void;
  deleteJournalEntry: (id: string) => void;
  saveReview: (review: Omit<Review, "id" | "createdAt">) => void;
  resetAll: () => void;
  exportState: () => string;
  importState: (json: string) => boolean;
}

const StoreContext = createContext<StoreValue | null>(null);

const newId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PersistedState>(() => createInitialState());
  const [hydrated, setHydrated] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);
  const skipNextSave = useRef(true);

  // Read once on mount. Any failure leaves the app usable on defaults.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setState(migrateState(JSON.parse(raw)));
    } catch (err) {
      setStorageError(
        err instanceof Error ? err.message : "Saved progress could not be read.",
      );
    } finally {
      setHydrated(true);
    }
  }, []);

  // Persist after hydration only, so defaults never overwrite real data.
  useEffect(() => {
    if (!hydrated) return;
    if (skipNextSave.current) {
      skipNextSave.current = false;
      return;
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      setStorageError(
        err instanceof Error ? err.message : "Progress could not be saved.",
      );
    }
  }, [state, hydrated]);

  const toggleTask = useCallback((taskId: string) => {
    setState((prev) => {
      const completedTasks = { ...prev.completedTasks };
      if (completedTasks[taskId]) delete completedTasks[taskId];
      else completedTasks[taskId] = new Date().toISOString();
      return { ...prev, completedTasks };
    });
  }, []);

  const completeDay = useCallback<StoreValue["completeDay"]>((dayId, record) => {
    setState((prev) => {
      const day = dayById.get(dayId);
      const completedTasks = { ...prev.completedTasks };
      const evidence = { ...prev.evidence };
      const now = new Date().toISOString();

      if (day) {
        // Finishing a day implies its essential tasks are done.
        for (const task of day.tasks) {
          if (task.priority === "essential" && !completedTasks[task.id]) {
            completedTasks[task.id] = now;
          }
        }
        for (const id of day.evidence ?? []) {
          if (!evidence[id]) evidence[id] = now;
        }
      }

      return {
        ...prev,
        completedTasks,
        evidence,
        completedDays: {
          ...prev.completedDays,
          [dayId]: { completedAt: now, ...record },
        },
      };
    });
  }, []);

  const reopenDay = useCallback((dayId: string) => {
    setState((prev) => {
      const completedDays = { ...prev.completedDays };
      delete completedDays[dayId];
      return { ...prev, completedDays };
    });
  }, []);

  const toggleEvidence = useCallback((evidenceId: string) => {
    setState((prev) => {
      const evidence = { ...prev.evidence };
      if (evidence[evidenceId]) delete evidence[evidenceId];
      else evidence[evidenceId] = new Date().toISOString();
      return { ...prev, evidence };
    });
  }, []);

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setState((prev) => ({ ...prev, settings: { ...prev.settings, ...patch } }));
  }, []);

  const updateNotifications = useCallback((patch: Partial<NotificationPrefs>) => {
    setState((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, ...patch },
    }));
  }, []);

  const toggleNotificationCategory = useCallback<
    StoreValue["toggleNotificationCategory"]
  >((category) => {
    setState((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        categories: {
          ...prev.notifications.categories,
          [category]: !prev.notifications.categories[category],
        },
      },
    }));
  }, []);

  const recordCue = useCallback((patch: Partial<CueLog>) => {
    setState((prev) => ({ ...prev, cues: { ...prev.cues, ...patch } }));
  }, []);

  const setRadarStance = useCallback<StoreValue["setRadarStance"]>(
    (entryId, stance) => {
      setState((prev) => {
        const radar = { ...prev.radar };
        if (stance === null) delete radar[entryId];
        else radar[entryId] = stance;
        return { ...prev, radar };
      });
    },
    [],
  );

  const setProjectStatus = useCallback((projectId: string, status: ProjectStatus) => {
    setState((prev) => {
      const existing = prev.projects[projectId] ?? { milestonesDone: [] };
      return {
        ...prev,
        projects: { ...prev.projects, [projectId]: { ...existing, status } },
      };
    });
  }, []);

  const toggleMilestone = useCallback((projectId: string, milestoneId: string) => {
    setState((prev) => {
      const existing = prev.projects[projectId] ?? { milestonesDone: [] };
      const done = existing.milestonesDone.includes(milestoneId)
        ? existing.milestonesDone.filter((m) => m !== milestoneId)
        : [...existing.milestonesDone, milestoneId];
      return {
        ...prev,
        projects: { ...prev.projects, [projectId]: { ...existing, milestonesDone: done } },
      };
    });
  }, []);

  const setProjectField = useCallback<StoreValue["setProjectField"]>(
    (projectId, patch) => {
      setState((prev) => {
        const existing = prev.projects[projectId] ?? { milestonesDone: [] };
        return {
          ...prev,
          projects: { ...prev.projects, [projectId]: { ...existing, ...patch } },
        };
      });
    },
    [],
  );

  const addNote = useCallback<StoreValue["addNote"]>((note) => {
    setState((prev) => ({
      ...prev,
      notes: [{ ...note, id: newId(), createdAt: new Date().toISOString() }, ...prev.notes],
    }));
  }, []);

  const deleteNote = useCallback((id: string) => {
    setState((prev) => ({ ...prev, notes: prev.notes.filter((n) => n.id !== id) }));
  }, []);

  const addJournalEntry = useCallback<StoreValue["addJournalEntry"]>((entry) => {
    setState((prev) => ({
      ...prev,
      journal: [
        { ...entry, id: newId(), createdAt: new Date().toISOString() },
        ...prev.journal,
      ],
    }));
  }, []);

  const deleteJournalEntry = useCallback((id: string) => {
    setState((prev) => ({ ...prev, journal: prev.journal.filter((j) => j.id !== id) }));
  }, []);

  const saveReview = useCallback<StoreValue["saveReview"]>((review) => {
    setState((prev) => ({
      ...prev,
      reviews: [
        { ...review, id: newId(), createdAt: new Date().toISOString() },
        ...prev.reviews,
      ],
    }));
  }, []);

  const resetAll = useCallback(() => {
    const fresh = createInitialState();
    setState(fresh);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    } catch {
      /* Reset still applies in memory. */
    }
  }, []);

  const exportState = useCallback(() => JSON.stringify(state, null, 2), [state]);

  const importState = useCallback((json: string) => {
    try {
      setState(migrateState(JSON.parse(json)));
      return true;
    } catch {
      return false;
    }
  }, []);

  const value = useMemo<StoreValue>(
    () => ({
      state,
      hydrated,
      storageError,
      toggleTask,
      completeDay,
      reopenDay,
      toggleEvidence,
      updateSettings,
      updateNotifications,
      toggleNotificationCategory,
      recordCue,
      setRadarStance,
      setProjectStatus,
      toggleMilestone,
      setProjectField,
      addNote,
      deleteNote,
      addJournalEntry,
      deleteJournalEntry,
      saveReview,
      resetAll,
      exportState,
      importState,
    }),
    [
      state,
      hydrated,
      storageError,
      toggleTask,
      completeDay,
      reopenDay,
      toggleEvidence,
      updateSettings,
      updateNotifications,
      toggleNotificationCategory,
      recordCue,
      setRadarStance,
      setProjectStatus,
      toggleMilestone,
      setProjectField,
      addNote,
      deleteNote,
      addJournalEntry,
      deleteJournalEntry,
      saveReview,
      resetAll,
      exportState,
      importState,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
