import { createFileRoute, Link } from "@tanstack/react-router";
import { PhoneFrame, TopBar, Chip } from "@/components/famio/ui";
import { ProviderCard } from "@/components/famio/ProviderCard";
import { providers } from "@/lib/mock/data";
import { useApp } from "@/lib/store";
import { useState } from "react";

export const Route = createFileRoute("/favorites")({ component: Favorites });

function Favorites() {
  const { favorites } = useApp();
  const [tab, setTab] = useState<"all" | "home" | "kids">("all");
  const saved = providers.filter((p) => favorites.includes(p.id));
  const filtered = tab === "all" ? saved : saved.filter((p) => p.category === tab);

  return (
    <PhoneFrame>
      <TopBar back={{ to: "/profile" }} title="Favorites" />
      <div className="flex gap-2 px-5 pb-4">
        <Chip active={tab === "all"} onClick={() => setTab("all")}>All</Chip>
        <Chip active={tab === "home"} onClick={() => setTab("home")}>Famio Home</Chip>
        <Chip active={tab === "kids"} onClick={() => setTab("kids")}>Famio Kids</Chip>
      </div>
      <div className="space-y-3 px-5 pb-10">
        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <div className="mx-auto grid h-24 w-24 place-items-center rounded-3xl bg-surface text-4xl shadow-soft">💖</div>
            <div className="mt-5 text-base font-bold">No favorites yet</div>
            <p className="mt-1 text-xs text-muted-foreground">Tap the heart on any professional to save them.</p>
            <Link to="/home" className="mt-5 inline-flex h-11 items-center rounded-2xl bg-navy px-5 text-sm font-bold text-navy-foreground">Explore</Link>
          </div>
        ) : (
          filtered.map((p) => <ProviderCard key={p.id} p={p} />)
        )}
      </div>
    </PhoneFrame>
  );
}
