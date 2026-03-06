import Anthropic from "@anthropic-ai/sdk"

// ── Types ────────────────────────────────────────────────

export interface GeneratedFile {
  path: string
  content: string
}

export interface GenerationResult {
  files: GeneratedFile[]
  tokensUsed: { input: number; output: number }
  duration: number
  rawResponse: string
}

// ── Client singleton ─────────────────────────────────────

let client: Anthropic | null = null

function getClient(): Anthropic {
  if (!client) {
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      throw new Error("ANTHROPIC_API_KEY environment variable is not set")
    }
    client = new Anthropic({ apiKey })
  }
  return client
}

// ── Response parser ──────────────────────────────────────

/**
 * Parse Claude's response into individual files using the `--- FILE: ... ---` markers.
 */
export function parseFileBlocks(raw: string): GeneratedFile[] {
  const files: GeneratedFile[] = []
  const filePattern = /--- FILE:\s*(.+?)\s*---\n([\s\S]*?)--- END FILE ---/g
  let match: RegExpExecArray | null

  while ((match = filePattern.exec(raw)) !== null) {
    const path = match[1].trim()
    const content = match[2].trimEnd()
    if (path && content) {
      files.push({ path, content })
    }
  }

  return files
}

// ── Main generation function ─────────────────────────────

const DEFAULT_MODEL = "claude-sonnet-4-6"
const DEFAULT_MAX_TOKENS = 16384
const DEFAULT_TEMPERATURE = 0.3

/**
 * Call the Claude API to generate a website.
 *
 * @param systemPrompt - The assembled system prompt (rules + industry + RAG context)
 * @param userPrompt   - The user prompt with business data JSON
 * @returns GenerationResult with parsed files, token usage, and duration
 */
export async function generateWebsite(
  systemPrompt: string,
  userPrompt: string,
  options?: {
    model?: string
    maxTokens?: number
    temperature?: number
  }
): Promise<GenerationResult> {
  const model = options?.model ?? DEFAULT_MODEL
  const maxTokens = options?.maxTokens ?? DEFAULT_MAX_TOKENS
  const temperature = options?.temperature ?? DEFAULT_TEMPERATURE

  const anthropic = getClient()
  const startTime = Date.now()

  const response = await anthropic.messages.create({
    model,
    max_tokens: maxTokens,
    temperature,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  })

  const duration = Date.now() - startTime

  // Extract text content from response
  const rawResponse = response.content
    .filter((block): block is Anthropic.TextBlock => block.type === "text")
    .map((block) => block.text)
    .join("\n")

  // Parse file blocks from raw response
  const files = parseFileBlocks(rawResponse)

  return {
    files,
    tokensUsed: {
      input: response.usage.input_tokens,
      output: response.usage.output_tokens,
    },
    duration,
    rawResponse,
  }
}

// ── Exports for testing ──────────────────────────────────

export { DEFAULT_MODEL, DEFAULT_MAX_TOKENS, DEFAULT_TEMPERATURE, getClient }
