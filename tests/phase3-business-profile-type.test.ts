/**
 * Test: BusinessProfile type definition in packages/scraper/types.ts
 * Validates that the BusinessProfile type matches the plan specification.
 */

import { readFileSync } from "fs"
import { resolve } from "path"

const TYPES_PATH = resolve(__dirname, "../packages/scraper/types.ts")

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`FAIL: ${message}`)
    process.exit(1)
  }
  console.log(`PASS: ${message}`)
}

const content = readFileSync(TYPES_PATH, "utf8")

// 1. BusinessProfile interface exists and is exported
assert(content.includes("export interface BusinessProfile"), "BusinessProfile is exported")

// 2. Required fields from plan spec
const requiredFields = [
  "name: string",
  "address: string",
  "city: string",
  "state: string",
  "phone: string",
  "rating: number",
  "reviewCount: number",
  "category: string",
  "industry: string",
]
for (const field of requiredFields) {
  assert(content.includes(field), `BusinessProfile has required field: ${field}`)
}

// 3. Optional fields
assert(content.includes("website?: string"), "BusinessProfile has optional website field")
assert(content.includes("existingContent?: ExistingContent"), "BusinessProfile has optional existingContent field")

// 4. Structured hours field (not string[])
assert(content.includes("hours: BusinessHours[]"), "BusinessProfile has structured hours (BusinessHours[])")
assert(content.includes("export interface BusinessHours"), "BusinessHours interface is exported")
assert(content.includes("day: string"), "BusinessHours has day field")
assert(content.includes("open: string"), "BusinessHours has open field")
assert(content.includes("close: string"), "BusinessHours has close field")

// 5. Structured photos field (not string[])
assert(content.includes("photos: BusinessPhoto[]"), "BusinessProfile has structured photos (BusinessPhoto[])")
assert(content.includes("export interface BusinessPhoto"), "BusinessPhoto interface is exported")

// 6. Structured reviews field
assert(content.includes("reviews: BusinessReview[]"), "BusinessProfile has structured reviews (BusinessReview[])")
assert(content.includes("export interface BusinessReview"), "BusinessReview interface is exported")

// 7. ExistingContent interface
assert(content.includes("export interface ExistingContent"), "ExistingContent interface is exported")
assert(content.includes("headlines: string[]"), "ExistingContent has headlines")
assert(content.includes("descriptions: string[]"), "ExistingContent has descriptions")
assert(content.includes("services: string[]"), "ExistingContent has services")
assert(content.includes("about: string"), "ExistingContent has about")

// 8. Location field preserved
assert(content.includes("location:"), "BusinessProfile has location field")

// 9. GooglePlaceData and ScrapedWebsiteData still exist (backward compatibility)
assert(content.includes("export interface GooglePlaceData"), "GooglePlaceData interface still exists")
assert(content.includes("export interface ScrapedWebsiteData"), "ScrapedWebsiteData interface still exists")
assert(content.includes("export interface GooglePlaceReview"), "GooglePlaceReview interface still exists")

// 10. TypeScript compilation check
const { execSync } = require("child_process")
try {
  execSync("apps/web/node_modules/.bin/tsc --noEmit --strict --moduleResolution bundler --module esnext --target es2017 packages/scraper/types.ts", {
    cwd: resolve(__dirname, ".."),
    stdio: "pipe",
  })
  assert(true, "types.ts compiles without errors")
} catch (err: any) {
  console.error(err.stderr?.toString() || err.message)
  assert(false, "types.ts compiles without errors")
}

console.log("\nAll BusinessProfile type tests passed!")
