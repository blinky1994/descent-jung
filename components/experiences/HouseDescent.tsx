"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { floors, houseCoda } from "@/content/extras";
import { rich } from "@/lib/rich";
import { isReducedMotion } from "@/lib/motion";
import { observeReveal } from "@/lib/reveal";
import Dust from "../Dust";

/* ---------------------------- line art ---------------------------- */

/** Round for SSR: Node and browsers can disagree in the last float digits. */
const r2 = (n: number) => Math.round(n * 100) / 100;

function Salon() {
  const parquet: ReactNode[] = [];
  // herringbone: two courses, slanting opposite ways
  for (let x = 20; x < 572; x += 24) {
    parquet.push(<line key={`a${x}`} x1={x} y1={382} x2={x + 12} y2={400} opacity={0.55} />);
    parquet.push(<line key={`b${x}`} x1={x + 12} y1={400} x2={x} y2={418} opacity={0.55} />);
  }
  parquet.push(<line key="mid" x1={20} y1={400} x2={580} y2={400} opacity={0.3} />);
  const candles = [
    [370, 92],
    [390, 102],
    [410, 105],
    [430, 102],
    [450, 92],
  ];
  return (
    <>
      <line x1="10" y1="40" x2="590" y2="40" />
      <line x1="10" y1="50" x2="590" y2="50" opacity={0.5} />
      <line x1="10" y1="380" x2="590" y2="380" />
      {parquet}
      {/* window + drapes */}
      <path d="M70 320 V150 A55 55 0 0 1 180 150 V320 Z" />
      <line x1="125" y1="98" x2="125" y2="320" />
      <line x1="70" y1="200" x2="180" y2="200" />
      <line x1="70" y1="260" x2="180" y2="260" />
      <path d="M56 70 Q125 98 194 70" />
      <path d="M60 72 C74 140 56 240 68 340" />
      <path d="M190 72 C176 140 194 240 182 340" />
      {/* gilt frame */}
      <rect x="250" y="110" width="120" height="150" />
      <rect x="262" y="122" width="96" height="126" opacity={0.6} />
      <path d="M268 222 C290 192 308 206 328 186 C340 176 348 190 352 200" opacity={0.7} />
      <circle cx="330" cy="150" r="8" opacity={0.7} />
      {[
        [250, 110],
        [370, 110],
        [250, 260],
        [370, 260],
      ].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r="4" />
      ))}
      {/* oval portrait */}
      <ellipse cx="470" cy="180" rx="52" ry="66" />
      <ellipse cx="470" cy="180" rx="42" ry="56" opacity={0.6} />
      <circle cx="470" cy="166" r="15" opacity={0.7} />
      <path d="M440 226 C446 200 494 200 500 226" opacity={0.7} />
      {/* chandelier */}
      <line x1="410" y1="50" x2="410" y2="80" />
      <path d="M366 90 Q410 122 454 90" />
      {candles.map(([x, y]) => (
        <g key={x}>
          <line x1={x} y1={y} x2={x} y2={y - 12} />
          <ellipse cx={x} cy={y - 17} rx="2" ry="4" className="flame" />
        </g>
      ))}
      <line x1="410" y1="106" x2="410" y2="122" />
      <circle cx="410" cy="126" r="3" />
      {/* console + rococo chair */}
      <line x1="236" y1="300" x2="384" y2="300" />
      <path d="M248 300 C244 330 258 352 252 380" />
      <path d="M372 300 C376 330 362 352 368 380" />
      <path d="M470 330 H544" />
      <path d="M478 330 C470 290 476 262 507 256 C538 262 544 290 536 330" />
      <path d="M474 330 C470 352 482 362 476 380" />
      <path d="M540 330 C544 352 532 362 538 380" />
    </>
  );
}

