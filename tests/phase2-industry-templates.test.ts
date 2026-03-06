import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync } from "fs";
import { join } from "path";

const TEMPLATES_DIR = join(process.cwd(), "data", "templates");

const REQUIRED_INDUSTRIES = [
  "restaurant",
  "dental",
  "salon",
  "plumber",
  "lawyer",
  "real-estate",
  "gym",
  "auto-repair",
  "cleaning-service",
  "generic",
];

const REQUIRED_FIELDS = [
  "industry",
  "display_name",
  "sections",
  "color_schemes",
  "copy_patterns",
  "must_have_sections",
  "photo_placement",
  "suggested_components",
];

describe("Phase 2.7: Curate industry-specific templates", () => {
  const files = readdirSync(TEMPLATES_DIR).filter((f) => f.endsWith(".json"));

  it("should have exactly 10 industry template files", () => {
    expect(files.length).toBe(10);
  });

  for (const industry of REQUIRED_INDUSTRIES) {
    it(`should have a template file for ${industry}`, () => {
      expect(files).toContain(`${industry}.json`);
    });
  }

  for (const industry of REQUIRED_INDUSTRIES) {
    describe(`${industry} template`, () => {
      const filePath = join(TEMPLATES_DIR, `${industry}.json`);
      const data = JSON.parse(readFileSync(filePath, "utf-8"));

      it("should be valid JSON with all required fields", () => {
        for (const field of REQUIRED_FIELDS) {
          expect(data).toHaveProperty(field);
        }
      });

      it("should have matching industry field", () => {
        expect(data.industry).toBe(industry);
      });

      it("should have a display_name string", () => {
        expect(typeof data.display_name).toBe("string");
        expect(data.display_name.length).toBeGreaterThan(0);
      });

      it("should have at least 5 sections", () => {
        expect(data.sections.length).toBeGreaterThanOrEqual(5);
      });

      it("should have at least 2 color schemes", () => {
        expect(data.color_schemes.length).toBeGreaterThanOrEqual(2);
      });

      it("should have color schemes with all required color fields", () => {
        for (const scheme of data.color_schemes) {
          expect(scheme).toHaveProperty("name");
          expect(scheme).toHaveProperty("primary");
          expect(scheme).toHaveProperty("secondary");
          expect(scheme).toHaveProperty("accent");
          expect(scheme).toHaveProperty("background");
          expect(scheme).toHaveProperty("text");
          // Verify hex color format
          expect(scheme.primary).toMatch(/^#[0-9A-Fa-f]{6}$/);
          expect(scheme.secondary).toMatch(/^#[0-9A-Fa-f]{6}$/);
          expect(scheme.accent).toMatch(/^#[0-9A-Fa-f]{6}$/);
        }
      });

      it("should have copy_patterns with hero_headline, cta, and about", () => {
        expect(data.copy_patterns).toHaveProperty("hero_headline");
        expect(data.copy_patterns).toHaveProperty("cta");
        expect(data.copy_patterns).toHaveProperty("about");
        expect(data.copy_patterns.hero_headline.length).toBeGreaterThanOrEqual(2);
        expect(data.copy_patterns.cta.length).toBeGreaterThanOrEqual(2);
      });

      it("should have at least 3 must_have_sections", () => {
        expect(data.must_have_sections.length).toBeGreaterThanOrEqual(3);
      });

      it("should have at least 2 photo_placement entries", () => {
        expect(data.photo_placement.length).toBeGreaterThanOrEqual(2);
      });

      it("should have suggested_components from at least 2 libraries", () => {
        const libs = Object.keys(data.suggested_components);
        expect(libs.length).toBeGreaterThanOrEqual(2);
        for (const lib of libs) {
          expect(data.suggested_components[lib].length).toBeGreaterThan(0);
        }
      });
    });
  }
});
