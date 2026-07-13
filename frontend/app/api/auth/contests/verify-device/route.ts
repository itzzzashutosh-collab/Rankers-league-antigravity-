import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { contestRegistrationService } from "@/services/auth/contestRegistrationService";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { action, contestId, plainCode, fingerprint, deviceName } = await req.json();

    if (action === "send_code") {
      if (!contestId) {
        return NextResponse.json({ error: "Missing contestId" }, { status: 400 });
      }
      const code = await contestRegistrationService.generateVerificationCode(user.id, contestId);
      // Simulate SMS/WhatsApp log
      console.log(`[SIMULATION SMS/WHATSAPP] Sent code "${code}" to registered mobile number for user: ${user.id}`);
      return NextResponse.json({ success: true, code }); // Return code to allow UI client simulation bypass
    }

    if (action === "verify_code") {
      if (!contestId || !plainCode || !fingerprint || !deviceName) {
        return NextResponse.json({ error: "Missing verification credentials parameters" }, { status: 400 });
      }
      const success = await contestRegistrationService.verifyDeviceCode(
        user.id,
        contestId,
        plainCode,
        fingerprint,
        deviceName
      );
      return NextResponse.json({ success });
    }

    if (action === "check_device") {
      if (!fingerprint) {
        return NextResponse.json({ error: "Missing fingerprint" }, { status: 400 });
      }
      const trusted = await contestRegistrationService.isDeviceTrusted(user.id, fingerprint);
      return NextResponse.json({ trusted });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
