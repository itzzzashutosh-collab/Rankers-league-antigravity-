import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { notificationService } from "@/services/auth/notificationService";

export async function POST() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const success = await notificationService.markAllAsRead(user.id);
    return NextResponse.json({ success });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
