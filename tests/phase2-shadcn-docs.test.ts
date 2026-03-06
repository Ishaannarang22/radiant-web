import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync } from "fs";
import { join } from "path";

const SHADCN_DIR = join(process.cwd(), "data", "components", "shadcn");

describe("Phase 2.2: Scrape shadcn/ui documentation", () => {
  const files = readdirSync(SHADCN_DIR).filter((f) => f.endsWith(".json"));

  it("should have at least 40 component JSON files", () => {
    expect(files.length).toBeGreaterThanOrEqual(40);
  });

  it("should have at most 50 component JSON files", () => {
    expect(files.length).toBeLessThanOrEqual(50);
  });

  const requiredComponents = [
    "button",
    "card",
    "dialog",
    "dropdown-menu",
    "input",
    "select",
    "table",
    "tabs",
    "accordion",
    "alert",
    "avatar",
    "badge",
    "calendar",
    "carousel",
    "checkbox",
    "label",
    "navigation-menu",
    "popover",
    "progress",
    "separator",
    "sheet",
    "skeleton",
    "slider",
    "switch",
    "textarea",
    "toast",
    "toggle",
    "tooltip",
  ];

  for (const component of requiredComponents) {
    it(`should have ${component}.json`, () => {
      expect(files).toContain(`${component}.json`);
    });
  }

  it("each JSON file should have the required fields", () => {
    for (const file of files) {
      const content = JSON.parse(
        readFileSync(join(SHADCN_DIR, file), "utf-8")
      );
      expect(content.name).toBeTruthy();
      expect(content.library).toBe("shadcn");
      expect(content.description).toBeTruthy();
      expect(content.whenToUse).toBeTruthy();
      expect(content.installation).toMatch(/^npx shadcn@latest add /);
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
        readFileSync(join(SHADCN_DIR, file), "utf-8")
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
    const scriptPath = join(process.cwd(), "scripts", "scrape-shadcn.ts");
    const stat = require("fs").statSync(scriptPath);
    expect(stat.isFile()).toBe(true);
  });

  it("code examples should contain component imports from @/components/ui/", () => {
    for (const file of files) {
      const content = JSON.parse(
        readFileSync(join(SHADCN_DIR, file), "utf-8")
      );
      expect(content.codeExample).toMatch(
        /@\/components\/ui\/|from "sonner"|from "@\/hooks\//
      );
    }
  });
});
