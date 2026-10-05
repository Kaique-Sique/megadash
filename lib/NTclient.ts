"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { NT4Client } from "./nt4";

export interface Entry { name: string; type: string; value: unknown; hist: number[]; }
const HIST = 200;

/** Mantém os dados do NT em um Map mutável e re-renderiza no máximo 1x por frame. */
export function NTclient() {
  const client = useRef<NT4Client | null>(null);
  const data = useRef(new Map<string, Entry>());
  const raf = useRef(0);
  const [connected, setConnected] = useState(false);
  const [, setTick] = useState(0);

  const bump = () => {
    if (raf.current) return;
    raf.current = requestAnimationFrame(() => { raf.current = 0; setTick((t) => t + 1); });
  };

  const connect = useCallback((host: string) => {
    client.current?.close();
    data.current.clear();
    setConnected(false);
    client.current = new NT4Client(host, {
      onAnnounce: (t) => {
        if (!data.current.has(t.name)) data.current.set(t.name, { name: t.name, type: t.type, value: undefined, hist: [] });
        bump();
      },
      onUnannounce: (t) => { data.current.delete(t.name); bump(); },
      onData: (t, _ts, v) => {
        const e = data.current.get(t.name);
        if (!e) return;
        e.value = v;
        if (typeof v === "number") { e.hist.push(v); if (e.hist.length > HIST) e.hist.shift(); }
        bump();
      },
      onConnect: () => { setConnected(true); client.current?.subscribeAll(0.05); },
      onDisconnect: () => setConnected(false),
    });
  }, []);

  const set = useCallback((name: string, value: unknown) => client.current?.set(name, value), []);

  useEffect(() => () => { client.current?.close(); cancelAnimationFrame(raf.current); }, []);

  return { connected, entries: data.current, connect, set };
}
