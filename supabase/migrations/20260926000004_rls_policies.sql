-- Migration: 20260926000004_rls_policies.sql
-- Description: Row Level Security (RLS) policies enforcing multi-tenancy by organization_id

-- Helper function: verify if authenticated user belongs to tenant organization
CREATE OR REPLACE FUNCTION public.is_org_member(org_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.organization_members
    WHERE organization_id = org_id AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function: get user role in organization
CREATE OR REPLACE FUNCTION public.get_org_role(org_id UUID)
RETURNS TEXT AS $$
DECLARE
  v_role TEXT;
BEGIN
  SELECT role INTO v_role FROM public.organization_members
  WHERE organization_id = org_id AND user_id = auth.uid();
  RETURN v_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS across all tables
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_stage_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stage_checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_health ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subtasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmap_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bugs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.changelogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_docs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_activity_logs ENABLE ROW LEVEL SECURITY;

-- Tenant Isolation Policies
CREATE POLICY "Users access own organizations" ON public.organizations
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.organization_members WHERE organization_id = public.organizations.id AND user_id = auth.uid())
  );

CREATE POLICY "Users access own organization memberships" ON public.organization_members
  FOR ALL USING (organization_id IN (
    SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users access own profile" ON public.profiles
  FOR ALL USING (id = auth.uid());

CREATE POLICY "Tenant isolation for products" ON public.products
  FOR ALL USING (public.is_org_member(organization_id));

CREATE POLICY "Tenant isolation for financial_records" ON public.financial_records
  FOR ALL USING (public.is_org_member(organization_id));

CREATE POLICY "Tenant isolation for product_stage_history" ON public.product_stage_history
  FOR ALL USING (public.is_org_member(organization_id));

CREATE POLICY "Tenant isolation for stage_checklists" ON public.stage_checklists
  FOR ALL USING (public.is_org_member(organization_id));

CREATE POLICY "Tenant isolation for product_health" ON public.product_health
  FOR ALL USING (public.is_org_member(organization_id));

CREATE POLICY "Tenant isolation for tasks" ON public.tasks
  FOR ALL USING (public.is_org_member(organization_id));

CREATE POLICY "Tenant isolation for roadmap_items" ON public.roadmap_items
  FOR ALL USING (public.is_org_member(organization_id));

CREATE POLICY "Tenant isolation for leads" ON public.leads
  FOR ALL USING (public.is_org_member(organization_id));

CREATE POLICY "Tenant isolation for crm_activities" ON public.crm_activities
  FOR ALL USING (public.is_org_member(organization_id));

CREATE POLICY "Tenant isolation for customers" ON public.customers
  FOR ALL USING (public.is_org_member(organization_id));

CREATE POLICY "Tenant isolation for subscriptions" ON public.subscriptions
  FOR ALL USING (public.is_org_member(organization_id));

CREATE POLICY "Tenant isolation for ideas" ON public.ideas
  FOR ALL USING (public.is_org_member(organization_id));

CREATE POLICY "Tenant isolation for bugs" ON public.bugs
  FOR ALL USING (public.is_org_member(organization_id));

CREATE POLICY "Tenant isolation for changelogs" ON public.changelogs
  FOR ALL USING (public.is_org_member(organization_id));

CREATE POLICY "Tenant isolation for knowledge_docs" ON public.knowledge_docs
  FOR ALL USING (public.is_org_member(organization_id));

CREATE POLICY "Tenant isolation for competitors" ON public.competitors
  FOR ALL USING (public.is_org_member(organization_id));

CREATE POLICY "Tenant isolation for audit_activity_logs" ON public.audit_activity_logs
  FOR ALL USING (public.is_org_member(organization_id));
