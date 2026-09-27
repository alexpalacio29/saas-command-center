import React, { useState } from 'react';
import {
  Milestone,
  Plus,
  List,
  Kanban,
  Clock,
  Layers,
  CheckCircle2,
  Calendar,
  Filter,
  AlertTriangle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RoadmapItem, RoadmapStatus, RoadmapType, TaskPriority } from '../../types';

export const RoadmapsView: React.FC = () => {
  const {
    roadmapItems,
    products,
    addRoadmapItem,
    updateRoadmapItem,
    deleteRoadmapItem,
    currentUser,
  } = useApp();

  const [selectedProductFilter, setSelectedProductFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'list' | 'kanban' | 'timeline'>('list');
  const [showNewItemModal, setShowNewItemModal] = useState(false);

  // New item form
  const [newItem, setNewItem] = useState<Omit<RoadmapItem, 'id' | 'organizationId'>>({
    productId: products[0]?.id || '',
    title: '',
    description: '',
    type: 'Milestone',
    status: 'Pendiente',
    priority: 'Alta',
    targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    responsible: currentUser.name,
    progressPercent: 0,
  });

  const filteredItems = roadmapItems.filter((item) => {
    if (selectedProductFilter !== 'ALL' && item.productId !== selectedProductFilter) return false;
    return true;
  });

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.title) return;
    addRoadmapItem(newItem);
    setShowNewItemModal(false);
    setNewItem({
      productId: products[0]?.id || '',
      title: '',
      description: '',
      type: 'Milestone',
      status: 'Pendiente',
      priority: 'Alta',
      targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      responsible: currentUser.name,
      progressPercent: 0,
    });
  };

  const statusColors: Record<RoadmapStatus, { badge: string; border: string }> = {
    Pendiente: { badge: 'bg-slate-800 text-slate-300', border: 'border-slate-800' },
    'En progreso': { badge: 'bg-blue-500/20 text-blue-300', border: 'border-blue-500/40' },
    Bloqueado: { badge: 'bg-red-500/20 text-red-300', border: 'border-red-500/40' },
    Completado: { badge: 'bg-emerald-500/20 text-emerald-300', border: 'border-emerald-500/40' },
    Cancelado: { badge: 'bg-slate-800 text-slate-500', border: 'border-slate-800' },
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Milestone className="w-6 h-6 text-indigo-400" />
            <span>Roadmaps del Portafolio SaaS</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Evolución de Objetivos, Milestones y Funcionalidades por producto
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode */}
          <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Vista Lista"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'kanban' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Vista Kanban"
            >
              <Kanban className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'timeline' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Vista Cronológica"
            >
              <Clock className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setShowNewItemModal(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/20 flex items-center gap-2 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Hito / Objetivo</span>
          </button>
        </div>
      </div>

      {/* Filter by Product */}
      <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
        <Filter className="w-4 h-4 text-indigo-400" />
        <span className="font-semibold text-slate-300">Producto SaaS:</span>
        <select
          value={selectedProductFilter}
          onChange={(e) => setSelectedProductFilter(e.target.value)}
          className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-white"
        >
          <option value="ALL">Todo el Portafolio ({roadmapItems.length} ítems)</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* 1. LIST VIEW */}
      {viewMode === 'list' && (
        <div className="space-y-3">
          {filteredItems.map((item) => {
            const prod = products.find((p) => p.id === item.productId);

            return (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-3 text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300">
                      {item.type}
                    </span>
                    <h3 className="font-bold text-white text-sm">{item.title}</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    {prod && (
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-semibold">
                        {prod.name}
                      </span>
                    )}
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${statusColors[item.status].badge}`}>
                      {item.status}
                    </span>
                    <span className="font-mono text-slate-400 text-[11px]">
                      Meta: {item.targetDate}
                    </span>
                  </div>
                </div>

                <p className="text-slate-300 leading-relaxed text-xs">{item.description}</p>

                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Avance estimado</span>
                    <span className="font-mono font-bold text-white">{item.progressPercent}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full transition-all"
                      style={{ width: `${item.progressPercent}%` }}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Responsable: {item.responsible}</span>
                  <div className="flex items-center gap-2">
                    <span>Progreso:</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={item.progressPercent}
                      onChange={(e) =>
                        updateRoadmapItem(item.id, { progressPercent: parseInt(e.target.value, 10) })
                      }
                      className="accent-indigo-500 w-24 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 2. KANBAN VIEW */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {(['Pendiente', 'En progreso', 'Bloqueado', 'Completado'] as RoadmapStatus[]).map((status) => {
            const itemsInCol = filteredItems.filter((i) => i.status === status);

            return (
              <div
                key={status}
                className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="font-bold text-white text-xs">{status}</span>
                  <span className="h-5 w-5 rounded-full bg-slate-800 text-[10px] font-bold text-slate-300 flex items-center justify-center">
                    {itemsInCol.length}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {itemsInCol.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs"
                    >
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                        {item.type}
                      </span>
                      <h4 className="font-bold text-white text-xs leading-snug">{item.title}</h4>
                      <div className="text-[10px] font-mono text-slate-400">{item.targetDate}</div>

                      <select
                        value={item.status}
                        onChange={(e) => updateRoadmapItem(item.id, { status: e.target.value as any })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg text-[10px] px-2 py-1 text-slate-300 mt-1"
                      >
                        <option value="Pendiente">Pendiente</option>
                        <option value="En progreso">En progreso</option>
                        <option value="Bloqueado">Bloqueado</option>
                        <option value="Completado">Completado</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. TIMELINE VIEW */}
      {viewMode === 'timeline' && (
        <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
          {filteredItems
            .slice()
            .sort((a, b) => a.targetDate.localeCompare(b.targetDate))
            .map((item) => {
              const prod = products.find((p) => p.id === item.productId);

              return (
                <div key={item.id} className="relative text-xs">
                  <div className="absolute -left-6 top-1.5 h-3 w-3 rounded-full bg-indigo-500 ring-4 ring-slate-900" />
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{item.title}</span>
                        <span className="text-[10px] font-mono text-indigo-300 px-2 py-0.5 rounded bg-indigo-950 border border-indigo-800">
                          {item.type}
                        </span>
                      </div>
                      <span className="font-mono text-slate-300 font-bold">{item.targetDate}</span>
                    </div>

                    <p className="text-slate-300 text-xs">{item.description}</p>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                      <span>Producto: {prod?.name}</span>
                      <span>Estado: <strong className="text-white">{item.status}</strong></span>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* NEW ITEM MODAL */}
      {showNewItemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">Crear Hito u Objetivo de Roadmap</h3>
              <button onClick={() => setShowNewItemModal(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateItem} className="space-y-3 text-xs text-slate-300">
              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Título *</label>
                <input
                  type="text"
                  required
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  placeholder="Ej: Facturación electrónica homologada"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-semibold"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Descripción</label>
                <textarea
                  rows={2}
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Producto SaaS</label>
                  <select
                    value={newItem.productId}
                    onChange={(e) => setNewItem({ ...newItem, productId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Tipo</label>
                  <select
                    value={newItem.type}
                    onChange={(e) => setNewItem({ ...newItem, type: e.target.value as RoadmapType })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Objetivo">Objetivo Estratégico</option>
                    <option value="Milestone">Milestone Clave</option>
                    <option value="Funcionalidad">Funcionalidad</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Fecha Objetivo (Deadline)</label>
                  <input
                    type="date"
                    value={newItem.targetDate}
                    onChange={(e) => setNewItem({ ...newItem, targetDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Prioridad</label>
                  <select
                    value={newItem.priority}
                    onChange={(e) => setNewItem({ ...newItem, priority: e.target.value as TaskPriority })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Baja">Baja</option>
                    <option value="Media">Media</option>
                    <option value="Alta">Alta</option>
                    <option value="Crítica">Crítica</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewItemModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                >
                  Guardar Hito
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
