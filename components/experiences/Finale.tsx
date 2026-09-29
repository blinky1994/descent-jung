"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { KintsugiMask } from "./Mask";
import { furtherReading } from "@/content/extras";
import { scrollToId } from "@/lib/scroll";
import { isReducedMotion } from "@/lib/motion";
import { Reveal } from "../parts";
import { OpenCircle } from "../Prologue";

/** Chapter XVI's experience: the mask returns, whole, gold in its cracks, held rather than worn. */
export function ReturnMask() {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const gold = q(".kintsugi-gold path");
      if (isReducedMotion()) return;
      gsap.set(gold, { strokeDashoffset: 1 });
      const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top 65%", once: true } });
      tl.from(q(".kintsugi-svg"), { autoAlpha: 0, y: 60, rotate: 6, duration: 2.2, ease: "power3.out" })
        .to(gold, { strokeDashoffset: 0, duration: 2.6, stagger: 0.12, ease: "power2.inOut" }, 0.8)
        .from(q(".return-caption > *"), { autoAlpha: 0, y: 14, stagger: 0.2, duration: 1.2 }, 1.6);
    },
    { scope: root },
  );
  return (
    <div ref={root} className="return-mask">
      <div className="return-surface" aria-hidden>
        <span className="eyebrow">Depth</span>
        <span className="return-zero">0 m</span>
        <span className="eyebrow">The surface</span>
      </div>
      <KintsugiMask />
      <div className="return-caption">
        <p className="return-held">Held, not worn.</p>
        <p className="eyebrow">The same mask. The cracks are still there. Now they&apos;re gold.</p>
      </div>
    </div>
  );
}

export function Finale() {
  return (
    <>
      <section className="reading" data-palette="sunrise" aria-labelledby="reading-title">
        <Reveal className="reading-inner">
          <h2 id="reading-title" className="eyebrow">
            Keep going down
          </h2>
          <div className="reading-cols">
            <div>
              <h3>Start here</h3>
              <ul>
                {furtherReading.start.map(([who, what, note]) => (
                  <li key={what}>
                    <span className="reading-what">{what}</span>
                    <span className="reading-who">
                      {who}
                      {note ? ` — ${note}` : ""}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3>Go deeper</h3>
              <ul>
                {furtherReading.deeper.map(([who, what, note]) => (
                  <li key={what}>
                    <span className="reading-what">{what}</span>
                    <span className="reading-who">
                      {who}
                      {note ? ` — ${note}` : ""}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3>Watch</h3>
              <ul>
                {furtherReading.watch.map(([who, what, note]) => (
                  <li key={what}>
                    <span className="reading-what">{what}</span>
                    <span className="reading-who">
                      {who}
                      {note ? ` — ${note}` : ""}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="vocatus" data-palette="sunrise" aria-label="Final inscription">
        <OpenCircle closed className="vocatus-circle" />
        <Reveal className="vocatus-inner">
          <p className="vocatus-latin">Vocatus atque non vocatus, deus aderit.</p>
          <p className="vocatus-en">Called or not called, the god will be present.</p>
          <p className="vocatus-note">
            Jung carved these words over the door of his house in Küsnacht, and they are carved on his family&apos;s
            grave. They come from the answer the Oracle at Delphi gave the Spartans, which he found in Erasmus&apos;s
            collection of ancient sayings.
          </p>
          <button type="button" className="btn btn--ghost vocatus-again" onClick={() => scrollToId("threshold")}>
            Descend again
          </button>
        </Reveal>
      </section>

      <footer className="site-foot" data-palette="sunrise">
        <p>
          An educational experience, not therapy and not diagnosis. Quotations from C.G. Jung are cited for study;
          the <em>Collected Works</em> are published by Princeton University Press and Routledge. Verify paragraph
          numbers against your own edition. Everything you write stays on your device.
        </p>
      </footer>
    </>
  );
}
