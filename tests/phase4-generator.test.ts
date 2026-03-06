import { describe, it, expect, vi, beforeEach } from "vitest"
import type { BusinessProfile } from "@radiant/scraper"

// ── Set env vars using vi.hoisted (runs before all imports) ──
vi.hoisted(() => {
  process.env.SUPABASE_URL = process.env.SUPABASE_URL || "https://test.supabase.co"
  process.env.SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "test-anon-key"
  process.env.SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "test-service-key"
  process.env.ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || "test-anthropic-key"
})

// ── Mock all dependencies before importing ───────────────

// Mock the actual resolved module paths for workspace package
vi.mock("../packages/db/queries", () => ({
  updateProject: vi.fn().mockResolvedValue({ id: "proj-1", status: "generating" }),
  upsertProjectFiles: vi.fn().mockResolvedValue([]),
  logGeneration: vi.fn().mockResolvedValue({ id: "gen-1" }),
  createProject: vi.fn(),
  getProject: vi.fn(),
  getProjectsByUser: vi.fn(),
  getProjectFiles: vi.fn(),
  upsertBusiness: vi.fn(),
  getBusinessByPlaceId: vi.fn(),
  getGenerationsByProject: vi.fn(),
  searchComponents: vi.fn(),
  searchTemplates: vi.fn(),
  searchPatterns: vi.fn(),
}))

vi.mock("../apps/web/lib/prompt-builder", () => ({
  buildGenerationPrompt: vi.fn().mockResolvedValue({
    system: "You are a web developer.",
    user: "Generate a website for Test Biz.",
  }),
}))

vi.mock("../apps/web/lib/claude", () => ({
  generateWebsite: vi.fn().mockResolvedValue({
    files: [
      { path: "app/layout.tsx", content: 'export default function Layout({children}) { return <html>{children}</html> }' },
      { path: "app/page.tsx", content: 'export default function Home() { return <div>Test Biz</div> }' },
    ],
    tokensUsed: { input: 1000, output: 2000 },
    duration: 5000,
    rawResponse: `--- FILE: app/layout.tsx ---
export default function Layout({children}: {children: React.ReactNode}) {
  return <html><body>{children}</body></html>
}
--- END FILE ---
--- FILE: app/page.tsx ---
export default function Home() {
  return <div>Test Biz</div>
}
--- END FILE ---`,
  }),
}))

vi.mock("../apps/web/lib/parser", () => {
  const actual = vi.importActual("../apps/web/lib/parser")
  return {
    ...actual,
    parseAndValidate: vi.fn().mockReturnValue({
      files: [
        { path: "app/layout.tsx", content: 'export default function Layout({children}: {children: React.ReactNode}) {\n  return <html><body>{children}</body></html>\n}' },
        { path: "app/page.tsx", content: 'export default function Home() {\n  return <div>Test Biz</div>\n}' },
      ],
      valid: true,
      errors: [],
    }),
    buildFixPrompt: vi.fn().mockReturnValue("Fix these issues..."),
  }
})

import { generateSite, type GenerationProgress } from "../apps/web/lib/generator"
import { updateProject, upsertProjectFiles, logGeneration } from "../packages/db/queries"
import { buildGenerationPrompt } from "../apps/web/lib/prompt-builder"
import { generateWebsite } from "../apps/web/lib/claude"
import { parseAndValidate, buildFixPrompt } from "../apps/web/lib/parser"
import * as fs from "fs"
import * as path from "path"

// ── Test fixture ─────────────────────────────────────────

const mockProfile: BusinessProfile = {
  name: "Test Biz",
  address: "123 Test St, Austin, TX 78701",
  city: "Austin",
  state: "TX",
  phone: "(512) 555-0100",
  rating: 4.5,
  reviewCount: 42,
  category: "Restaurant",
  industry: "restaurant",
  hours: [{ day: "Monday", open: "9:00 AM", close: "5:00 PM" }],
  photos: [{ url: "https://example.com/photo.jpg", width: 800, height: 600 }],
  reviews: [{ author: "Alice", rating: 5, text: "Great food!", date: "2024-01-01" }],
  location: { lat: 30.2672, lng: -97.7431 },
}

// ── Tests ────────────────────────────────────────────────

