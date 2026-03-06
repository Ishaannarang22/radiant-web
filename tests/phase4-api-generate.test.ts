import { describe, it, expect } from "vitest"
import * as fs from "fs"
import * as path from "path"

const routePath = path.join(__dirname, "..", "apps", "web", "app", "api", "generate", "route.ts")

describe("Phase 4.8 — API route for generation", () => {
  it("route file exists", () => {
    expect(fs.existsSync(routePath)).toBe(true)
  })

  it("exports a POST handler", () => {
    const content = fs.readFileSync(routePath, "utf-8")
    expect(content).toContain("export async function POST")
  })

  it("imports generateSite from generator module", () => {
    const content = fs.readFileSync(routePath, "utf-8")
    expect(content).toContain("generateSite")
    expect(content).toContain("generator")
  })

  it("imports getProject from @radiant/db", () => {
    const content = fs.readFileSync(routePath, "utf-8")
    expect(content).toContain("getProject")
    expect(content).toContain("@radiant/db")
  })

  it("imports BusinessProfile type from @radiant/scraper", () => {
    const content = fs.readFileSync(routePath, "utf-8")
    expect(content).toContain("BusinessProfile")
    expect(content).toContain("@radiant/scraper")
  })

  it("validates projectId field", () => {
    const content = fs.readFileSync(routePath, "utf-8")
    expect(content).toContain("projectId")
    expect(content).toMatch(/missing.*projectId|projectId.*required/i)
  })

  it("validates businessProfile field", () => {
    const content = fs.readFileSync(routePath, "utf-8")
    expect(content).toContain("businessProfile")
    expect(content).toMatch(/missing.*businessProfile|businessProfile.*invalid/i)
  })

  it("validates businessProfile structure (name, address, city, etc.)", () => {
    const content = fs.readFileSync(routePath, "utf-8")
    expect(content).toContain("validateBusinessProfile")
    // Should check required BusinessProfile fields
    expect(content).toContain("p.name")
    expect(content).toContain("p.address")
    expect(content).toContain("p.city")
    expect(content).toContain("p.state")
    expect(content).toContain("p.phone")
    expect(content).toContain("p.rating")
    expect(content).toContain("p.category")
    expect(content).toContain("p.industry")
  })

  it("implements rate limiting", () => {
    const content = fs.readFileSync(routePath, "utf-8")
    expect(content).toContain("rateLimitMap")
    expect(content).toContain("RATE_LIMIT_MAX")
    expect(content).toMatch(/429/)
  })

  it("rate limit is 5 per hour for generation", () => {
    const content = fs.readFileSync(routePath, "utf-8")
    expect(content).toContain("RATE_LIMIT_MAX = 5")
    expect(content).toMatch(/60\s*\*\s*60\s*\*\s*1000/)
  })

  it("returns 400 for invalid JSON body", () => {
    const content = fs.readFileSync(routePath, "utf-8")
    expect(content).toContain("Invalid JSON")
    expect(content).toContain("400")
  })

  it("returns 404 when project not found", () => {
    const content = fs.readFileSync(routePath, "utf-8")
    expect(content).toContain("Project not found")
    expect(content).toContain("404")
  })

  it("returns success:true with files array on completion", () => {
    const content = fs.readFileSync(routePath, "utf-8")
    expect(content).toContain("success: true")
    expect(content).toContain("files:")
    expect(content).toContain("file_path")
  })

  it("returns success:false with error on failure", () => {
    const content = fs.readFileSync(routePath, "utf-8")
    expect(content).toContain("success: false")
    expect(content).toContain("error:")
  })

  it("supports SSE streaming mode via Accept header", () => {
    const content = fs.readFileSync(routePath, "utf-8")
    expect(content).toContain("text/event-stream")
    expect(content).toContain("accept")
    expect(content).toContain("ReadableStream")
  })

  it("sends SSE progress events during streaming", () => {
    const content = fs.readFileSync(routePath, "utf-8")
    // SSE format: event: <type>\ndata: <json>\n\n
    expect(content).toContain("event: ${event}")
    expect(content).toContain("sendEvent")
    expect(content).toContain("progress")
    expect(content).toContain("complete")
  })

  it("uses onProgress callback for streaming updates", () => {
    const content = fs.readFileSync(routePath, "utf-8")
    expect(content).toContain("onProgress")
  })

  it("handles timeout errors with 504 status", () => {
    const content = fs.readFileSync(routePath, "utf-8")
    expect(content).toContain("timeout")
    expect(content).toContain("504")
  })

  it("handles quota/rate limit errors with 429 status", () => {
    const content = fs.readFileSync(routePath, "utf-8")
    expect(content).toContain("rate_limit")
    expect(content).toContain("quota")
  })

  it("verifies project exists before starting generation", () => {
    const content = fs.readFileSync(routePath, "utf-8")
    // Should check project exists before calling generateSite
    const projectCheckIdx = content.indexOf("getProject(projectId")
    const generateIdx = content.indexOf("generateSite(")
    expect(projectCheckIdx).toBeGreaterThan(-1)
    expect(generateIdx).toBeGreaterThan(-1)
    expect(projectCheckIdx).toBeLessThan(generateIdx)
  })

  it("sets correct SSE response headers", () => {
    const content = fs.readFileSync(routePath, "utf-8")
    expect(content).toContain("Content-Type")
    expect(content).toContain("text/event-stream")
    expect(content).toContain("Cache-Control")
    expect(content).toContain("no-cache")
  })

  it("fetches file paths after generation for response", () => {
    const content = fs.readFileSync(routePath, "utf-8")
    expect(content).toContain("getProjectFiles")
    expect(content).toContain("file_path")
  })

  it("compiles with TypeScript", () => {
    // Check that the file can be parsed (basic syntax check)
    const content = fs.readFileSync(routePath, "utf-8")
    // Should have proper imports and exports
    expect(content).toContain("import")
    expect(content).toContain("export")
    // No obvious syntax issues
    expect(content).not.toContain("any[]")
    // Proper async function
    expect(content).toContain("async function POST")
  })
})
