"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * A tiny localStorage-backed store. Every read and write is guarded: in a
 * private window or with storage blocked, it silently falls back to memory.
 * Nothing here ever leaves the device.
 */
export function createStore<T extends Record<string, unknown>>(key: string, initial: T) {
  let state: T = initial;
  let loaded = false;
  let writeTimer: ReturnType<typeof setTimeout> | null = null;
  const listeners = new Set<() => void>();

  function load() {
    if (loaded || typeof window === "undefined") return;
    loaded = true;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) state = { ...initial, ...JSON.parse(raw) };
    } catch {
      /* storage unavailable — memory only */
    }
  }

  function persist() {
    if (writeTimer) clearTimeout(writeTimer);
    writeTimer = setTimeout(() => {
      try {
        window.localStorage.setItem(key, JSON.stringify(state));
      } catch {
        /* storage unavailable or full — memory only */
      }
    }, 250);
  }

  function emit() {
    listeners.forEach((l) => l());
  }

  return {
    get(): T {
      load();
      return state;
    },
    set(patch: Partial<T>) {
      load();
      state = { ...state, ...patch };
      persist();
      emit();
    },
    reset() {
      state = initial;
      try {
        window.localStorage.removeItem(key);
      } catch {
        /* ignore */
      }
      emit();
    },
    subscribe(fn: () => void) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    serverSnapshot: initial,
  };
}

export type Store<T extends Record<string, unknown>> = ReturnType<typeof createStore<T>>;

export function useStore<T extends Record<string, unknown>>(store: Store<T>): T {
  return useSyncExternalStore(store.subscribe, store.get, () => store.serverSnapshot);
}

/* ------------------------------------------------------------------ */
/* The Vessel — everything the visitor writes                          */
/* ------------------------------------------------------------------ */

type VesselState = Record<string, unknown>;
export const vessel = createStore<VesselState>("descent.vessel.v1", {});

export function useEntry<V>(id: string): [V | undefined, (v: V) => void] {
  const state = useStore(vessel);
  const set = useCallback((v: V) => vessel.set({ [id]: v }), [id]);
  return [state[id] as V | undefined, set];
}

/* ------------------------------------------------------------------ */
/* Settings — sound, motion, Five Nights progress                       */
/* ------------------------------------------------------------------ */

export type Settings = {
  sound: boolean;
  motion: "system" | "reduced" | "full";
  mode: "full" | "nights";
  lastAct: number;
  started: boolean;
};

export const settings = createStore<Settings>("descent.settings.v1", {
  sound: false,
  motion: "system",
  mode: "full",
  lastAct: 0,
  started: false,
});

export function useSettings() {
  return useStore(settings);
}
