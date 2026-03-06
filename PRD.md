# Radiant Web — Product Requirements Document (PRD)

**Version:** 1.0
**Date:** March 4, 2026
**Status:** Draft

---

## 1. Overview

### 1.1 What is Radiant Web?

Radiant Web is an AI-powered platform that generates complete, production-ready websites for local businesses. A user enters a business name and location, the platform automatically scrapes the business's online presence (Google reviews, photos, hours, existing website), feeds that data to Claude AI, and produces a modern, responsive Next.js website — deployed live to a custom subdomain in under 60 seconds.

### 1.2 The Problem

Local businesses (restaurants, dentists, salons, plumbers, lawyers, etc.) need websites, but:

- **Hiring a developer** costs $2,000–$10,000+ and takes weeks
- **DIY website builders** (Wix, Squarespace) still require hours of manual work, design decisions, and content writing
- **Most local businesses have terrible websites** or no website at all — dated designs, broken links, no mobile support
- **Business owners don't have time** to learn web design tools

There is a massive gap between "no website" and "custom-built website" that current solutions don't fill well.

### 1.3 The Solution

Radiant Web fills this gap:

1. **Zero manual input needed** — AI scrapes all business data automatically
2. **Instant results** — Website generated in ~60 seconds, not weeks
3. **Modern design** — Uses premium UI component libraries (shadcn/ui, Aceternity, Magic UI) for visually stunning sites
4. **Industry-optimized** — Templates and design patterns tailored per business type
5. **Deployed instantly** — One click to go live on a custom subdomain
6. **No technical knowledge required** — Business owner just enters their name and location

### 1.4 Target Users

| User Type | Description | Use Case |
|-----------|-------------|----------|
| **Local Business Owner** | Restaurant owner, dentist, plumber, etc. | Wants a website for their business without the hassle |
| **Marketing Agency** | Agency managing multiple local business clients | Needs to spin up client sites quickly and cheaply |
| **Freelance Web Designer** | Solo designer serving SMB clients | Uses Radiant as a starting point, then customizes |
| **Sales Rep / Door-to-door** | Person pitching website services to local businesses | Generates a demo site on the spot to close the sale |

### 1.5 Success Metrics

| Metric | Target | How Measured |
|--------|--------|-------------|
| Generation success rate | >95% | Successful generations / total attempts |
| Time to live site | <90 seconds | From "Generate" click to live URL |
| Generated site quality score | >7/10 | Manual review across industries |
| User conversion (visitor → signup) | >5% | Analytics |
| User activation (signup → first site) | >60% | Database |
| Monthly recurring revenue | Growth target TBD | Stripe |

---

## 2. Product Requirements

### 2.1 User Stories

#### Epic 1: Site Generation

| ID | As a... | I want to... | So that... | Priority |
|----|---------|-------------|-----------|----------|
| U1 | business owner | enter my business name and get a website | I have an online presence without doing any work | P0 |
| U2 | user | see my business details (name, address, hours) auto-filled | I know the AI found the right business | P0 |
| U3 | user | preview my generated website before it goes live | I can verify it looks good | P0 |
| U4 | user | choose from different color schemes | the site matches my brand | P1 |
| U5 | user | regenerate my site with different preferences | I can get a design I prefer | P1 |
| U6 | agency user | generate sites for multiple businesses | I can serve all my clients from one account | P1 |

#### Epic 2: Deployment

| ID | As a... | I want to... | So that... | Priority |
|----|---------|-------------|-----------|----------|
| U7 | user | deploy my site with one click | it's live on the internet immediately | P0 |
| U8 | user | get a custom subdomain (mybusiness.test.surge.events) | the URL looks professional | P0 |
| U9 | user | see my site's live URL after deployment | I can share it with customers | P0 |
| U10 | user | connect a custom domain (future) | I can use my own domain name | P2 |

#### Epic 3: Management

