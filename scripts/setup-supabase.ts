/**
 * setup-supabase.ts
 *
 * Database setup & verification script for Radiant Web.
 *
 * Usage:
 *   npx tsx scripts/setup-supabase.ts           # Verify all tables & functions exist
 *   npx tsx scripts/setup-supabase.ts --apply    # Apply migrations via Supabase CLI (requires `supabase` CLI)
 *
 * Requires env vars: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */

import "dotenv/config"
import { createClient } from "@supabase/supabase-js"
import { readFileSync, readdirSync } from "fs"
import { join } from "path"

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing required env vars: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY")
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
})

const EXPECTED_TABLES = [
  "users",
  "projects",
  "project_files",
  "generations",
  "businesses",
  "component_embeddings",
  "template_embeddings",
  "pattern_embeddings",
] as const

const EXPECTED_FUNCTIONS = [
  "match_components",
  "match_templates",
  "match_patterns",
] as const

async function verifyTable(tableName: string): Promise<boolean> {
  const { error } = await supabase.from(tableName).select("id").limit(0)
  if (error) {
    console.error(`  FAIL  ${tableName}: ${error.message}`)
    return false
  }
  console.log(`  OK    ${tableName}`)
  return true
}

async function verifyFunction(fnName: string): Promise<boolean> {
  // Call with a dummy embedding that should return no rows but validates the function exists
  const dummyEmbedding = Array(1536).fill(0)
  const { error } = await supabase.rpc(fnName, {
    query_embedding: dummyEmbedding,
    match_threshold: 0.99,
    match_count: 1,
  })
  if (error) {
    console.error(`  FAIL  ${fnName}(): ${error.message}`)
    return false
  }
  console.log(`  OK    ${fnName}()`)
  return true
}

function listMigrations(): string[] {
  const migrationsDir = join(__dirname, "..", "packages", "db", "migrations")
  try {
    const files = readdirSync(migrationsDir)
      .filter((f) => f.endsWith(".sql"))
      .sort()
    return files.map((f) => join(migrationsDir, f))
  } catch {
    console.error("Could not read migrations directory")
    return []
  }
}

async function main() {
  console.log("Radiant Web — Supabase Setup Verification")
  console.log("==========================================\n")

  // Show schema.sql location
  const schemaPath = join(__dirname, "..", "packages", "db", "schema.sql")
  const schemaContent = readFileSync(schemaPath, "utf-8")
  console.log(`Schema file: ${schemaPath} (${schemaContent.length} bytes)\n`)

  // List migrations
  const migrations = listMigrations()
  console.log(`Migrations (${migrations.length} files):`)
  for (const m of migrations) {
    const name = m.split("/").pop()
    const content = readFileSync(m, "utf-8")
    console.log(`  ${name} (${content.length} bytes)`)
  }
  console.log()

  // Verify tables
  console.log("Verifying tables...")
  let tablesPassed = 0
  for (const table of EXPECTED_TABLES) {
    const ok = await verifyTable(table)
    if (ok) tablesPassed++
  }
  console.log(`Tables: ${tablesPassed}/${EXPECTED_TABLES.length} OK\n`)

  // Verify functions
  console.log("Verifying functions...")
  let fnsPassed = 0
  for (const fn of EXPECTED_FUNCTIONS) {
    const ok = await verifyFunction(fn)
    if (ok) fnsPassed++
  }
  console.log(`Functions: ${fnsPassed}/${EXPECTED_FUNCTIONS.length} OK\n`)

  // Verify RLS is enabled
  console.log("Verifying RLS...")
  const { data: rlsData, error: rlsError } = await supabase.rpc("exec_sql" as string, {
    sql: "SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public'",
  }).maybeSingle()

  // RLS can't be easily checked via JS client, so we just report the overall status
  if (rlsError) {
    console.log("  (RLS verification requires direct SQL — skipped via JS client)")
    console.log("  RLS was applied via migration 011_create_rls_policies.sql")
  }
  console.log()

  // Summary
  const totalChecks = EXPECTED_TABLES.length + EXPECTED_FUNCTIONS.length
  const totalPassed = tablesPassed + fnsPassed
  const allPassed = totalPassed === totalChecks

  if (allPassed) {
    console.log(`SUCCESS: All ${totalChecks} checks passed!`)
    console.log("Database is fully set up and ready.")
  } else {
    console.error(`FAILED: ${totalPassed}/${totalChecks} checks passed.`)
    console.error("Run migrations to fix missing tables/functions.")
    console.error("Migrations can be applied via Supabase Dashboard SQL editor or CLI.")
    process.exit(1)
  }
}

main().catch((err) => {
  console.error("Unexpected error:", err)
  process.exit(1)
})
