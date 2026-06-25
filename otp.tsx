import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PhoneFrame, TopBar, Chip } from "@/components/famio/ui";
import { ProviderCard } from "@/components/famio/ProviderCard";
import { categories, providersByCategory, type Category } from "@/lib/mock/data";
import { Filter, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/category/$id")({
  component: CategoryPage,
  notFoundComponent: () => <div className="p-8 text-center">Category not found</div>,
  loader: ({ params }) => {
    const cat = categories.find((c) => c.id === params.id);
    if (!cat) throw notFound();
    return { cat };
  },
  errorComponent: ({ error }) => <div className="p-8 text-center">{String(error)}</div>,
});

function CategoryPage() {
  const { cat } = Route.useLoaderData();
  const id = cat.id as Category;
  const list = providersByCategory(id);
  const [sort, setSort] = useState<"top" | "price" | "experience">("top");

  const sorted = [...list].sort((a, b) =>
    sort === "price" ? a.hourlyRate - b.hourlyRate :
    sort === "experience" ? b.yearsExp - a.yearsExp :
    b.rating - a.rating
  );

  return (
    <PhoneFrame>
      <div className="relative">
        <div className="h-44 w-full" style={{ background: `linear-gradient(135deg, var(--navy), oklch(0.42 0.16 268))` }}>
          <TopBar back={{ to: "/home" }} right={<button className="grid h-10 w-10 place-items-center rounded-full bg-white/15 text-white backdrop-blur"><Filter className="h-4 w-4" /></button>} transparent />
          <div className="px-5 pb-4 text-white">
            <div className="text-xs font-semibold opacity-80">{cat.subtitle}</div>
            <div className="text-2xl font-extrabold">{cat.title}</div>
            <div className="mt-1 max-w-xs text-xs text-white/80">{cat.description}</div>
          </div>
        </div>
      </div>

      <div className="-mt-4 flex-1 rounded-t-3xl bg-surface-2 px-5 pt-5 pb-24">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm font-bold">{sorted.length} available · from EGP {cat.fromPrice}/hr</div>
          <Link to="/search" className="inline-flex items-center gap-1 rounded-full bg-surface px-3 py-1.5 text-xs font-bold shadow-soft">
            <SlidersHorizontal className="h-3.5 w-3.5" /> Filters
          </Link>
        </div>

        <div className="mb-4 flex gap-2 overflow-x-auto no-scrollbar">
          <Chip active={sort === "top"} onClick={() => setSort("top")}>Top rated</Chip>
          <Chip active={sort === "price"} onClick={() => setSort("price")}>Best price</Chip>
          <Chip active={sort === "experience"} onClick={() => setSort("experience")}>Most experience</Chip>
        </div>

        <div className="space-y-3">
          {sorted.map((p) => <ProviderCard key={p.id} p={p} />)}
        </div>
      </div>
    </PhoneFrame>
  );
}
