"use client";

import { useEffect, useRef, useState } from "react";
import { acts, chapters } from "@/content/chapters";
import { careResources } from "@/content/extras";
import { emit, on } from "@/lib/bus";
import { scrollToId, lockScroll } from "@/lib/scroll";
import { settings, useSettings } from "@/lib/store";
import { audio } from "@/lib/audio";
import Glyph from "../Glyph";

export default function Hud() {
  return (
    <>
      <a href="#index-menu" className="skip-link" onClick={(e) => (e.preventDefault(), emit("index", true))}>
        Open the chapter index
      </a>
      <TopBar />
      <DepthRail />
      <button type="button" className="care-link" onClick={() => emit("care", true)}>
        If the dark is too much
      </button>
      <IndexMenu />
      <CarePanel />
    </>
  );
}

/* ------------------------------------------------------------------ */

function TopBar() {
  const chapterRef = useRef<HTMLSpanElement>(null);
  const depthRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const offC = on("chapter", (c) => {
      const el = chapterRef.current;
      if (!el) return;
      el.classList.remove("is-on");
      requestAnimationFrame(() => {
        el.textContent = c ? `${c.num} · ${c.title}` : "";
        if (c) el.classList.add("is-on");
      });
    });
    const offD = on("depth", (d) => {
      if (depthRef.current) depthRef.current.textContent = `${Math.round(d)} m`;
    });
    return () => {
      offC();
      offD();
    };
  }, []);

  return (
    <header className="hud-top">
      <a
        href="#threshold"
        className="wordmark"
        onClick={(e) => {
          e.preventDefault();
          scrollToId("threshold");
        }}
      >
        Descent
      </a>
      <span className="hud-chapter" ref={chapterRef} aria-live="off" />
      <div className="hud-actions">
        <span className="hud-depth-mobile" ref={depthRef} aria-hidden>
          0 m
        </span>
        <SoundToggle />
        <button type="button" className="hud-btn" onClick={() => emit("index", true)} aria-haspopup="dialog">
          Index
        </button>
      </div>
    </header>
  );
}

export function SoundToggle({ className }: { className?: string }) {
  const { sound } = useSettings();
  return (
    <button
      type="button"
      className={`hud-btn sound-toggle ${sound ? "is-on" : ""} ${className ?? ""}`}
      aria-pressed={sound}
      onClick={() => {
        const next = !settings.get().sound;
        settings.set({ sound: next });
        if (next) audio?.enable();
        else audio?.disable();
      }}
    >
      <span className="sound-bars" aria-hidden>
        <i />
        <i />
        <i />
        <i />
      </span>
      <span>{sound ? "Sound on" : "Sound off"}</span>
    </button>
  );
}

/* ------------------------------------------------------------------ */

