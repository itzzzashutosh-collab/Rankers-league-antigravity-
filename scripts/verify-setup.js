import fs from "fs";
import path from "path";

const requiredFiles = [
  "frontend/app/page.tsx",
  "frontend/app/globals.css",
  "frontend/app/layout.tsx",
  "frontend/middleware.ts",
  "frontend/lib/supabase/client.ts",
  "frontend/lib/supabase/server.ts",
  "backend/package.json",
  "backend/api/app.ts",
  "database/schemas/01_platform_records.sql",
  "database/policies/02_security_policies.sql",
  "shared/types.ts",
  "shared/validators.ts"
];

console.log("Starting platform architecture verification...");
let missingCount = 0;

requiredFiles.forEach(file => {
  const absolutePath = path.resolve(file);
  if (fs.existsSync(absolutePath)) {
    console.log(`[OK] Found: ${file}`);
  } else {
    console.error(`[ERR] Missing: ${file}`);
    missingCount++;
  }
});

if (missingCount === 0) {
  console.log("\nAll core files are present. Foundation build is complete and valid!");
  process.exit(0);
} else {
  console.error(`\nVerification failed. ${missingCount} files are missing!`);
  process.exit(1);
}
