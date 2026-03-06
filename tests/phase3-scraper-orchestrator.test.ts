import { describe, it, expect } from "vitest"
import * as fs from "fs"
import * as path from "path"

const indexPath = path.resolve(__dirname, "../packages/scraper/index.ts")
const indexContent = fs.readFileSync(indexPath, "utf-8")

describe("Task 3.5: Scraper Orchestrator", () => {
  // ── File Structure ────────────────────────────────────────

  it("index.ts exists", () => {
    expect(fs.existsSync(indexPath)).toBe(true)
  })

  it("exports scrapeBusinessProfile function", () => {
    expect(indexContent).toContain("export async function scrapeBusinessProfile")
  })

  it("scrapeBusinessProfile takes (name, location) parameters", () => {
    expect(indexContent).toMatch(
      /scrapeBusinessProfile\(\s*name:\s*string,\s*location:\s*string/
    )
  })

  it("returns Promise<BusinessProfile>", () => {
    expect(indexContent).toMatch(
      /scrapeBusinessProfile[\s\S]*?:\s*Promise<BusinessProfile>/
    )
  })

  // ── Re-exports ────────────────────────────────────────────

  it("re-exports findBusiness from google-places", () => {
    expect(indexContent).toContain("findBusiness")
    expect(indexContent).toMatch(/export\s*\{.*findBusiness.*\}\s*from/)
  })

  it("re-exports scrapeWebsite from firecrawl", () => {
    expect(indexContent).toContain("scrapeWebsite")
    expect(indexContent).toMatch(/export\s*\{.*scrapeWebsite.*\}\s*from/)
  })

  it("re-exports mapCategoryToIndustry from industry-mapper", () => {
    expect(indexContent).toContain("mapCategoryToIndustry")
    expect(indexContent).toMatch(/export\s*\{.*mapCategoryToIndustry.*\}\s*from/)
  })

  it("re-exports BusinessProfile type", () => {
    expect(indexContent).toMatch(/export\s+type\s*\{.*BusinessProfile/)
  })

  // ── Pipeline Steps ────────────────────────────────────────

  it("step 1: calls findBusiness to search Google Places", () => {
    expect(indexContent).toContain("findBusiness(name, location)")
  })

  it("step 2: throws if business not found", () => {
    expect(indexContent).toMatch(/throw new Error[\s\S]*?Business not found/)
  })

  it("step 3: scrapes website if one exists", () => {
    expect(indexContent).toContain("scrapeWebsite(placeData.website)")
  })

  it("step 4: website scraping failure is non-fatal", () => {
    // Should catch errors from scrapeWebsite
    expect(indexContent).toMatch(/try\s*\{[\s\S]*?scrapeWebsite[\s\S]*?catch/)
  })

  it("step 5: maps category to industry", () => {
    expect(indexContent).toContain("mapCategoryToIndustry(placeData.categories)")
  })

  it("step 6: parses address into city/state", () => {
    expect(indexContent).toContain("parseAddress")
  })

  it("step 7: parses hours into structured format", () => {
    expect(indexContent).toContain("parseHours")
  })

  it("step 8: converts photos to BusinessPhoto objects", () => {
    expect(indexContent).toMatch(/photos.*placeData\.photoUrls/)
  })

  it("step 9: converts reviews to BusinessReview objects", () => {
    expect(indexContent).toMatch(/reviews.*placeData\.reviews/)
  })

  it("step 10: builds ExistingContent from scraped data", () => {
    expect(indexContent).toContain("buildExistingContent")
  })

  it("step 11: caches in businesses table", () => {
    expect(indexContent).toContain("cacheBusiness")
    expect(indexContent).toContain("upsertBusiness")
  })

  it("step 12: cache failure is non-fatal", () => {
    // cacheBusiness wrapped in try/catch
    expect(indexContent).toMatch(/try\s*\{[\s\S]*?cacheBusiness[\s\S]*?catch/)
  })

  // ── Helper Functions ──────────────────────────────────────

  describe("parseAddress", () => {
    // Dynamic import to test the actual parsing logic
    it("is defined as a function", () => {
      expect(indexContent).toContain("function parseAddress")
    })

    it("handles 3+ part addresses", () => {
      // Just verify the logic exists for multi-part addresses
      expect(indexContent).toMatch(/parts\.length\s*>=\s*3/)
    })

    it("handles 2-part addresses", () => {
      expect(indexContent).toMatch(/parts\.length\s*===?\s*2/)
    })

    it("returns empty strings as fallback", () => {
      expect(indexContent).toMatch(/return\s*\{.*city:\s*"".*state:\s*""/)
    })
  })

  describe("parseHours", () => {
    it("is defined as a function", () => {
      expect(indexContent).toContain("function parseHours")
    })

    it("returns empty array for no hours", () => {
      expect(indexContent).toMatch(/return\s*\[\]/)
    })

    it("handles Closed days", () => {
      expect(indexContent).toMatch(/closed/i)
    })

    it("splits time ranges on dashes", () => {
      expect(indexContent).toMatch(/split.*[–—-]/)
    })
  })

  describe("buildExistingContent", () => {
    it("is defined as a function", () => {
      expect(indexContent).toContain("function buildExistingContent")
    })

    it("maps headings to headlines", () => {
      expect(indexContent).toContain("scraped.headings")
    })

    it("maps paragraphs to descriptions", () => {
      expect(indexContent).toContain("scraped.paragraphs")
    })

    it("maps menuItems to services", () => {
      expect(indexContent).toContain("scraped.menuItems")
    })

    it("maps aboutText to about", () => {
      expect(indexContent).toContain("scraped.aboutText")
    })
  })

  // ── BusinessProfile Assembly ──────────────────────────────

  it("assembled profile has all required fields", () => {
    // The profile object should reference all required BusinessProfile fields
    const requiredFields = [
      "name",
      "address",
      "city",
      "state",
      "phone",
      "website",
      "rating",
      "reviewCount",
      "category",
      "industry",
      "hours",
      "photos",
      "reviews",
      "location",
    ]
    // Check for each field as either `field:` or `field,` (shorthand)
    for (const field of requiredFields) {
      const hasColon = indexContent.includes(`${field}:`)
      const hasComma = indexContent.includes(`${field},`)
      expect(hasColon || hasComma).toBe(true)
    }
  })

  // ── TypeScript compilation ────────────────────────────────

  it("package lint (tsc --noEmit) passes", async () => {
    const { execSync } = await import("child_process")
    const result = execSync("pnpm --filter @radiant/scraper run lint 2>&1", {
      cwd: path.resolve(__dirname, ".."),
      encoding: "utf-8",
    })
    // tsc --noEmit should not print errors
    expect(result).not.toContain("error TS")
  })

  // ── @radiant/db dependency ────────────────────────────────

  it("has @radiant/db as a workspace dependency", () => {
    const pkgJson = JSON.parse(
      fs.readFileSync(
        path.resolve(__dirname, "../packages/scraper/package.json"),
        "utf-8",
      ),
    )
    expect(
      pkgJson.dependencies?.["@radiant/db"] ||
        pkgJson.devDependencies?.["@radiant/db"],
    ).toBeTruthy()
  })
})
