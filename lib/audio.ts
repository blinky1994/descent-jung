"use client";

import type { SoundStage } from "./palettes";

type Voice = { out: GainNode; stop: () => void };

/**
 * Generative ambient score. No audio files: every stage is a small synth
 * patch built from oscillators, filtered noise and a synthetic reverb.
 * Sound is always off until the visitor turns it on with a gesture.
 */
class AudioEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private verb: GainNode | null = null;
  private fx: GainNode | null = null;
  private noise: AudioBuffer | null = null;
  private voice: Voice | null = null;
  private stage: SoundStage = "abyss";
  enabled = false;

  private ensure() {
    if (this.ctx) return this.ctx;
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    const ctx = new AC();
    this.ctx = ctx;

    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -20;
    comp.ratio.value = 3;
    comp.connect(ctx.destination);

    this.master = ctx.createGain();
    this.master.gain.value = 0;
    this.master.connect(comp);

    // Synthetic hall: exponentially decaying stereo noise as impulse.
    const conv = ctx.createConvolver();
    const len = ctx.sampleRate * 4;
    const ir = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = ir.getChannelData(ch);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.2);
    }
    conv.buffer = ir;
    this.verb = ctx.createGain();
    this.verb.gain.value = 0.55;
    this.verb.connect(conv).connect(this.master);

    this.fx = ctx.createGain();
    this.fx.gain.value = 1;
    this.fx.connect(this.master);
    this.fx.connect(this.verb);

    const nlen = ctx.sampleRate * 3;
    this.noise = ctx.createBuffer(1, nlen, ctx.sampleRate);
    const nd = this.noise.getChannelData(0);
    let last = 0;
    for (let i = 0; i < nlen; i++) {
      // brown-ish noise: warmer than white
      last = (last + 0.04 * (Math.random() * 2 - 1)) / 1.04;
      nd[i] = last * 3.2;
    }
    return ctx;
  }

  async enable() {
    const ctx = this.ensure();
    if (!ctx || !this.master) return;
    if (ctx.state === "suspended") await ctx.resume();
    this.enabled = true;
    this.master.gain.cancelScheduledValues(ctx.currentTime);
    this.master.gain.setTargetAtTime(0.9, ctx.currentTime, 0.8);
    if (!this.voice) this.voice = this.makeVoice(this.stage);
  }

  disable() {
    if (!this.ctx || !this.master) return;
    this.enabled = false;
    this.master.gain.setTargetAtTime(0, this.ctx.currentTime, 0.25);
    const v = this.voice;
    this.voice = null;
    setTimeout(() => {
      v?.stop();
      if (!this.enabled) this.ctx?.suspend();
    }, 1500);
  }

  setStage(s: SoundStage) {
    if (s === this.stage && this.voice) return;
    this.stage = s;
    if (!this.enabled || !this.ctx) return;
    const old = this.voice;
    this.voice = this.makeVoice(s);
    if (old) {
      old.out.gain.setTargetAtTime(0, this.ctx.currentTime, 1.4);
      setTimeout(() => old.stop(), 7000);
    }
  }

  /* ---------------- building blocks ---------------- */

  private bus(level: number): GainNode {
    const ctx = this.ctx!;
    const out = ctx.createGain();
    out.gain.value = 0;
    out.gain.setTargetAtTime(level, ctx.currentTime, 2);
    out.connect(this.master!);
    out.connect(this.verb!);
    return out;
  }

  private tone(
    dest: AudioNode,
    freq: number,
    gain: number,
    type: OscillatorType = "sine",
    stoppers: (() => void)[],
  ) {
    const ctx = this.ctx!;
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.value = freq;
    o.detune.value = (Math.random() - 0.5) * 8;
    const g = ctx.createGain();
    g.gain.value = gain;
    o.connect(g).connect(dest);
    o.start();
    stoppers.push(() => {
      try {
        o.stop();
      } catch {
        /* already stopped */
      }
    });
    return { o, g };
  }

  private lfo(param: AudioParam, rate: number, depth: number, stoppers: (() => void)[]) {
    const ctx = this.ctx!;
    const l = ctx.createOscillator();
    l.frequency.value = rate;
    const d = ctx.createGain();
    d.gain.value = depth;
    l.connect(d).connect(param);
    l.start();
    stoppers.push(() => {
      try {
        l.stop();
      } catch {
        /* already stopped */
      }
    });
  }

  private noiseSrc(dest: AudioNode, gain: number, stoppers: (() => void)[]) {
    const ctx = this.ctx!;
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    src.loop = true;
    const g = ctx.createGain();
    g.gain.value = gain;
    src.connect(g).connect(dest);
    src.start();
    stoppers.push(() => {
      try {
        src.stop();
      } catch {
        /* already stopped */
      }
    });
    return g;
  }

  private filter(dest: AudioNode, type: BiquadFilterType, freq: number, q = 0.7) {
    const f = this.ctx!.createBiquadFilter();
    f.type = type;
    f.frequency.value = freq;
    f.Q.value = q;
    f.connect(dest);
    return f;
  }

  bell(freq: number, gain = 0.05, decay = 4, when = 0, dest?: AudioNode) {
    const ctx = this.ctx;
    if (!ctx || !this.enabled) return;
    const t = ctx.currentTime + when;
    const out = dest ?? this.fx!;
    const car = ctx.createOscillator();
    car.frequency.value = freq;
    const mod = ctx.createOscillator();
    mod.frequency.value = freq * 2.76;
    const mg = ctx.createGain();
    mg.gain.setValueAtTime(freq * 1.2, t);
    mg.gain.exponentialRampToValueAtTime(1, t + decay * 0.7);
    mod.connect(mg).connect(car.frequency);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t + decay);
    car.connect(g).connect(out);
    car.start(t);
    mod.start(t);
    car.stop(t + decay + 0.1);
    mod.stop(t + decay + 0.1);
  }

  private thump(dest: AudioNode, when: number, gain: number) {
    const ctx = this.ctx!;
    const o = ctx.createOscillator();
    o.frequency.setValueAtTime(62, when);
    o.frequency.exponentialRampToValueAtTime(38, when + 0.16);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, when);
    g.gain.exponentialRampToValueAtTime(gain, when + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, when + 0.22);
    o.connect(g).connect(dest);
    o.start(when);
    o.stop(when + 0.3);
  }

  /* ---------------- stage patches ---------------- */

  private makeVoice(stage: SoundStage): Voice {
    const ctx = this.ctx!;
    const stoppers: (() => void)[] = [];
    const timers: number[] = [];
    let out: GainNode;

    switch (stage) {
      case "surface": {
        out = this.bus(0.8);
        const bp = this.filter(out, "bandpass", 700, 0.6);
        this.noiseSrc(bp, 0.05, stoppers);
        this.lfo(bp.frequency, 0.06, 320, stoppers);
        this.tone(out, 196, 0.012, "sine", stoppers);
        this.tone(out, 293.66, 0.008, "sine", stoppers);
        break;
      }
      case "dusk": {
        out = this.bus(0.9);
        const lp = this.filter(out, "lowpass", 520);
        this.tone(lp, 73.42, 0.05, "sine", stoppers);
        const b = this.tone(lp, 110, 0.028, "sine", stoppers);
        this.tone(lp, 146.83, 0.012, "triangle", stoppers);
        this.lfo(b.g.gain, 0.08, 0.014, stoppers);
        break;
      }
      case "nigredo": {
        out = this.bus(1);
        const lp = this.filter(out, "lowpass", 180);
        this.tone(out, 41.2, 0.09, "sine", stoppers);
        this.tone(out, 61.74, 0.035, "sine", stoppers);
        this.tone(lp, 82.41, 0.03, "sawtooth", stoppers);
        this.lfo(lp.frequency, 0.03, 70, stoppers);
        const nl = this.filter(out, "lowpass", 140);
        this.noiseSrc(nl, 0.06, stoppers);
        break;
      }
      case "abyss": {
        out = this.bus(1);
        const a = this.tone(out, 36.71, 0.08, "sine", stoppers);
        this.lfo(a.g.gain, 0.04, 0.03, stoppers);
        const nl = this.filter(out, "lowpass", 90);
        this.noiseSrc(nl, 0.05, stoppers);
        break;
      }
      case "albedo": {
        out = this.bus(0.9);
        this.tone(out, 261.63, 0.014, "sine", stoppers);
        [523.25, 783.99, 1174.66, 1567.98].forEach((f, i) => {
          const t = this.tone(out, f, 0.006, "sine", stoppers);
          this.lfo(t.g.gain, 0.05 + i * 0.027, 0.006, stoppers);
        });
        break;
      }
      case "citrinitas": {
        out = this.bus(0.9);
        const lp = this.filter(out, "lowpass", 1000);
        this.tone(lp, 110, 0.03, "triangle", stoppers);
        this.tone(lp, 164.81, 0.02, "triangle", stoppers);
        this.tone(lp, 220, 0.014, "triangle", stoppers);
        this.lfo(lp.frequency, 0.05, 300, stoppers);
        const notes = [523.25, 587.33, 659.25, 783.99, 880, 1046.5];
        const ring = () => {
          if (!this.enabled) return;
          this.bell(notes[Math.floor(Math.random() * notes.length)], 0.035, 5, 0, out);
          timers.push(window.setTimeout(ring, 3500 + Math.random() * 5000));
        };
        timers.push(window.setTimeout(ring, 1800));
        break;
      }
      case "rubedo": {
        out = this.bus(0.9);
        const lp = this.filter(out, "lowpass", 700);
        [98, 146.83, 196, 293.66].forEach((f, i) => this.tone(lp, f, 0.022 - i * 0.004, "triangle", stoppers));
        this.lfo(lp.frequency, 0.04, 200, stoppers);
        const dry = ctx.createGain();
        dry.gain.value = 1;
        dry.connect(this.master!);
        const beat = () => {
          if (!this.enabled) return;
          const t = ctx.currentTime + 0.05;
          this.thump(dry, t, 0.16);
          this.thump(dry, t + 0.27, 0.1);
        };
        timers.push(window.setInterval(beat, 1150));
        break;
      }
    }

    return {
      out: out!,
      stop: () => {
        timers.forEach((t) => {
          clearTimeout(t);
          clearInterval(t);
        });
        stoppers.forEach((s) => s());
        try {
          out!.disconnect();
        } catch {
          /* ignore */
        }
      },
    };
  }

  /* ---------------- effects ---------------- */

  tap() {
    const ctx = this.ctx;
    if (!ctx || !this.enabled) return;
    const t = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 3200;
    bp.Q.value = 3;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.5, t + 0.003);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
    src.connect(bp).connect(g).connect(this.master!);
    src.start(t, Math.random());
    src.stop(t + 0.1);
    const o = ctx.createOscillator();
    o.frequency.value = 2400;
    const og = ctx.createGain();
    og.gain.setValueAtTime(0.03, t);
    og.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
    o.connect(og).connect(this.master!);
    o.start(t);
    o.stop(t + 0.06);
  }

  bloom() {
    [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((f, i) => this.bell(f, 0.05, 6, i * 0.18));
  }

  thud() {
    const ctx = this.ctx;
    if (!ctx || !this.enabled) return;
    const t = ctx.currentTime;
    const o = ctx.createOscillator();
    o.frequency.setValueAtTime(90, t);
    o.frequency.exponentialRampToValueAtTime(32, t + 0.7);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.25, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);
    o.connect(g).connect(this.master!);
    o.start(t);
    o.stop(t + 1);
  }

  /** A rising, beating tone for the "Hold" interaction. */
  tension() {
    const ctx = this.ctx;
    if (!ctx || !this.enabled) {
      return { update: (_p: number) => {}, end: (_ok: boolean) => {} };
    }
    const t = ctx.currentTime;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 250;
    const g = ctx.createGain();
    g.gain.value = 0;
    g.gain.setTargetAtTime(0.05, t, 0.3);
    lp.connect(g).connect(this.master!);
    g.connect(this.verb!);
    const a = ctx.createOscillator();
    const b = ctx.createOscillator();
    a.type = b.type = "sawtooth";
    a.frequency.value = 110;
    b.frequency.value = 110.6;
    a.connect(lp);
    b.connect(lp);
    a.start();
    b.start();
    return {
      update: (p: number) => {
        const now = ctx.currentTime;
        a.frequency.setTargetAtTime(110 + p * 110, now, 0.1);
        b.frequency.setTargetAtTime(110.6 + p * 116, now, 0.1);
        lp.frequency.setTargetAtTime(250 + p * 1800, now, 0.1);
        g.gain.setTargetAtTime(0.04 + p * 0.06, now, 0.1);
      },
      end: (ok: boolean) => {
        const now = ctx.currentTime;
        g.gain.setTargetAtTime(0, now, ok ? 0.4 : 0.08);
        setTimeout(() => {
          a.stop();
          b.stop();
        }, 2000);
        if (ok) this.bloom();
        else this.thud();
      },
    };
  }
}

export const audio = typeof window !== "undefined" ? new AudioEngine() : (null as unknown as AudioEngine);
