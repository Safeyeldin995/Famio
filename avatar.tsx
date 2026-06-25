import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Calendar, MessageCircle, User } from "lucide-react";
import type { ReactNode } from "react";

export function PhoneFrame({ children, bg = "bg-surface-2" }: { children: ReactNode; bg?: string }) {
  return (
    <div className={`mx-auto flex min-h-dvh w-full max-w-md flex-col ${bg}`}>
      {children}
    </div>
  );
}

export function AppShell({
  children,
  hideNav = false,
  bg = "bg-surface-2",
}: {
  children: ReactNode;
  hideNav?: boolean;
  bg?: string;
}) {
  return (
    <PhoneFrame bg={bg}>
      <main className={`flex-1 ${hideNav ? "" : "pb-24"}`}>{children}</main>
      {!hideNav && <BottomNav />}
    </PhoneFrame>
  );
}

const tabs = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/bookings", label: "Bookings", icon: Calendar },
  { to: "/messages", label: "Messages", icon: MessageCircle },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40">
      <div className="mx-auto max-w-md">
        <div className="safe-bottom mx-3 mb-3 rounded-3xl border border-border/60 bg-surface/95 shadow-float backdrop-blur-xl">
          <ul className="grid grid-cols-4">
            {tabs.map((t) => {
              const active = pathname === t.to || pathname.startsWith(t.to + "/");
              const Icon = t.icon;
              return (
                <li key={t.to}>
                  <Link
                    to={t.to}
                    className="flex flex-col items-center gap-1 px-2 pt-3 pb-2"
                  >
                    <span
                      className={`grid h-9 w-12 place-items-center rounded-2xl transition-all ${
                        active ? "bg-navy text-navy-foreground" : "text-muted-foreground"
                      }`}
                    >
                      <Icon className="h-5 w-5" strokeWidth={2.2} />
                    </span>
                    <span
                      className={`text-[11px] font-semibold ${
                        active ? "text-navy" : "text-muted-foreground"
                      }`}
                    >
                      {t.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export function TopBar({
  title,
  back,
  right,
  transparent = false,
}: {
  title?: string;
  back?: { to: string } | (() => void);
  right?: ReactNode;
  transparent?: boolean;
}) {
  return (
    <div className={`safe-top sticky top-0 z-30 ${transparent ? "" : "bg-surface-2/90 backdrop-blur"}`}>
      <div className="flex items-center gap-2 px-4 py-3">
        {back && (
          <BackButton back={back} />
        )}
        {title && (
          <h1 className="flex-1 truncate text-base font-bold text-foreground">{title}</h1>
        )}
        {!title && <div className="flex-1" />}
        {right}
      </div>
    </div>
  );
}

function BackButton({ back }: { back: { to: string } | (() => void) }) {
  const cls = "grid h-10 w-10 shrink-0 place-items-center rounded-full bg-surface shadow-soft";
  if (typeof back === "function") {
    return (
      <button onClick={back} className={cls} aria-label="Back">
        <ChevronLeft />
      </button>
    );
  }
  return (
    <Link to={back.to} className={cls} aria-label="Back">
      <ChevronLeft />
    </Link>
  );
}

function ChevronLeft() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

export function PrimaryButton({
  children,
  onClick,
  type = "button",
  disabled,
  variant = "navy",
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  variant?: "navy" | "coral" | "ghost" | "outline";
  className?: string;
}) {
  const styles =
    variant === "navy"
      ? "bg-navy text-navy-foreground active:bg-navy/90"
      : variant === "coral"
      ? "bg-coral text-coral-foreground active:bg-coral/90"
      : variant === "outline"
      ? "border border-border bg-surface text-foreground"
      : "bg-transparent text-navy";
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl text-base font-bold transition-all active:scale-[0.98] disabled:opacity-50 ${styles} ${className}`}
    >
      {children}
    </button>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-3xl bg-surface shadow-soft ${className}`}>{children}</div>
  );
}

export function Chip({
  children,
  active,
  onClick,
}: {
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
        active
          ? "bg-navy text-navy-foreground"
          : "bg-surface text-foreground border border-border"
      }`}
    >
      {children}
    </button>
  );
}

export function Badge({ children, tone = "navy" }: { children: ReactNode; tone?: "navy" | "coral" | "mint" | "muted" }) {
  const map = {
    navy: "bg-navy/10 text-navy",
    coral: "bg-coral/10 text-coral",
    mint: "bg-mint/20 text-foreground",
    muted: "bg-muted text-muted-foreground",
  } as const;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${map[tone]}`}>
      {children}
    </span>
  );
}

export function SectionHeader({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="mb-3 flex items-center justify-between px-5">
      <h2 className="text-lg font-extrabold tracking-tight text-foreground">{title}</h2>
      {action}
    </div>
  );
}
