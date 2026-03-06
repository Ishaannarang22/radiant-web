#!/usr/bin/env npx tsx
/**
 * seed-embeddings.ts
 *
 * Reads all component, template, and pattern JSON files from data/,
 * generates vector embeddings, and inserts them into Supabase tables.
 *
 * Supports two embedding backends:
 *   1. OpenAI text-embedding-3-small (1536 dims) — when OPENAI_API_KEY is set
 *   2. Local all-MiniLM-L6-v2 via @xenova/transformers (384 dims, zero-padded to 1536)
 *
 * Usage:
 *   npx tsx scripts/seed-embeddings.ts              # local embeddings (no API key needed)
 *   OPENAI_API_KEY=sk-... npx tsx scripts/seed-embeddings.ts  # OpenAI embeddings
 *   npx tsx scripts/seed-embeddings.ts --dry-run    # preview without DB writes
 *   npx tsx scripts/seed-embeddings.ts --clear      # clear tables before seeding
 */

import "dotenv/config"
import fs from "node:fs"
import path from "node:path"
import { createClient } from "@supabase/supabase-js"

// ── Config ──────────────────────────────────────────────

const TARGET_DIMENSIONS = 1536
const BATCH_SIZE = 50

const DATA_DIR = path.resolve(__dirname, "../data")
const COMPONENT_DIRS = ["shadcn", "aceternity", "magic-ui", "21st-dev"]

const args = process.argv.slice(2)
const DRY_RUN = args.includes("--dry-run")
const CLEAR = args.includes("--clear")

// ── Embedding backend ───────────────────────────────────

interface EmbeddingBackend {
  name: string
  embed(texts: string[]): Promise<number[][]>
}

async function createOpenAIBackend(): Promise<EmbeddingBackend> {
  const OpenAI = (await import("openai")).default
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  return {
    name: "OpenAI text-embedding-3-small",
    async embed(texts: string[]): Promise<number[][]> {
      const results: number[][] = []
      for (let i = 0; i < texts.length; i += BATCH_SIZE) {
        const batch = texts.slice(i, i + BATCH_SIZE)
        const response = await client.embeddings.create({
          model: "text-embedding-3-small",
          input: batch,
          dimensions: TARGET_DIMENSIONS,
        })
        for (const item of response.data) {
          results.push(item.embedding)
        }
      }
      return results
    },
  }
}

function padTo(vec: number[], targetDim: number): number[] {
  if (vec.length >= targetDim) return vec.slice(0, targetDim)
  const padded = new Array(targetDim).fill(0)
  for (let i = 0; i < vec.length; i++) padded[i] = vec[i]
  return padded
}

async function createLocalBackend(): Promise<EmbeddingBackend> {
  // @ts-ignore - dynamic import of ESM module
  const { pipeline } = await import("@xenova/transformers")
  console.log("Loading local embedding model (all-MiniLM-L6-v2)...")
  const extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2")
  console.log("Model loaded.\n")

  return {
    name: "Local all-MiniLM-L6-v2 (384d → zero-padded to 1536d)",
    async embed(texts: string[]): Promise<number[][]> {
      const results: number[][] = []
      for (let i = 0; i < texts.length; i++) {
        const output = await extractor(texts[i], { pooling: "mean", normalize: true })
        const vec = Array.from(output.data as Float32Array)
        results.push(padTo(vec, TARGET_DIMENSIONS))
        if ((i + 1) % 25 === 0 || i === texts.length - 1) {
          process.stdout.write(`\r  Embedding ${i + 1}/${texts.length}...`)
        }
      }
      process.stdout.write("\n")
      return results
    },
  }
}

async function getBackend(): Promise<EmbeddingBackend> {
  if (process.env.OPENAI_API_KEY) {
    return createOpenAIBackend()
  }
  return createLocalBackend()
}

// ── Supabase client ─────────────────────────────────────

function getSupabase() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variable")
  }
  return createClient(url, key, { auth: { persistSession: false } })
}

// ── Data loaders ────────────────────────────────────────

interface ComponentData {
  name: string
  library: string
  description: string
  whenToUse?: string
  installation?: string
  props?: Array<{ name: string; type: string; default?: string; description?: string }>
  codeExample?: string
  tags?: string[]
}

interface TemplateData {
  industry: string
  display_name: string
  sections: string[]
  color_schemes?: Array<{ name: string; [k: string]: string }>
  copy_patterns?: Record<string, string[]>
  must_have_sections?: string[]
  photo_placement?: string[]
  suggested_components?: Record<string, string[]>
}

