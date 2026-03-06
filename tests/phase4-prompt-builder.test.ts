import { describe, it, expect, vi, beforeAll } from "vitest"
import * as fs from "fs"
import * as path from "path"

// Mock @radiant/db to avoid needing Supabase env vars at import time
vi.mock("@radiant/db", () => ({
  searchComponents: vi.fn().mockResolvedValue([]),
  searchTemplates: vi.fn().mockResolvedValue([]),
  searchPatterns: vi.fn().mockResolvedValue([]),
  supabase: {},
  getServiceClient: vi.fn(),
}))

// Mock the embeddings module to avoid DB/API dependencies
vi.mock("../apps/web/lib/embeddings", () => ({
  generateEmbedding: vi.fn().mockResolvedValue(new Array(1536).fill(0)),
  retrieveComponents: vi.fn().mockResolvedValue([
    {
      id: "c1",
      library: "shadcn",
      name: "Button",
      description: "A button component",
      docsText: "Use for actions",
      codeExample: "<Button>Click</Button>",
      similarity: 0.9,
    },
  ]),
  retrieveTemplates: vi.fn().mockResolvedValue([
    {
      id: "t1",
      industry: "restaurant",
      sectionType: "hero",
      description: "Full-width hero",
      templateJson: { layout: "full-width" },
      similarity: 0.85,
    },
  ]),
  retrievePatterns: vi.fn().mockResolvedValue([
    {
      id: "p1",
      patternType: "hero-sections",
      name: "Split Layout",
      description: "Image and text split",
      exampleJson: { layout: "split" },
      similarity: 0.8,
    },
  ]),
}))

const filePath = path.resolve(__dirname, "../apps/web/lib/prompt-builder.ts")
const fileContent = fs.readFileSync(filePath, "utf-8")

// ── File existence & structure ──────────────────────────

describe("4.4 Prompt Builder — File & Exports", () => {
  it("prompt-builder.ts exists", () => {
    expect(fs.existsSync(filePath)).toBe(true)
  })

  it("exports buildGenerationPrompt function", () => {
    expect(fileContent).toContain("export async function buildGenerationPrompt")
  })

  it("exports GenerationPrompt type", () => {
    expect(fileContent).toContain("export interface GenerationPrompt")
  })

  it("exports PromptBudget type", () => {
    expect(fileContent).toContain("export interface PromptBudget")
  })

  it("imports BusinessProfile from @radiant/scraper", () => {
    expect(fileContent).toContain("@radiant/scraper")
    expect(fileContent).toContain("BusinessProfile")
  })

  it("imports getBaseSystemPrompt from system prompt module", () => {
    expect(fileContent).toContain("getBaseSystemPrompt")
  })

  it("imports getIndustryPrompt from industries module", () => {
    expect(fileContent).toContain("getIndustryPrompt")
  })

  it("imports RAG retrieval functions from embeddings", () => {
    expect(fileContent).toContain("retrieveComponents")
    expect(fileContent).toContain("retrieveTemplates")
    expect(fileContent).toContain("retrievePatterns")
  })

  it("exports helper functions for testing", () => {
    expect(fileContent).toContain("formatComponentDocs")
    expect(fileContent).toContain("formatTemplates")
    expect(fileContent).toContain("formatPatterns")
    expect(fileContent).toContain("buildUserPrompt")
    expect(fileContent).toContain("trimToBudget")
  })
})

// ── Formatter unit tests ────────────────────────────────

describe("4.4 Prompt Builder — formatComponentDocs", () => {
  it("can be imported", async () => {
    const mod = await import("../apps/web/lib/prompt-builder")
    expect(typeof mod.formatComponentDocs).toBe("function")
  })

  it("returns empty string for empty array", async () => {
    const mod = await import("../apps/web/lib/prompt-builder")
    const result = mod.formatComponentDocs([])
    expect(result).toBe("")
  })

  it("formats component docs with name and library", async () => {
    const mod = await import("../apps/web/lib/prompt-builder")
    const result = mod.formatComponentDocs([
      {
        id: "1",
        library: "shadcn",
        name: "Button",
        description: "A clickable button",
        docsText: "Use for primary actions",
        codeExample: "<Button>Click</Button>",
        similarity: 0.9,
      },
    ])
    expect(result).toContain("## AVAILABLE COMPONENTS")
    expect(result).toContain("### Button (shadcn)")
    expect(result).toContain("A clickable button")
    expect(result).toContain("Use for primary actions")
    expect(result).toContain("<Button>Click</Button>")
  })

  it("includes code examples in tsx code blocks", async () => {
    const mod = await import("../apps/web/lib/prompt-builder")
    const result = mod.formatComponentDocs([
      {
        id: "1",
        library: "aceternity",
        name: "HeroParallax",
        description: "Parallax hero",
        docsText: "Docs here",
        codeExample: "<HeroParallax items={items} />",
        similarity: 0.8,
      },
    ])
    expect(result).toContain("```tsx")
  })
})

