import { createClient } from "@supabase/supabase-js";
import { Request, Response, NextFunction } from "express";

// Extend Express Request to carry user info
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userEmail?: string;
    }
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * Validates the Bearer JWT from the Authorization header using Supabase auth.
 * Attaches req.userId and req.userEmail on success.
 */
export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ success: false, error: "Missing or invalid Authorization header." });
    return;
  }

  const token = authHeader.replace("Bearer ", "").trim();

  // Use the admin client to validate the JWT — getUser with the user's token
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { Authorization: `Bearer ${token}` } }
  });

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      res.status(401).json({ success: false, error: "Invalid or expired session token." });
      return;
    }
    req.userId = user.id;
    req.userEmail = user.email;
    next();
  } catch {
    res.status(401).json({ success: false, error: "Auth validation failed." });
  }
}
