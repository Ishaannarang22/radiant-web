-- Radiant Web Database Schema
-- Tables: users, projects, project_files, generations, businesses
-- Vector tables: component_embeddings, template_embeddings, pattern_embeddings

-- Enable pgvector extension for vector embeddings (RAG)
CREATE EXTENSION IF NOT EXISTS vector;