| ID | As a... | I want to... | So that... | Priority |
|----|---------|-------------|-----------|----------|
| U11 | user | see all my generated sites in a dashboard | I can manage them in one place | P0 |
| U12 | user | delete a site | it's removed from the internet | P0 |
| U13 | user | redeploy a site after changes | updates go live | P1 |
| U14 | user | see basic analytics for my site (future) | I know if people are visiting | P2 |

#### Epic 4: Authentication & Account

| ID | As a... | I want to... | So that... | Priority |
|----|---------|-------------|-----------|----------|
| U15 | visitor | sign up with email or Google | I can save my generated sites | P0 |
| U16 | user | log in to access my dashboard | my sites are secure | P0 |
| U17 | user | reset my password | I can recover my account | P1 |
| U18 | user | upgrade my plan | I can generate more sites | P1 |

### 2.2 Functional Requirements

#### FR1: Business Data Scraping
- **FR1.1** The system MUST accept a business name and location as input
- **FR1.2** The system MUST search Google Places API and return matching businesses
- **FR1.3** The system MUST retrieve: business name, address, phone, hours, rating, review count, photos, and category
- **FR1.4** The system MUST retrieve up to 5 customer reviews with text and ratings
- **FR1.5** The system SHOULD scrape the business's existing website for additional content (if one exists)
- **FR1.6** The system MUST present the found business to the user for confirmation before proceeding
- **FR1.7** The system MUST cache scraped data to avoid redundant API calls (cache duration: 24 hours)

#### FR2: Website Generation
- **FR2.1** The system MUST generate a complete, multi-file Next.js website using Claude AI
- **FR2.2** Generated sites MUST include: root layout, homepage, navigation, hero section, contact info, and footer at minimum
- **FR2.3** Generated sites MUST use real business data (no placeholder text like "Lorem ipsum")
- **FR2.4** Generated sites MUST be responsive (mobile, tablet, desktop)
- **FR2.5** Generated sites MUST use Tailwind CSS for styling
- **FR2.6** Generated sites SHOULD use shadcn/ui components
- **FR2.7** Generated sites SHOULD include industry-appropriate sections (e.g., menu for restaurants, services list for plumbers)
- **FR2.8** The system MUST store all generated files in the database
- **FR2.9** The system MUST log generation metadata (tokens used, duration, model)
- **FR2.10** Generation MUST complete within 90 seconds

#### FR3: Preview
- **FR3.1** The system MUST display a visual preview of the generated website
- **FR3.2** The preview MUST support device switching (desktop, tablet, mobile viewport widths)
- **FR3.3** The preview MUST accurately represent what the deployed site will look like

#### FR4: Deployment
- **FR4.1** The system MUST deploy generated sites to Vercel via the Vercel API
- **FR4.2** Each deployed site MUST be accessible at `[subdomain].test.surge.events`
- **FR4.3** Subdomains MUST be unique across all users
- **FR4.4** Deployed sites MUST have SSL certificates (provided automatically by Vercel)
- **FR4.5** The system MUST return the live URL to the user after deployment

#### FR5: Dashboard
- **FR5.1** Users MUST see a list of all their generated sites
- **FR5.2** Each project card MUST show: business name, subdomain, status, and last updated date
- **FR5.3** Users MUST be able to delete a project (removes deployment from Vercel + database records)
- **FR5.4** Users MUST be able to view the live URL of deployed sites

#### FR6: Authentication
- **FR6.1** Users MUST be able to sign up with email and password
- **FR6.2** Users MUST be able to log in with email and password
- **FR6.3** Users SHOULD be able to sign up/log in with Google OAuth
- **FR6.4** Protected routes (/dashboard, /generate, /preview) MUST redirect unauthenticated users to login
- **FR6.5** Sessions MUST persist across page reloads

### 2.3 Non-Functional Requirements

#### Performance
- **NFR1** Landing page MUST load in < 3 seconds on 3G connection
- **NFR2** Business scraping MUST complete in < 10 seconds
- **NFR3** Website generation MUST complete in < 90 seconds
- **NFR4** Deployment MUST complete in < 120 seconds
- **NFR5** Generated sites MUST score > 80 on Google Lighthouse performance

