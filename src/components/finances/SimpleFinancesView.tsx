import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Edit2,
  Check,
  X,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SaaSProduct } from '../../types';

export const SimpleFinancesView: React.FC = () => {
  const { products, updateProductFinancialsQuick, customers } = useApp();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editMrr, setEditMrr] = useState<number>(0);
  const [editCosts, setEditCosts] = useState<number>(0);

  // Totales
  const totalMrr = products.reduce((acc, p) => acc + (p.mrr || 0), 0);
  const totalCosts = products.reduce((acc, p) => acc + (p.financials?.monthlyCosts || 0), 0);
  const totalProfit = totalMrr - totalCosts;
  const arr = totalMrr * 12;
  const profitMarginPercent = totalMrr > 0 ? Math.round((totalProfit / totalMrr) * 100) : 0;

  const startEdit = (p: SaaSProduct) => {
    setEditingId(p.id);
    setEditMrr(p.mrr || 0);
    setEditCosts(p.financials?.monthlyCosts || 0);
  };

  const saveEdit = (productId: string) => {
    updateProductFinancialsQuick(productId, editMrr, editCosts);
    setEditingId(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <DollarSign className="w-5 h-5" />
            </span>
            Finanzas por Proyecto
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Control de ingresos recurrentes (MRR), costos fijos de infraestructura y margen neto de cada SaaS.
          </p>
        </div>
      </div>

      {/* KPI Cards Globales */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* MRR Total */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            MRR Total (Recurrente)
          </span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400">
            ${totalMrr.toLocaleString()}
            <span className="text-xs font-normal text-slate-500"> /mes</span>
          </div>
          <span className="text-[11px] text-slate-400 block pt-1">
            Facturación mensual activa de todos tus SaaS
          </span>
        </div>

        {/* Costos Fijos */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-red-400 flex items-center gap-1">
            <ArrowDownRight className="w-3.5 h-3.5" />
            Costos Fijos Totales
          </span>
          <div className="text-2xl sm:text-3xl font-black text-red-400">
            ${totalCosts.toLocaleString()}
            <span className="text-xs font-normal text-slate-500"> /mes</span>
          </div>
          <span className="text-[11px] text-slate-400 block pt-1">
            Servidores, APIs, dominios y licencias
          </span>
        </div>

        {/* Margen Neto */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            Beneficio Neto Mensual
          </span>
          <div className="text-2xl sm:text-3xl font-black text-white">
            ${totalProfit.toLocaleString()}
            <span className="text-xs font-normal text-slate-500"> ({profitMarginPercent}%)</span>
          </div>
          <span className="text-[11px] text-slate-400 block pt-1">
            Lo que te queda limpio en mano cada mes
          </span>
        </div>

        {/* ARR */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1">
            <CreditCard className="w-3.5 h-3.5" />
            Proyección Anual (ARR)
          </span>
          <div className="text-2xl sm:text-3xl font-black text-white">
            ${arr.toLocaleString()}
            <span className="text-xs font-normal text-slate-500"> /año</span>
          </div>
          <span className="text-[11px] text-slate-400 block pt-1">
            MRR proyectado a 12 meses
          </span>
        </div>
      </div>

      {/* Tabla Financiera de Proyectos */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <span>Desglose por Proyecto</span>
          </h2>
          <span className="text-xs text-slate-500">
            Haz clic en "Editar" para actualizar MRR o gastos en cualquier momento
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="pb-3 px-3">SaaS</th>
                <th className="pb-3 px-3">Clientes</th>
                <th className="pb-3 px-3">MRR Mensual</th>
                <th className="pb-3 px-3">Costos Mensuales</th>
                <th className="pb-3 px-3">Margen Neto</th>
                <th className="pb-3 px-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {products.map((product) => {
                const isEditing = editingId === product.id;
                const mrr = product.mrr || 0;
                const costs = product.financials?.monthlyCosts || 0;
                const profit = mrr - costs;
                const clientCount = customers.filter(
                  (c) => c.productIds.includes(product.id) && c.status === 'Activo'
                ).length;

                return (
                  <tr key={product.id} className="hover:bg-slate-850/50 transition">
                    <td className="py-3 px-3 font-semibold text-white">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-300 font-bold flex items-center justify-center border border-indigo-500/30 text-xs">
                          {product.name.charAt(0)}
                        </div>
                        <div>
                          <span>{product.name}</span>
                          <span className="text-[10px] text-slate-400 block font-normal">
                            {product.shortDescription}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-slate-300">
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-[11px] font-bold">
                        {clientCount} activos
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      {isEditing ? (
                        <div className="flex items-center gap-1">
                          <span className="text-slate-400">$</span>
                          <input
                            type="number"
                            min="0"
                            value={editMrr}
                            onChange={(e) => setEditMrr(Number(e.target.value))}
                            className="w-24 bg-slate-950 border border-indigo-500 rounded px-2 py-1 text-xs text-white"
                          />
                        </div>
                      ) : (
                        <span className="font-bold text-emerald-400 text-sm">
                          ${mrr.toLocaleString()}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-3">
                      {isEditing ? (
                        <div className="flex items-center gap-1">
                          <span className="text-slate-400">$</span>
                          <input
                            type="number"
                            min="0"
                            value={editCosts}
                            onChange={(e) => setEditCosts(Number(e.target.value))}
                            className="w-24 bg-slate-950 border border-red-500 rounded px-2 py-1 text-xs text-white"
                          />
                        </div>
                      ) : (
                        <span className="font-semibold text-red-400">
                          ${costs.toLocaleString()}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={`font-bold text-sm ${
                          profit >= 0 ? 'text-white' : 'text-red-400'
                        }`}
                      >
                        ${profit.toLocaleString()}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right">
                      {isEditing ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => saveEdit(product.id)}
                            className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition"
                            title="Guardar"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 transition"
                            title="Cancelar"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEdit(product)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 ml-auto transition"
                        >
                          <Edit2 className="w-3 h-3 text-indigo-400" />
                          <span>Editar</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
