"use client";

import { useMemo, useState } from "react";
import { amplifications, genericAmplification } from "@/content/extras";
import { rich } from "@/lib/rich";
import { useEntry } from "@/lib/store";
import { AutoTextarea } from "../parts";

export type DreamWork = {
  image: string;
  context: string;
  assoc: string;
  amp: string;
  comp: string;
  want: string;
  at?: number;
};

const BLANK: DreamWork = { image: "", context: "", assoc: "", amp: "", comp: "", want: "" };

const STEPS: { key: keyof DreamWork; name: string; prompt: string; help: string; placeholder: string }[] = [
  {
    key: "image",
    name: "The image",
    prompt: "Write down one image from a dream. Not the whole dream. Just one image.",
    help: "The one that stayed with you. A house with an extra room. A dog that wouldn't stop following you. Your old teacher, crying.",
    placeholder: "I was in my childhood house, but there was a staircase going down that had never been there…",
  },
  {
    key: "context",
    name: "Context",
    prompt: "What was happening in your life around the time of this dream?",
    help: "Dreams answer the day. What were you worried about, avoiding, or hoping for?",
    placeholder: "I'd just been offered the job. I said yes too quickly…",
  },
  {
    key: "assoc",
    name: "Personal association",
    prompt: "What does this image mean to you? What does it remind you of?",
    help: "Not what it means in general. What it means to you. Say anything that comes: memories, people, feelings, other images.",
    placeholder: "Stairs going down remind me of my grandmother's cellar. I was scared of it. She kept jam down there…",
  },
  {
    key: "amp",
    name: "Amplification",
    prompt: "Where else does this image live? In myth, fairy tale, scripture, film?",
    help: "Jung widened the personal image into the collective one. Some echoes are offered below. Take what resonates and ignore the rest.",
    placeholder: "Persephone going underground. The cellar in every horror film. Jung's own house…",
  },
  {
    key: "comp",
    name: "Compensation",
    prompt: "What attitude of your waking mind might this dream be correcting?",
    help: "If your waking self is too ___, the dream shows ___. Dreams bring what's missing. Be honest: what are you one-sided about right now?",
    placeholder: "I've been living entirely on the surface: busy, competent, upbeat. The dream shows a whole floor I've been ignoring…",
  },
  {
    key: "want",
    name: "The ask",
    prompt: "What does the dream want from you?",
    help: "Not what it means. What it asks. An attitude, an action, an attention. Something small and concrete you could honor this week.",
    placeholder: "To go down. To spend an hour a week doing nothing useful. To call my grandmother's sister…",
  },
];

function findAmplifications(text: string) {
  const words = new Set(text.toLowerCase().match(/[a-z]+/g) ?? []);
  return amplifications.filter((a) => a.keys.some((k) => words.has(k)));
}

export default function DreamWorkshop() {
  const [draft, setDraft] = useEntry<DreamWork>("dream-current");
  const [done, setDone] = useEntry<DreamWork[]>("dreams");
  const [step, setStep] = useState(0);
  const [finished, setFinished] = useState(false);
  const work = draft ?? BLANK;
  const s = STEPS[step];
  const found = useMemo(() => findAmplifications(`${work.image} ${work.assoc}`), [work.image, work.assoc]);

  const update = (v: string) => setDraft({ ...work, [s.key]: v });

  const finish = () => {
    setDone([...(done ?? []), { ...work, at: Date.now() }]);
    setFinished(true);
  };

  const again = () => {
    setDraft(BLANK);
    setStep(0);
    setFinished(false);
  };

  if (finished) {
    return (
      <div className="dream dream--done">
        <div className="eyebrow">A dream, worked</div>
        <p className="dream-image-final">“{work.image}”</p>
        <dl className="dream-summary">
          {STEPS.slice(1).map((st) =>
            work[st.key] ? (
              <div key={st.key}>
                <dt className="eyebrow">{st.name}</dt>
                <dd>{work[st.key]}</dd>
              </div>
            ) : null,
          )}
        </dl>
        <p className="dream-coda">
          You won&apos;t get it all tonight, and you don&apos;t have to. Dreams keep working after you stop looking at
          them. Watch for the next one: it will often answer this one.
        </p>
        <div className="dream-nav">
          <button type="button" className="btn btn--ghost" onClick={again}>
            Work another dream
          </button>
          <span className="wat-kept">
            {done?.length ?? 1} {done?.length === 1 ? "dream" : "dreams"} in the Vessel
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="dream">
      <div className="dream-steps" aria-hidden>
        {STEPS.map((st, i) => (
          <span key={st.key} className={i === step ? "is-current" : i < step ? "is-past" : ""}>
            <i>{i + 1}</i>
            <b>{st.name}</b>
          </span>
        ))}
      </div>
      <div className="dream-card" key={step}>
        <div className="eyebrow">
          Step {step + 1} of {STEPS.length} · {s.name}
        </div>
        <label htmlFor={`dream-${s.key}`} className="dream-prompt">
          {s.prompt}
        </label>
        <p className="dream-help">{s.help}</p>
        {s.key === "amp" && (
          <div className="dream-amps">
            {found.map((a) => (
              <div key={a.title} className="dream-amp">
                <span className="eyebrow">{a.title}</span>
                <p>{rich(a.text)}</p>
              </div>
            ))}
            <div className="dream-amp dream-amp--generic">
              <span className="eyebrow">{found.length ? "And beyond these" : "No dictionary"}</span>
              <p>{genericAmplification}</p>
            </div>
          </div>
        )}
        {step > 0 && work.image && (
          <p className="dream-echo">
            <span className="eyebrow">Your image</span> “{work.image.length > 140 ? `${work.image.slice(0, 140)}…` : work.image}”
          </p>
        )}
        <AutoTextarea
          id={`dream-${s.key}`}
          className="question-input dream-input"
          value={work[s.key] as string}
          placeholder={s.placeholder}
          onChange={(e) => update(e.target.value)}
        />
        <div className="dream-nav">
          <button type="button" className="link-btn" onClick={() => setStep(step - 1)} disabled={step === 0}>
            ← Back
          </button>
          {step < STEPS.length - 1 ? (
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => setStep(step + 1)}
              disabled={step === 0 && !work.image.trim()}
            >
              Next
            </button>
          ) : (
            <button type="button" className="btn btn--primary" onClick={finish} disabled={!work.image.trim()}>
              Keep this dream
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
