/**
 * Test: Phase 1.1 — pgvector extension enabled
 * Verifies migration file and schema.sql are set up for pgvector.
 * Live database verification done via Supabase MCP (confirmed vector 0.8.0 installed).
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
const migrationPath = resolve(DB_PKG, "migrations/001_enable_pgvector.sql")
assert(existsSync(migrationPath), "Migration file 001_enable_pgvector.sql exists")

// 2. Migration file contains CREATE EXTENSION vector
const migrationContent = readFileSync(migrationPath, "utf8")
assert(
  migrationContent.includes("CREATE EXTENSION IF NOT EXISTS vector"),
  "Migration enables pgvector extension"
)

// 3. schema.sql includes pgvector extension
const schemaContent = readFileSync(resolve(DB_PKG, "schema.sql"), "utf8")
assert(
  schemaContent.includes("CREATE EXTENSION IF NOT EXISTS vector"),
  "schema.sql includes pgvector extension"
)

// 4. Migrations directory exists
assert(existsSync(resolve(DB_PKG, "migrations")), "migrations directory exists")

console.log("\nAll pgvector setup tests passed!")
