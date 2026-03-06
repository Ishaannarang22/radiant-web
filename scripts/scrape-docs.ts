/**
 * scripts/scrape-docs.ts
 *
 * Unified scraping orchestrator that runs all four component library scrapers,
 * validates output, logs progress, and reports totals.
 *
 * Usage: npx tsx scripts/scrape-docs.ts [--library <name>] [--delay <ms>]
 *
 * Options:
 *   --library <name>  Run only a specific library scraper (shadcn, aceternity, magic-ui, 21st-dev)
 *   --delay <ms>      Delay between file writes in ms for rate limiting (default: 0)
 *   --validate        Only validate existing JSON files, don't regenerate
 */

import { execSync } from "child_process";
import { readdirSync, readFileSync, existsSync } from "fs";
import { join } from "path";

interface LibraryConfig {
  name: string;
  script: string;
  dataDir: string;
  minExpected: number;
}

const LIBRARIES: LibraryConfig[] = [
  {
    name: "shadcn",
    script: "scripts/scrape-shadcn.ts",
    dataDir: "data/components/shadcn",
    minExpected: 40,
  },
  {
    name: "aceternity",
    script: "scripts/scrape-aceternity.ts",
    dataDir: "data/components/aceternity",
    minExpected: 40,
  },
  {
    name: "magic-ui",
    script: "scripts/scrape-magic-ui.ts",
    dataDir: "data/components/magic-ui",
    minExpected: 25,
  },
  {
    name: "21st-dev",
    script: "scripts/scrape-21st-dev.ts",
    dataDir: "data/components/21st-dev",
    minExpected: 20,
  },
];

const REQUIRED_FIELDS = [
  "name",
  "library",
  "description",
  "whenToUse",
  "installation",
  "props",
  "codeExample",
  "tags",
];

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseArgs(): { library?: string; delay: number; validate: boolean } {
  const args = process.argv.slice(2);
  let library: string | undefined;
  let delay = 0;
  let validate = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--library" && args[i + 1]) {
      library = args[i + 1];
      i++;
    } else if (args[i] === "--delay" && args[i + 1]) {
      delay = parseInt(args[i + 1], 10);
      i++;
    } else if (args[i] === "--validate") {
      validate = true;
    }
  }

  return { library, delay, validate };
}

function validateJsonFiles(dataDir: string): {
  total: number;
  valid: number;
  errors: string[];
} {
  const errors: string[] = [];
  const absDir = join(process.cwd(), dataDir);

  if (!existsSync(absDir)) {
    return { total: 0, valid: 0, errors: [`Directory not found: ${dataDir}`] };
  }

  const files = readdirSync(absDir).filter((f) => f.endsWith(".json"));
  let valid = 0;

  for (const file of files) {
    const filePath = join(absDir, file);
    try {
      const content = JSON.parse(readFileSync(filePath, "utf-8"));

      const missing = REQUIRED_FIELDS.filter(
        (field) => !(field in content)
      );
      if (missing.length > 0) {
        errors.push(`${file}: missing fields: ${missing.join(", ")}`);
      } else if (!Array.isArray(content.props)) {
        errors.push(`${file}: props is not an array`);
      } else if (!Array.isArray(content.tags)) {
        errors.push(`${file}: tags is not an array`);
      } else {
        valid++;
      }
    } catch (e) {
      errors.push(`${file}: invalid JSON - ${(e as Error).message}`);
    }
  }

  return { total: files.length, valid, errors };
}

async function scrapeLibrary(
  lib: LibraryConfig,
  delay: number
): Promise<{ success: boolean; count: number; errors: string[] }> {
  const scriptPath = join(process.cwd(), lib.script);
  if (!existsSync(scriptPath)) {
    return {
      success: false,
      count: 0,
      errors: [`Script not found: ${lib.script}`],
    };
  }

  console.log(`\n--- Scraping ${lib.name} ---`);

  try {
    if (delay > 0) {
      console.log(`  Rate limit: ${delay}ms delay between operations`);
      await sleep(delay);
    }

    const output = execSync(`npx tsx ${lib.script}`, {
      cwd: process.cwd(),
      encoding: "utf-8",
      timeout: 60_000,
    });
    console.log(output.trim());
  } catch (e) {
    const msg = (e as Error).message;
    return { success: false, count: 0, errors: [`Script failed: ${msg}`] };
  }

  const result = validateJsonFiles(lib.dataDir);
  const absDir = join(process.cwd(), lib.dataDir);
  const fileCount = existsSync(absDir)
    ? readdirSync(absDir).filter((f) => f.endsWith(".json")).length
    : 0;

  console.log(
    `  Scraped ${fileCount}/${lib.minExpected}+ ${lib.name} components`
  );

  if (result.errors.length > 0) {
    console.log(`  Validation errors:`);
    result.errors.forEach((err) => console.log(`    - ${err}`));
  }

  if (fileCount < lib.minExpected) {
    return {
      success: false,
      count: fileCount,
      errors: [
        `Expected at least ${lib.minExpected} components, got ${fileCount}`,
      ],
    };
  }

  return {
    success: result.errors.length === 0,
    count: fileCount,
    errors: result.errors,
  };
}

async function main() {
  const { library, delay, validate } = parseArgs();
  const startTime = Date.now();

  const targetLibraries = library
    ? LIBRARIES.filter((l) => l.name === library)
    : LIBRARIES;

  if (library && targetLibraries.length === 0) {
    console.error(
      `Unknown library: ${library}. Available: ${LIBRARIES.map((l) => l.name).join(", ")}`
    );
    process.exit(1);
  }

  console.log("=== Radiant Web Component Documentation Scraper ===");
  console.log(`Libraries: ${targetLibraries.map((l) => l.name).join(", ")}`);

  if (validate) {
    console.log("\nValidation-only mode\n");
    let totalFiles = 0;
    let totalValid = 0;
    let allErrors: string[] = [];

    for (const lib of targetLibraries) {
      console.log(`--- Validating ${lib.name} ---`);
      const result = validateJsonFiles(lib.dataDir);
      totalFiles += result.total;
      totalValid += result.valid;
      allErrors = allErrors.concat(
        result.errors.map((e) => `[${lib.name}] ${e}`)
      );
      console.log(
        `  Files: ${result.total}, Valid: ${result.valid}, Errors: ${result.errors.length}`
      );
    }

    console.log(`\n=== Validation Summary ===`);
    console.log(`Total files: ${totalFiles}`);
    console.log(`Valid: ${totalValid}`);
    console.log(`Errors: ${allErrors.length}`);

    if (allErrors.length > 0) {
      allErrors.forEach((e) => console.log(`  - ${e}`));
      process.exit(1);
    }
    return;
  }

  let totalComponents = 0;
  let successCount = 0;
  const allErrors: string[] = [];

  for (const lib of targetLibraries) {
    const result = await scrapeLibrary(lib, delay);
    totalComponents += result.count;
    if (result.success) successCount++;
    allErrors.push(...result.errors.map((e) => `[${lib.name}] ${e}`));
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log(`\n=== Scraping Summary ===`);
  console.log(`Libraries processed: ${targetLibraries.length}`);
  console.log(`Libraries succeeded: ${successCount}/${targetLibraries.length}`);
  console.log(`Total components: ${totalComponents}`);
  console.log(`Duration: ${duration}s`);

  if (allErrors.length > 0) {
    console.log(`\nErrors (${allErrors.length}):`);
    allErrors.forEach((e) => console.log(`  - ${e}`));
    process.exit(1);
  }

  console.log(`\nAll component documentation generated successfully.`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
