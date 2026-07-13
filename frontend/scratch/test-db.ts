import { createAdminClient } from "../utils/supabase/admin";

async function test() {
  const admin = createAdminClient();
  const username = "testuser";
  const { data, error } = await admin
    .from("usernames")
    .select("username")
    .eq("username", username)
    .single();

  console.log("data:", data);
  console.log("error:", error);
}

test();
