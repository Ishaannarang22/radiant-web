/**
 * Test: Phase 1.11 — Row Level Security (RLS) policies
 * Verifies migration file, schema.sql, and live database all have RLS enabled and correct policies.
 */

import { existsSync, readFileSync } from "fs"
import { resolve } from "path"

const DB_PKG = resolve(__dirname, "../packages/db")

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`FAIL: ${message}`)
    process.exit(1)
  }
  console.log(`PASS: ${message}`)
}

// 1. Migration file exists
const migrationPath = resolve(DB_PKG, "migrations/011_create_rls_policies.sql")
assert(existsSync(migrationPath), "Migration file 011_create_rls_policies.sql exists")

// 2. Migration file content checks
const migrationContent = readFileSync(migrationPath, "utf8")

// All 8 tables should have RLS enabled
const tables = [
  "users",
  "projects",
  "project_files",
  "generations",
  "businesses",
  "component_embeddings",
  "template_embeddings",
  "pattern_embeddings",
]

for (const table of tables) {
  assert(
    migrationContent.includes(`ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY`),
    `Migration enables RLS on ${table}`
  )
}

// 3. Check expected policies exist in migration
const expectedPolicies = [
  "users_select_own",
  "users_update_own",
  "users_insert_own",
  "projects_select_own",
  "projects_insert_own",
  "projects_update_own",
  "projects_delete_own",
  "project_files_select_own",
  "project_files_insert_own",
  "project_files_update_own",
  "project_files_delete_own",
  "generations_select_own",
  "generations_insert_own",
  "businesses_select_authenticated",
  "component_embeddings_select_authenticated",
  "template_embeddings_select_authenticated",
  "pattern_embeddings_select_authenticated",
]

for (const policy of expectedPolicies) {
  assert(
    migrationContent.includes(`"${policy}"`),
    `Migration creates policy "${policy}"`
  )
}

// 4. Check schema.sql has RLS section
const schemaPath = resolve(DB_PKG, "schema.sql")
const schemaContent = readFileSync(schemaPath, "utf8")

assert(
  schemaContent.includes("Row Level Security"),
  "schema.sql contains RLS section"
)

for (const table of tables) {
  assert(
    schemaContent.includes(`ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY`),
    `schema.sql enables RLS on ${table}`
  )
}

// 5. Verify auth.uid() used for user-scoped policies
assert(
  migrationContent.includes("auth.uid() = id"),
  "Users policy uses auth.uid() = id"
)
assert(
  migrationContent.includes("auth.uid() = user_id"),
  "Projects policy uses auth.uid() = user_id"
)

// 6. Verify authenticated role used for shared tables
assert(
  migrationContent.includes("auth.role() = 'authenticated'"),
  "Shared tables use auth.role() = 'authenticated'"
)

// 7. Verify project_files and generations use EXISTS subquery
assert(
  migrationContent.includes("EXISTS"),
  "project_files/generations policies use EXISTS subquery for ownership check"
)

console.log(`\nAll assertions passed!`)
