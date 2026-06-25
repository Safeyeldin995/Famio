import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PhoneFrame, PrimaryButton, Card, Badge } from "@/components/famio/ui";
import { useApp } from "@/lib/store";
import { mockBookings, getProvider } from "@/lib/mock/data";
import { Check, MapPin, Calendar, Clock, Phone, MessageCircle, Download, HelpCircle, AlertTriangle, Star } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/booking/$id")({
  component: BookingDetail,
});

function BookingDetail() {
  const { id } = Route.useParams();
  const booking = mockBookings.find((b) => b.id === id) || mockBookings[0];
  const provider = getProvider(booking.providerId)!;
  const [view, setView] = useState<"confirmation" | "active" | "completed">("confirmation");
  const [rating, setRating] = useState(0);
  const { toggleFavorite, favorites } = useApp();
  const nav = useNavigate();

  if (view === "completed") {
    return (
      <PhoneFrame>
        <div className="safe-top flex-1 px-6 pt-10">
          <div className="text-center">
            <div className="animate-pop mx-auto grid h-24 w-24 place-items-center rounded-full bg-mint/40">
              <div className="grid h-16 w-16 place-items-center rounded-full bg-success text-white"><Check className="h-8 w-8" /></div>
            </div>
            <h1 className="mt-5 text-2xl font-extrabold">Booking completed</h1>
            <p className="mt-1 text-sm text-muted-foreground">How was your experience with {provider.name}?</p>
          </div>

          <Card className="mt-8 p-5">
            <div className="flex items-center gap-3">
              <img src={provider.avatar} className="h-14 w-14 rounded-2xl object-cover" />
              <div>
                <div className="font-bold">{provider.name}</div>
                <div className="text-xs text-muted-foreground">{booking.service}</div>
              </div>
            </div>
            <div className="mt-5 flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} onClick={() => setRating(n)}>
                  <Star className={`h-9 w-9 ${n <= rating ? "fill-warning text-warning" : "text-border"}`} />
                </button>
              ))}
            </div>
            <textarea
              rows={3}
              placeholder="Write a quick review (optional)"
              className="mt-4 w-full resize-none rounded-2xl bg-surface-2 p-3 text-sm outline-none"
            />
            <button onClick={() => toggleFavorite(provider.id)} className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-coral">
              <Star className="h-4 w-4" /> {favorites.includes(provider.id) ? "Saved to favorites" : "Save as favorite"}
            </button>
          </Card>
        </div>
        <div className="safe-bottom space-y-2 px-6 pt-4">
          <PrimaryButton onClick={() => nav({ to: "/home" })}>Submit & Book again</PrimaryButton>
        </div>
      </PhoneFrame>
    );
  }

  if (view === "active") {
    return (
      <PhoneFrame>
        <div className="relative h-64 w-full overflow-hidden">
          <img src="https://maps.googleapis.com/maps/api/staticmap?center=Sheikh+Zayed&zoom=14&size=600x400" className="h-full w-full object-cover opacity-90" alt="" />
          <div className="absolute inset-0 bg-gradient-to-b from-navy/30 to-surface-2" />
          <div className="safe-top absolute inset-x-0 top-0 flex items-center justify-between px-5 py-3">
            <button onClick={() => setView("confirmation")} className="grid h-10 w-10 place-items-center rounded-full bg-white/95 shadow-soft">←</button>
            <button className="grid h-10 w-10 place-items-center rounded-full bg-coral text-coral-foreground shadow-card"><AlertTriangle className="h-4 w-4" /></button>
          </div>
        </div>

        <div className="-mt-10 flex-1 rounded-t-3xl bg-surface px-5 pb-8 pt-5">
          <Badge tone="mint"><span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" /> On the way</Badge>
          <div className="mt-2 text-2xl font-extrabold">Arriving in 14 min</div>
          <p className="text-sm text-muted-foreground">{provider.name} is on the way to your place.</p>

          <Card className="mt-5 p-4">
            <div className="flex items-center gap-3">
              <img src={provider.avatar} className="h-14 w-14 rounded-2xl object-cover" />
              <div className="min-w-0 flex-1">
                <div className="font-bold">{provider.name}</div>
                <div className="text-xs text-muted-foreground">★ {provider.rating} · {provider.role}</div>
              </div>
              <div className="flex gap-2">
                <Link to="/messages/$id" params={{ id: "m1" }} className="grid h-11 w-11 place-items-center rounded-full bg-navy text-navy-foreground"><MessageCircle className="h-4 w-4" /></Link>
                <button className="grid h-11 w-11 place-items-center rounded-full bg-coral text-coral-foreground"><Phone className="h-4 w-4" /></button>
              </div>
            </div>
          </Card>

          <Card className="mt-3 p-4">
            <Timeline />
          </Card>

          <button onClick={() => setView("completed")} className="mt-4 w-full rounded-2xl bg-surface-2 py-3 text-sm font-semibold text-muted-foreground">
            (Demo) Mark as completed
          </button>
          <button className="mt-2 w-full rounded-2xl py-3 text-sm font-semibold text-destructive">Cancel booking</button>
        </div>
      </PhoneFrame>
    );
  }

  return (
    <PhoneFrame>
      <div className="safe-top flex-1 px-6 pt-10">
        <div className="text-center">
          <div className="animate-pop mx-auto grid h-28 w-28 place-items-center rounded-full bg-coral/15">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-coral text-coral-foreground shadow-card">
              <Check className="h-10 w-10" strokeWidth={3} />
            </div>
          </div>
          <h1 className="mt-6 text-2xl font-extrabold">You're all set!</h1>
          <p className="mt-1 text-sm text-muted-foreground">Booking #{booking.id} is confirmed.</p>
        </div>

        <Card className="mt-8 p-5">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <img src={provider.avatar} className="h-14 w-14 rounded-2xl object-cover" />
            <div className="min-w-0 flex-1">
              <div className="text-base font-bold">{provider.name}</div>
              <div className="text-xs text-muted-foreground">{booking.service}</div>
            </div>
            <Badge tone="navy">{provider.role}</Badge>
          </div>
          <div className="mt-4 space-y-3 text-sm">
            <Line icon={<Calendar className="h-4 w-4" />} label={booking.date} />
            <Line icon={<Clock className="h-4 w-4" />} label={`${booking.time} · ${booking.duration}`} />
            <Line icon={<MapPin className="h-4 w-4" />} label={booking.address} />
          </div>
        </Card>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <Action icon={<Download className="h-4 w-4" />} label="Receipt" />
          <Action icon={<Calendar className="h-4 w-4" />} label="Add to calendar" />
          <Action icon={<HelpCircle className="h-4 w-4" />} label="Support" />
        </div>
      </div>

      <div className="safe-bottom space-y-2 px-6 pt-4">
        <PrimaryButton onClick={() => setView("active")}>Track booking</PrimaryButton>
        <Link to="/home" className="block py-3 text-center text-sm font-semibold text-muted-foreground">Back to home</Link>
      </div>
    </PhoneFrame>
  );
}

