/**
 * StatCard
 *
 * Small metric tile: title + icon on top, big value below. Used on
 * the dashboard for Teams/Matches/Played/Sync counts.
 */
import { ReactNode } from "react";


interface StatCardProps {
  path: string;
  value: string;
  icon: ReactNode;
}

export default function StatCard({
  path,
  value,
  icon,
}: StatCardProps) {

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">

      <div className="flex justify-between">

        <p className="text-sm text-slate-400">
          {path}
        </p>

        <div className="text-slate-400">
          {icon}
        </div>

      </div>


      <p className="mt-4 text-3xl font-bold text-white">
        {value}
      </p>

    </div>
  );
}