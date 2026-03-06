-- Radiant Web Database Schema
-- Tables: users, projects, project_files, generations, businesses, component_embeddings, template_embeddings
-- Vector tables: component_embeddings, template_embeddings, pattern_embeddings

-- Enable pgvector extension for vector embeddings (RAG)
CREATE EXTENSION IF NOT EXISTS vector;

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'agency')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Projects table
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

-- Project files table
CREATE TABLE project_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  content TEXT NOT NULL,
  file_type TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(project_id, file_path)
);

-- Generations table
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

-- Businesses table
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

-- Component embeddings table (vector/RAG)
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

-- Template embeddings table (vector/RAG)
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
