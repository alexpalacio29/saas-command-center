import React from 'react';
import {
  Layers,
  Code2,
  Users,
  Target,
  DollarSign,
  CheckSquare,
  AlertTriangle,
  Flame,
  ArrowRight,
  TrendingUp,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  Sparkles,
  Calendar,
  CheckCircle,
  Clock,
  ArrowUpRight,
  Activity,
  History,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DashboardView: React.FC = () => {
  const {
    products,
    tasks,
    leads,
    customers,
    roadmapItems,
    weeklyFocus,
    toggleWeeklyFocusComplete,
    alerts,
    auditLogs,
    setActiveTab,
    openProductDetail,
    searchQuery,
  } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];

  // SECTION 48: 4 Header Executive Counters
  const activeProductsCount = products.length;
  const totalCustomersCount = customers.length;
  const totalMRR = products.reduce((acc, p) => acc + (p.mrr || 0), 0);
  const totalMonthlyGrossRevenue = products.reduce((acc, p) => acc + (p.financials?.monthlyRevenue || p.mrr), 0);
  const totalARR = totalMRR * 12;
  const openLeadsCount = leads.filter((l) => l.status !== 'CLIENTE' && l.status !== 'PERDIDO').length;

  // SECTION 48: ATENCIÓN alerts calculation
  const overdueTasks = tasks.filter(
    (t) => t.status !== 'Completada' && t.dueDate && t.dueDate < todayStr
  );
  const leadsNeedingFollowup = leads.filter(
    (l) => l.status !== 'CLIENTE' && l.status !== 'PERDIDO' && l.nextFollowUpDate <= todayStr
  );
  const delayedMilestones = roadmapItems.filter(
    (r) => r.status !== 'Completado' && r.targetDate < todayStr
  );
  const inactiveProducts = products.filter(
    (p) => !p.lastActivityDate || p.lastActivityDate < '2026-09-22'
  );

  // SECTION 48: MI SEMANA (Weekly Focus + Top 3 Priorities)
  const priorityTasks = tasks
    .filter((t) => t.status !== 'Completada' && (t.priority === 'Crítica' || t.priority === 'Alta'))
    .slice(0, 3);

  // SECTION 48: PIPELINE Breakdown (Leads → Demos → Trials → Clientes)
  const pipeLeads = leads.filter((l) => l.status === 'LEAD' || l.status === 'CONTACTADO' || l.status === 'INTERESADO').length;
  const pipeDemos = leads.filter((l) => l.status === 'DEMO').length;
  const pipeTrials = leads.filter((l) => l.status === 'PRUEBA' || l.status === 'NEGOCIACIÓN').length;
  const pipeWon = leads.filter((l) => l.status === 'CLIENTE').length;

  // Filter products if search active
  const filteredProducts = products.filter((p) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-300">
      {/* SECTION 48: 4 BIG EXECUTIVE METRIC CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">PRODUCTOS</span>
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold font-mono text-white tracking-tight">
            {activeProductsCount}
          </div>
          <div className="mt-1 text-[11px] text-slate-400 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>Portafolio multi-SaaS activo</span>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">CLIENTES</span>
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold font-mono text-white tracking-tight">
            {totalCustomersCount}
          </div>
          <div className="mt-1 text-[11px] text-emerald-400">
            Cuentas corporativas contratadas
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">MRR RECURRENTE</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold font-mono text-emerald-400 tracking-tight">
            ${totalMRR.toLocaleString()}
          </div>
          <div className="mt-1 text-[11px] text-slate-400 font-mono">
            ARR: ${totalARR.toLocaleString()}
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">PROSPECTOS</span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold font-mono text-white tracking-tight">
            {openLeadsCount}
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            En embudo comercial abierto
          </div>
        </div>
      </div>

      {/* SECTION 48: ATENCIÓN ALERT BAR */}
      <div className="p-4 sm:p-5 rounded-2xl bg-red-950/20 border border-red-500/40 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <h3 className="font-bold text-white text-xs uppercase tracking-wider">
              ATENCIÓN OPERATIVA INMEDIATA
            </h3>
          </div>
          <button
            onClick={() => setActiveTab('today')}
            className="text-xs text-red-300 hover:text-white font-semibold flex items-center gap-1"
          >
            <span>Ver panel "Mi Día"</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div
            onClick={() => setActiveTab('tasks')}
            className="p-3 rounded-xl bg-slate-900/90 border border-red-500/20 hover:border-red-500/50 cursor-pointer flex items-center gap-2.5 transition"
          >
            <span className="text-base">⚠️</span>
            <div>
              <span className="font-bold text-red-300 block">{overdueTasks.length} tareas vencidas</span>
              <span className="text-[10px] text-slate-400">Requieren reprogramar o completar</span>
            </div>
          </div>

          <div
            onClick={() => setActiveTab('pipeline')}
            className="p-3 rounded-xl bg-slate-900/90 border border-amber-500/20 hover:border-amber-500/50 cursor-pointer flex items-center gap-2.5 transition"
          >
            <span className="text-base">⚠️</span>
            <div>
              <span className="font-bold text-amber-300 block">{leadsNeedingFollowup.length} leads necesitan seguimiento</span>
              <span className="text-[10px] text-slate-400">Sin contacto agendado para hoy</span>
            </div>
          </div>

          <div
            onClick={() => setActiveTab('roadmaps')}
            className="p-3 rounded-xl bg-slate-900/90 border border-red-500/20 hover:border-red-500/50 cursor-pointer flex items-center gap-2.5 transition"
          >
            <span className="text-base">⚠️</span>
            <div>
              <span className="font-bold text-red-300 block">{delayedMilestones.length} milestones retrasados</span>
              <span className="text-[10px] text-slate-400">GestiFy RD e-CF superó fecha</span>
            </div>
          </div>

          <div
            onClick={() => setActiveTab('products')}
            className="p-3 rounded-xl bg-slate-900/90 border border-slate-700 hover:border-slate-500 cursor-pointer flex items-center gap-2.5 transition"
          >
            <span className="text-base">⚠️</span>
            <div>
              <span className="font-bold text-slate-300 block">{inactiveProducts.length} producto sin actividad</span>
              <span className="text-[10px] text-slate-400">Revisar ritmo de entregas</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 48: PORTAFOLIO SUMMARY + MI SEMANA */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* PORTAFOLIO: EduGest, GestiFy RD, Biblos Games, MyTurn, Igleconet */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>PORTAFOLIO DE PRODUCTOS</span>
            </h3>
            <button
              onClick={() => setActiveTab('products')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
            >
              Ver todos →
            </button>
          </div>

          <div className="space-y-2">
            {filteredProducts.map((p) => {
              const stageColors: Record<string, string> = {
                LANZAMIENTO: '🟢 Lanzamiento',
                'VALIDACIÓN COMERCIAL': '🟡 Validación comercial',
                BETA: '🟡 Beta',
                'PRUEBA INTERNA': '🟠 Prueba',
                DESARROLLO: '🔵 Desarrollo',
              };
              const displayBadge = stageColors[p.currentStage] || `🔵 ${p.currentStage}`;

              return (
                <div
                  key={p.id}
                  onClick={() => openProductDetail(p.id)}
                  className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-indigo-500/40 cursor-pointer transition flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <span className="font-bold text-white text-sm block">{p.name}</span>
                    <span className="text-slate-400 text-[11px]">{p.category}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-medium text-slate-200 px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px]">
                      {displayBadge}
                    </span>
                    <span className="font-mono font-bold text-emerald-400 text-xs">
                      ${p.mrr} MRR
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* MI SEMANA: Prioridad 1, Prioridad 2, Prioridad 3 */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-400" />
              <h3 className="font-bold text-white text-xs uppercase tracking-wider">
                MI SEMANA ({weeklyFocus.weekIdentifier})
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('thisweek')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
            >
              Editar semana →
            </button>
          </div>

          {/* Primary Goal Highlight */}
          <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-indigo-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Objetivo Principal de la Semana
              </span>
              <button
                onClick={toggleWeeklyFocusComplete}
                className="text-[10px] text-emerald-400 font-bold hover:underline"
              >
                {weeklyFocus.isCompleted ? '✓ Cumplido' : 'Marcar listo'}
              </button>
            </div>
            <p className="text-white font-medium">{weeklyFocus.primaryGoalTitle}</p>
          </div>

          <div className="space-y-2">
            {priorityTasks.map((t, idx) => (
              <div
                key={t.id}
                onClick={() => setActiveTab('tasks')}
                className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 cursor-pointer flex items-center justify-between gap-2 text-xs transition"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span className="h-5 w-5 rounded-full bg-slate-800 text-indigo-300 font-bold text-[10px] flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-slate-200 font-medium truncate">{t.title}</span>
                </div>
                <span className="text-[10px] font-mono text-red-300 shrink-0">{t.dueDate}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 48: PIPELINE FUNNEL & REVENUE BREAKDOWN */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* PIPELINE: Leads → Demos → Trials → Clientes */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-400" />
              <span>PIPELINE DE ADQUISICIÓN</span>
            </h3>
            <button
              onClick={() => setActiveTab('pipeline')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
            >
              Ver Kanban →
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Leads</span>
              <span className="text-lg font-bold font-mono text-white">{pipeLeads}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Demos</span>
              <span className="text-lg font-bold font-mono text-indigo-400">{pipeDemos}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Trials</span>
              <span className="text-lg font-bold font-mono text-amber-400">{pipeTrials}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Clientes</span>
              <span className="text-lg font-bold font-mono text-emerald-400">{pipeWon}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/40 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Tasa de conversión estimada global:</span>
            <span className="font-mono font-bold text-emerald-400">18.5%</span>
          </div>
        </div>

        {/* REVENUE: MRR, ARR, Revenue Mensual, Costos, Margen */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>REVENUE & FINANZAS DEL PORTAFOLIO</span>
            </h3>
            <button
              onClick={() => setActiveTab('metrics')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
            >
              Analytics completo →
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">MRR</span>
              <span className="text-lg font-bold font-mono text-emerald-400">
                ${totalMRR.toLocaleString()}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">ARR</span>
              <span className="text-lg font-bold font-mono text-white">
                ${totalARR.toLocaleString()}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Revenue Mensual</span>
              <span className="text-lg font-bold font-mono text-white">
                ${totalMonthlyGrossRevenue.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/40 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Margen neto mensual estimado:</span>
            <span className="font-mono font-bold text-emerald-400">
              +${(totalMonthlyGrossRevenue - 825).toLocaleString()} USD
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 48: ACTIVIDAD RECIENTE FEED */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
            <History className="w-4 h-4 text-purple-400" />
            <span>ACTIVIDAD RECIENTE (AUDITORÍA GLOBAL)</span>
          </h3>
          <button
            onClick={() => setActiveTab('activity')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
          >
            Ver historial completo →
          </button>
        </div>

        <div className="space-y-2 text-xs">
          {auditLogs.slice(0, 5).map((log) => (
            <div
              key={log.id}
              className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-3 text-slate-300"
            >
              <div className="flex items-center gap-2 truncate">
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono uppercase bg-slate-800 text-slate-400">
                  {log.action}
                </span>
                <span className="text-white font-medium truncate">{log.description}</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500 shrink-0">
                {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
