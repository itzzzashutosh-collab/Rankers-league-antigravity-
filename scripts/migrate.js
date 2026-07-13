import pg from "pg";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

// Load root env
dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("Error: DATABASE_URL environment variable is missing.");
  process.exit(1);
}

const client = new pg.Client({
  connectionString,
  ssl: { rejectUnauthorized: false } // Required for Supabase external postgres connections
});

const migrationFiles = [
  // Schemas
  "database/schemas/01_platform_records.sql",
  "database/schemas/02_exam_and_results.sql",
  "database/schemas/03_auth_and_profiles.sql",
  "database/schemas/04_dashboard.sql",
  "database/schemas/05_add_phone_to_profiles.sql",
  "database/schemas/06_drop_not_null_contest_id.sql",
  "database/schemas/07_performance_intelligence.sql",
  // Policies
  "database/policies/02_security_policies.sql",
  "database/policies/03_rls_auth_policies.sql",
  "database/policies/04_dashboard_rls.sql",
  // Seeds
  "database/seed/04_seed_data.sql",
  "database/seed/05_contest_results_seed.sql",
  "database/seed/06_dashboard_seed.sql",
  "database/seed/08_performance_seed.sql"
];



async function run() {
  console.log("Connecting to Supabase PostgreSQL database...");
  await client.connect();
  console.log("Connected successfully!");

  for (const relativePath of migrationFiles) {
    const fullPath = path.resolve(relativePath);
    console.log(`\n--------------------------------------------`);
    console.log(`Running file: ${relativePath}`);
    
    if (!fs.existsSync(fullPath)) {
      console.warn(`Warning: File ${relativePath} does not exist. Skipping.`);
      continue;
    }

    const sql = fs.readFileSync(fullPath, "utf-8");
    try {
      // Execute the SQL statements
      await client.query(sql);
      console.log(`✅ Success: ${relativePath} executed successfully.`);
    } catch (err) {
      // If table already exists, continue. Otherwise throw or log.
      if (err.message.includes("already exists")) {
        console.log(`ℹ️ Info: Skipping elements in ${relativePath} that already exist.`);
      } else {
        console.warn(`⚠️ Warning in ${relativePath}:`, err.message);
      }
    }
  }

  // Force PostgREST reload
  try {
    console.log("\nReloading PostgREST Schema Cache...");
    await client.query("NOTIFY pgrst, 'reload schema';");
    console.log("✅ PostgREST schema cache reloaded!");
  } catch (err) {
    console.warn("⚠️ Failed to reload schema cache:", err.message);
  }

  await client.end();
  console.log("\nMigration completed!");
}

run().catch(err => {
  console.error("Fatal Error running migrations:", err);
  process.exit(1);
});
