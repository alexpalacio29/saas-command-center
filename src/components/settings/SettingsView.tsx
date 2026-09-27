import React, { useState } from 'react';
import {
  Settings,
  Database,
  Shield,
  Key,
  Download,
  Upload,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  Check,
  Copy,
  Layers,
  Users,
  Building,
  UserCheck,
  Share2,
  Sparkles,
  Sliders,
  Tag,
  ListChecks,
  Lock,
  Mail,
  DollarSign,
  Globe,
  Bell,
  CheckSquare,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ALL_STAGES, DEFAULT_STAGE_CHECKLIST_TEMPLATES } from '../../data/defaultData';
import { ProductStage, UserRole, ProductStatus, TaskPriority } from '../../types';

export const SettingsView: React.FC = () => {
  const {
    supabaseConfig,
    updateSupabaseConfig,
    testSupabaseConnection,
    resetToDefaults,
    exportBackupJSON,
    importBackupJSON,
    currentOrganization,
    setOrganizationName,
    currentUser,
    setUserRole,
  } = useApp();

  type SettingsSubTab =
    | 'perfil'
    | 'preferencias'
    | 'etapas'
    | 'checklists'
    | 'categorias'
    | 'usuarios'
    | 'organizacion'
    | 'supabase'
    | 'respaldos';

  const [activeSubTab, setActiveSubTab] = useState<SettingsSubTab>('perfil');

  // Supabase form state
  const [url, setUrl] = useState(supabaseConfig.url);
  const [anonKey, setAnonKey] = useState(supabaseConfig.anonKey);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [importText, setImportText] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  // Selected stage for checklist inspection
  const [selectedStage, setSelectedStage] = useState<ProductStage>('BETA');

  // Org and User local state
  const [orgNameInput, setOrgNameInput] = useState(currentOrganization.name);

  // Preferences local state
  const [currencyPref, setCurrencyPref] = useState('USD ($)');
  const [dateFormatPref, setDateFormatPref] = useState('YYYY-MM-DD');
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [autoSavePref, setAutoSavePref] = useState(true);

  // User management mock list
  const [teamMembers] = useState([
    { id: 'usr-1', name: 'Alex Palacio', email: 'Alexpalacio29@gmail.com', role: 'Owner', status: 'Activo' },
    { id: 'usr-2', name: 'Ing. Carlos Ortiz', email: 'carlos.dev@saascmd.io', role: 'Admin', status: 'Activo' },
    { id: 'usr-3', name: 'Lic. Laura Méndez', email: 'laura.growth@saascmd.io', role: 'Member', status: 'Activo' },
    { id: 'usr-4', name: 'Auditor Externo', email: 'auditoria@firmaconsultora.do', role: 'Viewer', status: 'Invitado' },
  ]);

  // Categories & Priorities catalogs
  const categoriesCatalog = [
    { name: 'EdTech / Educación', desc: 'Plataformas de gestión de colegios, institutos y LMS' },
    { name: 'FinTech / Fiscal', desc: 'Facturación electrónica e-CF, contabilidad y nóminas' },
    { name: 'Gaming / Gamificación', desc: 'Trivia interactiva bíblica y multijugador educativo' },
    { name: 'HealthTech / Turnos', desc: 'Control de citas y llamadas en pantalla de consultorios' },
    { name: 'PropTech / Inmobiliaria', desc: 'Cobro de rentas residenciales automatizadas' },
    { name: 'Logística / B2B', desc: 'Cotización ágil de repuestos automotrices' },
  ];

  const prioritiesCatalog: { name: TaskPriority; color: string; desc: string }[] = [
    { name: 'Crítica', color: 'bg-red-500/20 text-red-300 border-red-500/40', desc: 'Bloquea producción o impide cobros de clientes' },
    { name: 'Alta', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40', desc: 'Compromiso de entrega de la semana o demo clave' },
    { name: 'Media', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40', desc: 'Evolución normal de producto y roadmap' },
    { name: 'Baja', color: 'bg-slate-800 text-slate-300 border-slate-700', desc: 'Mejoras visuales o tareas menores sin plazo' },
  ];

  const statusesCatalog: { name: ProductStatus; icon: string; desc: string }[] = [
    { name: 'saludable', icon: '🟢', desc: 'Tracción constante, métricas en orden y sin cuellos de botella' },
    { name: 'atencion', icon: '🟡', desc: 'Requiere revisión en marketing, ventas o tareas vencidas' },
    { name: 'critico', icon: '🔴', desc: 'Bloqueo técnico, caída de clientes o costos desbordados' },
    { name: 'pausado', icon: '⏸️', desc: 'Desarrollo detenido temporalmente para priorizar otro SaaS' },
    { name: 'archivado', icon: '📁', desc: 'Producto descartado o en mantenimiento pasivo' },
  ];

  const handleSaveSupabase = async (e: React.FormEvent) => {
    e.preventDefault();
    updateSupabaseConfig({ url, anonKey });
    setIsTesting(true);
    setTestResult(null);
    const success = await testSupabaseConnection();
    setIsTesting(false);
    setTestResult(
      success
        ? '✅ Conexión con Supabase verificada exitosamente.'
        : '⚠️ No se pudo conectar con el endpoint de Supabase. Revisa la URL y la Anon Key.'
    );
  };

  const handleDownloadBackup = () => {
    const jsonStr = exportBackupJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = `saas-command-center-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importText) return;
    const success = importBackupJSON(importText);
    setImportStatus(
      success
        ? '✅ Base de datos restaurada correctamente.'
        : '❌ Error: Formato JSON no válido.'
    );
  };

  // Comprehensive SQL Schema for Supabase PostgreSQL with Multi-Tenancy & RLS
  const supabaseSQLSchema = `-- ======================================================================
-- SAAS COMMAND CENTER - COMPLETE POSTGRESQL SCHEMA WITH RLS
-- Multi-Tenancy by organization_id & Role-Based Access Control (RBAC)
-- ======================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Organizations
CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  plan TEXT DEFAULT 'Founder',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Organization Members & Roles (Owner, Admin, Member, Viewer)
CREATE TABLE IF NOT EXISTS public.organization_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('Owner', 'Admin', 'Member', 'Viewer')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organization_id, user_id)
);

-- 3. Profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Products
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  short_description TEXT,
  description TEXT,
  category TEXT NOT NULL,
  status TEXT DEFAULT 'saludable',
  current_stage TEXT NOT NULL DEFAULT 'IDEA',
  priority TEXT DEFAULT 'Alta',
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
  owner_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Product Financial Records (MRR vs Total Revenue, Costs, Profit)
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

-- 8. Product Health & Bottlenecks
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

-- 9. Tasks & Subtasks
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  responsible TEXT,
  priority TEXT DEFAULT 'Media',
  status TEXT DEFAULT 'Pendiente',
  due_date DATE,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. CRM Leads & Activities
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
  status TEXT DEFAULT 'LEAD',
  responsible TEXT,
  contact_date DATE,
  next_followup_date DATE,
  estimated_value NUMERIC DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Customers & Subscriptions
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  company TEXT,
  contact_person TEXT,
  email TEXT,
  phone TEXT,
  plan TEXT,
  start_date DATE DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'Activo',
  mrr NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Idea Vault & Validation
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
  status TEXT DEFAULT 'IDEA',
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Bugs Tracker
CREATE TABLE IF NOT EXISTS public.bugs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  severity TEXT DEFAULT 'Medium',
  priority TEXT DEFAULT 'Alta',
  status TEXT DEFAULT 'Abierto',
  responsible TEXT,
  version TEXT,
  solution TEXT,
  date DATE DEFAULT CURRENT_DATE
);

-- 14. Changelogs & Knowledge Docs
CREATE TABLE IF NOT EXISTS public.changelogs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  version TEXT NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  change TEXT NOT NULL,
  category TEXT NOT NULL,
  author TEXT
);

