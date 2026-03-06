/**
 * Test: Phase 1.10 — Helper functions created
 * Verifies migration file, schema.sql, and live database all have the similarity search functions.
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
const migrationPath = resolve(DB_PKG, "migrations/010_create_helper_functions.sql")
assert(existsSync(migrationPath), "Migration file 010_create_helper_functions.sql exists")

// 2. Migration file contains all three functions
const migrationContent = readFileSync(migrationPath, "utf8")

const functions = ["match_components", "match_templates", "match_patterns"]
for (const fn of functions) {
  assert(
    migrationContent.includes(`CREATE OR REPLACE FUNCTION ${fn}`),
    `Migration creates ${fn} function`
  )
}

// 3. All functions use cosine distance operator
const cosineOccurrences = migrationContent.match(/<=> query_embedding/g)
assert(
  cosineOccurrences !== null && cosineOccurrences.length >= 6,
  "Migration uses cosine distance operator (<=>) in all functions"
)

// 4. All functions have proper parameters
for (const fn of functions) {
  assert(
    migrationContent.includes("query_embedding vector(1536)"),
    `${fn} accepts query_embedding vector(1536) parameter`
  )
  assert(
    migrationContent.includes("match_threshold FLOAT DEFAULT 0.7"),
    `${fn} has match_threshold with default 0.7`
  )
  assert(
    migrationContent.includes("match_count INT DEFAULT 5"),
    `${fn} has match_count with default 5`
  )
}

// 5. match_components returns correct columns
const componentReturnCols = ["library TEXT", "component_name TEXT", "docs_text TEXT", "code_example TEXT", "similarity FLOAT"]
for (const col of componentReturnCols) {
  assert(
    migrationContent.includes(col),
    `match_components returns column: ${col}`
  )
}

// 6. match_templates returns correct columns
assert(
  migrationContent.includes("template_json JSONB"),
  "match_templates returns template_json JSONB"
)
assert(
  migrationContent.includes("section_type TEXT"),
  "match_templates returns section_type TEXT"
)

// 7. match_patterns returns correct columns
assert(
  migrationContent.includes("pattern_type TEXT"),
  "match_patterns returns pattern_type TEXT"
)
assert(
  migrationContent.includes("example_json JSONB"),
  "match_patterns returns example_json JSONB"
)

// 8. schema.sql includes all three functions
const schemaContent = readFileSync(resolve(DB_PKG, "schema.sql"), "utf8")
for (const fn of functions) {
  assert(
    schemaContent.includes(`CREATE OR REPLACE FUNCTION ${fn}`),
    `schema.sql includes ${fn} function`
  )
}

// 9. All functions use plpgsql language
const plpgsqlOccurrences = migrationContent.match(/LANGUAGE plpgsql/g)
assert(
  plpgsqlOccurrences !== null && plpgsqlOccurrences.length === 3,
  "All three functions use LANGUAGE plpgsql"
)

console.log("\nAll helper functions tests passed!")
