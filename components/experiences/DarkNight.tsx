"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { chapterById } from "@/content/chapters";
import { darkScreens } from "@/content/extras";
import { rich } from "@/lib/rich";
import { emit } from "@/lib/bus";
import { lockScroll } from "@/lib/scroll";
import { isReducedMotion, isTouch, useReducedMotion } from "@/lib/motion";
import { ChapterHead } from "../Chapter";
import { Deeper, Question, Reveal, Sting } from "../parts";
import InkField from "../InkField";

const WHALE =
  "M20 110 C20 70 60 50 130 50 L330 58 C400 62 450 80 500 100 C530 110 548 104 566 80 C572 72 590 70 588 84 C584 104 570 116 556 124 C574 136 584 150 582 164 C580 176 566 172 560 164 C546 146 526 136 500 134 C440 150 370 162 300 160 L140 156 C70 154 20 150 20 110 Z";

function LanternZone() {
  const zone = useRef<HTMLDivElement>(null);
  const overlay = useRef<HTMLDivElement>(null);
  const whale = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [touch, setTouch] = useState(false);

  useEffect(() => setTouch(isTouch()), []);

  useEffect(() => {
    const z = zone.current;
    const ov = overlay.current;
    const wh = whale.current;
    if (!z || !ov || !wh) return;

    const band = isReducedMotion();
    ov.classList.toggle("is-band", band);

    let tx = window.innerWidth / 2;
    let ty = window.innerHeight * 0.5;
    let x = tx;
    let y = ty;
    let raf = 0;
    const onTouch = isTouch();
    const baseR = () =>
      onTouch ? Math.min(window.innerWidth * 0.5, 250) : Math.min(290, Math.max(200, window.innerWidth * 0.17));

    const onPointer = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      tx = t.clientX;
      ty = t.clientY;
    };

    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      x += (tx - x) * 0.1;
      y += (ty - y) * 0.1;
      const flick = 1 + Math.sin(t * 0.011) * 0.014 + Math.sin(t * 0.029) * 0.01 + (Math.random() - 0.5) * 0.014;
      ov.style.setProperty("--lx", `${x.toFixed(1)}px`);
      ov.style.setProperty("--ly", `${y.toFixed(1)}px`);
      ov.style.setProperty("--lr", `${(baseR() * flick).toFixed(1)}px`);
    };

    const setActive = (on: boolean) => {
      ov.classList.toggle("is-on", on);
      wh.classList.toggle("is-on", on);
      cancelAnimationFrame(raf);
      if (on && !band) raf = requestAnimationFrame(loop);
    };

    const st = ScrollTrigger.create({
      trigger: z,
      start: "top 45%",
      end: "bottom 55%",
      onToggle: (self) => setActive(self.isActive),
    });

    const whaleTween = gsap.fromTo(
      wh,
      { xPercent: -120 },
      {
        xPercent: 160,
        ease: "none",
        scrollTrigger: { trigger: z, start: "top bottom", end: "bottom top", scrub: true },
      },
    );

    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchstart", onTouchMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      st.kill();
      whaleTween.scrollTrigger?.kill();
      whaleTween.kill();
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchstart", onTouchMove);
      ov.classList.remove("is-on");
    };
  }, [reduced]);

  return (
    <div ref={zone} className="dn-zone" data-palette="abyss">
      <div className="dn-ink" aria-hidden>
        <InkField tint="#9a3412" amount={0.55} rise={0.6} />
      </div>
      <div ref={overlay} className="lantern" aria-hidden />
      <div ref={whale} className="whale" aria-hidden>
        <svg viewBox="0 0 600 200">
          <path d={WHALE} />
        </svg>
      </div>
      <p className="dn-cue">
        {reduced ? "Read slowly. There is no hurry here." : touch ? "Touch the dark to move your light." : "Move your light to read."}
      </p>
      {darkScreens.map((s, i) => {
        const kind = s.kind ?? "text";
        return (
          <div key={i} className={`dn-screen dn-screen--${kind}`}>
            <div className="dn-screen-inner">
              {s.label && <div className="dn-label eyebrow">{s.label}</div>}
              {kind === "quote" ? (
                <figure className="dn-quote">
                  <blockquote>
                    <p>“{s.body[0]}”</p>
                  </blockquote>
                  <figcaption className="eyebrow">C.G. Jung · {s.source}</figcaption>
                </figure>
              ) : kind === "list" ? (
                <ul className="dn-list">
                  {s.body.map((b, j) => (
                    <li key={j}>{rich(b)}</li>
                  ))}
                </ul>
              ) : kind === "blunt" ? (
                <p className="dn-blunt">
                  {s.body[0]}
                  <span>{s.body[1]}</span>
                </p>
              ) : (
                s.body.map((b, j) => <p key={j}>{rich(b)}</p>)
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Stay() {
  const [state, setState] = useState<"idle" | "sitting" | "done">("idle");
  const [elapsed, setElapsed] = useState(0);
  const startBtn = useRef<HTMLButtonElement>(null);
  const leaveBtn = useRef<HTMLButtonElement>(null);
  const DURATION = 60;

  useEffect(() => {
    if (state !== "sitting") return;
    const t0 = performance.now();
    const id = window.setInterval(() => {
      const s = (performance.now() - t0) / 1000;
      setElapsed(s);
      if (s >= DURATION) setState("done");
    }, 250);
    return () => clearInterval(id);
  }, [state]);

  useEffect(() => {
    if (state === "idle") return;
    lockScroll(true);
    leaveBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && leave();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      lockScroll(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state === "idle"]);

  const leave = () => {
    setState("idle");
    setElapsed(0);
    setTimeout(() => startBtn.current?.focus(), 50);
  };

  const phase = elapsed % 10 < 4 ? "breathe in" : "breathe out";

  return (
    <div className="stay" data-palette="abyss">
      <Reveal className="stay-inner">
        <p className="stay-word">Stay.</p>
        <p className="stay-sub">One minute in the dark. Nothing to read. Nothing to do. The only way through is to wait.</p>
        <button ref={startBtn} type="button" className="btn btn--ghost" onClick={() => setState("sitting")}>
          Sit in the dark for one minute
        </button>
      </Reveal>

      {state !== "idle" && (
        <div className="stay-overlay" role="dialog" aria-modal="true" aria-label="One minute in the dark">
          <button ref={leaveBtn} type="button" className="stay-leave link-btn" onClick={leave}>
            {state === "done" ? "Come back up" : "Leave the dark"}
          </button>
          <div className={`stay-breath ${state === "done" ? "is-done" : ""}`}>
            <svg viewBox="0 0 200 200" className="stay-ring" aria-hidden>
              <circle cx="100" cy="100" r="96" pathLength={1} style={{ strokeDashoffset: 1 - Math.min(1, elapsed / DURATION) }} />
            </svg>
            <span className="stay-orb" aria-hidden />
          </div>
          <p className="stay-phase" aria-live="polite">
            {state === "done" ? "You stayed." : phase}
          </p>
          {state === "done" && (
            <div className="stay-after">
              <p>That&apos;s the whole practice. Most people can&apos;t do it for a minute. The night asks for longer, but it starts like this.</p>
              <button type="button" className="btn btn--primary" onClick={leave}>
                Come back up
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function DarkNight() {
  const data = chapterById["dark-night"];
  return (
    <section
      id={data.id}
      className="chapter chapter--dark-night"
      aria-labelledby={`${data.id}-title`}
      data-chapter-num={data.num}
      data-chapter-title={data.title}
    >
      <div className="ch-intro" data-palette="abyss">
        <ChapterHead data={data} />
        <Sting text={data.sting} tone="accent" />
        <Reveal as="p" className="dn-lights">
          Put the lights out.
        </Reveal>
      </div>
      <LanternZone />
      <Stay />
      <div className="ch-outro" data-palette="abyss">
        <Question {...data.question} />
        <Reveal className="care-note">
          <p>
            A spiritual dark night and clinical depression can look alike, and they can happen at the same time.
            There is no shame in either, and no prize for enduring either alone.{" "}
            <strong>If the dark includes thoughts of ending your life, reach out today.</strong>
          </p>
          <button type="button" className="link-btn" onClick={() => emit("care", true)}>
            Find someone to talk to →
          </button>
        </Reveal>
        <Deeper items={data.deeper} reading={data.reading} />
      </div>
    </section>
  );
}
