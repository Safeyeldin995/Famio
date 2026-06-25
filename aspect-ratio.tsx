import { Link } from "@tanstack/react-router";
import { Star, ShieldCheck } from "lucide-react";
import type { Provider } from "@/lib/mock/data";

export function ProviderCard({ p }: { p: Provider }) {
  return (
    <Link
      to="/provider/$id"
      params={{ id: p.id }}
      className="block rounded-3xl bg-surface p-4 shadow-soft active:scale-[0.99] transition-transform"
    >
      <div className="flex items-center gap-3">
        <img
          src={p.avatar}
          alt={p.name}
          className="h-16 w-16 shrink-0 rounded-2xl object-cover"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-[15px] font-bold text-foreground">{p.name}</h3>
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
              p.role === "Angel" ? "bg-coral/10 text-coral" : "bg-navy/10 text-navy"
            }`}>{p.role}</span>
          </div>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">{p.category === "home" ? "Cleaning & Housekeeping" : "Babysitting"} · {p.yearsExp} yrs</p>
          <div className="mt-2 flex items-center gap-3">
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-foreground">
              <Star className="h-3.5 w-3.5 fill-warning text-warning" /> {p.rating} <span className="text-muted-foreground font-normal">({p.reviews})</span>
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-success">
              <ShieldCheck className="h-3.5 w-3.5" /> Trust {p.trustScore}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-base font-extrabold text-navy">EGP {p.hourlyRate}</div>
          <div className="text-[11px] text-muted-foreground">/hour</div>
        </div>
      </div>
    </Link>
  );
}

export function ProviderTile({ p }: { p: Provider }) {
  return (
    <Link
      to="/provider/$id"
      params={{ id: p.id }}
      className="block w-44 shrink-0 overflow-hidden rounded-3xl bg-surface shadow-soft"
    >
      <div className="relative h-40 w-full overflow-hidden">
        <img src={p.avatar} alt={p.name} className="h-full w-full object-cover" />
        <div className="absolute inset-x-2 bottom-2 flex items-center justify-between">
          <span className="rounded-full bg-black/55 px-2 py-1 text-[10px] font-bold text-white backdrop-blur">
            ★ {p.rating}
          </span>
          <span className={`rounded-full px-2 py-1 text-[10px] font-bold backdrop-blur ${
            p.role === "Angel" ? "bg-coral/90 text-coral-foreground" : "bg-navy/90 text-navy-foreground"
          }`}>{p.role}</span>
        </div>
      </div>
      <div className="p-3">
        <div className="truncate text-sm font-bold">{p.name}</div>
        <div className="mt-0.5 text-[11px] text-muted-foreground">EGP {p.hourlyRate}/hr · {p.yearsExp} yrs</div>
      </div>
    </Link>
  );
}
