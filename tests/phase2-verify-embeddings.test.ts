import { describe, it, expect, beforeAll } from "vitest";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import "dotenv/config";

/**
 * Phase 2.10: Verify embeddings work
 *
 * Generates query embeddings using the same local model (all-MiniLM-L6-v2)
 * used for seeding, then runs similarity searches against all 3 embedding
 * tables and verifies the results are semantically relevant.
 */

const COMPONENT_THRESHOLD = 0.3;
const TEMPLATE_THRESHOLD = 0.15; // Templates have broader text, lower similarity with local model
const PATTERN_THRESHOLD = 0.15;
const MATCH_COUNT = 5;

let supabase: SupabaseClient;
let embed: (text: string) => Promise<number[]>;

function padTo(vec: number[], targetDim: number): number[] {
  if (vec.length >= targetDim) return vec.slice(0, targetDim);
  const padded = new Array(targetDim).fill(0);
  for (let i = 0; i < vec.length; i++) padded[i] = vec[i];
  return padded;
}

beforeAll(async () => {
  supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );

  // Load local embedding model (same as seed script)
  // @ts-ignore - dynamic ESM import
  const { pipeline } = await import("@xenova/transformers");
  const extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");

  embed = async (text: string): Promise<number[]> => {
    const output = await extractor(text, { pooling: "mean", normalize: true });
    const vec = Array.from(output.data as Float32Array);
    return padTo(vec, 1536);
  };
}, 120_000); // 2 min timeout for model loading

// ── Helper to run RPC searches ──────────────────────────

async function searchComponents(query: string) {
  const embedding = await embed(query);
  const { data, error } = await supabase.rpc("match_components", {
    query_embedding: JSON.stringify(embedding),
    match_threshold: COMPONENT_THRESHOLD,
    match_count: MATCH_COUNT,
  });
  expect(error).toBeNull();
  return data as Array<{
    id: string;
    library: string;
    component_name: string;
    description: string;
    similarity: number;
  }>;
}

async function searchTemplates(query: string) {
  const embedding = await embed(query);
  const { data, error } = await supabase.rpc("match_templates", {
    query_embedding: JSON.stringify(embedding),
    match_threshold: TEMPLATE_THRESHOLD,
    match_count: MATCH_COUNT,
  });
  expect(error).toBeNull();
  return data as Array<{
    id: string;
    industry: string;
    section_type: string;
    description: string;
    similarity: number;
  }>;
}

async function searchPatterns(query: string) {
  const embedding = await embed(query);
  const { data, error } = await supabase.rpc("match_patterns", {
    query_embedding: JSON.stringify(embedding),
    match_threshold: PATTERN_THRESHOLD,
    match_count: MATCH_COUNT,
  });
  expect(error).toBeNull();
  return data as Array<{
    id: string;
    pattern_type: string;
    name: string;
    description: string;
    similarity: number;
  }>;
}

// ── Component similarity searches ────────────────────────

