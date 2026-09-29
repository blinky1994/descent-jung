"use client";

import { useEffect, useState, type ReactNode } from "react";
import { chapters } from "@/content/chapters";
import { functions, type Fn } from "@/content/extras";
import { useStore, vessel, useEntry } from "@/lib/store";
import { plain } from "@/lib/rich";
import { AutoTextarea, Reveal } from "../parts";
import type { WatResult } from "./WordAssociation";
import type { DreamWork } from "./DreamWorkshop";
import type { TypesPick } from "./TypesCompass";

type Letter = { text: string; sealedAt: number; openOn: number; opened?: boolean };

const fmtDate = (t: number) =>
  new Date(t).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" });

/* The order entries appear in, interleaving questions with experience results. */
type Section = { key: string; num: string; title: string; items: { label: string; node: ReactNode; md: string }[] };

function useSections(state: Record<string, unknown>): Section[] {
  const str = (k: string) => (typeof state[k] === "string" ? (state[k] as string).trim() : "");
  const sections: Section[] = [];

  const intention = str("intention");
  if (intention)
    sections.push({
      key: "intention",
      num: "·",
      title: "The Threshold",
      items: [{ label: "What brought you here tonight?", node: <p>{intention}</p>, md: intention }],
    });

  for (const ch of chapters) {
    const items: Section["items"] = [];
    const push = (label: string, value: string, node?: ReactNode) => {
      if (value) items.push({ label, node: node ?? <p>{value}</p>, md: value });
    };

    if (ch.id === "complexes") {
      const w = state["wat"] as WatResult | undefined;
      if (w?.items?.length) {
        const max = Math.max(3000, Math.min(8000, ...w.items.map((i) => i.rt)));
        const flagged = new Set(w.flagged);
        items.push({
          label: "Your word-association record",
          node: (
            <div className="v-wat">
              {w.items.map((i) => (
                <div key={i.word} className={`v-wat-row ${flagged.has(i.word) ? "is-flagged" : ""}`}>
                  <span>{i.word}</span>
                  <span>{i.response || "—"}</span>
                  <span className="v-wat-bar">
                    <i style={{ width: `${Math.min(100, (i.rt / max) * 100)}%` }} />
                  </span>
                  <span>{(i.rt / 1000).toFixed(2)}s</span>
                </div>
              ))}
              {w.flagged.length > 0 && <p className="v-doors">Doors: {w.flagged.join(", ")}</p>}
            </div>
          ),
          md:
            w.items.map((i) => `- ${i.word} → ${i.response || "—"} (${(i.rt / 1000).toFixed(2)}s)${flagged.has(i.word) ? " ●" : ""}`).join("\n") +
            (w.flagged.length ? `\n\nDoors: ${w.flagged.join(", ")}` : ""),
        });
      }
    }
    if (ch.id === "shadow") {
      const m = state["mirror"] as { who: string; trait: string }[] | undefined;
      const rows = (m ?? []).filter((r) => r.trait?.trim());
      if (rows.length)
        items.push({
          label: "The Mirror",
          node: (
            <div className="v-mirror">
              {rows.map((r, i) => (
                <p key={i}>
                  <span className="v-strike">{r.who || "They"} is</span> I am {r.trait}.
                </p>
              ))}
            </div>
          ),
          md: rows.map((r) => `- ~~${r.who || "They"} is~~ I am ${r.trait}.`).join("\n"),
        });
    }
    if (ch.id === "projection") push("Your pattern, named", str("loop"));
    if (ch.id === "dreams") {
      const ds = (state["dreams"] as DreamWork[] | undefined) ?? [];
      ds.forEach((d, i) =>
        items.push({
          label: `A dream, worked${ds.length > 1 ? ` (${i + 1})` : ""}`,
          node: (
            <div className="v-dream">
              <p className="v-dream-image">“{d.image}”</p>
              {d.assoc && <p><em>Association:</em> {d.assoc}</p>}
              {d.comp && <p><em>Compensation:</em> {d.comp}</p>}
              {d.want && <p><em>What it asks:</em> {d.want}</p>}
            </div>
          ),
          md: `> ${d.image}\n\n- Context: ${d.context}\n- Association: ${d.assoc}\n- Amplification: ${d.amp}\n- Compensation: ${d.comp}\n- What it asks: ${d.want}`,
        }),
      );
    }
    if (ch.id === "active-imagination") push("The dialogue", str("active-dialogue"), <pre className="v-pre">{str("active-dialogue")}</pre>);
    if (ch.id === "archetypes") push("The star you chose", str("archetype-star"));
    if (ch.id === "types") {
      const t = state["types-pick"] as TypesPick | undefined;
      if (t?.superior) {
        const sup = functions[t.superior as Fn];
        const inf = functions[sup.opposite];
        push("Your compass", `${t.attitude === "introverted" ? "Introverted" : "Extraverted"} ${sup.name}. The door: ${inf.name}.`);
      }
    }
    if (ch.id === "self" && typeof state["mandala"] === "string") {
      items.push({
        label: "Your mandala",
        // eslint-disable-next-line @next/next/no-img-element
        node: <img src={state["mandala"] as string} alt="The mandala you drew" className="v-mandala" />,
        md: "(Your mandala was saved as an image alongside this file.)",
      });
    }
    if (ch.id === "opposites") {
      const h = state["hold"] as { a: string; b: string; held: boolean; seconds: number } | undefined;
      if (h) push("The opposites you held", `${h.a} and ${h.b}. ${h.held ? "You held them until the third appeared." : `You let go at ${h.seconds}s.`}`);
    }

    push(plain(ch.question.prompt), str(ch.question.id));

    if (items.length) sections.push({ key: ch.id, num: ch.num, title: ch.title, items });
  }
  return sections;
}

