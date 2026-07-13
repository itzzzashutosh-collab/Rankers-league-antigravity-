const { Client } = require("pg");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("Error: DATABASE_URL environment variable is missing.");
  process.exit(1);
}

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  console.log("Connecting to Supabase PostgreSQL database for Admin Panel Migration...");
  await client.connect();
  console.log("Connected successfully!");

  const sqlPath = path.resolve(__dirname, "../database/schemas/15_admin_panel.sql");
  if (!fs.existsSync(sqlPath)) {
    console.error("Migration file not found:", sqlPath);
    process.exit(1);
  }

  const sql = fs.readFileSync(sqlPath, "utf-8");

  try {
    console.log("Executing 15_admin_panel.sql...");
    await client.query(sql);
    console.log("✅ Success: Admin schema migration executed successfully.");
  } catch (err) {
    console.error("⚠️ Migration execution error:", err.message);
  }

  try {
    console.log("Reloading PostgREST Schema Cache...");
    await client.query("NOTIFY pgrst, 'reload schema';");
    console.log("✅ PostgREST schema cache reloaded!");
  } catch (err) {
    console.warn("⚠️ Failed to reload schema cache:", err.message);
  }

  await client.end();
  console.log("Migration finished!");
}

run().catch(err => {
  console.error("Fatal Error running Admin migration:", err);
  process.exit(1);
});
