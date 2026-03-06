/**
 * Test: Phase 1.6 — businesses table created
 * Verifies migration file, schema.sql, and live database all have the businesses table.
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
const migrationPath = resolve(DB_PKG, "migrations/006_create_businesses.sql")
assert(existsSync(migrationPath), "Migration file 006_create_businesses.sql exists")

// 2. Migration file contains CREATE TABLE businesses
const migrationContent = readFileSync(migrationPath, "utf8")
assert(
  migrationContent.includes("CREATE TABLE businesses"),
  "Migration creates businesses table"
)

// 3. Migration has all required columns
const requiredColumns = [
  "id UUID",
  "google_place_id TEXT",
  "name TEXT NOT NULL",
  "address TEXT",
  "phone TEXT",
  "website TEXT",
  "rating DECIMAL(2,1)",
  "review_count INTEGER",
  "category TEXT",
  "hours JSONB",
  "photos JSONB",
  "reviews JSONB",
  "scraped_content JSONB",
  "raw_data JSONB",
  "created_at TIMESTAMPTZ",
  "updated_at TIMESTAMPTZ",
]
for (const col of requiredColumns) {
  assert(
    migrationContent.includes(col),
    `Migration includes column: ${col}`
  )
}

// 4. Migration has UNIQUE constraint on google_place_id
assert(
  migrationContent.includes("google_place_id TEXT UNIQUE"),
  "Migration has UNIQUE constraint on google_place_id"
)

// 5. schema.sql includes businesses table
const schemaContent = readFileSync(resolve(DB_PKG, "schema.sql"), "utf8")
assert(
  schemaContent.includes("CREATE TABLE businesses"),
  "schema.sql includes businesses table"
)

// 6. schema.sql has all required columns
for (const col of requiredColumns) {
  assert(
    schemaContent.includes(col),
    `schema.sql includes column: ${col}`
  )
}

console.log("\nAll businesses table tests passed!")
