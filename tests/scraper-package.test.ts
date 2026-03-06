/**
 * Test: packages/scraper exports and structure verification
 * Validates that the @radiant/scraper package is correctly set up
 */

import { existsSync, readFileSync } from "fs"
import { resolve } from "path"

const SCRAPER_PKG = resolve(__dirname, "../packages/scraper")

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`FAIL: ${message}`)
    process.exit(1)
  }
  console.log(`PASS: ${message}`)
}

// 1. Verify package.json exists and has correct name
const pkgJsonPath = resolve(SCRAPER_PKG, "package.json")
assert(existsSync(pkgJsonPath), "package.json exists")
const pkgJson = JSON.parse(readFileSync(pkgJsonPath, "utf8"))
assert(pkgJson.name === "@radiant/scraper", "package name is @radiant/scraper")
assert(pkgJson.private === true, "package is private")

// 2. Verify @googlemaps/google-maps-services-js is a dependency
assert(
  "@googlemaps/google-maps-services-js" in (pkgJson.dependencies || {}),
  "@googlemaps/google-maps-services-js is a dependency"
)

// 3. Verify all placeholder files exist
const requiredFiles = ["types.ts", "google-places.ts", "firecrawl.ts"]
for (const file of requiredFiles) {
  assert(existsSync(resolve(SCRAPER_PKG, file)), `${file} exists`)
}

// 4. Verify types.ts exports key interfaces
const typesContent = readFileSync(resolve(SCRAPER_PKG, "types.ts"), "utf8")
assert(typesContent.includes("export interface GooglePlaceData"), "exports GooglePlaceData interface")
assert(typesContent.includes("export interface ScrapedWebsiteData"), "exports ScrapedWebsiteData interface")
assert(typesContent.includes("export interface BusinessProfile"), "exports BusinessProfile interface")

// 5. Verify google-places.ts imports from types and google maps client
const gpContent = readFileSync(resolve(SCRAPER_PKG, "google-places.ts"), "utf8")
assert(gpContent.includes("@googlemaps/google-maps-services-js"), "google-places.ts imports google maps client")
assert(gpContent.includes("GooglePlaceData"), "google-places.ts references GooglePlaceData type")
assert(gpContent.includes("export async function findBusiness"), "google-places.ts exports findBusiness")

// 6. Verify firecrawl.ts imports from types
const fcContent = readFileSync(resolve(SCRAPER_PKG, "firecrawl.ts"), "utf8")
assert(fcContent.includes("ScrapedWebsiteData"), "firecrawl.ts references ScrapedWebsiteData type")
assert(fcContent.includes("export async function scrapeWebsite"), "firecrawl.ts exports scrapeWebsite")

// 7. Verify tsconfig.json exists
assert(existsSync(resolve(SCRAPER_PKG, "tsconfig.json")), "tsconfig.json exists")

console.log("\nAll @radiant/scraper package tests passed!")
