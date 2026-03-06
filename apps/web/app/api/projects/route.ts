import { NextRequest, NextResponse } from "next/server"
import { createProject } from "@radiant/db"

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
}

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const { businessName, industry } = body as Record<string, unknown>

  if (!businessName || typeof businessName !== "string") {
    return NextResponse.json(
      { error: "Missing required field: businessName" },
      { status: 400 },
    )
  }

  const subdomain = slugify(businessName) + "-" + Date.now().toString(36)

  try {
    // Use a placeholder user ID for now (auth not yet implemented)
    const project = await createProject("anonymous", businessName, subdomain, {
      industry: typeof industry === "string" ? industry : undefined,
      status: "draft",
    })

    return NextResponse.json({ projectId: project.id, subdomain: project.subdomain })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create project"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
