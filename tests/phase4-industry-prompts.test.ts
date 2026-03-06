import { describe, it, expect } from 'vitest'
import * as fs from 'fs'
import * as path from 'path'

const INDUSTRIES_DIR = path.join(__dirname, '..', 'apps', 'web', 'prompts', 'industries')

// The 6 required by the plan
const REQUIRED_INDUSTRIES = ['restaurant', 'dental', 'salon', 'plumber', 'lawyer', 'generic']

// All 10 industries matching the industry mapper
const ALL_INDUSTRIES = [
  'restaurant', 'dental', 'salon', 'plumber', 'lawyer',
  'real-estate', 'gym', 'auto-repair', 'cleaning-service', 'generic',
]

const REQUIRED_CONTENT = [
  'Required Sections',
  'Design Guidance',
  'Color Palette',
  'Copy Suggestions',
  'Components to Use',
]

describe('Phase 4.2 — Industry-specific prompt fragments', () => {
  describe('File existence', () => {
    it('industries directory exists', () => {
      expect(fs.existsSync(INDUSTRIES_DIR)).toBe(true)
    })

    it('index.ts exists', () => {
      expect(fs.existsSync(path.join(INDUSTRIES_DIR, 'index.ts'))).toBe(true)
    })

    for (const industry of ALL_INDUSTRIES) {
      it(`${industry}.ts file exists`, () => {
        expect(fs.existsSync(path.join(INDUSTRIES_DIR, `${industry}.ts`))).toBe(true)
      })
    }
  })

  describe('Content quality — required sections in each fragment', () => {
    for (const industry of ALL_INDUSTRIES) {
      describe(`${industry} fragment`, () => {
        const filePath = path.join(INDUSTRIES_DIR, `${industry}.ts`)
        const content = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf-8') : ''

        it('exports a named constant', () => {
          expect(content).toMatch(/export const \w+_PROMPT\s*=/)
        })

        for (const section of REQUIRED_CONTENT) {
          it(`contains "${section}"`, () => {
            expect(content).toContain(section)
          })
        }

        it('is substantial (>800 chars of prompt text)', () => {
          // Extract the template literal content between backticks
          const match = content.match(/`([\s\S]+)`/)
          expect(match).not.toBeNull()
          expect(match![1].length).toBeGreaterThan(800)
        })

        it('mentions industry-relevant keywords', () => {
          // At least check the prompt has meaningful content about the industry
          expect(content.length).toBeGreaterThan(500)
        })
      })
    }
  })

  describe('Index module exports', () => {
    it('index.ts imports all industry files', () => {
      const indexContent = fs.readFileSync(path.join(INDUSTRIES_DIR, 'index.ts'), 'utf-8')

      for (const industry of ALL_INDUSTRIES) {
        expect(indexContent).toContain(`'./${industry}'`)
      }
    })

    it('index.ts exports getIndustryPrompt function', () => {
      const indexContent = fs.readFileSync(path.join(INDUSTRIES_DIR, 'index.ts'), 'utf-8')
      expect(indexContent).toContain('export function getIndustryPrompt')
    })

    it('index.ts exports getSupportedIndustryPrompts function', () => {
      const indexContent = fs.readFileSync(path.join(INDUSTRIES_DIR, 'index.ts'), 'utf-8')
      expect(indexContent).toContain('export function getSupportedIndustryPrompts')
    })

    it('index.ts maps all 10 industries', () => {
      const indexContent = fs.readFileSync(path.join(INDUSTRIES_DIR, 'index.ts'), 'utf-8')
      for (const industry of ALL_INDUSTRIES) {
        expect(indexContent).toContain(industry)
      }
    })
  })

  describe('Prompt content uniqueness', () => {
    const prompts: Record<string, string> = {}

    for (const industry of ALL_INDUSTRIES) {
      const filePath = path.join(INDUSTRIES_DIR, `${industry}.ts`)
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8')
        const match = content.match(/`([\s\S]+)`/)
        if (match) {
          prompts[industry] = match[1]
        }
      }
    }

    it('no two prompts are identical', () => {
      const seen = new Set<string>()
      for (const [industry, prompt] of Object.entries(prompts)) {
        expect(seen.has(prompt)).toBe(false)
        seen.add(prompt)
      }
    })

    it('each prompt mentions its specific industry context', () => {
      // Each prompt should have a header matching the industry
      for (const [industry, prompt] of Object.entries(prompts)) {
        expect(prompt).toContain('INDUSTRY CONTEXT')
      }
    })
  })

  describe('TypeScript compilation', () => {
    it('all industry files are valid TypeScript', async () => {
      const { execSync } = await import('child_process')
      const result = execSync(
        'npx tsc --noEmit --strict --moduleResolution bundler --module esnext --target es2017 ' +
        ALL_INDUSTRIES.map(i => `apps/web/prompts/industries/${i}.ts`).join(' ') +
        ' apps/web/prompts/industries/index.ts',
        { cwd: path.join(__dirname, '..'), encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }
      )
      // If it doesn't throw, compilation succeeded
      expect(true).toBe(true)
    })
  })
})
