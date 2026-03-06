/**
 * Test: Phase 1.4 — project_files table created
 * Verifies migration file, schema.sql, and live database all have the project_files table.
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
const migrationPath = resolve(DB_PKG, "migrations/004_create_project_files.sql")
assert(existsSync(migrationPath), "Migration file 004_create_project_files.sql exists")

// 2. Migration file contains CREATE TABLE project_files
const migrationContent = readFileSync(migrationPath, "utf8")
assert(
  migrationContent.includes("CREATE TABLE project_files"),
  "Migration creates project_files table"
)

// 3. Migration has all required columns
const requiredColumns = [
  "id UUID",
  "project_id UUID",
  "file_path TEXT",
  "content TEXT",
  "file_type TEXT",
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

// 5. Migration has UNIQUE constraint on (project_id, file_path)
assert(
  migrationContent.includes("UNIQUE(project_id, file_path)"),
  "Migration has UNIQUE constraint on (project_id, file_path)"
)

// 6. Migration has NOT NULL on file_path and content
assert(
  migrationContent.includes("file_path TEXT NOT NULL"),
  "Migration has NOT NULL on file_path"
)
assert(
  migrationContent.includes("content TEXT NOT NULL"),
  "Migration has NOT NULL on content"
)

// 7. schema.sql includes project_files table
const schemaContent = readFileSync(resolve(DB_PKG, "schema.sql"), "utf8")
assert(
  schemaContent.includes("CREATE TABLE project_files"),
  "schema.sql includes project_files table"
)

// 8. schema.sql has all required columns
for (const col of requiredColumns) {
  assert(
    schemaContent.includes(col),
    `schema.sql includes column: ${col}`
  )
}

console.log("\nAll project_files table tests passed!")
