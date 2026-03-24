import Link from "next/link";

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    已关闭: "border-[rgba(173,104,79,0.35)] text-[var(--accent-rust)] bg-[rgba(173,104,79,0.08)]",
    停更: "border-[rgba(214,180,134,0.35)] text-[var(--accent-gold)] bg-[rgba(214,180,134,0.08)]",
    转型: "border-[rgba(136,160,191,0.35)] text-[var(--accent-blue)] bg-[rgba(136,160,191,0.08)]",
    名存实亡: "border-[rgba(153,163,179,0.35)] text-[var(--muted)] bg-[rgba(153,163,179,0.08)]",
  };

  return <span className={cn("inline-flex rounded-full border px-3 py-1 text-xs", styles[status] || styles["已关闭"])}>{status}</span>;
}

export function Tag({ children, href }: { children: React.ReactNode; href?: string }) {
  const className = "inline-flex rounded-full border border-[var(--line)] bg-[rgba(255,255,255,0.03)] px-3 py-1 text-xs text-[var(--muted)] transition hover:text-[var(--foreground)]";
  if (href) return <Link href={href} className={className}>{children}</Link>;
  return <span className={className}>{children}</span>;
}