describe("Phase 4.7: Generation Orchestrator", () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // Re-establish default mock implementations
    vi.mocked(updateProject).mockResolvedValue({ id: "proj-1", status: "generating" } as any)
    vi.mocked(upsertProjectFiles).mockResolvedValue([])
    vi.mocked(logGeneration).mockResolvedValue({ id: "gen-1" } as any)
    vi.mocked(buildGenerationPrompt).mockResolvedValue({
      system: "You are a web developer.",
      user: "Generate a website for Test Biz.",
    })
    vi.mocked(generateWebsite).mockResolvedValue({
      files: [
        { path: "app/layout.tsx", content: 'export default function Layout({children}) { return <html>{children}</html> }' },
        { path: "app/page.tsx", content: 'export default function Home() { return <div>Test Biz</div> }' },
      ],
      tokensUsed: { input: 1000, output: 2000 },
      duration: 5000,
      rawResponse: `--- FILE: app/layout.tsx ---\nexport default function Layout({children}: {children: React.ReactNode}) {\n  return <html><body>{children}</body></html>\n}\n--- END FILE ---\n--- FILE: app/page.tsx ---\nexport default function Home() {\n  return <div>Test Biz</div>\n}\n--- END FILE ---`,
    })
    vi.mocked(parseAndValidate).mockReturnValue({
      files: [
        { path: "app/layout.tsx", content: 'export default function Layout({children}: {children: React.ReactNode}) {\n  return <html><body>{children}</body></html>\n}' },
        { path: "app/page.tsx", content: 'export default function Home() {\n  return <div>Test Biz</div>\n}' },
      ],
      valid: true,
      errors: [],
    })
    vi.mocked(buildFixPrompt).mockReturnValue("Fix these issues...")
  })

  describe("File structure", () => {
    it("generator.ts exists", () => {
      const filePath = path.resolve(__dirname, "../apps/web/lib/generator.ts")
      expect(fs.existsSync(filePath)).toBe(true)
    })

    it("exports generateSite function", () => {
      expect(typeof generateSite).toBe("function")
    })

    it("compiles without errors (via import)", () => {
      // If we got this far, it compiled
      expect(generateSite).toBeDefined()
    })
  })

  describe("Happy path — successful generation", () => {
    it("calls updateProject with 'generating' status first", async () => {
      await generateSite("proj-1", mockProfile)
      expect(updateProject).toHaveBeenCalledWith("proj-1", { status: "generating" })
    })

    it("calls buildGenerationPrompt with the profile", async () => {
      await generateSite("proj-1", mockProfile)
      expect(buildGenerationPrompt).toHaveBeenCalledWith(mockProfile)
    })

    it("calls generateWebsite with system and user prompts", async () => {
      await generateSite("proj-1", mockProfile)
      expect(generateWebsite).toHaveBeenCalledWith(
        "You are a web developer.",
        "Generate a website for Test Biz."
      )
    })

    it("calls parseAndValidate with raw response", async () => {
      await generateSite("proj-1", mockProfile)
      expect(parseAndValidate).toHaveBeenCalled()
      const call = vi.mocked(parseAndValidate).mock.calls[0]
      expect(call[0]).toContain("--- FILE: app/layout.tsx ---")
    })

    it("stores files in project_files table", async () => {
      await generateSite("proj-1", mockProfile)
      expect(upsertProjectFiles).toHaveBeenCalledWith(
        "proj-1",
        expect.arrayContaining([
          expect.objectContaining({ file_path: "app/layout.tsx", file_type: "tsx" }),
          expect.objectContaining({ file_path: "app/page.tsx", file_type: "tsx" }),
        ])
      )
    })

    it("logs generation with correct metadata", async () => {
      await generateSite("proj-1", mockProfile)
      expect(logGeneration).toHaveBeenCalledWith(
        "proj-1",
        expect.objectContaining({
          system_prompt: "You are a web developer.",
          user_prompt: "Generate a website for Test Biz.",
          prompt_hash: expect.any(String),
        }),
        expect.any(String), // raw response
        expect.objectContaining({
          tokens_input: 1000,
          tokens_output: 2000,
          duration_ms: 5000,
          status: "completed",
        })
      )
    })

    it("updates project status to 'preview' on success", async () => {
      await generateSite("proj-1", mockProfile)
      const calls = vi.mocked(updateProject).mock.calls
      expect(calls[calls.length - 1]).toEqual(["proj-1", { status: "preview" }])
    })

    it("calls steps in correct order", async () => {
      const callOrder: string[] = []
      vi.mocked(updateProject).mockImplementation(async (_id, updates) => {
        callOrder.push(`updateProject:${(updates as Record<string, string>).status}`)
        return {} as any
      })
      vi.mocked(buildGenerationPrompt).mockImplementation(async () => {
        callOrder.push("buildPrompt")
        return { system: "sys", user: "usr" }
      })
      vi.mocked(generateWebsite).mockImplementation(async () => {
        callOrder.push("generateWebsite")
        return {
          files: [],
          tokensUsed: { input: 100, output: 200 },
          duration: 1000,
          rawResponse: "--- FILE: app/layout.tsx ---\nexport default function L({children}: {children: React.ReactNode}) { return <html>{children}</html> }\n--- END FILE ---\n--- FILE: app/page.tsx ---\nexport default function P() { return <div>hi</div> }\n--- END FILE ---",
        }
      })
      vi.mocked(parseAndValidate).mockReturnValue({
        files: [
          { path: "app/layout.tsx", content: "..." },
          { path: "app/page.tsx", content: "..." },
        ],
        valid: true,
        errors: [],
      })

      await generateSite("proj-1", mockProfile)

      expect(callOrder[0]).toBe("updateProject:generating")
      expect(callOrder[1]).toBe("buildPrompt")
      expect(callOrder[2]).toBe("generateWebsite")
      // After generate: parse → store → log → updateProject:preview
      expect(callOrder[callOrder.length - 1]).toBe("updateProject:preview")
    })
  })

  describe("Retry on validation failure", () => {
    it("retries once when validation fails", async () => {
      let callCount = 0
      vi.mocked(parseAndValidate).mockImplementation(() => {
        callCount++
        if (callCount === 1) {
          return {
            files: [{ path: "app/page.tsx", content: "export default function P() { return <div>hi</div> }" }],
            valid: false,
            errors: [{ type: "missing_file", file: "app/layout.tsx", message: "Required file missing: app/layout.tsx" }],
          }
        }
        return {
          files: [
            { path: "app/layout.tsx", content: "export default function L({c}: {c: React.ReactNode}) { return <html>{c}</html> }" },
            { path: "app/page.tsx", content: "export default function P() { return <div>hi</div> }" },
          ],
          valid: true,
          errors: [],
        }
      })

      await generateSite("proj-1", mockProfile)

      expect(generateWebsite).toHaveBeenCalledTimes(2)
      expect(buildFixPrompt).toHaveBeenCalled()
    })

    it("does not retry more than maxRetries", async () => {
      vi.mocked(parseAndValidate).mockReturnValue({
        files: [
          { path: "app/layout.tsx", content: "..." },
          { path: "app/page.tsx", content: "..." },
        ],
        valid: false,
        errors: [{ type: "placeholder_content", file: "app/page.tsx", message: "Placeholder detected" }],
      })

      await generateSite("proj-1", mockProfile, { maxRetries: 2 })

      // 1 initial + 2 retries = 3 total calls
      expect(generateWebsite).toHaveBeenCalledTimes(3)
    })
  })

  describe("Error handling", () => {
    it("sets project status to 'failed' on API error", async () => {
      vi.mocked(generateWebsite).mockRejectedValue(new Error("API timeout"))

      await expect(generateSite("proj-1", mockProfile)).rejects.toThrow("API timeout")

      expect(updateProject).toHaveBeenCalledWith("proj-1", { status: "failed" })
    })

    it("logs failed generation with error details", async () => {
      vi.mocked(generateWebsite).mockRejectedValue(new Error("rate_limit exceeded"))

      await expect(generateSite("proj-1", mockProfile)).rejects.toThrow()

      expect(logGeneration).toHaveBeenCalledWith(
        "proj-1",
        expect.any(Object),
        null,
        expect.objectContaining({
          status: "failed",
          error: expect.stringContaining("Quota exceeded"),
        })
      )
    })

    it("throws when generation produces no files", async () => {
      vi.mocked(parseAndValidate).mockReturnValue({
        files: [],
        valid: false,
        errors: [{ type: "missing_file", file: "app/layout.tsx", message: "Required file missing" }],
      })

      await expect(generateSite("proj-1", mockProfile)).rejects.toThrow("no files")
    })

    it("classifies timeout errors correctly", async () => {
      vi.mocked(generateWebsite).mockRejectedValue(new Error("Request ETIMEDOUT"))

      await expect(generateSite("proj-1", mockProfile)).rejects.toThrow()

      expect(logGeneration).toHaveBeenCalledWith(
        "proj-1",
        expect.any(Object),
        null,
        expect.objectContaining({
          error: expect.stringContaining("API timeout"),
        })
      )
    })

    it("does not throw if logging the failure itself fails", async () => {
      vi.mocked(generateWebsite).mockRejectedValue(new Error("API error"))
      vi.mocked(logGeneration).mockRejectedValue(new Error("DB connection lost"))

      // Should still throw the original error, not the logging error
      await expect(generateSite("proj-1", mockProfile)).rejects.toThrow("API error")
    })
  })

  describe("Progress callback", () => {
    it("reports progress at each step", async () => {
      const steps: GenerationProgress[] = []
      await generateSite("proj-1", mockProfile, {
        onProgress: (p) => steps.push(p),
      })

      const stepNames = steps.map((s) => s.step)
      expect(stepNames).toContain("updating_status")
      expect(stepNames).toContain("building_prompts")
      expect(stepNames).toContain("calling_api")
      expect(stepNames).toContain("parsing_response")
      expect(stepNames).toContain("storing_files")
      expect(stepNames).toContain("logging_generation")
      expect(stepNames).toContain("complete")
    })

    it("reports retry progress", async () => {
      let callCount = 0
      vi.mocked(parseAndValidate).mockImplementation(() => {
        callCount++
        if (callCount === 1) {
          return {
            files: [{ path: "app/page.tsx", content: "export default function P() {}" }],
            valid: false,
            errors: [{ type: "missing_file", file: "app/layout.tsx", message: "missing" }],
          }
        }
        return {
          files: [
            { path: "app/layout.tsx", content: "export default function L({c}: {c: React.ReactNode}) {}" },
            { path: "app/page.tsx", content: "export default function P() {}" },
          ],
          valid: true,
          errors: [],
        }
      })

      const steps: GenerationProgress[] = []
      await generateSite("proj-1", mockProfile, {
        onProgress: (p) => steps.push(p),
      })

      const retryStep = steps.find((s) => s.step === "retrying")
      expect(retryStep).toBeDefined()
      expect(retryStep?.detail).toContain("Retry 1/1")
    })
  })

  describe("File type inference", () => {
    it("infers file types from extensions", async () => {
      vi.mocked(parseAndValidate).mockReturnValue({
        files: [
          { path: "app/layout.tsx", content: "export default function L({c}: {c: React.ReactNode}) {}" },
          { path: "app/page.tsx", content: "export default function P() {}" },
          { path: "app/globals.css", content: "@tailwind base;" },
          { path: "tailwind.config.ts", content: "export default {}" },
        ],
        valid: true,
        errors: [],
      })

      await generateSite("proj-1", mockProfile)

      const files = vi.mocked(upsertProjectFiles).mock.calls[0][1]
      const cssFile = files.find((f: any) => f.file_path === "app/globals.css")
      const tsFile = files.find((f: any) => f.file_path === "tailwind.config.ts")
      const tsxFile = files.find((f: any) => f.file_path === "app/layout.tsx")

      expect(cssFile?.file_type).toBe("css")
      expect(tsFile?.file_type).toBe("ts")
      expect(tsxFile?.file_type).toBe("tsx")
    })
  })

  describe("Prompt hashing", () => {
    it("generates a prompt hash and passes it to logGeneration", async () => {
      await generateSite("proj-1", mockProfile)

      const logCall = vi.mocked(logGeneration).mock.calls[0]
      const promptArg = logCall[1] as { prompt_hash?: string }
      expect(promptArg.prompt_hash).toBeDefined()
      expect(typeof promptArg.prompt_hash).toBe("string")
      expect(promptArg.prompt_hash!.length).toBe(16) // First 16 chars of SHA256
    })
  })
})
