"use client";

import { useSyncExternalStore } from "react";
import { settings, useSettings } from "./store";

const QUERY = "(prefers-reduced-motion: reduce)";

function systemReduced() {
  if (typeof window === "undefined") return false;
  return window.matchMedia(QUERY).matches;
}

/** Non-hook check, for use inside GSAP setup code. */
export function isReducedMotion() {
  const pref = settings.get().motion;
  if (pref === "reduced") return true;
  if (pref === "full") return false;
  return systemReduced();
}

function subscribeMedia(fn: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", fn);
  return () => mq.removeEventListener("change", fn);
}

export function useReducedMotion() {
  const pref = useSettings().motion;
  const sys = useSyncExternalStore(subscribeMedia, systemReduced, () => false);
  if (pref === "reduced") return true;
  if (pref === "full") return false;
  return sys;
}

export function isTouch() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: none), (pointer: coarse)").matches;
}
