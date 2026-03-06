import { describe, it, expect, beforeAll } from "vitest";
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";

/**
 * Phase 4.3: Build the RAG retrieval layer
 *
 * Tests:
 * 1. Module structure — file exists, exports correct functions and types
 * 2. TypeScript compilation — code compiles without errors
 * 3. generateEmbedding — returns 1536-dimensional vector
 * 4. retrieveComponents — returns relevant components with correct shape
 * 5. retrieveTemplates — returns relevant templates with correct shape
 * 6. retrievePatterns — returns relevant patterns with correct shape
 * 7. Semantic relevance — results are meaningful (not random)
 */

const EMBEDDINGS_PATH = path.resolve(
  __dirname,
  "../apps/web/lib/embeddings.ts"
);

describe("Phase 4.3: RAG Retrieval Layer", () => {
  // ── 1. Module structure ───────────────────────────────
  describe("Module structure", () => {
    it("embeddings.ts file exists", () => {
      expect(fs.existsSync(EMBEDDINGS_PATH)).toBe(true);
    });

    it("exports generateEmbedding function", () => {
      const content = fs.readFileSync(EMBEDDINGS_PATH, "utf-8");
      expect(content).toContain("export async function generateEmbedding");
    });

    it("exports retrieveComponents function", () => {
      const content = fs.readFileSync(EMBEDDINGS_PATH, "utf-8");
      expect(content).toContain("export async function retrieveComponents");
    });

    it("exports retrieveTemplates function", () => {
      const content = fs.readFileSync(EMBEDDINGS_PATH, "utf-8");
      expect(content).toContain("export async function retrieveTemplates");
    });

    it("exports retrievePatterns function", () => {
      const content = fs.readFileSync(EMBEDDINGS_PATH, "utf-8");
      expect(content).toContain("export async function retrievePatterns");
    });

    it("exports ComponentDoc interface", () => {
      const content = fs.readFileSync(EMBEDDINGS_PATH, "utf-8");
      expect(content).toContain("export interface ComponentDoc");
    });

    it("exports Template interface", () => {
      const content = fs.readFileSync(EMBEDDINGS_PATH, "utf-8");
      expect(content).toContain("export interface Template");
    });

    it("exports Pattern interface", () => {
      const content = fs.readFileSync(EMBEDDINGS_PATH, "utf-8");
      expect(content).toContain("export interface Pattern");
    });

    it("imports from @radiant/db for vector search", () => {
      const content = fs.readFileSync(EMBEDDINGS_PATH, "utf-8");
      expect(content).toContain("searchComponents");
      expect(content).toContain("searchTemplates");
      expect(content).toContain("searchPatterns");
      expect(content).toContain("@radiant/db");
    });

    it("supports both OpenAI and local embedding backends", () => {
      const content = fs.readFileSync(EMBEDDINGS_PATH, "utf-8");
      expect(content).toContain("OPENAI_API_KEY");
      expect(content).toContain("@xenova/transformers");
      expect(content).toContain("all-MiniLM-L6-v2");
    });

    it("uses 1536-dimensional vectors", () => {
      const content = fs.readFileSync(EMBEDDINGS_PATH, "utf-8");
      expect(content).toContain("1536");
    });

    it("generateEmbedding accepts text and returns Promise<number[]>", () => {
      const content = fs.readFileSync(EMBEDDINGS_PATH, "utf-8");
      expect(content).toMatch(
        /generateEmbedding\(text:\s*string\):\s*Promise<number\[\]>/
      );
    });

    it("retrieveComponents returns Promise<ComponentDoc[]>", () => {
      const content = fs.readFileSync(EMBEDDINGS_PATH, "utf-8");
      expect(content).toMatch(/retrieveComponents[\s\S]*?:\s*Promise<ComponentDoc\[\]>/);
    });

    it("retrieveTemplates returns Promise<Template[]>", () => {
      const content = fs.readFileSync(EMBEDDINGS_PATH, "utf-8");
      expect(content).toMatch(/retrieveTemplates[\s\S]*?:\s*Promise<Template\[\]>/);
    });

    it("retrievePatterns returns Promise<Pattern[]>", () => {
      const content = fs.readFileSync(EMBEDDINGS_PATH, "utf-8");
      expect(content).toMatch(/retrievePatterns[\s\S]*?:\s*Promise<Pattern\[\]>/);
    });
  });

  // ── 2. TypeScript compilation ─────────────────────────
  describe("TypeScript compilation", () => {
    it("compiles without errors", async () => {
      const { execSync } = await import("child_process");
      const result = execSync(
        "npx tsc --noEmit --strict apps/web/lib/embeddings.ts 2>&1 || true",
        { cwd: path.resolve(__dirname, ".."), encoding: "utf-8" }
      );
      // Allow path resolution warnings but no actual type errors in our file
      const ourErrors = result
        .split("\n")
        .filter((l) => l.includes("embeddings.ts") && l.includes("error TS"));
      expect(ourErrors.length).toBe(0);
    });
  });

  // ── 3. Live integration tests ─────────────────────────
  // These test actual embedding generation + DB retrieval
  // They require SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
  // and either OPENAI_API_KEY or @xenova/transformers installed

  const hasSupabase = !!(
    process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  describe("Live integration", () => {
    let generateEmbedding: (text: string) => Promise<number[]>;
    let retrieveComponents: (
      query: string,
      limit?: number,
      threshold?: number
    ) => Promise<any[]>;
    let retrieveTemplates: (
      industry: string,
      limit?: number,
      threshold?: number
    ) => Promise<any[]>;
    let retrievePatterns: (
      query: string,
      limit?: number,
      threshold?: number
    ) => Promise<any[]>;

    beforeAll(async () => {
      if (!hasSupabase) return;
      const mod = await import("../apps/web/lib/embeddings");
      generateEmbedding = mod.generateEmbedding;
      retrieveComponents = mod.retrieveComponents;
      retrieveTemplates = mod.retrieveTemplates;
      retrievePatterns = mod.retrievePatterns;
    }, 120_000);

    it.skipIf(!hasSupabase)(
      "generateEmbedding returns 1536-dimensional vector",
      async () => {
        const embedding = await generateEmbedding("hero section for restaurant website");
        expect(Array.isArray(embedding)).toBe(true);
        expect(embedding.length).toBe(1536);
        expect(typeof embedding[0]).toBe("number");
        // Vector should not be all zeros
        const nonZero = embedding.filter((v) => v !== 0);
        expect(nonZero.length).toBeGreaterThan(0);
      },
      60_000
    );

    it.skipIf(!hasSupabase)(
      "retrieveComponents returns relevant hero components",
      async () => {
        const results = await retrieveComponents("hero section animated background", 5);
        expect(results.length).toBeGreaterThan(0);
        expect(results[0]).toHaveProperty("id");
        expect(results[0]).toHaveProperty("library");
        expect(results[0]).toHaveProperty("name");
        expect(results[0]).toHaveProperty("description");
        expect(results[0]).toHaveProperty("docsText");
        expect(results[0]).toHaveProperty("codeExample");
        expect(results[0]).toHaveProperty("similarity");
        expect(results[0].similarity).toBeGreaterThan(0);
      },
      60_000
    );

    it.skipIf(!hasSupabase)(
      "retrieveComponents returns relevant form components",
      async () => {
        const results = await retrieveComponents("form input button", 5);
        expect(results.length).toBeGreaterThan(0);
        // At least one result should relate to forms/inputs
        const names = results.map((r) => r.name.toLowerCase());
        const hasFormRelated = names.some(
          (n) => n.includes("input") || n.includes("form") || n.includes("button")
        );
        expect(hasFormRelated).toBe(true);
      },
      60_000
    );

    it.skipIf(!hasSupabase)(
      "retrieveTemplates returns restaurant template for restaurant query",
      async () => {
        const results = await retrieveTemplates("restaurant", 5);
        expect(results.length).toBeGreaterThan(0);
        expect(results[0]).toHaveProperty("id");
        expect(results[0]).toHaveProperty("industry");
        expect(results[0]).toHaveProperty("sectionType");
        expect(results[0]).toHaveProperty("description");
        expect(results[0]).toHaveProperty("templateJson");
        expect(results[0]).toHaveProperty("similarity");
        // The top result should be restaurant or food-related
        const industries = results.map((r) => r.industry.toLowerCase());
        expect(industries).toContain("restaurant");
      },
      60_000
    );

    it.skipIf(!hasSupabase)(
      "retrieveTemplates returns dental template for dental query",
      async () => {
        const results = await retrieveTemplates("dental", 5);
        expect(results.length).toBeGreaterThan(0);
        const industries = results.map((r) => r.industry.toLowerCase());
        expect(industries).toContain("dental");
      },
      60_000
    );

    it.skipIf(!hasSupabase)(
      "retrievePatterns returns hero patterns for hero query",
      async () => {
        const results = await retrievePatterns("hero section full width image background", 5);
        expect(results.length).toBeGreaterThan(0);
        expect(results[0]).toHaveProperty("id");
        expect(results[0]).toHaveProperty("patternType");
        expect(results[0]).toHaveProperty("name");
        expect(results[0]).toHaveProperty("description");
        expect(results[0]).toHaveProperty("exampleJson");
        expect(results[0]).toHaveProperty("similarity");
      },
      60_000
    );

    it.skipIf(!hasSupabase)(
      "retrievePatterns returns CTA patterns for CTA query",
      async () => {
        const results = await retrievePatterns("call to action button phone booking", 5);
        expect(results.length).toBeGreaterThan(0);
        const types = results.map((r) => r.patternType.toLowerCase());
        const hasCTA = types.some((t) => t.includes("cta"));
        expect(hasCTA).toBe(true);
      },
      60_000
    );

    it.skipIf(!hasSupabase)(
      "results are ordered by similarity (descending)",
      async () => {
        const results = await retrieveComponents("navigation bar menu", 5);
        if (results.length >= 2) {
          for (let i = 1; i < results.length; i++) {
            expect(results[i - 1].similarity).toBeGreaterThanOrEqual(
              results[i].similarity
            );
          }
        }
      },
      60_000
    );

    it.skipIf(!hasSupabase)(
      "different queries return different results",
      async () => {
        const heroResults = await retrieveComponents("hero section large background", 3);
        const formResults = await retrieveComponents("form input textarea submit", 3);
        if (heroResults.length > 0 && formResults.length > 0) {
          // Top results should differ
          expect(heroResults[0].name).not.toBe(formResults[0].name);
        }
      },
      60_000
    );
  });
});
