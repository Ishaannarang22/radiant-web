import type { BusinessProfile } from "@radiant/scraper"
import { getBaseSystemPrompt } from "../prompts/system"
import { getIndustryPrompt } from "../prompts/industries"
import {
  retrieveComponents,
  retrieveTemplates,
  retrievePatterns,
  type ComponentDoc,
  type Template,
  type Pattern,
} from "./embeddings"

// ── Types ────────────────────────────────────────────────

export interface GenerationPrompt {
  system: string
  user: string
}

export interface PromptBudget {
  /** Max characters for the full system prompt (rough ~4 chars/token → 80K tokens ≈ 320K chars) */
  maxSystemChars: number
  /** Max component docs to include */
  maxComponents: number
  /** Max template entries to include */
  maxTemplates: number
  /** Max design pattern entries to include */
  maxPatterns: number
}

const DEFAULT_BUDGET: PromptBudget = {
  maxSystemChars: 300_000, // ~75K tokens, leaving headroom under 80K
  maxComponents: 15,
  maxTemplates: 5,
  maxPatterns: 5,
}

// ── Component docs formatter ─────────────────────────────

function formatComponentDocs(components: ComponentDoc[]): string {
  if (components.length === 0) return ""

  const docs = components.map((c) => {
    let entry = `### ${c.name} (${c.library})\n`
    if (c.description) entry += `${c.description}\n`
    if (c.docsText) entry += `\n${c.docsText}\n`
    if (c.codeExample) entry += `\n\`\`\`tsx\n${c.codeExample}\n\`\`\`\n`
    return entry
  })

  return `\n## AVAILABLE COMPONENTS\n\nBelow are UI components you can use. Implement them inline or adapt their patterns — do NOT import from external packages unless they are part of the standard shadcn/ui setup.\n\n${docs.join("\n")}`
}

// ── Template formatter ───────────────────────────────────

function formatTemplates(templates: Template[]): string {
  if (templates.length === 0) return ""

  const docs = templates.map((t) => {
    let entry = `### ${t.sectionType} (${t.industry})\n`
    if (t.description) entry += `${t.description}\n`
    if (t.templateJson) {
      entry += `\n\`\`\`json\n${JSON.stringify(t.templateJson, null, 2)}\n\`\`\`\n`
    }
    return entry
  })

  return `\n## TEMPLATE REFERENCES\n\nUse these as structural references for section layout and content organization:\n\n${docs.join("\n")}`
}

// ── Pattern formatter ────────────────────────────────────

function formatPatterns(patterns: Pattern[]): string {
  if (patterns.length === 0) return ""

  const docs = patterns.map((p) => {
    let entry = `### ${p.name} (${p.patternType})\n`
    if (p.description) entry += `${p.description}\n`
    if (p.exampleJson) {
      entry += `\n\`\`\`json\n${JSON.stringify(p.exampleJson, null, 2)}\n\`\`\`\n`
    }
    return entry
  })

  return `\n## DESIGN PATTERNS\n\nReference these design patterns for layout and visual inspiration:\n\n${docs.join("\n")}`
}

// ── User prompt builder ──────────────────────────────────

function buildUserPrompt(profile: BusinessProfile): string {
  const data: Record<string, unknown> = {
    name: profile.name,
    address: profile.address,
    city: profile.city,
    state: profile.state,
    phone: profile.phone,
    industry: profile.industry,
    category: profile.category,
    rating: profile.rating,
    reviewCount: profile.reviewCount,
  }

  if (profile.website) data.website = profile.website

  if (profile.hours.length > 0) {
    data.hours = profile.hours
  }

  if (profile.photos.length > 0) {
    data.photos = profile.photos.slice(0, 10) // limit to 10 photos
  }

  if (profile.reviews.length > 0) {
    data.reviews = profile.reviews.slice(0, 10) // limit to 10 reviews
  }

  if (profile.location) {
    data.location = profile.location
  }

  if (profile.existingContent) {
    const ec = profile.existingContent
    const existing: Record<string, unknown> = {}
    if (ec.headlines.length > 0) existing.headlines = ec.headlines
    if (ec.descriptions.length > 0) existing.descriptions = ec.descriptions
    if (ec.services.length > 0) existing.services = ec.services
    if (ec.about) existing.about = ec.about
    if (Object.keys(existing).length > 0) data.existingContent = existing
  }

  return `Generate a complete website for this business:\n\n\`\`\`json\n${JSON.stringify(data, null, 2)}\n\`\`\``
}

// ── Budget enforcement ───────────────────────────────────

function trimToBudget(systemPrompt: string, budget: PromptBudget): string {
  if (systemPrompt.length <= budget.maxSystemChars) return systemPrompt

  // Progressively trim: patterns first, then templates, then component docs
  const sections = [
    "## DESIGN PATTERNS",
    "## TEMPLATE REFERENCES",
    "## AVAILABLE COMPONENTS",
  ]

  let trimmed = systemPrompt
  for (const section of sections) {
    if (trimmed.length <= budget.maxSystemChars) break

    const sectionIdx = trimmed.lastIndexOf(section)
    if (sectionIdx !== -1) {
      // Find next top-level section or end of string
      const nextSectionMatch = trimmed.slice(sectionIdx + section.length).match(/\n## [A-Z]/)
      if (nextSectionMatch && nextSectionMatch.index !== undefined) {
        const endIdx = sectionIdx + section.length + nextSectionMatch.index
        trimmed = trimmed.slice(0, sectionIdx) + trimmed.slice(endIdx)
      } else {
        trimmed = trimmed.slice(0, sectionIdx)
      }
    }
  }

  return trimmed
}

// ── Main assembler ───────────────────────────────────────

/**
 * Build the full system and user prompts for website generation.
 *
 * Steps:
 * 1. Start with the base system prompt (code rules, output format)
 * 2. Inject industry-specific fragment (sections, design guidance, colors)
 * 3. Retrieve relevant component docs via RAG
 * 4. Retrieve relevant templates and patterns via RAG
 * 5. Inject all retrieved context into the system prompt
 * 6. Build user prompt with business data JSON
 * 7. Enforce context budget (~80K tokens)
 */
export async function buildGenerationPrompt(
  profile: BusinessProfile,
  budget: PromptBudget = DEFAULT_BUDGET
): Promise<GenerationPrompt> {
  // 1. Base system prompt
  let system = getBaseSystemPrompt()

  // 2. Industry-specific fragment
  const industryPrompt = getIndustryPrompt(profile.industry)
  system += `\n\n${industryPrompt}`

  // 3-4. RAG retrieval (run in parallel)
  const ragQuery = `${profile.industry} ${profile.category} business website`
  const [components, templates, patterns] = await Promise.all([
    retrieveComponents(ragQuery, budget.maxComponents, 0.2),
    retrieveTemplates(profile.industry, budget.maxTemplates, 0.2),
    retrievePatterns(`${profile.industry} hero CTA layout`, budget.maxPatterns, 0.2),
  ])

  // 5. Inject retrieved context
  const componentSection = formatComponentDocs(components)
  const templateSection = formatTemplates(templates)
  const patternSection = formatPatterns(patterns)

  system += componentSection + templateSection + patternSection

  // 6. Build user prompt
  const user = buildUserPrompt(profile)

  // 7. Enforce budget
  system = trimToBudget(system, budget)

  return { system, user }
}

// ── Exports for testing ──────────────────────────────────

export {
  formatComponentDocs,
  formatTemplates,
  formatPatterns,
  buildUserPrompt,
  trimToBudget,
  DEFAULT_BUDGET,
}
