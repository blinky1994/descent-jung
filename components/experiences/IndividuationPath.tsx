"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { pathMarkers } from "@/content/extras";
import { isReducedMotion } from "@/lib/motion";

const CX = 500;
const CY = 500;

/** A long inward spiral that ends by closing into a circle around the center. */
function buildPath() {
  const pts: [number, number][] = [];
  const turns = 2.3;
  const a0 = (-140 * Math.PI) / 180;
  const rStart = 620;
  const rEnd = 150;
  const N = 520;
  for (let i = 0; i <= N; i++) {
    const f = i / N;
    const a = a0 + f * turns * Math.PI * 2;
    const r = rStart + (rEnd - rStart) * Math.pow(f, 0.8);
    pts.push([CX + Math.cos(a) * r, CY + Math.sin(a) * r]);
  }
  const aEnd = a0 + turns * Math.PI * 2;
  for (let i = 1; i <= 160; i++) {
    const a = aEnd + (i / 160) * Math.PI * 2;
    pts.push([CX + Math.cos(a) * rEnd, CY + Math.sin(a) * rEnd]);
  }
  return pts;
}

export default function IndividuationPath() {
  const root = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const headRef = useRef<SVGCircleElement>(null);
  const pts = useMemo(buildPath, []);
  const d = useMemo(() => "M" + pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L"), [pts]);
  const [markers, setMarkers] = useState<{ x: number; y: number; at: number; label: string; out: [number, number] }[]>([]);

  // Place chapter markers along the spiral part (first ~78% of the length).
  useEffect(() => {
    const p = pathRef.current;
    if (!p) return;
    const total = p.getTotalLength();
    const spiralShare = 0.78;
    setMarkers(
      pathMarkers.map((label, i) => {
        const at = 0.05 + (i / (pathMarkers.length - 1)) * (spiralShare - 0.1);
        const pt = p.getPointAtLength(at * total);
        const dx = pt.x - CX;
        const dy = pt.y - CY;
        const len = Math.hypot(dx, dy) || 1;
        return { x: pt.x, y: pt.y, at, label, out: [dx / len, dy / len] };
      }),
    );
  }, []);

  useGSAP(
    () => {
      const el = root.current;
      const p = pathRef.current;
      if (!el || !p) return;
      const total = p.getTotalLength();
      const set = (prog: number) => {
        p.style.strokeDashoffset = String(1 - prog);
        const pt = p.getPointAtLength(prog * total);
        headRef.current?.setAttribute("cx", String(pt.x));
        headRef.current?.setAttribute("cy", String(pt.y));
        el.style.setProperty("--prog", prog.toFixed(3));
        el.querySelectorAll<SVGGElement>(".ip-marker").forEach((m) => {
          m.classList.toggle("is-on", prog >= Number(m.dataset.at));
        });
        el.classList.toggle("is-closed", prog > 0.985);
      };
      if (isReducedMotion()) {
        set(1);
        return;
      }
      const state = { p: 0 };
      set(0);
      gsap.to(state, {
        p: 1,
        ease: "none",
        onUpdate: () => set(state.p),
        scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: 0.7 },
      });
    },
    { scope: root, dependencies: [markers.length] },
  );

  return (
    <div ref={root} className="ip-stage">
      <div className="ip-pin">
        <svg viewBox="-160 -160 1320 1320" className="ip-svg" aria-hidden>
          <defs>
            <radialGradient id="ip-core" cx="50%" cy="50%" r="50%">
              <stop offset="0" stopColor="#fff1d0" />
              <stop offset=".35" stopColor="#f0a060" />
              <stop offset="1" stopColor="rgba(185,28,28,0)" />
            </radialGradient>
          </defs>
          <circle cx={CX} cy={CY} r="140" fill="url(#ip-core)" className="ip-core" />
          <path d={d} className="ip-ghost" />
          <path ref={pathRef} d={d} pathLength={1} className="ip-path" />
          {markers.map((m) => (
            <g key={m.label} className="ip-marker" data-at={m.at}>
              <circle cx={m.x} cy={m.y} r="6" />
              <text
                x={m.x + m.out[0] * 22}
                y={m.y + m.out[1] * 22 + 7}
                textAnchor={m.out[0] > 0.3 ? "start" : m.out[0] < -0.3 ? "end" : "middle"}
              >
                {m.label}
              </text>
            </g>
          ))}
          <circle ref={headRef} cx={pts[0][0]} cy={pts[0][1]} r="7" className="ip-head" />
          <text x={CX} y={CY + 8} textAnchor="middle" className="ip-center-label">
            Self
          </text>
        </svg>
        <div className="ip-caption">
          <p>“There is no linear evolution; there is only a circumambulation of the self.”</p>
          <span className="eyebrow">C.G. Jung · Memories, Dreams, Reflections</span>
        </div>
      </div>
    </div>
  );
}