function OldRooms() {
  const bricks: ReactNode[] = [];
  for (let row = 0; row < 4; row++) {
    const y = 382 + row * 12;
    bricks.push(<line key={`r${row}`} x1="10" y1={y + 12} x2="590" y2={y + 12} opacity={0.5} />);
    for (let x = 10 + (row % 2) * 20; x < 590; x += 40) {
      bricks.push(<line key={`b${row}-${x}`} x1={x} y1={y} x2={x} y2={y + 12} opacity={0.5} />);
    }
  }
  const plank = (x: number) => {
    const dx = x - 410;
    const top = r2(190 - Math.sqrt(Math.max(0, 70 * 70 - dx * dx)));
    return <line key={x} x1={x} y1={top + 2} x2={x} y2={380} opacity={0.6} />;
  };
  return (
    <>
      <line x1="10" y1="40" x2="590" y2="40" />
      {Array.from({ length: 7 }, (_, i) => (
        <rect key={i} x={24 + i * 92} y="40" width="18" height="24" />
      ))}
      <line x1="10" y1="64" x2="590" y2="64" opacity={0.6} />
      <line x1="10" y1="380" x2="590" y2="380" />
      {bricks}
      {/* rough stones in the wall */}
      <path d="M200 110 h46 v28 h-46 Z M258 104 h38 v34 h-38 Z M216 150 h52 v26 h-52 Z M520 120 h40 v30 h-40 Z M40 120 h36 v26 h-36 Z" opacity={0.4} />
      {/* candle niche */}
      <path d="M90 262 V190 A30 30 0 0 1 150 190 V262 Z" />
      <rect x="114" y="224" width="12" height="38" />
      <path d="M120 222 C113 212 117 204 120 196 C123 204 127 212 120 222 Z" className="flame" />
      <circle cx="120" cy="208" r="22" strokeDasharray="2 5" opacity={0.5} />
      {/* table */}
      <line x1="150" y1="330" x2="304" y2="330" />
      <line x1="150" y1="336" x2="304" y2="336" opacity={0.5} />
      <path d="M172 336 L160 380 M282 336 L294 380 M166 360 H288" />
      {/* the heavy door */}
      <path d="M340 380 V190 A70 70 0 0 1 480 190 V380" />
      {[363, 386, 409, 432, 455].map(plank)}
      <line x1="340" y1="236" x2="480" y2="236" />
      <line x1="340" y1="322" x2="480" y2="322" />
      {[352, 376, 444, 468].map((x) => (
        <circle key={x} cx={x} cy="236" r="2.5" />
      ))}
      <circle cx="456" cy="288" r="9" />
    </>
  );
}

function Vault() {
  const arches: ReactNode[] = [];
  [130, 300, 470].forEach((cx) => {
    arches.push(<path key={`a${cx}`} d={`M${cx - 70} 380 V250 A70 70 0 0 1 ${cx + 70} 250 V380`} />);
    arches.push(<path key={`o${cx}`} d={`M${cx - 92} 250 A92 92 0 0 1 ${cx + 92} 250`} opacity={0.7} />);
    for (let deg = 180; deg >= 0; deg -= 18) {
      const a = (deg * Math.PI) / 180;
      arches.push(
        <line
          key={`v${cx}-${deg}`}
          x1={r2(cx + 70 * Math.cos(a))}
          y1={r2(250 - 70 * Math.sin(a))}
          x2={r2(cx + 92 * Math.cos(a))}
          y2={r2(250 - 92 * Math.sin(a))}
          opacity={0.6}
        />,
      );
    }
  });
  const blocks: ReactNode[] = [];
  for (let row = 0; row < 3; row++) {
    const y = 56 + row * 26;
    blocks.push(<line key={`r${row}`} x1="10" y1={y} x2="590" y2={y} opacity={0.4} />);
    for (let x = 10 + (row % 2) * 32; x < 590; x += 64) {
      blocks.push(<line key={`b${row}-${x}`} x1={x} y1={y} x2={x} y2={y + 26} opacity={0.4} />);
    }
  }
  return (
    <>
      <line x1="10" y1="40" x2="590" y2="40" />
      {blocks}
      {arches}
      <line x1="10" y1="380" x2="590" y2="380" />
      {[60, 180, 300, 420, 540].map((x) => (
        <line key={x} x1={x} y1="380" x2={x - 26} y2="428" opacity={0.45} />
      ))}
      <line x1="10" y1="404" x2="590" y2="404" opacity={0.3} />
      {/* amphora */}
      <path d="M284 378 C270 360 272 320 288 300 C292 294 292 286 290 280 H310 C308 286 308 294 312 300 C328 320 330 360 316 378 Z" />
      <path d="M290 284 C280 284 278 296 286 300 M310 284 C320 284 322 296 314 300" opacity={0.7} />
    </>
  );
}

