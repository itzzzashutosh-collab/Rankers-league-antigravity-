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

// ─────────────────────────────────────────────────────────────────────────────
// TESTING PHASE TOGGLE
// Set to true to disable all auth walls & login redirects for seamless testing.
// Re-activate by setting to false when ready for production deployment.
// ─────────────────────────────────────────────────────────────────────────────
const TESTING_MODE = true;

export async function middleware(request: NextRequest) {
  if (TESTING_MODE) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  // Always allow OAuth callback and public assets through
  if (PUBLIC_PASSTHROUGH.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const demoCookie = request.cookies.get("demo_user");
  const isDemoUser = !!demoCookie;

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

  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data?.user || null;
  } catch {
    // Graceful fallback when remote Supabase network fetch fails
  }

  const isAuthenticated = !!user || isDemoUser;
  // Redirect unauthenticated users away from protected routes
  if (PROTECTED_ROUTES.some((r) => pathname.startsWith(r)) && !isAuthenticated) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth-only routes
  if (AUTH_ONLY_ROUTES.some((r) => pathname === r) && isAuthenticated && !isDemoUser) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
