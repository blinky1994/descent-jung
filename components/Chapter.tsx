"use client";

import type { ReactNode } from "react";
import type { ActData, ChapterData } from "@/content/chapters";
import type { PaletteName } from "@/lib/palettes";
import { rich } from "@/lib/rich";
import { useSettings, settings } from "@/lib/store";
import { scrollToId } from "@/lib/scroll";
import { Deeper, Question, Quote, Reveal, Sting } from "./parts";
import Glyph from "./Glyph";

export function ChapterHead({ data }: { data: ChapterData }) {
  return (
    <header className="ch-head">
      <span className="ch-num">{data.num}</span>
      <span className="ch-rule" aria-hidden />
      <h2 id={`${data.id}-title`} className="ch-title">
        {data.title}
      </h2>
    </header>
  );
}

export function Teaching({ data, label = "The Teaching" }: { data: ChapterData; label?: string }) {
  if (!data.teaching.length) return null;
  return (
    <div className="teach-grid">
      <aside className="teach-side" aria-hidden>
        <span className="teach-numeral">{data.num}</span>
        <span className="eyebrow">{label}</span>
      </aside>
      <div className="teach">
        {data.teaching.map((p, i) => (
          <Reveal as="p" key={i} className={i === 0 ? "dropcap" : undefined} delay={i === 0 ? 0 : 60}>
            {rich(p)}
          </Reveal>
        ))}
      </div>
    </div>
  );
}

/**
 * The six-part anatomy. Palette zones are siblings (never nested) so the
 * color arc always knows which one is active.
 */
export default function Chapter({
  data,
  children,
  expPalette,
  outroPalette,
  afterTeaching,
  afterExperience,
  hideQuote,
  experienceClass,
}: {
  data: ChapterData;
  children?: ReactNode;
  expPalette?: PaletteName | null;
  outroPalette?: PaletteName;
  afterTeaching?: ReactNode;
  afterExperience?: ReactNode;
  hideQuote?: boolean;
  experienceClass?: string;
}) {
  const expZone = expPalette === null ? undefined : (expPalette ?? data.palette);
  return (
    <section
      id={data.id}
      className={`chapter chapter--${data.id}`}
      aria-labelledby={`${data.id}-title`}
      data-chapter-num={data.num}
      data-chapter-title={data.title}
    >
      <div className="ch-intro" data-palette={data.palette}>
        <ChapterHead data={data} />
        <Sting text={data.sting} />
        <Teaching data={data} />
        {afterTeaching}
        {!hideQuote && <Quote quote={data.quote} />}
      </div>
      {children && (
        <div className={`ch-exp ${experienceClass ?? ""}`} data-palette={expZone}>
          {children}
        </div>
      )}
      {afterExperience}
      <div className="ch-outro" data-palette={outroPalette ?? data.palette}>
        <Question {...data.question} />
        <Deeper items={data.deeper} reading={data.reading} />
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

export function ActCard({ act }: { act: ActData }) {
  return (
    <section id={`act-${act.n}`} className="act-card" data-palette={act.palette} aria-label={`Act ${act.numeral}: ${act.name}`}>
      <Reveal className="act-card-inner">
        <Glyph name={act.glyph} size={64} draw className="act-glyph" />
        <div className="act-meta eyebrow">
          Act {act.numeral}
          <span className="act-depth">
            {act.depth[0]} m <span aria-hidden>→</span> {act.depth[1]} m
          </span>
        </div>
        <h2 className="act-name">{act.name}</h2>
        {act.subtitle && <p className="act-sub">{act.subtitle}</p>}
        <p className="act-tagline">{act.tagline}</p>
      </Reveal>
    </section>
  );
}

/** Five Nights mode: a place to stop between acts. */
export function NightBreak({ after, next, palette }: { after: ActData; next: ActData; palette: PaletteName }) {
  const { mode } = useSettings();
  if (mode !== "nights") return null;
  return (
    <section className="night-break" data-palette={palette} aria-label="End of tonight's act">
      <Reveal className="night-inner">
        <Glyph name="albedo" size={28} />
        <div className="eyebrow">End of night {after.n} of five</div>
        <p className="night-title">This is where tonight ends.</p>
        <p className="night-note">{rich(after.nightNote)}</p>
        <p className="night-next eyebrow">
          Tomorrow: Act {next.numeral} — {next.name}
        </p>
        <div className="night-actions">
          <button
            type="button"
            className="btn"
            onClick={() => {
              settings.set({ lastAct: next.n });
              const el = document.getElementById(`night-saved-${after.n}`);
              if (el) el.hidden = false;
            }}
          >
            Close for tonight
          </button>
          <button type="button" className="btn btn--ghost" onClick={() => scrollToId(`act-${next.n}`)}>
            Continue anyway
          </button>
        </div>
        <p id={`night-saved-${after.n}`} className="night-saved" hidden>
          Your place is saved. When you come back, you&apos;ll be offered Act {next.numeral}. Sleep well.
        </p>
      </Reveal>
    </section>
  );
}
