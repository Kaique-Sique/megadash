"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { NTclient } from "@/lib/nt4/NTclient";
import { siteConfig } from "@/lib/config/site-config";

export type Mode = "real" | "simulation";
export interface Settings { mode: Mode; team: number; }

const KEY = "megadash:settings";
const DEFAULTS: Settings = { mode: "real", team: siteConfig.teamNumber };

/** Simulação usa o servidor local da WPILib; modo real usa o IP do roboRIO (10.TE.AM.2). */
export const hostFor = (s: Settings) =>
  s.mode === "simulation" ? "localhost" : `10.${Math.floor(s.team / 100)}.${s.team % 100}.2`;

type NTContext = ReturnType<typeof NTclient> & {
  settings: Settings;
  host: string;
  ready: boolean; // true depois de ler as configurações salvas
  update: (patch: Partial<Settings>) => void;
};
const Ctx = createContext<NTContext | null>(null);

export function useNT(): NTContext {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useNT needs to be used inside <NTProvider>");
  return ctx;
}

export function NTProvider({ children }: { children: ReactNode }) {
  const nt = NTclient();
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setSettings({ ...DEFAULTS, ...JSON.parse(raw) });
    } catch { /* configuração corrompida: usa o padrão */ }
    setReady(true);
  }, []);

  const host = hostFor(settings);
  const { connect } = nt;
  useEffect(() => { if (ready) connect(host); }, [ready, host, connect]);

  const update = (patch: Partial<Settings>) => {
    const next = { ...settings, ...patch };
    setSettings(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  };

  // O valor muda a cada render de propósito: o NTclient re-renderiza o provider 1x por frame
  // quando chegam dados, e é isso que atualiza as páginas.
  return <Ctx.Provider value={{ ...nt, settings, host, ready, update }}>{children}</Ctx.Provider>;
}
