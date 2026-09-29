"use client";

import { useEffect, useLayoutEffect, useRef, type CSSProperties, type ReactNode } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { rich } from "@/lib/rich";
import { observeReveal } from "@/lib/reveal";
import { isReducedMotion } from "@/lib/motion";
import { useEntry } from "@/lib/store";
import type { DeeperItem, Quote as QuoteT } from "@/content/chapters";

const useIsoLayout = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* ------------------------------------------------------------------ */

export function Reveal({
  children,
  className,
  delay,
  as = "div",
  id,
  style,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "p" | "li" | "section" | "figure" | "span";
  id?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => observeReveal(ref.current), []);
  const Tag = as as "div";
  return (
    <Tag
      ref={ref as React.Ref<HTMLDivElement>}
      id={id}
      className={`rv ${className ?? ""}`}
      style={{ ...(delay ? ({ "--d": `${delay}ms` } as CSSProperties) : null), ...style }}
    >
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------------ */

/** The one line that lands before any explanation. */
export function Sting({ text, className, tone }: { text: string; className?: string; tone?: "accent" }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const size = text.length < 36 ? "xl" : text.length < 66 ? "lg" : "md";

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (isReducedMotion()) {
        gsap.from(el, { autoAlpha: 0, duration: 1.2, scrollTrigger: { trigger: el, start: "top 88%", once: true } });
        return;
      }
      const split = SplitText.create(el, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        linesClass: "sting-line",
        onSplit(self) {
          return gsap.from(self.lines, {
            yPercent: 118,
            rotate: 1.5,
            duration: 1.7,
            ease: "expo.out",
            stagger: 0.13,
            scrollTrigger: { trigger: el, start: "top 84%", once: true },
          });
        },
      });
      return () => split.revert();
    },
    { scope: ref },
  );

  return (
    <p ref={ref} className={`sting sting--${size} ${tone === "accent" ? "sting--accent" : ""} ${className ?? ""}`}>
      {text}
    </p>
  );
}

/* ------------------------------------------------------------------ */

export function Quote({ quote, className }: { quote: QuoteT; className?: string }) {
  return (
    <Reveal as="figure" className={`quote ${className ?? ""}`}>
      <span className="quote-mark" aria-hidden>
        ✦
      </span>
      <blockquote>
        <p>“{quote.text}”</p>
      </blockquote>
      <figcaption>
        <span className="quote-who">C.G. Jung</span>
        <cite>{quote.source}</cite>
      </figcaption>
      {quote.note && <p className="quote-note">{quote.note}</p>}
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */

export function AutoTextarea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { minRows?: number },
) {
  const { minRows = 3, ...rest } = props;
  const ref = useRef<HTMLTextAreaElement>(null);
  useIsoLayout(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight + 2}px`;
  }, [props.value]);
  return <textarea ref={ref} rows={minRows} data-lenis-prevent {...rest} />;
}

export function Question({
  id,
  prompt,
  placeholder,
  label = "The Question",
}: {
  id: string;
  prompt: string;
  placeholder?: string;
  label?: string;
}) {
  const [val, setVal] = useEntry<string>(id);
  const tid = `q-${id}`;
  return (
    <Reveal className="question">
      <div className="question-label eyebrow">{label}</div>
      <label htmlFor={tid} className="question-prompt">
        {prompt}
      </label>
      <AutoTextarea
        id={tid}
        className="question-input"
        value={val ?? ""}
        placeholder={placeholder ?? "Write here. Only you will ever read this."}
        onChange={(e) => setVal(e.target.value)}
      />
      <div className="question-status" aria-live="polite">
        <span className={`vessel-dot ${val ? "is-full" : ""}`} aria-hidden />
        {val ? "Kept in the Vessel" : "Nothing you write leaves this device"}
      </div>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */

export function Deeper({ items, reading }: { items: DeeperItem[]; reading?: string[] }) {
  if (!items.length && !reading?.length) return null;
  return (
    <Reveal className="deeper-wrap">
      <details className="deeper" onToggle={() => requestAnimationFrame(() => ScrollTrigger.refresh())}>
        <summary>
          <span className="deeper-title">Go deeper</span>
          <span className="deeper-meta eyebrow">
            {items.length} {items.length === 1 ? "note" : "notes"}
            {reading?.length ? ` · ${reading.length} to read` : ""}
          </span>
          <span className="deeper-icon" aria-hidden />
        </summary>
        <div className="deeper-body">
          {items.map((it) => (
            <div key={it.heading} className="deeper-item">
              <h4>{it.heading}</h4>
              <p>{rich(it.body)}</p>
            </div>
          ))}
          {reading?.length ? (
            <div className="deeper-item deeper-reading">
              <h4>Read</h4>
              <ul>
                {reading.map((r) => {
                  const i = r.indexOf(", ");
                  const who = i > 0 ? r.slice(0, i) : "";
                  const what = i > 0 ? r.slice(i + 2) : r;
                  return (
                    <li key={r}>
                      {who && <span className="reading-who">{who}</span>}
                      <span className="reading-what">{what}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}
        </div>
      </details>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={`eyebrow ${className ?? ""}`}>{children}</div>;
}
