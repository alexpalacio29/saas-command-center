import React, { useState } from 'react';
import {
  Calendar,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Target,
  Milestone,
  Box,
  CheckSquare,
  Users,
  Edit2,
  Save,
  Star,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ThisWeekView: React.FC = () => {
  const {
    products,
    tasks,
    leads,
    roadmapItems,
    weeklyFocus,
    updateWeeklyFocus,
    toggleWeeklyFocusComplete,
    toggleTaskComplete,
    openProductDetail,
    setActiveTab,
  } = useApp();

  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [goalTitle, setGoalTitle] = useState(weeklyFocus.primaryGoalTitle);
  const [goalDesc, setGoalDesc] = useState(weeklyFocus.primaryGoalDescription);

  // 1. Tareas prioritarias (Crítica o Alta pendientes)
  const priorityTasks = tasks.filter(
    (t) => t.status !== 'Completada' && (t.priority === 'Crítica' || t.priority === 'Alta')
  );

  // 2. Prospectos que necesitan seguimiento (Leads no cerrados)
  const followUpLeads = leads.filter(
    (l) => l.status !== 'CLIENTE' && l.status !== 'PERDIDO'
  );

  // 3. Demos programadas
  const scheduledDemos = leads.filter((l) => l.status === 'DEMO' || l.status === 'PRUEBA');

  // 4. Objetivos y Milestones de la semana
  const weeklyMilestones = roadmapItems.filter(
    (r) => r.status === 'En progreso' || r.status === 'Pendiente'
  );

  // 5. Productos que necesitan atención
  const attentionProducts = products.filter(
    (p) => p.status === 'atencion' || p.status === 'critico' || p.bottleneck?.severity === 'critico'
  );

  const handleSaveGoal = () => {
    updateWeeklyFocus({
      primaryGoalTitle: goalTitle,
      primaryGoalDescription: goalDesc,
    });
    setIsEditingGoal(false);
  };

  const handleSelectTaskAsWeeklyGoal = (taskTitle: string, taskDesc?: string, productId?: string) => {
    setGoalTitle(taskTitle);
    setGoalDesc(taskDesc || `Foco semanal para avanzar en la entrega de ${taskTitle}`);
    updateWeeklyFocus({
      primaryGoalTitle: taskTitle,
      primaryGoalDescription: taskDesc || `Foco semanal para avanzar en la entrega de ${taskTitle}`,
      targetProductId: productId,
    });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-in fade-in">
      {/* SECTION 16: OBJETIVO PRINCIPAL DE LA SEMANA */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-950/70 via-slate-900 to-slate-900 border border-indigo-500/40 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 block">
                Foco Estratégico {weeklyFocus.weekIdentifier}
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Objetivo Principal de la Semana
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditingGoal(!isEditingGoal)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>{isEditingGoal ? 'Cancelar' : 'Personalizar Objetivo'}</span>
            </button>
            <button
              onClick={toggleWeeklyFocusComplete}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-md ${
                weeklyFocus.isCompleted
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{weeklyFocus.isCompleted ? '¡Completado esta semana!' : 'Completar Objetivo'}</span>
            </button>
          </div>
        </div>

        {isEditingGoal ? (
          <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-700 space-y-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Título del Objetivo Principal</label>
              <input
                type="text"
                value={goalTitle}
                onChange={(e) => setGoalTitle(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Descripción / Criterio de Éxito</label>
              <textarea
                rows={2}
                value={goalDesc}
                onChange={(e) => setGoalDesc(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleSaveGoal}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" /> Guardar Objetivo
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{weeklyFocus.primaryGoalTitle}</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {weeklyFocus.primaryGoalDescription}
            </p>
          </div>
        )}
      </div>

      {/* 2 COLUMNS: PRODUCTOS QUE NECESITAN ATENCIÓN + DEMOS DE LA SEMANA */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Productos que necesitan atención */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-white text-sm">
                Productos que Necesitan Atención ({attentionProducts.length})
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('products')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
            >
              Ver Portafolio →
            </button>
          </div>

          <div className="space-y-2.5">
            {attentionProducts.map((p) => (
              <div
                key={p.id}
                onClick={() => openProductDetail(p.id)}
                className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-amber-500/40 transition cursor-pointer text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{p.name}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/20">
                    Bloqueo: {p.bottleneck?.category}
                  </span>
                </div>
                <p className="text-slate-300 italic text-[11px] line-clamp-1">
                  "{p.bottleneck?.description}"
                </p>
                <div className="text-[11px] text-indigo-300 font-medium line-clamp-1">
                  Acción: {p.bottleneck?.recommendedAction}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Demos y Oportunidades Clave de la Semana */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-white text-sm">
                Demos & Pruebas en Seguimiento ({scheduledDemos.length})
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('pipeline')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
            >
              Ver Pipeline CRM →
            </button>
          </div>

          <div className="space-y-2.5">
            {scheduledDemos.map((demo) => {
              const prod = products.find((p) => p.id === demo.productId);
              return (
                <div
                  key={demo.id}
                  className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="font-bold text-white">{demo.name}</div>
                    <div className="text-[11px] text-slate-400">
                      {demo.institutionOrCompany} • {prod?.name}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-emerald-400 font-bold block">
                      ${demo.estimatedValue}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold">
                      {demo.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* TAREAS PRIORITARIAS DE LA SEMANA (With option to promote to Weekly Primary Goal) */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-white text-sm">
              Tareas Prioritarias de la Semana ({priorityTasks.length})
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            Haz clic en la estrella para fijar como Objetivo Principal
          </span>
        </div>

        <div className="space-y-2">
          {priorityTasks.map((task) => {
            const prod = products.find((p) => p.id === task.productId);
            const isCurrentGoal = weeklyFocus.primaryGoalTitle === task.title;

            return (
              <div
                key={task.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 text-xs ${
                  isCurrentGoal
                    ? 'bg-indigo-950/30 border-indigo-500/50 shadow-sm'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleTaskComplete(task.id)}
                    className="w-5 h-5 rounded-lg border border-slate-700 bg-slate-800 flex items-center justify-center hover:bg-emerald-600 hover:border-emerald-500 text-white transition shrink-0"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </button>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{task.title}</span>
                      {isCurrentGoal && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/30 text-indigo-300 font-bold border border-indigo-500/40">
                          Objetivo Actual
                        </span>
                      )}
                    </div>
                    {task.description && (
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                        {task.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {prod && (
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                      {prod.name}
                    </span>
                  )}
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                      task.priority === 'Crítica'
                        ? 'bg-red-500/20 text-red-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {task.priority}
                  </span>

                  <button
                    onClick={() => handleSelectTaskAsWeeklyGoal(task.title, task.description, task.productId)}
                    className={`p-1.5 rounded-lg border transition ${
                      isCurrentGoal
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                        : 'bg-slate-800 text-slate-400 hover:text-amber-400 border-slate-700'
                    }`}
                    title="Fijar como objetivo principal de la semana"
                  >
                    <Star className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* OBJETIVOS Y MILESTONES DE LA SEMANA */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Milestone className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-white text-sm">
              Milestones Activos en Construcción ({weeklyMilestones.length})
            </h3>
          </div>
          <button
            onClick={() => setActiveTab('roadmaps')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
          >
            Ver Roadmaps →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {weeklyMilestones.map((item) => {
            const prod = products.find((p) => p.id === item.productId);
            return (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{item.title}</span>
                  </div>
                  {prod && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                      {prod.name}
                    </span>
                  )}
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Avance: {item.progressPercent}%</span>
                    <span className="font-mono text-slate-300">Meta: {item.targetDate}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full"
                      style={{ width: `${item.progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
