"use client";

import { useEffect, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import Lenis from "lenis";
import { palettes, soundFor, type PaletteName } from "@/lib/palettes";
import { emit, on } from "@/lib/bus";
import { setLenis } from "@/lib/scroll";
import { settings, useSettings } from "@/lib/store";
import { useReducedMotion } from "@/lib/motion";
import { audio } from "@/lib/audio";
import { observeAll } from "@/lib/reveal";
import Hud from "./chrome/Hud";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, MotionPathPlugin);
  if (process.env.NODE_ENV !== "production") Object.assign(window, { ScrollTrigger, gsap });
}

export default function Experience({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const { mode, sound } = useSettings();

  /* Smooth scroll — off entirely for reduced motion. */
  useEffect(() => {
    document.documentElement.classList.toggle("reduce-motion", reduced);
    if (reduced) return;
    const lenis = new Lenis({
      duration: 1.35,
      easing: (t) => 1 - Math.pow(1 - t, 3.4),
      smoothWheel: true,
      wheelMultiplier: 0.85,
    });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    setLenis(lenis);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, [reduced]);

  /* The color arc, the depth gauge, and chapter tracking. */
  useEffect(() => {
    const root = document.documentElement;
    const meta = document.querySelector('meta[name="theme-color"]');
    let current = "";

    const apply = (name: PaletteName, instant = false) => {
      if (name === current || !palettes[name]) return;
      current = name;
      const p = palettes[name];
      gsap.to(root, {
        "--bg": p.bg,
        "--ink": p.ink,
        "--dim": p.dim,
        "--accent": p.accent,
        "--glow": p.glow,
        duration: instant || reduced ? 0.01 : 1.6,
        ease: "power2.inOut",
        overwrite: "auto",
      });
      root.dataset.palette = name;
      meta?.setAttribute("content", p.bg);
      emit("palette", name);
    };

    const triggers: ScrollTrigger[] = [];

    gsap.utils.toArray<HTMLElement>("[data-palette]").forEach((el) => {
      triggers.push(
        ScrollTrigger.create({
          trigger: el,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => self.isActive && apply(el.dataset.palette as PaletteName),
        }),
      );
    });

    gsap.utils.toArray<HTMLElement>("[data-act]").forEach((el) => {
      const from = Number(el.dataset.depthFrom);
      const to = Number(el.dataset.depthTo);
      const n = Number(el.dataset.act);
      triggers.push(
        ScrollTrigger.create({
          trigger: el,
          start: "top 50%",
          end: "bottom 50%",
          onUpdate: (self) => {
            if (self.isActive) emit("depth", from + (to - from) * self.progress);
          },
          onToggle: (self) => {
            if (!self.isActive) return;
            emit("act", n);
            if (settings.get().lastAct < n) settings.set({ lastAct: n });
          },
          onLeave: () => emit("depth", to),
          onLeaveBack: () => {
            emit("depth", from);
            if (n === 1) emit("act", 0);
          },
        }),
      );
    });

    let currentChapter: HTMLElement | null = null;
    gsap.utils.toArray<HTMLElement>("[data-chapter-num]").forEach((el) => {
      triggers.push(
        ScrollTrigger.create({
          trigger: el,
          start: "top 50%",
          end: "bottom 50%",
          onToggle: (self) => {
            if (self.isActive) {
              currentChapter = el;
              emit("chapter", { num: el.dataset.chapterNum!, title: el.dataset.chapterTitle! });
            } else if (currentChapter === el) {
              // Between chapters (act cards, night breaks, the Vessel) the HUD goes quiet.
              currentChapter = null;
              emit("chapter", null);
            }
          },
        }),
      );
    });

    ScrollTrigger.refresh();
    const activeAct = triggers.find((t) => t.isActive && (t.trigger as HTMLElement)?.dataset.act);
    if (activeAct) activeAct.vars.onUpdate?.(activeAct);
    else emit("depth", 0);
    const active = triggers.find((t) => t.isActive && (t.trigger as HTMLElement)?.dataset.palette);
    apply(((active?.trigger as HTMLElement)?.dataset.palette as PaletteName) ?? "void", true);

    observeAll();

    return () => triggers.forEach((t) => t.kill());
  }, [mode, reduced]);

  /* Keep ScrollTrigger honest when content changes height (details, results, fonts). */
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    let lastH = document.body.scrollHeight;
    const ro = new ResizeObserver(() => {
      clearTimeout(t);
      t = setTimeout(() => {
        const h = document.body.scrollHeight;
        if (Math.abs(h - lastH) > 2) {
          lastH = h;
          ScrollTrigger.refresh();
        }
      }, 220);
    });
    ro.observe(document.body);
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    return () => {
      ro.disconnect();
      clearTimeout(t);
    };
  }, []);

  /* Sound follows the palette. It only ever starts from a gesture. */
  useEffect(() => on("palette", (name) => audio?.setStage(soundFor[name as PaletteName] ?? "abyss")), []);

  useEffect(() => {
    if (!audio) return;
    if (!sound) {
      audio.disable();
      return;
    }
    if (audio.enabled) return;
    const start = () => {
      if (settings.get().sound) audio.enable();
      window.removeEventListener("pointerdown", start);
      window.removeEventListener("keydown", start);
    };
    window.addEventListener("pointerdown", start);
    window.addEventListener("keydown", start);
    return () => {
      window.removeEventListener("pointerdown", start);
      window.removeEventListener("keydown", start);
    };
  }, [sound]);

  return (
    <>
      <Hud />
      <div className="grain" aria-hidden />
      <main id="main">{children}</main>
    </>
  );
}
