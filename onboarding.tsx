import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, TopBar, Chip, Card, Badge } from "@/components/famio/ui";
import { mockBookings, getProvider } from "@/lib/mock/data";
import { useState } from "react";
import { Calendar, Clock, Repeat, Download } from "lucide-react";

export const Route = createFileRoute("/bookings")({ component: Bookings });

function Bookings() {
  const [tab, setTab] = useState<"upcoming" | "completed" | "cancelled">("upcoming");
  const list = mockBookings.filter((b) => b.status === tab);

  return (
    <AppShell>
      <TopBar title="My bookings" />
      <div className="flex gap-2 px-5 pb-4">
        <Chip active={tab === "upcoming"} onClick={() => setTab("upcoming")}>Upcoming</Chip>
        <Chip active={tab === "completed"} onClick={() => setTab("completed")}>Completed</Chip>
        <Chip active={tab === "cancelled"} onClick={() => setTab("cancelled")}>Cancelled</Chip>
      </div>

      <div className="space-y-3 px-5">
        {list.length === 0 ? (
          <Empty tab={tab} />
        ) : (
          list.map((b) => {
            const p = getProvider(b.providerId)!;
            return (
              <Link key={b.id} to="/booking/$id" params={{ id: b.id }} className="block">
                <Card className="p-4 active:scale-[0.99] transition-transform">
                  <div className="flex items-start gap-3">
                    <img src={p.avatar} className="h-14 w-14 rounded-2xl object-cover" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <div className="truncate text-sm font-bold">{p.name}</div>
                        <Badge tone={b.status === "upcoming" ? "navy" : b.status === "completed" ? "mint" : "muted"}>{b.status}</Badge>
                      </div>
                      <div className="mt-0.5 truncate text-xs text-muted-foreground">{b.service}</div>
                      <div className="mt-2 flex items-center gap-3 text-[11px] text-muted-foreground">
                        <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> {b.date}</span>
                        <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {b.time} · {b.duration}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-extrabold text-navy">EGP {b.price}</div>
                      <div className="text-[10px] text-muted-foreground">#{b.id}</div>
                    </div>
                  </div>
                  {b.status !== "upcoming" && (
                    <div className="mt-3 flex gap-2 border-t border-border pt-3">
                      <button className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-surface-2 py-2 text-xs font-bold"><Repeat className="h-3.5 w-3.5" /> Book again</button>
                      <button className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-surface-2 py-2 text-xs font-bold"><Download className="h-3.5 w-3.5" /> Invoice</button>
                    </div>
                  )}
                </Card>
              </Link>
            );
          })
        )}
      </div>
    </AppShell>
  );
}

function Empty({ tab }: { tab: string }) {
  return (
    <div className="py-20 text-center">
      <div className="mx-auto grid h-24 w-24 place-items-center rounded-3xl bg-surface text-4xl shadow-soft">📅</div>
      <div className="mt-5 text-base font-bold">No {tab} bookings</div>
      <p className="mx-auto mt-1 max-w-xs text-xs text-muted-foreground">When you book a Famio professional, you'll see it here.</p>
      <Link to="/home" className="mt-5 inline-flex h-11 items-center rounded-2xl bg-navy px-5 text-sm font-bold text-navy-foreground">Browse professionals</Link>
    </div>
  );
}
