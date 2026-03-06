-- Radiant Web Database Schema
-- Tables: users, projects, project_files, generations, businesses
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
