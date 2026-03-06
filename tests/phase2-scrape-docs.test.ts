import { describe, it, expect } from "vitest";
import { existsSync, readdirSync, readFileSync } from "fs";
import { join } from "path";
import { execSync } from "child_process";

const SCRIPTS_DIR = join(process.cwd(), "scripts");
const DATA_DIR = join(process.cwd(), "data", "components");

describe("Phase 2.6: Create the scraping script", () => {
  it("scripts/scrape-docs.ts should exist", () => {
    expect(existsSync(join(SCRIPTS_DIR, "scrape-docs.ts"))).toBe(true);
  });

  it("should import required modules (child_process, fs, path)", () => {
    const content = readFileSync(
      join(SCRIPTS_DIR, "scrape-docs.ts"),
      "utf-8"
    );
    expect(content).toContain("child_process");
    expect(content).toContain('from "fs"');
    expect(content).toContain('from "path"');
  });

  it("should define all four library configs", () => {
    const content = readFileSync(
      join(SCRIPTS_DIR, "scrape-docs.ts"),
      "utf-8"
    );
    expect(content).toContain("scrape-shadcn.ts");
    expect(content).toContain("scrape-aceternity.ts");
    expect(content).toContain("scrape-magic-ui.ts");
    expect(content).toContain("scrape-21st-dev.ts");
  });

  it("should support --library flag for single-library scraping", () => {
    const content = readFileSync(
      join(SCRIPTS_DIR, "scrape-docs.ts"),
      "utf-8"
    );
    expect(content).toContain("--library");
  });

  it("should support --validate flag for validation-only mode", () => {
    const content = readFileSync(
      join(SCRIPTS_DIR, "scrape-docs.ts"),
      "utf-8"
    );
    expect(content).toContain("--validate");
  });

  it("should support --delay flag for rate limiting", () => {
    const content = readFileSync(
      join(SCRIPTS_DIR, "scrape-docs.ts"),
      "utf-8"
    );
    expect(content).toContain("--delay");
  });

  it("should validate required fields in JSON files", () => {
    const content = readFileSync(
      join(SCRIPTS_DIR, "scrape-docs.ts"),
      "utf-8"
    );
    const requiredFields = [
      "name",
      "library",
      "description",
      "whenToUse",
      "installation",
      "props",
      "codeExample",
      "tags",
    ];
    for (const field of requiredFields) {
      expect(content).toContain(`"${field}"`);
    }
  });

  it("should log progress with component counts", () => {
    const content = readFileSync(
      join(SCRIPTS_DIR, "scrape-docs.ts"),
      "utf-8"
    );
    expect(content).toContain("Scraped");
    expect(content).toContain("components");
  });

  it("should run successfully with --validate and find all 150 components", () => {
    const output = execSync("npx tsx scripts/scrape-docs.ts --validate", {
      cwd: process.cwd(),
      encoding: "utf-8",
      timeout: 30_000,
    });
    expect(output).toContain("Total files: 150");
    expect(output).toContain("Valid: 150");
    expect(output).toContain("Errors: 0");
  });

  it("should run single library scrape successfully", () => {
    const output = execSync(
      "npx tsx scripts/scrape-docs.ts --library magic-ui",
      {
        cwd: process.cwd(),
        encoding: "utf-8",
        timeout: 30_000,
      }
    );
    expect(output).toContain("Libraries: magic-ui");
    expect(output).toContain("succeeded: 1/1");
    expect(output).toContain("successfully");
  });

  it("should run full scrape and produce summary", () => {
    const output = execSync("npx tsx scripts/scrape-docs.ts", {
      cwd: process.cwd(),
      encoding: "utf-8",
      timeout: 120_000,
    });
    expect(output).toContain("succeeded: 4/4");
    expect(output).toContain("Total components: 150");
    expect(output).toContain("successfully");
  });

  it("should have generated JSON files for all four libraries", () => {
    const libraries = ["shadcn", "aceternity", "magic-ui", "21st-dev"];
    for (const lib of libraries) {
      const libDir = join(DATA_DIR, lib);
      expect(existsSync(libDir)).toBe(true);
      const jsonFiles = readdirSync(libDir).filter((f) => f.endsWith(".json"));
      expect(jsonFiles.length).toBeGreaterThan(0);
    }
  });

  it("all JSON files should have valid structure", () => {
    const libraries = ["shadcn", "aceternity", "magic-ui", "21st-dev"];
    const requiredFields = [
      "name",
      "library",
      "description",
      "whenToUse",
      "installation",
      "props",
      "codeExample",
      "tags",
    ];

    for (const lib of libraries) {
      const libDir = join(DATA_DIR, lib);
      const jsonFiles = readdirSync(libDir).filter((f) => f.endsWith(".json"));
      for (const file of jsonFiles) {
        const content = JSON.parse(readFileSync(join(libDir, file), "utf-8"));
        for (const field of requiredFields) {
          expect(content).toHaveProperty(field);
        }
        expect(Array.isArray(content.props)).toBe(true);
        expect(Array.isArray(content.tags)).toBe(true);
      }
    }
  });
});
