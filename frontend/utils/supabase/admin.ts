import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const safeFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  try {
    return await fetch(input, init);
  } catch {
    return new Response(
      JSON.stringify({ error: { message: "Supabase cloud offline" } }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }
};

// Admin client — NEVER use on the client side. Server-side only.
// Bypasses RLS for admin operations like username availability checks.
export const createAdminClient = () =>
  createSupabaseClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    global: {
      fetch: safeFetch,
    },
  });
