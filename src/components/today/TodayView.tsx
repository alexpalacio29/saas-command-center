import React from 'react';
import {
  Flame,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Calendar,
  Users,
  Target,
  Phone,
  MessageSquare,
  ArrowRight,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TodayView: React.FC = () => {
  const {
    products,
    tasks,
    leads,
    activities,
    toggleTaskComplete,
    openProductDetail,
    setActiveTab,
  } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];

  // 1. Tareas vencidas (dueDate < todayStr && status !== 'Completada')
  const overdueTasks = tasks.filter(
    (t) => t.status !== 'Completada' && t.dueDate && t.dueDate < todayStr
  );

  // 2. Tareas de hoy (dueDate === todayStr && status !== 'Completada')
  const todayTasks = tasks.filter(
    (t) => t.status !== 'Completada' && t.dueDate === todayStr
  );

  // 3. Tareas prioritarias (Crítica o Alta no completadas, sin fecha de hoy o vencida)
  const priorityTasks = tasks.filter(
    (t) =>
      t.status !== 'Completada' &&
      (t.priority === 'Crítica' || t.priority === 'Alta') &&
      (!t.dueDate || (t.dueDate !== todayStr && t.dueDate > todayStr))
  );

  // 4. Seguimientos de clientes / prospectos para hoy (nextFollowUpDate <= todayStr)
  const followUpLeads = leads.filter(
    (l) =>
      l.status !== 'CLIENTE' &&
      l.status !== 'PERDIDO' &&
      l.nextFollowUpDate <= todayStr
  );

  // 5. Bloqueos activos (cuellos de botella con severidad crítico o alto en productos activos)
  const activeBlockers = products.filter(
    (p) =>
      p.status !== 'archivado' &&
      p.status !== 'pausado' &&
      (p.bottleneck?.severity === 'critico' || p.bottleneck?.severity === 'alto')
  );

  // 6. Próximos eventos o demos agendadas (Leads en etapa DEMO o PRUEBA)
  const upcomingDemos = leads.filter(
    (l) => l.status === 'DEMO' || l.status === 'PRUEBA'
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-in fade-in">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-indigo-950/40 border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Flame className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Centro de Atención Diaria
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            ¿Qué debería atender hoy?
          </h2>
          <p className="text-xs text-slate-300">
            Filtrado sin distracciones: únicamente urgencias, vencimientos, cierres y bloqueos del día.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-950/70 p-3 rounded-2xl border border-slate-800 text-xs">
          <div className="text-right">
            <span className="text-slate-400 block text-[10px] uppercase">Hoy es</span>
            <span className="font-bold text-white font-mono">
              {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
            </span>
          </div>
        </div>
      </div>

      {/* 1. TAREAS VENCIDAS (ROJO - MÁXIMA PRIORIDAD) */}
      {overdueTasks.length > 0 && (
        <div className="p-5 rounded-3xl bg-red-950/20 border border-red-500/40 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <h3 className="font-bold text-white text-sm">
                Tareas Vencidas que Requieren Acción Inmediata ({overdueTasks.length})
              </h3>
            </div>
            <span className="text-[10px] uppercase font-bold text-red-400 px-2 py-0.5 rounded bg-red-500/20 border border-red-500/30">
              Retraso
            </span>
          </div>

          <div className="space-y-2">
            {overdueTasks.map((task) => {
              const prod = products.find((p) => p.id === task.productId);
              return (
                <div
                  key={task.id}
                  className="p-3.5 rounded-2xl bg-slate-900 border border-red-500/30 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleTaskComplete(task.id)}
                      className="w-5 h-5 rounded-lg border border-red-500/50 bg-red-950/30 flex items-center justify-center hover:bg-emerald-600 hover:border-emerald-500 text-white transition"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </button>
                    <div>
                      <div className="font-semibold text-white">{task.title}</div>
                      <div className="text-[11px] text-slate-400">{task.description}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {prod && (
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                        {prod.name}
                      </span>
                    )}
                    <span className="text-red-300 font-mono font-bold">
                      Venció: {task.dueDate}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2 COLUMNS: TAREAS DE HOY + SEGUIMIENTOS CRM */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Tareas de Hoy */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-400" />
              <h3 className="font-bold text-white text-sm">
                Tareas Programadas para Hoy ({todayTasks.length})
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('tasks')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
            >
              Ver Tareas →
            </button>
          </div>

          {todayTasks.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500 bg-slate-950/40 rounded-2xl">
              No tienes tareas fechadas exactamente para hoy. Revisa las prioritarias abajo.
            </div>
          ) : (
            <div className="space-y-2">
              {todayTasks.map((task) => {
                const prod = products.find((p) => p.id === task.productId);
                return (
                  <div
                    key={task.id}
                    className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleTaskComplete(task.id)}
                        className="w-5 h-5 rounded-lg border border-slate-700 bg-slate-800 flex items-center justify-center hover:bg-emerald-600 hover:border-emerald-500 text-white transition"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </button>
                      <div className="font-semibold text-slate-200">{task.title}</div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {prod && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {prod.name}
                        </span>
                      )}
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 font-semibold">
                        {task.priority}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Seguimientos de Clientes / Prospectos para Hoy */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" />
              <h3 className="font-bold text-white text-sm">
                Seguimientos de CRM para Hoy ({followUpLeads.length})
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('pipeline')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
            >
              Ir a Pipeline →
            </button>
          </div>

          {followUpLeads.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500 bg-slate-950/40 rounded-2xl">
              No hay contactos de CRM agendados para seguimiento hoy.
            </div>
          ) : (
            <div className="space-y-2">
              {followUpLeads.map((lead) => {
                const prod = products.find((p) => p.id === lead.productId);
                return (
                  <div
                    key={lead.id}
                    className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-bold text-white">{lead.name}</div>
                      <div className="text-[11px] text-slate-400">
                        {lead.institutionOrCompany} • {prod?.name}
                      </div>
                      {lead.notes && (
                        <div className="text-[10px] text-slate-500 mt-1 line-clamp-1 italic">
                          "{lead.notes}"
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {lead.whatsapp && (
                        <a
                          href={`https://wa.me/${lead.whatsapp}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-xl bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white border border-emerald-500/30 transition"
                          title="Contactar por WhatsApp"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        {lead.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* BLOQUEOS ACTIVOS EN PRODUCTOS (Section 12: Principal bloqueo y acción) */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white text-sm">
              Bloqueos Activos en el Portafolio ({activeBlockers.length})
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            Cuellos de botella de alto impacto a destrabar
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeBlockers.map((p) => (
            <div
              key={p.id}
              onClick={() => openProductDetail(p.id)}
              className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/90 hover:border-amber-500/40 transition cursor-pointer space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">{p.name}</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/20">
                  {p.bottleneck.category}
                </span>
              </div>

              <div>
                <span className="text-slate-400 font-semibold block text-[11px]">Principal Bloqueo:</span>
                <p className="text-slate-300 italic">{p.bottleneck.description}</p>
              </div>

              <div className="pt-1 border-t border-slate-800/60">
                <span className="text-indigo-400 font-semibold block text-[11px]">Acción Recomendada:</span>
                <p className="text-slate-200 font-medium">{p.bottleneck.recommendedAction}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DEMOS & PRUEBAS ACTIVAS */}
      {upcomingDemos.length > 0 && (
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-white text-sm">
                Demos & Pruebas en Curso ({upcomingDemos.length})
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {upcomingDemos.map((d) => (
              <div
                key={d.id}
                className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-bold text-white">{d.name}</div>
                  <div className="text-[11px] text-slate-400">{d.institutionOrCompany}</div>
                </div>
                <div className="text-right">
                  <span className="font-mono text-emerald-400 font-bold block">${d.estimatedValue}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold">
                    {d.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
