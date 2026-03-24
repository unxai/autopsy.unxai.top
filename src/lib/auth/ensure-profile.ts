import { createClient } from "@/lib/supabase/server";

export async function ensureProfile() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  if (!user) return null;

  const username = user.user_metadata?.user_name || user.user_metadata?.preferred_username || user.email || "user";
  const avatarUrl = user.user_metadata?.avatar_url || null;

  await supabase.from("profiles").upsert({
    id: user.id,
    username,
    avatar_url: avatarUrl,
  });

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
  return profile;
}
