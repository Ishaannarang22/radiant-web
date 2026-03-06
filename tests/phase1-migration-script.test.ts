/**
 * Tests for task 1.12 — Write migration script
 * Verifies: schema.sql is complete, scripts/setup-supabase.ts exists,
 * migration files are present, and the script runs successfully.
 */

import { execSync } from "child_process"
import { existsSync, readFileSync, readdirSync } from "fs"
import { join } from "path"
import assert from "assert"

const ROOT = join(__dirname, "..")
const SCHEMA_PATH = join(ROOT, "packages", "db", "schema.sql")
const MIGRATIONS_DIR = join(ROOT, "packages", "db", "migrations")
const SCRIPT_PATH = join(ROOT, "scripts", "setup-supabase.ts")

// 1. schema.sql exists and is comprehensive
assert.ok(existsSync(SCHEMA_PATH), "schema.sql should exist")
const schemaContent = readFileSync(SCHEMA_PATH, "utf-8")
console.log("PASS: schema.sql exists")

// 2. schema.sql contains all 8 tables
const expectedTables = [
  "users",
  "projects",
  "project_files",
  "generations",
  "businesses",
  "component_embeddings",
  "template_embeddings",
  "pattern_embeddings",
]
for (const table of expectedTables) {
  assert.ok(
    schemaContent.includes(`CREATE TABLE ${table}`),
    `schema.sql should contain CREATE TABLE ${table}`
  )
}
console.log("PASS: schema.sql contains all 8 table definitions")

// 3. schema.sql contains helper functions
const expectedFunctions = ["match_components", "match_templates", "match_patterns"]
for (const fn of expectedFunctions) {
  assert.ok(
    schemaContent.includes(`FUNCTION ${fn}`),
    `schema.sql should contain FUNCTION ${fn}`
  )
}
console.log("PASS: schema.sql contains all 3 helper functions")

// 4. schema.sql contains RLS policies
assert.ok(
  schemaContent.includes("ENABLE ROW LEVEL SECURITY"),
  "schema.sql should contain RLS policies"
)
console.log("PASS: schema.sql contains RLS policies")

// 5. scripts/setup-supabase.ts exists
assert.ok(existsSync(SCRIPT_PATH), "scripts/setup-supabase.ts should exist")
console.log("PASS: scripts/setup-supabase.ts exists")

// 6. Script contains key functionality
const scriptContent = readFileSync(SCRIPT_PATH, "utf-8")
assert.ok(
  scriptContent.includes("SUPABASE_SERVICE_ROLE_KEY"),
  "Script should use service role key"
)
assert.ok(
  scriptContent.includes("createClient"),
  "Script should create a Supabase client"
)
assert.ok(
  scriptContent.includes("verifyTable"),
  "Script should verify tables"
)
assert.ok(
  scriptContent.includes("verifyFunction"),
  "Script should verify functions"
)
console.log("PASS: setup-supabase.ts has correct structure")

// 7. All 11 migration files exist
const migrationFiles = readdirSync(MIGRATIONS_DIR)
  .filter((f) => f.endsWith(".sql"))
  .sort()
assert.strictEqual(migrationFiles.length, 11, "Should have 11 migration files")
console.log("PASS: All 11 migration files present")

// 8. Migration files are numbered correctly
for (let i = 1; i <= 11; i++) {
  const prefix = String(i).padStart(3, "0")
  const hasFile = migrationFiles.some((f) => f.startsWith(prefix))
  assert.ok(hasFile, `Migration ${prefix}_*.sql should exist`)
}
console.log("PASS: Migration files are numbered 001-011")

// 9. Run the script and verify it succeeds
try {
  const output = execSync("npx tsx scripts/setup-supabase.ts", {
    cwd: ROOT,
    timeout: 30000,
    encoding: "utf-8",
  })
  assert.ok(output.includes("SUCCESS"), "Script should output SUCCESS")
  assert.ok(output.includes("11 checks passed"), "Script should pass all 11 checks")
  assert.ok(output.includes("Tables: 8/8 OK"), "All 8 tables should be verified")
  assert.ok(output.includes("Functions: 3/3 OK"), "All 3 functions should be verified")
  console.log("PASS: setup-supabase.ts runs successfully and verifies all tables/functions")
} catch (err: unknown) {
  const error = err as { stderr?: string; stdout?: string }
  console.error("Script output:", error.stdout)
  console.error("Script error:", error.stderr)
  assert.fail("setup-supabase.ts should run without errors")
}

console.log("\nAll tests passed! (9/9)")