#### Security
- **NFR6** All API keys MUST be stored in environment variables, never in code
- **NFR7** Database MUST use Row Level Security (RLS) — users can only access their own data
- **NFR8** API routes MUST validate all input data
- **NFR9** Rate limiting MUST prevent abuse (max 5 generations/hour per user)
- **NFR10** Generated site code MUST NOT contain XSS vulnerabilities

#### Reliability
- **NFR11** Generation failure rate MUST be < 5%
- **NFR12** Failed generations MUST provide clear error messages
- **NFR13** The system MUST handle external API downtime gracefully (Google, Vercel, Claude)

#### Scalability
- **NFR14** The system MUST support at least 100 concurrent users
- **NFR15** The database MUST handle at least 10,000 projects without performance degradation
- **NFR16** Vector search (RAG) MUST return results in < 500ms

---

## 3. Technical Architecture

### 3.1 System Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                         USER'S BROWSER                          │
│                                                                  │
│  Landing Page → Generate Flow → Preview → Dashboard              │
└──────────────────┬───────────────────────────────────────────────┘
                   │ HTTPS
                   ▼
┌──────────────────────────────────────────────────────────────────┐
│                    NEXT.JS APP (Vercel)                          │
│                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │  App Router  │  │  API Routes │  │  Middleware  │              │
│  │  (Pages)     │  │  /api/*     │  │  (Auth)      │              │
│  └─────────────┘  └──────┬──────┘  └─────────────┘              │
│                          │                                       │
│  ┌───────────────────────┼───────────────────────────────┐       │
│  │                 SERVER-SIDE LOGIC                      │       │
│  │                                                        │       │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐             │       │
│  │  │ Scraper  │  │Generator │  │ Deployer │             │       │
│  │  │ Module   │  │ Engine   │  │ Module   │             │       │
│  │  └────┬─────┘  └────┬─────┘  └────┬─────┘             │       │
│  │       │              │              │                   │       │
│  └───────┼──────────────┼──────────────┼───────────────────┘       │
│          │              │              │                           │
└──────────┼──────────────┼──────────────┼───────────────────────────┘
           │              │              │
     ┌─────▼─────┐  ┌────▼────┐  ┌─────▼─────┐
     │  Google   │  │ Claude  │  │  Vercel   │
     │  Places   │  │   API   │  │   API     │
     │   API     │  │         │  │           │
     └───────────┘  └─────────┘  └───────────┘
           │              │              │
           └──────────────┼──────────────┘
                          │
                    ┌─────▼─────┐
                    │ Supabase  │
                    │           │
                    │ PostgreSQL│
                    │ + pgvector│
                    │ + Auth    │
                    │ + Storage │
                    └───────────┘
```

### 3.2 Tech Stack

| Category | Choice | Rationale |
|----------|--------|-----------|
| **Framework** | Next.js 14+ (App Router) | Industry standard React framework, excellent DX, built-in SSR/SSG, API routes |
| **Language** | TypeScript | Type safety, better developer experience, catches errors at build time |
| **Styling** | Tailwind CSS v4 | Utility-first, excellent for AI-generated code (explicit, no hidden CSS) |
| **UI Library** | shadcn/ui | Copy-paste components, not a dependency — AI can use/modify them freely |
| **Animated UI** | Aceternity UI, Magic UI, 21st.dev | Premium-looking animated components for visual impact |
| **Database** | Supabase (PostgreSQL) | Free tier, built-in auth, realtime, file storage, pgvector support |
| **Vector DB** | pgvector (extension) | No extra service needed, lives in same Postgres instance |
| **AI** | Claude API (Anthropic) | Best code generation quality, large context window |
| **Hosting** | Vercel | Seamless Next.js hosting, API for programmatic deployments |
| **Business Data** | Google Places API | Most comprehensive local business data source |
| **Web Scraping** | Firecrawl (self-hosted) | Clean HTML-to-markdown, handles JS-heavy sites |
| **Email** | Resend | Developer-friendly email API, great deliverability |
| **Monorepo** | Turborepo + pnpm | Fast builds, shared dependencies, organized code |

### 3.3 Data Flow

```
1. USER INPUT
   └─> Business name: "Joe's Pizza"
   └─> Location: "Brooklyn, NY"

2. SCRAPING (packages/scraper)
   └─> Google Places: find "Joe's Pizza Brooklyn NY"
       └─> place_id: "ChIJ..."
       └─> name, address, phone, hours, rating (4.5), 127 reviews
       └─> 5 photo URLs
       └─> category: "Pizza restaurant"
   └─> Firecrawl: scrape joespizzabrooklyn.com
       └─> headings, paragraphs, menu items, about text
   └─> Industry mapper: "Pizza restaurant" → "restaurant"
   └─> OUTPUT: BusinessProfile JSON

3. PROMPT BUILDING (apps/web/lib/prompt-builder.ts)
   └─> Load base system prompt (always included)
   └─> Load restaurant industry fragment
   └─> RAG query: "restaurant hero section menu reviews"
       └─> Returns: relevant Aceternity hero component docs,
           shadcn card component docs, etc.
   └─> Inject retrieved component docs
   └─> Inject BusinessProfile as user prompt
   └─> OUTPUT: { system: string, user: string }

4. GENERATION (apps/web/lib/generator.ts)
   └─> Call Claude API with assembled prompts
   └─> Parse response into files:
       └─> app/layout.tsx
       └─> app/page.tsx
       └─> components/Hero.tsx
       └─> components/Menu.tsx
       └─> components/Reviews.tsx
       └─> components/Contact.tsx
       └─> components/Footer.tsx
       └─> tailwind.config.ts
   └─> Validate files (all required files present, no placeholders)
   └─> Store in project_files table
   └─> OUTPUT: File list

5. PREVIEW
   └─> Render generated files in iframe
   └─> User reviews and approves

6. DEPLOYMENT (apps/web/lib/deployer.ts)
   └─> Prepare files (add package.json, configs)
   └─> Create Vercel project: "joes-pizza"
   └─> Upload all files via Vercel API
   └─> Add domain: joes-pizza.test.surge.events
   └─> Wait for build to complete
   └─> OUTPUT: https://joes-pizza.test.surge.events
```

---

## 4. Information Architecture

### 4.1 Page Map

```
/                          Landing page (public)
/login                     Login form (public)
/signup                    Sign up form (public)
/generate                  Generation flow (protected)
/preview/[projectId]       Preview generated site (protected)
/dashboard                 Project list (protected)
/dashboard/[projectId]     Project detail (protected)
/dashboard/settings        Account settings (protected)
/pricing                   Pricing page (public)
```

### 4.2 API Endpoints

| Method | Path | Purpose | Auth |
|--------|------|---------|------|
| POST | `/api/scrape` | Scrape business data | Required |
| POST | `/api/generate` | Generate website | Required |
| POST | `/api/deploy` | Deploy to Vercel | Required |
| GET | `/api/projects` | List user's projects | Required |
| GET | `/api/projects/[id]` | Get project details | Required |
| DELETE | `/api/projects/[id]` | Delete project | Required |
| POST | `/api/projects/[id]/regenerate` | Regenerate site | Required |
| GET | `/api/projects/[id]/files` | Get project files | Required |

---

## 5. Industry Templates

Each supported industry has a template that guides the AI generation:

| Industry | Key Sections | Design Feel |
|----------|-------------|-------------|
| **Restaurant** | Hero with food photo, menu grid, hours/location, reviews, reservation CTA | Warm, inviting, food-forward |
| **Dental/Medical** | Hero with smile photo, services list, insurance accepted, team bios, appointment booking | Clean, trustworthy, professional |
| **Salon/Barbershop** | Hero with portfolio, services + pricing, gallery, booking CTA, reviews | Trendy, stylish, visual |
| **Plumber/HVAC** | Hero with emergency CTA, services list, service area map, reviews, contact form | Reliable, urgent, trust-building |
| **Lawyer** | Hero with credentials, practice areas, case results, team bios, consultation CTA | Authoritative, professional, dark tones |
| **Real Estate** | Hero with featured listing, search/filter, agent bio, testimonials, contact | Luxurious, image-heavy, clean |
| **Gym/Fitness** | Hero with action shot, class schedule, membership pricing, trainer bios, tour CTA | Energetic, bold, motivating |
| **Auto Repair** | Hero with shop photo, services + pricing, reviews, location/hours, quote CTA | Trustworthy, practical, clear pricing |
| **Cleaning Service** | Hero with before/after, services + pricing, service area, reviews, booking form | Fresh, clean, bright |
| **Generic** | Hero, about, services, reviews, contact, footer | Professional, adaptable |

---

## 6. Pricing Model (Future)

| Tier | Price | Sites | Features |
|------|-------|-------|----------|
| **Free** | $0 | 1 site | Basic generation, radiant subdomain |
| **Pro** | $29/mo | 10 sites | Priority generation, custom colors, analytics |
| **Agency** | $99/mo | Unlimited | White-label option, custom domains, API access |

---

## 7. Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|-----------|------------|
| Claude API generates bad code | Site doesn't work | Medium | Validation layer, retry logic, prompt iteration |
| Google Places API quota exceeded | Can't scrape businesses | Low | Cache aggressively, monitor usage |
| Vercel API rate limits | Can't deploy | Low | Queue deployments, cache projects |
| Generated sites look similar | Users feel product is low-quality | Medium | Multiple templates per industry, style variations |
| Business data is incomplete | Generated site has gaps | Medium | Graceful fallbacks, generic content for missing fields |
| UI component libraries change their APIs | Embedded docs become stale | Low | Periodic re-scraping, version pinning |
| Users generate inappropriate content | Platform reputation risk | Low | Content moderation in prompts, review flagging |

---

## 8. Future Roadmap (Post-MVP)

| Feature | Description | Priority |
|---------|-------------|----------|
| Inline editing | Edit generated site content directly in the browser | High |
| Custom domains | Users connect their own domain (e.g., joespizza.com) | High |
| Analytics dashboard | Page views, visitors, bounce rate for generated sites | Medium |
| A/B testing | Generate 2 versions, test which performs better | Medium |
| Multi-page sites | Generate sites with multiple pages (About, Services, Contact) | Medium |
| E-commerce | Add product listings and Stripe checkout to generated sites | Low |
| Blog integration | Auto-generated blog posts for SEO | Low |
| White-label | Agencies rebrand the platform as their own | Low |
| API access | Developers integrate generation into their own products | Low |

---

## 9. Glossary

| Term | Definition |
|------|-----------|
| **Business Profile** | The structured data package about a business (name, hours, reviews, etc.) scraped from Google Places and their website |
| **Generation** | The process of Claude AI creating website code from a business profile |
| **RAG** | Retrieval Augmented Generation — pulling relevant component docs from the vector database to include in the AI prompt |
| **pgvector** | A PostgreSQL extension that adds vector/embedding storage and similarity search |
| **Embedding** | A numerical representation (array of numbers) of text, used for semantic search |
| **shadcn/ui** | A component library for React where you copy the source code directly into your project (not installed as a package) |
| **Subdomain** | The prefix in a URL, e.g., "joes-pizza" in joes-pizza.test.surge.events |
| **Wildcard DNS** | A DNS record (*.test.surge.events) that routes ALL subdomains to the same server |
| **RLS (Row Level Security)** | A PostgreSQL feature that restricts which rows a user can read/write based on their identity |
| **SSE (Server-Sent Events)** | A way for the server to push real-time updates to the browser (used for generation progress) |
| **Vercel API** | Vercel's REST API that lets you create projects and deploy code programmatically |
| **Firecrawl** | An open-source tool that scrapes websites and converts them to clean markdown/text |
