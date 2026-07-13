import { NextResponse } from "next/server";
import { usernameService } from "@/services/auth/usernameService";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json({ available: false, message: "Username is required." }, { status: 400 });
  }

  const result = await usernameService.checkAvailability(username);
  return NextResponse.json(result);
}
