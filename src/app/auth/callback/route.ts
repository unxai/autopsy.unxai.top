import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const error = requestUrl.searchParams.get("error_description") || requestUrl.searchParams.get("error");
  const origin = process.env.NEXT_PUBLIC_SITE_URL || requestUrl.origin;

  if (error) {
    return NextResponse.redirect(`${origin}/auth/complete?status=error&error=${encodeURIComponent(error)}`);
  }

  if (!code) {
    return NextResponse.redirect(`${origin}/auth/complete?status=error&error=${encodeURIComponent("missing_code")}`);
  }

  const supabase = await createClient();
  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

  if (exchangeError) {
    return NextResponse.redirect(`${origin}/auth/complete?status=error&error=${encodeURIComponent(exchangeError.message)}`);
  }

  return NextResponse.redirect(`${origin}/auth/complete?status=success`);
}
