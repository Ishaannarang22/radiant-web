import { NextRequest, NextResponse } from "next/server"
import { getProject } from "@radiant/db"
import type { BusinessProfile } from "@radiant/scraper"
import { generateSite } from "../../../lib/generator"

// In-memory rate limiter: IP -> timestamps of recent requests
const rateLimitMap = new Map<string, number[]>()
const RATE_LIMIT_MAX = 5
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000 // 1 hour

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const timestamps = rateLimitMap.get(ip) ?? []
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS)
  rateLimitMap.set(ip, recent)

  if (recent.length >= RATE_LIMIT_MAX) {
    return true
  }

  recent.push(now)
  return false
}

function validateBusinessProfile(profile: unknown): profile is BusinessProfile {
  if (!profile || typeof profile !== "object") return false
  const p = profile as Record<string, unknown>
  return (
    typeof p.name === "string" &&
    typeof p.address === "string" &&
    typeof p.city === "string" &&
    typeof p.state === "string" &&
    typeof p.phone === "string" &&
    typeof p.rating === "number" &&
    typeof p.category === "string" &&
    typeof p.industry === "string" &&
    Array.isArray(p.hours) &&
    Array.isArray(p.photos) &&
    Array.isArray(p.reviews)
  )
}

export async function POST(request: NextRequest) {
  // Rate limiting by IP
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Maximum 5 generations per hour." },
      { status: 429 },
    )
  }

  // Parse request body
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 },
    )
  }

  const { projectId, businessProfile } = body as Record<string, unknown>

  // Validate projectId
  if (!projectId || typeof projectId !== "string") {
    return NextResponse.json(
      { error: "Missing required field: projectId (string)" },
      { status: 400 },
    )
  }

  // Validate businessProfile
  if (!validateBusinessProfile(businessProfile)) {
    return NextResponse.json(
      { error: "Missing or invalid field: businessProfile (must include name, address, city, state, phone, rating, category, industry, hours, photos, reviews)" },
      { status: 400 },
    )
  }

  // Verify project exists
  try {
    const project = await getProject(projectId)
    if (!project) {
      return NextResponse.json(
        { error: `Project not found: ${projectId}` },
        { status: 404 },
      )
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Database error"
    return NextResponse.json(
      { error: `Failed to verify project: ${message}` },
      { status: 500 },
    )
  }

  // Check if client wants SSE streaming
  const acceptHeader = request.headers.get("accept") ?? ""
  const wantsStream = acceptHeader.includes("text/event-stream")

  if (wantsStream) {
    // SSE streaming mode — real-time progress updates
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      start(controller) {
        function sendEvent(event: string, data: unknown) {
          controller.enqueue(
            encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
          )
        }

        generateSite(projectId as string, businessProfile, {
          onProgress: (progress) => {
            sendEvent("progress", progress)
          },
        })
          .then(async () => {
            // Fetch the generated file paths from the DB
            const { getProjectFiles } = await import("@radiant/db")
            const files = await getProjectFiles(projectId as string)
            sendEvent("complete", {
              success: true,
              files: files.map((f) => f.file_path),
            })
            controller.close()
          })
          .catch((error) => {
            const message = error instanceof Error ? error.message : "Generation failed"
            sendEvent("error", { success: false, error: message })
            controller.close()
          })
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    })
  }

  // Non-streaming mode — wait for generation to complete and return result
  try {
    await generateSite(projectId, businessProfile)

    const { getProjectFiles } = await import("@radiant/db")
    const files = await getProjectFiles(projectId)

    return NextResponse.json({
      success: true,
      files: files.map((f) => f.file_path),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Generation failed"

    // Classify error type for appropriate status code
    const isTimeout = message.includes("timeout") || message.includes("ETIMEDOUT")
    const isQuota = message.includes("rate_limit") || message.includes("quota") || message.includes("429")

    const status = isTimeout ? 504 : isQuota ? 429 : 500

    return NextResponse.json(
      { success: false, error: message },
      { status },
    )
  }
}
