"use client";

/**
 * One shared IntersectionObserver for every `.rv` element. Elements get
 * `is-in` once and are then released; CSS does the actual motion.
 */
let io: IntersectionObserver | null = null;

function observer() {
  if (io || typeof window === "undefined") return io;
  io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add("is-in");
          io?.unobserve(e.target);
        }
      }
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
  );
  return io;
}

export function observeReveal(el: Element | null) {
  if (!el) return () => {};
  const o = observer();
  o?.observe(el);
  return () => o?.unobserve(el);
}

/** Observe every `.rv` inside a root (for server-rendered content). */
export function observeAll(root: ParentNode = document) {
  const o = observer();
  root.querySelectorAll(".rv:not(.is-in)").forEach((el) => o?.observe(el));
}
