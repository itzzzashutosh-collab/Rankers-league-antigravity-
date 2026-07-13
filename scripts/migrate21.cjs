const { Client } = require("pg");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) { console.error("DATABASE_URL missing"); process.exit(1); }

const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });

async function run() {
  console.log("Connecting to Supabase for Participant Management Migration...");
  await client.connect();
  const sql = fs.readFileSync(path.resolve(__dirname, "../database/schemas/21_participants.sql"), "utf-8");
  try {
    await client.query(sql);
    console.log("✅ 21_participants.sql executed successfully.");
  } catch (err) { console.error("⚠️ Error:", err.message); }
  try {
    await client.query("NOTIFY pgrst, 'reload schema';");
    console.log("✅ PostgREST schema cache reloaded.");
  } catch (err) { console.warn("⚠️ Reload failed:", err.message); }
  await client.end();
  console.log("Migration complete.");
}
run().catch(err => { console.error("Fatal:", err); process.exit(1); });
