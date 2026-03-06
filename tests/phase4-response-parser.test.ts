import { describe, it, expect } from "vitest"
import * as fs from "fs"
import * as path from "path"

const filePath = path.resolve(__dirname, "../apps/web/lib/parser.ts")
const fileContent = fs.readFileSync(filePath, "utf-8")

// ── File existence & exports ─────────────────────────────

describe("4.6 Response Parser — File & Exports", () => {
  it("parser.ts exists", () => {
    expect(fs.existsSync(filePath)).toBe(true)
  })

  it("exports parseFiles function", () => {
    expect(fileContent).toContain("export function parseFiles")
  })

  it("exports parseAndValidate function", () => {
    expect(fileContent).toContain("export function parseAndValidate")
  })

  it("exports buildFixPrompt function", () => {
    expect(fileContent).toContain("export function buildFixPrompt")
  })

  it("exports ParseResult type", () => {
    expect(fileContent).toContain("export interface ParseResult")
  })

  it("exports ValidationError type", () => {
    expect(fileContent).toContain("export interface ValidationError")
  })

  it("exports REQUIRED_FILES constant", () => {
    expect(fileContent).toContain("REQUIRED_FILES")
  })

  it("exports PLACEHOLDER_PATTERNS constant", () => {
    expect(fileContent).toContain("PLACEHOLDER_PATTERNS")
  })
})

// ── parseFiles unit tests ────────────────────────────────

