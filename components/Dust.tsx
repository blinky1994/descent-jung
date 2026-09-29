"use client";

import { useEffect, useRef } from "react";
import { isReducedMotion } from "@/lib/motion";

type Mote = { x: number; y: number; r: number; vx: number; vy: number; a: number; tw: number };

/** Drifting motes: embers rising in the dark, or dust in a beam of light. */
export default function Dust({
  count = 60,
  rise = true,
  speed = 1,
  className,
  glow = true,
}: {
  count?: number;
  rise?: boolean;
  speed?: number;
  className?: string;
  glow?: boolean;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let w = 0;
    let h = 0;
    let motes: Mote[] = [];
    let color = "rgb(220,120,60)";

    const seed = () => {
      motes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.4 + Math.random() * 1.6,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (rise ? -1 : 1) * (0.08 + Math.random() * 0.35) * speed,
        a: 0.15 + Math.random() * 0.6,
        tw: Math.random() * Math.PI * 2,
      }));
    };
    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const reduced = isReducedMotion();
    let raf = 0;
    let frameN = 0;

    const draw = (move: boolean) => {
      if (frameN++ % 45 === 0) color = getComputedStyle(canvas).color;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = color;
      if (glow) {
        ctx.shadowColor = color;
        ctx.shadowBlur = 6;
      }
      for (const m of motes) {
        if (move) {
          m.tw += 0.02;
          m.x += m.vx + Math.sin(m.tw) * 0.12;
          m.y += m.vy;
          if (m.y < -10) m.y = h + 10;
          if (m.y > h + 10) m.y = -10;
          if (m.x < -10) m.x = w + 10;
          if (m.x > w + 10) m.x = -10;
        }
        ctx.globalAlpha = m.a * (0.6 + 0.4 * Math.sin(m.tw * 1.7));
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const loop = () => {
      raf = requestAnimationFrame(loop);
      draw(true);
    };

    const io = new IntersectionObserver(([e]) => {
      cancelAnimationFrame(raf);
      if (e.isIntersecting) {
        if (reduced) draw(false);
        else raf = requestAnimationFrame(loop);
      }
    });
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
    };
  }, [count, rise, speed, glow]);

  return <canvas ref={ref} className={`dust ${className ?? ""}`} aria-hidden />;
}
