"use client";

import { useRef, useState } from "react";
import { functions, type Fn } from "@/content/extras";
import { useEntry } from "@/lib/store";

/* Compass positions at rest: Thinking top, Intuition right, Feeling bottom, Sensation left. */
/** Round for SSR: Node and browsers can disagree in the last float digits. */
const r2 = (n: number) => Math.round(n * 100) / 100;

const ORDER: Fn[] = ["thinking", "intuition", "feeling", "sensation"];

export type TypesPick = { superior: Fn; attitude: "introverted" | "extraverted" };

export default function TypesCompass() {
  const [saved, setSaved] = useEntry<TypesPick>("types-pick");
  const [sup, setSup] = useState<Fn | null>(saved?.superior ?? null);
  const [attitude, setAttitude] = useState<TypesPick["attitude"]>(saved?.attitude ?? "introverted");
  const [spin, setSpin] = useState(0);
  const drag = useRef<{ a0: number; spin0: number } | null>(null);
  const wheel = useRef<HTMLDivElement>(null);

  const choose = (f: Fn) => {
    const i = ORDER.indexOf(f);
    // rotate so the chosen function sits at the top, taking the shortest way round
    const target = -i * 90;
    let next = target;
    while (next - spin > 180) next -= 360;
    while (spin - next > 180) next += 360;
    setSpin(next);
    setSup(f);
    setSaved({ superior: f, attitude });
  };

  const angleAt = (e: React.PointerEvent) => {
    const r = wheel.current!.getBoundingClientRect();
    return (Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180) / Math.PI;
  };

  const inf = sup ? functions[sup].opposite : null;

  return (
    <div className="types">
      <div className="types-left">
        <div
          ref={wheel}
          className="compass"
          onPointerDown={(e) => {
            if ((e.target as HTMLElement).closest("button")) return;
            (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
            drag.current = { a0: angleAt(e), spin0: spin };
          }}
          onPointerMove={(e) => {
            if (!drag.current) return;
            setSpin(drag.current.spin0 + angleAt(e) - drag.current.a0);
          }}
          onPointerUp={() => {
            if (!drag.current) return;
            drag.current = null;
            const steps = Math.round(-spin / 90);
            const f = ORDER[((steps % 4) + 4) % 4];
            choose(f);
          }}
        >
          <svg viewBox="0 0 400 400" className="compass-face" aria-hidden>
            <circle cx="200" cy="200" r="186" className="c-ring" />
            <circle cx="200" cy="200" r="150" className="c-ring c-ring--dash" />
            <circle cx="200" cy="200" r="46" className="c-ring" />
            <line x1="200" y1="20" x2="200" y2="380" className="c-axis" />
            <line x1="20" y1="200" x2="380" y2="200" className="c-axis c-axis--irr" />
            {Array.from({ length: 72 }, (_, i) => {
              const a = (i * 5 * Math.PI) / 180;
              const long = i % 18 === 0;
              return (
                <line
                  key={i}
                  x1={r2(200 + Math.cos(a) * 186)}
                  y1={r2(200 + Math.sin(a) * 186)}
                  x2={r2(200 + Math.cos(a) * (long ? 170 : 180))}
                  y2={r2(200 + Math.sin(a) * (long ? 170 : 180))}
                  className="c-tick"
                />
              );
            })}
          </svg>
          <div className="compass-rotor" style={{ transform: `rotate(${spin}deg)` }}>
            {ORDER.map((f, i) => (
              <button
                key={f}
                type="button"
                className={`c-fn c-fn--${i} ${sup === f ? "is-sup" : ""} ${inf === f ? "is-inf" : ""}`}
                style={{ transform: `rotate(${i * 90}deg) translateY(calc(-1 * var(--rad))) rotate(${-i * 90 - spin}deg)` }}
                onClick={() => choose(f)}
                aria-pressed={sup === f}
              >
                <span className="c-fn-name">{functions[f].name}</span>
                <span className="c-fn-role">{sup === f ? "superior" : inf === f ? "inferior" : functions[f].kind}</span>
              </button>
            ))}
          </div>
          <div className="compass-center" aria-hidden>
            <span className="eyebrow">{attitude === "introverted" ? "In" : "Out"}</span>
          </div>
          <span className="compass-pointer compass-pointer--top" aria-hidden />
          <span className="compass-pointer compass-pointer--bottom" aria-hidden />
        </div>
        <div className="seg types-att" role="group" aria-label="Attitude">
          {(["introverted", "extraverted"] as const).map((a) => (
            <button
              key={a}
              type="button"
              aria-pressed={attitude === a}
              onClick={() => {
                setAttitude(a);
                if (sup) setSaved({ superior: sup, attitude: a });
              }}
            >
              {a === "introverted" ? "Introverted" : "Extraverted"}
            </button>
          ))}
        </div>
      </div>

      <div className="types-right" aria-live="polite">
        {!sup ? (
          <div className="types-prompt">
            <div className="eyebrow">Which question comes first for you?</div>
            <ul className="types-asks">
              {ORDER.map((f) => (
                <li key={f}>
                  <button type="button" className="types-ask" onClick={() => choose(f)}>
                    <span className="types-ask-q">“{functions[f].asks}”</span>
                    <span className="eyebrow">{functions[f].name}</span>
                  </button>
                </li>
              ))}
            </ul>
            <p className="types-hint">Pick the one you reach for without thinking. Or drag the compass.</p>
          </div>
        ) : (
          <div className="types-read" key={sup + attitude}>
            <div className="eyebrow">You lead with</div>
            <p className="types-sup">
              {attitude === "introverted" ? "Introverted" : "Extraverted"} {functions[sup].name}
            </p>
            <p className="types-sup-ask">You orient by asking: “{functions[sup].asks}”</p>
            <div className="types-inf">
              <div className="eyebrow">Your inferior function, the door</div>
              <p className="types-inf-name">{functions[inf!].name}</p>
              <p>{functions[sup].inferior}</p>
            </div>
            <p className="types-note">
              {attitude === "introverted"
                ? "Introverted: your energy flows inward, and the world matters for what it stirs in you. Your inferior side tends to show up turned outward: sudden, public, and clumsy."
                : "Extraverted: your energy flows outward, and the world is where you come alive. Your inferior side tends to show up turned inward: private, brooding, and hard to name."}
            </p>
            <p className="types-hint">This is a sketch, not a verdict. Jung warned against turning people into boxes.</p>
          </div>
        )}
      </div>
    </div>
  );
}
