"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Props = {
  displayName: string;
  role: string;
  avatarUrl?: string | null;
  isEditor: boolean;
};

export function UserMenu({ displayName, role, avatarUrl, isEditor }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!ref.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-3 rounded-full border border-[var(--line)] px-3 py-2 text-sm text-[var(--muted)] transition hover:text-[var(--foreground)]"
      >
        <Avatar displayName={displayName} avatarUrl={avatarUrl} />
        <span className="max-w-[120px] truncate">{displayName}</span>
        <span className="text-xs text-[rgba(153,163,179,0.7)]">▾</span>
      </button>

      {open ? (
        <div className="absolute right-0 z-40 mt-3 w-72 overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)] p-2 shadow-2xl backdrop-blur-xl">
          <div className="border-b border-[var(--line)] px-3 py-3">
            <div className="flex items-center gap-3">
              <Avatar displayName={displayName} avatarUrl={avatarUrl} large />
              <div className="min-w-0">
                <div className="truncate text-sm text-[var(--foreground)]">{displayName}</div>
                <div className="mt-1 text-xs text-[var(--muted)]">身份：{role}</div>
              </div>
            </div>
          </div>

          <div className="border-b border-[var(--line)] px-2 py-2">
            <div className="px-3 pb-1 text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">普通用户</div>
            <MenuLink href="/submit" label="提交案例" onClick={() => setOpen(false)} />
            <MenuLink href="/my-submissions" label="我的提交" onClick={() => setOpen(false)} />
          </div>

          {isEditor ? (
            <div className="border-b border-[var(--line)] px-2 py-2">
              <div className="px-3 pb-1 text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">管理后台</div>
              <MenuLink href="/drafts" label="草稿工作台" onClick={() => setOpen(false)} />
              <MenuLink href="/review-submissions" label="提交审核" onClick={() => setOpen(false)} />
              <MenuLink href="/review-leads" label="线索审核" onClick={() => setOpen(false)} />
            </div>
          ) : null}

          <div className="px-2 pt-2">
            <form action="/auth/signout" method="post">
              <button type="submit" className="w-full rounded-xl px-3 py-2 text-left text-sm text-[var(--muted)] transition hover:bg-[rgba(255,255,255,0.04)] hover:text-[var(--foreground)]">
                退出登录
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function MenuLink({ href, label, onClick }: { href: string; label: string; onClick: () => void }) {
  return (
    <Link href={href} onClick={onClick} className="block rounded-xl px-3 py-2 text-sm text-[var(--muted)] transition hover:bg-[rgba(255,255,255,0.04)] hover:text-[var(--foreground)]">
      {label}
    </Link>
  );
}

function Avatar({ displayName, avatarUrl, large = false }: { displayName: string; avatarUrl?: string | null; large?: boolean }) {
  const size = large ? 40 : 28;
  const fallback = displayName.trim().slice(0, 1).toUpperCase() || "U";

  if (avatarUrl) {
    return <Image src={avatarUrl} alt={displayName} width={size} height={size} className="rounded-full object-cover" />;
  }

  return (
    <div
      className="flex items-center justify-center rounded-full border border-[var(--line)] bg-[rgba(255,255,255,0.04)] text-xs text-[var(--foreground)]"
      style={{ width: size, height: size }}
    >
      {fallback}
    </div>
  );
}
