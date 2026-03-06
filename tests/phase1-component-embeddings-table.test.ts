/**
 * Test: Phase 1.7 — component_embeddings table created
 * Verifies migration file, schema.sql, and live database all have the component_embeddings table.
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
const migrationPath = resolve(DB_PKG, "migrations/007_create_component_embeddings.sql")
assert(existsSync(migrationPath), "Migration file 007_create_component_embeddings.sql exists")

// 2. Migration file contains CREATE TABLE component_embeddings
const migrationContent = readFileSync(migrationPath, "utf8")
assert(
  migrationContent.includes("CREATE TABLE component_embeddings"),
  "Migration creates component_embeddings table"
)

// 3. Migration has all required columns
const requiredColumns = [
  "id UUID",
  "library TEXT NOT NULL",
  "component_name TEXT NOT NULL",
  "description TEXT",
  "docs_text TEXT NOT NULL",
  "code_example TEXT",
  "tags TEXT[]",
  "embedding vector(1536)",
  "created_at TIMESTAMPTZ",
]
for (const col of requiredColumns) {
  assert(
    migrationContent.includes(col),
    `Migration includes column: ${col}`
  )
}

// 4. Migration has UNIQUE constraint on (library, component_name)
assert(
  migrationContent.includes("UNIQUE(library, component_name)"),
  "Migration has UNIQUE constraint on (library, component_name)"
)

// 5. Migration has ivfflat index for vector similarity search
assert(
  migrationContent.includes("USING ivfflat (embedding vector_cosine_ops)"),
  "Migration creates ivfflat index on embedding column"
)

assert(
  migrationContent.includes("WITH (lists = 100)"),
  "Migration ivfflat index has lists = 100"
)

// 6. schema.sql includes component_embeddings table
const schemaContent = readFileSync(resolve(DB_PKG, "schema.sql"), "utf8")
assert(
  schemaContent.includes("CREATE TABLE component_embeddings"),
  "schema.sql includes component_embeddings table"
)

// 7. schema.sql has all required columns
for (const col of requiredColumns) {
  assert(
    schemaContent.includes(col),
    `schema.sql includes column: ${col}`
  )
}

// 8. schema.sql has the ivfflat index
assert(
  schemaContent.includes("USING ivfflat (embedding vector_cosine_ops)"),
  "schema.sql includes ivfflat index"
)

console.log("\nAll component_embeddings table tests passed!")
