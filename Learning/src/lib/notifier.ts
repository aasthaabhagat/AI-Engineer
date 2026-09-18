"use client";

import {
  shouldNotify,
  shouldPlaySound,
  type NotificationCategory,
  type NotificationPrefs,
} from "./notifications";

/**
 * Browser side of notifications: the Notification API and synthesized audio.
 * No library, no audio files — tones are generated with an oscillator.
 *
 * Two rules are enforced here rather than left to callers:
 *   1. Permission is only ever requested from an explicit user gesture.
 *   2. The AudioContext is created lazily, also from a gesture, so nothing
 *      ever fights the browser's autoplay policy.
 */

export type PermissionState = "unsupported" | "default" | "granted" | "denied";

export function notificationSupport(): PermissionState {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "unsupported";
  }
  return Notification.permission as PermissionState;
}

/** Call only from a click handler. */
export async function requestNotificationPermission(): Promise<PermissionState> {
  if (notificationSupport() === "unsupported") return "unsupported";
  try {
    const result = await Notification.requestPermission();
    return result as PermissionState;
  } catch {
    return "denied";
  }
}

let audioContext: AudioContext | null = null;

/** Create or resume the AudioContext. Must be called from a user gesture. */
export function unlockAudio(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return false;
    audioContext ??= new Ctor();
    if (audioContext.state === "suspended") void audioContext.resume();
    return true;
  } catch {
    return false;
  }
}

export function audioUnlocked(): boolean {
  return audioContext !== null && audioContext.state !== "closed";
}

/** Distinct, short, non-musical cues. Nothing that sounds like a game. */
const TONES: Record<NotificationCategory, { freq: number[]; duration: number }> = {
  taskComplete: { freq: [660], duration: 0.09 },
  focusComplete: { freq: [523.25, 659.25, 783.99], duration: 0.13 },
  timerComplete: { freq: [523.25, 392], duration: 0.12 },
  breakReminder: { freq: [440, 440], duration: 0.11 },
  milestone: { freq: [523.25, 659.25, 880], duration: 0.15 },
  review: { freq: [494, 587], duration: 0.12 },
  recovery: { freq: [392, 330], duration: 0.16 },
  dailyMission: { freq: [587, 784], duration: 0.12 },
};

/**
 * Play a short tone sequence. Silent if audio was never unlocked — it never
 * tries to start a context on its own, because that is exactly the behaviour
 * browsers block and users resent.
 */
export function playCue(category: NotificationCategory, volume: number): void {
  if (!audioContext || audioContext.state === "closed") return;
  const spec = TONES[category];
  if (!spec) return;

  const ctx = audioContext;
  const gainCeiling = Math.min(1, Math.max(0, volume)) * 0.25;
  if (gainCeiling === 0) return;

  let startAt = ctx.currentTime;
  for (const freq of spec.freq) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, startAt);

    // Short attack and exponential release: a soft blip, not a beep.
    gain.gain.setValueAtTime(0.0001, startAt);
    gain.gain.exponentialRampToValueAtTime(gainCeiling, startAt + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, startAt + spec.duration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(startAt);
    osc.stop(startAt + spec.duration + 0.02);

    startAt += spec.duration * 0.75;
  }
}

export interface CueRequest {
  category: NotificationCategory;
  title: string;
  body?: string;
  /** Distinct tag stops repeat notifications from stacking up. */
  tag?: string;
}

/**
 * Fire a notification and/or a sound, subject to preferences and permission.
 * Returns what actually happened, so the UI never claims more than it did.
 */
export function fireCue(
  prefs: NotificationPrefs,
  request: CueRequest,
): { notified: boolean; played: boolean } {
  let notified = false;
  let played = false;

  if (
    shouldNotify(prefs, request.category) &&
    notificationSupport() === "granted" &&
    typeof document !== "undefined" &&
    document.visibilityState !== "visible"
  ) {
    // Only notify when the tab is in the background. A system popup for
    // something the user is already looking at is pure noise.
    try {
      new Notification(request.title, {
        body: request.body,
        tag: request.tag ?? request.category,
        silent: true, // Our own cue handles sound, so the OS does not double up.
      });
      notified = true;
    } catch {
      notified = false;
    }
  }

  if (shouldPlaySound(prefs, request.category) && audioUnlocked()) {
    playCue(request.category, prefs.volume);
    played = true;
  }

  return { notified, played };
}
