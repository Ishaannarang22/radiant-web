# Radiant Web — Project Instructions

## What Is This Project?

Radiant Web is an **AI-powered website generation platform**. It takes a local business (restaurant, dentist, plumber, salon, lawyer, etc.), scrapes their existing online presence (Google reviews, photos, existing website), and uses Claude AI to generate a complete, modern, production-ready website — deployed instantly to a subdomain on `test.surge.events`.

Think of it as: "Paste a business name → get a beautiful website in 60 seconds."

## The Core Flow

```
User inputs business name + location
        ↓
Google Places API fetches: name, address, hours, phone, reviews, photos, category
        ↓
Firecrawl scrapes their existing website (if any) for content
        ↓
All business data is packaged into a structured JSON context
        ↓
Claude API generates a complete Next.js website using that context
        ↓
Website is deployed to Vercel at [business-slug].test.surge.events
        ↓
User gets a live URL they can share
```

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | Next.js 14+ (App Router) | React framework with SSR/SSG |
| Styling | Tailwind CSS v4 | Utility-first CSS |
| UI Components | shadcn/ui | Base component library |
| Animated Components | Aceternity UI, Magic UI, 21st.dev | Premium animated sections |
| Database | Supabase (PostgreSQL + pgvector) | Data storage + vector embeddings |
| AI | Claude API (Anthropic) | Code generation |
| Deployment | Vercel | Hosting + CI/CD |
| Business Data | Google Places API | Scrape business info |
| Web Scraping | Firecrawl (self-hosted) | Scrape existing websites |
| Email | Resend | Transactional emails |
| Domain | test.surge.events | Wildcard subdomain hosting |

## Project Structure (Target)

```
radiant_web/
├── .claude/                    # Claude Code config
│   └── settings.json
├── .env                        # API keys (NEVER commit)
├── .gitignore
├── CLAUDE.md                   # This file — project instructions
├── plan.md                     # Detailed build plan with checkboxes
│
├── apps/
│   ├── web/                    # Main platform (Next.js app)
│   │   ├── app/
│   │   │   ├── layout.tsx      # Root layout
│   │   │   ├── page.tsx        # Landing page — the product homepage
│   │   │   ├── generate/       # Business input + generation flow
│   │   │   ├── preview/        # Preview generated site before deploy
│   │   │   ├── dashboard/      # User dashboard — manage sites
│   │   │   └── api/
│   │   │       ├── generate/   # POST: trigger site generation
│   │   │       ├── deploy/     # POST: deploy to Vercel
│   │   │       ├── scrape/     # POST: scrape business data
│   │   │       └── webhooks/   # Stripe, Vercel webhooks
│   │   ├── components/
│   │   │   ├── ui/             # shadcn/ui components
│   │   │   ├── landing/        # Landing page sections
│   │   │   ├── generate/       # Generation flow components
│   │   │   └── dashboard/      # Dashboard components
│   │   ├── lib/
│   │   │   ├── supabase.ts     # Supabase client
│   │   │   ├── claude.ts       # Claude API wrapper
│   │   │   ├── vercel.ts       # Vercel deployment API
│   │   │   ├── google.ts       # Google Places API
│   │   │   ├── firecrawl.ts    # Firecrawl scraping
│   │   │   ├── embeddings.ts   # pgvector embedding helpers
│   │   │   └── templates.ts    # Industry template registry
│   │   ├── prompts/
│   │   │   ├── system.ts       # Base system prompt for Claude
│   │   │   ├── industries/     # Per-industry prompt fragments
│   │   │   └── components.ts   # Component library reference prompts
│   │   └── types/
│   │       └── index.ts        # TypeScript types
│   │
│   └── generated/              # Template for generated sites
│       ├── app/
│       ├── components/
│       └── public/
│
├── packages/
│   ├── db/                     # Database schema, migrations, seed
│   │   ├── schema.sql
│   │   ├── migrations/
│   │   └── seed/
│   │       ├── components.ts   # Seed component library embeddings
│   │       ├── templates.ts    # Seed industry templates
│   │       └── patterns.ts     # Seed design patterns
│   │
│   └── scraper/                # Business data scraper module
│       ├── google-places.ts
│       ├── firecrawl.ts
│       └── types.ts
│
├── data/
│   ├── components/             # Scraped component library docs
│   │   ├── shadcn/
│   │   ├── aceternity/
│   │   ├── magic-ui/
│   │   └── 21st-dev/
│   ├── templates/              # Industry template definitions
│   │   ├── restaurant.json
│   │   ├── dental.json
│   │   ├── salon.json
│   │   ├── plumber.json
│   │   ├── lawyer.json
│   │   └── generic.json
│   └── patterns/               # Design pattern references
│       ├── hero-sections.json
│       ├── cta-patterns.json
│       ├── color-schemes.json
│       └── copy-formulas.json
│
├── scripts/
│   ├── scrape-docs.ts          # Scrape UI library docs
│   ├── seed-embeddings.ts      # Generate + store embeddings
│   ├── setup-supabase.ts       # Initialize Supabase schema
│   └── test-generation.ts      # End-to-end generation test
│
├── package.json
├── turbo.json                  # Turborepo config (monorepo)
├── tsconfig.json
└── pnpm-workspace.yaml
```