function DepthRail() {
  const markerRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef<HTMLSpanElement>(null);
  const [act, setAct] = useState(0);

  useEffect(() => {
    const offD = on("depth", (d) => {
      const p = Math.max(0, Math.min(1, d / 1000));
      markerRef.current?.style.setProperty("--p", String(p));
      if (valueRef.current) valueRef.current.textContent = String(Math.round(d)).padStart(4, "0");
    });
    const offA = on("act", setAct);
    return () => {
      offD();
      offA();
    };
  }, []);

  return (
    <nav className="rail" aria-label="Acts">
      <div className="rail-depth" aria-hidden>
        <span className="rail-label">Depth</span>
        <span className="rail-value">
          <span ref={valueRef}>0000</span>
          <small>m</small>
        </span>
        <div className="rail-track">
          {Array.from({ length: 11 }, (_, i) => (
            <span key={i} className="rail-tick" style={{ top: `${i * 10}%` }} />
          ))}
          <div className="rail-marker" ref={markerRef} />
        </div>
      </div>
      <ul className="rail-acts">
        {acts.map((a) => (
          <li key={a.n}>
            <button
              type="button"
              className={`rail-act ${act === a.n ? "is-current" : ""}`}
              onClick={() => scrollToId(`act-${a.n}`)}
              aria-label={`Act ${a.numeral}: ${a.name}`}
              aria-current={act === a.n ? "step" : undefined}
            >
              <Glyph name={a.glyph} size={18} />
              <span className="rail-act-label">{a.name}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/* ------------------------------------------------------------------ */

function useDialog(key: "index" | "care") {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<Element | null>(null);

  useEffect(() => on(key, setOpen), [key]);

  useEffect(() => {
    if (!open) return;
    returnFocus.current = document.activeElement;
    if (key === "index") lockScroll(true);
    const first = panelRef.current?.querySelector<HTMLElement>("button, a[href], input");
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") emit(key, false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (key === "index") lockScroll(false);
      (returnFocus.current as HTMLElement | null)?.focus?.();
    };
  }, [open, key]);

  return { open, panelRef, close: () => emit(key, false) };
}

function IndexMenu() {
  const { open, panelRef, close } = useDialog("index");
  const s = useSettings();

  const go = (id: string) => {
    close();
    setTimeout(() => scrollToId(id), 60);
  };

  return (
    <div
      id="index-menu"
      className={`index-menu ${open ? "is-open" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Index"
      aria-hidden={!open}
      inert={!open}
      ref={panelRef}
      data-lenis-prevent
    >
      <div className="index-inner">
        <div className="index-head">
          <span className="eyebrow">Index</span>
          <button type="button" className="hud-btn" onClick={close}>
            Close
          </button>
        </div>
        <div className="index-grid">
          <ol className="index-acts">
            <li>
              <button type="button" className="index-link index-link--minor" onClick={() => go("threshold")}>
                <span className="index-num">·</span> The Threshold
              </button>
            </li>
            {acts.map((a) => (
              <li key={a.n} className="index-act">
                <button type="button" className="index-act-name" onClick={() => go(`act-${a.n}`)}>
                  <Glyph name={a.glyph} size={16} />
                  <span>
                    Act {a.numeral} — {a.name}
                  </span>
                </button>
                <ol>
                  {chapters
                    .filter((c) => c.act === a.n)
                    .map((c) => (
                      <li key={c.id}>
                        <button type="button" className="index-link" onClick={() => go(c.id)}>
                          <span className="index-num">{c.num}</span> {c.title}
                        </button>
                      </li>
                    ))}
                </ol>
              </li>
            ))}
            <li>
              <button type="button" className="index-link index-link--minor" onClick={() => go("vessel")}>
                <span className="index-num">·</span> The Vessel
              </button>
            </li>
          </ol>

          <div className="index-settings">
            <fieldset>
              <legend className="eyebrow">Sound</legend>
              <SoundToggle className="index-sound" />
            </fieldset>
            <fieldset>
              <legend className="eyebrow">Motion</legend>
              <div className="seg">
                {(["system", "full", "reduced"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    aria-pressed={s.motion === m}
                    onClick={() => settings.set({ motion: m })}
                  >
                    {m === "system" ? "Follow system" : m === "full" ? "Full" : "Reduced"}
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend className="eyebrow">Pace</legend>
              <div className="seg">
                <button type="button" aria-pressed={s.mode === "full"} onClick={() => settings.set({ mode: "full" })}>
                  One sitting
                </button>
                <button type="button" aria-pressed={s.mode === "nights"} onClick={() => settings.set({ mode: "nights" })}>
                  Five nights
                </button>
              </div>
            </fieldset>
            <p className="index-note">
              Everything you write stays on this device. Nothing is sent anywhere, and there are no analytics.
            </p>
            <button
              type="button"
              className="index-link index-link--care"
              onClick={() => {
                close();
                emit("care", true);
              }}
            >
              If the dark is too much →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CarePanel() {
  const { open, panelRef, close } = useDialog("care");
  return (
    <div
      className={`care-panel ${open ? "is-open" : ""}`}
      role="dialog"
      aria-modal="false"
      aria-labelledby="care-title"
      aria-hidden={!open}
      inert={!open}
      ref={panelRef}
    >
      <div className="care-inner">
        <div className="care-head">
          <h2 id="care-title">If the dark is too much</h2>
          <button type="button" className="hud-btn" onClick={close} aria-label="Close">
            Close
          </button>
        </div>
        <p>
          Some of this site touches deep places. If you are in crisis, or thinking about ending your life, please
          reach out to a real person now.
        </p>
        <ul>
          {careResources.map((r) => (
            <li key={r.label}>
              <span>{r.label}</span>
              {r.href ? (
                <a href={r.href} target={r.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                  {r.detail}
                </a>
              ) : (
                <strong>{r.detail}</strong>
              )}
            </li>
          ))}
        </ul>
        <p className="care-close-line">A dark night is not something you have to survive alone. Jung didn&apos;t.</p>
      </div>
    </div>
  );
}
