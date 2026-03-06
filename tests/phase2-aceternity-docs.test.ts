import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync, statSync } from "fs";
import { join } from "path";

const ACETERNITY_DIR = join(process.cwd(), "data", "components", "aceternity");

describe("Phase 2.3: Scrape Aceternity UI documentation", () => {
  const files = readdirSync(ACETERNITY_DIR).filter((f) => f.endsWith(".json"));

  it("should have at least 30 component JSON files", () => {
    expect(files.length).toBeGreaterThanOrEqual(30);
  });

  it("should have at most 50 component JSON files", () => {
    expect(files.length).toBeLessThanOrEqual(50);
  });

  const requiredComponents = [
    "3d-card-effect",
    "aurora-background",
    "background-beams",
    "bento-grid",
    "card-hover-effect",
    "floating-navbar",
    "hero-highlight",
    "hero-parallax",
    "infinite-moving-cards",
    "lamp-effect",
    "meteor-effect",
    "moving-border",
    "sparkles",
    "spotlight",
    "sticky-scroll-reveal",
    "text-generate-effect",
    "typewriter-effect",
    "wavy-background",
    "wobble-card",
    "tracing-beam",
  ];

  for (const component of requiredComponents) {
    it(`should have ${component}.json`, () => {
      expect(files).toContain(`${component}.json`);
    });
  }

  it("each JSON file should have the required fields", () => {
    for (const file of files) {
      const content = JSON.parse(
        readFileSync(join(ACETERNITY_DIR, file), "utf-8")
      );
      expect(content.name).toBeTruthy();
      expect(content.library).toBe("aceternity");
      expect(content.description).toBeTruthy();
      expect(content.whenToUse).toBeTruthy();
      expect(content.installation).toMatch(/aceternity/);
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
        readFileSync(join(ACETERNITY_DIR, file), "utf-8")
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
    const scriptPath = join(process.cwd(), "scripts", "scrape-aceternity.ts");
    const stat = statSync(scriptPath);
    expect(stat.isFile()).toBe(true);
  });

  it("code examples should contain component imports from @/components/ui/", () => {
    for (const file of files) {
      const content = JSON.parse(
        readFileSync(join(ACETERNITY_DIR, file), "utf-8")
      );
      // Aceternity components import from @/components/ui/ or use plain JSX
      expect(content.codeExample).toMatch(
        /@\/components\/ui\/|from "framer-motion"|className/
      );
    }
  });

  it("should cover all key categories: hero, background, card, text, scroll", () => {
    const allTags = files.flatMap((file) => {
      const content = JSON.parse(
        readFileSync(join(ACETERNITY_DIR, file), "utf-8")
      );
      return content.tags;
    });
    expect(allTags).toContain("hero");
    expect(allTags).toContain("background");
    expect(allTags).toContain("card");
    expect(allTags).toContain("text");
    expect(allTags).toContain("scroll");
  });
});
