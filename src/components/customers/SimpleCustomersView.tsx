import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  FileSpreadsheet,
  CheckCircle,
  ArrowRight,
  Trash2,
  Mail,
  Phone,
  Building,
  DollarSign,
  Plus,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Customer, Lead } from '../../types';

export const SimpleCustomersView: React.FC = () => {
  const {
    customers,
    addCustomer,
    deleteCustomer,
    leads,
    deleteLead,
    products,
    importLeadsBatch,
    convertLeadToCustomer,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'active' | 'leads'>('active');
  const [selectedProductFilter, setSelectedProductFilter] = useState<string>('all');

  // Modal Pegar Lista de Prospectos
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [batchText, setBatchText] = useState('');
  const [targetProdId, setTargetProdId] = useState(products[0]?.id || '');
  const [importCountMessage, setImportCountMessage] = useState<string | null>(null);

  // Modal Nuevo Cliente Activo Manual
  const [isAddCustModalOpen, setIsAddCustModalOpen] = useState(false);
  const [custName, setCustName] = useState('');
  const [custCompany, setCustCompany] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custProdId, setCustProdId] = useState(products[0]?.id || '');
  const [custMrr, setCustMrr] = useState(100);
  const [custPlan, setCustPlan] = useState('Plan Estándar');

  // Modal Convertir Lead a Cliente
  const [leadToConvert, setLeadToConvert] = useState<Lead | null>(null);
  const [convertPlan, setConvertPlan] = useState('Plan Estándar');
  const [convertAmount, setConvertAmount] = useState(100);

  // Filtrado
  const filteredCustomers = customers.filter((c) => {
    if (selectedProductFilter === 'all') return true;
    return c.productIds.includes(selectedProductFilter);
  });

  const activeLeads = leads.filter(
    (l) => l.status !== 'CLIENTE' && l.status !== 'PERDIDO'
  );
  const filteredLeads = activeLeads.filter((l) => {
    if (selectedProductFilter === 'all') return true;
    return l.productId === selectedProductFilter;
  });

  const handleImportBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchText.trim()) return;

    const count = importLeadsBatch(batchText, targetProdId);
    setImportCountMessage(`✅ ¡${count} prospectos agregados exitosamente!`);
    setTimeout(() => {
      setImportCountMessage(null);
      setIsImportModalOpen(false);
      setBatchText('');
      setActiveSubTab('leads');
    }, 1200);
  };

  const handleCreateCustomerManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName.trim()) return;

    addCustomer({
      name: custName.trim(),
      company: custCompany.trim() || custName.trim(),
      contactPerson: custName.trim(),
      email: custEmail.trim(),
      phone: custPhone.trim(),
      productIds: [custProdId],
      plan: custPlan,
      startDate: new Date().toISOString().split('T')[0],
      status: 'Activo',
      mrr: custMrr,
      notes: 'Cliente registrado manualmente',
    });

    setIsAddCustModalOpen(false);
    setCustName('');
    setCustCompany('');
    setCustEmail('');
    setCustPhone('');
    setCustMrr(100);
  };

  const handleExecuteConvert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadToConvert) return;

    convertLeadToCustomer(leadToConvert.id, convertPlan, convertAmount);
    setLeadToConvert(null);
    setActiveSubTab('active');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <Users className="w-5 h-5" />
            </span>
            Clientes Activos & Posibles Clientes
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Gestiona quiénes pagan tu suscripción y carga listas masivas de personas a contactar.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>📥 Pegar Lista Rápida</span>
          </button>

          <button
            onClick={() => setIsAddCustModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Cliente Activo</span>
          </button>
        </div>
      </div>

      {/* Tabs Switcher & Filtro por SaaS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('active')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeSubTab === 'active'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <span>Clientes Activos</span>
            <span className="px-2 py-0.5 rounded-full bg-black/30 text-[10px]">
              {filteredCustomers.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('leads')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeSubTab === 'leads'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <span>Posibles Clientes (Prospectos)</span>
            <span className="px-2 py-0.5 rounded-full bg-black/30 text-[10px]">
              {filteredLeads.length}
            </span>
          </button>
        </div>

        {/* Filtro por Producto */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-semibold">Filtrar por SaaS:</span>
          <select
            value={selectedProductFilter}
            onChange={(e) => setSelectedProductFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="all">Todos los SaaS</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* TAB 1: CLIENTES ACTIVOS */}
      {activeSubTab === 'active' && (
        <div className="space-y-3">
          {filteredCustomers.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 text-xs">
              No hay clientes activos en este filtro. Agrega uno o convierte un prospecto.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredCustomers.map((cust) => {
                const assignedProds = products.filter((p) =>
                  cust.productIds.includes(p.id)
                );

                return (
                  <div
                    key={cust.id}
                    className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h2 className="text-sm font-bold text-white">{cust.name}</h2>
                        {cust.company && cust.company !== cust.name && (
                          <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                            <Building className="w-3 h-3 text-slate-500" />
                            {cust.company}
                          </span>
                        )}
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        ${cust.mrr || 0}/mes
                      </span>
                    </div>

                    <div className="text-xs text-slate-400 space-y-1">
                      {cust.email && (
                        <div className="flex items-center gap-1.5 truncate">
                          <Mail className="w-3 h-3 text-slate-500 shrink-0" />
                          <span>{cust.email}</span>
                        </div>
                      )}
                      {cust.phone && (
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3 h-3 text-slate-500 shrink-0" />
                          <span>{cust.phone}</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-850 flex items-center justify-between text-[11px]">
                      <div className="flex flex-wrap gap-1">
                        {assignedProds.map((p) => (
                          <span
                            key={p.id}
                            className="px-2 py-0.5 rounded-md bg-indigo-500/15 text-indigo-300 font-semibold"
                          >
                            {p.name}
                          </span>
                        ))}
                      </div>

                      <button
                        onClick={() => {
                          if (confirm(`¿Eliminar cliente ${cust.name}?`)) {
                            deleteCustomer(cust.id);
                          }
                        }}
                        className="p-1 rounded text-slate-500 hover:text-red-400 transition"
                        title="Eliminar cliente"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: POSIBLES CLIENTES (PROSPECTOS / LEADS) */}
      {activeSubTab === 'leads' && (
        <div className="space-y-3">
          {filteredLeads.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 text-xs space-y-3">
              <p>No tienes prospectos registrados para este filtro.</p>
              <button
                onClick={() => setIsImportModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs inline-flex items-center gap-1.5"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Pegar una lista ahora</span>
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl bg-slate-900 border border-slate-800">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Contacto / Empresa</th>
                    <th className="py-3 px-3">SaaS de Interés</th>
                    <th className="py-3 px-3">Datos de Contacto</th>
                    <th className="py-3 px-3">Notas</th>
                    <th className="py-3 px-4 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {filteredLeads.map((lead) => {
                    const prod = products.find((p) => p.id === lead.productId);

                    return (
                      <tr key={lead.id} className="hover:bg-slate-850/50 transition">
                        <td className="py-3 px-4">
                          <span className="font-bold text-white block">{lead.name}</span>
                          {lead.institutionOrCompany && lead.institutionOrCompany !== lead.name && (
                            <span className="text-[11px] text-slate-400">
                              {lead.institutionOrCompany}
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 font-semibold text-[11px]">
                            {prod?.name || 'SaaS'}
                          </span>
                        </td>

                        <td className="py-3 px-3 text-slate-300">
                          {lead.email && <div className="truncate max-w-[180px]">{lead.email}</div>}
                          {lead.phone && <div className="text-slate-400">{lead.phone}</div>}
                        </td>

                        <td className="py-3 px-3 text-slate-400 max-w-[200px] truncate">
                          {lead.notes || '—'}
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setLeadToConvert(lead);
                                setConvertAmount(100);
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 transition shadow-sm"
                              title="Marcar como ganado y convertir en cliente pagando"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Convertir a Cliente</span>
                            </button>

                            <button
                              onClick={() => {
                                if (confirm(`¿Eliminar prospecto ${lead.name}?`)) {
                                  deleteLead(lead.id);
                                }
                              }}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition"
                              title="Descartar prospecto"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* MODAL: PEGAR LISTA RÁPIDA DE PROSPECTOS */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-blue-400" />
                <span>Importador Rápido: Pegar Lista de Prospectos</span>
              </h3>
            </div>

            <p className="text-xs text-slate-400">
              Pega cualquier lista de texto o CSV. Puedes poner una persona o empresa por línea, o separar por comas:
              <br />
              <code className="text-indigo-300 text-[11px] block mt-1 bg-slate-950 p-2 rounded-lg border border-slate-800">
                Colegio Santa Rosa, Lic. Gómez, director@santarosa.edu, 809-555-0100
                <br />
                Clínica Dental Moderna, Dr. Carlos, 829-555-0200
                <br />
                Distribuidora Juan, Oficina Central
              </code>
            </p>

            <form onSubmit={handleImportBatch} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  ¿A qué SaaS pertenecen estos posibles clientes?
                </label>
                <select
                  value={targetProdId}
                  onChange={(e) => setTargetProdId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Pega aquí la lista de contactos *
                </label>
                <textarea
                  required
                  rows={6}
                  placeholder="Pega aquí los nombres, correos o números telefónicos..."
                  value={batchText}
                  onChange={(e) => setBatchText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white font-mono placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {importCountMessage && (
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold text-center">
                  {importCountMessage}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 transition shadow-sm"
                >
                  Procesar e Importar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: NUEVO CLIENTE ACTIVO MANUAL */}
      {isAddCustModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-indigo-400" />
              <span>Registrar Cliente Activo</span>
            </h3>

            <form onSubmit={handleCreateCustomerManual} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Nombre o Contacto *</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Lic. Pedro Martínez"
                  value={custName}
                  onChange={(e) => setCustName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Empresa / Institución</label>
                <input
                  type="text"
                  placeholder="ej. Colegio ABC / Clínica Dental"
                  value={custCompany}
                  onChange={(e) => setCustCompany(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="cliente@correo.com"
                    value={custEmail}
                    onChange={(e) => setCustEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Teléfono</label>
                  <input
                    type="text"
                    placeholder="809-555-0100"
                    value={custPhone}
                    onChange={(e) => setCustPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">SaaS Asignado</label>
                <select
                  value={custProdId}
                  onChange={(e) => setCustProdId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Plan</label>
                  <input
                    type="text"
                    value={custPlan}
                    onChange={(e) => setCustPlan(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Pago Mensual ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={custMrr}
                    onChange={(e) => setCustMrr(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddCustModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 transition shadow-sm"
                >
                  Guardar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CONVERTIR PROSPECTO EN CLIENTE */}
      {leadToConvert && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span>Convertir a Cliente Activo</span>
            </h3>

            <p className="text-xs text-slate-300">
              Estás cerrando el trato con: <strong className="text-white">{leadToConvert.name}</strong>
            </p>

            <form onSubmit={handleExecuteConvert} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Nombre del Plan</label>
                <input
                  type="text"
                  value={convertPlan}
                  onChange={(e) => setConvertPlan(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Monto Mensual a Cobrar ($ MRR)
                </label>
                <input
                  type="number"
                  min="1"
                  value={convertAmount}
                  onChange={(e) => setConvertAmount(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400">
                Este monto se sumará automáticamente al MRR del SaaS correspondiente.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setLeadToConvert(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition shadow-sm"
                >
                  🎉 Activar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
