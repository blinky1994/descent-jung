"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { rich } from "@/lib/rich";
import { audio } from "@/lib/audio";
import { isReducedMotion } from "@/lib/motion";
import { useEntry } from "@/lib/store";

const BEATS = [
  "A young woman was in analysis with him. She was brilliant, highly educated, and armored in rationality. The work was stuck. Nothing could reach her.",
  "One day she told him a dream. Someone had given her a golden scarab, a costly piece of jewelry.",
  "As she was speaking, Jung heard a soft tapping at the window behind him.",
  "He turned and saw a large insect knocking against the glass. He opened the window and caught it in the air. It was a rose chafer, the nearest thing to a golden scarab you can find in Switzerland.",
  "He handed it to her. *Here is your scarab.*",
  "Her armor cracked, and the work could finally begin. In ancient Egypt, the scarab was the symbol of rebirth.",
];

const HONEST =
  "**Now the honest part.** Synchronicity is a hypothesis, not established science. Our minds are pattern-hunting machines that remember the hits and forget the misses, and Jung knew it. There's a shadow side too: someone who sees signs in *everything*, every license plate and every repeated number, isn't awakening. They're inflating, putting themselves at the center of a universe that's always talking about them. Real synchronicities are rare. They tend to come at turning points, and they usually leave you humbled rather than feeling chosen.";

export function Beetle({ className, flying }: { className?: string; flying?: boolean }) {
  return (
    <svg viewBox="0 0 60 80" className={`beetle ${flying ? "is-flying" : ""} ${className ?? ""}`} aria-hidden>
      <defs>
        <linearGradient id="beetle-shell" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2b5f35" />
          <stop offset=".32" stopColor="#7faa3b" />
          <stop offset=".52" stopColor="#d8b43c" />
          <stop offset=".74" stopColor="#4c8a3c" />
          <stop offset="1" stopColor="#173f25" />
        </linearGradient>
      </defs>
      <g className="beetle-wings">
        <ellipse cx="13" cy="44" rx="13" ry="22" transform="rotate(-24 13 44)" />
        <ellipse cx="47" cy="44" rx="13" ry="22" transform="rotate(24 47 44)" />
      </g>
      <g className="beetle-legs" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 30 L11 23 L7 12" />
        <path d="M38 30 L49 23 L53 12" />
        <path d="M21 42 L8 44 L4 55" />
        <path d="M39 42 L52 44 L56 55" />
        <path d="M23 55 L13 64 L11 76" />
        <path d="M37 55 L47 64 L49 76" />
        <path d="M27 13 L21 5" />
        <path d="M33 13 L39 5" />
      </g>
      <ellipse cx="20.5" cy="4.5" rx="2" ry="2.6" className="beetle-club" />
      <ellipse cx="39.5" cy="4.5" rx="2" ry="2.6" className="beetle-club" />
      <ellipse cx="30" cy="16" rx="6" ry="5" fill="url(#beetle-shell)" />
      <path d="M20 23 C20 18 40 18 40 23 L42 32 C42 35 18 35 18 32 Z" fill="url(#beetle-shell)" />
      <path d="M18 34 C15 51 20 67 30 71 C40 67 45 51 42 34 Z" fill="url(#beetle-shell)" />
      <path d="M30 34 V71" className="beetle-seam" />
      <ellipse cx="24" cy="44" rx="3" ry="9" className="beetle-shine" />
      <circle cx="25" cy="26" r="1.2" className="beetle-dot" />
      <circle cx="35" cy="26" r="1.2" className="beetle-dot" />
    </svg>
  );
}

