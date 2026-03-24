import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { UserMenu } from "@/components/user-menu";

export async function AuthButton() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  if (!user) {
    return (
      <Link href="/login" className="rounded-full border border-[var(--line)] px-4 py-2 text-sm text-[var(--muted)] transition hover:text-[var(--foreground)]">
        登录
      </Link>
    );
  }

  const { data: profile } = await supabase.from("profiles").select("role, username, avatar_url").eq("id", user.id).maybeSingle();
  const displayName = profile?.username || user.email || user.user_metadata?.user_name || "已登录";
  const role = profile?.role || "user";
  const avatarUrl = profile?.avatar_url || user.user_metadata?.avatar_url || null;
  const isEditor = role === "editor" || role === "admin";

  return <UserMenu displayName={displayName} role={role} avatarUrl={avatarUrl} isEditor={isEditor} />;
}
