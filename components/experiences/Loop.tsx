"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { loopLines } from "@/content/extras";
import { useEntry } from "@/lib/store";
import { isReducedMotion } from "@/lib/motion";

export default function Loop() {
  const root = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const [count, setCount] = useState(1);
  const [broken, setBroken] = useState(false);
  const [pattern, setPattern] = useEntry<string>("loop");
  const [draft, setDraft] = useState("");

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const q = gsap.utils.selector(el);
    if (isReducedMotion()) return;

    const t = gsap.timeline({ repeat: -1, paused: true, onRepeat: () => setCount((c) => c + 1) });
    t.set(q(".loop-figure"), { x: 0, autoAlpha: 1, scaleX: 1, transformOrigin: "50% 50%" })
      .set(q(".loop-door-panel"), { scaleX: 1 })
      .set(q(".loop-flash"), { opacity: 0 })
      .to(q(".loop-figure"), { x: 460, duration: 3.4, ease: "none" })
      .to(q(".loop-figure-body"), { y: -3, duration: 0.2, yoyo: true, repeat: 16, ease: "sine.inOut" }, 0)
      .to(q(".loop-door-panel"), { scaleX: 0.15, transformOrigin: "100% 50%", duration: 0.6, ease: "power2.inOut" }, 2.9)
      .to(q(".loop-figure"), { autoAlpha: 0, duration: 0.4 }, 3.4)
      .to(q(".loop-flash"), { opacity: 0.9, duration: 0.15 }, 3.7)
      .to(q(".loop-flash"), { opacity: 0, duration: 0.6 }, 3.85)
      .to(q(".loop-door-panel"), { scaleX: 1, duration: 0.4 }, 3.9)
      .to({}, { duration: 0.5 });
    tl.current = t;

    // Only run while visible.
    const io = new IntersectionObserver(([e]) => {
      if (!tl.current || broken) return;
      if (e.isIntersecting) tl.current.play();
      else tl.current.pause();
    });
    io.observe(el);
    return () => {
      io.disconnect();
      t.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const breakLoop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    setPattern(draft.trim());
    setBroken(true);
    const el = root.current;
    if (!el) return;
    const q = gsap.utils.selector(el);
    tl.current?.pause();
    gsap
      .timeline()
      .to(q(".loop-figure"), { autoAlpha: 1, duration: 0.3 })
      .to(q(".loop-figure"), { x: 215, duration: 1.4, ease: "power2.out" }, 0)
      .to(q(".loop-figure"), { scaleX: -1, transformOrigin: "50% 50%", duration: 0.5, ease: "power2.inOut" }, 1.2)
      .to(q(".loop-door"), { autoAlpha: 0, y: 12, duration: 1.2, ease: "power2.in" }, 1.4)
      .to(q(".loop-ground-far"), { strokeDashoffset: 0, duration: 2, ease: "power2.out" }, 1.6)
      .to(q(".loop-light"), { opacity: 1, duration: 2.4 }, 1.8)
      .from(q(".loop-verdict"), { autoAlpha: 0, y: 14, duration: 1.4, ease: "power3.out" }, 2.4);
  };

  const line = loopLines[(count - 1) % loopLines.length];

  return (
    <div ref={root} className={`loop ${broken ? "is-broken" : ""}`}>
      <div className="loop-head">
        <span className="eyebrow">Loop {String(count).padStart(2, "0")}</span>
        <span className="loop-line" key={count}>
          {broken ? "The pattern, named." : line}
        </span>
      </div>
      <svg viewBox="0 0 640 260" className="loop-scene" aria-hidden>
        <defs>
          <radialGradient id="loop-light-g" cx="50%" cy="100%" r="50%">
            <stop offset="0" stopColor="var(--accent)" stopOpacity=".45" />
            <stop offset="1" stopColor="var(--accent)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect className="loop-light" x="0" y="0" width="640" height="260" fill="url(#loop-light-g)" opacity="0" />
        <line x1="40" y1="210" x2="600" y2="210" className="loop-ground" />
        <line x1="600" y1="210" x2="640" y2="210" pathLength={1} className="loop-ground-far" />
        <g className="loop-door">
          <rect x="500" y="92" width="64" height="118" className="loop-door-frame" />
          <rect x="502" y="94" width="60" height="116" className="loop-door-panel" />
        </g>
        <g className="loop-figure">
          <g transform="translate(70 0)">
          <g className="loop-figure-body">
            <circle cx="0" cy="146" r="9" />
            <line x1="0" y1="156" x2="0" y2="186" />
            <line x1="0" y1="186" x2="-7" y2="209" />
            <line x1="0" y1="186" x2="7" y2="209" />
            <line x1="0" y1="164" x2="-9" y2="180" />
            <line x1="0" y1="164" x2="9" y2="180" />
          </g>
          </g>
        </g>
        <rect className="loop-flash" x="0" y="0" width="640" height="260" opacity="0" />
      </svg>

      {!broken ? (
        <form className="loop-form" onSubmit={breakLoop}>
          <label htmlFor="loop-input" className="loop-label">
            Name your pattern in a few words.
          </label>
          <div className="loop-input-row">
            <input
              id="loop-input"
              className="loop-input"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={pattern || "I always end up rescuing people who…"}
              autoComplete="off"
            />
            <button type="submit" className="btn btn--primary" disabled={!draft.trim()}>
              See it
            </button>
          </div>
        </form>
      ) : (
        <div className="loop-verdict">
          <p className="loop-pattern">“{pattern}”</p>
          <p>Seeing it doesn&apos;t end it. But nothing ends until you see it.</p>
        </div>
      )}
    </div>
  );
}
