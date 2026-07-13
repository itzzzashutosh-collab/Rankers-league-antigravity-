import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
import { createServerClient } from "@supabase/ssr";

// Routes that strictly require a logged-in user
const PROTECTED_ROUTES = [
  "/auth/complete-profile",
  "/auth/verify-otp",
  "/profile/settings",
  "/dashboard",
];

// Auth-only routes: logged-in users with a COMPLETE profile should be redirected away
const AUTH_ONLY_ROUTES = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-access",
];

// Routes to skip completely (OAuth callback, static assets, etc.)
const PUBLIC_PASSTHROUGH = ["/auth/callback"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always allow OAuth callback and public assets through
  if (PUBLIC_PASSTHROUGH.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // First refresh the session
  const response = await updateSession(request);

  // Build supabase client to check session
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll() {},
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect unauthenticated users away from protected routes
  if (PROTECTED_ROUTES.some((r) => pathname.startsWith(r)) && !user) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth-only routes
  // (only if their profile is complete; otherwise let them through to complete it)
  if (AUTH_ONLY_ROUTES.some((r) => pathname === r) && user) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