describe("4.6 Response Parser — parseFiles", () => {
  it("parses single file block", async () => {
    const { parseFiles } = await import("../apps/web/lib/parser")
    const raw = `--- FILE: app/page.tsx ---
export default function Home() {
  return <div>Hello</div>
}
--- END FILE ---`
    const files = parseFiles(raw)
    expect(files).toHaveLength(1)
    expect(files[0].path).toBe("app/page.tsx")
    expect(files[0].content).toContain("export default function Home()")
  })

  it("parses multiple file blocks", async () => {
    const { parseFiles } = await import("../apps/web/lib/parser")
    const raw = `--- FILE: app/layout.tsx ---
export default function Layout({ children }: { children: React.ReactNode }) {
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
    const files = parseFiles(raw)
    expect(files).toHaveLength(3)
    expect(files[0].path).toBe("app/layout.tsx")
    expect(files[1].path).toBe("app/page.tsx")
    expect(files[2].path).toBe("components/Hero.tsx")
  })

  it("returns empty array for no file blocks", async () => {
    const { parseFiles } = await import("../apps/web/lib/parser")
    const files = parseFiles("Just some text with no file blocks")
    expect(files).toHaveLength(0)
  })

  it("preserves nested directory paths", async () => {
    const { parseFiles } = await import("../apps/web/lib/parser")
    const raw = `--- FILE: components/ui/special/card.tsx ---
export function Card() { return <div /> }
--- END FILE ---`
    const files = parseFiles(raw)
    expect(files[0].path).toBe("components/ui/special/card.tsx")
  })

  it("trims trailing whitespace from content", async () => {
    const { parseFiles } = await import("../apps/web/lib/parser")
    const raw = `--- FILE: app/page.tsx ---
export default function Home() {
  return <div>Hello</div>
}

--- END FILE ---`
    const files = parseFiles(raw)
    expect(files[0].content).not.toMatch(/\s+$/)
  })
})

// ── Validation: required files ───────────────────────────

describe("4.6 Response Parser — Required files validation", () => {
  it("passes when all required files present", async () => {
    const { parseAndValidate } = await import("../apps/web/lib/parser")
    const raw = `--- FILE: app/layout.tsx ---
export default function Layout({ children }: { children: React.ReactNode }) {
  return <html><body>{children}</body></html>
}
--- END FILE ---

--- FILE: app/page.tsx ---
export default function Home() {
  return <div>Hello</div>
}
--- END FILE ---`
    const result = parseAndValidate(raw)
    const missingErrors = result.errors.filter((e) => e.type === "missing_file")
    expect(missingErrors).toHaveLength(0)
  })

  it("reports missing layout.tsx", async () => {
    const { parseAndValidate } = await import("../apps/web/lib/parser")
    const raw = `--- FILE: app/page.tsx ---
export default function Home() {
  return <div>Hello</div>
}
--- END FILE ---`
    const result = parseAndValidate(raw)
    const missingErrors = result.errors.filter((e) => e.type === "missing_file")
    expect(missingErrors.length).toBeGreaterThanOrEqual(1)
    expect(missingErrors.some((e) => e.file === "app/layout.tsx")).toBe(true)
  })

  it("reports missing page.tsx", async () => {
    const { parseAndValidate } = await import("../apps/web/lib/parser")
    const raw = `--- FILE: app/layout.tsx ---
export default function Layout({ children }: { children: React.ReactNode }) {
  return <html><body>{children}</body></html>
}
--- END FILE ---`
    const result = parseAndValidate(raw)
    const missingErrors = result.errors.filter((e) => e.type === "missing_file")
    expect(missingErrors.some((e) => e.file === "app/page.tsx")).toBe(true)
  })

  it("reports both missing when no files parsed", async () => {
    const { parseAndValidate } = await import("../apps/web/lib/parser")
    const result = parseAndValidate("no file markers here")
    const missingErrors = result.errors.filter((e) => e.type === "missing_file")
    expect(missingErrors).toHaveLength(2)
  })
})

// ── Validation: placeholder content ──────────────────────

describe("4.6 Response Parser — Placeholder detection", () => {
  it("detects Lorem ipsum", async () => {
    const { parseAndValidate } = await import("../apps/web/lib/parser")
    const raw = `--- FILE: app/layout.tsx ---
export default function Layout({ children }: { children: React.ReactNode }) {
  return <html><body>{children}</body></html>
}
--- END FILE ---

--- FILE: app/page.tsx ---
export default function Home() {
  return <div>Lorem ipsum dolor sit amet</div>
}
--- END FILE ---`
    const result = parseAndValidate(raw)
    const placeholderErrors = result.errors.filter((e) => e.type === "placeholder_content")
    expect(placeholderErrors.length).toBeGreaterThanOrEqual(1)
    expect(result.valid).toBe(false)
  })

  it("detects TODO markers", async () => {
    const { parseAndValidate } = await import("../apps/web/lib/parser")
    const raw = `--- FILE: app/layout.tsx ---
export default function Layout({ children }: { children: React.ReactNode }) {
  return <html><body>{children}</body></html>
}
--- END FILE ---

--- FILE: app/page.tsx ---
export default function Home() {
  return <div>TODO: add real content</div>
}
--- END FILE ---`
    const result = parseAndValidate(raw)
    const placeholderErrors = result.errors.filter((e) => e.type === "placeholder_content")
    expect(placeholderErrors.length).toBeGreaterThanOrEqual(1)
  })

  it("detects example.com", async () => {
    const { parseAndValidate } = await import("../apps/web/lib/parser")
    const raw = `--- FILE: app/layout.tsx ---
export default function Layout({ children }: { children: React.ReactNode }) {
  return <html><body>{children}</body></html>
}
--- END FILE ---

--- FILE: app/page.tsx ---
export default function Home() {
  return <a href="https://example.com">Visit</a>
}
--- END FILE ---`
    const result = parseAndValidate(raw)
    const placeholderErrors = result.errors.filter((e) => e.type === "placeholder_content")
    expect(placeholderErrors.length).toBeGreaterThanOrEqual(1)
  })

  it("detects placeholder names like John Doe", async () => {
    const { parseAndValidate } = await import("../apps/web/lib/parser")
    const raw = `--- FILE: app/layout.tsx ---
export default function Layout({ children }: { children: React.ReactNode }) {
  return <html><body>{children}</body></html>
}
--- END FILE ---

--- FILE: app/page.tsx ---
export default function Home() {
  return <div>Contact John Doe at 555-1234</div>
}
--- END FILE ---`
    const result = parseAndValidate(raw)
    const placeholderErrors = result.errors.filter((e) => e.type === "placeholder_content")
    expect(placeholderErrors.length).toBeGreaterThanOrEqual(1)
  })

  it("ignores placeholders in comments", async () => {
    const { parseAndValidate } = await import("../apps/web/lib/parser")
    const raw = `--- FILE: app/layout.tsx ---
export default function Layout({ children }: { children: React.ReactNode }) {
  return <html><body>{children}</body></html>
}
--- END FILE ---

--- FILE: app/page.tsx ---
// TODO: this is just a comment
export default function Home() {
  return <div>Real Content</div>
}
--- END FILE ---`
    const result = parseAndValidate(raw)
    const placeholderErrors = result.errors.filter((e) => e.type === "placeholder_content")
    expect(placeholderErrors).toHaveLength(0)
  })

  it("passes with clean content", async () => {
    const { parseAndValidate } = await import("../apps/web/lib/parser")
    const raw = `--- FILE: app/layout.tsx ---
export default function Layout({ children }: { children: React.ReactNode }) {
  return <html><body>{children}</body></html>
}
--- END FILE ---

--- FILE: app/page.tsx ---
export default function Home() {
  return <div>Welcome to Mario's Pizza - Authentic Italian</div>
}
--- END FILE ---`
    const result = parseAndValidate(raw)
    const placeholderErrors = result.errors.filter((e) => e.type === "placeholder_content")
    expect(placeholderErrors).toHaveLength(0)
  })
})

// ── Validation: syntax checks ────────────────────────────

describe("4.6 Response Parser — Syntax validation", () => {
  it("detects unbalanced braces", async () => {
    const { parseAndValidate } = await import("../apps/web/lib/parser")
    const raw = `--- FILE: app/layout.tsx ---
export default function Layout({ children }: { children: React.ReactNode }) {
  return <html><body>{children}</body></html>
}
--- END FILE ---

--- FILE: app/page.tsx ---
export default function Home() {
  return <div>Hello</div>

--- END FILE ---`
    const result = parseAndValidate(raw)
    const syntaxErrors = result.errors.filter((e) => e.type === "syntax_error")
    expect(syntaxErrors.some((e) => e.message.includes("brace"))).toBe(true)
  })

  it("detects missing exports in tsx files", async () => {
    const { parseAndValidate } = await import("../apps/web/lib/parser")
    const raw = `--- FILE: app/layout.tsx ---
export default function Layout({ children }: { children: React.ReactNode }) {
  return <html><body>{children}</body></html>
}
--- END FILE ---

--- FILE: app/page.tsx ---
export default function Home() {
  return <div>Hello</div>
}
--- END FILE ---

--- FILE: components/Hero.tsx ---
function Hero() {
  return <section>Hero</section>
}
--- END FILE ---`
    const result = parseAndValidate(raw)
    const syntaxErrors = result.errors.filter((e) => e.type === "syntax_error")
    expect(syntaxErrors.some((e) => e.file === "components/Hero.tsx" && e.message.includes("no exports"))).toBe(true)
  })

  it("passes for well-formed tsx files", async () => {
    const { parseAndValidate } = await import("../apps/web/lib/parser")
    const raw = `--- FILE: app/layout.tsx ---
export default function Layout({ children }: { children: React.ReactNode }) {
  return <html><body>{children}</body></html>
}
--- END FILE ---

--- FILE: app/page.tsx ---
export default function Home() {
  return <div>Hello</div>
}
--- END FILE ---`
    const result = parseAndValidate(raw)
    const syntaxErrors = result.errors.filter((e) => e.type === "syntax_error")
    expect(syntaxErrors).toHaveLength(0)
  })

  it("skips syntax check for non-ts/tsx files", async () => {
    const { parseAndValidate } = await import("../apps/web/lib/parser")
    const raw = `--- FILE: app/layout.tsx ---
export default function Layout({ children }: { children: React.ReactNode }) {
  return <html><body>{children}</body></html>
}
--- END FILE ---

--- FILE: app/page.tsx ---
export default function Home() {
  return <div>Hello</div>
}
--- END FILE ---

--- FILE: public/robots.txt ---
User-agent: *
Allow: /
--- END FILE ---`
    const result = parseAndValidate(raw)
    const syntaxErrors = result.errors.filter((e) => e.type === "syntax_error")
    expect(syntaxErrors).toHaveLength(0)
  })
})

// ── parseAndValidate integration ─────────────────────────

describe("4.6 Response Parser — parseAndValidate", () => {
  it("returns valid=true for clean, complete output", async () => {
    const { parseAndValidate } = await import("../apps/web/lib/parser")
    const raw = `--- FILE: app/layout.tsx ---
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Mario's Pizza",
  description: "Authentic Italian cuisine",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
--- END FILE ---

--- FILE: app/page.tsx ---
import { Hero } from "@/components/Hero"
import { Footer } from "@/components/Footer"

export default function Home() {
  return (
    <main>
      <Hero />
      <Footer />
    </main>
  )
}
--- END FILE ---

--- FILE: components/Hero.tsx ---
export function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-red-900">
      <h1 className="text-5xl font-bold text-white">Mario's Pizza</h1>
    </section>
  )
}
--- END FILE ---

--- FILE: components/Footer.tsx ---
export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <p>&copy; 2024 Mario's Pizza</p>
    </footer>
  )
}
--- END FILE ---

--- FILE: tailwind.config.ts ---
import type { Config } from "tailwindcss"

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#D4382C",
      },
    },
  },
  plugins: [],
}
export default config
--- END FILE ---`
    const result = parseAndValidate(raw)
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
    expect(result.files).toHaveLength(5)
  })

  it("returns valid=false with multiple error types", async () => {
    const { parseAndValidate } = await import("../apps/web/lib/parser")
    // Missing layout.tsx, has placeholder, has syntax error
    const raw = `--- FILE: app/page.tsx ---
