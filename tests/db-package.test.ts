/**
 * Test: packages/db exports and structure verification
 * Validates that the @radiant/db package is correctly set up
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

// 1. Verify package.json exists and has correct name
const pkgJsonPath = resolve(DB_PKG, "package.json")
assert(existsSync(pkgJsonPath), "package.json exists")
const pkgJson = JSON.parse(readFileSync(pkgJsonPath, "utf8"))
assert(pkgJson.name === "@radiant/db", "package name is @radiant/db")
assert(pkgJson.private === true, "package is private")

// 2. Verify @supabase/supabase-js is a dependency
assert(
  "@supabase/supabase-js" in (pkgJson.dependencies || {}),
  "@supabase/supabase-js is a dependency"
)

// 3. Verify index.ts exists
assert(existsSync(resolve(DB_PKG, "index.ts")), "index.ts exists")

// 4. Verify index.ts exports supabase client and getServiceClient
const indexContent = readFileSync(resolve(DB_PKG, "index.ts"), "utf8")
assert(indexContent.includes("export const supabase"), "exports supabase client")
assert(
  indexContent.includes("export function getServiceClient"),
  "exports getServiceClient function"
)
assert(
  indexContent.includes("createClient"),
  "uses createClient from supabase-js"
)

// 5. Verify schema.sql exists
assert(existsSync(resolve(DB_PKG, "schema.sql")), "schema.sql exists")

// 6. Verify tsconfig.json exists
assert(existsSync(resolve(DB_PKG, "tsconfig.json")), "tsconfig.json exists")

console.log("\nAll @radiant/db package tests passed!")
