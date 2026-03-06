import { describe, it, expect } from "vitest"
import * as fs from "fs"
import * as path from "path"

// Read the source file for structural tests
const firecrawlSrc = fs.readFileSync(
  path.join(__dirname, "../packages/scraper/firecrawl.ts"),
  "utf-8",
)

describe("Phase 3.2 — Firecrawl scraper", () => {
  describe("Module structure", () => {
    it("exports scrapeWebsite function", () => {
      expect(firecrawlSrc).toContain("export async function scrapeWebsite")
    })

    it("exports extractContent function", () => {
      expect(firecrawlSrc).toContain("export function extractContent")
    })

    it("exports summarizeContent function", () => {
      expect(firecrawlSrc).toContain("export function summarizeContent")
    })

    it("imports cheerio for HTML parsing", () => {
      expect(firecrawlSrc).toContain('from "cheerio"')
    })

    it("imports ScrapedWebsiteData type", () => {
      expect(firecrawlSrc).toContain("ScrapedWebsiteData")
    })

    it("uses FIRECRAWL_API_KEY env var", () => {
      expect(firecrawlSrc).toContain("FIRECRAWL_API_KEY")
    })

    it("supports custom FIRECRAWL_API_URL for self-hosted", () => {
      expect(firecrawlSrc).toContain("FIRECRAWL_API_URL")
    })

    it("defaults to Firecrawl cloud API", () => {
      expect(firecrawlSrc).toContain("api.firecrawl.dev")
    })

    it("has timeout handling", () => {
      expect(firecrawlSrc).toContain("AbortController")
      expect(firecrawlSrc).toContain("timeout")
    })

    it("handles rate limit / billing errors (402, 429)", () => {
      expect(firecrawlSrc).toContain("402")
      expect(firecrawlSrc).toContain("429")
    })
  })

  describe("extractContent()", () => {
    // Import function dynamically since it doesn't depend on env vars
    let extractContent: typeof import("../packages/scraper/firecrawl")["extractContent"]

    it("can be imported", async () => {
      const mod = await import("../packages/scraper/firecrawl")
      extractContent = mod.extractContent
      expect(typeof extractContent).toBe("function")
    })

    it("extracts headings from HTML", async () => {
      const mod = await import("../packages/scraper/firecrawl")
      const result = mod.extractContent(`
        <html><body>
          <h1>Welcome to Joe's Pizza</h1>
          <h2>Our Menu</h2>
          <h3>About Us</h3>
        </body></html>
      `)
      expect(result.headings).toContain("Welcome to Joe's Pizza")
      expect(result.headings).toContain("Our Menu")
      expect(result.headings).toContain("About Us")
      expect(result.headings.length).toBe(3)
    })

    it("extracts paragraphs with minimum length", async () => {
      const mod = await import("../packages/scraper/firecrawl")
      const result = mod.extractContent(`
        <html><body>
          <p>Too short</p>
          <p>We have been serving the community for over 25 years with the best pizza in town.</p>
          <p>Another short one</p>
          <p>Our family recipe has been passed down through three generations of Italian cooking excellence.</p>
        </body></html>
      `)
      // Only paragraphs > 20 chars
      expect(result.paragraphs.length).toBe(2)
      expect(result.paragraphs[0]).toContain("serving the community")
      expect(result.paragraphs[1]).toContain("family recipe")
    })

    it("extracts image URLs and deduplicates", async () => {
      const mod = await import("../packages/scraper/firecrawl")
      const result = mod.extractContent(`
        <html><body>
          <img src="https://example.com/pizza.jpg" />
          <img src="https://example.com/pasta.jpg" />
          <img src="https://example.com/pizza.jpg" />
          <img data-src="https://example.com/lazy.jpg" />
        </body></html>
      `)
      expect(result.imageUrls.length).toBe(3)
      expect(result.imageUrls).toContain("https://example.com/pizza.jpg")
      expect(result.imageUrls).toContain("https://example.com/pasta.jpg")
      expect(result.imageUrls).toContain("https://example.com/lazy.jpg")
    })

    it("filters out tracking pixels", async () => {
      const mod = await import("../packages/scraper/firecrawl")
      const result = mod.extractContent(`
        <html><body>
          <img src="https://example.com/photo.jpg" />
          <img src="https://facebook.com/tr/pixel.gif" />
          <img src="https://example.com/1x1.png" />
          <img src="https://analytics.example.com/tracker.gif" />
        </body></html>
      `)
      expect(result.imageUrls.length).toBe(1)
      expect(result.imageUrls[0]).toBe("https://example.com/photo.jpg")
    })

    it("extracts links", async () => {
      const mod = await import("../packages/scraper/firecrawl")
      const result = mod.extractContent(`
        <html><body>
          <a href="/menu">Our Menu</a>
          <a href="/about">About Us</a>
          <a href="/contact">Contact</a>
        </body></html>
      `)
      expect(result.links.length).toBe(3)
      expect(result.links[0]).toEqual({ text: "Our Menu", href: "/menu" })
    })

    it("extracts meta title and description", async () => {
      const mod = await import("../packages/scraper/firecrawl")
      const result = mod.extractContent(`
        <html>
          <head>
            <title>Joe's Pizza - Best Pizza in NYC</title>
            <meta name="description" content="Family-owned pizza restaurant since 1995" />
          </head>
          <body></body>
        </html>
      `)
      expect(result.metaTitle).toBe("Joe's Pizza - Best Pizza in NYC")
      expect(result.metaDescription).toBe(
        "Family-owned pizza restaurant since 1995",
      )
    })

    it("removes script and style tags from content", async () => {
      const mod = await import("../packages/scraper/firecrawl")
      const result = mod.extractContent(`
        <html><body>
          <script>alert('malicious')</script>
          <style>.hidden { display: none }</style>
          <h1>Real Content</h1>
          <p>This is a legitimate paragraph that should be extracted from the page.</p>
        </body></html>
      `)
      expect(result.headings).toContain("Real Content")
      expect(result.paragraphs.length).toBe(1)
      // Script content should NOT appear in paragraphs
      const allText = result.paragraphs.join(" ") + result.headings.join(" ")
      expect(allText).not.toContain("malicious")
    })

    it("deduplicates headings", async () => {
      const mod = await import("../packages/scraper/firecrawl")
      const result = mod.extractContent(`
        <html><body>
          <h1>Welcome</h1>
          <h2>Welcome</h2>
          <h3>Unique Heading</h3>
        </body></html>
      `)
      expect(result.headings.length).toBe(2)
    })

    it("extracts og:image from meta tags", async () => {
      const mod = await import("../packages/scraper/firecrawl")
      const result = mod.extractContent(`
        <html>
          <head>
            <meta property="og:image" content="https://example.com/og-image.jpg" />
          </head>
          <body></body>
        </html>
      `)
      expect(result.imageUrls).toContain("https://example.com/og-image.jpg")
    })
  })

  describe("summarizeContent()", () => {
    it("produces valid ScrapedWebsiteData", async () => {
      const mod = await import("../packages/scraper/firecrawl")
      const raw = {
        headings: ["Welcome to Joe's Pizza", "Our Menu"],
        paragraphs: [
          "We have been serving the community for over 25 years with the best pizza in town. Our family recipe has been passed down through generations.",
          "Open Monday through Saturday from 11am to 10pm. Visit us at 123 Main Street.",
        ],
        imageUrls: ["/images/pizza.jpg", "https://example.com/photo.jpg"],
        links: [{ text: "Menu", href: "/menu" }],
        metaTitle: "Joe's Pizza",
        metaDescription: "Best pizza in town",
      }
      const result = mod.summarizeContent(raw, "https://joespizza.com", {
        title: "Joe's Pizza - NYC",
      })
      expect(result.url).toBe("https://joespizza.com")
      expect(result.title).toBe("Joe's Pizza - NYC")
      expect(result.description).toBe("Best pizza in town")
      expect(result.headings.length).toBe(2)
      expect(result.paragraphs.length).toBe(2)
      // Relative URL should be resolved
      expect(result.imageUrls).toContain("https://joespizza.com/images/pizza.jpg")
      expect(result.imageUrls).toContain("https://example.com/photo.jpg")
    })

    it("detects about text from paragraphs", async () => {
      const mod = await import("../packages/scraper/firecrawl")
      const raw = {
        headings: ["About Us"],
        paragraphs: [
          "Our family has been passionate about pizza since 1985, when our founders immigrated from Naples, Italy. We bring authentic Italian flavors to every slice.",
        ],
        imageUrls: [],
        links: [],
      }
      const result = mod.summarizeContent(raw, "https://example.com")
      expect(result.aboutText).toBeTruthy()
      expect(result.aboutText).toContain("passionate about pizza")
    })

    it("detects menu items with prices", async () => {
      const mod = await import("../packages/scraper/firecrawl")
      const raw = {
        headings: ["Menu"],
        paragraphs: [
          "Margherita Pizza $12.99",
          "Pepperoni Pizza $14.99",
          "We are a family restaurant serving the best Italian food.",
        ],
        imageUrls: [],
        links: [{ text: "Caesar Salad $8.99", href: "/menu/salad" }],
      }
      const result = mod.summarizeContent(raw, "https://example.com")
      expect(result.menuItems).toBeTruthy()
      expect(result.menuItems!.length).toBeGreaterThanOrEqual(2)
    })

    it("resolves relative URLs to absolute", async () => {
      const mod = await import("../packages/scraper/firecrawl")
      const raw = {
        headings: [],
        paragraphs: [],
        imageUrls: ["/img/photo.jpg", "../assets/logo.png"],
        links: [],
      }
      const result = mod.summarizeContent(raw, "https://example.com/pages/about")
      expect(result.imageUrls[0]).toBe("https://example.com/img/photo.jpg")
      expect(result.imageUrls[1]).toBe("https://example.com/assets/logo.png")
    })

    it("filters out data: URIs from images", async () => {
      const mod = await import("../packages/scraper/firecrawl")
      const raw = {
        headings: [],
        paragraphs: [],
        imageUrls: [
          "data:image/png;base64,abc123",
          "https://example.com/real.jpg",
        ],
        links: [],
      }
      const result = mod.summarizeContent(raw, "https://example.com")
      expect(result.imageUrls.length).toBe(1)
      expect(result.imageUrls[0]).toBe("https://example.com/real.jpg")
    })

    it("prefers og metadata over raw meta", async () => {
      const mod = await import("../packages/scraper/firecrawl")
      const raw = {
        headings: [],
        paragraphs: [],
        imageUrls: [],
        links: [],
        metaTitle: "Page Title",
        metaDescription: "Page description",
      }
      const result = mod.summarizeContent(raw, "https://example.com", {
        title: "Firecrawl Title",
        ogTitle: "OG Title",
        description: "FC Desc",
        ogDescription: "OG Desc",
      })
      expect(result.title).toBe("OG Title")
      expect(result.description).toBe("OG Desc")
    })

    it("limits headings to 50 and paragraphs to 100", async () => {
      const mod = await import("../packages/scraper/firecrawl")
      const raw = {
        headings: Array.from({ length: 60 }, (_, i) => `Heading ${i}`),
        paragraphs: Array.from({ length: 120 }, (_, i) => `Paragraph ${i} with enough text to pass the minimum length filter`),
        imageUrls: [],
        links: [],
      }
      const result = mod.summarizeContent(raw, "https://example.com")
      expect(result.headings.length).toBe(50)
      expect(result.paragraphs.length).toBe(100)
    })
  })

  describe("scrapeWebsite() error handling", () => {
    it("returns null for empty/invalid URLs", async () => {
      const mod = await import("../packages/scraper/firecrawl")
      // Mock env var
      const origKey = process.env.FIRECRAWL_API_KEY
      process.env.FIRECRAWL_API_KEY = "test-key"
      try {
        const result1 = await mod.scrapeWebsite("")
        expect(result1).toBeNull()
        const result2 = await mod.scrapeWebsite("not-a-url")
        expect(result2).toBeNull()
      } finally {
        if (origKey) {
          process.env.FIRECRAWL_API_KEY = origKey
        } else {
          delete process.env.FIRECRAWL_API_KEY
        }
      }
    })

    it("throws when FIRECRAWL_API_KEY is missing", async () => {
      const mod = await import("../packages/scraper/firecrawl")
      const origKey = process.env.FIRECRAWL_API_KEY
      delete process.env.FIRECRAWL_API_KEY
      try {
        await expect(
          mod.scrapeWebsite("https://example.com"),
        ).rejects.toThrow("FIRECRAWL_API_KEY")
      } finally {
        if (origKey) {
          process.env.FIRECRAWL_API_KEY = origKey
        }
      }
    })

    it("returns null when Firecrawl server is unreachable", async () => {
      const mod = await import("../packages/scraper/firecrawl")
      const origKey = process.env.FIRECRAWL_API_KEY
      const origUrl = process.env.FIRECRAWL_API_URL
      process.env.FIRECRAWL_API_KEY = "test-key"
      process.env.FIRECRAWL_API_URL = "http://localhost:19999"
      try {
        const result = await mod.scrapeWebsite("https://example.com")
        expect(result).toBeNull()
      } finally {
        if (origKey) {
          process.env.FIRECRAWL_API_KEY = origKey
        } else {
          delete process.env.FIRECRAWL_API_KEY
        }
        if (origUrl) {
          process.env.FIRECRAWL_API_URL = origUrl
        } else {
          delete process.env.FIRECRAWL_API_URL
        }
      }
    })
  })

  describe("Full HTML extraction integration", () => {
    it("handles a realistic restaurant website HTML", async () => {
      const mod = await import("../packages/scraper/firecrawl")
      const html = `
        <html>
          <head>
            <title>Joe's Pizza - Authentic NYC Pizza Since 1985</title>
            <meta name="description" content="Family-owned pizzeria in the heart of NYC" />
            <meta property="og:image" content="https://joespizza.com/og.jpg" />
          </head>
          <body>
            <nav>
              <a href="/">Home</a>
              <a href="/menu">Menu</a>
              <a href="/about">About</a>
            </nav>
            <h1>Welcome to Joe's Pizza</h1>
            <p>Serving authentic New York-style pizza for over 35 years. Our thin-crust pies are made with love.</p>
            <h2>Our Menu</h2>
            <p>Margherita Pizza $12.99</p>
            <p>Pepperoni Pizza $14.99</p>
            <p>Caesar Salad $8.99</p>
            <h2>About Us</h2>
            <p>Founded in 1985 by the Moretti family, Joe's Pizza has been a staple of the NYC food scene for decades. We use only the freshest ingredients.</p>
            <img src="/images/storefront.jpg" />
            <img src="/images/pizza-close-up.jpg" />
            <script>console.log('tracking')</script>
          </body>
        </html>
      `
      const result = mod.extractContent(html)
      expect(result.headings).toContain("Welcome to Joe's Pizza")
      expect(result.headings).toContain("Our Menu")
      expect(result.headings).toContain("About Us")
      expect(result.metaTitle).toBe(
        "Joe's Pizza - Authentic NYC Pizza Since 1985",
      )
      expect(result.metaDescription).toBe(
        "Family-owned pizzeria in the heart of NYC",
      )
      expect(result.imageUrls).toContain("https://joespizza.com/og.jpg")
      expect(result.imageUrls).toContain("/images/storefront.jpg")
      expect(result.paragraphs.some((p) => p.includes("authentic"))).toBe(true)
      expect(result.links.length).toBe(3)

      // Now summarize
      const summary = mod.summarizeContent(result, "https://joespizza.com", {
        title: "Joe's Pizza",
      })
      expect(summary.url).toBe("https://joespizza.com")
      expect(summary.title).toBe("Joe's Pizza")
      expect(summary.aboutText).toBeTruthy()
      expect(summary.aboutText).toContain("Founded in 1985")
      // Menu items should be detected
      expect(summary.menuItems).toBeTruthy()
      expect(summary.menuItems!.length).toBeGreaterThanOrEqual(1)
      // Images should have absolute URLs
      expect(
        summary.imageUrls.every((u) => u.startsWith("http")),
      ).toBe(true)
    })
  })
})
