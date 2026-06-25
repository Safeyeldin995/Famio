import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell, Card, SectionHeader } from "@/components/famio/ui";
import { ProviderTile, ProviderCard } from "@/components/famio/ProviderCard";
import { categories, featuredProviders, offers, providers } from "@/lib/mock/data";
import { useApp } from "@/lib/store";
import { Search, MapPin, Bell, ShieldCheck, Sparkles, Star } from "lucide-react";

export const Route = createFileRoute("/home")({ component: Home });

function Home() {
  const { profile } = useApp();
  const [greeting, setGreeting] = useState("Hello");
  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening");
  }, []);
  const first = profile.name?.split(" ")[0] || "there";
  const recent = providers.slice(2, 5);

  return (
    <AppShell>
      <div className="safe-top px-5 pt-3">
        <div className="flex items-start justify-between">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-muted-foreground">{greeting},</p>
            <h1 className="truncate text-2xl font-extrabold tracking-tight">{first} 👋</h1>
            <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 text-coral" />
              <span className="truncate">{profile.compound || "Sheikh Zayed, Egypt"}</span>
            </div>
          </div>
          <Link to="/notifications" className="relative grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-surface shadow-soft">
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-coral" />
          </Link>
        </div>

        <Link to="/search" className="mt-4 flex h-14 items-center gap-3 rounded-2xl bg-surface px-4 shadow-soft">
          <Search className="h-5 w-5 text-muted-foreground" />
          <span className="text-[15px] text-muted-foreground">Search for help...</span>
        </Link>
      </div>

      {/* Offers carousel */}
      <div className="mt-5 overflow-x-auto no-scrollbar">
        <div className="flex gap-3 px-5">
          {offers.map((o) => (
            <div key={o.id} className={`w-72 shrink-0 rounded-3xl bg-gradient-to-br ${o.gradient} p-5 text-white shadow-card`}>
              <Sparkles className="h-5 w-5 opacity-80" />
              <div className="mt-3 text-lg font-extrabold leading-tight">{o.title}</div>
              <div className="mt-1 text-sm text-white/80">{o.subtitle}</div>
              <div className="mt-4 inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-bold backdrop-blur">{o.code}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="mt-6">
        <SectionHeader title="Choose your service" />
        <div className="grid grid-cols-2 gap-3 px-5">
          {categories.map((c) => (
            <Link
              key={c.id}
              to="/category/$id"
              params={{ id: c.id }}
              className="overflow-hidden rounded-3xl bg-surface p-4 shadow-soft active:scale-[0.98] transition-transform"
            >
              <div
                className="grid h-14 w-14 place-items-center rounded-2xl text-2xl"
                style={{ background: c.tint }}
              >
                {c.icon}
              </div>
              <div className="mt-3 text-sm font-extrabold">{c.title}</div>
              <div className="text-[11px] text-muted-foreground">{c.subtitle}</div>
              <div className="mt-2 text-[11px] font-semibold text-navy">From EGP {c.fromPrice}/hr</div>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured */}
      <div className="mt-6">
        <SectionHeader
          title="Featured Professionals"
          action={<Link to="/category/$id" params={{ id: "home" }} className="text-xs font-bold text-navy">See all</Link>}
        />
        <div className="overflow-x-auto no-scrollbar">
          <div className="flex gap-3 px-5 pb-1">
            {featuredProviders.map((p) => <ProviderTile key={p.id} p={p} />)}
          </div>
        </div>
      </div>

      {/* Recently booked */}
      <div className="mt-6">
        <SectionHeader title="Recently booked" />
        <div className="space-y-3 px-5">
          {recent.map((p) => <ProviderCard key={p.id} p={p} />)}
        </div>
      </div>

      {/* Trust banner */}
      <div className="mt-6 px-5">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-navy/10">
              <ShieldCheck className="h-6 w-6 text-navy" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-extrabold">Why families trust Famio</div>
              <div className="text-xs text-muted-foreground">Verified people. Insured visits. Real support, 24/7.</div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            {[
              { n: "12k+", l: "Families" },
              { n: "98%", l: "5-star jobs" },
              { n: "24/7", l: "Support" },
            ].map((s) => (
              <div key={s.l} className="rounded-2xl bg-surface-2 py-3">
                <div className="text-sm font-extrabold text-navy">{s.n}</div>
                <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{s.l}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <div className="h-6" />
    </AppShell>
  );
}
