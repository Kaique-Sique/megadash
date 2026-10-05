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

/**
 * Usage example:
 * 
 * "use client";
import { useTopic } from "@/lib/nt4/useTopic";

export default function Teleop() {
  const rpm = useTopic<number>("/SmartDashboard/Shooter/TargetRPM");
  const enabled = useTopic<boolean>("/SmartDashboard/Shooter/Enabled");

  return (
    <>
      <p>RPM atual: {rpm.value ?? "—"}</p>
      <input
        type="number"
        defaultValue={rpm.value}
        onKeyDown={(e) => e.key === "Enter" && rpm.set(Number(e.currentTarget.value))}
      />
      <button onClick={() => enabled.set(!enabled.value)}>
        {enabled.value ? "Desligar" : "Ligar"}
      </button>
    </>
  );
}
 */