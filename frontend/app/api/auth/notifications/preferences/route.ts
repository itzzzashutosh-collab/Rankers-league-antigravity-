import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { notificationService } from "@/services/auth/notificationService";

export async function PATCH(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const success = await notificationService.updatePreferences(user.id, body);
    return NextResponse.json({ success });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
