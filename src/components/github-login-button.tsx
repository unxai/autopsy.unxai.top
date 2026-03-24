"use client";

import { createClient } from "@/lib/supabase/client";

export function GitHubLoginButton() {
  async function handleLogin() {
    const supabase = createClient();
    const redirectTo = `${window.location.origin}/auth/callback`;

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo,
      },
    });

    if (error) {
      window.location.href = `/login?error=${encodeURIComponent(error.message)}`;
      return;
    }

    if (data.url) {
      window.location.href = data.url;
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogin}
      className="rounded-full border border-[rgba(173,104,79,0.4)] bg-[rgba(173,104,79,0.12)] px-6 py-3 text-sm text-[var(--foreground)] transition hover:bg-[rgba(173,104,79,0.18)]"
    >
      使用 GitHub 登录
    </button>
  );
}
