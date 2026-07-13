import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {
      db?: SupabaseClient;
    }
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Single shared admin client — bypasses all RLS
const adminClient = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

/**
 * Attaches the Supabase admin client to every request as req.db
 */
export function attachDb(req: Request, _res: Response, next: NextFunction): void {
  req.db = adminClient;
  next();
}

export { adminClient };
