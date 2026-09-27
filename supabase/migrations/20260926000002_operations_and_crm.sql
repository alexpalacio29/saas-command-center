-- Migration: 20260926000002_operations_and_crm.sql
-- Description: Operations: tasks, subtasks, roadmaps, CRM leads, activities, customers, subscriptions

-- 9. Tasks & Subtasks
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  responsible TEXT,
  priority TEXT DEFAULT 'Media' CHECK (priority IN ('Crítica', 'Alta', 'Media', 'Baja')),
  status TEXT DEFAULT 'Pendiente' CHECK (status IN ('Pendiente', 'En Progreso', 'Bloqueada', 'Completada', 'Cancelada')),
  due_date DATE,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.subtasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Roadmap Items & Milestones
CREATE TABLE IF NOT EXISTS public.roadmap_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT DEFAULT 'Milestone' CHECK (type IN ('Feature', 'Milestone', 'Release', 'Improvement')),
  status TEXT DEFAULT 'Pendiente' CHECK (status IN ('Pendiente', 'En Progreso', 'Completado', 'Pausado')),
  priority TEXT DEFAULT 'Alta' CHECK (priority IN ('Crítica', 'Alta', 'Media', 'Baja')),
  target_date DATE,
  responsible TEXT,
  progress_percent INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. CRM Leads & Pipeline
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  institution_or_company TEXT,
  email TEXT,
  phone TEXT,
  whatsapp TEXT,
  origin TEXT,
  status TEXT DEFAULT 'LEAD' CHECK (status IN ('LEAD', 'CONTACTADO', 'DEMO', 'PROPUESTA', 'NEGOCIACION', 'PRUEBA', 'GANADO', 'PERDIDO')),
  responsible TEXT,
  contact_date DATE,
  next_followup_date DATE,
  estimated_value NUMERIC DEFAULT 0,
  lost_reason TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. CRM Activities
CREATE TABLE IF NOT EXISTS public.crm_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('Llamada', 'WhatsApp', 'Email', 'Reunión', 'Demo', 'Seguimiento', 'Nota')),
  user_name TEXT NOT NULL,
  contact_name TEXT,
  description TEXT NOT NULL,
  result_outcome TEXT,
  date TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Customers & Subscriptions
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  company TEXT,
  contact_person TEXT,
  email TEXT,
  phone TEXT,
  product_ids UUID[],
  plan TEXT,
  start_date DATE DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'Activo' CHECK (status IN ('Activo', 'En Riesgo', 'Cancelado', 'Pausado')),
  mrr NUMERIC DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  plan_name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  frequency TEXT DEFAULT 'mensual' CHECK (frequency IN ('mensual', 'anual', 'trimestral', 'unico')),
  start_date DATE DEFAULT CURRENT_DATE,
  renewal_date DATE,
  status TEXT DEFAULT 'Activa' CHECK (status IN ('Activa', 'Vencida', 'Cancelada', 'Pausada')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
