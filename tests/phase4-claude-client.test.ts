import { describe, it, expect, vi, beforeEach } from "vitest"
import * as fs from "fs"
import * as path from "path"

const filePath = path.resolve(__dirname, "../apps/web/lib/claude.ts")
const fileContent = fs.readFileSync(filePath, "utf-8")

// ── File existence & structure ──────────────────────────

describe("4.5 Claude API Client — File & Exports", () => {
  it("claude.ts exists", () => {
    expect(fs.existsSync(filePath)).toBe(true)
  })

  it("imports @anthropic-ai/sdk", () => {
    expect(fileContent).toContain("@anthropic-ai/sdk")
  })

  it("exports generateWebsite function", () => {
    expect(fileContent).toContain("export async function generateWebsite")
  })

  it("exports GenerationResult type", () => {
    expect(fileContent).toContain("export interface GenerationResult")
  })

  it("exports GeneratedFile type", () => {
    expect(fileContent).toContain("export interface GeneratedFile")
  })

  it("exports parseFileBlocks function", () => {
    expect(fileContent).toContain("export function parseFileBlocks")
  })

  it("exports DEFAULT_MODEL constant", () => {
    expect(fileContent).toContain("DEFAULT_MODEL")
  })

  it("exports DEFAULT_MAX_TOKENS constant", () => {
    expect(fileContent).toContain("DEFAULT_MAX_TOKENS")
  })

  it("exports DEFAULT_TEMPERATURE constant", () => {
    expect(fileContent).toContain("DEFAULT_TEMPERATURE")
  })
})

// ── Types structure ─────────────────────────────────────

describe("4.5 Claude API Client — Types", () => {
  it("GeneratedFile has path and content fields", () => {
    expect(fileContent).toContain("path: string")
    expect(fileContent).toContain("content: string")
  })

  it("GenerationResult has files array", () => {
    expect(fileContent).toContain("files: GeneratedFile[]")
  })

  it("GenerationResult has tokensUsed with input and output", () => {
    expect(fileContent).toContain("tokensUsed:")
    expect(fileContent).toContain("input: number")
    expect(fileContent).toContain("output: number")
  })

  it("GenerationResult has duration field", () => {
    expect(fileContent).toContain("duration: number")
  })

  it("GenerationResult has rawResponse field", () => {
    expect(fileContent).toContain("rawResponse: string")
  })
})

// ── Configuration defaults ──────────────────────────────

describe("4.5 Claude API Client — Defaults", () => {
  it("uses claude-sonnet-4-6 as default model", async () => {
    const mod = await import("../apps/web/lib/claude")
    expect(mod.DEFAULT_MODEL).toBe("claude-sonnet-4-6")
  })

  it("uses 16384 as default max tokens", async () => {
    const mod = await import("../apps/web/lib/claude")
    expect(mod.DEFAULT_MAX_TOKENS).toBe(16384)
  })

  it("uses 0.3 as default temperature", async () => {
    const mod = await import("../apps/web/lib/claude")
    expect(mod.DEFAULT_TEMPERATURE).toBe(0.3)
  })
})

// ── parseFileBlocks unit tests ──────────────────────────

describe("4.5 Claude API Client — parseFileBlocks", () => {
  it("can be imported", async () => {
    const mod = await import("../apps/web/lib/claude")
    expect(typeof mod.parseFileBlocks).toBe("function")
  })

  it("parses single file block", async () => {
    const mod = await import("../apps/web/lib/claude")
    const raw = `--- FILE: app/page.tsx ---
export default function Home() {
  return <div>Hello</div>
}
--- END FILE ---`
    const files = mod.parseFileBlocks(raw)
    expect(files).toHaveLength(1)
    expect(files[0].path).toBe("app/page.tsx")
    expect(files[0].content).toContain("export default function Home()")
  })

  it("parses multiple file blocks", async () => {
    const mod = await import("../apps/web/lib/claude")
    const raw = `--- FILE: app/layout.tsx ---
export default function Layout({ children }) {
  return <html><body>{children}</body></html>
}
--- END FILE ---

--- FILE: app/page.tsx ---
export default function Home() {
  return <div>Hello</div>
}
--- END FILE ---

--- FILE: components/Hero.tsx ---
export function Hero() {
  return <section>Hero</section>
}
--- END FILE ---`
    const files = mod.parseFileBlocks(raw)
    expect(files).toHaveLength(3)
    expect(files[0].path).toBe("app/layout.tsx")
    expect(files[1].path).toBe("app/page.tsx")
    expect(files[2].path).toBe("components/Hero.tsx")
  })

  it("returns empty array for no file blocks", async () => {
    const mod = await import("../apps/web/lib/claude")
    const files = mod.parseFileBlocks("Just some text with no file blocks")
    expect(files).toHaveLength(0)
  })

  it("handles file blocks with code fences inside content", async () => {
    const mod = await import("../apps/web/lib/claude")
    const raw = `--- FILE: tailwind.config.ts ---
import type { Config } from "tailwindcss"

const config: Config = {
  content: ["./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#D4382C",
      },
    },
  },
}
export default config
--- END FILE ---`
    const files = mod.parseFileBlocks(raw)
    expect(files).toHaveLength(1)
    expect(files[0].path).toBe("tailwind.config.ts")
    expect(files[0].content).toContain("primary: \"#D4382C\"")
  })

  it("trims trailing whitespace from content", async () => {
    const mod = await import("../apps/web/lib/claude")
    const raw = `--- FILE: app/page.tsx ---
export default function Home() {
  return <div>Hello</div>
}

--- END FILE ---`
    const files = mod.parseFileBlocks(raw)
    expect(files[0].content).not.toMatch(/\s+$/)
  })

  it("preserves file path with nested directories", async () => {
    const mod = await import("../apps/web/lib/claude")
    const raw = `--- FILE: components/ui/special/card.tsx ---
export function Card() { return <div /> }
--- END FILE ---`
    const files = mod.parseFileBlocks(raw)
    expect(files[0].path).toBe("components/ui/special/card.tsx")
  })
})

