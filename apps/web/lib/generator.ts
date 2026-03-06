import type { BusinessProfile } from "@radiant/scraper"
import { updateProject, upsertProjectFiles, logGeneration } from "@radiant/db"
import { buildGenerationPrompt } from "./prompt-builder"
import { generateWebsite } from "./claude"
import { parseAndValidate, buildFixPrompt } from "./parser"
import { createHash } from "crypto"

// ── Types ────────────────────────────────────────────────

export interface GenerationProgress {
  step: string
  detail?: string
}

export interface GenerateSiteOptions {
  /** Max retry attempts for validation failures (default: 1) */
  maxRetries?: number
  /** Progress callback for real-time updates */
  onProgress?: (progress: GenerationProgress) => void
}

// ── Helpers ──────────────────────────────────────────────

function hashPrompt(system: string, user: string): string {
  return createHash("sha256")
    .update(system + "\n---\n" + user)
    .digest("hex")
    .slice(0, 16)
}

function inferFileType(filePath: string): string | null {
  if (filePath.endsWith(".tsx")) return "tsx"
  if (filePath.endsWith(".ts")) return "ts"
  if (filePath.endsWith(".css")) return "css"
  if (filePath.endsWith(".json")) return "json"
  if (filePath.endsWith(".js")) return "js"
  return null
}

// ── Main orchestrator ────────────────────────────────────

/**
 * Generate a complete website for a business.
 *
 * Steps:
 * 1. Update project status to "generating"
 * 2. Build prompts using prompt builder (base + industry + RAG)
 * 3. Call Claude API
 * 4. Parse response into files
 * 5. Validate files (retry once on validation failure)
 * 6. Store files in `project_files` table
 * 7. Log generation in `generations` table
 * 8. Update project status to "preview"
 *
 * On error: status → "failed", generation logged with error details.
 */
export async function generateSite(
  projectId: string,
  profile: BusinessProfile,
  options?: GenerateSiteOptions
): Promise<void> {
  const maxRetries = options?.maxRetries ?? 1
  const onProgress = options?.onProgress

  let promptHash: string | undefined
  let systemPrompt: string | undefined
  let userPrompt: string | undefined

  try {
    // 1. Update project status to "generating"
    onProgress?.({ step: "updating_status", detail: "Setting project to generating" })
    await updateProject(projectId, { status: "generating" })

    // 2. Build prompts
    onProgress?.({ step: "building_prompts", detail: "Assembling system and user prompts" })
    const prompt = await buildGenerationPrompt(profile)
    systemPrompt = prompt.system
    userPrompt = prompt.user
    promptHash = hashPrompt(systemPrompt, userPrompt)

    // 3. Call Claude API
    onProgress?.({ step: "calling_api", detail: "Generating website with Claude" })
    let result = await generateWebsite(systemPrompt, userPrompt)

    // 4. Parse response into files
    onProgress?.({ step: "parsing_response", detail: "Parsing generated files" })
    let parseResult = parseAndValidate(result.rawResponse)

    // 5. Validate files — retry on validation failure
    let retryCount = 0
    while (!parseResult.valid && retryCount < maxRetries) {
      retryCount++
      onProgress?.({
        step: "retrying",
        detail: `Retry ${retryCount}/${maxRetries}: fixing ${parseResult.errors.length} validation errors`,
      })

      const fixPrompt = buildFixPrompt(parseResult.errors)
      result = await generateWebsite(systemPrompt, fixPrompt)
      parseResult = parseAndValidate(result.rawResponse)
    }

    if (parseResult.files.length === 0) {
      throw new Error("Generation produced no files")
    }

    // 6. Store files in project_files table
    onProgress?.({ step: "storing_files", detail: `Saving ${parseResult.files.length} files` })
    await upsertProjectFiles(
      projectId,
      parseResult.files.map((f) => ({
        file_path: f.path,
        content: f.content,
        file_type: inferFileType(f.path),
      }))
    )

    // 7. Log generation in generations table
    onProgress?.({ step: "logging_generation", detail: "Recording generation metadata" })
    await logGeneration(
      projectId,
      {
        system_prompt: systemPrompt,
        user_prompt: userPrompt,
        prompt_hash: promptHash,
      },
      result.rawResponse,
      {
        tokens_input: result.tokensUsed.input,
        tokens_output: result.tokensUsed.output,
        duration_ms: result.duration,
        status: "completed",
        error: parseResult.valid
          ? undefined
          : `Completed with ${parseResult.errors.length} validation warnings`,
      }
    )

    // 8. Update project status to "preview"
    onProgress?.({ step: "complete", detail: "Generation complete" })
    await updateProject(projectId, { status: "preview" })
  } catch (error) {
    // Handle all errors: API timeout, invalid response, quota exceeded
    const errorMessage =
      error instanceof Error ? error.message : String(error)

    // Determine specific error type for logging
    const isTimeout =
      errorMessage.includes("timeout") || errorMessage.includes("ETIMEDOUT")
    const isQuotaExceeded =
      errorMessage.includes("rate_limit") ||
      errorMessage.includes("quota") ||
      errorMessage.includes("429")
    const isInvalidResponse = errorMessage.includes("no files")

    const errorDetail = isTimeout
      ? `API timeout: ${errorMessage}`
      : isQuotaExceeded
        ? `Quota exceeded: ${errorMessage}`
        : isInvalidResponse
          ? `Invalid response: ${errorMessage}`
          : errorMessage

    // Log the failed generation
    try {
      await logGeneration(
        projectId,
        {
          system_prompt: systemPrompt,
          user_prompt: userPrompt,
          prompt_hash: promptHash,
        },
        null,
        {
          status: "failed",
          error: errorDetail,
        }
      )
    } catch {
      // Logging failure shouldn't mask the original error
    }

    // Update project status to "failed"
    try {
      await updateProject(projectId, { status: "failed" })
    } catch {
      // Status update failure shouldn't mask the original error
    }

    throw error
  }
}
