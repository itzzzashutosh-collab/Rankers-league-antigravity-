import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { notificationService } from "@/services/auth/notificationService";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, action } = await req.json();
    if (!id || !action) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    let success = false;
    if (action === "read") {
      success = await notificationService.markAsRead(user.id, id);
    } else if (action === "archive") {
      success = await notificationService.archiveNotification(user.id, id);
    } else if (action === "delete") {
      success = await notificationService.deleteNotification(user.id, id);
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json({ success });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