function Cave() {
  const bone = (x: number, y: number, len: number, rot: number, key: string) => (
    <g key={key} transform={`translate(${x} ${y}) rotate(${rot})`}>
      <line x1={-len / 2} y1="0" x2={len / 2} y2="0" />
      <circle cx={-len / 2} cy="-3" r="3" />
      <circle cx={-len / 2} cy="3" r="3" />
      <circle cx={len / 2} cy="-3" r="3" />
      <circle cx={len / 2} cy="3" r="3" />
    </g>
  );
  const skull = (x: number, y: number, s: number, broken: boolean, key: string) => (
    <g key={key} transform={`translate(${x} ${y}) scale(${s})`}>
      <path
        d={
          broken
            ? "M-22 0 C-24 -26 6 -30 14 -18 M22 0 C22 8 16 12 14 18 L14 26 H-14 L-14 18 C-16 12 -22 8 -22 0"
            : "M-22 0 C-24 -26 24 -26 22 0 C22 8 16 12 14 18 L14 26 H-14 L-14 18 C-16 12 -22 8 -22 0 Z"
        }
      />
      <ellipse cx="-9" cy="2" rx="6" ry="7" />
      <ellipse cx="9" cy="2" rx="6" ry="7" />
      <path d="M0 9 L-3 16 H3 Z" />
      {[-9, -4.5, 0, 4.5, 9].map((tx) => (
        <line key={tx} x1={tx} y1="20" x2={tx} y2="26" opacity={0.7} />
      ))}
    </g>
  );
  const steps: string[] = [];
  let sx = 236;
  let sy = 58;
  for (let i = 0; i < 9; i++) {
    steps.push(`${i === 0 ? "M" : "L"}${sx} ${sy} L${sx} ${sy + 16} L${sx - 13} ${sy + 16}`);
    sy += 16;
    sx -= 13;
  }
  return (
    <>
      <path d="M0 70 C40 52 70 80 110 60 C150 40 160 70 200 58 L260 58 C300 70 330 44 370 62 C420 84 450 50 500 66 C540 78 570 58 600 70" />
      <path d="M0 396 C60 380 90 410 150 398 C210 386 240 404 300 400 C360 396 400 414 460 402 C520 390 560 408 600 398" />
      <path d="M20 90 C10 160 30 240 14 320 M586 90 C596 170 578 250 592 330" opacity={0.5} />
      {/* the lifted slab and its ring */}
      <g transform="rotate(-10 110 30)">
        <rect x="56" y="18" width="120" height="24" />
        <circle cx="116" cy="30" r="7" />
      </g>
      <rect x="196" y="40" width="70" height="18" opacity={0.6} />
      <path d={steps.join(" ")} opacity={0.8} />
      {/* remains of a primitive culture */}
      {skull(330, 358, 1.25, false, "s1")}
      {skull(418, 368, 1.05, true, "s2")}
      {bone(250, 382, 46, 12, "b1")}
      {bone(480, 386, 38, -20, "b2")}
      {bone(520, 372, 30, 64, "b3")}
      {bone(200, 390, 28, -8, "b4")}
      <path d="M150 386 l14 -8 l10 10 l-12 6 Z M540 392 l10 -10 l12 6 l-6 10 Z M372 392 l12 -4 l4 8 Z" opacity={0.7} />
    </>
  );
}

const ART = [Salon, OldRooms, Vault, Cave];

/* ---------------------------- floors ---------------------------- */

function FloorBlock({ i }: { i: number }) {
  const f = floors[i];
  const ref = useRef<HTMLDivElement>(null);
  const Art = ART[i];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.querySelectorAll(".floor-art :is(path,line,rect,circle,ellipse)").forEach((s, n) => {
      s.setAttribute("pathLength", "1");
      (s as SVGElement).style.setProperty("--i", String(n));
    });
    return observeReveal(el);
  }, []);

  return (
    <div ref={ref} className={`floor floor--${i + 1} rv`} data-palette={f.palette}>
      <div className="floor-inner">
        <div className="floor-text">
          <div className="floor-kicker eyebrow">
            <span>Floor {i + 1} of 4</span>
            <span className="floor-depth">
              {f.depth} · {f.label}
            </span>
          </div>
          <h3 className="floor-title">{f.title}</h3>
          <p className="floor-dream">{f.dream}</p>
          <p className="floor-meaning">{rich(f.meaning)}</p>
        </div>
        <div className="floor-art-wrap">
          {i === 3 && <Dust count={36} rise={false} speed={0.25} glow={false} className="cave-dust" />}
          <svg viewBox="0 0 600 440" className="floor-art" aria-hidden>
            <Art />
          </svg>
        </div>
      </div>
      {i < 3 && (
        <div className="stair" aria-hidden>
          <svg viewBox="0 0 80 240" preserveAspectRatio="xMidYMid meet">
            <path
              className="stair-path"
              pathLength={1}
              d="M40 0 V20 H30 V40 H48 V60 H32 V80 H50 V100 H30 V120 H48 V140 H32 V160 H50 V180 H30 V200 H40 V240"
            />
          </svg>
        </div>
      )}
    </div>
  );
}

export default function HouseDescent() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (isReducedMotion()) return;
      gsap.utils.toArray<SVGPathElement>(".stair-path", root.current).forEach((p) => {
        gsap.fromTo(
          p,
          { strokeDashoffset: 1 },
          {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: { trigger: p.closest(".stair"), start: "top 85%", end: "bottom 35%", scrub: true },
          },
        );
      });
      gsap.utils.toArray<HTMLElement>(".floor-art-wrap", root.current).forEach((w) => {
        gsap.fromTo(
          w,
          { yPercent: 8 },
          {
            yPercent: -8,
            ease: "none",
            scrollTrigger: { trigger: w, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="house">
      {floors.map((_, i) => (
        <FloorBlock key={i} i={i} />
      ))}
      <div className="house-coda" data-palette="cave">
        <p className="rv">{houseCoda}</p>
      </div>
    </div>
  );
}
