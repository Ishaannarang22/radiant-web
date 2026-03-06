import { describe, it, expect } from "vitest";
import { existsSync } from "fs";
import { join } from "path";
import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const SCRIPT_PATH = join(process.cwd(), "scripts", "seed-embeddings.ts");

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

describe("Phase 2.9: Generate embeddings for all data", () => {
  // ── Script file exists ──────────────────────────────
  it("should have scripts/seed-embeddings.ts", () => {
    expect(existsSync(SCRIPT_PATH)).toBe(true);
  });

  // ── Component embeddings ────────────────────────────
  describe("component_embeddings table", () => {
    it("should have 150 rows", async () => {
      const { count, error } = await supabase
        .from("component_embeddings")
        .select("*", { count: "exact", head: true });
      expect(error).toBeNull();
      expect(count).toBe(150);
    });

    it("should have all 4 libraries", async () => {
      const { data, error } = await supabase
        .from("component_embeddings")
        .select("library");
      expect(error).toBeNull();
      const libraries = [...new Set(data!.map((r: { library: string }) => r.library))].sort();
      expect(libraries).toEqual(["21st-dev", "aceternity", "magic-ui", "shadcn"]);
    });

    it("should have no null embeddings", async () => {
      const { data, error } = await supabase
        .from("component_embeddings")
        .select("id")
        .is("embedding", null);
      expect(error).toBeNull();
      expect(data!.length).toBe(0);
    });

    it("should have correct library counts", async () => {
      const { data, error } = await supabase
        .from("component_embeddings")
        .select("library");
      expect(error).toBeNull();
      const counts: Record<string, number> = {};
      for (const r of data!) {
        counts[r.library] = (counts[r.library] || 0) + 1;
      }
      expect(counts["shadcn"]).toBe(46);
      expect(counts["aceternity"]).toBe(47);
      expect(counts["magic-ui"]).toBe(31);
      expect(counts["21st-dev"]).toBe(26);
    });

    it("should have non-empty docs_text for all rows", async () => {
      const { data, error } = await supabase
        .from("component_embeddings")
        .select("docs_text")
        .or("docs_text.is.null,docs_text.eq.");
      expect(error).toBeNull();
      expect(data!.length).toBe(0);
    });
  });

  // ── Template embeddings ─────────────────────────────
  describe("template_embeddings table", () => {
    it("should have 10 rows", async () => {
      const { count, error } = await supabase
        .from("template_embeddings")
        .select("*", { count: "exact", head: true });
      expect(error).toBeNull();
      expect(count).toBe(10);
    });

    it("should cover all industries", async () => {
      const { data, error } = await supabase
        .from("template_embeddings")
        .select("industry");
      expect(error).toBeNull();
      const industries = data!.map((r: { industry: string }) => r.industry).sort();
      expect(industries).toEqual([
        "auto-repair",
        "cleaning-service",
        "dental",
        "generic",
        "gym",
        "lawyer",
        "plumber",
        "real-estate",
        "restaurant",
        "salon",
      ]);
    });

    it("should have no null embeddings", async () => {
      const { data, error } = await supabase
        .from("template_embeddings")
        .select("id")
        .is("embedding", null);
      expect(error).toBeNull();
      expect(data!.length).toBe(0);
    });

    it("should have template_json for all rows", async () => {
      const { data, error } = await supabase
        .from("template_embeddings")
        .select("template_json")
        .is("template_json", null);
      expect(error).toBeNull();
      expect(data!.length).toBe(0);
    });
  });

  // ── Pattern embeddings ──────────────────────────────
  describe("pattern_embeddings table", () => {
    it("should have 45 rows", async () => {
      const { count, error } = await supabase
        .from("pattern_embeddings")
        .select("*", { count: "exact", head: true });
      expect(error).toBeNull();
      expect(count).toBe(45);
    });

    it("should have all 4 pattern types", async () => {
      const { data, error } = await supabase
        .from("pattern_embeddings")
        .select("pattern_type");
      expect(error).toBeNull();
      const types = [...new Set(data!.map((r: { pattern_type: string }) => r.pattern_type))].sort();
      expect(types).toEqual(["color-schemes", "copy-formulas", "cta-patterns", "hero-sections"]);
    });

    it("should have no null embeddings", async () => {
      const { data, error } = await supabase
        .from("pattern_embeddings")
        .select("id")
        .is("embedding", null);
      expect(error).toBeNull();
      expect(data!.length).toBe(0);
    });

    it("should have descriptions for all rows", async () => {
      const { data, error } = await supabase
        .from("pattern_embeddings")
        .select("description")
        .or("description.is.null,description.eq.");
      expect(error).toBeNull();
      expect(data!.length).toBe(0);
    });
  });

  // ── Total count ─────────────────────────────────────
  it("should have 205 total embedded rows across all tables", async () => {
    const [c, t, p] = await Promise.all([
      supabase.from("component_embeddings").select("*", { count: "exact", head: true }),
      supabase.from("template_embeddings").select("*", { count: "exact", head: true }),
      supabase.from("pattern_embeddings").select("*", { count: "exact", head: true }),
    ]);
    expect(c.error).toBeNull();
    expect(t.error).toBeNull();
    expect(p.error).toBeNull();
    expect((c.count ?? 0) + (t.count ?? 0) + (p.count ?? 0)).toBe(205);
  });
});
