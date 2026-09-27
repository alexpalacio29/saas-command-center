import React, { useState } from 'react';
import {
  Bug,
  Plus,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Search,
  Layers,
  ChevronDown,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BugItem, BugSeverity, BugStatus, TaskPriority } from '../../types';

export const BugsView: React.FC = () => {
  const { bugs, products, addBug, updateBug, deleteBug, currentUser, searchQuery } = useApp();

  const [selectedProductFilter, setSelectedProductFilter] = useState<string>('ALL');
  const [selectedSeverityFilter, setSelectedSeverityFilter] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [showNewBugModal, setShowNewBugModal] = useState(false);

  // New bug state
  const [newBugData, setNewBugData] = useState<Omit<BugItem, 'id' | 'organizationId'>>({
    productId: products[0]?.id || '',
    title: '',
    description: '',
    severity: 'Medium',
    priority: 'Alta',
    status: 'Abierto',
    responsible: currentUser.name,
    date: new Date().toISOString().split('T')[0],
    version: 'v1.0.0',
    solution: '',
  });

  const filteredBugs = bugs.filter((b) => {
    if (selectedProductFilter !== 'ALL' && b.productId !== selectedProductFilter) return false;
    if (selectedSeverityFilter !== 'ALL' && b.severity !== selectedSeverityFilter) return false;
    if (selectedStatusFilter !== 'ALL' && b.status !== selectedStatusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        b.title.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q) ||
        (b.solution && b.solution.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleCreateBug = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBugData.title) return;
    addBug(newBugData);
    setShowNewBugModal(false);
    setNewBugData({
      productId: products[0]?.id || '',
      title: '',
      description: '',
      severity: 'Medium',
      priority: 'Alta',
      status: 'Abierto',
      responsible: currentUser.name,
      date: new Date().toISOString().split('T')[0],
      version: 'v1.0.0',
      solution: '',
    });
  };

  const severityBadge = {
    Critical: 'bg-red-500/20 text-red-300 border-red-500/40',
    High: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    Medium: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    Low: 'bg-slate-800 text-slate-300 border-slate-700',
  };

  const openBugsCount = bugs.filter((b) => b.status === 'Abierto' || b.status === 'En investigación').length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Bug className="w-6 h-6 text-red-400" />
            <span>Bug Tracker del Portafolio</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Seguimiento riguroso de defectos, severidad e incidencias técnicas • {openBugsCount} bugs activos
          </p>
        </div>

        <button
          onClick={() => setShowNewBugModal(true)}
          className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-600/20 flex items-center gap-2 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Reportar Bug</span>
        </button>
      </div>

      {/* Filter toolbar */}
      <div className="flex flex-wrap items-center gap-3 p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
        <Filter className="w-3.5 h-3.5 text-red-400" />
        <span className="font-semibold text-slate-300">Filtrar:</span>

        <select
          value={selectedProductFilter}
          onChange={(e) => setSelectedProductFilter(e.target.value)}
          className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-white"
        >
          <option value="ALL">Todos los Productos</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <select
          value={selectedSeverityFilter}
          onChange={(e) => setSelectedSeverityFilter(e.target.value)}
          className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-white"
        >
          <option value="ALL">Todas las Severidades</option>
          <option value="Critical">🔴 Critical</option>
          <option value="High">🟠 High</option>
          <option value="Medium">🟡 Medium</option>
          <option value="Low">⚪ Low</option>
        </select>

        <select
          value={selectedStatusFilter}
          onChange={(e) => setSelectedStatusFilter(e.target.value)}
          className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-white"
        >
          <option value="ALL">Todos los Estados</option>
          <option value="Abierto">Abierto</option>
          <option value="En investigación">En investigación</option>
          <option value="Resuelto">Resuelto</option>
          <option value="Cerrado">Cerrado</option>
        </select>

        {(selectedProductFilter !== 'ALL' ||
          selectedSeverityFilter !== 'ALL' ||
          selectedStatusFilter !== 'ALL') && (
          <button
            onClick={() => {
              setSelectedProductFilter('ALL');
              setSelectedSeverityFilter('ALL');
              setSelectedStatusFilter('ALL');
            }}
            className="text-indigo-400 hover:text-indigo-300 font-medium ml-auto"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Bugs list */}
      <div className="space-y-3">
        {filteredBugs.map((bug) => {
          const prod = products.find((p) => p.id === bug.productId);

          return (
            <div
              key={bug.id}
              className={`p-4 rounded-2xl border transition text-xs space-y-3 ${
                bug.status === 'Resuelto' || bug.status === 'Cerrado'
                  ? 'bg-slate-950/40 border-slate-800 opacity-80'
                  : bug.severity === 'Critical'
                  ? 'bg-red-950/20 border-red-500/40 shadow-sm'
                  : 'bg-slate-900 border-slate-800 shadow-sm'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${severityBadge[bug.severity]}`}>
                      {bug.severity}
                    </span>
                    <h3 className="font-bold text-white text-sm">{bug.title}</h3>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed max-w-3xl">
                    {bug.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {prod && (
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-semibold">
                      {prod.name}
                    </span>
                  )}

                  <select
                    value={bug.status}
                    onChange={(e) => updateBug(bug.id, { status: e.target.value as BugStatus })}
                    className="bg-slate-950 border border-slate-700 rounded-lg text-[10px] px-2 py-1 text-slate-200"
                  >
                    <option value="Abierto">Abierto</option>
                    <option value="En investigación">En investigación</option>
                    <option value="Resuelto">Resuelto</option>
                    <option value="Cerrado">Cerrado</option>
                  </select>
                </div>
              </div>

              {bug.solution && (
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] text-emerald-300">
                  <strong className="text-slate-400">Solución / Fix:</strong> {bug.solution}
                </div>
              )}

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800/80">
                <div className="flex items-center gap-3">
                  <span>Reportado: {bug.date}</span>
                  {bug.version && <span>Versión: <strong className="text-slate-400">{bug.version}</strong></span>}
                </div>
                <span>Resp: {bug.responsible}</span>
              </div>
            </div>
          );
        })}

        {filteredBugs.length === 0 && (
          <div className="py-12 text-center text-xs text-slate-500 bg-slate-900/40 rounded-2xl border border-dashed border-slate-800">
            No hay bugs con los filtros seleccionados.
          </div>
        )}
      </div>

      {/* NEW BUG MODAL */}
      {showNewBugModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100 space-y-4 my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Bug className="w-5 h-5 text-red-400" />
                <span>Registrar Defecto / Bug</span>
              </h3>
              <button onClick={() => setShowNewBugModal(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateBug} className="space-y-3 text-xs text-slate-300">
              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Título del Bug *</label>
                <input
                  type="text"
                  required
                  value={newBugData.title}
                  onChange={(e) => setNewBugData({ ...newBugData, title: e.target.value })}
                  placeholder="Ej: Timeout al generar el comprobante fiscal XML"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Descripción del Comportamiento</label>
                <textarea
                  rows={3}
                  required
                  value={newBugData.description}
                  onChange={(e) => setNewBugData({ ...newBugData, description: e.target.value })}
                  placeholder="Pasos para reproducir, mensaje de error y entorno..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Producto SaaS</label>
                  <select
                    value={newBugData.productId}
                    onChange={(e) => setNewBugData({ ...newBugData, productId: e.target.value })}
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
                  <label className="text-slate-400 block mb-1 font-semibold">Severidad</label>
                  <select
                    value={newBugData.severity}
                    onChange={(e) => setNewBugData({ ...newBugData, severity: e.target.value as BugSeverity })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Critical">🔴 Critical (Bloqueo en prod)</option>
                    <option value="High">🟠 High (Fallo funcional mayor)</option>
                    <option value="Medium">🟡 Medium (Comportamiento anómalo)</option>
                    <option value="Low">⚪ Low (Detalle visual/menor)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Versión Afectada</label>
                  <input
                    type="text"
                    value={newBugData.version}
                    onChange={(e) => setNewBugData({ ...newBugData, version: e.target.value })}
                    placeholder="Ej: v1.2.0"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Responsable</label>
                  <input
                    type="text"
                    value={newBugData.responsible}
                    onChange={(e) => setNewBugData({ ...newBugData, responsible: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewBugModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold"
                >
                  Registrar Bug
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
