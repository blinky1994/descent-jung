"use client";

import { useMemo, useState } from "react";
import { archetypes } from "@/content/extras";
import { rich } from "@/lib/rich";
import { useEntry } from "@/lib/store";

function seeded(n: number) {
  let s = 31;
  const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  return Array.from({ length: n }, () => ({ x: r() * 1000, y: r() * 560, r: 0.3 + r() * 1.2, o: 0.15 + r() * 0.55 }));
}

export default function Constellation() {
  const [sel, setSel] = useState<string | null>(null);
  const [, setChosen] = useEntry<string>("archetype-star");
  const field = useMemo(() => seeded(160), []);
  const a = archetypes.find((x) => x.id === sel);

  const pick = (id: string) => {
    setSel(id);
    setChosen(archetypes.find((x) => x.id === id)?.name ?? id);
  };

  return (
    <div className="sky">
      <div className="sky-frame">
        <svg viewBox="0 0 1000 560" className="sky-svg" role="group" aria-label="Constellations of the archetypes">
          <g aria-hidden>
            {field.map((s, i) => (
              <circle
                key={i}
                cx={s.x}
                cy={s.y}
                r={s.r}
                opacity={s.o}
                className="sky-dust"
                style={{ animationDelay: `${(i % 11) * 0.6}s` }}
              />
            ))}
          </g>
          {archetypes.map((ar) => {
            const [ox, oy] = ar.at;
            const active = sel === ar.id;
            return (
              <g
                key={ar.id}
                className={`const ${active ? "is-active" : ""} ${sel && !active ? "is-dim" : ""}`}
                transform={`translate(${ox} ${oy})`}
                role="button"
                tabIndex={0}
                aria-pressed={active}
                aria-label={ar.name}
                onClick={() => pick(ar.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    pick(ar.id);
                  }
                }}
              >
                <rect x="-24" y="-24" width="190" height="200" className="const-hit" />
                {ar.lines.map(([p, q], i) => (
                  <line
                    key={i}
                    x1={ar.stars[p][0]}
                    y1={ar.stars[p][1]}
                    x2={ar.stars[q][0]}
                    y2={ar.stars[q][1]}
                    className="const-line"
                    pathLength={1}
                  />
                ))}
                {ar.stars.map(([x, y], i) => (
                  <g key={i} transform={`translate(${x} ${y})`}>
                    <circle r="9" className="const-halo" />
                    <circle r={i === 0 ? 3.2 : 2.3} className="const-star" />
                  </g>
                ))}
                <text x="70" y="172" className="const-label" textAnchor="middle">
                  {ar.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="sky-chips" role="group" aria-label="Choose an archetype">
        {archetypes.map((ar) => (
          <button
            key={ar.id}
            type="button"
            className={`chip ${sel === ar.id ? "is-on" : ""}`}
            aria-pressed={sel === ar.id}
            onClick={() => pick(ar.id)}
          >
            {ar.name}
          </button>
        ))}
      </div>

      <div className="sky-card" aria-live="polite">
        {a ? (
          <div key={a.id} className="sky-card-inner">
            <h3 className="sky-name">{a.name}</h3>
            <div className="sky-cols">
              <div>
                <span className="eyebrow sky-tag sky-tag--dark">When it possesses you</span>
                <p>{rich(a.possessed)}</p>
              </div>
              <div>
                <span className="eyebrow sky-tag">When you relate to it</span>
                <p>{rich(a.related)}</p>
              </div>
            </div>
            {a.note && <p className="sky-note">{rich(a.note)}</p>}
          </div>
        ) : (
          <p className="sky-hint">Choose a star. Each one is a pattern older than you, and each one has two faces.</p>
        )}
      </div>
    </div>
  );
}
