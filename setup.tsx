import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useApp } from "@/lib/store";
import famioLogo from "@/assets/famio-logo.png.asset.json";

export const Route = createFileRoute("/")({
  component: Splash,
});

function Splash() {
  const navigate = useNavigate();
  const { onboarded, authed, profile } = useApp();

  useEffect(() => {
    const t = setTimeout(() => {
      if (!onboarded) navigate({ to: "/onboarding" });
      else if (!authed) navigate({ to: "/login" });
      else if (!profile.name) navigate({ to: "/setup" });
      else navigate({ to: "/home" });
    }, 1600);
    return () => clearTimeout(t);
  }, [navigate, onboarded, authed, profile.name]);

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center bg-white text-navy">
      <div className="animate-pop">
        <img src={famioLogo.url} alt="Famio" className="h-32 w-32 object-contain" />
      </div>
      <div className="animate-rise mt-8 text-center" style={{ animationDelay: "260ms" }}>
        <div className="text-sm text-navy/60">Trusted help. Happy families.</div>
      </div>
    </div>
  );
}
