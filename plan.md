# Radiant Web — Comprehensive Build Plan

This document is the complete, step-by-step blueprint for building the Radiant Web platform. Every task is broken into phases, and every phase has checkboxes so progress can be tracked. Nothing is assumed — every step is explained as if you're reading this for the first time.

---

## Table of Contents

1. [Phase 0: Project Initialization](#phase-0-project-initialization)
2. [Phase 1: Database Setup](#phase-1-database-setup)
3. [Phase 2: Data Preparation (Component Libraries + Templates)](#phase-2-data-preparation)
4. [Phase 3: Scraper Module](#phase-3-scraper-module)
5. [Phase 4: AI Generation Engine](#phase-4-ai-generation-engine)
6. [Phase 5: Platform Web App](#phase-5-platform-web-app)
7. [Phase 6: Deployment Pipeline](#phase-6-deployment-pipeline)
8. [Phase 7: Dashboard & Management](#phase-7-dashboard--management)
9. [Phase 8: Polish & Production](#phase-8-polish--production)
10. [Phase 9: Testing & QA](#phase-9-testing--qa)

---

## Phase 0: Project Initialization

**Goal:** Set up the monorepo, install dependencies, configure tooling. After this phase, you have an empty but fully configured project that runs locally.

### What is a monorepo?
A monorepo is a single Git repository that contains multiple related projects (called "packages" or "apps"). Instead of having separate repos for the platform, the database code, and the scraper, they all live together. We use **Turborepo** to manage builds across them and **pnpm workspaces** to share dependencies.

### Steps

- [x] **0.1 Initialize Git repository**
  - Run `git init` in the project root
  - Verify `.gitignore` already excludes `.env`, `node_modules/`, `.next/`, etc.
  - Create initial commit with existing files (`.env`, `.gitignore`, `CLAUDE.md`, `plan.md`, `.claude/`)

- [x] **0.2 Initialize pnpm workspace**
  - Run `pnpm init` to create root `package.json`
  - Create `pnpm-workspace.yaml` that defines:
    ```yaml
    packages:
      - "apps/*"
      - "packages/*"
    ```
  - This tells pnpm: "look inside `apps/` and `packages/` for sub-projects"

- [x] **0.3 Set up Turborepo**
  - Install: `pnpm add -D turbo`
  - Create `turbo.json` with pipeline config:
    - `build` — builds all apps/packages
    - `dev` — runs dev servers
    - `lint` — runs linters
    - `db:push` — pushes database schema
  - Turbo understands dependencies between packages and runs things in the right order

- [x] **0.4 Create the main web app (`apps/web`)**
  - Run `pnpm create next-app apps/web` with these options:
    - TypeScript: Yes
    - Tailwind CSS: Yes
    - ESLint: Yes
    - App Router: Yes
    - `src/` directory: No (we use `app/` directly)
    - Import alias: `@/`
  - Verify it runs: `cd apps/web && pnpm dev` → should see Next.js welcome page at localhost:3000

- [x] **0.5 Install shadcn/ui in the web app**
  - Run `pnpm dlx shadcn@latest init` inside `apps/web`
  - Configure: New York style, Zinc base color, CSS variables: yes
  - This creates `components/ui/` folder and configures Tailwind for shadcn
  - Install initial components: `pnpm dlx shadcn@latest add button card input label textarea tabs dialog toast`

- [x] **0.6 Create the database package (`packages/db`)**
  - Create `packages/db/` folder
  - Create `packages/db/package.json` with name `@radiant/db`
  - Install Supabase client: `pnpm add @supabase/supabase-js` in this package
  - Create `packages/db/index.ts` — exports a configured Supabase client
  - Create `packages/db/schema.sql` — will hold our full database schema (filled in Phase 1)

- [x] **0.7 Create the scraper package (`packages/scraper`)**
  - Create `packages/scraper/` folder
  - Create `packages/scraper/package.json` with name `@radiant/scraper`
  - Install Google Places client: `pnpm add @googlemaps/google-maps-services-js`
  - Create placeholder files: `google-places.ts`, `firecrawl.ts`, `types.ts`

- [x] **0.8 Set up shared TypeScript config**
  - Create root `tsconfig.json` with strict mode, path aliases
  - Each sub-project extends it: `"extends": "../../tsconfig.json"`
  - This ensures consistent TypeScript behavior everywhere

- [x] **0.9 Set up environment variable loading**
  - Install `dotenv` in root: `pnpm add -D dotenv`
  - Create `apps/web/lib/env.ts` that validates all required env vars exist at startup
  - If any key is missing, the app crashes immediately with a clear error message listing what's missing

- [x] **0.10 Verify everything works**
  - Run `pnpm dev` from root — web app starts
  - Run `pnpm build` from root — everything compiles without errors
  - Run `pnpm lint` from root — no linting errors

### Phase 0 Checklist Summary
```
After Phase 0, you should have:
✓ A Git repo with initial commit
✓ A monorepo with pnpm workspaces + Turborepo
✓ A Next.js app at apps/web that runs locally
✓ shadcn/ui installed with base components
✓ A database package at packages/db (empty schema)
✓ A scraper package at packages/scraper (placeholder files)
✓ Shared TypeScript config
✓ Environment variables validated on startup
```

---

## Phase 1: Database Setup

**Goal:** Create all database tables in Supabase, enable pgvector, and verify the schema works. After this phase, the database is ready to store everything the platform needs.

### What is pgvector?
pgvector is a PostgreSQL extension that lets you store "vector embeddings" — arrays of numbers that represent the meaning of text. When you want to find "which UI component docs are most relevant to building a restaurant hero section?", you convert the query to a vector, then find the closest vectors in the database. This is how RAG (Retrieval Augmented Generation) works.

### Steps

- [x] **1.1 Enable pgvector in Supabase**
  - Go to Supabase dashboard → SQL Editor
  - Run: `CREATE EXTENSION IF NOT EXISTS vector;`
  - This adds the `vector` data type to PostgreSQL
  - Alternatively, create a migration script that does this automatically

- [x] **1.2 Create the `users` table**
  ```sql
  CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'agency')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
  );
  ```
  - `id` — Unique identifier, auto-generated UUID
  - `email` — User's email, must be unique
  - `plan` — What pricing tier they're on (free, pro, agency)

- [x] **1.3 Create the `projects` table**
  ```sql
  CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    business_name TEXT NOT NULL,
    subdomain TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'generating', 'preview', 'deployed', 'failed')),
    industry TEXT,
    config JSONB DEFAULT '{}',
    vercel_project_id TEXT,
    vercel_deployment_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
  );
  ```
  - `subdomain` — e.g., "joes-pizza" → joes-pizza.test.surge.events
  - `status` — Tracks where the project is in the pipeline
  - `config` — Flexible JSON for colors, fonts, style preferences
  - `vercel_project_id` — Links to the Vercel project after deployment

- [x] **1.4 Create the `project_files` table**
  ```sql
  CREATE TABLE project_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    file_path TEXT NOT NULL,
    content TEXT NOT NULL,
    file_type TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(project_id, file_path)
  );
  ```
  - Stores every generated code file for a project
  - `file_path` — e.g., "app/page.tsx", "components/Hero.tsx"
  - `content` — The actual code as a string
  - One project has many files

- [x] **1.5 Create the `generations` table**
  ```sql
  CREATE TABLE generations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    prompt_hash TEXT,
    system_prompt TEXT,
    user_prompt TEXT,
    response TEXT,
    model TEXT DEFAULT 'claude-sonnet-4-6',
    tokens_input INTEGER,
    tokens_output INTEGER,
    duration_ms INTEGER,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
    error TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
  );
  ```
  - Logs every AI generation call for debugging and cost tracking
  - `prompt_hash` — Deduplicate identical requests
  - `tokens_input/output` — Track API costs

- [x] **1.6 Create the `businesses` table**
  ```sql
  CREATE TABLE businesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    google_place_id TEXT UNIQUE,
    name TEXT NOT NULL,
    address TEXT,
    phone TEXT,
    website TEXT,
    rating DECIMAL(2,1),
    review_count INTEGER,
    category TEXT,
    hours JSONB,
    photos JSONB,
    reviews JSONB,
    scraped_content JSONB,
    raw_data JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
  );
  ```
  - Caches scraped business data so we don't re-scrape the same business
  - `google_place_id` — Unique ID from Google, prevents duplicate entries
  - `scraped_content` — Content from Firecrawl (their existing website)

- [x] **1.7 Create the `component_embeddings` table**
  ```sql
  CREATE TABLE component_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    library TEXT NOT NULL,
    component_name TEXT NOT NULL,
    description TEXT,
    docs_text TEXT NOT NULL,
    code_example TEXT,
    tags TEXT[],
    embedding vector(1536),
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(library, component_name)
  );

  CREATE INDEX ON component_embeddings
    USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
  ```
  - Stores UI component documentation as embeddings
  - `library` — "shadcn", "aceternity", "magic-ui", "21st-dev"
  - `embedding` — 1536-dimensional vector (OpenAI embedding size, or adjust for chosen model)
  - The index makes similarity searches fast

- [x] **1.8 Create the `template_embeddings` table**
  ```sql
  CREATE TABLE template_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    industry TEXT NOT NULL,
    section_type TEXT NOT NULL,
    description TEXT,
    template_json JSONB NOT NULL,
    embedding vector(1536),
    created_at TIMESTAMPTZ DEFAULT now()
  );

  CREATE INDEX ON template_embeddings
    USING ivfflat (embedding vector_cosine_ops) WITH (lists = 50);
  ```
  - Industry-specific design templates stored as embeddings
  - `section_type` — "hero", "cta", "testimonials", "pricing", "footer", etc.

- [x] **1.9 Create the `pattern_embeddings` table**
  ```sql
  CREATE TABLE pattern_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pattern_type TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    example_json JSONB,
    embedding vector(1536),
    created_at TIMESTAMPTZ DEFAULT now()
  );

  CREATE INDEX ON pattern_embeddings
    USING ivfflat (embedding vector_cosine_ops) WITH (lists = 50);
  ```
  - Design patterns (color schemes, copy formulas, layout patterns)

- [x] **1.10 Create helper functions**
  ```sql
  -- Similarity search function for component retrieval
  CREATE OR REPLACE FUNCTION match_components(
    query_embedding vector(1536),
    match_threshold FLOAT DEFAULT 0.7,
    match_count INT DEFAULT 5
  )
  RETURNS TABLE (
    id UUID,
    library TEXT,
    component_name TEXT,
    description TEXT,
    docs_text TEXT,
    code_example TEXT,
    similarity FLOAT
  )
  LANGUAGE plpgsql AS $$
  BEGIN
    RETURN QUERY
    SELECT
      ce.id, ce.library, ce.component_name, ce.description,
      ce.docs_text, ce.code_example,
      1 - (ce.embedding <=> query_embedding) AS similarity
    FROM component_embeddings ce
    WHERE 1 - (ce.embedding <=> query_embedding) > match_threshold
    ORDER BY ce.embedding <=> query_embedding
    LIMIT match_count;
  END;
  $$;
  ```
  - This function takes a query vector and returns the most similar components
  - `<=>` is the cosine distance operator from pgvector
  - `match_threshold` filters out weak matches

- [x] **1.11 Create Row Level Security (RLS) policies**
  - Enable RLS on all tables
  - Users can only read/write their own projects
  - Component/template/pattern embeddings are readable by all authenticated users
  - Service role key bypasses RLS (used by server-side API routes)

- [x] **1.12 Write migration script**
  - Create `packages/db/schema.sql` with all the above SQL
  - Create `scripts/setup-supabase.ts` that:
    1. Connects to Supabase using service role key
    2. Runs the schema SQL
    3. Logs success/failure for each table
  - Run it and verify all tables exist in Supabase dashboard

- [x] **1.13 Create TypeScript types for all tables**
  - Create `packages/db/types.ts` with interfaces matching every table
  - Use Supabase's type generator: `pnpm supabase gen types typescript` if available
  - Export all types so other packages can import them

- [x] **1.14 Create database helper functions**
  - `packages/db/queries.ts` — Common queries:
    - `createProject(userId, businessName, subdomain)`
    - `getProjectsByUser(userId)`
    - `getProjectFiles(projectId)`
    - `upsertBusiness(googlePlaceId, data)`
    - `searchComponents(queryEmbedding, limit)`
    - `logGeneration(projectId, prompt, response, stats)`

### Phase 1 Checklist Summary
```
After Phase 1, you should have:
✓ pgvector extension enabled in Supabase
✓ 8 tables created (users, projects, project_files, generations, businesses, 3x embeddings)
✓ Indexes on all embedding columns for fast similarity search
✓ Helper SQL functions for similarity search
✓ RLS policies for security
✓ TypeScript types matching all tables
✓ Database query helper functions
✓ Migration script that can recreate the schema from scratch
```

---

## Phase 2: Data Preparation

**Goal:** Scrape, clean, and embed documentation for all UI component libraries and design patterns. After this phase, the vector database is populated and ready for RAG retrieval during generation.

### What is this phase doing?
Before Claude can generate websites using shadcn/ui, Aceternity UI, Magic UI, etc., it needs to know how these components work. We scrape the documentation for each library, break it into chunks, generate vector embeddings for each chunk, and store them in the database. During generation, we search for the most relevant components and inject their docs into Claude's prompt.

### Steps

- [x] **2.1 Create the data directory structure**
  ```
  data/
  ├── components/
  │   ├── shadcn/
  │   ├── aceternity/
  │   ├── magic-ui/
  │   └── 21st-dev/
  ├── templates/
  └── patterns/
  ```

- [x] **2.2 Scrape shadcn/ui documentation**
  - Source: https://ui.shadcn.com/docs/components
  - For each component (Button, Card, Dialog, Dropdown, Input, etc.):
    - Component name
    - Description / when to use it
    - Props / API
    - Code example (full working example)
    - Installation command
  - Store as JSON: `data/components/shadcn/button.json`, etc.
  - Target: ~40-50 components

- [x] **2.3 Scrape Aceternity UI documentation**
  - Source: https://ui.aceternity.com/components
  - Focus on animated/interactive components:
    - Hero sections, text animations, card effects
    - Background effects (beams, grids, particles)
    - Scroll-based animations
  - Store as JSON: `data/components/aceternity/[component].json`
  - Target: ~30-40 components

- [x] **2.4 Scrape Magic UI documentation**
  - Source: https://magicui.design/docs/components
  - Focus on:
    - Animated text, number tickers, typing effects
    - Gradient borders, shine effects
    - Layout components
  - Store as JSON: `data/components/magic-ui/[component].json`
  - Target: ~20-30 components

- [x] **2.5 Scrape 21st.dev documentation**
  - Source: https://21st.dev
  - Focus on:
    - Pre-built sections (hero, features, pricing)
    - Full page templates
    - Component compositions
  - Store as JSON: `data/components/21st-dev/[component].json`
  - Target: ~20-30 components

- [x] **2.6 Create the scraping script**
  - `scripts/scrape-docs.ts`
  - Uses fetch + HTML parsing (cheerio or similar) to extract component docs
  - Outputs clean JSON files per component
  - Handles rate limiting (don't hammer the sites)
  - Logs progress: "Scraped 15/42 shadcn components..."

- [x] **2.7 Curate industry-specific templates**
  - Manually create JSON template definitions for each industry:

  **Restaurant** (`data/templates/restaurant.json`):
  ```json
  {
    "industry": "restaurant",
    "sections": ["hero-with-food-photo", "menu-grid", "hours-location", "reviews", "reservation-cta", "footer"],
    "color_schemes": [
      {"primary": "#D4382C", "secondary": "#F5E6CC", "accent": "#2D5016", "name": "Classic Italian"},
      {"primary": "#1A1A2E", "secondary": "#E8D5B7", "accent": "#C4A35A", "name": "Modern Upscale"}
    ],
    "copy_patterns": {
      "hero_headline": ["Authentic {cuisine} in the heart of {city}", "Where every meal tells a story"],
      "cta": ["Reserve a Table", "View Our Menu", "Order Online"]
    },
    "must_have_sections": ["menu", "hours", "location_map", "reviews"],
    "photo_placement": ["hero_background", "menu_items", "interior_gallery"]
  }
  ```

  - Create templates for: **restaurant, dental, salon/barbershop, plumber/HVAC, lawyer, real-estate, gym/fitness, auto-repair, cleaning-service, generic**
  - Each template defines: sections, color schemes, copy patterns, required sections, photo strategy

- [x] **2.8 Curate design patterns**
  - `data/patterns/hero-sections.json` — 8-10 hero section patterns:
    - Full-width image background with overlay text
    - Split layout (text left, image right)
    - Centered text with gradient background
    - Video background hero
    - Animated text hero (Aceternity-style)

  - `data/patterns/cta-patterns.json` — 6-8 CTA patterns:
    - Single button centered
    - Two buttons (primary + secondary)
    - CTA with phone number
    - CTA with form embed

  - `data/patterns/color-schemes.json` — 15-20 color palettes:
    - Per-industry recommended palettes
    - Each with: primary, secondary, accent, background, text colors
    - Named for easy reference ("Warm Professional", "Clean Medical", "Bold Creative")

  - `data/patterns/copy-formulas.json` — Headline/CTA copy templates:
    - Problem-solution headlines
    - Social proof headlines
    - Urgency/scarcity CTAs
    - Trust-building CTAs

- [x] **2.9 Generate embeddings for all data**
  - `scripts/seed-embeddings.ts`
  - For each component JSON file:
    1. Concatenate: `${name} ${description} ${docs_text} ${tags}`
    2. Generate embedding using an embedding model (OpenAI `text-embedding-3-small` or Anthropic's if available via Supabase)
    3. Insert into `component_embeddings` table with the vector
  - For each template: embed the description + section list → `template_embeddings`
  - For each pattern: embed the description → `pattern_embeddings`
  - Log progress: "Embedded 45/120 components..."
  - Note: If using Supabase's built-in embedding support, leverage that. Otherwise, use OpenAI's embedding API (cheapest option for embeddings)

- [x] **2.10 Verify embeddings work**
  - Write a test query: "I need an animated hero section for a restaurant"
  - Run similarity search against `component_embeddings`
  - Verify it returns relevant results (Aceternity hero components, not random buttons)
  - Test with 5-10 different queries across industries

### Phase 2 Checklist Summary
```
After Phase 2, you should have:
✓ ~120-150 component docs scraped and stored as JSON
✓ 10 industry template definitions
✓ 4 design pattern collections (hero, CTA, colors, copy)
✓ All data embedded as vectors in the database
✓ Similarity search returning relevant results
✓ A scraping script that can refresh the data
```

---

## Phase 3: Scraper Module

**Goal:** Build the module that fetches business data from Google Places API and scrapes existing websites with Firecrawl. After this phase, given a business name + location, we can get a complete data profile.

### Steps

- [x] **3.1 Implement Google Places API client**
  - `packages/scraper/google-places.ts`
  - Functions:
    - `searchBusiness(name: string, location: string)` — Find the business, return place_id
    - `getPlaceDetails(placeId: string)` — Get full details: name, address, phone, hours, rating, reviews, photos, category
    - `getPlacePhotos(photoReferences: string[], maxWidth: number)` — Download photo URLs
  - Handle errors: business not found, API quota exceeded, invalid location
  - Cache results in `businesses` table to avoid redundant API calls

- [x] **3.2 Implement Firecrawl scraper**
  - `packages/scraper/firecrawl.ts`
  - Self-hosted Firecrawl setup:
    - Document how to run Firecrawl locally (Docker)
    - Or use Firecrawl's API if available
  - Functions:
    - `scrapeWebsite(url: string)` — Scrape homepage + key pages
    - `extractContent(html: string)` — Pull out: headings, paragraphs, images, links, meta tags
    - `summarizeContent(rawContent: object)` — Clean into structured format
  - Handle: no website exists, website is down, content behind login, JavaScript-heavy sites

- [x] **3.3 Define the BusinessProfile type**
  - `packages/scraper/types.ts`
  ```typescript
  interface BusinessProfile {
    name: string;
    address: string;
    city: string;
    state: string;
    phone: string;
    website?: string;
    rating: number;
    reviewCount: number;
    category: string;
    industry: string; // mapped from Google category
    hours: { day: string; open: string; close: string }[];
    photos: { url: string; width: number; height: number }[];
    reviews: { author: string; rating: number; text: string; date: string }[];
    existingContent?: {
      headlines: string[];
      descriptions: string[];
      services: string[];
      about: string;
    };
  }
  ```

- [x] **3.4 Build the category-to-industry mapper**
  - Google Places returns categories like "Italian restaurant", "General dentist", "Hair salon"
  - Map these to our industry templates:
    - "* restaurant" → "restaurant"
    - "* dentist|dental *" → "dental"
    - "* salon|barber *" → "salon"
    - "plumb*|hvac|heating" → "plumber"
    - "* attorney|* lawyer|law firm" → "lawyer"
    - Everything else → "generic"
  - `packages/scraper/industry-mapper.ts`

- [ ] **3.5 Build the main scraper orchestrator**
  - `packages/scraper/index.ts`
  - Main function: `scrapeBusinessProfile(name: string, location: string): Promise<BusinessProfile>`
  - Steps:
    1. Search Google Places for the business
    2. Get full place details
    3. Download photo URLs
    4. If website exists, scrape it with Firecrawl
    5. Map category to industry
    6. Assemble complete BusinessProfile
    7. Cache in `businesses` table
    8. Return the profile
  - Total time target: < 10 seconds

- [ ] **3.6 Create API route for scraping**
  - `apps/web/app/api/scrape/route.ts`
  - POST endpoint: `{ businessName: string, location: string }`
  - Calls scraper orchestrator
  - Returns BusinessProfile JSON
  - Rate limit: max 10 scrapes per user per hour

- [ ] **3.7 Test with real businesses**
  - Test with 5 real businesses across industries:
    - A local restaurant
    - A dental office
    - A hair salon
    - A plumber
    - A law firm
  - Verify data quality for each
  - Fix any edge cases

### Phase 3 Checklist Summary
```
After Phase 3, you should have:
✓ Google Places API client that fetches business details, photos, reviews
✓ Firecrawl integration that scrapes existing websites
✓ BusinessProfile type with all data fields
✓ Category-to-industry mapper
✓ Orchestrator that combines all scrapers into one call
✓ API route at /api/scrape
✓ Tested with 5 real businesses
```

---

## Phase 4: AI Generation Engine

**Goal:** Build the core engine that takes a BusinessProfile and generates a complete Next.js website using Claude. This is the heart of the platform. After this phase, you can feed in business data and get back a set of code files that form a working website.

### How generation works (the prompt architecture)

```
┌─────────────────────────────────────────────┐
│              SYSTEM PROMPT                  │
│  (Always included, ~30% of context)        │
│                                             │
│  • "You are an expert web developer..."     │
│  • Output format rules (Next.js + Tailwind) │
│  • File structure requirements              │
│  • Code quality rules                       │
│  • shadcn/ui core component reference       │
│  • Design principles                        │
└─────────────────────────────────────────────┘
                    +
┌─────────────────────────────────────────────┐
│          INDUSTRY CONTEXT                   │
│  (Injected per business type, ~20%)         │
│                                             │
│  • Industry-specific template definition    │
│  • Recommended sections for this industry   │
│  • Color scheme suggestions                 │
│  • Copy patterns for this industry          │
└─────────────────────────────────────────────┘
                    +
┌─────────────────────────────────────────────┐
│          RETRIEVED COMPONENTS               │
│  (RAG-retrieved, ~10%)                      │
│                                             │
│  • Relevant Aceternity/Magic UI docs        │
│  • Component code examples                  │
│  • Retrieved based on industry + sections   │
└─────────────────────────────────────────────┘
                    +
┌─────────────────────────────────────────────┐
│          BUSINESS DATA                      │
│  (From scraper, ~10%)                       │
│                                             │
│  • Business name, address, hours, phone     │
│  • Reviews and rating                       │
│  • Photos (URLs)                            │
│  • Existing website content                 │
│  • Category / industry                      │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│          CLAUDE GENERATES                   │
│                                             │
│  File-by-file output:                       │
│  • app/layout.tsx                           │
│  • app/page.tsx                             │
│  • components/Hero.tsx                      │
│  • components/Menu.tsx (if restaurant)      │
│  • components/Reviews.tsx                   │
│  • components/Contact.tsx                   │
│  • components/Footer.tsx                    │
│  • tailwind.config.ts (custom colors)       │
│  • public/... (asset references)            │
└─────────────────────────────────────────────┘
```

### Steps

- [ ] **4.1 Write the base system prompt**
  - `apps/web/prompts/system.ts`
  - This prompt is included in EVERY generation call
  - Contents:
    - Role definition: "You are an expert frontend developer specializing in Next.js, Tailwind CSS, and shadcn/ui..."
    - Output format: "You must output code as a series of files. Each file starts with `--- FILE: path/to/file.tsx ---` and ends with `--- END FILE ---`"
    - Code rules:
      - Use Next.js App Router
      - Use TypeScript
      - Use Tailwind CSS for all styling
      - Use shadcn/ui components where appropriate
      - All components must be responsive (mobile-first)
      - Use semantic HTML
      - Include proper meta tags and SEO
      - Images use Next.js `<Image>` component
      - No placeholder text — use real business data provided
    - File structure requirements:
      - `app/layout.tsx` — Root layout with fonts, metadata
      - `app/page.tsx` — Homepage with all sections
      - Individual component files in `components/`
      - `tailwind.config.ts` — Custom theme colors

- [ ] **4.2 Write industry-specific prompt fragments**
  - `apps/web/prompts/industries/restaurant.ts`
  - `apps/web/prompts/industries/dental.ts`
  - `apps/web/prompts/industries/salon.ts`
  - `apps/web/prompts/industries/plumber.ts`
  - `apps/web/prompts/industries/lawyer.ts`
  - `apps/web/prompts/industries/generic.ts`
  - Each fragment includes:
    - Required sections for this industry
    - Design guidance ("restaurants should feel warm and inviting, use food photography prominently")
    - Copy suggestions
    - Color palette recommendations
    - What makes a good website in this industry

- [ ] **4.3 Build the RAG retrieval layer**
  - `apps/web/lib/embeddings.ts`
  - Functions:
    - `generateEmbedding(text: string): Promise<number[]>` — Convert text to vector
    - `retrieveComponents(query: string, limit: number): Promise<ComponentDoc[]>` — Find relevant components
    - `retrieveTemplates(industry: string, limit: number): Promise<Template[]>` — Find industry templates
    - `retrievePatterns(query: string, limit: number): Promise<Pattern[]>` — Find design patterns
  - Uses the `match_components` SQL function from Phase 1

- [ ] **4.4 Build the prompt assembler**
  - `apps/web/lib/prompt-builder.ts`
  - `buildGenerationPrompt(profile: BusinessProfile): { system: string, user: string }`
  - Steps:
    1. Start with base system prompt
    2. Look up industry → inject industry-specific fragment
    3. Based on industry + sections needed, retrieve relevant component docs via RAG
    4. Inject retrieved component docs into system prompt
    5. Build user prompt with business data JSON
    6. Return combined prompts
  - Manage context budget: system prompt should stay under ~80K tokens total

- [ ] **4.5 Build the Claude API client**
  - `apps/web/lib/claude.ts`
  - Uses `@anthropic-ai/sdk`
  - Functions:
    - `generateWebsite(systemPrompt: string, userPrompt: string): Promise<GenerationResult>`
    - Calls Claude API with:
      - Model: `claude-sonnet-4-6` (best balance of quality/speed/cost)
      - Max tokens: 16384 (enough for a full site)
      - Temperature: 0.3 (creative but consistent)
    - Parses response into individual files
    - Returns: `{ files: { path: string, content: string }[], tokensUsed: { input: number, output: number }, duration: number }`

- [ ] **4.6 Build the response parser**
  - `apps/web/lib/parser.ts`
  - Takes Claude's raw text response
  - Parses the `--- FILE: ... ---` markers into individual file objects
  - Validates:
    - All required files present (layout.tsx, page.tsx at minimum)
    - No syntax errors (basic check)
    - No placeholder content ("Lorem ipsum", "TODO", etc.)
  - If validation fails, can request a fix from Claude (retry with error context)

- [ ] **4.7 Build the generation orchestrator**
  - `apps/web/lib/generator.ts`
  - Main function: `generateSite(projectId: string, profile: BusinessProfile): Promise<void>`
  - Steps:
    1. Update project status to "generating"
    2. Build prompts using prompt builder
    3. Call Claude API
    4. Parse response into files
    5. Validate files
    6. Store files in `project_files` table
    7. Log generation in `generations` table
    8. Update project status to "preview"
  - Handle errors: API timeout, invalid response, quota exceeded
  - Total time target: < 30 seconds

- [ ] **4.8 Create API route for generation**
  - `apps/web/app/api/generate/route.ts`
  - POST endpoint: `{ projectId: string, businessProfile: BusinessProfile }`
  - Calls generation orchestrator
  - Returns: `{ success: boolean, files: string[], error?: string }`
  - Should be async — return immediately with a job ID, poll for completion
  - Or use Server-Sent Events (SSE) for real-time progress updates

- [ ] **4.9 Test generation with real data**
  - Use the 5 businesses scraped in Phase 3
  - Generate a site for each
  - Review generated code quality:
    - Does it compile?
    - Does it use the business data correctly?
    - Is it responsive?
    - Does it look good?
  - Iterate on prompts until quality is consistently good

### Phase 4 Checklist Summary
```
After Phase 4, you should have:
✓ Base system prompt with code rules and format
✓ 6 industry-specific prompt fragments
✓ RAG retrieval pulling relevant component docs
✓ Prompt assembler combining all context layers
✓ Claude API client with response parsing
✓ File validator catching common issues
✓ Generation orchestrator running the full pipeline
✓ API route at /api/generate
✓ Tested with 5 real businesses, quality verified
```

---

## Phase 5: Platform Web App

**Goal:** Build the user-facing web application — the landing page, generation flow, and preview functionality. After this phase, a user can visit the site, enter a business, generate a website, and preview it.

### Steps

- [ ] **5.1 Build the landing page**
  - `apps/web/app/page.tsx`
  - Sections:
    1. **Hero** — "Generate a stunning website for any business in 60 seconds"
       - Big headline, subtext, CTA button ("Try It Free")
       - Animated demo/preview showing a site being generated
    2. **How It Works** — 3 steps: Enter Business → AI Generates → Go Live
    3. **Examples** — Gallery of generated sites (screenshots/embeds)
    4. **Features** — What makes the generated sites great (responsive, fast, SEO, etc.)
    5. **Pricing** — Free tier (1 site), Pro ($X/mo, Y sites), Agency ($X/mo, unlimited)
    6. **Footer** — Links, social, copyright
  - Use shadcn/ui + Aceternity/Magic UI for visual impact
  - Must be fully responsive

- [ ] **5.2 Build the generation flow UI**
  - `apps/web/app/generate/page.tsx`
  - Step 1: **Input**
    - Business name text input
    - Location text input (city, state or full address)
    - Optional: style preferences (color scheme, style: modern/classic/bold)
    - "Generate" button
  - Step 2: **Scraping** (loading state)
    - Show progress: "Finding business on Google..." → "Scraping website..." → "Analyzing data..."
    - Display found business card with name, rating, photo, address
    - User confirms: "Yes, this is the right business" or searches again
  - Step 3: **Generating** (loading state)
    - Show progress: "Building your website..." with animated progress
    - Real-time updates via SSE or polling
    - Estimated time: ~30 seconds
  - Step 4: **Preview**
    - Redirect to `/preview/[projectId]`

- [ ] **5.3 Build the preview page**
  - `apps/web/app/preview/[projectId]/page.tsx`
  - Full-width iframe showing the generated site
  - Top toolbar with:
    - Device toggle: Desktop / Tablet / Mobile (changes iframe width)
    - "Deploy" button (→ makes it live)
    - "Regenerate" button (→ back to generation with tweaks)
    - "Edit" button (future: inline editing)
  - The preview needs a way to render the generated files:
    - Option A: Server-side render from `project_files` table on-the-fly
    - Option B: Build a temporary deployment for preview
    - Option A is simpler — create a dynamic route that assembles and serves the generated site

- [ ] **5.4 Build the preview renderer**
  - `apps/web/app/preview/[projectId]/site/[...path]/route.ts`
  - Dynamic API route that:
    1. Looks up `projectId` in database
    2. Finds the requested file path in `project_files`
    3. Returns the content with correct Content-Type
  - For the main page, compile/render the React components server-side
  - This is the trickiest part — options:
    - Use an iframe pointing to a temporary preview URL
    - Or use `next/dynamic` with generated code (security concerns)
    - Safest: deploy a preview build to Vercel with a temporary URL

- [ ] **5.5 Build authentication**
  - Use Supabase Auth (built-in)
  - `apps/web/lib/supabase.ts` — Client-side Supabase client
  - `apps/web/lib/supabase-server.ts` — Server-side Supabase client
  - Auth flow:
    - Sign up with email/password or Google OAuth
    - Email verification
    - Password reset
  - Middleware: `apps/web/middleware.ts`
    - Protect routes: `/dashboard`, `/generate`, `/preview`
    - Redirect unauthenticated users to login
  - UI components:
    - `components/auth/LoginForm.tsx`
    - `components/auth/SignupForm.tsx`
    - `apps/web/app/login/page.tsx`
    - `apps/web/app/signup/page.tsx`

- [ ] **5.6 Build the navigation**
  - `components/Navbar.tsx`
  - Logo + nav links: Home, Generate, Dashboard (if logged in), Pricing
  - Auth buttons: Login / Sign Up (if logged out), Profile dropdown (if logged in)
  - Mobile hamburger menu
  - Sticky on scroll

- [ ] **5.7 Add toast notifications**
  - Use shadcn/ui `toast` component
  - Success: "Website generated successfully!"
  - Error: "Failed to generate. Please try again."
  - Info: "Deploying your website..."

- [ ] **5.8 Add loading states and error boundaries**
  - Skeleton loaders for data fetching
  - Error boundary components with retry buttons
  - 404 page for invalid project IDs
  - Rate limit exceeded page

### Phase 5 Checklist Summary
```
After Phase 5, you should have:
✓ Landing page with hero, how-it-works, examples, pricing, footer
✓ Generation flow: input → scraping → generating → preview
✓ Preview page with device toggles and deploy button
✓ Preview renderer serving generated files
✓ Authentication (signup, login, protected routes)
✓ Navigation bar with auth state
✓ Toast notifications
✓ Loading states and error handling
```

---

## Phase 6: Deployment Pipeline

**Goal:** Build the system that deploys generated websites to Vercel as subdomains of `test.surge.events`. After this phase, clicking "Deploy" creates a live website.

### How Vercel deployment works
Vercel has an API that lets you create projects and deployments programmatically. Instead of pushing code to Git, we send the files directly via API. Each generated site becomes its own Vercel project with a custom subdomain.

### Steps

- [ ] **6.1 Build the Vercel API client**
  - `apps/web/lib/vercel.ts`
  - Functions:
    - `createProject(name: string)` — Create a new Vercel project
    - `createDeployment(projectId: string, files: FileMap)` — Deploy files to the project
    - `addDomain(projectId: string, domain: string)` — Add custom subdomain
    - `getDeploymentStatus(deploymentId: string)` — Poll deployment status
    - `deleteProject(projectId: string)` — Remove a project
  - Uses Vercel REST API v6+ with Bearer token auth

- [ ] **6.2 Build the file preparation step**
  - Generated files from Claude need to be packaged for Vercel:
    - Add `package.json` with Next.js dependencies
    - Add `next.config.js`
    - Add `tailwind.config.ts` (from generated output)
    - Add `tsconfig.json`
    - Add `postcss.config.js`
    - Ensure all shadcn/ui components used are included
  - `apps/web/lib/deploy-prep.ts` — assembles the complete file tree

- [ ] **6.3 Build the deployment orchestrator**
  - `apps/web/lib/deployer.ts`
  - Main function: `deployProject(projectId: string): Promise<DeploymentResult>`
  - Steps:
    1. Fetch project files from database
    2. Prepare file tree (add configs, dependencies)
    3. Create Vercel project (if not exists)
    4. Create deployment with all files
    5. Add custom domain: `[subdomain].test.surge.events`
    6. Wait for deployment to be ready (poll status)
    7. Update project record with Vercel URL and status "deployed"
    8. Return live URL
  - Handle errors: deployment failed, domain conflict, quota exceeded

- [ ] **6.4 Create API route for deployment**
  - `apps/web/app/api/deploy/route.ts`
  - POST endpoint: `{ projectId: string }`
  - Calls deployment orchestrator
  - Returns: `{ url: string, status: string }`
  - Use SSE or polling for deployment progress

- [ ] **6.5 Set up wildcard DNS**
  - Document the DNS setup for the user:
    - Add a wildcard CNAME record: `*.test.surge.events` → `cname.vercel-dns.com`
    - This routes ALL subdomains to Vercel
    - Vercel then routes to the correct project based on the subdomain
  - Add a verification step that checks if DNS is configured

- [ ] **6.6 Test end-to-end deployment**
  - Generate a site for a real business
  - Deploy it via the pipeline
  - Verify:
    - Site loads at `[subdomain].test.surge.events`
    - SSL certificate is provisioned (Vercel handles this automatically)
    - Site is responsive and looks correct
    - All images load
    - Page speed is acceptable

### Phase 6 Checklist Summary
```
After Phase 6, you should have:
✓ Vercel API client for project/deployment management
✓ File preparation adding necessary configs to generated code
✓ Deployment orchestrator running the full pipeline
✓ API route at /api/deploy
✓ Wildcard DNS documentation
✓ End-to-end tested: generate → deploy → live site
```

---

## Phase 7: Dashboard & Management

**Goal:** Build the user dashboard where they can manage their generated sites. After this phase, users can see all their sites, view analytics (basic), redeploy, and delete.

### Steps

- [ ] **7.1 Build the dashboard page**
  - `apps/web/app/dashboard/page.tsx`
  - Grid of project cards, each showing:
    - Site screenshot/thumbnail
    - Business name
    - Subdomain URL (clickable)
    - Status badge (draft / deployed / failed)
    - Last updated date
    - Actions: View, Redeploy, Delete
  - Empty state: "No sites yet. Generate your first one!"
  - "New Site" button → links to `/generate`

- [ ] **7.2 Build the project detail page**
  - `apps/web/app/dashboard/[projectId]/page.tsx`
  - Full project view:
    - Live preview iframe
    - Business info card (name, address, rating)
    - Deployment info (URL, last deployed, Vercel status)
    - Files list (expandable, shows generated code)
    - Actions: Redeploy, Regenerate, Delete, Copy URL
  - Settings:
    - Custom subdomain (change slug)
    - Color scheme override
    - Add/remove sections

- [ ] **7.3 Build the settings/account page**
  - `apps/web/app/dashboard/settings/page.tsx`
  - Profile: name, email, password change
  - Plan: current tier, upgrade button
  - API usage: tokens used this month, cost estimate
  - Danger zone: delete account

- [ ] **7.4 Add project deletion**
  - Delete flow:
    1. Confirmation dialog: "Are you sure? This will remove the site from the internet."
    2. Delete Vercel project (remove deployment)
    3. Delete project files from database
    4. Delete project record
    5. Redirect to dashboard

- [ ] **7.5 Add regeneration**
  - "Regenerate" button on project detail page
  - Options:
    - Full regenerate: completely new site
    - Partial: "Change the color scheme" or "Add a testimonials section"
  - Re-runs the generation pipeline with updated preferences
  - Old files replaced with new ones

### Phase 7 Checklist Summary
```
After Phase 7, you should have:
✓ Dashboard with project grid
✓ Project detail page with preview and management
✓ Account settings page
✓ Project deletion (removes from Vercel + database)
✓ Regeneration with updated preferences
```

---

## Phase 8: Polish & Production

**Goal:** Production-readiness. Error handling, rate limiting, email notifications, analytics, SEO, and performance optimization.

### Steps

- [ ] **8.1 Add rate limiting**
  - Limit API routes:
    - `/api/scrape` — 10/hour per user
    - `/api/generate` — 5/hour per user (AI generation is expensive)
    - `/api/deploy` — 10/hour per user
  - Use in-memory rate limiter or Redis
  - Return 429 with "Rate limit exceeded" message

- [ ] **8.2 Add email notifications (Resend)**
  - `apps/web/lib/email.ts`
  - Emails:
    - Welcome email on signup
    - "Your site is live!" with URL after deployment
    - Generation failed notification
  - Use Resend API with the `re_` key from `.env`

- [ ] **8.3 Add SEO for the platform**
  - Root layout metadata: title, description, OpenGraph tags
  - Sitemap at `/sitemap.xml`
  - Robots.txt
  - Meta tags on all pages

- [ ] **8.4 Add SEO to generated sites**
  - System prompt should instruct Claude to include:
    - Proper `<title>` and `<meta description>`
    - OpenGraph tags with business info
    - Structured data (JSON-LD) for local business
    - Semantic HTML headings
  - This makes generated sites rank well on Google

- [ ] **8.5 Performance optimization**
  - Lazy load images in generated sites
  - Use Next.js Image optimization
  - Minimize bundle size of generated sites
  - Cache scraper results (don't re-scrape same business within 24 hours)

- [ ] **8.6 Error monitoring**
  - Add error logging to all API routes
  - Log generation failures with full context (prompt, response, error)
  - Create an admin view for monitoring (optional, or use Supabase dashboard)

- [ ] **8.7 Add Stripe payment (optional, add when ready)**
  - Pricing tiers:
    - Free: 1 generated site
    - Pro: 10 sites, priority generation
    - Agency: Unlimited sites, white-label option
  - Stripe checkout integration
  - Webhook for payment events
  - Enforce limits based on plan

### Phase 8 Checklist Summary
```
After Phase 8, you should have:
✓ Rate limiting on all API routes
✓ Email notifications via Resend
✓ Platform SEO (meta tags, sitemap, robots.txt)
✓ Generated sites include SEO best practices
✓ Performance optimized (image loading, caching)
✓ Error monitoring and logging
✓ (Optional) Stripe payment integration
```

---

## Phase 9: Testing & QA

**Goal:** Verify everything works end-to-end. No unit test theater — focus on real integration tests and manual QA.

### Steps

- [ ] **9.1 End-to-end generation test**
  - `scripts/test-generation.ts`
  - Automated test that:
    1. Scrapes a known business
    2. Generates a website
    3. Validates all files are present
    4. Checks for compilation errors
    5. Deploys to Vercel
    6. Verifies the live URL returns 200
  - Run for 3 different industries

- [ ] **9.2 Manual QA checklist**
  - [ ] Landing page loads, all sections render
  - [ ] Responsive: mobile, tablet, desktop
  - [ ] Sign up flow works (email/password)
  - [ ] Login flow works
  - [ ] Generate flow: input → scrape → generate → preview
  - [ ] Preview shows generated site correctly
  - [ ] Device toggle (desktop/tablet/mobile) works in preview
  - [ ] Deploy creates live site at correct subdomain
  - [ ] Dashboard shows all projects
  - [ ] Project detail page shows preview + info
  - [ ] Delete project removes site from Vercel
  - [ ] Regenerate produces a new site
  - [ ] Rate limiting blocks excess requests
  - [ ] Error states display correctly (API down, business not found, etc.)

- [ ] **9.3 Cross-industry quality check**
  - Generate sites for each industry template
  - Score each on:
    - Visual quality (1-10)
    - Content accuracy (uses real business data, no placeholders)
    - Responsiveness (looks good on all devices)
    - Performance (loads fast)
  - Fix prompt issues for any low-scoring industries

- [ ] **9.4 Security review**
  - [ ] `.env` is not committed (check `.gitignore`)
  - [ ] API routes validate input
  - [ ] RLS policies prevent data leakage between users
  - [ ] Service role key only used server-side
  - [ ] No XSS vulnerabilities in generated sites
  - [ ] Rate limiting prevents abuse

### Phase 9 Checklist Summary
```
After Phase 9, you should have:
✓ Automated end-to-end test script
✓ Manual QA completed across all flows
✓ Sites generated for all industry templates, quality verified
✓ Security review passed
✓ Platform is production-ready
```

---

## Build Order Summary

| Phase | What | Depends On | Est. Complexity |
|-------|------|-----------|-----------------|
| 0 | Project Init | Nothing | Low |
| 1 | Database | Phase 0 | Medium |
| 2 | Data Prep | Phase 1 | High (lots of scraping/curating) |
| 3 | Scraper | Phase 0, 1 | Medium |
| 4 | AI Engine | Phase 1, 2, 3 | High (prompt engineering) |
| 5 | Web App | Phase 0, 4 | High (lots of UI) |
| 6 | Deployment | Phase 4, 5 | Medium |
| 7 | Dashboard | Phase 5, 6 | Medium |
| 8 | Polish | Phase 5, 6, 7 | Medium |
| 9 | Testing | All phases | Medium |

**Phases 2 and 3 can be built in parallel** since they're independent (data prep doesn't depend on the scraper, and vice versa).

---

## Quick Reference: Key Files

| File | Purpose |
|------|---------|
| `.env` | All API keys and secrets |
| `CLAUDE.md` | Project instructions for Claude Code |
| `plan.md` | This file — the build plan |
| `packages/db/schema.sql` | Complete database schema |
| `packages/scraper/index.ts` | Business data scraper orchestrator |
| `apps/web/prompts/system.ts` | Base system prompt for AI generation |
| `apps/web/lib/generator.ts` | AI generation orchestrator |
| `apps/web/lib/deployer.ts` | Vercel deployment orchestrator |
| `apps/web/app/page.tsx` | Platform landing page |
| `apps/web/app/generate/page.tsx` | Generation flow UI |
| `apps/web/app/dashboard/page.tsx` | User dashboard |
| `scripts/seed-embeddings.ts` | Populate vector database |
| `scripts/test-generation.ts` | End-to-end test |
