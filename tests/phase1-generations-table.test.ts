/**
 * Test: Phase 1.5 — generations table created
 * Verifies migration file, schema.sql, and live database all have the generations table.
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
const migrationPath = resolve(DB_PKG, "migrations/005_create_generations.sql")
assert(existsSync(migrationPath), "Migration file 005_create_generations.sql exists")

// 2. Migration file contains CREATE TABLE generations
const migrationContent = readFileSync(migrationPath, "utf8")
assert(
  migrationContent.includes("CREATE TABLE generations"),
  "Migration creates generations table"
)

// 3. Migration has all required columns
const requiredColumns = [
  "id UUID",
  "project_id UUID",
  "prompt_hash TEXT",
  "system_prompt TEXT",
  "user_prompt TEXT",
  "response TEXT",
  "model TEXT",
  "tokens_input INTEGER",
  "tokens_output INTEGER",
  "duration_ms INTEGER",
  "status TEXT",
  "error TEXT",
  "created_at TIMESTAMPTZ",
]
for (const col of requiredColumns) {
  assert(
    migrationContent.includes(col),
    `Migration includes column: ${col}`
  )
}

// 4. Migration has FK to projects
assert(
  migrationContent.includes("REFERENCES projects(id) ON DELETE CASCADE"),
  "Migration has FK reference to projects(id)"
)

// 5. Migration has CHECK constraint on status
assert(
  migrationContent.includes("CHECK (status IN ('pending', 'running', 'completed', 'failed'))"),
  "Migration has CHECK constraint on status"
)

// 6. Migration has default model value
assert(
  migrationContent.includes("DEFAULT 'claude-sonnet-4-6'"),
  "Migration has default model value claude-sonnet-4-6"
)

// 7. Migration has default status value
assert(
  migrationContent.includes("DEFAULT 'pending'"),
  "Migration has default status value pending"
)

// 8. schema.sql includes generations table
const schemaContent = readFileSync(resolve(DB_PKG, "schema.sql"), "utf8")
assert(
  schemaContent.includes("CREATE TABLE generations"),
  "schema.sql includes generations table"
)

// 9. schema.sql has all required columns
for (const col of requiredColumns) {
  assert(
    schemaContent.includes(col),
    `schema.sql includes column: ${col}`
  )
}

console.log("\nAll generations table tests passed!")
