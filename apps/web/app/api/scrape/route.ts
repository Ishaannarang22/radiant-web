import { NextRequest, NextResponse } from "next/server"
import { scrapeBusinessProfile } from "@radiant/scraper"

// In-memory rate limiter: IP -> timestamps of recent requests
const rateLimitMap = new Map<string, number[]>()
const RATE_LIMIT_MAX = 10
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000 // 1 hour

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const timestamps = rateLimitMap.get(ip) ?? []

  // Remove entries older than the window
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS)
  rateLimitMap.set(ip, recent)

  if (recent.length >= RATE_LIMIT_MAX) {
    return true
  }

  recent.push(now)
  return false
}

export async function POST(request: NextRequest) {
  // Rate limiting by IP
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Maximum 10 scrapes per hour." },
      { status: 429 },
    )
  }

  // Parse and validate request body
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 },
    )
  }

  const { businessName, location } = body as Record<string, unknown>

  if (!businessName || typeof businessName !== "string") {
    return NextResponse.json(
      { error: "Missing required field: businessName (string)" },
      { status: 400 },
    )
  }

  if (!location || typeof location !== "string") {
    return NextResponse.json(
      { error: "Missing required field: location (string)" },
      { status: 400 },
    )
  }

  if (businessName.length > 200 || location.length > 200) {
    return NextResponse.json(
      { error: "Fields must be 200 characters or less" },
      { status: 400 },
    )
  }

  try {
    const profile = await scrapeBusinessProfile(
      businessName.trim(),
      location.trim(),
    )

    return NextResponse.json({ success: true, data: profile })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error during scraping"

    // Distinguish between "not found" and server errors
    if (message.includes("not found")) {
      return NextResponse.json(
        { error: message },
        { status: 404 },
      )
    }

    return NextResponse.json(
      { error: `Scraping failed: ${message}` },
      { status: 500 },
    )
  }
}
