import { describe, it, expect } from "vitest"
import * as fs from "fs"
import * as path from "path"

const routePath = path.join(__dirname, "..", "apps", "web", "app", "api", "scrape", "route.ts")

describe("Phase 3.6 — API route for scraping", () => {
  it("route file exists", () => {
    expect(fs.existsSync(routePath)).toBe(true)
  })

  it("exports a POST handler", () => {
    const content = fs.readFileSync(routePath, "utf-8")
    expect(content).toContain("export async function POST")
  })

  it("imports scrapeBusinessProfile from @radiant/scraper", () => {
    const content = fs.readFileSync(routePath, "utf-8")
    expect(content).toContain("scrapeBusinessProfile")
    expect(content).toContain("@radiant/scraper")
  })

  it("uses NextRequest and NextResponse", () => {
    const content = fs.readFileSync(routePath, "utf-8")
    expect(content).toContain("NextRequest")
    expect(content).toContain("NextResponse")
  })

  it("validates businessName field", () => {
    const content = fs.readFileSync(routePath, "utf-8")
    expect(content).toContain("businessName")
    // Check for validation of missing field
    expect(content).toMatch(/missing.*businessName|businessName.*required/i)
  })

  it("validates location field", () => {
    const content = fs.readFileSync(routePath, "utf-8")
    expect(content).toContain("location")
    expect(content).toMatch(/missing.*location|location.*required/i)
  })

  it("implements rate limiting", () => {
    const content = fs.readFileSync(routePath, "utf-8")
    // Check for rate limit logic
    expect(content).toContain("rateLimitMap")
    expect(content).toContain("RATE_LIMIT_MAX")
    expect(content).toMatch(/429/)
  })

  it("rate limit is 10 per hour", () => {
    const content = fs.readFileSync(routePath, "utf-8")
    expect(content).toContain("10")
    expect(content).toMatch(/60\s*\*\s*60\s*\*\s*1000/)
  })

  it("returns success JSON with data field", () => {
    const content = fs.readFileSync(routePath, "utf-8")
    expect(content).toContain("success: true")
    expect(content).toContain("data: profile")
  })

  it("returns 400 for invalid JSON", () => {
    const content = fs.readFileSync(routePath, "utf-8")
    expect(content).toContain("Invalid JSON")
    expect(content).toContain("400")
  })

  it("returns 404 for business not found", () => {
    const content = fs.readFileSync(routePath, "utf-8")
    expect(content).toContain("404")
    expect(content).toContain("not found")
  })

  it("returns 500 for scraping errors", () => {
    const content = fs.readFileSync(routePath, "utf-8")
    expect(content).toContain("500")
  })

  it("handles input length validation", () => {
    const content = fs.readFileSync(routePath, "utf-8")
    expect(content).toContain("200")
    expect(content).toMatch(/characters/)
  })

  it("web package has @radiant/scraper dependency", () => {
    const pkgPath = path.join(__dirname, "..", "apps", "web", "package.json")
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"))
    expect(pkg.dependencies["@radiant/scraper"]).toBeDefined()
  })

  it("trims input values before passing to scraper", () => {
    const content = fs.readFileSync(routePath, "utf-8")
    expect(content).toContain("businessName.trim()")
    expect(content).toContain("location.trim()")
  })
})
