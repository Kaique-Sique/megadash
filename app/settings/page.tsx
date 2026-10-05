"use client";
import { hostFor, useNT, type Mode } from "@/components/providers/NTProvider";

const MODES: { value: Mode; label: string; hint: string }[] = [
  { value: "real", label: "Real Robot", hint: "Connects to the robot RIO using the team number." },
  { value: "simulation", label: "Simulation", hint: "Connects to the WPILib simulator on this computer." },
];

export default function SettingsPage() {
  const { settings, update, ready, host, connected } = useNT();
  if (!ready) return null; // evita piscar o valor padrão antes de ler o que foi salvo

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-bold text-white">Settings</h1>

      <section className="mt-6 rounded-xl border border-slate-800 bg-slate-900 p-5">
        <h2 className="font-semibold text-white">Conexão</h2>

        <div role="radiogroup" aria-label="Modo de conexão" className="mt-4 grid gap-3 sm:grid-cols-2">
          {MODES.map((m) => (
            <button
              key={m.value}
              role="radio"
              aria-checked={settings.mode === m.value}
              onClick={() => update({ mode: m.value })}
              className={`rounded-lg border p-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-amber-400 ${
                settings.mode === m.value ? "border-blue-500 bg-blue-500/10" : "border-slate-800 hover:border-slate-600"
              }`}
            >
              <span className="block font-medium text-white">{m.label}</span>
              <span className="mt-1 block text-sm text-slate-400">{m.hint}</span>
            </button>
          ))}
        </div>

        <label className="mt-5 block text-sm text-slate-300" htmlFor="team">Número da equipe</label>
        <input
          id="team"
          type="number"
          min={1}
          max={25599}
          defaultValue={settings.team}
          disabled={settings.mode === "simulation"}
          onChange={(e) => {
            const n = Math.trunc(Number(e.target.value));
            if (n >= 1 && n <= 25599) update({ team: n });
          }}
          onBlur={(e) => { e.target.value = String(settings.team); }}
          className="mt-1 w-40 rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-white disabled:opacity-40"
        />
        {settings.mode === "simulation" && <p className="mt-1 text-xs text-slate-500">NNot used in simulation.</p>}

        <dl className="mt-5 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
          <dt className="text-slate-400">Address</dt>
          <dd className="font-mono text-slate-200">{hostFor(settings)}:5810</dd>
          <dt className="text-slate-400">Status</dt>
          <dd className={connected ? "text-emerald-400" : "text-amber-400"}>
            {connected ? "Connected" : `Attempting to connect to ${host}…`}
          </dd>
        </dl>
      </section>
    </main>
  );
}
