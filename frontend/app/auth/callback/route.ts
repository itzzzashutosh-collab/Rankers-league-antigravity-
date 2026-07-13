import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  // Handle OAuth provider errors (e.g. user denied access)
  if (error) {
    const msg = errorDescription || error;
    return NextResponse.redirect(`${origin}/auth/login?error=${encodeURIComponent(msg)}`);
  }

  if (code) {
    const supabase = await createClient();
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (!exchangeError) {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Ensure a profile row exists (auto-created by trigger, but Google users might not have one yet)
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("profile_status, username, full_name, avatar_url")
          .eq("id", user.id)
          .single();

        // If profile doesn't exist yet, create a minimal one from Google metadata
        if (profileError && profileError.code === "PGRST116") {
          const googleMeta = user.user_metadata;
          await supabase.from("profiles").insert({
            id: user.id,
            full_name: googleMeta?.full_name || googleMeta?.name || null,
            avatar_url: googleMeta?.avatar_url || googleMeta?.picture || null,
            profile_status: "incomplete",
          });
          return NextResponse.redirect(`${origin}/auth/complete-profile`);
        }

        // If profile is not yet complete (no username or still incomplete), go to onboarding
        if (!profile?.username || profile?.profile_status !== "complete") {
          return NextResponse.redirect(`${origin}/auth/complete-profile`);
        }

        // Profile is complete — go to the intended destination
        return NextResponse.redirect(`${origin}${next}`);
      }
    }

    // Exchange failed — show specific error
    const errMsg = exchangeError?.message || "OAuth authentication failed";
    return NextResponse.redirect(`${origin}/auth/login?error=${encodeURIComponent(errMsg)}`);
  }

  // No code provided
  return NextResponse.redirect(`${origin}/auth/login?error=${encodeURIComponent("No auth code received")}`);
}
