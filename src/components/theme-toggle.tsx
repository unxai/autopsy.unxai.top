"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("autopsy-theme");
    const next = saved === "light" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    setTheme(next);
    setReady(true);
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    window.localStorage.setItem("autopsy-theme", next);
    setTheme(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="rounded-full border border-[var(--line)] px-4 py-2 text-sm text-[var(--muted)] transition hover:text-[var(--foreground)]"
      aria-label="切换明暗模式"
      title="切换明暗模式"
    >
      {ready ? (theme === "dark" ? "浅色" : "深色") : "主题"}
    </button>
  );
}
