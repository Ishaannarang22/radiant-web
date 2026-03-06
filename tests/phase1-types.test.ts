/**
 * Tests for task 1.13 — Create TypeScript types for all tables
 * Verifies: packages/db/types.ts exists, exports all required interfaces,
 * includes Insert types, Database type, and compiles without errors.
 */

import { existsSync, readFileSync } from "fs"
import { join } from "path"
import { execSync } from "child_process"
import assert from "assert"

const ROOT = join(__dirname, "..")
const TYPES_PATH = join(ROOT, "packages", "db", "types.ts")
const INDEX_PATH = join(ROOT, "packages", "db", "index.ts")

const typesContent = existsSync(TYPES_PATH) ? readFileSync(TYPES_PATH, "utf-8") : ""
const indexContent = existsSync(INDEX_PATH) ? readFileSync(INDEX_PATH, "utf-8") : ""

// File existence
assert.ok(existsSync(TYPES_PATH), "packages/db/types.ts must exist")
console.log("✓ types.ts exists")

// Re-export from index.ts
assert.ok(indexContent.includes('export * from "./types"'), "index.ts must re-export types")
console.log("✓ index.ts re-exports types")

// Row interfaces for all 8 tables
const rowInterfaces = [
  "User",
  "Project",
  "ProjectFile",
  "Generation",
  "Business",
  "ComponentEmbedding",
  "TemplateEmbedding",
  "PatternEmbedding",
]

for (const name of rowInterfaces) {
  assert.ok(
    new RegExp(`export interface ${name} \\{`).test(typesContent),
    `Must export interface ${name}`
  )
}
console.log(`✓ All ${rowInterfaces.length} row interfaces exported`)

// Union/literal types for enums
assert.ok(typesContent.includes('"free" | "pro" | "agency"'), "Must define UserPlan type")
assert.ok(typesContent.includes('"draft"'), "Must define ProjectStatus type with draft")
assert.ok(typesContent.includes('"pending"'), "Must define GenerationStatus type with pending")
console.log("✓ Enum types defined (UserPlan, ProjectStatus, GenerationStatus)")

// Insert types for all 8 tables
const insertTypes = [
  "UserInsert",
  "ProjectInsert",
  "ProjectFileInsert",
  "GenerationInsert",
  "BusinessInsert",
  "ComponentEmbeddingInsert",
  "TemplateEmbeddingInsert",
  "PatternEmbeddingInsert",
]

for (const name of insertTypes) {
  assert.ok(typesContent.includes(`export type ${name}`), `Must export type ${name}`)
}
console.log(`✓ All ${insertTypes.length} insert types exported`)

// Database type for Supabase typed client
assert.ok(typesContent.includes("export interface Database"), "Must export Database interface")
assert.ok(typesContent.includes("Tables:"), "Database must have Tables")
assert.ok(typesContent.includes("Functions:"), "Database must have Functions")
assert.ok(typesContent.includes("match_components"), "Database.Functions must include match_components")
assert.ok(typesContent.includes("match_templates"), "Database.Functions must include match_templates")
assert.ok(typesContent.includes("match_patterns"), "Database.Functions must include match_patterns")
console.log("✓ Database interface with Tables and Functions exported")

// Key field checks — verify types match schema columns
assert.ok(typesContent.includes("email: string"), "User must have email: string")
assert.ok(typesContent.includes("business_name: string"), "Project must have business_name: string")
assert.ok(typesContent.includes("subdomain: string"), "Project must have subdomain: string")
assert.ok(typesContent.includes("file_path: string"), "ProjectFile must have file_path: string")
assert.ok(typesContent.includes("tokens_input: number | null"), "Generation must have tokens_input: number | null")
assert.ok(typesContent.includes("google_place_id: string | null"), "Business must have google_place_id")
assert.ok(typesContent.includes("embedding: number[] | null"), "Embedding tables must have embedding field")
assert.ok(typesContent.includes("tags: string[] | null"), "ComponentEmbedding must have tags: string[]")
assert.ok(typesContent.includes("template_json: Record<string, unknown>"), "TemplateEmbedding must have template_json")
console.log("✓ Key field types verified against schema")

// TypeScript compilation check
try {
  execSync("pnpm --filter @radiant/db lint", { cwd: ROOT, stdio: "pipe" })
  console.log("✓ packages/db compiles without errors")
} catch (e: unknown) {
  const msg = e instanceof Error ? e.message : String(e)
  assert.fail(`TypeScript compilation failed: ${msg}`)
}

const totalAssertions =
  1 + // file exists
  1 + // re-export
  rowInterfaces.length +
  3 + // enum types
  insertTypes.length +
  6 + // Database interface
  9 + // field checks
  1   // compilation
console.log(`\n✅ All ${totalAssertions} assertions passed`)
