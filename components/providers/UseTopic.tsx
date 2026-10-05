"use client";
import { useNT } from "@/components/providers/NTProvider";

export function useTopic<T = unknown>(name: string) {
  const { entries, set } = useNT();
  const e = entries.get(name);
  return {
    value: e?.value as T | undefined,
    type: e?.type,
    history: e?.hist ?? [],
    set: (v: T) => set(name, v),
  };
}