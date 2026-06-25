import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PhoneFrame, TopBar, PrimaryButton, Chip, Card } from "@/components/famio/ui";
import { getProvider } from "@/lib/mock/data";
import { useApp } from "@/lib/store";
import { MapPin, CreditCard, Wallet, Banknote, Check } from "lucide-react";

export const Route = createFileRoute("/book/$providerId")({
  component: Book,
  loader: ({ params }) => {
    const p = getProvider(params.providerId);
    if (!p) throw notFound();
    return { p };
  },
  notFoundComponent: () => <div className="p-8 text-center">Provider not found</div>,
  errorComponent: ({ error }) => <div className="p-8 text-center">{String(error)}</div>,
});

const steps = ["Service", "Duration", "Date", "Time", "Address", "Notes", "Summary", "Payment"];

function Book() {
  const { p } = Route.useLoaderData();
  const { profile } = useApp();
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const [service, setService] = useState(p.category === "home" ? "Deep Clean" : "Babysitting");
  const durations = p.category === "home" ? ["2h", "4h", "6h", "8h"] : ["3h", "4h", "6h", "8h"];
  const [duration, setDuration] = useState(durations[1]);
  const [date, setDate] = useState<number | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [address, setAddress] = useState(profile.address || "");
  const [notes, setNotes] = useState("");
  const [pay, setPay] = useState<"card" | "wallet" | "cash">("card");

  const hours = parseInt(duration);
  const subtotal = p.hourlyRate * hours;
  const fee = 25;
  const vat = Math.round(subtotal * 0.14);
  const total = subtotal + fee + vat;

  const canNext = () => {
    if (step === 2) return date !== null;
    if (step === 3) return !!time;
    if (step === 4) return address.trim().length > 3;
    return true;
  };

  const next = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else nav({ to: "/booking/$id", params: { id: "FM-2031" } });
  };

  const back = step === 0 ? { to: "/provider/$id" as const, params: { id: p.id } } : () => setStep(step - 1);

  return (
    <PhoneFrame>
      <TopBar back={typeof back === "function" ? back : { to: `/provider/${p.id}` }} title={steps[step]} />
      <div className="px-5">
        <div className="mb-5 text-xs font-semibold text-muted-foreground">
          Step {step + 1} of {steps.length}
        </div>
      </div>


      <div className="flex-1 px-5 pb-28">
        {step === 0 && (
          <Step title="What do you need?" sub="Pick the service that fits today.">
            <div className="space-y-3">
              {(p.category === "home"
                ? ["Deep Clean", "Standard Clean", "Move-in / Move-out", "Post-event"]
                : ["Babysitting", "Newborn care", "After-school care"]
              ).map((s) => (
                <Option key={s} active={service === s} onClick={() => setService(s)} label={s} />
              ))}
            </div>
          </Step>
        )}

        {step === 1 && (
          <Step title="How long?" sub="You can extend on the day if needed.">
            <div className="grid grid-cols-2 gap-3">
              {durations.map((d) => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={`rounded-2xl p-5 text-left transition-all ${
                    duration === d ? "bg-navy text-navy-foreground" : "bg-surface shadow-soft"
                  }`}
                >
                  <div className="text-2xl font-extrabold">{d}</div>
                  <div className={`text-xs ${duration === d ? "text-white/70" : "text-muted-foreground"}`}>
                    EGP {p.hourlyRate * parseInt(d)}
                  </div>
                </button>
              ))}
            </div>
          </Step>
        )}

        {step === 2 && (
          <Step title="Pick a date" sub="Available slots highlighted.">
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 12 }).map((_, i) => {
                const d = new Date();
                d.setDate(d.getDate() + i);
                const day = d.getDate();
                const m = d.toLocaleString("en-US", { month: "short" });
                const wd = d.toLocaleString("en-US", { weekday: "short" });
                const disabled = i === 4 || i === 8;
                return (
                  <button
                    key={i}
                    disabled={disabled}
                    onClick={() => setDate(day)}
                    className={`flex flex-col items-center rounded-2xl px-2 py-3 transition-all ${
                      date === day ? "bg-coral text-coral-foreground" :
                      disabled ? "bg-surface opacity-40" : "bg-surface shadow-soft"
                    }`}
                  >
                    <span className="text-[10px] font-bold uppercase">{wd}</span>
                    <span className="text-xl font-extrabold">{day}</span>
                    <span className="text-[10px]">{m}</span>
                  </button>
                );
              })}
            </div>
          </Step>
        )}

        {step === 3 && (
          <Step title="Choose a time" sub="All times are local to Cairo.">
            <div className="grid grid-cols-3 gap-2">
              {["8:00 AM", "10:00 AM", "12:00 PM", "2:00 PM", "4:00 PM", "6:00 PM"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTime(t)}
                  className={`rounded-2xl py-3 text-sm font-bold ${
                    time === t ? "bg-navy text-navy-foreground" : "bg-surface shadow-soft"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </Step>
        )}

        {step === 4 && (
          <Step title="Where?" sub="Confirm the address for this booking.">
            <Card className="overflow-hidden">
              <div className="h-32 bg-cover bg-center" style={{ backgroundImage: "url('https://maps.googleapis.com/maps/api/staticmap?center=Sheikh+Zayed&zoom=14&size=600x300')" }}>
                <div className="h-full w-full bg-gradient-to-b from-transparent to-surface/80" />
              </div>
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-coral" />
                  <textarea
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="min-w-0 flex-1 resize-none bg-transparent text-sm font-medium outline-none"
                  />
                </div>
              </div>
            </Card>
          </Step>
        )}

        {step === 5 && (
          <Step title="Anything to add?" sub="Help your professional be ready.">
            <textarea
              rows={6}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="E.g. The gate code is 1234. We have a friendly dog."
              className="w-full resize-none rounded-2xl border border-border bg-surface p-4 text-[15px] outline-none focus:border-navy"
            />
          </Step>
        )}

        {step === 6 && (
          <Step title="Review your booking">
            <Card className="p-4">
              <div className="flex items-center gap-3 border-b border-border pb-3">
                <img src={p.avatar} className="h-14 w-14 rounded-2xl object-cover" />
                <div className="min-w-0">
                  <div className="font-bold">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{service} · {duration}</div>
                </div>
              </div>
              <Row label="Date" value={date ? `Day ${date}` : "—"} />
              <Row label="Time" value={time || "—"} />
              <Row label="Address" value={address || "—"} />
              {notes && <Row label="Notes" value={notes} />}
              <div className="mt-3 border-t border-border pt-3 space-y-1.5 text-sm">
                <Row label={`${p.hourlyRate} × ${hours} hrs`} value={`EGP ${subtotal}`} small />
                <Row label="Service fee" value={`EGP ${fee}`} small />
                <Row label="VAT (14%)" value={`EGP ${vat}`} small />
                <div className="mt-2 flex items-center justify-between border-t border-border pt-2">
                  <span className="text-sm font-bold">Total</span>
                  <span className="text-lg font-extrabold text-navy">EGP {total}</span>
                </div>
              </div>
            </Card>
          </Step>
        )}

        {step === 7 && (
          <Step title="Payment" sub="Secure checkout powered by Paymob.">
            <div className="space-y-3">
              <PayOption icon={<CreditCard className="h-5 w-5" />} label="Credit / Debit card" sub="Visa, Mastercard, Meeza" active={pay === "card"} onClick={() => setPay("card")} />
              <PayOption icon={<Wallet className="h-5 w-5" />} label="Mobile wallet" sub="Vodafone Cash, InstaPay" active={pay === "wallet"} onClick={() => setPay("wallet")} />
              <PayOption icon={<Banknote className="h-5 w-5" />} label="Cash on arrival" sub="Pay your professional directly" active={pay === "cash"} onClick={() => setPay("cash")} />
            </div>
            <div className="mt-5 flex items-center gap-3 rounded-2xl bg-mint/30 p-4">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-surface"><Check className="h-4 w-4 text-success" /></div>
              <div className="text-xs">Have a promo code? <button className="font-bold text-navy">Add it now</button></div>
            </div>
          </Step>
        )}
      </div>

      <div className="safe-bottom fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md border-t border-border bg-surface px-5 pt-3">
        {step === 7 && (
          <div className="mb-3 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total</span>
            <span className="text-lg font-extrabold text-navy">EGP {total}</span>
          </div>
        )}
        <PrimaryButton variant={step === 7 ? "coral" : "navy"} onClick={next} disabled={!canNext()}>
          {step === 7 ? `Pay EGP ${total}` : step === 6 ? "Continue to payment" : "Continue"}
        </PrimaryButton>
      </div>
    </PhoneFrame>
  );
}

function Step({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <div className="animate-rise">
      <h2 className="text-2xl font-extrabold tracking-tight">{title}</h2>
      {sub && <p className="mt-1 text-sm text-muted-foreground">{sub}</p>}
      <div className="mt-6">{children}</div>
    </div>
  );
}

function Option({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-2xl p-4 text-left transition-all ${
        active ? "bg-navy text-navy-foreground" : "bg-surface shadow-soft"
      }`}
    >
      <span className="font-bold">{label}</span>
      <span className={`grid h-6 w-6 place-items-center rounded-full border-2 ${active ? "border-white bg-white text-navy" : "border-border"}`}>
        {active && <Check className="h-3.5 w-3.5" />}
      </span>
    </button>
  );
}

function PayOption({ icon, label, sub, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-2xl p-4 text-left transition-all ${
        active ? "bg-surface ring-2 ring-navy" : "bg-surface shadow-soft"
      }`}
    >
      <div className="grid h-11 w-11 place-items-center rounded-xl bg-navy/10 text-navy">{icon}</div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-bold">{label}</div>
        <div className="text-xs text-muted-foreground">{sub}</div>
      </div>
      <span className={`grid h-6 w-6 place-items-center rounded-full border-2 ${active ? "border-navy bg-navy text-white" : "border-border"}`}>
        {active && <Check className="h-3.5 w-3.5" />}
      </span>
    </button>
  );
}

function Row({ label, value, small }: { label: string; value: string; small?: boolean }) {
  return (
    <div className={`mt-2 flex items-start justify-between gap-3 ${small ? "text-xs text-muted-foreground" : "text-sm"}`}>
      <span>{label}</span>
      <span className={small ? "" : "font-semibold text-right"}>{value}</span>
    </div>
  );
}
