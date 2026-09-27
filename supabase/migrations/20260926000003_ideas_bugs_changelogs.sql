-- Migration: 20260926000003_ideas_bugs_changelogs.sql
-- Description: Knowledge, Idea Vault, Bug Tracker, Changelog, Competitors, Audit Activity Logs

-- 14. Idea Vault & Validation Notebook
CREATE TABLE IF NOT EXISTS public.ideas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  problem TEXT NOT NULL,
  target_audience TEXT NOT NULL,
  solution TEXT NOT NULL,
  competition TEXT,
  business_model TEXT,
  notes TEXT,
  status TEXT DEFAULT 'IDEA' CHECK (status IN ('IDEA', 'INVESTIGACIÓN', 'VALIDACIÓN', 'APROBADA', 'MVP', 'DESCARTADA', 'PAUSADA')),
  date DATE DEFAULT CURRENT_DATE,
  validation_hypothesis TEXT,
  validation_target_segment TEXT,
  validation_interviews_done INT DEFAULT 0,
  validation_evidence TEXT,
  validation_risks TEXT,
  validation_conclusion TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. Bug Tracker
CREATE TABLE IF NOT EXISTS public.bugs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  severity TEXT DEFAULT 'Medium' CHECK (severity IN ('Low', 'Medium', 'High', 'Critical')),
  priority TEXT DEFAULT 'Alta' CHECK (priority IN ('Crítica', 'Alta', 'Media', 'Baja')),
  status TEXT DEFAULT 'Abierto' CHECK (status IN ('Abierto', 'En Progreso', 'Resuelto', 'Cerrado')),
  responsible TEXT,
  version TEXT,
  solution TEXT,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. Changelogs
CREATE TABLE IF NOT EXISTS public.changelogs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  version TEXT NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  change TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Feature', 'Fix', 'Improvement', 'Security', 'Breaking Change')),
  author TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. Knowledge Docs
CREATE TABLE IF NOT EXISTS public.knowledge_docs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Tecnica', 'Comercial', 'Arquitectura', 'Procesos', 'Notas', 'Enlaces')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. Competitors Benchmarking
CREATE TABLE IF NOT EXISTS public.competitors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  url TEXT,
  value_proposition TEXT,
  pricing_model TEXT,
  key_features TEXT[],
  differentiation_notes TEXT,
  analysis_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. Audit Activity Logs (9 Event Types)
CREATE TABLE IF NOT EXISTS public.audit_activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id TEXT,
  action TEXT NOT NULL,
  description TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);
