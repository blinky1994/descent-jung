"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { stimulusWords } from "@/content/extras";
import { useEntry } from "@/lib/store";

type Item = {
  word: string;
  response: string;
  rt: number; // ms until first keystroke — Jung's reaction time
  total: number; // ms until Enter
  corrections: number;
};

type Flagged = Item & { reasons: string[] };

export type WatResult = { items: Item[]; median: number; flagged: string[]; at: number };

const norm = (s: string) => s.trim().toLowerCase().replace(/^to\s+/, "");

function analyze(items: Item[]): { median: number; flagged: Flagged[] } {
  const rts = items.map((i) => i.rt).sort((a, b) => a - b);
  const median = rts.length ? rts[Math.floor(rts.length / 2)] : 0;
  const seen = new Map<string, number>();
  const flagged: Flagged[] = [];
  items.forEach((it) => {
    const r = norm(it.response);
    const reasons: string[] = [];
    if (it.rt > median * 1.5 && it.rt - median > 400) reasons.push("slow");
    if (!r) reasons.push("no answer");
    if (r && r === norm(it.word)) reasons.push("repeated the word");
    if (r.split(/\s+/).filter(Boolean).length > 1) reasons.push("several words");
    if (r && seen.has(r)) reasons.push("same answer as before");
    if (it.corrections > 2) reasons.push("second thoughts");
    if (r) seen.set(r, (seen.get(r) ?? 0) + 1);
    if (reasons.length) flagged.push({ ...it, reasons });
  });
  return { median, flagged };
}

export default function WordAssociation() {
  const [phase, setPhase] = useState<"intro" | "run" | "done">("intro");
  const [idx, setIdx] = useState(0);
  const [showing, setShowing] = useState(false);
  const [value, setValue] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [saved, setSaved] = useEntry<WatResult>("wat");
  const shownAt = useRef(0);
  const firstKey = useRef(0);
  const corrections = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const words = stimulusWords;

  const present = useCallback((i: number) => {
    setShowing(false);
    setValue("");
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setIdx(i);
      setShowing(true);
      shownAt.current = performance.now();
      firstKey.current = 0;
      corrections.current = 0;
      inputRef.current?.focus({ preventScroll: true });
    }, 700);
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  const start = () => {
    setItems([]);
    setPhase("run");
    present(0);
  };

  const submit = () => {
    if (!showing) return;
    const now = performance.now();
    const item: Item = {
      word: words[idx],
      response: value.trim(),
      rt: Math.round((firstKey.current || now) - shownAt.current),
      total: Math.round(now - shownAt.current),
      corrections: corrections.current,
    };
    const next = [...items, item];
    setItems(next);
    if (idx + 1 >= words.length) {
      const { median, flagged } = analyze(next);
      setSaved({ items: next, median, flagged: flagged.map((f) => f.word), at: Date.now() });
      setShowing(false);
      setPhase("done");
    } else {
      present(idx + 1);
    }
  };

  // Measured from input events, not keys: virtual keyboards often report no key at all.
  const onChange = (v: string) => {
    if (!firstKey.current && v.length > 0) firstKey.current = performance.now();
    if (v.length < value.length) corrections.current++;
    setValue(v);
  };

  const result = phase === "done" ? { items, ...analyze(items) } : saved ? { ...saved, ...analyze(saved.items) } : null;

  return (
    <div className="wat" aria-live="polite">
      {phase === "intro" && (
        <div className="wat-intro">
          <div className="eyebrow">The Word Association Test · after Jung, 1904–1909</div>
          <p className="wat-lede">
            A word will appear. Type the <em>first</em> word that comes to mind, then press Enter. Don&apos;t think.
            Don&apos;t be clever. Don&apos;t correct yourself.
          </p>
          <p className="wat-meta">
            {words.length} words · about three minutes · the timer measures how long you take before your first
            keystroke
          </p>
          <button type="button" className="btn btn--primary" onClick={start}>
            Begin the test
          </button>
          {saved && result && (
            <button type="button" className="btn btn--ghost" onClick={() => setPhase("done")}>
              See your last record
            </button>
          )}
          <p className="wat-disclaimer">A reflective exercise, not a diagnosis.</p>
        </div>
      )}

      {phase === "run" && (
        <div className="wat-run">
          <div className="wat-progress eyebrow">
            {String(idx + 1).padStart(2, "0")} / {words.length}
          </div>
          <div className={`wat-word ${showing ? "is-showing" : ""}`} aria-live="assertive">
            {showing ? words[idx] : ""}
          </div>
          <form
            className="wat-form"
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
          >
            <label htmlFor="wat-input" className="sr-only">
              Your first association
            </label>
            <input
              id="wat-input"
              ref={inputRef}
              className="wat-input"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              placeholder={showing ? "first word…" : ""}
              enterKeyHint="next"
            />
          </form>
          <div className="wat-run-foot">
            <span className="eyebrow">Enter to continue</span>
            <button type="button" className="link-btn" onClick={() => setPhase("intro")}>
              Stop
            </button>
          </div>
        </div>
      )}

      {phase === "done" && result && <WatRecord result={result} onAgain={start} />}
    </div>
  );
}

function WatRecord({
  result,
  onAgain,
}: {
  result: { items: Item[]; median: number; flagged: Flagged[] };
  onAgain: () => void;
}) {
  const { items, median, flagged } = result;
  const max = Math.max(3000, Math.min(8000, ...items.map((i) => i.rt)));
  const flagMap = new Map(flagged.map((f) => [f.word, f.reasons]));
  const doors = [...flagged].sort((a, b) => b.rt - a.rt).slice(0, 5);

  return (
    <div className="wat-record">
      <div className="wat-record-head">
        <div className="eyebrow">Your record</div>
        <div className="eyebrow">
          Probable mean <strong>{(median / 1000).toFixed(2)} s</strong>
        </div>
      </div>
      <ol className="wat-rows">
        {items.map((it, i) => {
          const reasons = flagMap.get(it.word);
          return (
            <li key={i} className={`wat-row ${reasons ? "is-flagged" : ""}`}>
              <span className="wat-n">{String(i + 1).padStart(2, "0")}</span>
              <span className="wat-stim">{it.word}</span>
              <span className="wat-resp">{it.response || "—"}</span>
              <span className="wat-bar" aria-hidden>
                <i style={{ width: `${Math.min(100, (it.rt / max) * 100)}%` }} />
                <b style={{ left: `${(median / max) * 100}%` }} />
              </span>
              <span className="wat-time">{(it.rt / 1000).toFixed(2)}s</span>
              <span className="wat-why">{reasons?.join(" · ")}</span>
            </li>
          );
        })}
      </ol>
      {doors.length ? (
        <div className="wat-doors">
          <p className="wat-doors-line">These are the doors. Something is behind them.</p>
          <ul>
            {doors.map((d) => (
              <li key={d.word}>{d.word}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="wat-doors">
          <p className="wat-doors-line">No doors stood out this time. Complexes are shy. Try again another night.</p>
        </div>
      )}
      <div className="wat-actions">
        <button type="button" className="btn btn--ghost" onClick={onAgain}>
          Take it again
        </button>
        <span className="wat-kept">Kept in the Vessel</span>
      </div>
    </div>
  );
}
