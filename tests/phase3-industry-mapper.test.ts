import { describe, it, expect } from 'vitest'
import { mapCategoryToIndustry, getSupportedIndustries } from '../packages/scraper/industry-mapper'
import * as fs from 'fs'
import * as path from 'path'

describe('Category-to-Industry Mapper', () => {
  // --------------------------------------------------
  // Restaurant mappings
  // --------------------------------------------------
  it('maps restaurant categories correctly', () => {
    expect(mapCategoryToIndustry('Italian restaurant')).toBe('restaurant')
    expect(mapCategoryToIndustry('Chinese restaurant')).toBe('restaurant')
    expect(mapCategoryToIndustry('Fast food restaurant')).toBe('restaurant')
    expect(mapCategoryToIndustry('Cafe')).toBe('restaurant')
    expect(mapCategoryToIndustry('Coffee shop')).toBe('restaurant')
    expect(mapCategoryToIndustry('Bakery')).toBe('restaurant')
    expect(mapCategoryToIndustry('Pizza restaurant')).toBe('restaurant')
    expect(mapCategoryToIndustry('Pizzeria')).toBe('restaurant')
    expect(mapCategoryToIndustry('Bar & grill')).toBe('restaurant')
    expect(mapCategoryToIndustry('Sushi bar')).toBe('restaurant')
    expect(mapCategoryToIndustry('Steakhouse')).toBe('restaurant')
    expect(mapCategoryToIndustry('Brewery')).toBe('restaurant')
    expect(mapCategoryToIndustry('Ice cream shop')).toBe('restaurant')
    expect(mapCategoryToIndustry('Catering service')).toBe('restaurant')
  })

  // --------------------------------------------------
  // Dental mappings
  // --------------------------------------------------
  it('maps dental categories correctly', () => {
    expect(mapCategoryToIndustry('General dentist')).toBe('dental')
    expect(mapCategoryToIndustry('Dental clinic')).toBe('dental')
    expect(mapCategoryToIndustry('Cosmetic dentist')).toBe('dental')
    expect(mapCategoryToIndustry('Orthodontist')).toBe('dental')
    expect(mapCategoryToIndustry('Pediatric dentist')).toBe('dental')
    expect(mapCategoryToIndustry('Endodontist')).toBe('dental')
    expect(mapCategoryToIndustry('Periodontist')).toBe('dental')
    expect(mapCategoryToIndustry('Oral surgeon')).toBe('dental')
  })

  // --------------------------------------------------
  // Salon mappings
  // --------------------------------------------------
  it('maps salon categories correctly', () => {
    expect(mapCategoryToIndustry('Hair salon')).toBe('salon')
    expect(mapCategoryToIndustry('Barber shop')).toBe('salon')
    expect(mapCategoryToIndustry('Beauty salon')).toBe('salon')
    expect(mapCategoryToIndustry('Nail salon')).toBe('salon')
    expect(mapCategoryToIndustry('Day spa')).toBe('salon')
    expect(mapCategoryToIndustry('Massage therapist')).toBe('salon')
    expect(mapCategoryToIndustry('Waxing service')).toBe('salon')
    expect(mapCategoryToIndustry('Cosmetics store')).toBe('salon')
  })

  // --------------------------------------------------
  // Plumber mappings
  // --------------------------------------------------
  it('maps plumber categories correctly', () => {
    expect(mapCategoryToIndustry('Plumber')).toBe('plumber')
    expect(mapCategoryToIndustry('Plumbing service')).toBe('plumber')
    expect(mapCategoryToIndustry('HVAC contractor')).toBe('plumber')
    expect(mapCategoryToIndustry('Heating contractor')).toBe('plumber')
    expect(mapCategoryToIndustry('Air conditioning contractor')).toBe('plumber')
    expect(mapCategoryToIndustry('Drain cleaning service')).toBe('plumber')
  })

  // --------------------------------------------------
  // Lawyer mappings
  // --------------------------------------------------
  it('maps lawyer categories correctly', () => {
    expect(mapCategoryToIndustry('Personal injury attorney')).toBe('lawyer')
    expect(mapCategoryToIndustry('Criminal defense lawyer')).toBe('lawyer')
    expect(mapCategoryToIndustry('Law firm')).toBe('lawyer')
    expect(mapCategoryToIndustry('Family law attorney')).toBe('lawyer')
    expect(mapCategoryToIndustry('Legal services')).toBe('lawyer')
    expect(mapCategoryToIndustry('Law office')).toBe('lawyer')
  })

  // --------------------------------------------------
  // Real estate mappings
  // --------------------------------------------------
  it('maps real-estate categories correctly', () => {
    expect(mapCategoryToIndustry('Real estate agent')).toBe('real-estate')
    expect(mapCategoryToIndustry('Realtor')).toBe('real-estate')
    expect(mapCategoryToIndustry('Real estate agency')).toBe('real-estate')
    expect(mapCategoryToIndustry('Property management company')).toBe('real-estate')
    expect(mapCategoryToIndustry('Mortgage broker')).toBe('real-estate')
    expect(mapCategoryToIndustry('Home builder')).toBe('real-estate')
  })

  // --------------------------------------------------
  // Gym mappings
  // --------------------------------------------------
  it('maps gym categories correctly', () => {
    expect(mapCategoryToIndustry('Gym')).toBe('gym')
    expect(mapCategoryToIndustry('Fitness center')).toBe('gym')
    expect(mapCategoryToIndustry('Yoga studio')).toBe('gym')
    expect(mapCategoryToIndustry('Pilates studio')).toBe('gym')
    expect(mapCategoryToIndustry('CrossFit gym')).toBe('gym')
    expect(mapCategoryToIndustry('Martial arts school')).toBe('gym')
    expect(mapCategoryToIndustry('Personal trainer')).toBe('gym')
    expect(mapCategoryToIndustry('Health club')).toBe('gym')
  })

  // --------------------------------------------------
  // Auto repair mappings
  // --------------------------------------------------
  it('maps auto-repair categories correctly', () => {
    expect(mapCategoryToIndustry('Auto repair shop')).toBe('auto-repair')
    expect(mapCategoryToIndustry('Mechanic')).toBe('auto-repair')
    expect(mapCategoryToIndustry('Car repair')).toBe('auto-repair')
    expect(mapCategoryToIndustry('Auto body shop')).toBe('auto-repair')
    expect(mapCategoryToIndustry('Tire shop')).toBe('auto-repair')
    expect(mapCategoryToIndustry('Oil change service')).toBe('auto-repair')
    expect(mapCategoryToIndustry('Car wash')).toBe('auto-repair')
    expect(mapCategoryToIndustry('Automotive service')).toBe('auto-repair')
  })

  // --------------------------------------------------
  // Cleaning service mappings
  // --------------------------------------------------
  it('maps cleaning-service categories correctly', () => {
    expect(mapCategoryToIndustry('Cleaning service')).toBe('cleaning-service')
    expect(mapCategoryToIndustry('Maid service')).toBe('cleaning-service')
    expect(mapCategoryToIndustry('Janitorial service')).toBe('cleaning-service')
    expect(mapCategoryToIndustry('Housekeeping service')).toBe('cleaning-service')
    expect(mapCategoryToIndustry('Carpet cleaning service')).toBe('cleaning-service')
    expect(mapCategoryToIndustry('Pressure washing service')).toBe('cleaning-service')
    expect(mapCategoryToIndustry('Window cleaning service')).toBe('cleaning-service')
  })

  // --------------------------------------------------
  // Generic / fallback
  // --------------------------------------------------
  it('returns generic for unknown categories', () => {
    expect(mapCategoryToIndustry('Accounting firm')).toBe('generic')
    expect(mapCategoryToIndustry('Insurance agency')).toBe('generic')
    expect(mapCategoryToIndustry('Flower shop')).toBe('generic')
    expect(mapCategoryToIndustry('Pet store')).toBe('generic')
    expect(mapCategoryToIndustry('')).toBe('generic')
  })

  // --------------------------------------------------
  // Array input (multiple categories)
  // --------------------------------------------------
  it('accepts an array of categories and matches any', () => {
    expect(mapCategoryToIndustry(['Pet store', 'Veterinarian'])).toBe('generic')
    expect(mapCategoryToIndustry(['Store', 'Italian restaurant'])).toBe('restaurant')
    expect(mapCategoryToIndustry(['Health', 'Dental clinic'])).toBe('dental')
  })

  // --------------------------------------------------
  // Case insensitivity
  // --------------------------------------------------
  it('is case-insensitive', () => {
    expect(mapCategoryToIndustry('ITALIAN RESTAURANT')).toBe('restaurant')
    expect(mapCategoryToIndustry('general DENTIST')).toBe('dental')
    expect(mapCategoryToIndustry('Hair SALON')).toBe('salon')
    expect(mapCategoryToIndustry('PLUMBER')).toBe('plumber')
    expect(mapCategoryToIndustry('LAW FIRM')).toBe('lawyer')
  })

  // --------------------------------------------------
  // getSupportedIndustries
  // --------------------------------------------------
  it('returns all supported industries', () => {
    const industries = getSupportedIndustries()
    expect(industries).toContain('restaurant')
    expect(industries).toContain('dental')
    expect(industries).toContain('salon')
    expect(industries).toContain('plumber')
    expect(industries).toContain('lawyer')
    expect(industries).toContain('real-estate')
    expect(industries).toContain('gym')
    expect(industries).toContain('auto-repair')
    expect(industries).toContain('cleaning-service')
    expect(industries.length).toBe(9) // 9 specific + generic is fallback
  })

  // --------------------------------------------------
  // Every industry has a matching template file
  // --------------------------------------------------
  it('every industry has a corresponding template file', () => {
    const industries = [...getSupportedIndustries(), 'generic' as const]
    const templatesDir = path.resolve(__dirname, '../data/templates')
    for (const industry of industries) {
      const templatePath = path.join(templatesDir, `${industry}.json`)
      expect(fs.existsSync(templatePath), `Missing template: ${industry}.json`).toBe(true)
    }
  })

  // --------------------------------------------------
  // Module exports are correct
  // --------------------------------------------------
  it('exports mapCategoryToIndustry and getSupportedIndustries', () => {
    expect(typeof mapCategoryToIndustry).toBe('function')
    expect(typeof getSupportedIndustries).toBe('function')
  })

  // --------------------------------------------------
  // TypeScript compilation
  // --------------------------------------------------
  it('industry-mapper.ts compiles without errors', () => {
    const filePath = path.resolve(__dirname, '../packages/scraper/industry-mapper.ts')
    expect(fs.existsSync(filePath)).toBe(true)
    const content = fs.readFileSync(filePath, 'utf-8')
    expect(content).toContain('export function mapCategoryToIndustry')
    expect(content).toContain('export type Industry')
  })
})