interface PatternFile {
  pattern_type: string
  description: string
  // hero-sections & cta-patterns use "patterns"
  patterns?: Array<{
    name: string
    description: string
    best_for?: string[]
    [k: string]: unknown
  }>
  // color-schemes uses "palettes"
  palettes?: Array<{
    name: string
    mood?: string
    industries?: string[]
    [k: string]: unknown
  }>
  // copy-formulas uses "formulas" (object keyed by category)
  formulas?: Record<
    string,
    {
      description: string
      templates: string[]
      best_for?: string[]
    }
  >
}

function loadComponentFiles(): ComponentData[] {
  const components: ComponentData[] = []
  for (const lib of COMPONENT_DIRS) {
    const dir = path.join(DATA_DIR, "components", lib)
    if (!fs.existsSync(dir)) continue
    const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"))
    for (const file of files) {
      const raw = fs.readFileSync(path.join(dir, file), "utf-8")
      const data = JSON.parse(raw) as ComponentData
      components.push(data)
    }
  }
  return components
}

function loadTemplateFiles(): TemplateData[] {
  const dir = path.join(DATA_DIR, "templates")
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf-8")) as TemplateData)
}

function loadPatternFiles(): PatternFile[] {
  const dir = path.join(DATA_DIR, "patterns")
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf-8")) as PatternFile)
}

// ── Text builders (what gets embedded) ──────────────────

function componentEmbedText(c: ComponentData): string {
  const parts = [c.name, c.description]
  if (c.whenToUse) parts.push(c.whenToUse)
  if (c.tags?.length) parts.push(c.tags.join(" "))
  return parts.join(" ")
}

function templateEmbedText(t: TemplateData): string {
  const parts = [
    t.display_name,
    `Industry: ${t.industry}`,
    `Sections: ${t.sections.join(", ")}`,
  ]
  if (t.must_have_sections?.length) {
    parts.push(`Must-have: ${t.must_have_sections.join(", ")}`)
  }
  return parts.join(". ")
}

function patternEmbedText(
  p: { pattern_type: string; name: string; description: string; example_json: Record<string, unknown> }
): string {
  const parts = [p.name, p.description, `Pattern type: ${p.pattern_type}`]
  const bestFor = p.example_json.best_for as string[] | undefined
  if (bestFor?.length) parts.push(`Best for: ${bestFor.join(", ")}`)
  const industries = p.example_json.industries as string[] | undefined
  if (industries?.length) parts.push(`Industries: ${industries.join(", ")}`)
  return parts.join(". ")
}

// ── Main ────────────────────────────────────────────────

