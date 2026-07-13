import { createClient } from "@/utils/supabase/client";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

/**
 * Typed fetch helper that calls the Express backend.
 * Automatically attaches the Supabase Bearer token to every request.
 */
export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  // Get the current Supabase session token (client-side)
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BACKEND_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error || `Backend request failed: ${response.status}`);
  }

  return data as T;
}

/**
 * GET helper
 */
export const apiGet = <T = unknown>(path: string) => apiFetch<T>(path, { method: "GET" });

/**
 * POST helper
 */
export const apiPost = <T = unknown>(path: string, body: unknown) =>
  apiFetch<T>(path, {
    method: "POST",
    body: JSON.stringify(body),
  });

/**
 * PATCH helper
 */
export const apiPatch = <T = unknown>(path: string, body: unknown) =>
  apiFetch<T>(path, {
    method: "PATCH",
    body: JSON.stringify(body),
  });

/**
 * DELETE helper
 */
export const apiDelete = <T = unknown>(path: string) =>
  apiFetch<T>(path, { method: "DELETE" });

export { BACKEND_URL };
