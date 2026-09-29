"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useEntry } from "@/lib/store";

type Brush = "gold" | "bone" | "vermilion";
type Stroke = { brush: Brush; size: number; sym: number; mirror: boolean; pts: [number, number][] };

const COLORS: Record<Brush, { core: string; halo: string }> = {
  gold: { core: "#f0cf6a", halo: "rgba(232,180,60,0.22)" },
  bone: { core: "#f3ead8", halo: "rgba(243,234,216,0.16)" },
  vermilion: { core: "#ef5a3a", halo: "rgba(239,90,58,0.2)" },
};

const SIZE = 900; // internal resolution of the plate

function drawPlate(ctx: CanvasRenderingContext2D, guides: boolean, sym: number) {
  const c = SIZE / 2;
  ctx.save();
  ctx.clearRect(0, 0, SIZE, SIZE);
  const g = ctx.createRadialGradient(c, c, 20, c, c, c);
  g.addColorStop(0, "#2a1c0c");
  g.addColorStop(0.7, "#1a1108");
  g.addColorStop(1, "#120b05");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(c, c, c - 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(220,180,90,0.35)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(c, c, c - 8, 0, Math.PI * 2);
  ctx.stroke();
  if (guides) {
    ctx.strokeStyle = "rgba(220,180,90,0.08)";
    ctx.lineWidth = 1;
    [0.18, 0.36, 0.54, 0.72].forEach((f) => {
      ctx.beginPath();
      ctx.arc(c, c, c * f, 0, Math.PI * 2);
      ctx.stroke();
    });
    for (let i = 0; i < sym; i++) {
      const a = (i / sym) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(c, c);
      ctx.lineTo(c + Math.cos(a) * (c - 10), c + Math.sin(a) * (c - 10));
      ctx.stroke();
    }
  }
  ctx.fillStyle = "rgba(240,207,106,0.5)";
  ctx.beginPath();
  ctx.arc(c, c, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawSegment(
  ctx: CanvasRenderingContext2D,
  s: Pick<Stroke, "brush" | "size" | "sym" | "mirror">,
  a: [number, number],
  b: [number, number],
) {
  const c = SIZE / 2;
  const col = COLORS[s.brush];
  ctx.save();
  ctx.translate(c, c);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.globalCompositeOperation = "lighter";
  for (let i = 0; i < s.sym; i++) {
    for (const m of s.mirror ? [1, -1] : [1]) {
      ctx.save();
      ctx.rotate((i / s.sym) * Math.PI * 2);
      ctx.scale(m, 1);
      ctx.strokeStyle = col.halo;
      ctx.lineWidth = s.size * 3.2;
      ctx.beginPath();
      ctx.moveTo(a[0] - c, a[1] - c);
      ctx.lineTo(b[0] - c, b[1] - c);
      ctx.stroke();
      ctx.strokeStyle = col.core;
      ctx.lineWidth = s.size;
      ctx.stroke();
      ctx.restore();
    }
  }
  ctx.restore();
}

export default function MandalaCanvas() {
  const plate = useRef<HTMLCanvasElement>(null);
  const ink = useRef<HTMLCanvasElement>(null);
  const [brush, setBrush] = useState<Brush>("gold");
  const [size, setSize] = useState(4);
  const [sym, setSym] = useState(12);
  const [mirror, setMirror] = useState(true);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [saved, setSaved] = useEntry<string>("mandala");
  const [justSaved, setJustSaved] = useState(false);
  const current = useRef<Stroke | null>(null);

  useEffect(() => {
    const ctx = plate.current?.getContext("2d");
    if (ctx) drawPlate(ctx, true, sym);
  }, [sym]);

  const redraw = useCallback((list: Stroke[]) => {
    const ctx = ink.current?.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, SIZE, SIZE);
    for (const s of list) for (let i = 1; i < s.pts.length; i++) drawSegment(ctx, s, s.pts[i - 1], s.pts[i]);
  }, []);

  const toLocal = (e: React.PointerEvent): [number, number] => {
    const r = ink.current!.getBoundingClientRect();
    return [((e.clientX - r.left) / r.width) * SIZE, ((e.clientY - r.top) / r.height) * SIZE];
  };

  const down = (e: React.PointerEvent) => {
    e.preventDefault();
    ink.current?.setPointerCapture(e.pointerId);
    current.current = { brush, size, sym, mirror, pts: [toLocal(e)] };
    setJustSaved(false);
  };
  const move = (e: React.PointerEvent) => {
    const s = current.current;
    if (!s) return;
    const p = toLocal(e);
    const last = s.pts[s.pts.length - 1];
    if (Math.hypot(p[0] - last[0], p[1] - last[1]) < 2) return;
    s.pts.push(p);
    const ctx = ink.current?.getContext("2d");
    if (ctx) drawSegment(ctx, s, last, p);
  };
  const up = () => {
    const s = current.current;
    current.current = null;
    if (s && s.pts.length > 1) setStrokes((l) => [...l, s]);
  };

  const undo = () => {
    const next = strokes.slice(0, -1);
    setStrokes(next);
    redraw(next);
  };
  const clear = () => {
    setStrokes([]);
    redraw([]);
  };

  /** For anyone who'd rather not draw: let a mandala assemble itself. */
  const drawForMe = () => {
    const brushes: Brush[] = ["gold", "bone", "vermilion"];
    const out: Stroke[] = [];
    const c = SIZE / 2;
    const rings = 5 + Math.floor(Math.random() * 3);
    for (let k = 0; k < rings; k++) {
      const r0 = 40 + k * (c / (rings + 1.2));
      const r1 = r0 + 20 + Math.random() * 50;
      const b = brushes[k % 3 === 1 ? 1 : k % 4 === 3 ? 2 : 0];
      const kind = Math.floor(Math.random() * 3);
      const pts: [number, number][] = [];
      const span = Math.PI / sym;
      for (let t = 0; t <= 24; t++) {
        const f = t / 24;
        const a = -Math.PI / 2 + f * span;
        const r = kind === 0 ? r0 + (r1 - r0) * Math.sin(f * Math.PI) : kind === 1 ? r0 + (r1 - r0) * f : r0 + (r1 - r0) * Math.abs(Math.sin(f * Math.PI * 2));
        pts.push([c + Math.cos(a) * r, c + Math.sin(a) * r]);
      }
      out.push({ brush: b, size: 2 + Math.random() * 3, sym, mirror: true, pts });
    }
    const next = [...strokes, ...out];
    setStrokes(next);
    redraw(next);
  };

  const keep = () => {
    const tmp = document.createElement("canvas");
    tmp.width = tmp.height = 720;
    const t = tmp.getContext("2d");
    if (!t || !plate.current || !ink.current) return;
    const pctx = document.createElement("canvas");
    pctx.width = pctx.height = SIZE;
    const pc = pctx.getContext("2d")!;
    drawPlate(pc, false, sym);
    t.fillStyle = "#120b05";
    t.fillRect(0, 0, 720, 720);
    t.drawImage(pctx, 0, 0, 720, 720);
    t.drawImage(ink.current, 0, 0, 720, 720);
    setSaved(tmp.toDataURL("image/jpeg", 0.86));
    setJustSaved(true);
  };

  return (
    <div className="mandala">
      <div className="mandala-epigraph">
        <p>Formation, transformation,</p>
        <p>the eternal mind&apos;s eternal recreation.</p>
        <span className="eyebrow">Goethe, Faust II · the lines Jung used for his mandalas</span>
      </div>
      <div className="mandala-body">
        <div className="mandala-plate">
          <canvas ref={plate} width={SIZE} height={SIZE} className="mandala-canvas" aria-hidden />
          <canvas
            ref={ink}
            width={SIZE}
            height={SIZE}
            className="mandala-canvas mandala-ink"
            role="img"
            aria-label="Your mandala. Drag to draw; your strokes are mirrored around the center."
            onPointerDown={down}
            onPointerMove={move}
            onPointerUp={up}
            onPointerCancel={up}
          />
        </div>
        <div className="mandala-tools">
          <div className="tool">
            <span className="eyebrow">Symmetry</span>
            <div className="seg">
              {[6, 8, 12].map((n) => (
                <button key={n} type="button" aria-pressed={sym === n} onClick={() => setSym(n)}>
                  {n}
                </button>
              ))}
            </div>
          </div>
          <div className="tool">
            <span className="eyebrow">Brush</span>
            <div className="seg">
              {(Object.keys(COLORS) as Brush[]).map((b) => (
                <button key={b} type="button" aria-pressed={brush === b} onClick={() => setBrush(b)}>
                  <i className={`swatch swatch--${b}`} aria-hidden /> {b[0].toUpperCase() + b.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="tool">
            <label className="eyebrow" htmlFor="mandala-size">
              Width
            </label>
            <input
              id="mandala-size"
              type="range"
              min={1}
              max={12}
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="range"
            />
          </div>
          <div className="tool">
            <button type="button" className="seg-toggle" aria-pressed={mirror} onClick={() => setMirror(!mirror)}>
              Mirror {mirror ? "on" : "off"}
            </button>
          </div>
          <div className="tool tool--row">
            <button type="button" className="link-btn" onClick={undo} disabled={!strokes.length}>
              Undo
            </button>
            <button type="button" className="link-btn" onClick={clear} disabled={!strokes.length}>
              Clear
            </button>
            <button type="button" className="link-btn" onClick={drawForMe}>
              Let it draw itself
            </button>
          </div>
          <button type="button" className="btn btn--primary" onClick={keep} disabled={!strokes.length}>
            Place it in the Vessel
          </button>
          <p className="mandala-status" aria-live="polite">
            {justSaved ? "Kept. It will be waiting at the end." : saved ? "A mandala is already in the Vessel. Keeping a new one replaces it." : "Draw slowly. Don't plan it."}
          </p>
        </div>
      </div>
    </div>
  );
}
