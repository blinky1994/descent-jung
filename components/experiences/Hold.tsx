"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { audio } from "@/lib/audio";
import { useEntry } from "@/lib/store";
import { isReducedMotion } from "@/lib/motion";

const DURATION = 12;

type HoldResult = { a: string; b: string; held: boolean; seconds: number };

export default function Hold() {
  const [saved, setSaved] = useEntry<HoldResult>("hold");
  const [a, setA] = useState(saved?.a ?? "Freedom");
  const [b, setB] = useState(saved?.b ?? "Belonging");
  const [phase, setPhase] = useState<"ready" | "holding" | "collapsed" | "third">("ready");
  const [winner, setWinner] = useState<"a" | "b">("a");
  const [heldFor, setHeldFor] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const stringRef = useRef<SVGPathElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const holding = useRef(false);
  const t0 = useRef(0);
  const raf = useRef(0);
  const tension = useRef<ReturnType<NonNullable<typeof audio>["tension"]> | null>(null);

  const setP = (p: number, t: number) => {
    const el = root.current;
    if (!el) return;
    el.style.setProperty("--p", p.toFixed(3));
    const reduced = isReducedMotion();
    const amp = reduced ? 0 : p * p * 16;
    const jit = () => (Math.random() - 0.5) * amp * 0.35;
    el.style.setProperty("--ja", `${jit().toFixed(2)}px`);
    el.style.setProperty("--jb", `${jit().toFixed(2)}px`);
    // the string between them: a standing wave that tightens and trembles
    const pts: string[] = [];
    for (let i = 0; i <= 40; i++) {
      const x = (i / 40) * 1000;
      const env = Math.sin((i / 40) * Math.PI);
      const y = 100 + Math.sin(i * 0.9 + t * 0.045) * amp * env + Math.sin(i * 2.3 - t * 0.07) * amp * 0.4 * env;
      pts.push(`${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(2)}`);
    }
    stringRef.current?.setAttribute("d", pts.join(" "));
    if (ringRef.current) ringRef.current.style.strokeDashoffset = String(1 - p);
    tension.current?.update(p);
  };

  const tick = (now: number) => {
    if (!holding.current) return;
    const p = Math.min(1, (now - t0.current) / 1000 / DURATION);
    setP(p, now);
    if (p >= 1) {
      finish(true);
      return;
    }
    raf.current = requestAnimationFrame(tick);
  };

  const start = () => {
    if (phase === "holding" || phase === "third") return;
    if (!a.trim() || !b.trim()) return;
    holding.current = true;
    setPhase("holding");
    t0.current = performance.now();
    tension.current = audio?.tension() ?? null;
    raf.current = requestAnimationFrame(tick);
  };

  const finish = (ok: boolean) => {
    if (!holding.current) return;
    holding.current = false;
    cancelAnimationFrame(raf.current);
    const secs = (performance.now() - t0.current) / 1000;
    setHeldFor(secs);
    tension.current?.end(ok);
    tension.current = null;
    setSaved({ a: a.trim(), b: b.trim(), held: ok, seconds: Math.round(secs * 10) / 10 });
    if (ok) {
      setPhase("third");
      stringRef.current?.setAttribute("d", "M0 100 L1000 100");
    } else {
      setWinner(Math.random() < 0.5 ? "a" : "b");
      setPhase("collapsed");
      const el = root.current;
      if (el) gsap.to(el, { "--p": 0, duration: 0.8, ease: "power2.out" });
    }
  };

  const release = () => finish(false);

  useEffect(() => {
    setP(0, 0);
    return () => cancelAnimationFrame(raf.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reset = () => {
    setPhase("ready");
    setP(0, 0);
  };

  return (
    <div
      ref={root}
      className={`hold hold--${phase} ${phase === "collapsed" ? `hold--won-${winner}` : ""}`}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="hold-stage">
        <div className="hold-pole hold-pole--a">
          <label htmlFor="hold-a" className="eyebrow">
            One side
          </label>
          <input
            id="hold-a"
            className="hold-word"
            value={a}
            onChange={(e) => setA(e.target.value)}
            disabled={phase === "holding"}
            maxLength={24}
          />
        </div>

        <svg viewBox="0 0 1000 200" preserveAspectRatio="none" className="hold-string" aria-hidden>
          <path ref={stringRef} d="M0 100 L1000 100" />
        </svg>

        <div className="hold-center">
          {phase !== "third" ? (
            <button
              type="button"
              className="hold-btn"
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId);
                start();
              }}
              onPointerUp={release}
              onPointerCancel={release}
              onKeyDown={(e) => {
                if ((e.key === " " || e.key === "Enter") && !e.repeat) {
                  e.preventDefault();
                  start();
                }
              }}
              onKeyUp={(e) => {
                if (e.key === " " || e.key === "Enter") release();
              }}
              aria-label={`Press and hold to hold ${a} and ${b} together`}
            >
              <svg viewBox="0 0 120 120" className="hold-ring" aria-hidden>
                <circle cx="60" cy="60" r="56" className="hold-ring-bg" />
                <circle ref={ringRef} cx="60" cy="60" r="56" pathLength={1} className="hold-ring-fg" />
              </svg>
              <span>{phase === "holding" ? "Hold…" : "Hold"}</span>
            </button>
          ) : (
            <div className="hold-third" aria-live="polite">
              <svg viewBox="0 0 200 200" className="third-symbol" aria-hidden>
                <defs>
                  <radialGradient id="third-g" cx="50%" cy="50%" r="50%">
                    <stop offset="0" stopColor="#fff3d6" />
                    <stop offset=".45" stopColor="#f0c060" />
                    <stop offset="1" stopColor="rgba(240,101,74,0)" />
                  </radialGradient>
                </defs>
                <circle cx="100" cy="100" r="96" fill="url(#third-g)" className="third-glow" />
                <circle cx="82" cy="100" r="44" className="third-c" />
                <circle cx="118" cy="100" r="44" className="third-c" />
                <path d="M100 63 A44 44 0 0 1 100 137 A44 44 0 0 1 100 63 Z" className="third-lens" />
              </svg>
            </div>
          )}
        </div>

        <div className="hold-pole hold-pole--b">
          <label htmlFor="hold-b" className="eyebrow">
            The other
          </label>
          <input
            id="hold-b"
            className="hold-word"
            value={b}
            onChange={(e) => setB(e.target.value)}
            disabled={phase === "holding"}
            maxLength={24}
          />
        </div>
      </div>

      <div className="hold-text" aria-live="polite">
        {phase === "ready" && (
          <p>
            Name the two sides of a conflict you live with. Then press and hold, without letting go, for as long as it
            takes. <span className="hold-hint">(Mouse, finger, or the space bar.)</span>
          </p>
        )}
        {phase === "holding" && <p>Don&apos;t choose. Don&apos;t compromise. Just hold both.</p>}
        {phase === "collapsed" && (
          <>
            <p>
              You let go at {heldFor.toFixed(1)} seconds. <strong>{winner === "a" ? a : b}</strong> won. That&apos;s
              how most inner conflicts end, and it&apos;s why they come back.
            </p>
            <button type="button" className="btn btn--ghost" onClick={reset}>
              Try again
            </button>
          </>
        )}
        {phase === "third" && (
          <>
            <p className="hold-third-title">The third.</p>
            <p>
              It won&apos;t be a compromise. It will be something neither {a} nor {b} could have imagined on its own.
              Give it time. It often arrives as an image, in a dream or out of nowhere.
            </p>
            <button type="button" className="link-btn" onClick={reset}>
              Hold another pair
            </button>
          </>
        )}
      </div>
    </div>
  );
}
