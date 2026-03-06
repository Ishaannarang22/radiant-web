/**
 * Tests for task 1.14 — Create database helper functions
 * Verifies: packages/db/queries.ts exists, exports all required functions,
 * uses proper Supabase patterns, and compiles without errors.
 */

import { existsSync, readFileSync } from "fs"
import { join } from "path"
import { execSync } from "child_process"
import assert from "assert"

const ROOT = join(__dirname, "..")
const QUERIES_PATH = join(ROOT, "packages", "db", "queries.ts")
const INDEX_PATH = join(ROOT, "packages", "db", "index.ts")

const queriesContent = existsSync(QUERIES_PATH) ? readFileSync(QUERIES_PATH, "utf-8") : ""
const indexContent = existsSync(INDEX_PATH) ? readFileSync(INDEX_PATH, "utf-8") : ""

let passed = 0

// ── File existence ───────────────────────────────────────

assert.ok(existsSync(QUERIES_PATH), "packages/db/queries.ts must exist")
passed++

// ── Re-exported from index.ts ────────────────────────────

assert.ok(
  indexContent.includes("./queries"),
  "index.ts must re-export from ./queries"
)
passed++

// ── Required functions from plan ─────────────────────────

const requiredFunctions = [
  "createProject",
  "getProjectsByUser",
  "getProjectFiles",
  "upsertBusiness",
  "searchComponents",
  "logGeneration",
]

for (const fn of requiredFunctions) {
  assert.ok(
    queriesContent.includes(`export async function ${fn}`),
    `queries.ts must export async function ${fn}`
  )
  passed++
}

// ── Additional useful helpers ────────────────────────────

const bonusFunctions = [
  "getProject",
  "updateProject",
  "upsertProjectFiles",
  "getBusinessByPlaceId",
  "getGenerationsByProject",
  "searchTemplates",
  "searchPatterns",
]

for (const fn of bonusFunctions) {
  assert.ok(
    queriesContent.includes(`export async function ${fn}`),
    `queries.ts should export async function ${fn}`
  )
  passed++
}

// ── Uses service client (not anon) ───────────────────────

assert.ok(
  queriesContent.includes("getServiceClient"),
  "queries.ts must use getServiceClient for server-side DB access"
)
passed++

// ── Error handling ───────────────────────────────────────

const throwCount = (queriesContent.match(/throw new Error/g) || []).length
assert.ok(throwCount >= 6, `Should have error handling (found ${throwCount} throws, need >= 6)`)
passed++

// ── Uses proper Supabase patterns ────────────────────────

assert.ok(queriesContent.includes('.from("projects")'), "Must query projects table")
passed++

assert.ok(queriesContent.includes('.from("project_files")'), "Must query project_files table")
passed++

assert.ok(queriesContent.includes('.from("businesses")'), "Must query businesses table")
passed++

assert.ok(queriesContent.includes('.from("generations")'), "Must query generations table")
passed++

assert.ok(queriesContent.includes('.rpc("match_components"'), "Must use RPC for match_components")
passed++

// ── Imports types from ./types ───────────────────────────

assert.ok(
  queriesContent.includes('from "./types"'),
  "queries.ts must import types from ./types"
)
passed++

// ── TypeScript compilation ───────────────────────────────

try {
  execSync("pnpm --filter @radiant/db lint", { cwd: ROOT, stdio: "pipe" })
  passed++
} catch (e: unknown) {
  const stderr = (e as { stderr?: Buffer }).stderr?.toString() ?? ""
  assert.fail(`TypeScript compilation failed: ${stderr}`)
}

console.log(`\n✅ All ${passed} assertions passed for task 1.14 (database helper functions)`)
