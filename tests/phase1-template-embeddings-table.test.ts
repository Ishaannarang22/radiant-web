/**
 * Test: Phase 1.8 — template_embeddings table created
 * Verifies migration file, schema.sql, and live database all have the template_embeddings table.
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
const migrationPath = resolve(DB_PKG, "migrations/008_create_template_embeddings.sql")
assert(existsSync(migrationPath), "Migration file 008_create_template_embeddings.sql exists")

// 2. Migration file contains CREATE TABLE template_embeddings
const migrationContent = readFileSync(migrationPath, "utf8")
assert(
  migrationContent.includes("CREATE TABLE template_embeddings"),
  "Migration creates template_embeddings table"
)

// 3. Migration has all required columns
const requiredColumns = [
  "id UUID",
  "industry TEXT NOT NULL",
  "section_type TEXT NOT NULL",
  "description TEXT",
  "template_json JSONB NOT NULL",
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

// 5. schema.sql includes template_embeddings table
const schemaContent = readFileSync(resolve(DB_PKG, "schema.sql"), "utf8")
assert(
  schemaContent.includes("CREATE TABLE template_embeddings"),
  "schema.sql includes template_embeddings table"
)

// 6. schema.sql has all required columns
for (const col of requiredColumns) {
  assert(
    schemaContent.includes(col),
    `schema.sql includes column: ${col}`
  )
}

// 7. schema.sql has the ivfflat index for template_embeddings
assert(
  schemaContent.includes("WITH (lists = 50)"),
  "schema.sql includes ivfflat index with lists = 50"
)

console.log("\nAll template_embeddings table tests passed!")
