"use client";

/** A minimal pub/sub so the HUD can follow scroll state without re-rendering the page. */
type Handler<T> = (value: T) => void;

export type BusEvents = {
  depth: number;
  act: number;
  chapter: { num: string; title: string } | null;
  palette: string;
  care: boolean;
  index: boolean;
};

const handlers: { [K in keyof BusEvents]?: Set<Handler<BusEvents[K]>> } = {};
const last: Partial<BusEvents> = {};

export function emit<K extends keyof BusEvents>(key: K, value: BusEvents[K]) {
  last[key] = value;
  (handlers[key] as Set<Handler<BusEvents[K]>> | undefined)?.forEach((h) => h(value));
}

export function on<K extends keyof BusEvents>(key: K, h: Handler<BusEvents[K]>) {
  const set = (handlers[key] ??= new Set() as never) as Set<Handler<BusEvents[K]>>;
  set.add(h);
  if (key in last) h(last[key] as BusEvents[K]);
  return () => {
    set.delete(h);
  };
}
