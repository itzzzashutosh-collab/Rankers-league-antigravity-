import pg from "pg";
import fs from "fs";
import path from "path";

const connectionString = "postgresql://postgres:HjQFUHGBFBk4dVog@db.bgsdovlumtjwvcwzjnnn.supabase.co:5432/postgres";

async function run() {
  const client = new pg.Client({ connectionString });
  
  try {
    await client.connect();
    console.log("Connected to Supabase PostgreSQL instance successfully.");

    // 1. Inspect existing tables
    const tableRes = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE';
    `);
    const tables = tableRes.rows.map(r => r.table_name);
    console.log("Existing tables found:", tables);

    // 2. Inspect existing views
    const viewRes = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'VIEW';
    `);
    const views = viewRes.rows.map(r => r.table_name);
    console.log("Existing views found:", views);

    // 3. Inspect custom types (enums)
    const typeRes = await client.query(`
      SELECT t.typname 
      FROM pg_type t 
      JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace 
      WHERE n.nspname = 'public' 
      AND t.typtype = 'e';
    `);
    const types = typeRes.rows.map(r => r.typname);
    console.log("Existing custom types (enums) found:", types);

    // 4. Inspect custom functions
    const funcRes = await client.query(`
      SELECT p.proname, pg_catalog.pg_get_function_identity_arguments(p.oid) as args
      FROM pg_catalog.pg_proc p
      JOIN pg_catalog.pg_namespace n ON n.oid = p.pronamespace
      WHERE n.nspname = 'public';
    `);
    const functions = funcRes.rows;
    console.log("Existing functions found:", functions.map(f => f.proname));

    // 5. Drop all views
    for (const view of views) {
      console.log(`Dropping VIEW "${view}"...`);
      await client.query(`DROP VIEW IF EXISTS "${view}" CASCADE;`);
    }

    // 6. Drop all tables
    for (const table of tables) {
      console.log(`Dropping TABLE "${table}"...`);
      await client.query(`DROP TABLE IF EXISTS "${table}" CASCADE;`);
    }

    // 7. Drop all custom types
    for (const type of types) {
      console.log(`Dropping TYPE "${type}"...`);
      await client.query(`DROP TYPE IF EXISTS "${type}" CASCADE;`);
    }

    // 8. Drop all functions
    for (const func of functions) {
      console.log(`Dropping FUNCTION "${func.proname}(${func.args})"...`);
      await client.query(`DROP FUNCTION IF EXISTS "${func.proname}"(${func.args}) CASCADE;`);
    }

    console.log("\n[OK] All tables, views, types, and functions dropped successfully.");

    // 9. Rebuild schemas
    console.log("Rebuilding schemas from database/schemas/01_platform_records.sql...");
    const schemaSql = fs.readFileSync(path.resolve("database/schemas/01_platform_records.sql"), "utf8");
    await client.query(schemaSql);
    console.log("[OK] Created schemas, tables, and types.");

    // 10. Enable Row-Level Security
    console.log("Setting Row-Level Security from database/policies/02_security_policies.sql...");
    const policiesSql = fs.readFileSync(path.resolve("database/policies/02_security_policies.sql"), "utf8");
    await client.query(policiesSql);
    console.log("[OK] Enabled RLS policies.");

    // 11. Recreate calculation helpers
    console.log("Creating database helper functions from database/functions/03_calculation_helpers.sql...");
    const functionsSql = fs.readFileSync(path.resolve("database/functions/03_calculation_helpers.sql"), "utf8");
    await client.query(functionsSql);
    console.log("[OK] Created percentiles helper function.");

    // 12. Seed data
    console.log("Seeding initial championship listings from database/seed/04_seed_data.sql...");
    const seedSql = fs.readFileSync(path.resolve("database/seed/04_seed_data.sql"), "utf8");
    await client.query(seedSql);
    console.log("[OK] Seeded initial data.");

    console.log("\nSupabase database completely purged and rebuilt successfully!");
  } catch (error) {
    console.error("Database operation failed:", error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
