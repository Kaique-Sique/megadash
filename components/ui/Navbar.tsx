"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks, siteConfig } from "@/lib/config/site-config";
import { useNT } from "@/components/providers/NTProvider";

const item = "shrink-0 rounded-md px-3 py-1.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-amber-400";

export default function Navbar() {
  const pathname = usePathname();
  const { connected, host, settings } = useNT();
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const cls = (href: string) => `${item} ${isActive(href) ? "bg-slate-800 text-white" : "text-slate-400 hover:bg-slate-900 hover:text-slate-100"}`;

  return (
    <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/70 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4">
        <Link href="/" className="text-base font-bold tracking-tight text-white">{siteConfig.name}</Link>

        <nav aria-label="Principal" className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className={cls(l.href)} aria-current={isActive(l.href) ? "page" : undefined}>
              {l.label}
            </Link>
          ))}
        </nav>

        <span className="flex shrink-0 items-center gap-2 text-xs text-slate-400" title={`${host}:5810`}>
          <span className={`size-2 rounded-full ${connected ? "bg-emerald-400" : "bg-amber-400"}`} />
          <span className="hidden sm:inline">{connected ? "Connected" : "Disconnected"} · {settings.mode === "simulation" ? "Simulation" : "Real Robot"}</span>
        </span>

        <Link href="/settings" className={`${cls("/settings")} flex items-center gap-2`} aria-current={isActive("/settings") ? "page" : undefined}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
          <span className="hidden sm:inline">Settings</span>
        </Link>
      </div>
    </header>
  );
}