describe("4.4 Prompt Builder — formatTemplates", () => {
  it("returns empty string for empty array", async () => {
    const mod = await import("../apps/web/lib/prompt-builder")
    const result = mod.formatTemplates([])
    expect(result).toBe("")
  })

  it("formats template entries with section type and industry", async () => {
    const mod = await import("../apps/web/lib/prompt-builder")
    const result = mod.formatTemplates([
      {
        id: "1",
        industry: "restaurant",
        sectionType: "hero",
        description: "Full-width food hero",
        templateJson: { layout: "full-width", cta: "View Menu" },
        similarity: 0.85,
      },
    ])
    expect(result).toContain("## TEMPLATE REFERENCES")
    expect(result).toContain("### hero (restaurant)")
    expect(result).toContain("Full-width food hero")
    expect(result).toContain('"layout": "full-width"')
  })
})

describe("4.4 Prompt Builder — formatPatterns", () => {
  it("returns empty string for empty array", async () => {
    const mod = await import("../apps/web/lib/prompt-builder")
    const result = mod.formatPatterns([])
    expect(result).toBe("")
  })

  it("formats pattern entries", async () => {
    const mod = await import("../apps/web/lib/prompt-builder")
    const result = mod.formatPatterns([
      {
        id: "1",
        patternType: "hero-sections",
        name: "Split Layout",
        description: "Image on one side, text on the other",
        exampleJson: { layout: "split", imagePosition: "right" },
        similarity: 0.8,
      },
    ])
    expect(result).toContain("## DESIGN PATTERNS")
    expect(result).toContain("### Split Layout (hero-sections)")
    expect(result).toContain("Image on one side, text on the other")
    expect(result).toContain('"layout": "split"')
  })
})

// ── User prompt builder tests ───────────────────────────

describe("4.4 Prompt Builder — buildUserPrompt", () => {
  const makeProfile = (overrides = {}): any => ({
    name: "Joe's Pizza",
    address: "123 Main St, New York, NY 10001",
    city: "New York",
    state: "NY",
    phone: "(212) 555-1234",
    rating: 4.5,
    reviewCount: 200,
    category: "Pizza Restaurant",
    industry: "restaurant",
    hours: [
      { day: "Monday", open: "11:00 AM", close: "10:00 PM" },
      { day: "Tuesday", open: "11:00 AM", close: "10:00 PM" },
    ],
    photos: [{ url: "https://example.com/photo1.jpg", width: 800, height: 600 }],
    reviews: [
      { author: "Jane", rating: 5, text: "Best pizza!", date: "2024-01-15" },
    ],
    location: { lat: 40.7128, lng: -74.006 },
    ...overrides,
  })

  it("includes business name and contact info", async () => {
    const mod = await import("../apps/web/lib/prompt-builder")
    const result = mod.buildUserPrompt(makeProfile())
    expect(result).toContain("Joe's Pizza")
    expect(result).toContain("(212) 555-1234")
    expect(result).toContain("123 Main St")
    expect(result).toContain("New York")
  })

  it("includes industry and category", async () => {
    const mod = await import("../apps/web/lib/prompt-builder")
    const result = mod.buildUserPrompt(makeProfile())
    expect(result).toContain('"industry": "restaurant"')
    expect(result).toContain('"category": "Pizza Restaurant"')
  })

  it("includes hours when available", async () => {
    const mod = await import("../apps/web/lib/prompt-builder")
    const result = mod.buildUserPrompt(makeProfile())
    expect(result).toContain("Monday")
    expect(result).toContain("11:00 AM")
  })

  it("excludes hours when empty", async () => {
    const mod = await import("../apps/web/lib/prompt-builder")
    const result = mod.buildUserPrompt(makeProfile({ hours: [] }))
    expect(result).not.toContain('"hours"')
  })

  it("includes reviews when available", async () => {
    const mod = await import("../apps/web/lib/prompt-builder")
    const result = mod.buildUserPrompt(makeProfile())
    expect(result).toContain("Best pizza!")
    expect(result).toContain("Jane")
  })

  it("limits photos to 10", async () => {
    const photos = Array.from({ length: 15 }, (_, i) => ({
      url: `https://example.com/photo${i}.jpg`,
      width: 800,
      height: 600,
    }))
    const mod = await import("../apps/web/lib/prompt-builder")
    const result = mod.buildUserPrompt(makeProfile({ photos }))
    expect(result).toContain("photo0.jpg")
    expect(result).toContain("photo9.jpg")
    expect(result).not.toContain("photo10.jpg")
  })

  it("limits reviews to 10", async () => {
    const reviews = Array.from({ length: 15 }, (_, i) => ({
      author: `User${i}`,
      rating: 5,
      text: `Review ${i}`,
      date: "2024-01-01",
    }))
    const mod = await import("../apps/web/lib/prompt-builder")
    const result = mod.buildUserPrompt(makeProfile({ reviews }))
    expect(result).toContain("User0")
    expect(result).toContain("User9")
    expect(result).not.toContain("User10")
  })

  it("includes existing content when available", async () => {
    const mod = await import("../apps/web/lib/prompt-builder")
    const result = mod.buildUserPrompt(
      makeProfile({
        existingContent: {
          headlines: ["Best Pizza in Town"],
          descriptions: ["Family owned since 1985"],
          services: ["Dine-in", "Delivery"],
          about: "We are a family restaurant",
        },
      })
    )
    expect(result).toContain("Best Pizza in Town")
    expect(result).toContain("Family owned since 1985")
    expect(result).toContain("Dine-in")
  })

  it("outputs valid JSON in the user prompt", async () => {
    const mod = await import("../apps/web/lib/prompt-builder")
    const result = mod.buildUserPrompt(makeProfile())
    const jsonMatch = result.match(/```json\n([\s\S]+)\n```/)
    expect(jsonMatch).not.toBeNull()
    const parsed = JSON.parse(jsonMatch![1])
    expect(parsed.name).toBe("Joe's Pizza")
  })

  it("wraps output with generation instruction", async () => {
    const mod = await import("../apps/web/lib/prompt-builder")
    const result = mod.buildUserPrompt(makeProfile())
    expect(result).toContain("Generate a complete website for this business")
  })
})

