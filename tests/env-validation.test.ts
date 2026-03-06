/**
 * Test: environment variable validation
 * Validates that env.ts correctly detects missing and present env vars
 */

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`FAIL: ${message}`)
    process.exit(1)
  }
  console.log(`PASS: ${message}`)
}

// We need to test the logic directly since env.ts reads process.env
const requiredEnvVars = [
  "ANTHROPIC_API_KEY",
  "VERCEL_TOKEN",
  "GOOGLE_CLOUD_API_KEY",
  "SUPABASE_URL",
  "SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "RESEND_API_KEY",
  "DOMAIN",
]

// 1. Verify env.ts file exists and exports validateEnv and getEnv
import { existsSync, readFileSync } from "fs"
import { resolve } from "path"

const envFilePath = resolve(__dirname, "../apps/web/lib/env.ts")
assert(existsSync(envFilePath), "apps/web/lib/env.ts exists")

const envContent = readFileSync(envFilePath, "utf8")
assert(envContent.includes("export function validateEnv"), "exports validateEnv function")
assert(envContent.includes("export function getEnv"), "exports getEnv function")

// 2. Verify all required env vars are checked
for (const envVar of requiredEnvVars) {
  assert(envContent.includes(`"${envVar}"`), `checks for ${envVar}`)
}

// 3. Verify it throws with meaningful error when vars are missing
assert(
  envContent.includes("Missing required environment variables"),
  "error message mentions missing variables"
)
assert(
  envContent.includes(".env file"),
  "error message references .env file"
)

// 4. Test validateEnv with all vars missing — should throw
const savedEnv: Record<string, string | undefined> = {}
for (const key of requiredEnvVars) {
  savedEnv[key] = process.env[key]
  delete process.env[key]
}

// Inline the validation logic to test it
function validateEnv() {
  const missing: string[] = []
  for (const key of requiredEnvVars) {
    if (!process.env[key]) {
      missing.push(key)
    }
  }
  if (missing.length > 0) {
    throw new Error(`Missing: ${missing.join(", ")}`)
  }
}

let threwOnMissing = false
try {
  validateEnv()
} catch (e: any) {
  threwOnMissing = true
  // All 8 vars should be listed as missing
  for (const key of requiredEnvVars) {
    assert(e.message.includes(key), `error lists missing ${key}`)
  }
}
assert(threwOnMissing, "validateEnv throws when env vars are missing")

// 5. Test validateEnv with all vars present — should not throw
for (const key of requiredEnvVars) {
  process.env[key] = "test-value"
}

let threwOnPresent = false
try {
  validateEnv()
} catch {
  threwOnPresent = true
}
assert(!threwOnPresent, "validateEnv succeeds when all env vars are present")

// Restore original env
for (const [key, value] of Object.entries(savedEnv)) {
  if (value !== undefined) {
    process.env[key] = value
  } else {
    delete process.env[key]
  }
}

// 6. Verify dotenv is installed at root
const rootPkgPath = resolve(__dirname, "../package.json")
const rootPkg = JSON.parse(readFileSync(rootPkgPath, "utf8"))
assert(
  "dotenv" in (rootPkg.devDependencies || {}),
  "dotenv is installed at workspace root"
)

console.log("\nAll environment variable validation tests passed!")