## Database Schema (Supabase/PostgreSQL)

### Core Tables

- **users** — Platform users (email, name, plan tier)
- **projects** — Generated websites (business_name, subdomain, status, config JSON)
- **project_files** — Generated code files per project (path, content, project_id)
- **generations** — Generation history/logs (prompt, response, tokens used, duration)
- **businesses** — Scraped business data cache (google_place_id, data JSON)

### Vector/Embedding Tables

- **component_embeddings** — UI component docs with vector embeddings (name, library, docs_text, code_example, embedding vector(1536))
- **template_embeddings** — Industry template patterns with embeddings
- **pattern_embeddings** — Design pattern references with embeddings

## Key Design Decisions

1. **Monorepo with Turborepo** — Keeps platform app, generated site template, DB package, and scraper in one repo
2. **pgvector for RAG** — Component docs stored as embeddings, retrieved contextually per generation
3. **Tiered prompt context** — Not everything goes in every prompt. Core rules always included, industry patterns injected per business type, specific component docs retrieved via RAG
4. **File-based output** — Claude generates individual files (not one blob), stored in `project_files` table, assembled for deployment
5. **Vercel API deployment** — Sites deployed programmatically via Vercel API, not git push

## Code Style & Rules

- TypeScript strict mode everywhere
- Use `pnpm` as package manager
- Use Next.js App Router (not Pages Router)
- Use server components by default, `"use client"` only when needed
- Use Tailwind CSS for all styling — no CSS modules, no styled-components
- Use shadcn/ui as the base component library
- All API routes in `app/api/` using Route Handlers
- All database queries go through the `packages/db` package
- Environment variables accessed via `process.env` — never hardcoded
- Error handling: try/catch with meaningful error messages, never silent failures
- All functions that call external APIs should have timeout + retry logic

## Environment Variables

All keys are in `.env` at project root. Required:

| Variable | Service |
|----------|---------|
| ANTHROPIC_API_KEY | Claude API |
| VERCEL_TOKEN | Vercel deployment |
| GOOGLE_CLOUD_API_KEY | Google Places API |
| SUPABASE_URL | Supabase project URL |
| SUPABASE_ANON_KEY | Supabase public key |
| SUPABASE_SERVICE_ROLE_KEY | Supabase admin key |
| RESEND_API_KEY | Email sending |
| DOMAIN | Base domain for subdomains |

## What "Done" Looks Like

1. User visits the platform homepage
2. Enters a business name and location
3. Platform scrapes Google Places + existing website
4. Claude generates a complete, beautiful Next.js website
5. User previews the generated site
6. User clicks deploy → site goes live at `[slug].test.surge.events`
7. User can manage their site from a dashboard
