-- Migration: 20260926000001_initial_schema.sql
-- Description: Core schema: organizations, members, profiles, products, stage history, checklists, health

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Organizations (Multi-Tenancy)
CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  plan TEXT DEFAULT 'Founder',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Organization Members & RBAC
CREATE TABLE IF NOT EXISTS public.organization_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('Owner', 'Admin', 'Member', 'Viewer')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, user_id)
);

-- 3. User Profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Products (15 Stages)
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  short_description TEXT,
  description TEXT,
  category TEXT NOT NULL,
  status TEXT DEFAULT 'saludable' CHECK (status IN ('saludable', 'atencion', 'critico', 'pausado', 'archivado')),
  current_stage TEXT NOT NULL DEFAULT 'IDEA',
  priority TEXT DEFAULT 'Alta' CHECK (priority IN ('Crítica', 'Alta', 'Media', 'Baja')),
  next_action TEXT,
  website_url TEXT,
  production_url TEXT,
  staging_url TEXT,
  repo_url TEXT,
  business_model TEXT,
  price_detail TEXT,
  mrr NUMERIC DEFAULT 0,
  arr NUMERIC DEFAULT 0,
  active_clients_count INT DEFAULT 0,
  active_users_count INT DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Product Financial Records (MRR vs Total Revenue vs Costs)
CREATE TABLE IF NOT EXISTS public.financial_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  mrr NUMERIC DEFAULT 0,
  non_recurring_monthly NUMERIC DEFAULT 0,
  monthly_costs NUMERIC DEFAULT 0,
  monthly_revenue NUMERIC DEFAULT 0,
  annual_revenue NUMERIC DEFAULT 0,
  estimated_profit_monthly NUMERIC DEFAULT 0,
  recorded_at DATE DEFAULT CURRENT_DATE
);

-- 6. Product Stage History
CREATE TABLE IF NOT EXISTS public.product_stage_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  previous_stage TEXT NOT NULL,
  new_stage TEXT NOT NULL,
  changed_at TIMESTAMPTZ DEFAULT NOW(),
  changed_by TEXT NOT NULL,
  comment TEXT
);

-- 7. Stage Checklists
CREATE TABLE IF NOT EXISTS public.stage_checklists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  stage TEXT NOT NULL,
  label TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  required_for_next_stage BOOLEAN DEFAULT TRUE
);

-- 8. Product Health Indicators & Bottlenecks
CREATE TABLE IF NOT EXISTS public.product_health (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE UNIQUE,
  producto INT DEFAULT 50,
  tecnologia INT DEFAULT 50,
  marketing INT DEFAULT 50,
  ventas INT DEFAULT 50,
  clientes INT DEFAULT 50,
  finanzas INT DEFAULT 50,
  bottleneck_category TEXT,
  bottleneck_description TEXT,
  bottleneck_action TEXT,
  bottleneck_severity TEXT DEFAULT 'alto',
  last_updated TIMESTAMPTZ DEFAULT NOW()
);
