import React, { useState } from 'react';
import {
  Users,
  Plus,
  DollarSign,
  CreditCard,
  Building,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock,
  Layers,
  Search,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Customer, CustomerStatus, Subscription, SubscriptionBillingCycle } from '../../types';

export const CustomersView: React.FC = () => {
  const {
    customers,
    subscriptions,
    products,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    addSubscription,
    searchQuery,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'customers' | 'subscriptions'>('customers');
  const [showNewCustomerModal, setShowNewCustomerModal] = useState(false);
  const [showNewSubModal, setShowNewSubModal] = useState(false);

  // New Customer form
  const [newCust, setNewCust] = useState<Omit<Customer, 'id' | 'organizationId'>>({
    name: '',
    company: '',
    contactPerson: '',
    email: '',
    phone: '',
    productIds: [products[0]?.id || ''],
    plan: 'Plan Profesional Mensual',
    startDate: new Date().toISOString().split('T')[0],
    status: 'Activo',
    mrr: 99,
    notes: '',
  });

  // New Subscription form
  const [newSub, setNewSub] = useState<Omit<Subscription, 'id' | 'organizationId'>>({
    customerId: customers[0]?.id || '',
    productId: products[0]?.id || '',
    planName: 'Plan Pro',
    price: 99,
    frequency: 'mensual',
    startDate: new Date().toISOString().split('T')[0],
    renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'Activa',
  });

  const filteredCustomers = customers.filter((c) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalMRRFromCustomers = customers.reduce((acc, c) => acc + (c.mrr || 0), 0);

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCust.name) return;
    addCustomer(newCust);
    setShowNewCustomerModal(false);
  };

  const handleCreateSubscription = (e: React.FormEvent) => {
    e.preventDefault();
    addSubscription(newSub);
    setShowNewSubModal(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-400" />
            <span>Gestión de Clientes & Suscripciones</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Cuentas multi-producto y facturación recurrente total:{' '}
            <strong className="text-emerald-400 font-mono">${totalMRRFromCustomers.toLocaleString()} MRR</strong>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
            <button
              onClick={() => setActiveSubTab('customers')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                activeSubTab === 'customers'
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Clientes ({customers.length})
            </button>
            <button
              onClick={() => setActiveSubTab('subscriptions')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                activeSubTab === 'subscriptions'
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Suscripciones ({subscriptions.length})
            </button>
          </div>

          <button
            onClick={() =>
              activeSubTab === 'customers'
                ? setShowNewCustomerModal(true)
                : setShowNewSubModal(true)
            }
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/20 flex items-center gap-2 transition"
          >
            <Plus className="w-4 h-4" />
            <span>{activeSubTab === 'customers' ? 'Nuevo Cliente' : 'Nueva Suscripción'}</span>
          </button>
        </div>
      </div>

      {/* CUSTOMERS LIST VIEW */}
      {activeSubTab === 'customers' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCustomers.map((cust) => {
              const statusBadge = {
                Activo: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
                Trial: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
                Suspendido: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
                Cancelado: 'bg-red-500/10 text-red-300 border-red-500/20',
              }[cust.status];

              const associatedProducts = products.filter((p) => cust.productIds.includes(p.id));

              return (
                <div
                  key={cust.id}
                  className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md space-y-3 text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-white text-base">{cust.name}</h3>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${statusBadge}`}>
                          {cust.status}
                        </span>
                      </div>
                      <div className="text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <Building className="w-3.5 h-3.5" />
                        <span>{cust.company}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-bold font-mono text-emerald-400 block">
                        ${cust.mrr}
                      </span>
                      <span className="text-[10px] text-slate-500 uppercase">MRR</span>
                    </div>
                  </div>

                  {/* Multi-product badges (Required by Section 19) */}
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold block mb-1">
                      Productos Contratados:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {associatedProducts.map((p) => (
                        <span
                          key={p.id}
                          className="px-2 py-0.5 rounded-lg bg-indigo-950/70 border border-indigo-800/60 text-indigo-300 text-[11px] font-semibold"
                        >
                          {p.name}
                        </span>
                      ))}
                      {associatedProducts.length === 0 && (
                        <span className="text-slate-500 italic">Ninguno asignado</span>
                      )}
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1 text-slate-300">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Contacto:</span>
                      <span className="text-white font-medium">{cust.contactPerson}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Email:</span>
                      <span className="text-slate-300 font-mono">{cust.email}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Teléfono:</span>
                      <span className="text-slate-300 font-mono">{cust.phone}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Inicio de Contrato:</span>
                      <span className="text-slate-300 font-mono">{cust.startDate}</span>
                    </div>
                  </div>

                  {cust.notes && (
                    <p className="text-[11px] text-slate-400 italic bg-slate-950/40 p-2 rounded-lg">
                      "{cust.notes}"
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUBSCRIPTIONS TABLE (Section 20: Prepared for Stripe) */}
      {activeSubTab === 'subscriptions' && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800 text-[10px]">
                <tr>
                  <th className="py-3 px-4">Cliente</th>
                  <th className="py-3 px-4">Producto SaaS</th>
                  <th className="py-3 px-4">Plan</th>
                  <th className="py-3 px-4">Precio</th>
                  <th className="py-3 px-4">Frecuencia</th>
                  <th className="py-3 px-4">Renovación</th>
                  <th className="py-3 px-4">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {subscriptions.map((sub) => {
                  const client = customers.find((c) => c.id === sub.customerId);
                  const prod = products.find((p) => p.id === sub.productId);

                  return (
                    <tr key={sub.id} className="hover:bg-slate-800/50 transition">
                      <td className="py-3.5 px-4 font-bold text-white whitespace-nowrap">
                        {client?.name || 'Cliente desconocido'}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap text-indigo-300 font-medium">
                        {prod?.name || 'SaaS'}
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">{sub.planName}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-400">
                        ${sub.price}
                      </td>
                      <td className="py-3.5 px-4 uppercase text-[10px] font-semibold text-slate-400">
                        {sub.frequency}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-300">{sub.renewalDate}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {sub.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* NEW CUSTOMER MODAL */}
      {showNewCustomerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100 space-y-4 my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">Registrar Nuevo Cliente</h3>
              <button onClick={() => setShowNewCustomerModal(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="space-y-3 text-xs text-slate-300">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Nombre Institución/Cliente *</label>
                  <input
                    type="text"
                    required
                    value={newCust.name}
                    onChange={(e) => setNewCust({ ...newCust, name: e.target.value })}
                    placeholder="Ej: Colegio San Agustín"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Razón Social / Empresa</label>
                  <input
                    type="text"
                    value={newCust.company}
                    onChange={(e) => setNewCust({ ...newCust, company: e.target.value })}
                    placeholder="Ej: Inversiones Educativas SRL"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Persona de Contacto</label>
                  <input
                    type="text"
                    value={newCust.contactPerson}
                    onChange={(e) => setNewCust({ ...newCust, contactPerson: e.target.value })}
                    placeholder="Ej: Lic. María Durán"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">MRR Asignado ($)</label>
                  <input
                    type="number"
                    value={newCust.mrr}
                    onChange={(e) => setNewCust({ ...newCust, mrr: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Email</label>
                  <input
                    type="email"
                    value={newCust.email}
                    onChange={(e) => setNewCust({ ...newCust, email: e.target.value })}
                    placeholder="admin@colegio.edu.do"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Teléfono</label>
                  <input
                    type="text"
                    value={newCust.phone}
                    onChange={(e) => setNewCust({ ...newCust, phone: e.target.value })}
                    placeholder="8095551234"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Productos Contratados</label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {products.map((p) => {
                    const isSelected = newCust.productIds.includes(p.id);
                    return (
                      <button
                        type="button"
                        key={p.id}
                        onClick={() => {
                          if (isSelected) {
                            setNewCust({
                              ...newCust,
                              productIds: newCust.productIds.filter((id) => id !== p.id),
                            });
                          } else {
                            setNewCust({
                              ...newCust,
                              productIds: [...newCust.productIds, p.id],
                            });
                          }
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-500'
                            : 'bg-slate-950 text-slate-400 border-slate-800'
                        }`}
                      >
                        {p.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewCustomerModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                >
                  Guardar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NEW SUBSCRIPTION MODAL */}
      {showNewSubModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">Crear Nueva Suscripción</h3>
              <button onClick={() => setShowNewSubModal(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubscription} className="space-y-3 text-xs text-slate-300">
              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Cliente</label>
                <select
                  value={newSub.customerId}
                  onChange={(e) => setNewSub({ ...newSub, customerId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Producto SaaS</label>
                <select
                  value={newSub.productId}
                  onChange={(e) => setNewSub({ ...newSub, productId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
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
                  <label className="text-slate-400 block mb-1 font-semibold">Nombre del Plan</label>
                  <input
                    type="text"
                    value={newSub.planName}
                    onChange={(e) => setNewSub({ ...newSub, planName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Precio ($ USD)</label>
                  <input
                    type="number"
                    value={newSub.price}
                    onChange={(e) => setNewSub({ ...newSub, price: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Frecuencia de Facturación</label>
                <select
                  value={newSub.frequency}
                  onChange={(e) => setNewSub({ ...newSub, frequency: e.target.value as SubscriptionBillingCycle })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  <option value="mensual">Mensual</option>
                  <option value="anual">Anual</option>
                  <option value="único">Único / One-off</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewSubModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                >
                  Activar Suscripción
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