function Window({ open }: { open: boolean }) {
  const panes = (x0: number) =>
    [0, 1, 2].map((r) => <rect key={r} x={x0 + 8} y={170 + r * 76} width="104" height="68" className="win-pane" />);
  return (
    <svg viewBox="0 0 300 440" className={`win ${open ? "is-open" : ""}`} aria-hidden>
      <defs>
        <linearGradient id="win-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6e7bf" />
          <stop offset="1" stopColor="#cfe0d4" />
        </linearGradient>
        <linearGradient id="win-glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="rgba(255,255,255,.55)" />
          <stop offset=".5" stopColor="rgba(255,255,255,.08)" />
          <stop offset="1" stopColor="rgba(255,255,255,.3)" />
        </linearGradient>
        <clipPath id="win-arch">
          <path d="M30 410 V150 A120 120 0 0 1 270 150 V410 Z" />
        </clipPath>
      </defs>
      <g clipPath="url(#win-arch)">
        <rect x="0" y="0" width="300" height="440" fill="url(#win-sky)" />
        <circle cx="210" cy="120" r="26" className="win-sun" />
        <path d="M30 360 C80 320 120 350 160 330 C200 310 240 336 270 320 V410 H30 Z" className="win-hill" />
        {[
          [80, 350],
          [100, 338],
          [124, 352],
          [210, 336],
          [232, 346],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={9 + (i % 3) * 3} className="win-rose" />
        ))}
      </g>
      <g className="casement casement--l">
        <path d="M30 410 V150 A120 120 0 0 1 150 30 V410 Z" fill="url(#win-glass)" className="win-glass" />
        {panes(30)}
        <path d="M30 410 V150 A120 120 0 0 1 150 30 V410 Z" className="win-frame" />
      </g>
      <g className="casement casement--r">
        <path d="M270 410 V150 A120 120 0 0 0 150 30 V410 Z" fill="url(#win-glass)" className="win-glass" />
        {panes(150)}
        <path d="M270 410 V150 A120 120 0 0 0 150 30 V410 Z" className="win-frame" />
      </g>
      <path d="M22 418 V150 A128 128 0 0 1 278 150 V418" className="win-outer" />
      <rect x="10" y="410" width="280" height="14" className="win-sill" />
    </svg>
  );
}

