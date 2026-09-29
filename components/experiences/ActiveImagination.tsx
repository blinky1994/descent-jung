"use client";

import { useEffect, useRef, useState } from "react";
import { imaginationPrompts } from "@/content/extras";
import { useEntry } from "@/lib/store";
import { AutoTextarea } from "../parts";

const TOTAL = 300;

function fmt(s: number) {
  const r = Math.max(0, Math.ceil(TOTAL - s));
  return `${Math.floor(r / 60)}:${String(r % 60).padStart(2, "0")}`;
}

export default function ActiveImagination() {
  const [state, setState] = useState<"ready" | "running" | "paused" | "done">("ready");
  const [elapsed, setElapsed] = useState(0);
  const [dialogue, setDialogue] = useEntry<string>("active-dialogue");
  const elapsedRef = useRef(0);

  useEffect(() => {
    if (state !== "running") return;
    const from = elapsedRef.current;
    const t0 = performance.now();
    const id = window.setInterval(() => {
      const s = from + (performance.now() - t0) / 1000;
      elapsedRef.current = s;
      setElapsed(s);
      if (s >= TOTAL) setState("done");
    }, 250);
    return () => clearInterval(id);
  }, [state]);

  const current = [...imaginationPrompts].reverse().find((p) => elapsed >= p.at) ?? imaginationPrompts[0];
  const idx = imaginationPrompts.indexOf(current);

  const reset = () => {
    elapsedRef.current = 0;
    setElapsed(0);
    setState("ready");
  };

  if (state === "ready") {
    return (
      <div className="ai ai--ready">
        <div className="eyebrow">A guided session · five minutes</div>
        <p className="ai-lede">
          Find somewhere you won&apos;t be interrupted. You&apos;ll be guided through the stages gently. Write the
          dialogue as it happens, or afterwards.
        </p>
        <ul className="ai-rules">
          <li>Don&apos;t invent. Let it come.</li>
          <li>Stay yourself. Don&apos;t just obey.</li>
          <li>Take what arrives seriously, even if it&apos;s strange.</li>
        </ul>
        <button type="button" className="btn btn--primary" onClick={() => setState("running")}>
          Begin
        </button>
      </div>
    );
  }

  return (
    <div className={`ai ai--${state}`}>
      <div className="ai-guide">
        <div className="ai-orb-wrap" aria-hidden>
          <svg viewBox="0 0 200 200" className="ai-ring">
            <circle cx="100" cy="100" r="94" pathLength={1} style={{ strokeDashoffset: 1 - Math.min(1, elapsed / TOTAL) }} />
          </svg>
          <span className={`ai-orb ${state === "running" ? "is-breathing" : ""}`} />
        </div>
        <p className="ai-step eyebrow">
          {state === "done" ? "Complete" : `${idx + 1} of ${imaginationPrompts.length}`}
        </p>
        <p className="ai-prompt" key={idx} aria-live="polite">
          {state === "done" ? "Eat something. Walk outside. Let it settle." : current.text}
        </p>
        <div className="ai-controls">
          <span className="ai-time">{state === "done" ? "0:00" : fmt(elapsed)}</span>
          {state === "running" && (
            <button type="button" className="link-btn" onClick={() => setState("paused")}>
              Pause
            </button>
          )}
          {state === "paused" && (
            <button type="button" className="link-btn" onClick={() => setState("running")}>
              Resume
            </button>
          )}
          <button type="button" className="link-btn" onClick={reset}>
            {state === "done" ? "Begin again" : "End"}
          </button>
        </div>
      </div>
      <div className="ai-journal">
        <label htmlFor="ai-dialogue" className="eyebrow">
          The dialogue
        </label>
        <AutoTextarea
          id="ai-dialogue"
          className="ai-textarea"
          minRows={10}
          value={dialogue ?? ""}
          onChange={(e) => setDialogue(e.target.value)}
          placeholder={"ME: Who are you?\nIT: …\nME: What do you want?\nIT: …"}
        />
      </div>
    </div>
  );
}
