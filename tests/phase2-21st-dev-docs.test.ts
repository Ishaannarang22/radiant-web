import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync, statSync } from "fs";
import { join } from "path";

const DEV21ST_DIR = join(process.cwd(), "data", "components", "21st-dev");

describe("Phase 2.5: Scrape 21st.dev documentation", () => {
  const files = readdirSync(DEV21ST_DIR).filter((f) => f.endsWith(".json"));

  it("should have at least 20 component JSON files", () => {
    expect(files.length).toBeGreaterThanOrEqual(20);
  });

  it("should have at most 35 component JSON files", () => {
    expect(files.length).toBeLessThanOrEqual(35);
  });

  const requiredComponents = [
    "hero-section",
    "features-grid",
    "pricing-section",
    "testimonials-section",
    "cta-section",
    "footer-section",
    "navbar",
    "faq-section",
    "contact-section",
    "gallery-section",
    "services-section",
    "page-template-restaurant",
    "page-template-service",
  ];

  for (const component of requiredComponents) {
    it(`should have ${component}.json`, () => {
      expect(files).toContain(`${component}.json`);
    });
  }

  it("each JSON file should have the required fields", () => {
    for (const file of files) {
      const content = JSON.parse(
        readFileSync(join(DEV21ST_DIR, file), "utf-8")
      );
      expect(content.name).toBeTruthy();
      expect(content.library).toBe("21st-dev");
      expect(content.description).toBeTruthy();
      expect(content.whenToUse).toBeTruthy();
      expect(content.installation).toMatch(/21st/);
      expect(Array.isArray(content.props)).toBe(true);
      expect(content.props.length).toBeGreaterThan(0);
      expect(content.codeExample).toBeTruthy();
      expect(content.codeExample).toContain("import");
      expect(Array.isArray(content.tags)).toBe(true);
      expect(content.tags.length).toBeGreaterThan(0);
    }
  });

  it("each prop should have name, type, default, and description", () => {
    for (const file of files) {
      const content = JSON.parse(
        readFileSync(join(DEV21ST_DIR, file), "utf-8")
      );
      for (const prop of content.props) {
        expect(prop.name).toBeTruthy();
        expect(prop.type).toBeTruthy();
        expect(prop.default).toBeDefined();
        expect(prop.description).toBeTruthy();
      }
    }
  });

  it("scrape script should exist", () => {
    const scriptPath = join(process.cwd(), "scripts", "scrape-21st-dev.ts");
    const stat = statSync(scriptPath);
    expect(stat.isFile()).toBe(true);
  });

  it("code examples should contain component imports from @/components/ui/", () => {
    for (const file of files) {
      const content = JSON.parse(
        readFileSync(join(DEV21ST_DIR, file), "utf-8")
      );
      expect(content.codeExample).toMatch(/@\/components\/ui\//);
    }
  });

  it("should cover key categories: section, template, component", () => {
    const allTags = files.flatMap((file) => {
      const content = JSON.parse(
        readFileSync(join(DEV21ST_DIR, file), "utf-8")
      );
      return content.tags;
    });
    expect(allTags).toContain("section");
    expect(allTags).toContain("template");
    expect(allTags).toContain("component");
  });

  it("should include business-focused components (hours, menu, booking)", () => {
    const businessComponents = [
      "hours-and-location",
      "menu-grid",
      "booking-section",
    ];
    for (const comp of businessComponents) {
      expect(files).toContain(`${comp}.json`);
    }
  });

  it("should include full-page templates", () => {
    const templates = files.filter((f) => f.startsWith("page-template-"));
    expect(templates.length).toBeGreaterThanOrEqual(2);
  });
});
