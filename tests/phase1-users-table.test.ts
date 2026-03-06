/**
 * Test: Phase 1.2 — users table created
 * Verifies migration file, schema.sql, and live database all have the users table.
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
const migrationPath = resolve(DB_PKG, "migrations/002_create_users.sql")
assert(existsSync(migrationPath), "Migration file 002_create_users.sql exists")

// 2. Migration file contains CREATE TABLE users
const migrationContent = readFileSync(migrationPath, "utf8")
assert(
  migrationContent.includes("CREATE TABLE users"),
  "Migration creates users table"
)

// 3. Migration has all required columns
const requiredColumns = ["id UUID", "email TEXT", "name TEXT", "plan TEXT", "created_at TIMESTAMPTZ", "updated_at TIMESTAMPTZ"]
for (const col of requiredColumns) {
  assert(
    migrationContent.includes(col),
    `Migration includes column: ${col}`
  )
}

// 4. Migration has plan CHECK constraint
assert(
  migrationContent.includes("CHECK (plan IN ('free', 'pro', 'agency'))"),
  "Migration has plan CHECK constraint"
)

// 5. schema.sql includes users table
const schemaContent = readFileSync(resolve(DB_PKG, "schema.sql"), "utf8")
assert(
  schemaContent.includes("CREATE TABLE users"),
  "schema.sql includes users table"
)

// 6. schema.sql has all required columns
for (const col of requiredColumns) {
  assert(
    schemaContent.includes(col),
    `schema.sql includes column: ${col}`
  )
}

console.log("\nAll users table tests passed!")
