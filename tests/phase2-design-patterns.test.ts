import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

const PATTERNS_DIR = join(process.cwd(), "data", "patterns");

const REQUIRED_FILES = [
  "hero-sections.json",
  "cta-patterns.json",
  "color-schemes.json",
  "copy-formulas.json",
];

function readJSON(filename: string) {
  const filepath = join(PATTERNS_DIR, filename);
  return JSON.parse(readFileSync(filepath, "utf-8"));
}

describe("Phase 2.8: Curate design patterns", () => {
  for (const file of REQUIRED_FILES) {
    it(`should have ${file}`, () => {
      expect(existsSync(join(PATTERNS_DIR, file))).toBe(true);
    });

    it(`${file} should be valid JSON`, () => {
      expect(() => readJSON(file)).not.toThrow();
    });
  }

  describe("hero-sections.json", () => {
    const data = readJSON("hero-sections.json");

    it("should have pattern_type field", () => {
      expect(data.pattern_type).toBe("hero-sections");
    });

    it("should have 8-10 hero patterns", () => {
      expect(data.patterns.length).toBeGreaterThanOrEqual(8);
      expect(data.patterns.length).toBeLessThanOrEqual(10);
    });

    it("should include required hero layouts", () => {
      const names = data.patterns.map((p: { name: string }) => p.name);
      expect(names).toContain("Full-Width Image Background");
      expect(names).toContain("Split Layout");
      expect(names).toContain("Centered Text with Gradient");
      expect(names).toContain("Video Background");
      expect(names).toContain("Animated Text Hero");
    });

    for (const pattern of readJSON("hero-sections.json").patterns) {
      it(`hero pattern "${pattern.name}" should have required fields`, () => {
        expect(pattern).toHaveProperty("name");
        expect(pattern).toHaveProperty("description");
        expect(pattern).toHaveProperty("layout");
        expect(pattern).toHaveProperty("structure");
        expect(pattern).toHaveProperty("elements");
        expect(pattern).toHaveProperty("suggested_components");
        expect(pattern).toHaveProperty("best_for");
        expect(Array.isArray(pattern.elements)).toBe(true);
        expect(Array.isArray(pattern.suggested_components)).toBe(true);
        expect(Array.isArray(pattern.best_for)).toBe(true);
        expect(pattern.description.length).toBeGreaterThan(20);
      });
    }
  });

  describe("cta-patterns.json", () => {
    const data = readJSON("cta-patterns.json");

    it("should have pattern_type field", () => {
      expect(data.pattern_type).toBe("cta-patterns");
    });

    it("should have 6-8 CTA patterns", () => {
      expect(data.patterns.length).toBeGreaterThanOrEqual(6);
      expect(data.patterns.length).toBeLessThanOrEqual(8);
    });

    it("should include required CTA layouts", () => {
      const names = data.patterns.map((p: { name: string }) => p.name);
      expect(names).toContain("Single Button Centered");
      expect(names).toContain("Two Buttons");
      expect(names).toContain("CTA with Phone Number");
      expect(names).toContain("CTA with Form");
    });

    for (const pattern of readJSON("cta-patterns.json").patterns) {
      it(`CTA pattern "${pattern.name}" should have required fields`, () => {
        expect(pattern).toHaveProperty("name");
        expect(pattern).toHaveProperty("description");
        expect(pattern).toHaveProperty("layout");
        expect(pattern).toHaveProperty("structure");
        expect(pattern).toHaveProperty("elements");
        expect(pattern).toHaveProperty("suggested_components");
        expect(pattern).toHaveProperty("conversion_tip");
        expect(pattern.conversion_tip.length).toBeGreaterThan(10);
      });
    }
  });

  describe("color-schemes.json", () => {
    const data = readJSON("color-schemes.json");

    it("should have pattern_type field", () => {
      expect(data.pattern_type).toBe("color-schemes");
    });

    it("should have 15-20 color palettes", () => {
      expect(data.palettes.length).toBeGreaterThanOrEqual(15);
      expect(data.palettes.length).toBeLessThanOrEqual(20);
    });

    const hexRegex = /^#[0-9A-Fa-f]{6}$/;

    for (const palette of readJSON("color-schemes.json").palettes) {
      it(`palette "${palette.name}" should have valid hex colors`, () => {
        expect(palette.primary).toMatch(hexRegex);
        expect(palette.secondary).toMatch(hexRegex);
        expect(palette.accent).toMatch(hexRegex);
        expect(palette.background).toMatch(hexRegex);
        expect(palette.text).toMatch(hexRegex);
      });

      it(`palette "${palette.name}" should have industries and mood`, () => {
        expect(Array.isArray(palette.industries)).toBe(true);
        expect(palette.industries.length).toBeGreaterThan(0);
        expect(palette.mood).toBeTruthy();
        expect(palette.mood.length).toBeGreaterThan(5);
      });
    }

    it("should cover all major industries", () => {
      const allIndustries = new Set(
        data.palettes.flatMap((p: { industries: string[] }) => p.industries)
      );
      const required = [
        "restaurant",
        "dental",
        "salon",
        "plumber",
        "lawyer",
        "real-estate",
        "gym",
        "auto-repair",
        "cleaning-service",
      ];
      for (const industry of required) {
        expect(allIndustries.has(industry)).toBe(true);
      }
    });
  });

  describe("copy-formulas.json", () => {
    const data = readJSON("copy-formulas.json");

    it("should have pattern_type field", () => {
      expect(data.pattern_type).toBe("copy-formulas");
    });

    it("should have formulas object", () => {
      expect(data.formulas).toBeDefined();
      expect(typeof data.formulas).toBe("object");
    });

    const requiredCategories = [
      "problem_solution_headlines",
      "social_proof_headlines",
      "benefit_driven_headlines",
      "location_authority_headlines",
      "subheadlines",
      "urgency_ctas",
      "trust_building_ctas",
      "direct_action_ctas",
      "about_section_openers",
    ];

    for (const category of requiredCategories) {
      it(`should have "${category}" category`, () => {
        expect(data.formulas).toHaveProperty(category);
      });

      it(`"${category}" should have templates array`, () => {
        expect(Array.isArray(data.formulas[category].templates)).toBe(true);
        expect(data.formulas[category].templates.length).toBeGreaterThanOrEqual(
          5
        );
      });
    }

    it("headline templates should use placeholders", () => {
      const allTemplates = Object.values(data.formulas).flatMap(
        (cat: unknown) => (cat as { templates: string[] }).templates
      );
      const withPlaceholders = allTemplates.filter((t: string) =>
        t.includes("{")
      );
      expect(withPlaceholders.length).toBeGreaterThan(10);
    });
  });
});
