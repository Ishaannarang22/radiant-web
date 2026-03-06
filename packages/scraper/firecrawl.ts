import * as cheerio from "cheerio"
import type { ScrapedWebsiteData } from "./types"

const DEFAULT_FIRECRAWL_URL = "https://api.firecrawl.dev"
const SCRAPE_TIMEOUT_MS = 30_000

function getFirecrawlConfig(): { apiUrl: string; apiKey: string } {
  const apiKey = process.env.FIRECRAWL_API_KEY
  if (!apiKey) {
    throw new Error("Missing FIRECRAWL_API_KEY environment variable")
  }
  const apiUrl = process.env.FIRECRAWL_API_URL ?? DEFAULT_FIRECRAWL_URL
  return { apiUrl, apiKey }
}

interface FirecrawlScrapeResponse {
  success: boolean
  data?: {
    markdown?: string
    html?: string
    metadata?: {
      title?: string
      description?: string
      ogTitle?: string
      ogDescription?: string
      [key: string]: unknown
    }
    [key: string]: unknown
  }
  error?: string
}

/**
 * Scrape a business's existing website using the Firecrawl API.
 * Supports both self-hosted Firecrawl (set FIRECRAWL_API_URL) and Firecrawl Cloud.
 *
 * Returns null if the website doesn't exist, is unreachable, or returns no content.
 */
export async function scrapeWebsite(
  url: string,
): Promise<ScrapedWebsiteData | null> {
  const { apiUrl, apiKey } = getFirecrawlConfig()

  if (!url || !url.startsWith("http")) {
    return null
  }

  let response: Response
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), SCRAPE_TIMEOUT_MS)

    response = await fetch(`${apiUrl}/v1/scrape`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        url,
        formats: ["html"],
        onlyMainContent: true,
        timeout: 20000,
      }),
      signal: controller.signal,
    })

    clearTimeout(timeout)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    if (message.includes("abort") || message.includes("timeout")) {
      return null
    }
    if (
      message.includes("ECONNREFUSED") ||
      message.includes("ENOTFOUND") ||
      message.includes("fetch failed")
    ) {
      return null
    }
    throw new Error(`Firecrawl request failed: ${message}`)
  }

  if (!response.ok) {
    if (response.status === 402 || response.status === 429) {
      throw new Error(
        `Firecrawl API rate limit or billing issue (HTTP ${response.status})`,
      )
    }
    // Site unreachable, 404, etc. — return null
    return null
  }

  let body: FirecrawlScrapeResponse
  try {
    body = (await response.json()) as FirecrawlScrapeResponse
  } catch {
    return null
  }

  if (!body.success || !body.data) {
    return null
  }

  const html = body.data.html ?? ""
  if (!html.trim()) {
    return null
  }

  const rawContent = extractContent(html)

  const scraped = summarizeContent(rawContent, url, body.data.metadata)

  return scraped
}

interface RawExtractedContent {
  headings: string[]
  paragraphs: string[]
  imageUrls: string[]
  links: { text: string; href: string }[]
  metaTitle?: string
  metaDescription?: string
}

/**
 * Extract structured content from an HTML string.
 * Pulls out headings, paragraphs, images, and links.
 */
export function extractContent(html: string): RawExtractedContent {
  const $ = cheerio.load(html)

  // Remove script, style, nav, footer, header noise for cleaner paragraphs
  $("script, style, noscript, iframe").remove()

  const headings: string[] = []
  $("h1, h2, h3, h4, h5, h6").each((_, el) => {
    const text = $(el).text().trim()
    if (text && text.length > 1 && text.length < 200) {
      headings.push(text)
    }
  })

  const paragraphs: string[] = []
  $("p, li, blockquote, .description, [class*='about'], [class*='text']").each(
    (_, el) => {
      const tagName = (el as unknown as { tagName?: string }).tagName?.toLowerCase()
      // Only process direct text from divs with text-related classes, not all descendants
      if (
        tagName !== "p" &&
        tagName !== "li" &&
        tagName !== "blockquote"
      ) {
        const text = $(el)
          .contents()
          .filter(function () {
            return this.type === "text"
          })
          .text()
          .trim()
        if (text && text.length > 20 && text.length < 2000) {
          paragraphs.push(text)
        }
      } else {
        const text = $(el).text().trim()
        if (text && text.length > 20 && text.length < 2000) {
          paragraphs.push(text)
        }
      }
    },
  )

  const imageUrls: string[] = []
  const seenUrls = new Set<string>()
  $("img").each((_, el) => {
    const src =
      $(el).attr("src") || $(el).attr("data-src") || $(el).attr("data-lazy")
    if (src && !seenUrls.has(src) && !isTrackingPixel(src)) {
      seenUrls.add(src)
      imageUrls.push(src)
    }
  })

  // Also check og:image and other meta images
  $('meta[property="og:image"], meta[name="twitter:image"]').each((_, el) => {
    const content = $(el).attr("content")
    if (content && !seenUrls.has(content)) {
      seenUrls.add(content)
      imageUrls.push(content)
    }
  })

  const links: { text: string; href: string }[] = []
  $("a[href]").each((_, el) => {
    const href = $(el).attr("href")
    const text = $(el).text().trim()
    if (href && text && text.length < 200) {
      links.push({ text, href })
    }
  })

  const metaTitle = $("title").text().trim() || undefined
  const metaDescription =
    $('meta[name="description"]').attr("content")?.trim() ||
    $('meta[property="og:description"]').attr("content")?.trim() ||
    undefined

  return {
    headings: dedup(headings),
    paragraphs: dedup(paragraphs),
    imageUrls,
    links,
    metaTitle,
    metaDescription,
  }
}

