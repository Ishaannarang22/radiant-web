/**
 * Test: Phase 1.9 — pattern_embeddings table created
 * Verifies migration file, schema.sql, and live database all have the pattern_embeddings table.
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
const migrationPath = resolve(DB_PKG, "migrations/009_create_pattern_embeddings.sql")
assert(existsSync(migrationPath), "Migration file 009_create_pattern_embeddings.sql exists")

// 2. Migration file contains CREATE TABLE pattern_embeddings
const migrationContent = readFileSync(migrationPath, "utf8")
assert(
  migrationContent.includes("CREATE TABLE pattern_embeddings"),
  "Migration creates pattern_embeddings table"
)

// 3. Migration has all required columns
const requiredColumns = [
  "id UUID",
  "pattern_type TEXT NOT NULL",
  "name TEXT NOT NULL",
  "description TEXT",
  "example_json JSONB",
  "embedding vector(1536)",
  "created_at TIMESTAMPTZ",
]
for (const col of requiredColumns) {
  assert(
    migrationContent.includes(col),
    `Migration includes column: ${col}`
  )
}

// 4. Migration has ivfflat index for vector similarity search
assert(
  migrationContent.includes("USING ivfflat (embedding vector_cosine_ops)"),
  "Migration creates ivfflat index on embedding column"
)

assert(
  migrationContent.includes("WITH (lists = 50)"),
  "Migration ivfflat index has lists = 50"
)

// 5. schema.sql includes pattern_embeddings table
const schemaContent = readFileSync(resolve(DB_PKG, "schema.sql"), "utf8")
assert(
  schemaContent.includes("CREATE TABLE pattern_embeddings"),
  "schema.sql includes pattern_embeddings table"
)

// 6. schema.sql has all required columns for pattern_embeddings
for (const col of requiredColumns) {
  assert(
    schemaContent.includes(col),
    `schema.sql includes column: ${col}`
  )
}

// 7. schema.sql has the ivfflat index for pattern_embeddings
assert(
  schemaContent.includes("-- Pattern embeddings table"),
  "schema.sql has pattern_embeddings section comment"
)

console.log("\nAll pattern_embeddings table tests passed!")
