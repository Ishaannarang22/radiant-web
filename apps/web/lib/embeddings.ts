import {
  searchComponents,
  searchTemplates,
  searchPatterns,
} from "@radiant/db"
import type {
  ComponentEmbedding,
  TemplateEmbedding,
  PatternEmbedding,
} from "@radiant/db"

// ── Return types ────────────────────────────────────────

export interface ComponentDoc {
  id: string
  library: string
  name: string
  description: string | null
  docsText: string
  codeExample: string | null
  similarity: number
}

export interface Template {
  id: string
  industry: string
  sectionType: string
  description: string | null
  templateJson: Record<string, unknown>
  similarity: number
}

export interface Pattern {
  id: string
  patternType: string
  name: string
  description: string | null
  exampleJson: Record<string, unknown> | null
  similarity: number
}

// ── Embedding generation ────────────────────────────────

const TARGET_DIMENSIONS = 1536

interface EmbeddingBackend {
  name: string
  embed(text: string): Promise<number[]>
}

function padTo(vec: number[], targetDim: number): number[] {
  if (vec.length >= targetDim) return vec.slice(0, targetDim)
  const padded = new Array(targetDim).fill(0)
  for (let i = 0; i < vec.length; i++) padded[i] = vec[i]
  return padded
}

let cachedBackend: EmbeddingBackend | null = null

async function getBackend(): Promise<EmbeddingBackend> {
  if (cachedBackend) return cachedBackend

  if (process.env.OPENAI_API_KEY) {
    const OpenAI = (await import("openai")).default
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    cachedBackend = {
      name: "OpenAI text-embedding-3-small",
      async embed(text: string): Promise<number[]> {
        const response = await client.embeddings.create({
          model: "text-embedding-3-small",
          input: text,
          dimensions: TARGET_DIMENSIONS,
        })
        return response.data[0].embedding
      },
    }
  } else {
    // @ts-ignore - dynamic import of ESM module
    const { pipeline } = await import("@xenova/transformers")
    const extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2")
    cachedBackend = {
      name: "Local all-MiniLM-L6-v2 (384d zero-padded to 1536d)",
      async embed(text: string): Promise<number[]> {
        const output = await extractor(text, { pooling: "mean", normalize: true })
        const vec = Array.from(output.data as Float32Array)
        return padTo(vec, TARGET_DIMENSIONS)
      },
    }
  }

  return cachedBackend
}

/**
 * Convert text to a vector embedding.
 * Uses OpenAI text-embedding-3-small when OPENAI_API_KEY is set,
 * otherwise falls back to local all-MiniLM-L6-v2 (384d zero-padded to 1536d).
 * Returns a 1536-dimensional vector compatible with the database schema.
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const backend = await getBackend()
  return backend.embed(text)
}

// ── RAG retrieval functions ─────────────────────────────

/**
 * Find the most relevant UI components for a given query.
 * Generates an embedding for the query text, then searches the
 * component_embeddings table using cosine similarity.
 */
export async function retrieveComponents(
  query: string,
  limit = 10,
  threshold = 0.3
): Promise<ComponentDoc[]> {
  const embedding = await generateEmbedding(query)
  const results = await searchComponents(embedding, limit, threshold)

  return results.map((r: ComponentEmbedding & { similarity: number }) => ({
    id: r.id,
    library: r.library,
    name: r.component_name,
    description: r.description,
    docsText: r.docs_text,
    codeExample: r.code_example,
    similarity: r.similarity,
  }))
}

/**
 * Find the most relevant industry templates.
 * Searches by industry name directly via embedding similarity.
 */
export async function retrieveTemplates(
  industry: string,
  limit = 5,
  threshold = 0.3
): Promise<Template[]> {
  const query = `${industry} website template design sections layout`
  const embedding = await generateEmbedding(query)
  const results = await searchTemplates(embedding, limit, threshold)

  return results.map((r: TemplateEmbedding & { similarity: number }) => ({
    id: r.id,
    industry: r.industry,
    sectionType: r.section_type,
    description: r.description,
    templateJson: r.template_json,
    similarity: r.similarity,
  }))
}

/**
 * Find the most relevant design patterns for a given query.
 * Useful for retrieving hero section patterns, CTA patterns,
 * color schemes, and copy formulas.
 */
export async function retrievePatterns(
  query: string,
  limit = 5,
  threshold = 0.3
): Promise<Pattern[]> {
  const embedding = await generateEmbedding(query)
  const results = await searchPatterns(embedding, limit, threshold)

  return results.map((r: PatternEmbedding & { similarity: number }) => ({
    id: r.id,
    patternType: r.pattern_type,
    name: r.name,
    description: r.description,
    exampleJson: r.example_json,
    similarity: r.similarity,
  }))
}