// ── Budget enforcement tests ────────────────────────────

describe("4.4 Prompt Builder — trimToBudget", () => {
  it("returns prompt unchanged when under budget", async () => {
    const mod = await import("../apps/web/lib/prompt-builder")
    const prompt = "Short prompt"
    const result = mod.trimToBudget(prompt, { ...mod.DEFAULT_BUDGET, maxSystemChars: 1000 })
    expect(result).toBe(prompt)
  })

  it("trims design patterns first when over budget", async () => {
    const mod = await import("../apps/web/lib/prompt-builder")
    const prompt =
      "Base prompt\n\n## AVAILABLE COMPONENTS\nComponent docs here\n\n## TEMPLATE REFERENCES\nTemplate docs here\n\n## DESIGN PATTERNS\nPattern docs here (very long section)"
    const result = mod.trimToBudget(prompt, { ...mod.DEFAULT_BUDGET, maxSystemChars: 100 })
    expect(result).not.toContain("## DESIGN PATTERNS")
  })

  it("trims templates second when still over budget", async () => {
    const mod = await import("../apps/web/lib/prompt-builder")
    const prompt =
      "Base prompt\n\n## AVAILABLE COMPONENTS\nComponent docs here\n\n## TEMPLATE REFERENCES\nTemplate docs here\n\n## DESIGN PATTERNS\nPattern docs here"
    const result = mod.trimToBudget(prompt, { ...mod.DEFAULT_BUDGET, maxSystemChars: 50 })
    expect(result).not.toContain("## TEMPLATE REFERENCES")
    expect(result).not.toContain("## DESIGN PATTERNS")
  })

  it("preserves base prompt and industry context during trimming", async () => {
    const mod = await import("../apps/web/lib/prompt-builder")
    const prompt =
      "Base system prompt content here\n\n## INDUSTRY CONTEXT\nIndustry specific content\n\n## AVAILABLE COMPONENTS\nLots of component docs\n\n## TEMPLATE REFERENCES\nTemplate data\n\n## DESIGN PATTERNS\nPattern data"
    const result = mod.trimToBudget(prompt, { ...mod.DEFAULT_BUDGET, maxSystemChars: 100 })
    expect(result).toContain("Base system prompt content here")
  })
})

// ── Integration: buildGenerationPrompt with mocks ───────

