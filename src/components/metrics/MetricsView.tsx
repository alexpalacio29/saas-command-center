import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import {
  BarChart3,
  DollarSign,
  TrendingUp,
  Users,
  Target,
  Layers,
  ArrowUpRight,
  ShieldAlert,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#06b6d4', '#ec4899', '#8b5cf6'];

export const MetricsView: React.FC = () => {
  const { products, leads, customers, tasks } = useApp();

  // SECTION 21: Financial metrics per product (Distinguishing Revenue from Recurring Revenue)
  const financialData = products.map((p) => ({
    name: p.name,
    mrr: p.financials.mrr,
    arr: p.financials.arr,
    ingresosMensuales: p.financials.monthlyRevenue,
    ingresosAnuales: p.financials.annualRevenue,
    costos: p.financials.monthlyCosts,
    beneficioEstimado: p.financials.estimatedProfitMonthly,
    nonRecurring: p.financials.nonRecurringMonthly,
  }));

  const totalMRR = products.reduce((acc, p) => acc + (p.financials.mrr || 0), 0);
  const totalMonthlyGrossRevenue = products.reduce(
    (acc, p) => acc + (p.financials.monthlyRevenue || 0),
    0
  );
  const totalMonthlyCosts = products.reduce(
    (acc, p) => acc + (p.financials.monthlyCosts || 0),
    0
  );
  const totalMonthlyProfit = totalMonthlyGrossRevenue - totalMonthlyCosts;
  const totalARR = totalMRR * 12;
  const totalAnnualGrossRevenue = totalMonthlyGrossRevenue * 12;

  // Pipeline Funnel data
  const funnelStages = [
    'LEAD',
    'CONTACTADO',
    'INTERESADO',
    'DEMO',
    'PRUEBA',
    'NEGOCIACIÓN',
    'CLIENTE',
  ];
  const funnelData = funnelStages.map((stage) => {
    const count = leads.filter((l) => l.status === stage).length;
    const value = leads
      .filter((l) => l.status === stage)
      .reduce((acc, l) => acc + (l.estimatedValue || 0), 0);
    return {
      stage,
      prospectos: count,
      valor: value,
    };
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-in fade-in">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-indigo-400" />
          <span>Métricas Financieras & Unit Economics (Sección 21)</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Distinción rigurosa: <strong>Revenue Total</strong> vs <strong>Recurring Revenue (MRR)</strong>, costos de infraestructura y beneficio neto
        </p>
      </div>

      {/* Top 4 Financial Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase block mb-1">
            MRR Recurrente
          </span>
          <span className="text-2xl font-bold font-mono text-emerald-400">
            ${totalMRR.toLocaleString()}
          </span>
          <span className="text-[10px] text-slate-500 block mt-1">ARR: ${totalARR.toLocaleString()}</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase block mb-1">
            Revenue Mensual Total
          </span>
          <span className="text-2xl font-bold font-mono text-white">
            ${totalMonthlyGrossRevenue.toLocaleString()}
          </span>
          <span className="text-[10px] text-slate-400 block mt-1">
            Anualizado: ${totalAnnualGrossRevenue.toLocaleString()}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase block mb-1">
            Costos Operativos Mes
          </span>
          <span className="text-2xl font-bold font-mono text-red-400">
            ${totalMonthlyCosts.toLocaleString()}
          </span>
          <span className="text-[10px] text-slate-500 block mt-1">Servidores, APIs y hosting</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase block mb-1">
            Beneficio Estimado Mes
          </span>
          <span className="text-2xl font-bold font-mono text-emerald-400">
            ${totalMonthlyProfit.toLocaleString()}
          </span>
          <span className="text-[10px] text-slate-400 block mt-1">
            Margen: {Math.round((totalMonthlyProfit / (totalMonthlyGrossRevenue || 1)) * 100)}%
          </span>
        </div>
      </div>

      {/* CHART: Revenue vs Costos vs Beneficio por Producto */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Ingresos Mensuales vs Costos vs Beneficio por Producto SaaS
            </h3>
            <p className="text-xs text-slate-400">
              No asumir MRR = Ingresos Totales. Comparativa financiera completa en USD
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400">
            Margen Neto: ${totalMonthlyProfit.toLocaleString()} / mes
          </span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={financialData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#090d16',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                }}
                formatter={(val: any, name: any) => [
                  `$${Number(val).toLocaleString()} USD`,
                  name === 'ingresosMensuales'
                    ? 'Ingresos Totales Mes'
                    : name === 'costos'
                    ? 'Costos Operativos'
                    : name === 'beneficioEstimado'
                    ? 'Beneficio Estimado'
                    : name === 'mrr'
                    ? 'MRR Recurrente'
                    : name,
                ]}
              />
              <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
              <Bar dataKey="ingresosMensuales" fill="#6366f1" name="Ingresos Totales" radius={[6, 6, 0, 0]} />
              <Bar dataKey="mrr" fill="#06b6d4" name="MRR Recurrente" radius={[6, 6, 0, 0]} />
              <Bar dataKey="costos" fill="#ef4444" name="Costos" radius={[6, 6, 0, 0]} />
              <Bar dataKey="beneficioEstimado" fill="#10b981" name="Beneficio Neto" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* TABLE: DETALLE FINANCIERO POR PRODUCTO */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-md space-y-4">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Detalle Contable del Portafolio
          </h3>
          <p className="text-xs text-slate-400">
            Valores verificados producto por producto
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800 text-[10px]">
              <tr>
                <th className="py-3 px-4">Producto</th>
                <th className="py-3 px-4">MRR Recurrente</th>
                <th className="py-3 px-4">ARR Anualizado</th>
                <th className="py-3 px-4">No Recurrente Mes</th>
                <th className="py-3 px-4">Ingresos Totales Mes</th>
                <th className="py-3 px-4">Costos Mes</th>
                <th className="py-3 px-4">Beneficio Estimado</th>
                <th className="py-3 px-4">Margen %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {financialData.map((f) => {
                const margin = Math.round((f.beneficioEstimado / (f.ingresosMensuales || 1)) * 100);
                return (
                  <tr key={f.name} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 font-bold text-white font-sans">{f.name}</td>
                    <td className="py-3 px-4 text-emerald-400">${f.mrr.toLocaleString()}</td>
                    <td className="py-3 px-4 text-slate-300">${f.arr.toLocaleString()}</td>
                    <td className="py-3 px-4 text-slate-400">${f.nonRecurring}</td>
                    <td className="py-3 px-4 font-bold text-white">${f.ingresosMensuales.toLocaleString()}</td>
                    <td className="py-3 px-4 text-red-400">${f.costos}</td>
                    <td className="py-3 px-4 font-bold text-emerald-400">${f.beneficioEstimado}</td>
                    <td className="py-3 px-4 text-indigo-300">{margin}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* PIPELINE CONVERSION FUNNEL */}
      <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-md space-y-4">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Embudo de Conversión CRM
          </h3>
          <p className="text-xs text-slate-400">
            Prospectos por etapa de madurez comercial
          </p>
        </div>

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={funnelData} layout="vertical" margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
              <XAxis type="number" stroke="#64748b" fontSize={10} />
              <YAxis dataKey="stage" type="category" stroke="#64748b" fontSize={10} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#090d16',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '11px',
                }}
              />
              <Bar dataKey="prospectos" fill="#06b6d4" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
