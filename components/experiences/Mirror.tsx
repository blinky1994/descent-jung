"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useEntry } from "@/lib/store";
import { isReducedMotion } from "@/lib/motion";

type Row = { who: string; trait: string };
const EMPTY: Row[] = [
  { who: "", trait: "" },
  { who: "", trait: "" },
  { who: "", trait: "" },
];

const GLYPHS = "abcdefghijklmnopqrstuvwxyz";

/** Scramble text from one string into another. */
function scrambleTo(el: HTMLElement, target: string, duration = 1.4) {
  const from = el.textContent ?? "";
  const len = Math.max(from.length, target.length);
  const state = { p: 0 };
  return gsap.to(state, {
    p: 1,
    duration,
    ease: "power2.inOut",
    onUpdate: () => {
      let out = "";
      for (let i = 0; i < len; i++) {
        const t = i / len;
        if (state.p > t + 0.25) out += target[i] ?? "";
        else if (state.p > t) out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        else out += from[i] ?? "";
      }
      el.textContent = out;
    },
    onComplete: () => {
      el.textContent = target;
    },
  });
}

export default function Mirror() {
  const [saved, setSaved] = useEntry<Row[]>("mirror");
  const [rows, setRows] = useState<Row[]>(EMPTY);
  const [phase, setPhase] = useState<"form" | "mirror">("form");
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (saved?.length) setRows([...saved, ...EMPTY].slice(0, 3));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saved === undefined]);

  const filled = rows.filter((r) => r.trait.trim());

  const hold = () => {
    if (!filled.length) return;
    setSaved(rows);
    setPhase("mirror");
  };

  useEffect(() => {
    if (phase !== "mirror" || !stage.current) return;
    const lines = Array.from(stage.current.querySelectorAll<HTMLElement>(".mirror-line"));
    const reduced = isReducedMotion();
    const tl = gsap.timeline();
    tl.from(lines, { autoAlpha: 0, y: 20, duration: reduced ? 0.4 : 1.2, stagger: 0.35, ease: "power3.out" });
    tl.to({}, { duration: reduced ? 0.6 : 2.4 });
    lines.forEach((line, i) => {
      const who = line.querySelector<HTMLElement>(".mirror-who")!;
      const verb = line.querySelector<HTMLElement>(".mirror-verb")!;
      const at = tl.duration() + i * (reduced ? 0.3 : 1.5);
      if (reduced) {
        tl.call(() => {
          who.textContent = "I";
          verb.textContent = "am";
          line.classList.add("is-turned");
        }, [], at);
      } else {
        tl.add(scrambleTo(who, "I", 1.2), at);
        tl.add(scrambleTo(verb, "am", 0.9), at + 0.25);
        tl.call(() => line.classList.add("is-turned"), [], at + 1.1);
      }
    });
    return () => {
      tl.kill();
    };
  }, [phase]);

  if (phase === "mirror") {
    return (
      <div className="mirror mirror--on" ref={stage}>
        <div className="mirror-glass" aria-hidden />
        <div className="mirror-lines" aria-live="polite">
          {filled.map((r, i) => (
            <p key={i} className="mirror-line">
              <span className="mirror-who">{r.who.trim() || "They"}</span>{" "}
              <span className="mirror-verb">{r.who.trim() ? "is" : "are"}</span>{" "}
              <span className="mirror-trait">{r.trait.trim().replace(/[.!]+$/, "")}</span>.
            </p>
          ))}
        </div>
        <button type="button" className="link-btn mirror-reset" onClick={() => setPhase("form")}>
          Look again
        </button>
      </div>
    );
  }

  return (
    <div className="mirror">
      <div className="mirror-form">
        <div className="eyebrow">The Mirror</div>
        <p className="mirror-lede">
          Name three people who get under your skin, and the one trait in each that you can&apos;t stand. Use an
          initial if you like. One word for the trait is enough.
        </p>
        <div className="mirror-rows">
          {rows.map((r, i) => (
            <div key={i} className="mirror-row">
              <span className="mirror-n">{i + 1}</span>
              <label className="sr-only" htmlFor={`mw-${i}`}>
                Person {i + 1}
              </label>
              <input
                id={`mw-${i}`}
                className="mirror-input mirror-input--who"
                placeholder={["My brother", "M.", "My boss"][i]}
                value={r.who}
                onChange={(e) => setRows(rows.map((x, j) => (j === i ? { ...x, who: e.target.value } : x)))}
              />
              <span className="mirror-is" aria-hidden>
                is
              </span>
              <label className="sr-only" htmlFor={`mt-${i}`}>
                What they are
              </label>
              <input
                id={`mt-${i}`}
                className="mirror-input mirror-input--trait"
                placeholder={["arrogant", "needy", "fake"][i]}
                value={r.trait}
                onChange={(e) => setRows(rows.map((x, j) => (j === i ? { ...x, trait: e.target.value } : x)))}
              />
            </div>
          ))}
        </div>
        <button type="button" className="btn btn--primary" onClick={hold} disabled={!filled.length}>
          Hold up the mirror
        </button>
      </div>
    </div>
  );
}
