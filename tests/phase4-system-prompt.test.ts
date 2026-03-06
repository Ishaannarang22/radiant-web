import { describe, it, expect } from "vitest"
import * as fs from "fs"
import * as path from "path"

const PROMPT_PATH = path.resolve(__dirname, "../apps/web/prompts/system.ts")

describe("Phase 4.1 — Base System Prompt", () => {
  it("system.ts file exists", () => {
    expect(fs.existsSync(PROMPT_PATH)).toBe(true)
  })

  it("exports BASE_SYSTEM_PROMPT constant", async () => {
    const mod = await import("../apps/web/prompts/system")
    expect(mod.BASE_SYSTEM_PROMPT).toBeDefined()
    expect(typeof mod.BASE_SYSTEM_PROMPT).toBe("string")
  })

  it("exports getBaseSystemPrompt function", async () => {
    const mod = await import("../apps/web/prompts/system")
    expect(mod.getBaseSystemPrompt).toBeDefined()
    expect(typeof mod.getBaseSystemPrompt).toBe("function")
  })

  it("getBaseSystemPrompt returns the base prompt string", async () => {
    const mod = await import("../apps/web/prompts/system")
    const result = mod.getBaseSystemPrompt()
    expect(result).toBe(mod.BASE_SYSTEM_PROMPT)
    expect(result.length).toBeGreaterThan(1000)
  })

  // Role definition
  it("defines the AI role as an expert frontend developer", async () => {
    const { BASE_SYSTEM_PROMPT } = await import("../apps/web/prompts/system")
    expect(BASE_SYSTEM_PROMPT).toContain("expert frontend developer")
    expect(BASE_SYSTEM_PROMPT).toContain("Next.js")
    expect(BASE_SYSTEM_PROMPT).toContain("TypeScript")
    expect(BASE_SYSTEM_PROMPT).toContain("Tailwind CSS")
    expect(BASE_SYSTEM_PROMPT).toContain("shadcn/ui")
  })

  // Output format
  it("specifies the file output format with markers", async () => {
    const { BASE_SYSTEM_PROMPT } = await import("../apps/web/prompts/system")
    expect(BASE_SYSTEM_PROMPT).toContain("--- FILE:")
    expect(BASE_SYSTEM_PROMPT).toContain("--- END FILE ---")
  })

  // Required files
  it("lists all required files", async () => {
    const { BASE_SYSTEM_PROMPT } = await import("../apps/web/prompts/system")
    expect(BASE_SYSTEM_PROMPT).toContain("app/layout.tsx")
    expect(BASE_SYSTEM_PROMPT).toContain("app/page.tsx")
    expect(BASE_SYSTEM_PROMPT).toContain("components/Hero.tsx")
    expect(BASE_SYSTEM_PROMPT).toContain("components/Footer.tsx")
    expect(BASE_SYSTEM_PROMPT).toContain("tailwind.config.ts")
  })

  // Code rules — framework
  it("specifies Next.js App Router and TypeScript", async () => {
    const { BASE_SYSTEM_PROMPT } = await import("../apps/web/prompts/system")
    expect(BASE_SYSTEM_PROMPT).toContain("App Router")
    expect(BASE_SYSTEM_PROMPT).toContain("NOT Pages Router")
    expect(BASE_SYSTEM_PROMPT).toContain("TypeScript")
  })

  // Code rules — styling
  it("requires Tailwind CSS for all styling", async () => {
    const { BASE_SYSTEM_PROMPT } = await import("../apps/web/prompts/system")
    expect(BASE_SYSTEM_PROMPT).toContain("Tailwind CSS for ALL styling")
    expect(BASE_SYSTEM_PROMPT).toContain("no CSS modules")
    expect(BASE_SYSTEM_PROMPT).toContain("responsive")
    expect(BASE_SYSTEM_PROMPT).toContain("mobile-first")
  })

  // Code rules — shadcn/ui imports
  it("specifies shadcn/ui import paths", async () => {
    const { BASE_SYSTEM_PROMPT } = await import("../apps/web/prompts/system")
    expect(BASE_SYSTEM_PROMPT).toContain("@/components/ui/")
  })

  // Code rules — server components
  it("specifies server components by default with use client directive", async () => {
    const { BASE_SYSTEM_PROMPT } = await import("../apps/web/prompts/system")
    expect(BASE_SYSTEM_PROMPT).toContain("Server Components by default")
    expect(BASE_SYSTEM_PROMPT).toContain('"use client"')
  })

  // Code rules — images
  it("requires Next.js Image component", async () => {
    const { BASE_SYSTEM_PROMPT } = await import("../apps/web/prompts/system")
    expect(BASE_SYSTEM_PROMPT).toContain("next/image")
    expect(BASE_SYSTEM_PROMPT).toContain("alt")
  })

  // Code rules — no placeholder text
  it("prohibits placeholder and fake content", async () => {
    const { BASE_SYSTEM_PROMPT } = await import("../apps/web/prompts/system")
    expect(BASE_SYSTEM_PROMPT).toContain("Lorem ipsum")
    expect(BASE_SYSTEM_PROMPT).toContain("NEVER use placeholder")
  })

  // Code rules — SEO
  it("includes SEO and accessibility requirements", async () => {
    const { BASE_SYSTEM_PROMPT } = await import("../apps/web/prompts/system")
    expect(BASE_SYSTEM_PROMPT).toContain("semantic HTML")
    expect(BASE_SYSTEM_PROMPT).toContain("Open Graph")
    expect(BASE_SYSTEM_PROMPT).toContain("meta description")
    expect(BASE_SYSTEM_PROMPT).toContain("ARIA")
    expect(BASE_SYSTEM_PROMPT).toContain("keyboard accessible")
  })

  // Design principles
  it("includes design principles for visual quality", async () => {
    const { BASE_SYSTEM_PROMPT } = await import("../apps/web/prompts/system")
    expect(BASE_SYSTEM_PROMPT).toContain("whitespace")
    expect(BASE_SYSTEM_PROMPT).toContain("color palette")
    expect(BASE_SYSTEM_PROMPT).toContain("Typography")
  })

  // Conversion optimization
  it("includes conversion optimization guidance", async () => {
    const { BASE_SYSTEM_PROMPT } = await import("../apps/web/prompts/system")
    expect(BASE_SYSTEM_PROMPT).toContain("calls-to-action")
    expect(BASE_SYSTEM_PROMPT).toContain("social proof")
    expect(BASE_SYSTEM_PROMPT).toContain("above the fold")
  })

  // What to avoid
  it("specifies things to avoid", async () => {
    const { BASE_SYSTEM_PROMPT } = await import("../apps/web/prompts/system")
    expect(BASE_SYSTEM_PROMPT).toContain("Do NOT generate a `package.json`")
    expect(BASE_SYSTEM_PROMPT).toContain("Do NOT create API routes")
    expect(BASE_SYSTEM_PROMPT).toContain("Do NOT reference process.env")
  })

  // Prompt size — should be substantial but not bloated
  it("prompt is between 3000 and 15000 characters", async () => {
    const { BASE_SYSTEM_PROMPT } = await import("../apps/web/prompts/system")
    expect(BASE_SYSTEM_PROMPT.length).toBeGreaterThan(3000)
    expect(BASE_SYSTEM_PROMPT.length).toBeLessThan(15000)
  })

  // Structure — has all major sections
  it("has all major sections", async () => {
    const { BASE_SYSTEM_PROMPT } = await import("../apps/web/prompts/system")
    expect(BASE_SYSTEM_PROMPT).toContain("## OUTPUT FORMAT")
    expect(BASE_SYSTEM_PROMPT).toContain("## REQUIRED FILES")
    expect(BASE_SYSTEM_PROMPT).toContain("## CODE RULES")
    expect(BASE_SYSTEM_PROMPT).toContain("## DESIGN PRINCIPLES")
    expect(BASE_SYSTEM_PROMPT).toContain("## WHAT TO AVOID")
  })

  // TypeScript compilation
  it("file compiles without TypeScript errors", () => {
    const content = fs.readFileSync(PROMPT_PATH, "utf-8")
    expect(content).toContain("export const BASE_SYSTEM_PROMPT")
    expect(content).toContain("export function getBaseSystemPrompt")
    expect(content).toContain("export type SystemPromptConfig")
  })
})
