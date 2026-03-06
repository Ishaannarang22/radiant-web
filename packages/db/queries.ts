import { getServiceClient } from "./index"
import type {
  Project,
  ProjectInsert,
  ProjectFile,
  ProjectFileInsert,
  Business,
  BusinessInsert,
  Generation,
  GenerationInsert,
  ComponentEmbedding,
  TemplateEmbedding,
  PatternEmbedding,
} from "./types"

function db() {
  return getServiceClient()
}

// ── Projects ─────────────────────────────────────────────

export async function createProject(
  userId: string,
  businessName: string,
  subdomain: string,
  opts?: Partial<Pick<ProjectInsert, "industry" | "config" | "status">>
): Promise<Project> {
  const { data, error } = await db()
    .from("projects")
    .insert({
      user_id: userId,
      business_name: businessName,
      subdomain,
      ...opts,
    })
    .select()
    .single()

  if (error) throw new Error(`createProject failed: ${error.message}`)
  return data as Project
}

export async function getProjectsByUser(userId: string): Promise<Project[]> {
  const { data, error } = await db()
    .from("projects")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) throw new Error(`getProjectsByUser failed: ${error.message}`)
  return (data ?? []) as Project[]
}

export async function getProject(projectId: string): Promise<Project | null> {
  const { data, error } = await db()
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .single()

  if (error && error.code !== "PGRST116") {
    throw new Error(`getProject failed: ${error.message}`)
  }
  return (data as Project) ?? null
}

export async function updateProject(
  projectId: string,
  updates: Partial<ProjectInsert>
): Promise<Project> {
  const { data, error } = await db()
    .from("projects")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", projectId)
    .select()
    .single()

  if (error) throw new Error(`updateProject failed: ${error.message}`)
  return data as Project
}

// ── Project Files ────────────────────────────────────────

export async function getProjectFiles(projectId: string): Promise<ProjectFile[]> {
  const { data, error } = await db()
    .from("project_files")
    .select("*")
    .eq("project_id", projectId)
    .order("file_path")

  if (error) throw new Error(`getProjectFiles failed: ${error.message}`)
  return (data ?? []) as ProjectFile[]
}

export async function upsertProjectFiles(
  projectId: string,
  files: Array<Pick<ProjectFileInsert, "file_path" | "content" | "file_type">>
): Promise<ProjectFile[]> {
  const rows = files.map((f) => ({
    project_id: projectId,
    file_path: f.file_path,
    content: f.content,
    file_type: f.file_type ?? null,
  }))

  const { data, error } = await db()
    .from("project_files")
    .upsert(rows, { onConflict: "project_id,file_path" })
    .select()

  if (error) throw new Error(`upsertProjectFiles failed: ${error.message}`)
  return (data ?? []) as ProjectFile[]
}

// ── Businesses ───────────────────────────────────────────

export async function upsertBusiness(
  googlePlaceId: string,
  data: Omit<BusinessInsert, "google_place_id">
): Promise<Business> {
  const { data: result, error } = await db()
    .from("businesses")
    .upsert(
      { google_place_id: googlePlaceId, ...data, updated_at: new Date().toISOString() },
      { onConflict: "google_place_id" }
    )
    .select()
    .single()

  if (error) throw new Error(`upsertBusiness failed: ${error.message}`)
  return result as Business
}

export async function getBusinessByPlaceId(googlePlaceId: string): Promise<Business | null> {
  const { data, error } = await db()
    .from("businesses")
    .select("*")
    .eq("google_place_id", googlePlaceId)
    .single()

  if (error && error.code !== "PGRST116") {
    throw new Error(`getBusinessByPlaceId failed: ${error.message}`)
  }
  return (data as Business) ?? null
}

// ── Generations ──────────────────────────────────────────

export async function logGeneration(
  projectId: string,
  prompt: { system_prompt?: string; user_prompt?: string; prompt_hash?: string },
  response: string | null,
  stats: { tokens_input?: number; tokens_output?: number; duration_ms?: number; model?: string; status?: "pending" | "running" | "completed" | "failed"; error?: string }
): Promise<Generation> {
  const { data, error } = await db()
    .from("generations")
    .insert({
      project_id: projectId,
      system_prompt: prompt.system_prompt ?? null,
      user_prompt: prompt.user_prompt ?? null,
      prompt_hash: prompt.prompt_hash ?? null,
      response,
      tokens_input: stats.tokens_input ?? null,
      tokens_output: stats.tokens_output ?? null,
      duration_ms: stats.duration_ms ?? null,
      model: stats.model ?? "claude-sonnet-4-6",
      status: stats.status ?? "completed",
      error: stats.error ?? null,
    })
    .select()
    .single()

  if (error) throw new Error(`logGeneration failed: ${error.message}`)
  return data as Generation
}

export async function getGenerationsByProject(projectId: string): Promise<Generation[]> {
  const { data, error } = await db()
    .from("generations")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false })

  if (error) throw new Error(`getGenerationsByProject failed: ${error.message}`)
  return (data ?? []) as Generation[]
}

// ── Vector Search (via Supabase RPC) ─────────────────────

export async function searchComponents(
  queryEmbedding: number[],
  limit = 5,
  threshold = 0.7
): Promise<Array<ComponentEmbedding & { similarity: number }>> {
  const { data, error } = await db().rpc("match_components", {
    query_embedding: queryEmbedding,
    match_threshold: threshold,
    match_count: limit,
  })

  if (error) throw new Error(`searchComponents failed: ${error.message}`)
  return (data ?? []) as Array<ComponentEmbedding & { similarity: number }>
}

export async function searchTemplates(
  queryEmbedding: number[],
  limit = 5,
  threshold = 0.7
): Promise<Array<TemplateEmbedding & { similarity: number }>> {
  const { data, error } = await db().rpc("match_templates", {
    query_embedding: queryEmbedding,
    match_threshold: threshold,
    match_count: limit,
  })

  if (error) throw new Error(`searchTemplates failed: ${error.message}`)
  return (data ?? []) as Array<TemplateEmbedding & { similarity: number }>
}

export async function searchPatterns(
  queryEmbedding: number[],
  limit = 5,
  threshold = 0.7
): Promise<Array<PatternEmbedding & { similarity: number }>> {
  const { data, error } = await db().rpc("match_patterns", {
    query_embedding: queryEmbedding,
    match_threshold: threshold,
    match_count: limit,
  })

  if (error) throw new Error(`searchPatterns failed: ${error.message}`)
  return (data ?? []) as Array<PatternEmbedding & { similarity: number }>
}
