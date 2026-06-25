import { createFileRoute } from "@tanstack/react-router";
import { PhoneFrame, TopBar, Card } from "@/components/famio/ui";
import { MessageCircle, Phone, MessageSquare, ChevronDown } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/help")({ component: Help });

const faqs = [
  { q: "How are professionals verified?", a: "Every Famio professional completes ID verification, background checks, and an in-person interview. Many also hold extra certifications like First Aid." },
  { q: "Can I cancel a booking?", a: "Yes. Cancellations more than 6 hours before the booking are free. Within 6 hours, a small fee may apply." },
  { q: "What if I'm not happy with the service?", a: "Reach out to support within 24 hours and we'll make it right — including a re-clean or refund where applicable." },
  { q: "Is cash payment supported?", a: "Yes. You can pay in cash on arrival in addition to cards and mobile wallets." },
  { q: "Which areas do you serve?", a: "We currently serve Sheikh Zayed and 6th of October, with more areas coming soon." },
];

function Help() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <PhoneFrame>
      <TopBar back={{ to: "/profile" }} title="Help center" />
      <div className="px-5 pb-10">
        <Card className="p-5">
          <h2 className="text-lg font-extrabold">How can we help?</h2>
          <p className="mt-1 text-xs text-muted-foreground">Our team is available 24/7.</p>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <Contact icon={<MessageCircle className="h-5 w-5" />} label="Chat" />
            <Contact icon={<Phone className="h-5 w-5" />} label="Call" />
            <Contact icon={<MessageSquare className="h-5 w-5" />} label="WhatsApp" />
          </div>
        </Card>

        <h3 className="mt-6 mb-2 px-1 text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground">FAQs</h3>
        <div className="divide-y divide-border rounded-3xl bg-surface shadow-soft">
          {faqs.map((f, i) => (
            <button key={i} onClick={() => setOpen(open === i ? null : i)} className="block w-full px-4 py-4 text-left">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-bold">{f.q}</span>
                <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${open === i ? "rotate-180" : ""}`} />
              </div>
              {open === i && <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{f.a}</p>}
            </button>
          ))}
        </div>

        <button className="mt-4 w-full rounded-2xl bg-surface py-4 text-sm font-bold text-destructive shadow-soft">
          Report a serious issue
        </button>
      </div>
    </PhoneFrame>
  );
}

function Contact({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="rounded-2xl bg-surface-2 p-3 text-center active:scale-95">
      <div className="mx-auto grid h-10 w-10 place-items-center rounded-xl bg-navy text-navy-foreground">{icon}</div>
      <div className="mt-1.5 text-[11px] font-bold">{label}</div>
    </button>
  );
}
