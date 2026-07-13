import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://db.bgsdovlumtjwvcwzjnnn.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnc2Rvdmx1bXRqd3Zjd3pqbm5uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjA3MTM2MDAsImV4cCI6MjAzNjI4OTYwMH0.mock-key";

export const createClient = () =>
  createBrowserClient(
    supabaseUrl!,
    supabaseKey!
  );
