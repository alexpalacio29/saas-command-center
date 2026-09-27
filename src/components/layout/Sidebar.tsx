import React, { useState } from 'react';
import {
  LayoutDashboard,
  Plus,
  Settings,
  Building,
  Rocket,
  DollarSign,
  ChevronRight,
  FolderKanban,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProductStage } from '../../types';

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    selectedProductId,
    selectProject,
    products,
    addProduct,
    currentOrganization,
    currentUser,
  } = useApp();

  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [newProjName, setNewProjName] = useState('');
  const [newProjDesc, setNewProjDesc] = useState('');
  const [newProjMrr, setNewProjMrr] = useState(0);
  const [newProjCosts, setNewProjCosts] = useState(0);

  const totalMrr = products.reduce((acc, p) => acc + (p.mrr || 0), 0);

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjName.trim()) return;

    const created = addProduct({
      name: newProjName.trim(),
      shortDescription: newProjDesc.trim() || 'Nuevo proyecto SaaS',
      currentStage: 'Idea & Validación',
      mrr: newProjMrr,
      financials: {
        mrr: newProjMrr,
        arr: newProjMrr * 12,
        nonRecurringMonthly: 0,
        monthlyCosts: newProjCosts,
        monthlyRevenue: newProjMrr,
        annualRevenue: newProjMrr * 12,
        estimatedProfitMonthly: newProjMrr - newProjCosts,
        lastUpdated: new Date().toISOString(),
      },
      status: 'saludable',
      priority: 'Alta',
    });

    setIsNewProjectModalOpen(false);
    setNewProjName('');
    setNewProjDesc('');
    setNewProjMrr(0);
    setNewProjCosts(0);

    // Abrir de inmediato el proyecto creado
    selectProject(created.id);
  };

  return (
    <>
      <aside className="hidden md:flex flex-col w-64 bg-slate-950 border-r border-slate-800/80 shrink-0 h-[calc(100vh-57px)] sticky top-[57px] overflow-y-auto overflow-x-hidden p-4 select-none justify-between">
        <div className="space-y-6">
          {/* Organization Badge */}
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 truncate">
                <Building className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span className="font-bold text-white truncate">{currentOrganization.name}</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono font-bold">
                {currentUser.role}
              </span>
            </div>
            <p className="text-[10px] text-slate-500">Gestor Multi-SaaS</p>
          </div>

          {/* 1. DASHBOARD GENERAL */}
          <div className="space-y-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                activeTab === 'dashboard'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="w-4 h-4 shrink-0" />
                <span>Dashboard General</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                ${totalMrr.toLocaleString()}
              </span>
            </button>
          </div>

          {/* 2. LISTA DE PROYECTOS CREADOS */}
          <div className="space-y-1.5 pt-2 border-t border-slate-850">
            <div className="flex items-center justify-between px-3 mb-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                MIS PROYECTOS ({products.length})
              </span>
              <button
                onClick={() => setIsNewProjectModalOpen(true)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                title="Crear Nuevo Proyecto"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-1">
              {products.map((p) => {
                const isSelected = activeTab === 'project-detail' && selectedProductId === p.id;

                return (
                  <button
                    key={p.id}
                    onClick={() => selectProject(p.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition ${
                      isSelected
                        ? 'bg-indigo-600/20 border border-indigo-500 text-white font-bold ring-1 ring-indigo-500/30'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <div className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-300 font-bold text-xs flex items-center justify-center shrink-0">
                        {p.name.charAt(0)}
                      </div>
                      <span className="truncate text-left">{p.name}</span>
                    </div>

                    <span className="text-[10px] text-emerald-400 font-semibold shrink-0">
                      ${p.mrr || 0}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setIsNewProjectModalOpen(true)}
              className="w-full mt-2 py-2 px-3 rounded-xl border border-dashed border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Nuevo Proyecto</span>
            </button>
          </div>
        </div>

        {/* Footer / Ajustes */}
        <div className="pt-4 border-t border-slate-850 space-y-1">
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition ${
              activeTab === 'settings'
                ? 'bg-slate-800 text-white font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Settings className="w-4 h-4 text-slate-400" />
              <span>Configuración</span>
            </div>
          </button>
        </div>
      </aside>

      {/* Modal: Crear Nuevo Proyecto */}
      {isNewProjectModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-indigo-400" />
              <span>Crear Nuevo Proyecto SaaS</span>
            </h3>

            <form onSubmit={handleCreateProject} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Nombre del SaaS *</label>
                <input
                  type="text"
                  required
                  placeholder="ej. AutoCRM, FactuCloud..."
                  value={newProjName}
                  onChange={(e) => setNewProjName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Descripción corta</label>
                <input
                  type="text"
                  placeholder="ej. Automatización de ventas para inmobiliarias"
                  value={newProjDesc}
                  onChange={(e) => setNewProjDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">MRR Inicial ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={newProjMrr}
                    onChange={(e) => setNewProjMrr(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Gastos Fijos ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={newProjCosts}
                    onChange={(e) => setNewProjCosts(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewProjectModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 transition shadow-sm"
                >
                  Crear Proyecto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
