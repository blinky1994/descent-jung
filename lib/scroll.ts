"use client";

import type Lenis from "lenis";
import { isReducedMotion } from "./motion";

let lenis: Lenis | null = null;

export function setLenis(l: Lenis | null) {
  lenis = l;
}

export function getLenis() {
  return lenis;
}

export function scrollToId(id: string, opts: { offset?: number; immediate?: boolean } = {}) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) {
    lenis.scrollTo(el, { offset: opts.offset ?? 0, duration: opts.immediate ? 0 : 2.4, immediate: opts.immediate });
  } else {
    el.scrollIntoView({ behavior: isReducedMotion() || opts.immediate ? "auto" : "smooth" });
  }
}

export function lockScroll(locked: boolean) {
  if (lenis) {
    if (locked) lenis.stop();
    else lenis.start();
  }
  document.documentElement.classList.toggle("is-locked", locked);
}
