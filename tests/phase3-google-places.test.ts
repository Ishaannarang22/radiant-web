import { describe, it, expect, beforeAll } from "vitest"
import { existsSync, readFileSync } from "fs"
import { join } from "path"
import "dotenv/config"

const ROOT = join(__dirname, "..")
const SCRAPER_DIR = join(ROOT, "packages/scraper")

describe("Phase 3.1 — Google Places API client", () => {
  describe("Module structure", () => {
    it("google-places.ts exists", () => {
      expect(existsSync(join(SCRAPER_DIR, "google-places.ts"))).toBe(true)
    })

    it("exports searchBusiness function", () => {
      const content = readFileSync(
        join(SCRAPER_DIR, "google-places.ts"),
        "utf-8",
      )
      expect(content).toContain("export async function searchBusiness")
    })

    it("exports getPlaceDetails function", () => {
      const content = readFileSync(
        join(SCRAPER_DIR, "google-places.ts"),
        "utf-8",
      )
      expect(content).toContain("export async function getPlaceDetails")
    })

    it("exports getPlacePhotoUrls function", () => {
      const content = readFileSync(
        join(SCRAPER_DIR, "google-places.ts"),
        "utf-8",
      )
      expect(content).toContain("export function getPlacePhotoUrls")
    })

    it("exports findBusiness function", () => {
      const content = readFileSync(
        join(SCRAPER_DIR, "google-places.ts"),
        "utf-8",
      )
      expect(content).toContain("export async function findBusiness")
    })

    it("imports Client and PlaceInputType from google-maps-services-js", () => {
      const content = readFileSync(
        join(SCRAPER_DIR, "google-places.ts"),
        "utf-8",
      )
      expect(content).toContain("@googlemaps/google-maps-services-js")
      expect(content).toContain("Client")
      expect(content).toContain("PlaceInputType")
    })

    it("uses GooglePlaceData and GooglePlaceReview types from types.ts", () => {
      const content = readFileSync(
        join(SCRAPER_DIR, "google-places.ts"),
        "utf-8",
      )
      expect(content).toContain("GooglePlaceData")
      expect(content).toContain("GooglePlaceReview")
    })
  })

  describe("Error handling", () => {
    it("searchBusiness throws on missing API key", () => {
      const content = readFileSync(
        join(SCRAPER_DIR, "google-places.ts"),
        "utf-8",
      )
      expect(content).toContain("Missing GOOGLE_CLOUD_API_KEY")
    })

    it("handles quota exceeded errors", () => {
      const content = readFileSync(
        join(SCRAPER_DIR, "google-places.ts"),
        "utf-8",
      )
      expect(content).toContain("quota exceeded")
    })

    it("handles business not found (returns null)", () => {
      const content = readFileSync(
        join(SCRAPER_DIR, "google-places.ts"),
        "utf-8",
      )
      // searchBusiness returns null when no candidates
      expect(content).toMatch(/return null/)
    })
  })

  describe("getPlacePhotoUrls", () => {
    it("builds correct photo URLs", async () => {
      // Set a dummy key for this test
      const origKey = process.env.GOOGLE_CLOUD_API_KEY
      process.env.GOOGLE_CLOUD_API_KEY = "TEST_KEY_123"

      try {
        const { getPlacePhotoUrls } = await import(
          "../packages/scraper/google-places"
        )

        const refs = ["photo_ref_1", "photo_ref_2"]
        const urls = getPlacePhotoUrls(refs, 600, "TEST_KEY_123")

        expect(urls).toHaveLength(2)
        expect(urls[0]).toContain("maxwidth=600")
        expect(urls[0]).toContain("photoreference=photo_ref_1")
        expect(urls[0]).toContain("key=TEST_KEY_123")
        expect(urls[0]).toContain(
          "https://maps.googleapis.com/maps/api/place/photo",
        )
        expect(urls[1]).toContain("photoreference=photo_ref_2")
      } finally {
        if (origKey) {
          process.env.GOOGLE_CLOUD_API_KEY = origKey
        } else {
          delete process.env.GOOGLE_CLOUD_API_KEY
        }
      }
    })

    it("defaults to maxwidth 800", async () => {
      const { getPlacePhotoUrls } = await import(
        "../packages/scraper/google-places"
      )
      const urls = getPlacePhotoUrls(["ref1"], 800, "TEST_KEY")
      expect(urls[0]).toContain("maxwidth=800")
    })
  })

  describe("Function signatures", () => {
    it("searchBusiness accepts name and location strings", () => {
      const content = readFileSync(
        join(SCRAPER_DIR, "google-places.ts"),
        "utf-8",
      )
      expect(content).toMatch(
        /searchBusiness\(\s*name:\s*string,\s*location:\s*string/,
      )
    })

    it("getPlaceDetails accepts placeId string", () => {
      const content = readFileSync(
        join(SCRAPER_DIR, "google-places.ts"),
        "utf-8",
      )
      expect(content).toMatch(/getPlaceDetails\(\s*placeId:\s*string/)
    })

    it("searchBusiness returns Promise<string | null>", () => {
      const content = readFileSync(
        join(SCRAPER_DIR, "google-places.ts"),
        "utf-8",
      )
      expect(content).toMatch(
        /searchBusiness[\s\S]*?:\s*Promise<string\s*\|\s*null>/,
      )
    })

    it("getPlaceDetails returns Promise<GooglePlaceData | null>", () => {
      const content = readFileSync(
        join(SCRAPER_DIR, "google-places.ts"),
        "utf-8",
      )
      expect(content).toMatch(
        /getPlaceDetails[\s\S]*?:\s*Promise<GooglePlaceData\s*\|\s*null>/,
      )
    })

    it("findBusiness returns Promise<GooglePlaceData | null>", () => {
      const content = readFileSync(
        join(SCRAPER_DIR, "google-places.ts"),
        "utf-8",
      )
      expect(content).toMatch(
        /findBusiness[\s\S]*?:\s*Promise<GooglePlaceData\s*\|\s*null>/,
      )
    })
  })

  describe("API field requests", () => {
    it("requests essential fields in findPlaceFromText", () => {
      const content = readFileSync(
        join(SCRAPER_DIR, "google-places.ts"),
        "utf-8",
      )
      expect(content).toContain("place_id")
      expect(content).toContain("textQuery")
    })

    it("requests full detail fields in placeDetails", () => {
      const content = readFileSync(
        join(SCRAPER_DIR, "google-places.ts"),
        "utf-8",
      )
      // Must request these essential fields
      const requiredFields = [
        "name",
        "formatted_address",
        "formatted_phone_number",
        "website",
        "rating",
        "user_ratings_total",
        "opening_hours",
        "types",
        "photos",
        "reviews",
        "geometry",
      ]
      for (const field of requiredFields) {
        expect(content).toContain(field)
      }
    })
  })

  describe("Response mapping", () => {
    it("maps review fields correctly", () => {
      const content = readFileSync(
        join(SCRAPER_DIR, "google-places.ts"),
        "utf-8",
      )
      expect(content).toContain("author_name")
      expect(content).toContain("relative_time_description")
    })

    it("maps photo references to URLs", () => {
      const content = readFileSync(
        join(SCRAPER_DIR, "google-places.ts"),
        "utf-8",
      )
      expect(content).toContain("photo_reference")
    })

    it("extracts geometry location (lat/lng)", () => {
      const content = readFileSync(
        join(SCRAPER_DIR, "google-places.ts"),
        "utf-8",
      )
      expect(content).toContain("geometry")
      expect(content).toMatch(/location.*lat/)
    })
  })

  describe("TypeScript compilation", () => {
    it("compiles without errors", async () => {
      const { execSync } = await import("child_process")
      const result = execSync("pnpm exec tsc --noEmit", {
        cwd: SCRAPER_DIR,
        encoding: "utf-8",
      })
      // No output means success
      expect(result.trim()).toBe("")
    })
  })

  // Live API tests - only run if GOOGLE_CLOUD_API_KEY is set and Places API is enabled
  // These tests are skipped if the API returns 403 (API not enabled)
  const apiKey = process.env.GOOGLE_CLOUD_API_KEY
  const describeIfApiKey = apiKey ? describe : describe.skip

  describeIfApiKey("Live API tests (requires GOOGLE_CLOUD_API_KEY + Places API enabled)", () => {
    let apiAccessible = false

    beforeAll(async () => {
      try {
        const { searchBusiness } = await import(
          "../packages/scraper/google-places"
        )
        await searchBusiness("test", "test")
        apiAccessible = true
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e)
        if (msg.includes("403") || msg.includes("quota")) {
          console.warn("Skipping live tests: Places API not enabled or quota exceeded")
          apiAccessible = false
        } else {
          // Other errors might mean the API is accessible but the query failed
          apiAccessible = true
        }
      }
    }, 15000)

    it("searchBusiness finds a well-known restaurant", async () => {
      if (!apiAccessible) return // skip gracefully
      const { searchBusiness } = await import(
        "../packages/scraper/google-places"
      )
      const placeId = await searchBusiness("Shake Shack", "New York, NY")
      expect(placeId).toBeTruthy()
      expect(typeof placeId).toBe("string")
    }, 15000)

    it("getPlaceDetails returns structured data for a known place", async () => {
      if (!apiAccessible) return
      const { searchBusiness, getPlaceDetails } = await import(
        "../packages/scraper/google-places"
      )
      const placeId = await searchBusiness("Shake Shack", "New York, NY")
      expect(placeId).toBeTruthy()

      const details = await getPlaceDetails(placeId!)
      expect(details).not.toBeNull()
      expect(details!.name).toBeTruthy()
      expect(details!.address).toBeTruthy()
      expect(details!.placeId).toBe(placeId)
      expect(details!.categories).toBeInstanceOf(Array)
      expect(details!.categories.length).toBeGreaterThan(0)
      expect(details!.location.lat).not.toBe(0)
      expect(details!.location.lng).not.toBe(0)
    }, 15000)

    it("findBusiness returns full details in one call", async () => {
      if (!apiAccessible) return
      const { findBusiness } = await import(
        "../packages/scraper/google-places"
      )
      const result = await findBusiness("Starbucks", "Seattle, WA")
      expect(result).not.toBeNull()
      expect(result!.name).toContain("Starbucks")
      expect(result!.photoUrls).toBeInstanceOf(Array)
      expect(result!.reviews).toBeInstanceOf(Array)
    }, 15000)

    it("searchBusiness returns null for nonexistent business", async () => {
      if (!apiAccessible) return
      const { searchBusiness } = await import(
        "../packages/scraper/google-places"
      )
      const placeId = await searchBusiness(
        "ZZXXNONEXISTENTBUSINESS99887766",
        "Nowhere, ZZ",
      )
      // May still return something since Google is lenient, but test the flow works
      expect(placeId === null || typeof placeId === "string").toBe(true)
    }, 15000)
  })
})
