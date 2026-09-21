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
import {
  STORAGE_KEY,
  createInitialState,
  migrateState,
  type PersistedState,
  type Settings,
} from "./state";

interface StoreValue {
  state: PersistedState;
  /** False during the first render, before localStorage has been read. */
  hydrated: boolean;
  /** Set when saved data could not be read, so the UI can say so honestly. */
  storageError: string | null;

  toggleTask: (taskId: string) => void;
  completeDay: (dayId: string) => void;
  reopenDay: (dayId: string) => void;
  updateSettings: (patch: Partial<Settings>) => void;
}

const StoreContext = createContext<StoreValue | null>(null);

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

  const completeDay = useCallback((dayId: string) => {
    setState((prev) => {
      const day = dayById.get(dayId);
      const completedTasks = { ...prev.completedTasks };
      const now = new Date().toISOString();

      // Finishing a day implies its essential tasks are done.
      for (const task of day?.tasks ?? []) {
        if (task.priority === "essential" && !completedTasks[task.id]) {
          completedTasks[task.id] = now;
        }
      }

      return {
        ...prev,
        completedTasks,
        completedDays: { ...prev.completedDays, [dayId]: { completedAt: now } },
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

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setState((prev) => ({ ...prev, settings: { ...prev.settings, ...patch } }));
  }, []);

  const value = useMemo<StoreValue>(
    () => ({
      state,
      hydrated,
      storageError,
      toggleTask,
      completeDay,
      reopenDay,
      updateSettings,
    }),
    [state, hydrated, storageError, toggleTask, completeDay, reopenDay, updateSettings],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
