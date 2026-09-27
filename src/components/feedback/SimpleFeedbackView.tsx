import React, { useState } from 'react';
import {
  Lightbulb,
  MessageSquare,
  Bug,
  Plus,
  CheckCircle2,
  Clock,
  Trash2,
  Filter,
  Check,
  User,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FeedbackPriority, FeedbackStatus, FeedbackType, SaaSFeedback } from '../../types';

export const SimpleFeedbackView: React.FC = () => {
  const { feedbacks, addFeedback, updateFeedback, deleteFeedback, products } = useApp();

  const [selectedProductFilter, setSelectedProductFilter] = useState<string>('all');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [targetProdId, setTargetProdId] = useState(products[0]?.id || '');
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newType, setNewType] = useState<FeedbackType>('Mejora');
  const [newPriority, setNewPriority] = useState<FeedbackPriority>('Media');
  const [newSource, setNewSource] = useState('');

  // Filtrado
  const filteredFeedbacks = feedbacks.filter((fb) => {
    if (selectedProductFilter !== 'all' && fb.productId !== selectedProductFilter) return false;
    if (selectedTypeFilter !== 'all' && fb.type !== selectedTypeFilter) return false;
    if (selectedStatusFilter !== 'all' && fb.status !== selectedStatusFilter) return false;
    return true;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addFeedback({
      productId: targetProdId,
      title: newTitle.trim(),
      description: newDesc.trim() || newTitle.trim(),
      type: newType,
      priority: newPriority,
      status: 'Pendiente',
      source: newSource.trim() || undefined,
    });

    setIsAddModalOpen(false);
    setNewTitle('');
    setNewDesc('');
    setNewSource('');
  };

  const cycleStatus = (id: string, current: FeedbackStatus) => {
    const next: FeedbackStatus =
      current === 'Pendiente' ? 'En curso' : current === 'En curso' ? 'Listo' : 'Pendiente';
    updateFeedback(id, { status: next });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Lightbulb className="w-5 h-5" />
            </span>
            Opiniones & Mejoras por SaaS
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Registra y organiza las opiniones de tus clientes, sugerencias de funcionalidades y correcciones.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Registrar Opinión / Mejora</span>
        </button>
      </div>

      {/* Barra de Filtros */}
      <div className="flex flex-wrap items-center gap-2.5 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
        <div className="flex items-center gap-1.5 text-slate-400 font-semibold mr-1">
          <Filter className="w-3.5 h-3.5" />
          <span>Filtros:</span>
        </div>

        {/* Filtro SaaS */}
        <select
          value={selectedProductFilter}
          onChange={(e) => setSelectedProductFilter(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-amber-500"
        >
          <option value="all">Todos los SaaS</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        {/* Filtro Tipo */}
        <select
          value={selectedTypeFilter}
          onChange={(e) => setSelectedTypeFilter(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-amber-500"
        >
          <option value="all">Todos los Tipos</option>
          <option value="Opinion">Opiniones de Clientes</option>
          <option value="Mejora">Mejoras Futuras</option>
          <option value="Bug">Errores / Bugs</option>
        </select>

        {/* Filtro Estado */}
        <select
          value={selectedStatusFilter}
          onChange={(e) => setSelectedStatusFilter(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-amber-500"
        >
          <option value="all">Todos los Estados</option>
          <option value="Pendiente">Pendientes</option>
          <option value="En curso">En curso</option>
          <option value="Listo">Implementados / Listos</option>
        </select>

        <span className="ml-auto text-slate-500 font-semibold">
          {filteredFeedbacks.length} registros
        </span>
      </div>

      {/* Grid de Feedbacks */}
      {filteredFeedbacks.length === 0 ? (
        <div className="p-10 text-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 text-xs space-y-3">
          <p>No hay opiniones o mejoras que coincidan con los filtros seleccionados.</p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-amber-600 text-white font-bold inline-flex items-center gap-1.5 text-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar la primera</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredFeedbacks.map((item) => {
            const prod = products.find((p) => p.id === item.productId);

            const typeConfig = {
              Opinion: { label: 'Opinión', icon: MessageSquare, color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' },
              Mejora: { label: 'Mejora', icon: Sparkles, color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
              Bug: { label: 'Bug', icon: Bug, color: 'text-red-400 bg-red-500/10 border-red-500/30' },
            }[item.type];

            const statusConfig = {
              Pendiente: { label: 'Por Hacer', color: 'bg-slate-800 text-slate-300 border-slate-700' },
              'En curso': { label: 'En Progreso', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' },
              Listo: { label: 'Implementado', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
            }[item.status];

            const Icon = typeConfig.icon;

            return (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-3 shadow-sm"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-indigo-500/15 text-indigo-300 font-bold text-[11px]">
                      {prod?.name || 'SaaS'}
                    </span>

                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 ${typeConfig.color}`}>
                      <Icon className="w-3 h-3" />
                      <span>{typeConfig.label}</span>
                    </span>
                  </div>

                  <h2 className="text-sm font-bold text-white leading-snug">{item.title}</h2>

                  {item.description && item.description !== item.title && (
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                      {item.description}
                    </p>
                  )}

                  {item.source && (
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pt-1">
                      <User className="w-3 h-3 text-slate-500 shrink-0" />
                      <span className="truncate">Sugerido por: <strong className="text-slate-300">{item.source}</strong></span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-850 flex items-center justify-between text-xs">
                  {/* Botón interactivo para cambiar estado */}
                  <button
                    onClick={() => cycleStatus(item.id, item.status)}
                    className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold transition flex items-center gap-1.5 ${statusConfig.color}`}
                    title="Haz clic para cambiar estado: Pendiente ➔ En curso ➔ Listo"
                  >
                    {item.status === 'Listo' ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : item.status === 'En curso' ? (
                      <Clock className="w-3.5 h-3.5 text-indigo-400" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-slate-400" />
                    )}
                    <span>{statusConfig.label}</span>
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`¿Eliminar este registro?`)) {
                        deleteFeedback(item.id);
                      }
                    }}
                    className="p-1 rounded text-slate-500 hover:text-red-400 transition"
                    title="Eliminar"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Registrar Nueva Opinión o Mejora */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-400" />
              <span>Registrar Opinión / Mejora</span>
            </h3>

            <form onSubmit={handleCreate} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  ¿A qué SaaS corresponde?
                </label>
                <select
                  value={targetProdId}
                  onChange={(e) => setTargetProdId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Tipo</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'Mejora', label: 'Mejora' },
                    { id: 'Opinion', label: 'Opinión' },
                    { id: 'Bug', label: 'Bug' },
                  ].map((t) => (
                    <button
                      type="button"
                      key={t.id}
                      onClick={() => setNewType(t.id as FeedbackType)}
                      className={`py-2 rounded-xl text-xs font-bold border transition text-center ${
                        newType === t.id
                          ? 'bg-amber-600 text-white border-amber-500'
                          : 'bg-slate-950 text-slate-400 border-slate-800'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Título breve *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ej. Agregar exportación a Excel en el módulo de cobros"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Detalles o contexto
                </label>
                <textarea
                  rows={3}
                  placeholder="Detalles sobre por qué es importante o qué problema resuelve..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  ¿Quién lo solicitó / opinó? (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="ej. Colegio San Miguel / Dr. Roberto"
                  value={newSource}
                  onChange={(e) => setNewSource(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-500 transition shadow-sm"
                >
                  Guardar Registro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