export default function Vessel() {
  const state = useStore(vessel);
  const [mounted, setMounted] = useState(false);
  const [confirming, setConfirming] = useState(false);
  useEffect(() => setMounted(true), []);
  const sections = useSections(mounted ? state : {});

  const download = () => {
    const lines = [
      "# The Vessel",
      "",
      `*Written on a descent through the psychology of C.G. Jung. Exported ${fmtDate(Date.now())}.*`,
      "",
    ];
    for (const s of sections) {
      lines.push(`## ${s.num !== "·" ? `${s.num}. ` : ""}${s.title}`, "");
      for (const it of s.items) lines.push(`**${it.label}**`, "", it.md, "");
    }
    const letter = state["letter"] as Letter | undefined;
    if (letter?.text) lines.push("## A letter to yourself", "", `*Sealed ${fmtDate(letter.sealedAt)}, to be opened ${fmtDate(letter.openOn)}.*`, "", letter.text, "");
    lines.push("---", "", "*Vocatus atque non vocatus, deus aderit.*", "");
    const blob = new Blob([lines.join("\n")], { type: "text/markdown;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "the-vessel.md";
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  };

  const downloadMandala = () => {
    const src = state["mandala"];
    if (typeof src !== "string") return;
    const a = document.createElement("a");
    a.href = src;
    a.download = "mandala.jpg";
    a.click();
  };

  return (
    <section id="vessel" className="vessel" data-palette="sunrise" aria-labelledby="vessel-title">
      <Reveal className="vessel-head">
        <div className="eyebrow">Vas hermeticum</div>
        <h2 id="vessel-title" className="vessel-title">
          The Vessel
        </h2>
        <p className="vessel-promise">
          Everything you wrote on the way down. <strong>Nothing you wrote ever left this device.</strong>
        </p>
      </Reveal>

      {sections.length === 0 ? (
        <Reveal className="vessel-empty">
          <p>
            The Vessel is empty. That&apos;s allowed. Some people carry it all in their heads. You can always go back
            down and write.
          </p>
        </Reveal>
      ) : (
        <div className="vessel-doc" id="vessel-doc">
          <div className="vessel-doc-title print-only">
            <h1>The Vessel</h1>
            <p>A descent through the psychology of C.G. Jung · {fmtDate(Date.now())}</p>
          </div>
          {sections.map((s) => (
            <article key={s.key} className="v-section">
              <header className="v-head">
                <span className="v-num">{s.num}</span>
                <h3>{s.title}</h3>
              </header>
              {s.items.map((it, i) => (
                <div key={i} className="v-item">
                  <div className="v-label">{it.label}</div>
                  <div className="v-body">{it.node}</div>
                </div>
              ))}
            </article>
          ))}
        </div>
      )}

      <div className="vessel-actions">
        <button type="button" className="btn btn--primary" onClick={download} disabled={!sections.length}>
          Download (.md)
        </button>
        <button type="button" className="btn btn--ghost" onClick={() => window.print()} disabled={!sections.length}>
          Print or save as PDF
        </button>
        {typeof state["mandala"] === "string" && (
          <button type="button" className="btn btn--ghost" onClick={downloadMandala}>
            Download your mandala
          </button>
        )}
        {!confirming ? (
          <button type="button" className="link-btn vessel-clear" onClick={() => setConfirming(true)} disabled={!sections.length}>
            Empty the Vessel
          </button>
        ) : (
          <span className="vessel-confirm" role="alert">
            This erases everything you wrote, on this device, for good.{" "}
            <button
              type="button"
              className="link-btn"
              onClick={() => {
                vessel.reset();
                setConfirming(false);
              }}
            >
              Erase it
            </button>{" "}
            <button type="button" className="link-btn" onClick={() => setConfirming(false)}>
              Keep it
            </button>
          </span>
        )}
      </div>

      <LetterToSelf />
    </section>
  );
}

function LetterToSelf() {
  const [letter, setLetter] = useEntry<Letter>("letter");
  const [draft, setDraft] = useEntry<string>("letter-draft");
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const now = Date.now();

  if (letter?.text) {
    const ready = now >= letter.openOn || letter.opened;
    return (
      <Reveal className="letter letter--sealed">
        <div className="eyebrow">A letter to yourself</div>
        {ready ? (
          <>
            <p className="letter-from">
              {letter.opened && now < letter.openOn ? "You broke the seal early." : `A letter from you, written ${fmtDate(letter.sealedAt)}:`}
            </p>
            <div className="letter-paper">
              <p>{letter.text}</p>
            </div>
            <button type="button" className="link-btn" onClick={() => setLetter(undefined as unknown as Letter)}>
              Write a new letter
            </button>
          </>
        ) : (
          <>
            <div className="seal" aria-hidden>
              <span>☉</span>
            </div>
            <p className="letter-sealed">
              Sealed on {fmtDate(letter.sealedAt)}. It opens on <strong>{fmtDate(letter.openOn)}</strong>. Come back
              then, on this device and in this browser, and it will be waiting.
            </p>
            <button type="button" className="link-btn" onClick={() => setLetter({ ...letter, opened: true })}>
              Break the seal early
            </button>
          </>
        )}
      </Reveal>
    );
  }

  return (
    <Reveal className="letter">
      <div className="eyebrow">A letter to yourself · to be opened in one year</div>
      <label htmlFor="letter-text" className="question-prompt">
        Write to the person you will be a year from now. Tell them what you saw down there.
      </label>
      <AutoTextarea
        id="letter-text"
        className="question-input"
        minRows={5}
        value={draft ?? ""}
        onChange={(e) => setDraft(e.target.value)}
        placeholder="Dear me,"
      />
      <button
        type="button"
        className="btn btn--primary"
        disabled={!draft?.trim()}
        onClick={() => {
          const sealedAt = Date.now();
          const d = new Date(sealedAt);
          d.setFullYear(d.getFullYear() + 1);
          setLetter({ text: draft!.trim(), sealedAt, openOn: d.getTime() });
          setDraft("");
        }}
      >
        Seal it for a year
      </button>
    </Reveal>
  );
}
