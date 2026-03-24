import Link from "next/link";

function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function AdminSubnav({
  current,
}: {
  current: "drafts" | "review-submissions" | "review-leads";
}) {
  const items = [
    { key: "review-submissions", href: "/review-submissions", label: "提交审核" },
    { key: "review-leads", href: "/review-leads", label: "线索审核" },
    { key: "drafts", href: "/drafts", label: "草稿工作台" },
  ] as const;

  return (
    <div className="mb-8 flex flex-wrap gap-2">
      {items.map((item) => (
        <Link
          key={item.key}
          href={item.href}
          className={cn(
            "rounded-full border px-4 py-2 text-sm transition",
            item.key === current
              ? "border-[rgba(173,104,79,0.35)] bg-[rgba(173,104,79,0.08)] text-[var(--foreground)]"
              : "border-[var(--line)] text-[var(--muted)] hover:text-[var(--foreground)]",
          )}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}