// ── generateWebsite function structure ──────────────────

describe("4.5 Claude API Client — generateWebsite structure", () => {
  it("accepts systemPrompt and userPrompt parameters", () => {
    expect(fileContent).toContain("systemPrompt: string")
    expect(fileContent).toContain("userPrompt: string")
  })

  it("supports optional model override", () => {
    expect(fileContent).toContain("model?:")
  })

  it("supports optional maxTokens override", () => {
    expect(fileContent).toContain("maxTokens?:")
  })

  it("supports optional temperature override", () => {
    expect(fileContent).toContain("temperature?:")
  })

  it("returns a Promise<GenerationResult>", () => {
    expect(fileContent).toContain("Promise<GenerationResult>")
  })

  it("tracks duration with Date.now()", () => {
    expect(fileContent).toContain("Date.now()")
  })

  it("calls anthropic.messages.create", () => {
    expect(fileContent).toContain("messages.create")
  })

  it("passes system prompt as system parameter", () => {
    expect(fileContent).toContain("system: systemPrompt")
  })

  it("extracts text blocks from response", () => {
    expect(fileContent).toContain("block.type === \"text\"")
  })

  it("extracts token usage from response", () => {
    expect(fileContent).toContain("response.usage.input_tokens")
    expect(fileContent).toContain("response.usage.output_tokens")
  })

  it("calls parseFileBlocks on raw response", () => {
    expect(fileContent).toContain("parseFileBlocks(rawResponse)")
  })
})

// ── Client initialization ───────────────────────────────

describe("4.5 Claude API Client — Client initialization", () => {
  it("checks for ANTHROPIC_API_KEY env var", () => {
    expect(fileContent).toContain("ANTHROPIC_API_KEY")
  })

  it("throws error when API key is missing", () => {
    expect(fileContent).toContain("ANTHROPIC_API_KEY environment variable is not set")
  })

  it("creates Anthropic client with apiKey", () => {
    expect(fileContent).toContain("new Anthropic(")
  })

  it("uses singleton pattern for client", () => {
    // Check for singleton pattern (client variable reuse)
    expect(fileContent).toContain("let client")
    expect(fileContent).toContain("if (!client)")
  })
})

// ── TypeScript compilation check ────────────────────────

describe("4.5 Claude API Client — TypeScript compilation", () => {
  it("compiles without errors", async () => {
    const { execSync } = await import("child_process")
    const result = execSync(
      "npx tsc --noEmit --strict apps/web/lib/claude.ts --moduleResolution bundler --module esnext --target es2017 --skipLibCheck --esModuleInterop",
      { cwd: path.resolve(__dirname, ".."), encoding: "utf-8", timeout: 30000 }
    )
    // If we get here without throwing, compilation succeeded
    expect(true).toBe(true)
  })
})

// ── Package dependency check ────────────────────────────

describe("4.5 Claude API Client — Dependencies", () => {
  it("@anthropic-ai/sdk is in web app dependencies", () => {
    const pkgPath = path.resolve(__dirname, "../apps/web/package.json")
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"))
    expect(
      pkg.dependencies?.["@anthropic-ai/sdk"] || pkg.devDependencies?.["@anthropic-ai/sdk"]
    ).toBeDefined()
  })
})
