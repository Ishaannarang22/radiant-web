import { describe, it, expect } from "vitest"
import * as fs from "fs"
import * as path from "path"

const pagePath = path.join(__dirname, "..", "apps", "web", "app", "generate", "page.tsx")
const componentPath = path.join(__dirname, "..", "apps", "web", "components", "generate", "generation-flow.tsx")
const projectsApiPath = path.join(__dirname, "..", "apps", "web", "app", "api", "projects", "route.ts")

describe("Phase 5.2 — Generation Flow UI", () => {
  // ── File existence ──────────────────────────────────────
  it("generate page exists", () => {
    expect(fs.existsSync(pagePath)).toBe(true)
  })

  it("generation-flow component exists", () => {
    expect(fs.existsSync(componentPath)).toBe(true)
  })

  it("projects API route exists", () => {
    expect(fs.existsSync(projectsApiPath)).toBe(true)
  })

  // ── Page file ───────────────────────────────────────────
  describe("generate/page.tsx", () => {
    const content = fs.readFileSync(pagePath, "utf-8")

    it("imports GenerationFlow component", () => {
      expect(content).toContain("GenerationFlow")
    })

    it("exports metadata with title", () => {
      expect(content).toContain("metadata")
      expect(content).toContain("Generate a Website")
    })

    it("renders GenerationFlow", () => {
      expect(content).toContain("<GenerationFlow")
    })
  })

  // ── GenerationFlow component ────────────────────────────
  describe("generation-flow.tsx", () => {
    const content = fs.readFileSync(componentPath, "utf-8")

    it("is a client component", () => {
      expect(content).toMatch(/^"use client"/)
    })

    it("exports GenerationFlow function", () => {
      expect(content).toContain("export function GenerationFlow")
    })

    // ── Step 1: Input ────────────────────────────────────
    describe("Step 1: Input", () => {
      it("has a business name input", () => {
        expect(content).toContain("Business Name")
        expect(content).toContain('placeholder')
        expect(content).toContain("Joe's Pizza")
      })

      it("has a location input", () => {
        expect(content).toContain("Location")
        expect(content).toContain("New York, NY")
      })

      it("has a Find Business / submit button", () => {
        expect(content).toContain("Find Business")
      })

      it("disables button when inputs are empty", () => {
        expect(content).toContain("disabled={!canSubmit}")
      })
    })

    // ── Step 2: Scraping ─────────────────────────────────
    describe("Step 2: Scraping", () => {
      it("shows searching progress stages", () => {
        expect(content).toContain("Finding business on Google")
        expect(content).toContain("Scraping website content")
        expect(content).toContain("Analyzing business data")
      })

      it("uses animated loader", () => {
        expect(content).toContain("animate-spin")
      })

      it("shows checkmarks for completed stages", () => {
        expect(content).toContain("CheckCircle2")
      })
    })

    // ── Step 3: Confirm ──────────────────────────────────
    describe("Step 3: Confirm business", () => {
      it("displays business name", () => {
        expect(content).toContain("business.name")
      })

      it("displays business rating with star", () => {
        expect(content).toContain("business.rating")
        expect(content).toContain("Star")
      })

      it("displays business address", () => {
        expect(content).toContain("business.address")
      })

      it("displays business phone", () => {
        expect(content).toContain("business.phone")
      })

      it("has confirm (Generate Website) button", () => {
        expect(content).toContain("Generate Website")
      })

      it("has a Search Again / back button", () => {
        expect(content).toContain("Search Again")
      })

      it("shows business photo if available", () => {
        expect(content).toContain("business.photos[0].url")
      })
    })

    // ── Step 4: Generating ───────────────────────────────
    describe("Step 4: Generating", () => {
      it("shows a progress bar", () => {
        expect(content).toContain("displayPercent")
        // progress bar width binding
        expect(content).toContain("width:")
      })

      it("shows generation stages", () => {
        expect(content).toContain("Preparing AI context")
        expect(content).toContain("Building your website")
        expect(content).toContain("Assembling site files")
        expect(content).toContain("Saving to database")
      })

      it("displays progress percentage", () => {
        expect(content).toContain("displayPercent")
        expect(content).toContain("%")
      })

      it("mentions estimated time", () => {
        expect(content).toContain("30 seconds")
      })
    })

    // ── Step 5: Done ─────────────────────────────────────
    describe("Step 5: Done", () => {
      it("shows success message", () => {
        expect(content).toContain("Your website is ready")
      })

      it("has link to preview page", () => {
        expect(content).toContain("/preview/")
      })

      it("redirects to preview", () => {
        expect(content).toContain("router.push")
        expect(content).toContain("/preview/")
      })
    })

    // ── Step indicator ───────────────────────────────────
    describe("Step indicator", () => {
      it("shows 4 step labels", () => {
        expect(content).toContain('"Search"')
        expect(content).toContain('"Confirm"')
        expect(content).toContain('"Generate"')
        expect(content).toContain('"Preview"')
      })
    })

    // ── API integration ──────────────────────────────────
    describe("API integration", () => {
      it("calls /api/scrape endpoint", () => {
        expect(content).toContain("/api/scrape")
      })

      it("calls /api/projects endpoint to create project", () => {
        expect(content).toContain("/api/projects")
      })

      it("calls /api/generate endpoint", () => {
        expect(content).toContain("/api/generate")
      })

      it("uses SSE streaming (text/event-stream)", () => {
        expect(content).toContain("text/event-stream")
      })

      it("parses SSE progress events", () => {
        expect(content).toContain('event: ')
        expect(content).toContain('"progress"')
        expect(content).toContain('"complete"')
        expect(content).toContain('"error"')
      })
    })

    // ── Error handling ───────────────────────────────────
    describe("Error handling", () => {
      it("displays error messages", () => {
        expect(content).toContain("XCircle")
        expect(content).toContain("error")
      })

      it("supports abort controller for cleanup", () => {
        expect(content).toContain("AbortController")
        expect(content).toContain("abortRef")
      })
    })

    // ── Design consistency ───────────────────────────────
    describe("Design consistency", () => {
      it("uses dark theme background", () => {
        expect(content).toContain("bg-[#09090b]")
      })

      it("uses amber/orange gradient for CTAs", () => {
        expect(content).toContain("from-amber-400")
        expect(content).toContain("to-orange-500")
      })

      it("uses Radiant branding in nav", () => {
        expect(content).toContain("Radiant")
        expect(content).toContain("Zap")
      })

      it("uses shadcn Button component", () => {
        expect(content).toContain("@/components/ui/button")
      })

      it("uses shadcn Input component", () => {
        expect(content).toContain("@/components/ui/input")
      })
    })
  })

  // ── Projects API route ──────────────────────────────────
  describe("api/projects/route.ts", () => {
    const content = fs.readFileSync(projectsApiPath, "utf-8")

    it("exports a POST handler", () => {
      expect(content).toContain("export async function POST")
    })

    it("imports createProject from @radiant/db", () => {
      expect(content).toContain("createProject")
      expect(content).toContain("@radiant/db")
    })

    it("validates businessName", () => {
      expect(content).toContain("businessName")
      expect(content).toContain("Missing required field")
    })

    it("generates a subdomain slug", () => {
      expect(content).toContain("slugify")
      expect(content).toContain("subdomain")
    })

    it("returns projectId on success", () => {
      expect(content).toContain("projectId")
      expect(content).toContain("project.id")
    })
  })
})
