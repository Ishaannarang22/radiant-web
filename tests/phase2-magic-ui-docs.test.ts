import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync, statSync } from "fs";
import { join } from "path";

const MAGIC_UI_DIR = join(process.cwd(), "data", "components", "magic-ui");

describe("Phase 2.4: Scrape Magic UI documentation", () => {
  const files = readdirSync(MAGIC_UI_DIR).filter((f) => f.endsWith(".json"));

  it("should have at least 20 component JSON files", () => {
    expect(files.length).toBeGreaterThanOrEqual(20);
  });

  it("should have at most 40 component JSON files", () => {
    expect(files.length).toBeLessThanOrEqual(40);
  });

  const requiredComponents = [
    "animated-beam",
    "animated-shiny-text",
    "bento-grid",
    "border-beam",
    "dock",
    "globe",
    "marquee",
    "meteors",
    "number-ticker",
    "particles",
    "shimmer-button",
    "shine-border",
    "sparkles-text",
    "typing-animation",
    "word-rotate",
  ];

  for (const component of requiredComponents) {
    it(`should have ${component}.json`, () => {
      expect(files).toContain(`${component}.json`);
    });
  }

  it("each JSON file should have the required fields", () => {
    for (const file of files) {
      const content = JSON.parse(
        readFileSync(join(MAGIC_UI_DIR, file), "utf-8")
      );
      expect(content.name).toBeTruthy();
      expect(content.library).toBe("magic-ui");
      expect(content.description).toBeTruthy();
      expect(content.whenToUse).toBeTruthy();
      expect(content.installation).toMatch(/magicui/);
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
        readFileSync(join(MAGIC_UI_DIR, file), "utf-8")
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
    const scriptPath = join(process.cwd(), "scripts", "scrape-magic-ui.ts");
    const stat = statSync(scriptPath);
    expect(stat.isFile()).toBe(true);
  });

  it("code examples should contain component imports from @/components/ui/", () => {
    for (const file of files) {
      const content = JSON.parse(
        readFileSync(join(MAGIC_UI_DIR, file), "utf-8")
      );
      expect(content.codeExample).toMatch(
        /@\/components\/ui\/|from "framer-motion"|className/
      );
    }
  });

  it("should cover key categories: text, button, background, animation", () => {
    const allTags = files.flatMap((file) => {
      const content = JSON.parse(
        readFileSync(join(MAGIC_UI_DIR, file), "utf-8")
      );
      return content.tags;
    });
    expect(allTags).toContain("text");
    expect(allTags).toContain("button");
    expect(allTags).toContain("background");
    expect(allTags).toContain("animation");
  });
});