describe("Phase 2.10: Verify embeddings work", () => {
  describe("component_embeddings similarity search", () => {
    it("query: 'animated hero section for a restaurant' → returns hero-related components", async () => {
      const results = await searchComponents("I need an animated hero section for a restaurant");
      expect(results.length).toBeGreaterThan(0);
      const names = results.map((r) => r.component_name.toLowerCase());
      const descriptions = results.map((r) => r.description.toLowerCase());
      const combined = [...names, ...descriptions].join(" ");
      expect(combined).toMatch(/hero|parallax|highlight|background|section/i);
      expect(results[0].similarity).toBeGreaterThan(COMPONENT_THRESHOLD);
    }, 30_000);

    it("query: 'form with input fields and validation' → returns form components", async () => {
      const results = await searchComponents("form with input fields and validation");
      expect(results.length).toBeGreaterThan(0);
      const names = results.map((r) => r.component_name.toLowerCase());
      const combined = names.join(" ");
      expect(combined).toMatch(/form|input|label|textarea|select/i);
    }, 30_000);

    it("query: 'floating navigation bar' → returns navbar components", async () => {
      const results = await searchComponents("floating navigation bar");
      expect(results.length).toBeGreaterThan(0);
      const names = results.map((r) => r.component_name.toLowerCase());
      const descriptions = results.map((r) => r.description.toLowerCase());
      const combined = [...names, ...descriptions].join(" ");
      expect(combined).toMatch(/nav|dock|menu|float/i);
    }, 30_000);

    it("query: 'card with hover effects and 3d animation' → returns card/animation components", async () => {
      const results = await searchComponents("card with hover effects and 3d animation");
      expect(results.length).toBeGreaterThan(0);
      const names = results.map((r) => r.component_name.toLowerCase());
      const descriptions = results.map((r) => r.description.toLowerCase());
      const combined = [...names, ...descriptions].join(" ");
      expect(combined).toMatch(/card|hover|3d|wobble|glare|tilt/i);
    }, 30_000);

    it("query: 'sparkle text animation effect' → returns text animation components", async () => {
      const results = await searchComponents("sparkle text animation effect");
      expect(results.length).toBeGreaterThan(0);
      const names = results.map((r) => r.component_name.toLowerCase());
      const descriptions = results.map((r) => r.description.toLowerCase());
      const combined = [...names, ...descriptions].join(" ");
      expect(combined).toMatch(/sparkle|text|animation|type|generate/i);
    }, 30_000);
  });

  // ── Template similarity searches ─────────────────────────

  describe("template_embeddings similarity search", () => {
    it("query: 'build a website for a pizza restaurant' → restaurant in top 3", async () => {
      const results = await searchTemplates("build a website for a pizza restaurant");
      expect(results.length).toBeGreaterThan(0);
      const top3 = results.slice(0, 3).map((r) => r.industry);
      expect(top3).toContain("restaurant");
    }, 30_000);

    it("query: 'dental clinic website with appointment booking' → dental in results", async () => {
      const results = await searchTemplates("dental clinic website with appointment booking");
      expect(results.length).toBeGreaterThan(0);
      const industries = results.map((r) => r.industry);
      expect(industries).toContain("dental");
    }, 30_000);

    it("query: 'plumbing service company website' → plumber in results", async () => {
      const results = await searchTemplates("plumbing service company website");
      expect(results.length).toBeGreaterThan(0);
      const industries = results.map((r) => r.industry);
      expect(industries).toContain("plumber");
    }, 30_000);

    it("query: 'hair salon and barbershop website' → salon in results", async () => {
      const results = await searchTemplates("hair salon and barbershop website");
      expect(results.length).toBeGreaterThan(0);
      const industries = results.map((r) => r.industry);
      expect(industries).toContain("salon");
    }, 30_000);

    it("query: 'law firm attorney website' → lawyer in results", async () => {
      const results = await searchTemplates("law firm attorney website");
      expect(results.length).toBeGreaterThan(0);
      const industries = results.map((r) => r.industry);
      expect(industries).toContain("lawyer");
    }, 30_000);
  });

  // ── Pattern similarity searches ──────────────────────────

  describe("pattern_embeddings similarity search", () => {
    it("query: 'full width hero with background image' → returns hero section patterns", async () => {
      const results = await searchPatterns("full width hero with background image");
      expect(results.length).toBeGreaterThan(0);
      const types = results.map((r) => r.pattern_type);
      expect(types).toContain("hero-sections");
    }, 30_000);

    it("query: 'call to action button click to call' → returns CTA patterns", async () => {
      const results = await searchPatterns("call to action button click to call phone");
      expect(results.length).toBeGreaterThan(0);
      const names = results.map((r) => r.name.toLowerCase());
      const types = results.map((r) => r.pattern_type);
      const combined = [...names, ...types].join(" ");
      expect(combined).toMatch(/cta|call|button|action/i);
    }, 30_000);

    it("query: 'warm earthy brown color palette for restaurant' → returns color scheme patterns", async () => {
      const results = await searchPatterns("warm earthy brown color palette for restaurant website");
      expect(results.length).toBeGreaterThan(0);
      const types = results.map((r) => r.pattern_type);
      expect(types).toContain("color-schemes");
    }, 30_000);
  });

  // ── Cross-table relevance ────────────────────────────────

  describe("cross-table relevance", () => {
    it("results are ordered by similarity (descending)", async () => {
      const results = await searchComponents("beautiful animated background effects");
      expect(results.length).toBeGreaterThan(1);
      for (let i = 1; i < results.length; i++) {
        expect(results[i - 1].similarity).toBeGreaterThanOrEqual(results[i].similarity);
      }
    }, 30_000);

    it("all results have similarity above threshold", async () => {
      const results = await searchComponents("pricing table with comparison");
      for (const r of results) {
        expect(r.similarity).toBeGreaterThan(COMPONENT_THRESHOLD);
      }
    }, 30_000);

    it("different queries return different top results", async () => {
      const heroResults = await searchComponents("hero section with animation");
      const formResults = await searchComponents("form input fields");
      expect(heroResults[0].component_name).not.toBe(formResults[0].component_name);
    }, 30_000);
  });
});
