"use client";

import { useCallback } from "react";
import { useStore } from "./store";
import { fireCue, unlockAudio, type CueRequest } from "./notifier";

/**
 * Fire a notification/sound cue bound to the user's current preferences.
 *
 * Returns what actually happened so callers never assume delivery. Silent by
 * default: both switches start off and permission is never requested here.
 */
export function useCue() {
  const { state } = useStore();
  const prefs = state.notifications;

  return useCallback(
    (request: CueRequest) => fireCue(prefs, request),
    [prefs],
  );
}

/**
 * Attach to any user gesture that precedes sound. Browsers only allow an
 * AudioContext to start from a gesture, so this is called when the user starts
 * a focus session rather than on page load.
 */
export function useAudioUnlock() {
  const { state } = useStore();
  const soundOn = state.notifications.sound;

  return useCallback(() => {
    if (soundOn) unlockAudio();
  }, [soundOn]);
}
