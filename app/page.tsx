"use client";
import StatCard from "@/components/cards/StatCard";
import { useNT } from "@/components/providers/NTProvider";

const dot = <span aria-hidden>●</span>;
const dash = <span aria-hidden>—</span>;

export default function Home() {
  const { connected, host, settings, entries } = useNT();
  return (
    <main className="mx-auto max-w-7xl p-6">
      <h1 className="text-2xl font-bold text-white">Overview</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard path="Connection" value={connected ? "Connected" : "Disconnected"} icon={connected ? dot : dash } />
        <StatCard path="Mode" value={settings.mode === "simulation" ? "Simulation" : "Real Robot"} icon={connected ? dot : dash } />
        <StatCard path="Address" value={`${host}:5810`} icon={connected ? dot : dash } />
        <StatCard path="Topics" value={String(entries.size)} icon={connected ? dot : dash } />
      </div>
    </main>
  );
}
