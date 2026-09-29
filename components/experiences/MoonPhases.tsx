"use client";

import { useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { animaStages } from "@/content/extras";
import { isReducedMotion } from "@/lib/motion";

const R = 150;
const C = 200;

/** Lit region of a waxing moon, lit from the right. p: 0 = new, 1 = full. */
function phasePath(p: number) {
  const k = Math.cos(Math.PI * p);
  const rx = Math.abs(k) * R;
  const sweep = p < 0.5 ? 0 : 1;
  return `M ${C} ${C - R} A ${R} ${R} 0 0 1 ${C} ${C + R} A ${rx.toFixed(2)} ${R} 0 0 ${sweep} ${C} ${C - R} Z`;
}

function seeded(n: number) {
  let s = 7;
  const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  return Array.from({ length: n }, () => ({ x: r() * 1000, y: r() * 700, r: 0.3 + r() * 1.3, o: 0.2 + r() * 0.6 }));
}

export default function MoonPhases() {
  const root = useRef<HTMLDivElement>(null);
  const litRef = useRef<SVGPathElement>(null);
  const clipRef = useRef<SVGPathElement>(null);
  const haloRef = useRef<SVGPathElement>(null);
  const [stage, setStage] = useState(0);
  const stars = useMemo(() => seeded(90), []);

  useGSAP(
    () => {
      const set = (p: number) => {
        const d = phasePath(Math.max(0.04, Math.min(1, p)));
        litRef.current?.setAttribute("d", d);
        clipRef.current?.setAttribute("d", d);
        haloRef.current?.setAttribute("d", d);
        setStage(Math.min(3, Math.floor(p * 4 - 0.0001)));
      };
      if (isReducedMotion()) {
        set(1);
        return;
      }
      const state = { p: 0.04 };
      set(state.p);
      gsap.to(state, {
        p: 1,
        ease: "none",
        onUpdate: () => set(state.p),
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 0.6 },
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="moon-stage">
      <div className="moon-pin">
        <svg className="moon-stars" viewBox="0 0 1000 700" preserveAspectRatio="xMidYMid slice" aria-hidden>
          {stars.map((s, i) => (
            <circle key={i} cx={s.x} cy={s.y} r={s.r} opacity={s.o} style={{ animationDelay: `${(i % 9) * 0.7}s` }} />
          ))}
        </svg>
        <svg viewBox="0 0 400 400" className="moon-svg" aria-hidden>
          <defs>
            <radialGradient id="moon-lit" cx="62%" cy="40%" r="75%">
              <stop offset="0" stopColor="#f6f8fb" />
              <stop offset=".6" stopColor="#d8dee6" />
              <stop offset="1" stopColor="#a9b3bf" />
            </radialGradient>
            <filter id="moon-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="14" />
            </filter>
            <filter id="moon-soft" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" />
            </filter>
            <clipPath id="moon-clip">
              <path ref={clipRef} d={phasePath(0.04)} />
            </clipPath>
          </defs>
          <circle cx={C} cy={C} r={R} className="moon-dark" />
           <path ref={haloRef} d={phasePath(0.04)} className="moon-halo" filter="url(#moon-glow)" />
          <path ref={litRef} d={phasePath(0.04)} fill="url(#moon-lit)" />
          <g clipPath="url(#moon-clip)" className="moon-maria">
            <g filter="url(#moon-soft)">
            <circle cx="238" cy="150" r="30" />
            <circle cx="180" cy="120" r="18" />
            <circle cx="262" cy="232" r="24" />
            <circle cx="200" cy="266" r="14" />
            <circle cx="150" cy="200" r="22" />
            <circle cx="300" cy="180" r="10" />
            </g>
          </g>
        </svg>
        <ol className="moon-stages">
          {animaStages.map((s, i) => (
            <li key={s.n} className={i <= stage ? (i === stage ? "is-current" : "is-past") : ""}>
              <span className="moon-n eyebrow">{s.n}</span>
              <span className="moon-names">
                <span className="moon-anima">{s.anima}</span>
                <span className="moon-sep" aria-hidden>
                  /
                </span>
                <span className="moon-animus">{s.animus}</span>
              </span>
              <span className="moon-text">{s.text}</span>
            </li>
          ))}
        </ol>
        <p className="moon-legend eyebrow">Anima (Jung) / Animus (von Franz)</p>
      </div>
    </div>
  );
}