describe("4.4 Prompt Builder — buildGenerationPrompt integration", () => {
  const makeProfile = (overrides = {}): any => ({
    name: "Joe's Pizza",
    address: "123 Main St, New York, NY 10001",
    city: "New York",
    state: "NY",
    phone: "(212) 555-1234",
    rating: 4.5,
    reviewCount: 200,
    category: "Pizza Restaurant",
    industry: "restaurant",
    hours: [{ day: "Monday", open: "11:00 AM", close: "10:00 PM" }],
    photos: [{ url: "https://example.com/photo1.jpg", width: 800, height: 600 }],
    reviews: [{ author: "Jane", rating: 5, text: "Best pizza!", date: "2024-01-15" }],
    location: { lat: 40.7128, lng: -74.006 },
    ...overrides,
  })

  it("returns object with system and user strings", async () => {
    const mod = await import("../apps/web/lib/prompt-builder")
    const result = await mod.buildGenerationPrompt(makeProfile())
    expect(typeof result.system).toBe("string")
    expect(typeof result.user).toBe("string")
    expect(result.system.length).toBeGreaterThan(100)
    expect(result.user.length).toBeGreaterThan(50)
  })

  it("system prompt contains base prompt content", async () => {
    const mod = await import("../apps/web/lib/prompt-builder")
    const result = await mod.buildGenerationPrompt(makeProfile())
    expect(result.system).toContain("expert frontend developer")
    expect(result.system).toContain("OUTPUT FORMAT")
  })

  it("system prompt contains industry-specific fragment", async () => {
    const mod = await import("../apps/web/lib/prompt-builder")
    const result = await mod.buildGenerationPrompt(makeProfile())
    // Restaurant industry prompt should mention restaurant-specific things
    expect(result.system).toContain("RESTAURANT")
  })

  it("system prompt contains RAG-retrieved component docs", async () => {
    const mod = await import("../apps/web/lib/prompt-builder")
    const result = await mod.buildGenerationPrompt(makeProfile())
    expect(result.system).toContain("## AVAILABLE COMPONENTS")
    expect(result.system).toContain("Button")
  })

  it("system prompt contains RAG-retrieved templates", async () => {
    const mod = await import("../apps/web/lib/prompt-builder")
    const result = await mod.buildGenerationPrompt(makeProfile())
    expect(result.system).toContain("## TEMPLATE REFERENCES")
  })

  it("system prompt contains RAG-retrieved patterns", async () => {
    const mod = await import("../apps/web/lib/prompt-builder")
    const result = await mod.buildGenerationPrompt(makeProfile())
    expect(result.system).toContain("## DESIGN PATTERNS")
  })

  it("user prompt contains business data as JSON", async () => {
    const mod = await import("../apps/web/lib/prompt-builder")
    const result = await mod.buildGenerationPrompt(makeProfile())
    expect(result.user).toContain("Joe's Pizza")
    expect(result.user).toContain('"industry": "restaurant"')
  })

  it("system prompt stays under budget", async () => {
    const mod = await import("../apps/web/lib/prompt-builder")
    const result = await mod.buildGenerationPrompt(makeProfile())
    expect(result.system.length).toBeLessThan(mod.DEFAULT_BUDGET.maxSystemChars)
  })
})

// ── Structure verification ──────────────────────────────

describe("4.4 Prompt Builder — Code structure", () => {
  it("assembles prompts in correct order: base → industry → RAG → budget", () => {
    // In buildGenerationPrompt function, check order of operations
    const fnStart = fileContent.indexOf("export async function buildGenerationPrompt")
    const fnBody = fileContent.slice(fnStart)
    const baseIdx = fnBody.indexOf("getBaseSystemPrompt()")
    const industryIdx = fnBody.indexOf("getIndustryPrompt(")
    const ragIdx = fnBody.indexOf("retrieveComponents(")
    const budgetIdx = fnBody.indexOf("trimToBudget(")

    expect(baseIdx).toBeGreaterThan(-1)
    expect(industryIdx).toBeGreaterThan(baseIdx)
    expect(ragIdx).toBeGreaterThan(industryIdx)
    expect(budgetIdx).toBeGreaterThan(ragIdx)
  })

  it("runs RAG queries in parallel via Promise.all", () => {
    expect(fileContent).toContain("Promise.all")
  })

  it("has a default budget of ~300K chars (~75K tokens)", async () => {
    const mod = await import("../apps/web/lib/prompt-builder")
    expect(mod.DEFAULT_BUDGET.maxSystemChars).toBeGreaterThanOrEqual(200_000)
    expect(mod.DEFAULT_BUDGET.maxSystemChars).toBeLessThanOrEqual(400_000)
  })

  it("limits components, templates, and patterns counts", async () => {
    const mod = await import("../apps/web/lib/prompt-builder")
    expect(mod.DEFAULT_BUDGET.maxComponents).toBeGreaterThan(0)
    expect(mod.DEFAULT_BUDGET.maxComponents).toBeLessThanOrEqual(20)
    expect(mod.DEFAULT_BUDGET.maxTemplates).toBeGreaterThan(0)
    expect(mod.DEFAULT_BUDGET.maxPatterns).toBeGreaterThan(0)
  })

  it("returns GenerationPrompt type with system and user", () => {
    expect(fileContent).toContain("Promise<GenerationPrompt>")
    expect(fileContent).toContain("return { system, user }")
  })
})