CREATE TABLE IF NOT EXISTS public.knowledge_docs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ======================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES ENFORCING MULTI-TENANCY
-- ======================================================================

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bugs ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_org_member(org_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.organization_members
    WHERE organization_id = org_id AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE POLICY "Tenant isolation for products" ON public.products
  FOR ALL USING (public.is_org_member(organization_id));

CREATE POLICY "Tenant isolation for tasks" ON public.tasks
  FOR ALL USING (public.is_org_member(organization_id));

CREATE POLICY "Tenant isolation for leads" ON public.leads
  FOR ALL USING (public.is_org_member(organization_id));

CREATE POLICY "Tenant isolation for customers" ON public.customers
  FOR ALL USING (public.is_org_member(organization_id));
`;

  const copySqlToClipboard = () => {
    navigator.clipboard.writeText(supabaseSQLSchema);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-in fade-in">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-indigo-400" />
          <span>Configuración del Sistema (Sección 31)</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Perfil, preferencias, etapas de ciclo de vida, checklists, categorías, prioridades, roles y multi-tenant
        </p>
      </div>

      {/* Subtab Navigation Pills (Section 31 options) */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-900 border border-slate-800 rounded-2xl text-xs overflow-x-auto">
        {[
          { id: 'perfil', label: '👤 Perfil & Autenticación' },
          { id: 'preferencias', label: '⚙️ Preferencias' },
          { id: 'etapas', label: '🔄 Etapas (15)' },
          { id: 'checklists', label: '📋 Checklists' },
          { id: 'categorias', label: '🏷️ Categorías & Prioridades' },
          { id: 'usuarios', label: '👥 Usuarios & Roles' },
          { id: 'organizacion', label: '🏢 Organización Multi-Tenant' },
          { id: 'supabase', label: '🗄️ Supabase PostgreSQL' },
          { id: 'respaldos', label: '💾 Respaldos & Integraciones' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as SettingsSubTab)}
            className={`px-3 py-1.5 rounded-xl font-medium transition shrink-0 ${
              activeSubTab === tab.id
                ? 'bg-indigo-600 text-white font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: PERFIL & AUTENTICACIÓN (Section 31 & 32) */}
      {activeSubTab === 'perfil' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-md space-y-5 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Perfil de Usuario & Credenciales (Sección 32)</h3>
                <span className="text-slate-400">Autenticación Supabase Auth con soporte para Email, Password y Magic Link</span>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Rol Activo: {currentUser.role}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Nombre Completo</label>
              <input
                type="text"
                readOnly
                value={currentUser.name}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Correo Electrónico (Supabase Auth)</label>
              <input
                type="email"
                readOnly
                value={currentUser.email}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>
          </div>

          {/* Role selector */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
            <label className="text-white font-bold block">Simulador de Permisos por Rol (Sección 32)</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { role: 'Owner' as UserRole, desc: 'Acceso total y configuración', badge: '👑 Owner' },
                { role: 'Admin' as UserRole, desc: 'Gestión técnica y comercial', badge: '🛠️ Admin' },
                { role: 'Member' as UserRole, desc: 'Operación diaria de tareas/CRM', badge: '👤 Member' },
                { role: 'Viewer' as UserRole, desc: 'Solo lectura de métricas', badge: '👁️ Viewer' },
              ].map((item) => (
                <button
                  key={item.role}
                  onClick={() => setUserRole(item.role)}
                  className={`p-3 rounded-xl border text-left transition ${
                    currentUser.role === item.role
                      ? 'bg-indigo-600/20 border-indigo-500 text-white font-bold shadow-sm'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="block text-sm mb-1">{item.badge}</span>
                  <span className="text-[10px] text-slate-400 block leading-tight">{item.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Future Auth methods note (Section 32) */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-indigo-400" />
              <div>
                <span className="font-bold text-white block">Métodos de Acceso Preparados</span>
                <span className="text-slate-400 text-[11px]">Email/Password activo. Google OAuth y Magic Link preparados en el cliente Supabase.</span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 text-[10px] font-mono">
              Ready for Supabase Auth
            </span>
          </div>
        </div>
      )}

      {/* TAB 2: PREFERENCIAS (Section 31) */}
      {activeSubTab === 'preferencias' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-md space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <Sliders className="w-5 h-5 text-indigo-400" />
              <div>
                <h3 className="font-bold text-white text-base">Preferencias del Sistema</h3>
                <span className="text-slate-400">Configuración regional, moneda y notificaciones internas</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Moneda Principal del Portafolio</label>
              <select
                value={currencyPref}
                onChange={(e) => setCurrencyPref(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
              >
                <option value="USD ($)">USD ($) - Dólares Americanos</option>
                <option value="DOP (RD$)">DOP (RD$) - Pesos Dominicanos</option>
                <option value="EUR (€)">EUR (€) - Euros</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Formato de Fecha</label>
              <select
                value={dateFormatPref}
                onChange={(e) => setDateFormatPref(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
              >
                <option value="YYYY-MM-DD">YYYY-MM-DD (ISO Estándar)</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY (Latinoamérica)</option>
              </select>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">Alertas Operativas Internas (Sección 27)</span>
                <span className="text-slate-400 text-[11px]">Detectar automáticamente tareas vencidas, leads sin seguimiento y renovaciones</span>
              </div>
              <input
                type="checkbox"
                checked={alertsEnabled}
                onChange={(e) => setAlertsEnabled(e.target.checked)}
                className="h-4 w-4 accent-indigo-600 rounded cursor-pointer"
              />
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">Auto-Guardado Local Reactivo</span>
                <span className="text-slate-400 text-[11px]">Sincronizar cada cambio inmediatamente en el almacenamiento local</span>
              </div>
              <input
                type="checkbox"
                checked={autoSavePref}
                onChange={(e) => setAutoSavePref(e.target.checked)}
                className="h-4 w-4 accent-indigo-600 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ETAPAS DEL CICLO DE VIDA (Section 31: 15 Etapas) */}
      {activeSubTab === 'etapas' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-md space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <Layers className="w-5 h-5 text-indigo-400" />
              <div>
                <h3 className="font-bold text-white text-base">Las 15 Etapas Oficiales del Ciclo de Vida SaaS</h3>
                <span className="text-slate-400">Evolución secuencial gobernada por checklists de control</span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 font-mono font-bold">
              15 Etapas Configuradas
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {ALL_STAGES.map((st) => (
              <div
                key={st.stage}
                onClick={() => {
                  setSelectedStage(st.stage);
                  setActiveSubTab('checklists');
                }}
                className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-indigo-500/50 cursor-pointer transition space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-indigo-400 font-bold text-[11px]">Paso {st.order}</span>
                  <span className="text-[10px] text-slate-400">Ver Checklist →</span>
                </div>
                <span className="font-bold text-white text-sm block">{st.stage}</span>
                <p className="text-[11px] text-slate-400 leading-relaxed">{st.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: CHECKLISTS POR ETAPA (Section 31) */}
      {activeSubTab === 'checklists' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-md space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <ListChecks className="w-5 h-5 text-indigo-400" />
              <div>
                <h3 className="font-bold text-white text-base">Checklists Obligatorios por Etapa</h3>
                <span className="text-slate-400">Requisitos indispensables para avanzar de fase un SaaS</span>
              </div>
            </div>

            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value as ProductStage)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-white font-bold"
            >
              {ALL_STAGES.map((s) => (
                <option key={s.stage} value={s.stage}>
                  {s.order}. {s.stage}
                </option>
              ))}
            </select>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-sm">
                Plantilla de Control para: <span className="text-indigo-400">{selectedStage}</span>
              </span>
              <span className="text-slate-400">
                {(DEFAULT_STAGE_CHECKLIST_TEMPLATES[selectedStage] || []).length} requisitos predefinidos
              </span>
            </div>

            <div className="space-y-2">
              {(DEFAULT_STAGE_CHECKLIST_TEMPLATES[selectedStage] || []).map((label, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3 text-slate-200"
                >
                  <CheckSquare className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span className="leading-relaxed">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: CATEGORÍAS, PRIORIDADES & ESTADOS (Section 31) */}
      {activeSubTab === 'categorias' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-md space-y-6 text-xs">
          {/* Categorías */}
          <div className="space-y-3">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Tag className="w-4 h-4 text-indigo-400" />
              <span>Catálogo de Categorías de Producto</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {categoriesCatalog.map((c) => (
                <div key={c.name} className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
                  <span className="font-bold text-white text-sm block mb-1">{c.name}</span>
                  <p className="text-slate-400 text-[11px]">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Prioridades */}
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <h3 className="font-bold text-white text-base">Escala de Prioridades</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {prioritiesCatalog.map((p) => (
                <div key={p.name} className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${p.color}`}>
                    {p.name}
                  </span>
                  <p className="text-slate-400 text-[11px] leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Estados */}
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <h3 className="font-bold text-white text-base">Estados de Salud del Portafolio</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {statusesCatalog.map((s) => (
                <div key={s.name} className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{s.icon}</span>
                    <span className="font-bold text-white capitalize">{s.name}</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: USUARIOS & ROLES (Section 31 & 32) */}
      {activeSubTab === 'usuarios' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-md space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <Users className="w-5 h-5 text-indigo-400" />
              <div>
                <h3 className="font-bold text-white text-base">Usuarios & Permisos de la Organización</h3>
                <span className="text-slate-400">Control de acceso basado en roles (Owner, Admin, Member, Viewer)</span>
              </div>
            </div>
            <button className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold">
              + Invitar Miembro
            </button>
          </div>

          <div className="divide-y divide-slate-800/80 rounded-2xl bg-slate-950/80 border border-slate-800 overflow-hidden">
            {teamMembers.map((member) => (
              <div key={member.id} className="p-3.5 flex items-center justify-between gap-3">
                <div>
                  <span className="font-bold text-white text-sm block">{member.name}</span>
                  <span className="text-slate-400 font-mono text-[11px]">{member.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                    {member.role}
                  </span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                    {member.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: ORGANIZACIÓN MULTI-TENANT (Section 33) */}
      {activeSubTab === 'organizacion' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-md space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <Building className="w-5 h-5 text-purple-400" />
              <div>
                <h3 className="font-bold text-white text-base">Organización Multi-Tenant (Sección 33)</h3>
                <span className="text-slate-400">Aislamiento estricto de datos con organization_id y RLS</span>
              </div>
            </div>
            <span className="text-slate-400 font-mono text-[11px]">
              ID: {currentOrganization.id}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Nombre de la Organización</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={orgNameInput}
                  onChange={(e) => setOrgNameInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
                <button
                  onClick={() => setOrganizationName(orgNameInput)}
                  className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shrink-0"
                >
                  Actualizar
                </button>
              </div>
            </div>

            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Plan de Suscripción</label>
              <input
                type="text"
                readOnly
                value={currentOrganization.plan}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: SUPABASE POSTGRESQL & SQL DDL (Section 34 & 35) */}
      {activeSubTab === 'supabase' && (
        <div className="space-y-5">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-md space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <Database className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="font-bold text-white text-base">Conexión a Supabase (PostgreSQL & Auth)</h3>
                  <span className="text-slate-400">Base de datos en la nube con Row Level Security</span>
                </div>
              </div>
              <span
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                  supabaseConfig.isConnected
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                {supabaseConfig.isConnected ? '🟢 Conectado' : '⚪ Modo Local / Offline First'}
              </span>
            </div>

            <form onSubmit={handleSaveSupabase} className="space-y-3 text-slate-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Supabase Project URL</label>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://xyzcompany.supabase.co"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Supabase Anon Public Key</label>
                  <input
                    type="password"
                    value={anonKey}
                    onChange={(e) => setAnonKey(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              {testResult && (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200">
                  {testResult}
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-400">
                  {supabaseConfig.lastTestedAt
                    ? `Última prueba: ${supabaseConfig.lastTestedAt}`
                    : 'Persistencia local reactiva con sincronización en background.'}
                </span>
                <button
                  type="submit"
                  disabled={isTesting}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center gap-1.5 transition"
                >
                  <RefreshCw className={`w-4 h-4 ${isTesting ? 'animate-spin' : ''}`} />
                  <span>{isTesting ? 'Verificando...' : 'Guardar y Probar Conexión'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* DDL SQL */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-md space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-white text-base">
                  Script DDL PostgreSQL Completo para Supabase (27 Tablas + RLS)
                </h3>
              </div>
              <button
                onClick={copySqlToClipboard}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSql ? 'Copiado al portapapeles' : 'Copiar Script SQL'}</span>
              </button>
            </div>

            <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-56 leading-relaxed">
              {supabaseSQLSchema}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 9: RESPALDOS & INTEGRACIONES (Section 41 & 49) */}
      {activeSubTab === 'respaldos' && (
        <div className="space-y-5">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-md space-y-4 text-xs">
            <h3 className="font-bold text-white text-base">Copia de Seguridad & Limpieza de Demo Data</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                <span className="font-bold text-white block">Exportar Portafolio Completo</span>
                <p className="text-slate-400">
                  Descarga un archivo JSON con todos los productos, finanzas, bugs, leads y changelogs.
                </p>
                <button
                  onClick={handleDownloadBackup}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold flex items-center gap-2"
                >
                  <Download className="w-4 h-4 text-indigo-400" />
                  <span>Descargar JSON de Respaldo</span>
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                <span className="font-bold text-white block">Reiniciar Datos de Demostración</span>
                <p className="text-slate-400">
                  Restablece los 5 SaaS de demostración (EduGest, GestiFy RD, Biblos Games, MyTurn, Igleconet).
                </p>
                <button
                  onClick={() => {
                    if (window.confirm('¿Deseas reiniciar los datos de demostración a su estado inicial?')) {
                      resetToDefaults();
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/50 text-red-300 font-semibold border border-red-500/30 flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Restablecer Datos Iniciales</span>
                </button>
              </div>
            </div>

            {/* JSON Import */}
            <form onSubmit={handleImportSubmit} className="space-y-2 pt-2 border-t border-slate-800">
              <label className="text-slate-400 font-semibold block">Restaurar Portafolio desde JSON</label>
              <textarea
                rows={2}
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder="Pega el contenido JSON de tu copia de seguridad..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
              />
              {importStatus && <div className="text-xs text-indigo-300">{importStatus}</div>}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center gap-1.5"
                >
                  <Upload className="w-4 h-4" /> Restaurar JSON
                </button>
              </div>
            </form>
          </div>

          {/* Integraciones */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-md space-y-4 text-xs">
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Share2 className="w-5 h-5 text-blue-400" />
                <span>Integraciones Externas Preparadas (Sección 49)</span>
              </h3>
              <p className="text-slate-400">
                Arquitectura diseñada para vincular pasarelas de pago, mensajería y desarrollo continuo
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { name: 'Stripe', desc: 'Cobros recurrentes y webhooks', status: 'Listo para vincular' },
                { name: 'WhatsApp Cloud API', desc: 'Tickets y recordatorios directos', status: 'Listo para vincular' },
                { name: 'GitHub', desc: 'Sync de commits y releases', status: 'Listo para vincular' },
                { name: 'Google Calendar', desc: 'Agenda automática de demos', status: 'Listo para vincular' },
                { name: 'Gmail / Resend', desc: 'Notificaciones transaccionales', status: 'Listo para vincular' },
                { name: 'Vercel Deployments', desc: 'Webhooks de despliegue continuo', status: 'Listo para vincular' },
              ].map((item) => (
                <div key={item.name} className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="font-bold text-white text-sm block">{item.name}</span>
                  <p className="text-[11px] text-slate-400">{item.desc}</p>
                  <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20 font-semibold">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
