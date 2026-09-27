import React, { useState } from 'react';
import {
  History,
  Phone,
  MessageSquare,
  Mail,
  Calendar,
  Layers,
  FileText,
  Filter,
  CheckCircle2,
  Clock,
  Plus,
  Box,
  Milestone,
  DollarSign,
  Tag,
  UserCheck,
  Target,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Search,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CRMActivityType, AuditActivityLog } from '../../types';

export const ActivityView: React.FC = () => {
  const { activities, products, addActivity, auditLogs, logAuditEvent, currentUser } = useApp();

  const [activeViewMode, setActiveViewMode] = useState<'feed' | 'crm'>('feed');
  const [selectedProductFilter, setSelectedProductFilter] = useState<string>('ALL');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('ALL');
  const [searchFilter, setSearchFilter] = useState('');

  // New comment / event modal
  const [showLogModal, setShowLogModal] = useState(false);
  const [modalType, setModalType] = useState<'comment' | 'crm'>('comment');
  const [newProdId, setNewProdId] = useState(products[0]?.id || '');
  const [commentText, setCommentText] = useState('');
  const [commentCategory, setCommentCategory] = useState<
    'comentario' | 'cambio_precio' | 'producto_creado' | 'etapa_cambiada' | 'milestone_completado'
  >('comentario');

  // CRM state
  const [newType, setNewType] = useState<CRMActivityType>('Nota');
  const [contactName, setContactName] = useState('');
  const [desc, setDesc] = useState('');
  const [outcome, setOutcome] = useState('');

  // 1. Process and categorize audit logs (Section 26: 9 event types)
  const getEventCategory = (log: AuditActivityLog): string => {
    if (log.metadata?.type) return log.metadata.type;
    if (log.action === 'stage_change') return 'etapa_cambiada';
    if (log.action === 'version_published') return 'nueva_version';
    if (log.entity === 'customer') return 'cliente_creado';
    if (log.entity === 'lead' && (log.action === 'status_change' || log.description.includes('convertido')))
      return 'lead_convertido';
    if (log.entity === 'milestone') return 'milestone_completado';
    if (log.entity === 'task' && (log.action === 'status_change' || log.description.includes('Completada')))
      return 'tarea_completada';
    if (log.action === 'update' && (log.description.includes('precio') || log.description.includes('Plan') || log.description.includes('MRR')))
      return 'cambio_precio';
    if (log.entity === 'product' && log.action === 'create') return 'producto_creado';
    return 'comentario';
  };

  const getEventBadge = (category: string) => {
    switch (category) {
      case 'producto_creado':
        return { label: '🚀 Producto Creado', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30', icon: Box };
      case 'etapa_cambiada':
        return { label: '🔄 Etapa Cambiada', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30', icon: TrendingUp };
      case 'tarea_completada':
        return { label: '✅ Tarea Completada', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', icon: CheckCircle2 };
      case 'cliente_creado':
        return { label: '🤝 Cliente Creado', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', icon: UserCheck };
      case 'lead_convertido':
        return { label: '🎯 Lead Convertido', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30', icon: Target };
      case 'milestone_completado':
        return { label: '🚩 Milestone Completado', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30', icon: Milestone };
      case 'cambio_precio':
        return { label: '💰 Cambio de Precio', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30', icon: DollarSign };
      case 'nueva_version':
        return { label: '📦 Nueva Versión', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30', icon: Tag };
      default:
        return { label: '💬 Comentario', color: 'bg-slate-800 text-slate-300 border-slate-700', icon: MessageSquare };
    }
  };

  // Sort audit logs in strict reverse chronological order (Section 26)
  const filteredFeed = auditLogs
    .filter((log) => {
      const cat = getEventCategory(log);
      if (selectedCategoryFilter !== 'ALL' && cat !== selectedCategoryFilter) return false;
      if (selectedProductFilter !== 'ALL' && log.entityId !== selectedProductFilter) return false;
      if (searchFilter) {
        const q = searchFilter.toLowerCase();
        return (
          log.description.toLowerCase().includes(q) ||
          log.user.toLowerCase().includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp));

  // CRM Activities filtered
  const filteredActivities = activities
    .filter((a) => {
      if (selectedProductFilter !== 'ALL' && a.productId !== selectedProductFilter) return false;
      if (searchFilter) {
        const q = searchFilter.toLowerCase();
        return (
          a.description.toLowerCase().includes(q) ||
          a.contactName.toLowerCase().includes(q) ||
          (a.resultOutcome && a.resultOutcome.toLowerCase().includes(q))
        );
      }
      return true;
    })
    .sort((a, b) => b.date.localeCompare(a.date));

  const handleCreateCommentOrEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText) return;

    const prod = products.find((p) => p.id === newProdId);
    const prodName = prod ? prod.name : 'Portafolio';

    logAuditEvent(
      'product',
      newProdId,
      'create',
      commentCategory === 'comentario'
        ? `Comentario en ${prodName}: "${commentText}"`
        : `${commentText} (${prodName})`,
      { type: commentCategory, author: currentUser.name }
    );

    setShowLogModal(false);
    setCommentText('');
  };

  const handleCreateCRMActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!desc) return;

    addActivity({
      productId: newProdId,
      type: newType,
      userName: currentUser.name,
      contactName: contactName || 'General',
      description: desc,
      resultOutcome: outcome,
      date: new Date().toISOString(),
    });

    logAuditEvent(
      'lead',
      newProdId,
      'create',
      `Interacción CRM (${newType}) con ${contactName || 'prospecto'}: ${desc}`,
      { type: 'comentario' }
    );

    setShowLogModal(false);
    setDesc('');
    setOutcome('');
    setContactName('');
  };

  const activityIcons: Record<CRMActivityType, React.ElementType> = {
    Llamada: Phone,
    WhatsApp: MessageSquare,
    Email: Mail,
    Reunión: Calendar,
    Demo: Clock,
    Seguimiento: CheckCircle2,
    Nota: FileText,
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <History className="w-6 h-6 text-indigo-400" />
            <span>Activity Feed & Auditoría Global (Sección 26)</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Registro unificado en orden cronológico inverso de todos los hitos y eventos del portafolio SaaS
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setModalType('comment');
              setShowLogModal(true);
            }}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/20 flex items-center gap-2 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Publicar Acontecimiento / Comentario</span>
          </button>
        </div>
      </div>

      {/* Main Mode Toggle: Activity Feed vs CRM Interactions */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-2xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveViewMode('feed')}
            className={`px-4 py-1.5 rounded-xl font-bold transition ${
              activeViewMode === 'feed'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Feed Global de Acontecimientos ({auditLogs.length})
          </button>
          <button
            onClick={() => setActiveViewMode('crm')}
            className={`px-4 py-1.5 rounded-xl font-bold transition ${
              activeViewMode === 'crm'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Interacciones CRM & Clientes ({activities.length})
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Tiempo real / Orden inverso</span>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Buscar en el registro de actividad..."
              className="bg-transparent text-white placeholder-slate-500 focus:outline-none w-full"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">Producto:</span>
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
          </div>
        </div>

        {/* 9 Event Category Filter Pills (Section 26) */}
        {activeViewMode === 'feed' && (
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-800/80">
            <span className="text-[10px] uppercase font-bold text-slate-500 mr-1">Filtrar por Tipo:</span>
            {[
              { id: 'ALL', label: 'Todos' },
              { id: 'producto_creado', label: '🚀 Producto Creado' },
              { id: 'etapa_cambiada', label: '🔄 Etapa Cambiada' },
              { id: 'tarea_completada', label: '✅ Tarea Completada' },
              { id: 'cliente_creado', label: '🤝 Cliente Creado' },
              { id: 'lead_convertido', label: '🎯 Lead Convertido' },
              { id: 'milestone_completado', label: '🚩 Milestone' },
              { id: 'cambio_precio', label: '💰 Cambio de Precio' },
              { id: 'nueva_version', label: '📦 Nueva Versión' },
              { id: 'comentario', label: '💬 Comentario' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryFilter(cat.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition ${
                  selectedCategoryFilter === cat.id
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* VIEW MODE 1: FEED GLOBAL DE ACONTECIMIENTOS (Section 26) */}
      {activeViewMode === 'feed' && (
        <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
          {filteredFeed.map((log) => {
            const cat = getEventCategory(log);
            const badge = getEventBadge(cat);
            const BadgeIcon = badge.icon;
            const prod = products.find((p) => p.id === log.entityId);

            return (
              <div key={log.id} className="relative text-xs">
                {/* Timeline node */}
                <div className="absolute -left-6 top-2 h-3.5 w-3.5 rounded-full bg-indigo-500 ring-4 ring-slate-950 flex items-center justify-center text-white" />

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-2 hover:border-slate-700 transition">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-slate-400">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md font-bold text-[10px] border ${badge.color}`}>
                        <BadgeIcon className="w-3 h-3" />
                        <span>{badge.label}</span>
                      </span>

                      {prod && (
                        <span className="font-semibold text-indigo-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                          {prod.name}
                        </span>
                      )}
                    </div>

                    <span className="font-mono text-slate-400">
                      {new Date(log.timestamp).toLocaleString('es-ES', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </span>
                  </div>

                  <p className="text-slate-100 text-xs sm:text-sm font-medium leading-relaxed">
                    {log.description}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
                    <span>Autor: <strong className="text-slate-300">{log.user}</strong></span>
                    {log.metadata && Object.keys(log.metadata).length > 0 && (
                      <span className="font-mono text-[10px] text-slate-400">
                        {log.metadata.version ? `Versión: ${log.metadata.version}` : ''}
                        {log.metadata.mrr ? `MRR: $${log.metadata.mrr}` : ''}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {filteredFeed.length === 0 && (
            <div className="py-12 text-center text-xs text-slate-400 bg-slate-900/40 rounded-2xl border border-dashed border-slate-800">
              No se encontraron acontecimientos para los filtros seleccionados.
            </div>
          )}
        </div>
      )}

      {/* VIEW MODE 2: CRM & CLIENTS LOG */}
      {activeViewMode === 'crm' && (
        <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
          <div className="flex justify-end mb-2">
            <button
              onClick={() => {
                setModalType('crm');
                setShowLogModal(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Registrar Llamada / Demo / WhatsApp
            </button>
          </div>

          {filteredActivities.map((act) => {
            const prod = products.find((p) => p.id === act.productId);
            const Icon = activityIcons[act.type] || FileText;

            return (
              <div key={act.id} className="relative text-xs">
                <div className="absolute -left-6 top-1.5 h-3.5 w-3.5 rounded-full bg-blue-500 ring-4 ring-slate-950 flex items-center justify-center text-white" />

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-slate-400">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 font-semibold text-white px-2 py-0.5 rounded bg-slate-800">
                        <Icon className="w-3 h-3 text-indigo-400" />
                        {act.type}
                      </span>
                      {prod && <span className="text-indigo-300 font-semibold">{prod.name}</span>}
                      {act.contactName && <span className="text-slate-400">• {act.contactName}</span>}
                    </div>
                    <span className="font-mono text-slate-400">
                      {new Date(act.date).toLocaleString('es-ES', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </span>
                  </div>

                  <p className="text-slate-200 text-xs leading-relaxed">{act.description}</p>

                  {act.resultOutcome && (
                    <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] text-emerald-300">
                      <strong className="text-slate-400">Resultado:</strong> {act.resultOutcome}
                    </div>
                  )}

                  <div className="text-[10px] text-slate-400 text-right">
                    Registrado por: {act.userName}
                  </div>
                </div>
              </div>
            );
          })}

          {filteredActivities.length === 0 && (
            <div className="py-12 text-center text-xs text-slate-400 bg-slate-900/40 rounded-2xl border border-dashed border-slate-800">
              No se encontraron actividades CRM con los filtros actuales.
            </div>
          )}
        </div>
      )}

      {/* QUICK LOG MODAL */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">
                {modalType === 'comment' ? 'Publicar en Activity Feed' : 'Registrar Interacción CRM'}
              </h3>
              <button onClick={() => setShowLogModal(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            {modalType === 'comment' ? (
              <form onSubmit={handleCreateCommentOrEvent} className="space-y-3 text-xs text-slate-300">
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Producto Asociado</label>
                  <select
                    value={newProdId}
                    onChange={(e) => setNewProdId(e.target.value)}
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
                  <label className="text-slate-400 block mb-1 font-semibold">Tipo de Acontecimiento</label>
                  <select
                    value={commentCategory}
                    onChange={(e) => setCommentCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="comentario">💬 Comentario / Nota del Fundador</option>
                    <option value="cambio_precio">💰 Cambio de Precio / Ajuste Comercial</option>
                    <option value="milestone_completado">🚩 Milestone Alcanzado</option>
                    <option value="etapa_cambiada">🔄 Transición de Etapa</option>
                    <option value="producto_creado">🚀 Anuncio de Producto</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Detalle del Acontecimiento *</label>
                  <textarea
                    rows={4}
                    required
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Describe qué ocurrió, la decisión tomada o el hito alcanzado..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowLogModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                  >
                    Publicar Evento
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleCreateCRMActivity} className="space-y-3 text-xs text-slate-300">
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Producto SaaS</label>
                  <select
                    value={newProdId}
                    onChange={(e) => setNewProdId(e.target.value)}
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
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as CRMActivityType)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    {(['Llamada', 'WhatsApp', 'Email', 'Reunión', 'Demo', 'Seguimiento', 'Nota'] as CRMActivityType[]).map(
                      (t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Contacto / Institución</label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Ej: Lic. Carmen Rosario"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Descripción *</label>
                  <textarea
                    rows={3}
                    required
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    placeholder="Resumen de la conversación o acuerdo..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Resultado / Siguiente Paso</label>
                  <input
                    type="text"
                    value={outcome}
                    onChange={(e) => setOutcome(e.target.value)}
                    placeholder="Ej: Aprobación formal de compra"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowLogModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                  >
                    Guardar
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
