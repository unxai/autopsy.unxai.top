import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ensureProfile } from "@/lib/auth/ensure-profile";

export async function FooterAdminLink() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) return null;

  const profile = await ensureProfile();
  if (!profile || !["editor", "admin"].includes(profile.role)) return null;

  return (
    <Link href="/review-submissions" className="transition hover:text-[rgba(232,236,241,0.72)]">
      workflow
    </Link>
  );
}
