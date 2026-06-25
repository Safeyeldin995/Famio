import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PhoneFrame, PrimaryButton, TopBar } from "@/components/famio/ui";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const [phone, setPhone] = useState("");
  const nav = useNavigate();
  const { setProfile } = useApp();
  const valid = phone.replace(/\D/g, "").length >= 9;

  const submit = () => {
    if (!valid) return;
    setProfile({ phone: `+20 ${phone}` });
    nav({ to: "/otp" });
  };

  return (
    <PhoneFrame bg="bg-surface">
      <TopBar back={{ to: "/onboarding" }} />
      <div className="flex-1 px-6 pt-2">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight">Welcome to Famio</h1>
          <p className="mt-2 text-[15px] text-muted-foreground">Enter your phone number to continue. We'll send you a verification code.</p>
        </div>

        <label className="block text-xs font-bold uppercase tracking-wide text-muted-foreground">Phone number</label>
        <div className="mt-2 flex h-16 items-center gap-3 rounded-2xl border border-border bg-surface px-4 focus-within:border-navy">
          <div className="flex shrink-0 items-center gap-2">
            <span className="text-xl">🇪🇬</span>
            <span className="text-base font-bold">+20</span>
          </div>
          <div className="h-7 w-px bg-border" />
          <input
            inputMode="tel"
            placeholder="1XX XXX XXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/[^\d ]/g, ""))}
            className="min-w-0 flex-1 bg-transparent text-base font-semibold outline-none placeholder:text-muted-foreground/60"
          />
        </div>

        <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
          By continuing, you agree to Famio's{" "}
          <Link to="/help" className="font-semibold text-navy">Terms of Service</Link> and{" "}
          <Link to="/help" className="font-semibold text-navy">Privacy Policy</Link>.
        </p>
      </div>
      <div className="safe-bottom px-6 pt-4">
        <PrimaryButton onClick={submit} disabled={!valid}>Send code</PrimaryButton>
      </div>
    </PhoneFrame>
  );
}
