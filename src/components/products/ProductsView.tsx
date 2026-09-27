import React, { useState } from 'react';
import {
  Box,
  Plus,
  LayoutGrid,
  List,
  Search,
  Filter,
  DollarSign,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  Layers,
  ArrowUpDown,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProductStage, ProductStatus, SaaSProduct } from '../../types';
import { ALL_STAGES } from '../../data/defaultData';

export const ProductsView: React.FC = () => {
  const { products, addProduct, openProductDetail, searchQuery } = useApp();

  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [selectedStageFilter, setSelectedStageFilter] = useState<string>('ALL');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('ALL');
  const [showNewProductModal, setShowNewProductModal] = useState(false);

  // New product form state
  const [newProd, setNewProd] = useState<Partial<SaaSProduct>>({
    name: '',
    shortDescription: '',
    description: '',
    category: 'Educación',
    currentStage: 'IDEA',
    status: 'saludable',
    priority: 'Alta',
    businessModel: 'SaaS B2B Mensual',
    priceDetail: '$49/mes base',
    mrr: 0,
    activeClientsCount: 0,
    activeUsersCount: 0,
    nextAction: 'Realizar entrevistas con 5 prospectos clave',
    websiteUrl: '',
    repoUrl: '',
  });

  const categories = Array.from(new Set(products.map((p) => p.category)));

  const filteredProducts = products.filter((p) => {
    if (selectedStageFilter !== 'ALL' && p.currentStage !== selectedStageFilter) return false;
    if (selectedCategoryFilter !== 'ALL' && p.category !== selectedCategoryFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.bottleneck?.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProd.name) return;
    const created = addProduct(newProd);
    setShowNewProductModal(false);
    openProductDetail(created.id);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Box className="w-6 h-6 text-indigo-400" />
            <span>Portafolio de Productos SaaS</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Administración del ciclo de vida completo de tus {products.length} soluciones
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'cards'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Vista de Tarjetas"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'table'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Vista de Tabla"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setShowNewProductModal(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/20 flex items-center gap-2 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo SaaS</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center gap-3 p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs">
        <div className="flex items-center gap-2 text-slate-400">
          <Filter className="w-3.5 h-3.5 text-indigo-400" />
          <span className="font-semibold text-slate-300">Filtrar por:</span>
        </div>

        {/* Stage Filter */}
        <select
          value={selectedStageFilter}
          onChange={(e) => setSelectedStageFilter(e.target.value)}
          className="bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-1.5 text-slate-200 focus:outline-none focus:border-indigo-500"
        >
          <option value="ALL">Todas las Etapas ({products.length})</option>
          {ALL_STAGES.map((s) => (
            <option key={s.stage} value={s.stage}>
              {s.order}. {s.stage}
            </option>
          ))}
        </select>

        {/* Category Filter */}
        <select
          value={selectedCategoryFilter}
          onChange={(e) => setSelectedCategoryFilter(e.target.value)}
          className="bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-1.5 text-slate-200 focus:outline-none focus:border-indigo-500"
        >
          <option value="ALL">Todas las Categorías</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {(selectedStageFilter !== 'ALL' || selectedCategoryFilter !== 'ALL') && (
          <button
            onClick={() => {
              setSelectedStageFilter('ALL');
              setSelectedCategoryFilter('ALL');
            }}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium ml-auto"
          >
            Restablecer filtros
          </button>
        )}
      </div>

      {/* CARDS VIEW */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProducts.map((p) => {
            const statusConfig = {
              saludable: { label: '🟢 Saludable', bg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' },
              atencion: { label: '🟡 Atención', bg: 'bg-amber-500/10 text-amber-300 border-amber-500/20' },
              critico: { label: '🔴 Crítico', bg: 'bg-red-500/10 text-red-300 border-red-500/20' },
              pausado: { label: '⚪ Pausado', bg: 'bg-slate-800 text-slate-300 border-slate-700' },
              archivado: { label: '🟣 Archivado', bg: 'bg-purple-500/10 text-purple-300 border-purple-500/20' },
            }[p.status];

            const currentStageChecklists = p.stageChecklists.filter(
              (c) => c.stage === p.currentStage
            );
            const completedCount = currentStageChecklists.filter((c) => c.completed).length;
            const progressPct = currentStageChecklists.length > 0
              ? Math.round((completedCount / currentStageChecklists.length) * 100)
              : 0;

            return (
              <div
                key={p.id}
                onClick={() => openProductDetail(p.id)}
                className="group p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900 transition-all cursor-pointer shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-white text-lg group-hover:text-indigo-300 transition-colors">
                          {p.name}
                        </h3>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${statusConfig.bg}`}>
                          {statusConfig.label}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 font-medium">{p.category}</span>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-mono font-bold text-emerald-400 block">
                        ${p.mrr.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-slate-500 uppercase">MRR</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 mb-3 leading-relaxed">
                    {p.shortDescription}
                  </p>

                  {/* Stage Progress */}
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 mb-3 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Etapa actual:</span>
                      <span className="font-bold text-indigo-300 font-mono text-[11px] px-2 py-0.5 rounded bg-indigo-950/70 border border-indigo-800/60">
                        {p.currentStage}
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full transition-all"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-right text-slate-400 font-mono">
                      {progressPct}% checklist completado
                    </div>
                  </div>

                  {/* Cuello de botella actual (Primary bottleneck) */}
                  <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 mb-3 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Cuello de botella:
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.2 rounded bg-amber-500/15 text-amber-300 border border-amber-500/20">
                        {p.bottleneck?.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 line-clamp-2 italic">
                      "{p.bottleneck?.description}"
                    </p>
                  </div>

                  <div className="text-xs text-slate-400 mb-2">
                    <span className="font-semibold text-slate-300">Próxima acción: </span>
                    <span className="text-slate-300 line-clamp-1">{p.nextAction}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-3">
                    <span>
                      <strong className="text-slate-200">{p.activeClientsCount}</strong> clientes
                    </span>
                    <span>
                      <strong className="text-slate-200">{p.activeUsersCount}</strong> usuarios
                    </span>
                  </div>
                  <span className="text-indigo-400 font-medium flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Abrir Ficha <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SECTION 37: EMPTY STATE */}
      {filteredProducts.length === 0 && (
        <div className="py-16 px-4 text-center rounded-3xl bg-slate-900/60 border border-dashed border-slate-800 space-y-4 max-w-lg mx-auto">
          <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mx-auto">
            <Box className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">Todavía no tienes productos</h3>
            <p className="text-xs text-slate-400">
              Registra tu primer producto SaaS para gestionar su ciclo de vida, roadmaps, cuellos de botella y finanzas.
            </p>
          </div>
          <button
            onClick={() => setShowNewProductModal(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/20 inline-flex items-center gap-2 transition"
          >
            <Plus className="w-4 h-4" />
            <span>+ Crear producto</span>
          </button>
        </div>
      )}

      {/* TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800 text-[10px]">
                <tr>
                  <th className="py-3 px-4">Producto</th>
                  <th className="py-3 px-4">Categoría</th>
                  <th className="py-3 px-4">Etapa</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4">Cuello de Botella</th>
                  <th className="py-3 px-4">Clientes</th>
                  <th className="py-3 px-4">MRR</th>
                  <th className="py-3 px-4">Próxima Acción</th>
                  <th className="py-3 px-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredProducts.map((p) => {
                  const statusConfig = {
                    saludable: { label: '🟢 Saludable', color: 'text-emerald-400' },
                    atencion: { label: '🟡 Atención', color: 'text-amber-400' },
                    critico: { label: '🔴 Crítico', color: 'text-red-400' },
                    pausado: { label: '⚪ Pausado', color: 'text-slate-400' },
                    archivado: { label: '🟣 Archivado', color: 'text-purple-400' },
                  }[p.status];

                  return (
                    <tr
                      key={p.id}
                      onClick={() => openProductDetail(p.id)}
                      className="hover:bg-slate-800/50 transition cursor-pointer"
                    >
                      <td className="py-3.5 px-4 font-bold text-white whitespace-nowrap">
                        {p.name}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">{p.category}</td>
                      <td className="py-3.5 px-4 whitespace-nowrap font-mono text-indigo-300 font-medium">
                        {p.currentStage}
                      </td>
                      <td className={`py-3.5 px-4 whitespace-nowrap font-medium ${statusConfig.color}`}>
                        {statusConfig.label}
                      </td>
                      <td className="py-3.5 px-4 max-w-xs truncate text-amber-300">
                        {p.bottleneck?.category}: {p.bottleneck?.description}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap font-mono">{p.activeClientsCount}</td>
                      <td className="py-3.5 px-4 whitespace-nowrap font-mono font-bold text-emerald-400">
                        ${p.mrr.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 max-w-xs truncate text-slate-300">{p.nextAction}</td>
                      <td className="py-3.5 px-4 whitespace-nowrap text-right text-indigo-400 font-semibold">
                        Ver Ficha →
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* NEW PRODUCT MODAL */}
      {showNewProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in">
          <div className="w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100 space-y-4 my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Box className="w-5 h-5 text-indigo-400" />
                <span>Registrar Nuevo Producto SaaS</span>
              </h3>
              <button
                onClick={() => setShowNewProductModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3.5 text-xs text-slate-300">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Nombre del SaaS *</label>
                  <input
                    type="text"
                    required
                    value={newProd.name}
                    onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                    placeholder="Ej: AutoStock RD"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Categoría *</label>
                  <input
                    type="text"
                    required
                    value={newProd.category}
                    onChange={(e) => setNewProd({ ...newProd, category: e.target.value })}
                    placeholder="Ej: Logística / Finanzas"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Descripción Corta</label>
                <input
                  type="text"
                  value={newProd.shortDescription}
                  onChange={(e) => setNewProd({ ...newProd, shortDescription: e.target.value })}
                  placeholder="Una frase que resuma el producto y a quién va dirigido"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Etapa Inicial</label>
                  <select
                    value={newProd.currentStage}
                    onChange={(e) => setNewProd({ ...newProd, currentStage: e.target.value as ProductStage })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  >
                    {ALL_STAGES.map((s) => (
                      <option key={s.stage} value={s.stage}>
                        {s.order}. {s.stage}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Prioridad</label>
                  <select
                    value={newProd.priority}
                    onChange={(e) => setNewProd({ ...newProd, priority: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Baja">Baja</option>
                    <option value="Media">Media</option>
                    <option value="Alta">Alta</option>
                    <option value="Crítica">Crítica</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Modelo de Negocio</label>
                  <input
                    type="text"
                    value={newProd.businessModel}
                    onChange={(e) => setNewProd({ ...newProd, businessModel: e.target.value })}
                    placeholder="Ej: SaaS B2B Suscripción"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Estructura de Precio</label>
                  <input
                    type="text"
                    value={newProd.priceDetail}
                    onChange={(e) => setNewProd({ ...newProd, priceDetail: e.target.value })}
                    placeholder="Ej: $49/mes base"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Próxima Acción Inmediata</label>
                <input
                  type="text"
                  value={newProd.nextAction}
                  onChange={(e) => setNewProd({ ...newProd, nextAction: e.target.value })}
                  placeholder="¿Cuál es el siguiente paso para desbloquearlo?"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewProductModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                >
                  Crear Producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
