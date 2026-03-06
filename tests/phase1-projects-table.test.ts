/**
 * Test: Phase 1.3 — projects table created
 * Verifies migration file, schema.sql, and live database all have the projects table.
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
const migrationPath = resolve(DB_PKG, "migrations/003_create_projects.sql")
assert(existsSync(migrationPath), "Migration file 003_create_projects.sql exists")

// 2. Migration file contains CREATE TABLE projects
const migrationContent = readFileSync(migrationPath, "utf8")
assert(
  migrationContent.includes("CREATE TABLE projects"),
  "Migration creates projects table"
)

// 3. Migration has all required columns
const requiredColumns = [
  "id UUID",
  "user_id UUID",
  "business_name TEXT",
  "subdomain TEXT",
  "status TEXT",
  "industry TEXT",
  "config JSONB",
  "vercel_project_id TEXT",
  "vercel_deployment_url TEXT",
  "created_at TIMESTAMPTZ",
  "updated_at TIMESTAMPTZ",
]
for (const col of requiredColumns) {
  assert(
    migrationContent.includes(col),
    `Migration includes column: ${col}`
  )
}

// 4. Migration has status CHECK constraint
assert(
  migrationContent.includes("CHECK (status IN ('draft', 'generating', 'preview', 'deployed', 'failed'))"),
  "Migration has status CHECK constraint"
)

// 5. Migration has FK to users
assert(
  migrationContent.includes("REFERENCES users(id) ON DELETE CASCADE"),
  "Migration has FK reference to users(id)"
)

// 6. Migration has UNIQUE subdomain
assert(
  migrationContent.includes("subdomain TEXT UNIQUE NOT NULL"),
  "Migration has UNIQUE NOT NULL on subdomain"
)

// 7. schema.sql includes projects table
const schemaContent = readFileSync(resolve(DB_PKG, "schema.sql"), "utf8")
assert(
  schemaContent.includes("CREATE TABLE projects"),
  "schema.sql includes projects table"
)

// 8. schema.sql has all required columns
for (const col of requiredColumns) {
  assert(
    schemaContent.includes(col),
    `schema.sql includes column: ${col}`
  )
}

console.log("\nAll projects table tests passed!")