/**
 * Clean and structure raw extracted content into a ScrapedWebsiteData object.
 * Detects menu items, about text, and deduplicates content.
 */
export function summarizeContent(
  raw: RawExtractedContent,
  url: string,
  metadata?: {
    title?: string
    description?: string
    ogTitle?: string
    ogDescription?: string
    [key: string]: unknown
  },
): ScrapedWebsiteData {
  const title =
    metadata?.ogTitle ?? metadata?.title ?? raw.metaTitle ?? undefined
  const description =
    metadata?.ogDescription ??
    metadata?.description ??
    raw.metaDescription ??
    undefined

  // Detect menu items: short text entries that look like food/service items
  const menuItems = detectMenuItems(raw.paragraphs, raw.links)

  // Detect about text: paragraphs containing "about" context or longer descriptions
  const aboutText = detectAboutText(raw.paragraphs, raw.headings)

  // Resolve relative image URLs to absolute
  const imageUrls = raw.imageUrls
    .map((src) => resolveUrl(src, url))
    .filter((u): u is string => u !== null)

  return {
    url,
    title,
    description,
    headings: raw.headings.slice(0, 50),
    paragraphs: raw.paragraphs.slice(0, 100),
    menuItems: menuItems.length > 0 ? menuItems : undefined,
    aboutText: aboutText ?? undefined,
    imageUrls: imageUrls.slice(0, 30),
  }
}

// --- Helpers ---

function isTrackingPixel(src: string): boolean {
  const lower = src.toLowerCase()
  return (
    lower.includes("pixel") ||
    lower.includes("tracker") ||
    lower.includes("analytics") ||
    lower.includes("facebook.com/tr") ||
    lower.includes("google-analytics") ||
    lower.endsWith(".gif") ||
    src.includes("1x1")
  )
}

function dedup(items: string[]): string[] {
  const seen = new Set<string>()
  return items.filter((item) => {
    const normalized = item.toLowerCase().trim()
    if (seen.has(normalized)) return false
    seen.add(normalized)
    return true
  })
}

function resolveUrl(src: string, baseUrl: string): string | null {
  try {
    if (src.startsWith("data:")) return null
    return new URL(src, baseUrl).href
  } catch {
    return null
  }
}

function detectMenuItems(
  paragraphs: string[],
  links: { text: string; href: string }[],
): string[] {
  const menuItems: string[] = []
  const menuPattern =
    /\$\s*\d+|\d+\.\d{2}|price|menu|dish|entrée|appetizer|dessert/i

  for (const p of paragraphs) {
    if (menuPattern.test(p) && p.length < 200) {
      menuItems.push(p)
    }
  }

  // Links that look like menu items (short text with price patterns)
  for (const link of links) {
    if (
      menuPattern.test(link.text) &&
      link.text.length < 100 &&
      link.text.length > 3
    ) {
      menuItems.push(link.text)
    }
  }

  return dedup(menuItems).slice(0, 50)
}

function detectAboutText(
  paragraphs: string[],
  headings: string[],
): string | null {
  // Find the section after an "about" heading
  const aboutHeadingIdx = headings.findIndex((h) =>
    /about|our story|who we are|our mission/i.test(h),
  )

  // Score paragraphs by how likely they are "about" text
  const candidates = paragraphs.filter(
    (p) => p.length > 50 && p.length < 1000,
  )

  if (candidates.length > 0) {
    const strongAbout = /founded|our story|our mission|who we are|established|since \d{4}/i
    const mediumAbout = /family|passion|generations|heritage|tradition|history/i
    const weakAbout = /about|years|experience|serving|community/i

    const scored = candidates.map((p) => {
      let score = 0
      if (strongAbout.test(p)) score += 3
      if (mediumAbout.test(p)) score += 2
      if (weakAbout.test(p)) score += 1
      if (aboutHeadingIdx >= 0) score += 1 // bonus when about heading exists
      // Prefer longer paragraphs
      score += p.length / 500
      return { text: p, score }
    })

    scored.sort((a, b) => b.score - a.score)
    if (scored[0].score > 0) {
      return scored[0].text
    }
  }

  // Fallback: find the longest substantive paragraph
  const substantive = paragraphs
    .filter((p) => p.length > 80 && p.length < 1000)
    .sort((a, b) => b.length - a.length)

  return substantive[0] ?? null
}