function Line({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-navy/10 text-navy">{icon}</div>
      <span className="pt-1.5 font-medium">{label}</span>
    </div>
  );
}

function Action({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="rounded-2xl bg-surface p-3 text-center shadow-soft active:scale-95">
      <div className="mx-auto grid h-9 w-9 place-items-center rounded-xl bg-navy/10 text-navy">{icon}</div>
      <div className="mt-1.5 text-[11px] font-semibold">{label}</div>
    </button>
  );
}

function Timeline() {
  const items = [
    { label: "Booking confirmed", time: "Yesterday, 8:12 PM", done: true },
    { label: "Professional matched", time: "Today, 8:45 AM", done: true },
    { label: "On the way", time: "Now", done: true, active: true },
    { label: "Arrival", time: "~9:30 AM", done: false },
    { label: "Service in progress", time: "—", done: false },
    { label: "Completed", time: "—", done: false },
  ];
  return (
    <ol className="relative">
      {items.map((it, i) => (
        <li key={i} className="flex gap-3 pb-4 last:pb-0">
          <div className="flex flex-col items-center">
            <span className={`grid h-6 w-6 place-items-center rounded-full ${it.done ? "bg-navy text-navy-foreground" : "bg-muted text-muted-foreground"} ${it.active ? "ring-4 ring-coral/30" : ""}`}>
              {it.done ? <Check className="h-3 w-3" /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}
            </span>
            {i < items.length - 1 && <span className={`mt-1 w-0.5 flex-1 ${it.done ? "bg-navy" : "bg-border"}`} />}
          </div>
          <div className="pb-2">
            <div className={`text-sm font-bold ${it.done ? "" : "text-muted-foreground"}`}>{it.label}</div>
            <div className="text-[11px] text-muted-foreground">{it.time}</div>
          </div>
        </li>
      ))}
    </ol>
  );
}
