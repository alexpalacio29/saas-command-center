import React, { useState } from 'react';
import {
  Kanban,
  Plus,
  Phone,
  MessageSquare,
  Mail,
  Calendar,
  DollarSign,
  ChevronRight,
  Filter,
  Search,
  Users,
  CheckCircle2,
  Clock,
  FileText,
  Video,
  List,
  Target,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Lead, LeadStatus, CRMActivityType } from '../../types';

const PIPELINE_COLUMNS: { status: LeadStatus; label: string; color: string }[] = [
  { status: 'LEAD', label: 'Lead', color: 'border-slate-700 bg-slate-900/60' },
  { status: 'CONTACTADO', label: 'Contactado', color: 'border-blue-900/60 bg-blue-950/20' },
  { status: 'INTERESADO', label: 'Interesado', color: 'border-cyan-900/60 bg-cyan-950/20' },
  { status: 'DEMO', label: 'Demo', color: 'border-indigo-900/60 bg-indigo-950/20' },
  { status: 'PRUEBA', label: 'Prueba Piloto', color: 'border-purple-900/60 bg-purple-950/20' },
  { status: 'NEGOCIACIÓN', label: 'Negociación', color: 'border-amber-900/60 bg-amber-950/20' },
  { status: 'CLIENTE', label: 'Cliente Ganado', color: 'border-emerald-900/60 bg-emerald-950/20' },
  { status: 'PERDIDO', label: 'Perdido', color: 'border-red-900/60 bg-red-950/20' },
];