export default function Home() {
  return <div>Lorem ipsum dolor sit amet</div>

--- END FILE ---`
    const result = parseAndValidate(raw)
    expect(result.valid).toBe(false)
    expect(result.errors.length).toBeGreaterThanOrEqual(2) // missing layout + placeholder + possible syntax
  })
})

// ── buildFixPrompt ───────────────────────────────────────

describe("4.6 Response Parser — buildFixPrompt", () => {
  it("includes all errors in the prompt", async () => {
    const { buildFixPrompt } = await import("../apps/web/lib/parser")
    const errors = [
      { type: "missing_file" as const, file: "app/layout.tsx", message: "Required file missing: app/layout.tsx" },
      { type: "placeholder_content" as const, file: "app/page.tsx", message: 'Placeholder content detected: "Lorem ipsum"', line: 3 },
      { type: "syntax_error" as const, file: "components/Hero.tsx", message: "Unbalanced braces (missing closing brace)" },
    ]
    const prompt = buildFixPrompt(errors)
    expect(prompt).toContain("app/layout.tsx")
    expect(prompt).toContain("Lorem ipsum")
    expect(prompt).toContain("Unbalanced braces")
    expect(prompt).toContain("line 3")
  })

  it("includes instructions for regeneration", async () => {
    const { buildFixPrompt } = await import("../apps/web/lib/parser")
    const errors = [
      { type: "missing_file" as const, file: "app/layout.tsx", message: "Required file missing: app/layout.tsx" },
    ]
    const prompt = buildFixPrompt(errors)
    expect(prompt).toContain("--- FILE:")
    expect(prompt).toContain("--- END FILE ---")
    expect(prompt).toContain("regenerate")
  })
})

// ── TypeScript compilation check ─────────────────────────

describe("4.6 Response Parser — TypeScript compilation", () => {
  it("compiles without errors", async () => {
    const { execSync } = await import("child_process")
    execSync(
      "npx tsc --noEmit --strict apps/web/lib/parser.ts --moduleResolution bundler --module esnext --target es2017 --skipLibCheck --esModuleInterop",
      { cwd: path.resolve(__dirname, ".."), encoding: "utf-8", timeout: 30000 }
    )
    expect(true).toBe(true)
  })
})
