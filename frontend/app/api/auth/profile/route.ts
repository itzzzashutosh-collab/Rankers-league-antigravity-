import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { usernameService } from "@/services/auth/usernameService";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { username } = body;

  if (!username) return NextResponse.json({ error: "Username required." }, { status: 400 });

  // Check if username is already registered for this user
  const existing = await supabase
    .from("usernames")
    .select("username")
    .eq("user_id", user.id)
    .single();

  if (!existing.data) {
    // Reserve the username
    const reserveResult = await usernameService.reserveUsername(user.id, username);
    if (reserveResult.error) {
      return NextResponse.json({ error: reserveResult.error }, { status: 400 });
    }
  }

  // Register participant identity if not already done
  const identityCheck = await supabase
    .from("participant_identity")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!identityCheck.data) {
    const identityResult = await usernameService.registerIdentity(user.id, username);
    if (identityResult.error) {
      return NextResponse.json({ error: identityResult.error }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true });
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return NextResponse.json({ profile });
}

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { error } = await supabase
    .from("profiles")
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq("id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
