import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { sessionService } from "@/services/auth/sessionService";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const sessions = await sessionService.getActiveSessions(user.id);
  return NextResponse.json({ sessions });
}

export async function DELETE(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("id");
  const logoutAll = searchParams.get("all") === "true";

  if (logoutAll) {
    const result = await sessionService.logoutAllSessions(user.id);
    if (result.error) return NextResponse.json({ error: result.error }, { status: 500 });
    // Also sign out from Supabase auth
    await supabase.auth.signOut();
    return NextResponse.json({ success: true });
  }

  if (!sessionId) {
    return NextResponse.json({ error: "Session ID required." }, { status: 400 });
  }

  const result = await sessionService.logoutSession(sessionId, user.id);
  if (result.error) return NextResponse.json({ error: result.error }, { status: 500 });
  return NextResponse.json({ success: true });
}
