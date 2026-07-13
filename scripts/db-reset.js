import pg from "pg";
import fs from "fs";
import path from "path";

const connectionString = "postgresql://postgres:HjQFUHGBFBk4dVog@db.bgsdovlumtjwvcwzjnnn.supabase.co:5432/postgres";

async function run() {
  const client = new pg.Client({ connectionString });
  
  try {
    await client.connect();
    console.log("Connected to Supabase PostgreSQL instance successfully.");

    console.log("Clearing previous database structures...");
    await client.query(`
      DROP TABLE IF EXISTS standings CASCADE;
      DROP TABLE IF EXISTS championships CASCADE;
      DROP TABLE IF EXISTS aspirants CASCADE;
      DROP TYPE IF EXISTS league_status CASCADE;
      DROP TYPE IF EXISTS calibration_tier CASCADE;
      DROP TYPE IF EXISTS audit_status CASCADE;
      DROP FUNCTION IF EXISTS refresh_league_percentiles CASCADE;
    `);
    console.log("[OK] Cleared tables, types, and functions.");

    console.log("Rebuilding schemas from database/schemas/01_platform_records.sql...");
    const schemaSql = fs.readFileSync(path.resolve("database/schemas/01_platform_records.sql"), "utf8");
    await client.query(schemaSql);
    console.log("[OK] Created schemas, tables, and types.");

    console.log("Setting Row-Level Security from database/policies/02_security_policies.sql...");
    const policiesSql = fs.readFileSync(path.resolve("database/policies/02_security_policies.sql"), "utf8");
    await client.query(policiesSql);
    console.log("[OK] Enabled RLS policies.");

    console.log("Creating database helper functions from database/functions/03_calculation_helpers.sql...");
    const functionsSql = fs.readFileSync(path.resolve("database/functions/03_calculation_helpers.sql"), "utf8");
    await client.query(functionsSql);
    console.log("[OK] Created percentiles helper function.");

    console.log("Seeding initial championship listings from database/seed/04_seed_data.sql...");
    const seedSql = fs.readFileSync(path.resolve("database/seed/04_seed_data.sql"), "utf8");
    await client.query(seedSql);
    console.log("[OK] Seeded initial data.");

    console.log("\nDatabase reset and rebuild completed successfully!");
  } catch (error) {
    console.error("Database operation failed:", error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