export default function Scarab() {
  const root = useRef<HTMLDivElement>(null);
  const beetle = useRef<HTMLButtonElement>(null);
  const ripple = useRef<HTMLSpanElement>(null);
  const sill = useRef<HTMLDivElement>(null);
  const [state, setStateRaw] = useState<"away" | "flying" | "tapping" | "in">("away");
  // Scroll callbacks can fire back-to-back before React re-renders, so the ref
  // is updated synchronously and is the source of truth for the flight logic.
  const stateRef = useRef(state);
  const setState = (s: typeof state) => {
    stateRef.current = s;
    setStateRaw(s);
  };
  const [, setLetIn] = useEntry<boolean>("scarab-let-in");
  const tapTl = useRef<gsap.core.Timeline | null>(null);
  const flight = useRef<gsap.core.Tween | gsap.core.Timeline | null>(null);

  useEffect(() => {
    const el = root.current;
    const b = beetle.current;
    if (!el || !b) return;
    const reduced = isReducedMotion();

    const land = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      return w < 760 ? { x: w * 0.62, y: h * 0.2 } : { x: w * 0.64, y: h * 0.26 };
    };

    const startTapping = () => {
      setState("tapping");
      tapTl.current?.kill();
      if (reduced) return;
      const r = ripple.current;
      const tap = () => {
        audio?.tap();
        if (r) gsap.fromTo(r, { scale: 0.2, opacity: 0.7 }, { scale: 2.4, opacity: 0, duration: 0.9, ease: "power2.out" });
      };
      tapTl.current = gsap
        .timeline({ repeat: -1, repeatDelay: 1.8, delay: 0.6 })
        .to(b, { scale: 1.1, duration: 0.07, yoyo: true, repeat: 1, ease: "power1.inOut", onStart: tap })
        .to(b, { scale: 1.1, duration: 0.07, yoyo: true, repeat: 1, ease: "power1.inOut", onStart: tap }, "+=0.16");
    };

    const arrive = () => {
      if (stateRef.current === "in" || stateRef.current === "tapping" || stateRef.current === "flying") return;
      const { x, y } = land();
      flight.current?.kill();
      setState("flying");
      if (reduced) {
        gsap.set(b, { x, y, rotation: 0, scale: 1, autoAlpha: 0 });
        flight.current = gsap.to(b, { autoAlpha: 1, duration: 0.6, onComplete: startTapping });
        return;
      }
      const w = window.innerWidth;
      const h = window.innerHeight;
      gsap.set(b, { x: w + 80, y: -60, autoAlpha: 1, rotation: 0, scale: 1 });
      flight.current = gsap.to(b, {
        duration: 3.2,
        ease: "power1.inOut",
        motionPath: {
          path: [
            { x: w * 0.92, y: h * 0.12 },
            { x: w * 0.7, y: h * 0.06 },
            { x: w * 0.58, y: h * 0.3 },
            { x: w * 0.8, y: h * 0.36 },
            { x, y },
          ],
          curviness: 1.3,
          autoRotate: 90,
        },
        onComplete: () => {
          gsap.to(b, { rotation: 0, duration: 0.4 });
          startTapping();
        },
      });
    };

    const leave = () => {
      if (stateRef.current === "in" || stateRef.current === "away") return;
      tapTl.current?.kill();
      flight.current?.kill();
      setState("flying");
      flight.current = gsap.to(b, {
        x: "+=" + window.innerWidth * 0.5,
        y: -120,
        autoAlpha: reduced ? 0 : 1,
        rotation: 50,
        duration: reduced ? 0.4 : 1.6,
        ease: "power2.in",
        onComplete: () => {
          gsap.set(b, { autoAlpha: 0 });
          setState("away");
        },
      });
    };

    const beat = el.querySelector(".scarab-beat--2");
    const st1 = ScrollTrigger.create({
      trigger: beat,
      start: "top 70%",
      onEnter: arrive,
      onLeaveBack: leave,
    });
    const st2 = ScrollTrigger.create({
      trigger: el.querySelector(".scarab-story"),
      start: "top bottom",
      end: "bottom 30%",
      onLeave: leave,
      onEnterBack: arrive,
    });
    gsap.set(b, { autoAlpha: 0 });
    return () => {
      st1.kill();
      st2.kill();
      tapTl.current?.kill();
      flight.current?.kill();
    };
  }, []);

  const letIn = () => {
    const b = beetle.current;
    const target = sill.current?.getBoundingClientRect();
    if (!b || !target || stateRef.current !== "tapping") return;
    tapTl.current?.kill();
    setState("flying");
    setLetIn(true);
    audio?.bell(659.25, 0.05, 4);
    const reduced = isReducedMotion();
    gsap.to(b, {
      x: target.left + target.width / 2 - 27,
      y: target.top + target.height / 2 - 36,
      rotation: 0,
      scale: 0.9,
      duration: reduced ? 0.01 : 1.6,
      ease: "power2.inOut",
      onComplete: () => {
        gsap.set(b, { autoAlpha: 0 });
        setState("in");
      },
    });
  };

  return (
    <div ref={root} className={`scarab scarab--${state}`}>
      <div className="scarab-grid">
        <div className="scarab-story">
          {BEATS.map((b, i) => (
            <p key={i} className={`scarab-beat scarab-beat--${i} rv ${i === 4 ? "scarab-beat--key" : ""}`}>
              {rich(b)}
            </p>
          ))}
        </div>
        <div className="scarab-window">
          <div className="scarab-window-inner">
            <div className="win-box">
              <Window open={state === "in"} />
              <div ref={sill} className="scarab-sill">
                <Beetle className={`sill-beetle ${state === "in" ? "is-here" : ""}`} />
              </div>
            </div>
            <button
              type="button"
              className="link-btn scarab-open"
              onClick={letIn}
              disabled={state !== "tapping"}
              aria-hidden={state !== "tapping"}
              tabIndex={state === "tapping" ? 0 : -1}
            >
              {state === "in" ? "Here is your scarab." : "Open the window"}
            </button>
          </div>
        </div>
      </div>

      <p className="scarab-honest rv">{rich(HONEST)}</p>

      <button
        ref={beetle}
        type="button"
        className={`beetle-fixed ${state === "tapping" ? "is-tapping" : ""}`}
        onClick={letIn}
        aria-label="A beetle is tapping on the glass. Let it in."
        tabIndex={state === "tapping" ? 0 : -1}
      >
        <span ref={ripple} className="beetle-ripple" aria-hidden />
        <Beetle flying={state === "flying"} />
        <span className="beetle-hint" aria-hidden>
          tap · tap
        </span>
      </button>
    </div>
  );
}
