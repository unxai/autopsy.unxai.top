import Link from "next/link";
import type { ReactNode } from "react";

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

const toneClass: Record<"primary" | "secondary" | "danger", string> = {
  primary: "border-[rgba(111,143,120,0.35)] bg-[rgba(111,143,120,0.08)] text-[var(--foreground)]",
  secondary: "border-[var(--line)] text-[var(--foreground)]",
  danger: "border-[rgba(173,104,79,0.35)] bg-[rgba(173,104,79,0.08)] text-[var(--foreground)]",
};

const baseClass = "inline-flex items-center rounded-full border px-4 py-2 text-sm transition hover:opacity-90";

export function AdminActionButton({
  children,
  tone = "secondary",
  type = "submit",
}: {
  children: ReactNode;
  tone?: "primary" | "secondary" | "danger";
  type?: "button" | "submit" | "reset";
}) {
  return (
    <button type={type} className={cn(baseClass, toneClass[tone])}>
      {children}
    </button>
  );
}

export function AdminActionLink({
  href,
  children,
  tone = "secondary",
}: {
  href: string;
  children: ReactNode;
  tone?: "primary" | "secondary" | "danger";
}) {
  return (
    <Link href={href} className={cn(baseClass, toneClass[tone])}>
      {children}
    </Link>
  );
}