async function main() {
  console.log("=== Radiant Web — Seed Embeddings ===")
  if (DRY_RUN) console.log("DRY RUN — no database writes")

  const backend = await getBackend()
  console.log(`Using embedding backend: ${backend.name}`)

  const supabase = getSupabase()

  // ── 1. Load all data ──────────────────────────────────
  const components = loadComponentFiles()
  const templates = loadTemplateFiles()
  const patternFiles = loadPatternFiles()

  // Flatten patterns: each individual pattern/palette/formula is a row
  const patterns: Array<{
    pattern_type: string
    name: string
    description: string
    example_json: Record<string, unknown>
  }> = []
  for (const pf of patternFiles) {
    if (pf.patterns) {
      for (const p of pf.patterns) {
        patterns.push({
          pattern_type: pf.pattern_type,
          name: p.name,
          description: p.description,
          example_json: p as unknown as Record<string, unknown>,
        })
      }
    } else if (pf.palettes) {
      for (const p of pf.palettes) {
        patterns.push({
          pattern_type: pf.pattern_type,
          name: p.name,
          description: p.mood ?? `${p.name} color palette`,
          example_json: p as unknown as Record<string, unknown>,
        })
      }
    } else if (pf.formulas) {
      for (const [key, f] of Object.entries(pf.formulas)) {
        patterns.push({
          pattern_type: pf.pattern_type,
          name: key,
          description: f.description,
          example_json: { ...f, key } as unknown as Record<string, unknown>,
        })
      }
    }
  }

  // Each template becomes one row with section_type = "full"
  const templateRows = templates.map((t) => ({
    industry: t.industry,
    section_type: "full",
    description: `${t.display_name} website template with sections: ${t.sections.join(", ")}`,
    template_json: t as unknown as Record<string, unknown>,
  }))

  console.log(`\nLoaded data:`)
  console.log(`  Components: ${components.length}`)
  console.log(`  Templates:  ${templateRows.length}`)
  console.log(`  Patterns:   ${patterns.length}`)

  const totalItems = components.length + templateRows.length + patterns.length
  console.log(`  Total:      ${totalItems}\n`)

  // ── 2. Build text arrays for embedding ────────────────
  const componentTexts = components.map(componentEmbedText)
  const templateTexts = templates.map(templateEmbedText)
  const patternTexts = patterns.map(patternEmbedText)

  const allTexts = [...componentTexts, ...templateTexts, ...patternTexts]

  // ── 3. Generate embeddings ────────────────────────────
  console.log(`Generating embeddings for ${allTexts.length} items...`)
  const allEmbeddings = await backend.embed(allTexts)
  console.log(`Generated ${allEmbeddings.length} embeddings (${allEmbeddings[0]?.length}d each).\n`)

  // Split embeddings back
  let offset = 0
  const componentEmbeddings = allEmbeddings.slice(offset, offset + components.length)
  offset += components.length
  const templateEmbeddings = allEmbeddings.slice(offset, offset + templateRows.length)
  offset += templateRows.length
  const patternEmbeddings = allEmbeddings.slice(offset, offset + patterns.length)

  if (DRY_RUN) {
    console.log("DRY RUN complete. Would have inserted:")
    console.log(`  ${components.length} component_embeddings rows`)
    console.log(`  ${templateRows.length} template_embeddings rows`)
    console.log(`  ${patterns.length} pattern_embeddings rows`)
    return
  }

  // ── 4. Clear existing data if --clear ─────────────────
  if (CLEAR) {
    console.log("Clearing existing embedding tables...")
    await supabase.from("component_embeddings").delete().neq("id", "00000000-0000-0000-0000-000000000000")
    await supabase.from("template_embeddings").delete().neq("id", "00000000-0000-0000-0000-000000000000")
    await supabase.from("pattern_embeddings").delete().neq("id", "00000000-0000-0000-0000-000000000000")
    console.log("Cleared.\n")
  }

  // ── 5. Insert components ──────────────────────────────
  console.log("Inserting component embeddings...")
  let inserted = 0
  for (let i = 0; i < components.length; i += BATCH_SIZE) {
    const batch = components.slice(i, i + BATCH_SIZE).map((c, j) => ({
      library: c.library,
      component_name: c.name,
      description: c.description,
      docs_text: [c.description, c.whenToUse, c.installation].filter(Boolean).join("\n"),
      code_example: c.codeExample ?? null,
      tags: c.tags ?? null,
      embedding: JSON.stringify(componentEmbeddings[i + j]),
    }))

    const { error } = await supabase
      .from("component_embeddings")
      .upsert(batch, { onConflict: "library,component_name" })

    if (error) throw new Error(`Failed to insert components batch ${i}: ${error.message}`)
    inserted += batch.length
    console.log(`  Embedded ${inserted}/${components.length} components...`)
  }

  // ── 6. Insert templates ───────────────────────────────
  console.log("Inserting template embeddings...")
  inserted = 0
  for (let i = 0; i < templateRows.length; i += BATCH_SIZE) {
    const batch = templateRows.slice(i, i + BATCH_SIZE).map((t, j) => ({
      industry: t.industry,
      section_type: t.section_type,
      description: t.description,
      template_json: t.template_json,
      embedding: JSON.stringify(templateEmbeddings[i + j]),
    }))

    const { error } = await supabase
      .from("template_embeddings")
      .insert(batch)

    if (error) throw new Error(`Failed to insert templates batch ${i}: ${error.message}`)
    inserted += batch.length
    console.log(`  Embedded ${inserted}/${templateRows.length} templates...`)
  }

  // ── 7. Insert patterns ────────────────────────────────
  console.log("Inserting pattern embeddings...")
  inserted = 0
  for (let i = 0; i < patterns.length; i += BATCH_SIZE) {
    const batch = patterns.slice(i, i + BATCH_SIZE).map((p, j) => ({
      pattern_type: p.pattern_type,
      name: p.name,
      description: p.description,
      example_json: p.example_json,
      embedding: JSON.stringify(patternEmbeddings[i + j]),
    }))

    const { error } = await supabase
      .from("pattern_embeddings")
      .insert(batch)

    if (error) throw new Error(`Failed to insert patterns batch ${i}: ${error.message}`)
    inserted += batch.length
    console.log(`  Embedded ${inserted}/${patterns.length} patterns...`)
  }

  // ── 8. Summary ────────────────────────────────────────
  console.log("\n=== Seeding Complete ===")
  console.log(`  Components: ${components.length} rows`)
  console.log(`  Templates:  ${templateRows.length} rows`)
  console.log(`  Patterns:   ${patterns.length} rows`)
  console.log(`  Total:      ${totalItems} rows inserted`)
}

main().catch((err) => {
  console.error("Error:", err.message)
  process.exit(1)
})
