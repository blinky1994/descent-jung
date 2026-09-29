"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import InkField from "./InkField";
import Dust from "./Dust";
import { Question, Reveal, Sting } from "./parts";
import { timeline } from "@/content/extras";
import { acts } from "@/content/chapters";
import { settings, useSettings } from "@/lib/store";
import { audio } from "@/lib/audio";
import { scrollToId } from "@/lib/scroll";
import { isReducedMotion } from "@/lib/motion";

function arcPath(cx: number, cy: number, r: number, gapDeg: number) {
  const a1 = ((-90 + gapDeg / 2) * Math.PI) / 180;
  const a2 = ((-90 - gapDeg / 2) * Math.PI) / 180;
  const x1 = cx + r * Math.cos(a1);
  const y1 = cy + r * Math.sin(a1);
  const x2 = cx + r * Math.cos(a2);
  const y2 = cy + r * Math.sin(a2);
  return {
    d: `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 1 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`,
    x1: x1.toFixed(2),
    y1: y1.toFixed(2),
  };
}

export function OpenCircle({ className, closed = false }: { className?: string; closed?: boolean }) {
  const { d, x1, y1 } = arcPath(300, 300, 262, closed ? 0.01 : 16);
  return (
    <svg viewBox="0 0 600 600" className={`open-circle ${className ?? ""}`} aria-hidden>
      <circle cx="300" cy="300" r="238" className="open-circle-inner" />
      <path d={d} pathLength={1} className="open-circle-arc" />
      {!closed && (
        <g className="open-circle-ember" transform={`translate(${x1} ${y1})`}>
          <circle r="14" className="ember-halo" />
          <circle r="2.6" className="ember-core" />
        </g>
      )}
    </svg>
  );
}

export default function Prologue() {
  const root = useRef<HTMLElement>(null);
  const s = useSettings();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      if (isReducedMotion()) {
        gsap.from(q(".threshold-inner > *, .open-circle"), { autoAlpha: 0, duration: 1.2, stagger: 0.15 });
        return;
      }
      const l1 = SplitText.create(q(".t-l1"), { type: "words" });
      const l2 = SplitText.create(q(".t-l2"), { type: "words" });
      const tl = gsap.timeline({ delay: 0.4 });
      tl.from(q(".open-circle-arc"), { strokeDashoffset: 1, duration: 5.5, ease: "power2.inOut" }, 0)
        .from(q(".open-circle-inner, .open-circle-ember"), { autoAlpha: 0, duration: 2.5 }, 1.2)
        .from(l1.words, { autoAlpha: 0, y: 14, filter: "blur(8px)", duration: 1.6, stagger: 0.09, ease: "power3.out" }, 0.3)
        .from(l2.words, { autoAlpha: 0, filter: "blur(12px)", duration: 2.2, stagger: 0.14, ease: "power2.out" }, 2.4)
        .from(q(".threshold-sub > *"), { autoAlpha: 0, y: 16, duration: 1.4, stagger: 0.12, ease: "power3.out" }, 3.6)
        .from(q(".scroll-cue"), { autoAlpha: 0, duration: 1.5 }, 4.6);
      return () => {
        l1.revert();
        l2.revert();
      };
    },
    { scope: root },
  );

  const begin = (withSound: boolean) => {
    settings.set({ sound: withSound, started: true });
    if (withSound) audio?.enable();
    scrollToId("intention");
  };

  const resumeAct = mounted && s.started && s.lastAct > 1 ? acts.find((a) => a.n === s.lastAct) : undefined;

  return (
    <>
      <section id="threshold" ref={root} className="threshold" data-palette="void" aria-labelledby="site-title">
        <InkField tint="#c2410c" amount={0.5} />
        <Dust count={46} rise speed={0.7} className="threshold-dust" />
        <OpenCircle />
        <div className="threshold-inner">
          <h1 id="site-title" className="sr-only">
            Descent: an initiation into the psychology of C.G. Jung
          </h1>
          <p className="t-line t-l1">Most people spend their whole life avoiding one meeting.</p>
          <p className="t-line t-l2">This is that meeting.</p>
          <div className="threshold-sub">
            <p className="eyebrow t-kicker">An initiation into the psychology of C.G. Jung · in five acts</p>
            <div className="t-ctas">
              <button type="button" className="btn btn--primary" onClick={() => begin(true)}>
                Descend with sound
              </button>
              <button type="button" className="btn btn--ghost" onClick={() => begin(false)}>
                Descend in silence
              </button>
            </div>
            <p className="t-note">Headphones. Sixty minutes. Alone, if you can.</p>
            <button
              type="button"
              className="t-nights"
              aria-pressed={s.mode === "nights"}
              onClick={() => settings.set({ mode: s.mode === "nights" ? "full" : "nights" })}
            >
              {s.mode === "nights" ? (
                <>
                  <span className="t-nights-on">Five Nights is on.</span> One act per night; your place is kept.
                  <span className="t-nights-undo"> Switch to one sitting</span>
                </>
              ) : (
                <>
                  Or take it slowly: <u>Five Nights</u>, one act per night.
                </>
              )}
            </button>
            {resumeAct && (
              <div className="t-resume" role="status">
                <span>
                  Welcome back. You stopped in Act {resumeAct.numeral}, {resumeAct.name}.
                </span>
                <button type="button" className="btn btn--small" onClick={() => scrollToId(`act-${resumeAct.n}`)}>
                  Continue
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="scroll-cue" aria-hidden>
          <span>Scroll</span>
          <i />
        </div>
      </section>

      <section id="intention" className="intention" data-palette="void">
        <Reveal className="epigraph">
          <p>“Who looks outside, dreams; who looks inside, awakes.”</p>
          <span className="eyebrow">C.G. Jung · letter to Fanny Bowditch, 1916</span>
        </Reveal>
        <Question
          id="intention"
          label="Before you go down"
          prompt="What brought you here tonight?"
          placeholder="Be honest. No one will read this but you."
        />
      </section>

      <section id="jung" className="who" data-palette="void" aria-labelledby="who-title">
        <div className="who-head">
          <h2 id="who-title" className="eyebrow">
            Who he was · in sixty seconds
          </h2>
        </div>
        <Sting text="He didn't theorize about the dark. He went through it and took notes." />
        <div className="who-grid">
          <Reveal className="who-intro">
            <p>
              <strong>Carl Gustav Jung</strong>, 1875–1961. Swiss psychiatrist. Freud&apos;s chosen heir, until he
              wasn&apos;t. He fell into his own abyss for years, and came back with a map of the human psyche.
            </p>
            <p className="who-map">This is that map. You won&apos;t just read it. You&apos;ll walk it.</p>
          </Reveal>
          <ol className="timeline">
            {timeline.map((t, i) => (
              <Reveal as="li" key={t.year} className="tl-item" delay={(i % 3) * 70}>
                <span className="tl-year">{t.year}</span>
                <span className="tl-text">{t.text}</span>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