export const PipelineView: React.FC = () => {
  const {
    leads,
    products,
    addLead,
    updateLead,
    updateLeadStatus,
    deleteLead,
    activities,
    addActivity,
    currentUser,
    searchQuery,
  } = useApp();

  const [selectedProductFilter, setSelectedProductFilter] = useState<string>('ALL');
  const [showNewLeadModal, setShowNewLeadModal] = useState(false);
  const [activeLeadForActivity, setActiveLeadForActivity] = useState<Lead | null>(null);

  // New Lead form state
  const [newLeadData, setNewLeadData] = useState<Omit<Lead, 'id' | 'createdAt' | 'organizationId'>>({
    name: '',
    institutionOrCompany: '',
    email: '',
    phone: '',
    whatsapp: '',
    productId: products[0]?.id || '',
    origin: 'Web Landing',
    status: 'LEAD',
    responsible: currentUser.name,
    contactDate: new Date().toISOString().split('T')[0],
    nextFollowUpDate: new Date().toISOString().split('T')[0],
    estimatedValue: 100,
    notes: '',
  });

  // Activity logger state
  const [activityType, setActivityType] = useState<CRMActivityType>('Llamada');
  const [activityDesc, setActivityDesc] = useState('');
  const [activityResult, setActivityResult] = useState('');

  const filteredLeads = leads.filter((l) => {
    if (selectedProductFilter !== 'ALL' && l.productId !== selectedProductFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        l.name.toLowerCase().includes(q) ||
        l.institutionOrCompany.toLowerCase().includes(q) ||
        l.notes.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadData.name) return;
    addLead(newLeadData);
    setShowNewLeadModal(false);
    setNewLeadData({
      name: '',
      institutionOrCompany: '',
      email: '',
      phone: '',
      whatsapp: '',
      productId: products[0]?.id || '',
      origin: 'Web Landing',
      status: 'LEAD',
      responsible: currentUser.name,
      contactDate: new Date().toISOString().split('T')[0],
      nextFollowUpDate: new Date().toISOString().split('T')[0],
      estimatedValue: 100,
      notes: '',
    });
  };

  const handleLogActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeLeadForActivity || !activityDesc) return;

    addActivity({
      leadId: activeLeadForActivity.id,
      productId: activeLeadForActivity.productId,
      type: activityType,
      userName: currentUser.name,
      contactName: activeLeadForActivity.name,
      description: activityDesc,
      resultOutcome: activityResult,
      date: new Date().toISOString(),
    });

    setActivityDesc('');
    setActivityResult('');
    setActiveLeadForActivity(null);
  };

  const totalPipelineValue = filteredLeads
    .filter((l) => l.status !== 'PERDIDO')
    .reduce((acc, l) => acc + (l.estimatedValue || 0), 0);

  return (
    <div className="space-y-6 max-w-full mx-auto pb-12 animate-in fade-in">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Kanban className="w-6 h-6 text-blue-400" />
            <span>Pipeline CRM de Adquisición</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Embudo comercial unificado para tus {products.length} productos SaaS • Valor en Pipeline:{' '}
            <strong className="text-emerald-400 font-mono">${totalPipelineValue.toLocaleString()}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Product Filter */}
          <select
            value={selectedProductFilter}
            onChange={(e) => setSelectedProductFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
          >
            <option value="ALL">Todos los Productos ({leads.length})</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowNewLeadModal(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/20 flex items-center gap-2 transition shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Lead</span>
          </button>
        </div>
      </div>

      {/* EMPTY STATE */}
      {filteredLeads.length === 0 && (
        <div className="py-16 px-4 text-center rounded-3xl bg-slate-900/60 border border-dashed border-slate-800 space-y-4 max-w-lg mx-auto">
          <div className="h-12 w-12 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center mx-auto">
            <Target className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">No tienes prospectos pendientes</h3>
            <p className="text-xs text-slate-400">
              Registra contactos calificados para iniciar el embudo de ventas hacia demos y conversiones.
            </p>
          </div>
          <button
            onClick={() => setShowNewLeadModal(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/20 inline-flex items-center gap-2 transition"
          >
            <Plus className="w-4 h-4" />
            <span>+ Registrar lead</span>
          </button>
        </div>
      )}

      {/* KANBAN BOARD */}
      {filteredLeads.length > 0 && (
        <div className="overflow-x-auto pb-6">
        <div className="flex gap-4 min-w-[1400px]">
          {PIPELINE_COLUMNS.map((col) => {
            const columnLeads = filteredLeads.filter((l) => l.status === col.status);
            const colTotalValue = columnLeads.reduce((acc, l) => acc + (l.estimatedValue || 0), 0);

            return (
              <div
                key={col.status}
                className={`flex-1 min-w-[240px] max-w-[280px] rounded-2xl border p-3 flex flex-col justify-between ${col.color}`}
              >
                <div>
                  {/* Column Header */}
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800/80">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs tracking-tight">
                        {col.label}
                      </span>
                      <span className="h-5 w-5 rounded-full bg-slate-800 text-[10px] font-bold text-slate-300 flex items-center justify-center">
                        {columnLeads.length}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">
                      ${colTotalValue}
                    </span>
                  </div>

                  {/* Leads Cards */}
                  <div className="space-y-2.5">
                    {columnLeads.map((lead) => {
                      const prod = products.find((p) => p.id === lead.productId);

                      return (
                        <div
                          key={lead.id}
                          className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 shadow-sm hover:border-indigo-500/40 transition text-xs space-y-2"
                        >
                          <div className="flex items-start justify-between gap-1">
                            <div>
                              <h4 className="font-bold text-white text-sm leading-snug">
                                {lead.name}
                              </h4>
                              <div className="text-[11px] text-slate-400 font-medium">
                                {lead.institutionOrCompany}
                              </div>
                            </div>
                            <span className="font-mono text-emerald-400 font-bold text-xs shrink-0">
                              ${lead.estimatedValue}
                            </span>
                          </div>

                          {prod && (
                            <div className="inline-block px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 font-medium">
                              {prod.name}
                            </div>
                          )}

                          {lead.notes && (
                            <p className="text-[11px] text-slate-300 line-clamp-2 italic bg-slate-950/60 p-2 rounded-lg">
                              "{lead.notes}"
                            </p>
                          )}

                          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/60">
                            <span>Próx: {lead.nextFollowUpDate}</span>
                            <div className="flex items-center gap-1.5">
                              {lead.whatsapp && (
                                <a
                                  href={`https://wa.me/${lead.whatsapp.replace(/\D/g, '')}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-emerald-400 hover:text-emerald-300 p-1 rounded hover:bg-slate-800"
                                  title="WhatsApp"
                                >
                                  <MessageSquare className="w-3.5 h-3.5" />
                                </a>
                              )}
                              {lead.email && (
                                <a
                                  href={`mailto:${lead.email}`}
                                  className="text-blue-400 hover:text-blue-300 p-1 rounded hover:bg-slate-800"
                                  title="Email"
                                >
                                  <Mail className="w-3.5 h-3.5" />
                                </a>
                              )}
                            </div>
                          </div>

                          {/* Quick stage mover & activity button */}
                          <div className="pt-2 flex items-center justify-between gap-1">
                            <select
                              value={lead.status}
                              onChange={(e) => updateLeadStatus(lead.id, e.target.value as LeadStatus)}
                              className="bg-slate-950 border border-slate-700 rounded-lg text-[10px] px-1.5 py-1 text-slate-300"
                            >
                              {PIPELINE_COLUMNS.map((c) => (
                                <option key={c.status} value={c.status}>
                                  → {c.label}
                                </option>
                              ))}
                            </select>

                            <button
                              onClick={() => setActiveLeadForActivity(lead)}
                              className="px-2 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 text-[10px] font-semibold border border-indigo-500/30"
                            >
                              + Actividad
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    {columnLeads.length === 0 && (
                      <div className="py-8 text-center text-[11px] text-slate-500 border border-dashed border-slate-800 rounded-xl">
                        Sin prospectos
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      )}

      {/* ACTIVITY LOGGER MODAL */}
      {activeLeadForActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="font-bold text-white text-base">
                  Registrar Actividad de CRM
                </h3>
                <span className="text-xs text-slate-400">
                  {activeLeadForActivity.name} ({activeLeadForActivity.institutionOrCompany})
                </span>
              </div>
              <button
                onClick={() => setActiveLeadForActivity(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleLogActivity} className="space-y-3.5 text-xs text-slate-300">
              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Tipo de Interacción</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['Llamada', 'WhatsApp', 'Email', 'Reunión', 'Demo', 'Seguimiento', 'Nota'] as CRMActivityType[]).map(
                    (t) => (
                      <button
                        type="button"
                        key={t}
                        onClick={() => setActivityType(t)}
                        className={`py-1.5 px-2 rounded-xl text-xs font-semibold border transition ${
                          activityType === t
                            ? 'bg-indigo-600 text-white border-indigo-500'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                        }`}
                      >
                        {t}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Descripción de la interacción *</label>
                <textarea
                  rows={3}
                  required
                  value={activityDesc}
                  onChange={(e) => setActivityDesc(e.target.value)}
                  placeholder="Detalla lo conversado, requerimientos planteados o acuerdos..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Resultado / Próximo paso</label>
                <input
                  type="text"
                  value={activityResult}
                  onChange={(e) => setActivityResult(e.target.value)}
                  placeholder="Ej: Demo programada para el viernes, cotización enviada..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveLeadForActivity(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                >
                  Guardar Actividad
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NEW LEAD MODAL */}
      {showNewLeadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100 space-y-4 my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">Registrar Nuevo Prospecto / Lead</h3>
              <button
                onClick={() => setShowNewLeadModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-3 text-xs text-slate-300">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Nombre del Contacto *</label>
                  <input
                    type="text"
                    required
                    value={newLeadData.name}
                    onChange={(e) => setNewLeadData({ ...newLeadData, name: e.target.value })}
                    placeholder="Ej: Lic. Roberto Valdez"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Empresa / Institución *</label>
                  <input
                    type="text"
                    required
                    value={newLeadData.institutionOrCompany}
                    onChange={(e) =>
                      setNewLeadData({ ...newLeadData, institutionOrCompany: e.target.value })
                    }
                    placeholder="Ej: Colegio San Agustín"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Producto SaaS Objetivo</label>
                  <select
                    value={newLeadData.productId}
                    onChange={(e) => setNewLeadData({ ...newLeadData, productId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.category})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Valor Estimado ($ USD)</label>
                  <input
                    type="number"
                    value={newLeadData.estimatedValue}
                    onChange={(e) =>
                      setNewLeadData({ ...newLeadData, estimatedValue: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Email</label>
                  <input
                    type="email"
                    value={newLeadData.email}
                    onChange={(e) => setNewLeadData({ ...newLeadData, email: e.target.value })}
                    placeholder="contacto@empresa.com"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">WhatsApp / Teléfono</label>
                  <input
                    type="text"
                    value={newLeadData.whatsapp}
                    onChange={(e) =>
                      setNewLeadData({
                        ...newLeadData,
                        whatsapp: e.target.value,
                        phone: e.target.value,
                      })
                    }
                    placeholder="18095551234"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Origen del Lead</label>
                  <input
                    type="text"
                    value={newLeadData.origin}
                    onChange={(e) => setNewLeadData({ ...newLeadData, origin: e.target.value })}
                    placeholder="Ej: Web, LinkedIn, Referido..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Próximo Seguimiento</label>
                  <input
                    type="date"
                    value={newLeadData.nextFollowUpDate}
                    onChange={(e) =>
                      setNewLeadData({ ...newLeadData, nextFollowUpDate: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Notas Iniciales</label>
                <textarea
                  rows={2}
                  value={newLeadData.notes}
                  onChange={(e) => setNewLeadData({ ...newLeadData, notes: e.target.value })}
                  placeholder="Detalles clave sobre la necesidad del cliente..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewLeadModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                >
                  Registrar Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
