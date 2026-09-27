import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import {
  Building2,
  Users,
  DollarSign,
  TrendingUp,
  Percent,
  CheckCircle2,
  ArrowRight,
  Target,
  Sparkles,
  ArrowUpRight,
  ListOrdered,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

// Paleta suave y elegante
const PROJECT_COLORS: Record<string, string> = {
  'prod-edugest': '#818cf8',   // Índigo suave
  'prod-gestify': '#60a5fa',   // Azul suave
  'prod-biblos': '#a78bfa',    // Violeta suave
  'prod-myturn': '#fbbf24',    // Ámbar suave
  'prod-igleconet': '#34d399', // Esmeralda suave
};

const FALLBACK_PALETTE = ['#818cf8', '#60a5fa', '#a78bfa', '#fbbf24', '#34d399', '#f472b6', '#38bdf8'];

export const ExecutiveDashboardView: React.FC = () => {
  const { products, customers, leads, tasks, selectProject } = useApp();

  // Estadísticas consolidadas por proyecto
  const projectStats = products.map((p, idx) => {
    const projectCusts = customers.filter(
      (c) => c.productIds.includes(p.id) && c.status === 'Activo'
    );
    const clientsCount = projectCusts.length > 0 ? projectCusts.length : (p.activeClientsCount || 1);

    const registeredUsers = projectCusts.reduce((acc, c) => acc + (c.usersCount || 0), 0);
    const usersCount = registeredUsers > 0 ? registeredUsers : (p.activeUsersCount || 500);

    const projectLeads = leads.filter(
      (l) => l.productId === p.id && l.status !== 'CLIENTE' && l.status !== 'PERDIDO'
    );
    const leadsCount = projectLeads.length;

    const mrr = p.mrr || 0;
    const costs = p.financials?.monthlyCosts || 0;
    const profit = Math.max(0, mrr - costs);
    const margin = mrr > 0 ? Math.round((profit / mrr) * 100) : 0;
    const color = PROJECT_COLORS[p.id] || FALLBACK_PALETTE[idx % FALLBACK_PALETTE.length];

    // Tareas pendientes ordenadas por prioridad 1 a 10 descendente
    const pendingTasks = tasks
      .filter((t) => t.productId === p.id && t.status !== 'Completada')
      .sort((a, b) => (b.priorityScore || 5) - (a.priorityScore || 5));

    return {
      id: p.id,
      name: p.name,
      stage: p.currentStage,
      clients: clientsCount,
      users: usersCount,
      leads: leadsCount,
      mrr,
      costs,
      profit,
      margin,
      color,
      pendingTasks,
    };
  });

  // Totales Globales
  const totalMrr = projectStats.reduce((acc, p) => acc + p.mrr, 0);
  const totalCosts = projectStats.reduce((acc, p) => acc + p.costs, 0);
  const totalProfit = totalMrr - totalCosts;
  const totalClients = projectStats.reduce((acc, p) => acc + p.clients, 0);
  const totalUsers = projectStats.reduce((acc, p) => acc + p.users, 0);
  const globalMargin = totalMrr > 0 ? Math.round((totalProfit / totalMrr) * 100) : 0;

  // 1. Pastel General de Clientes (Empresas B2B)
  const pieGeneralClients = projectStats.map((p) => ({
    name: p.name,
    value: p.clients,
    color: p.color,
  }));

  // 2. Pastel General de Usuarios Dentro de Clientes
  const pieGeneralUsers = projectStats.map((p) => ({
    name: p.name,
    value: p.users,
    color: p.color,
  }));

  // 3. Pastel General Financiero
  const pieGeneralFinances = [
    { name: 'Ganancia Neta', value: totalProfit, color: '#34d399' },
    { name: 'Gastos Fijos', value: totalCosts, color: '#f87171' },
  ];

  // Tooltip
  const CustomPieTooltip = ({ active, payload, isCurrency = false }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-slate-900/95 border border-slate-700/80 px-3 py-2 rounded-xl shadow-xl backdrop-blur-md text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.payload.color || data.color }} />
            <span className="font-semibold text-white">{data.name}:</span>
            <span className="font-black text-slate-200">
              {isCurrency ? `$${data.value.toLocaleString()}` : data.value.toLocaleString()}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 animate-in fade-in">
      {/* Encabezado Principal Limpio */}
      <div className="flex items-center justify-between pb-1">
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          Panel Ejecutivo
        </h1>
      </div>

      {/* ========================================================================= */}
      {/* 1. SECCIÓN SUPERIOR: RESUMEN GENERAL EN 3 PASTELONES LADO A LADO         */}
      {/* ========================================================================= */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/80 shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* PASTEL 1: CLIENTES (EMPRESAS B2B) */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex flex-col items-center">
            <div className="w-full text-center pb-2 border-b border-slate-850">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 block">
                Clientes (Empresas)
              </span>
            </div>

            <div className="relative w-full h-52 flex items-center justify-center my-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieGeneralClients}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    stroke="#090d16"
                    strokeWidth={2}
                  >
                    {pieGeneralClients.map((entry, index) => (
                      <Cell key={`cell-client-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-white">{totalClients}</span>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Empresas</span>
              </div>
            </div>

            <div className="w-full grid grid-cols-2 gap-1.5 pt-2 text-[11px] border-t border-slate-850">
              {pieGeneralClients.map((p) => (
                <div key={p.name} className="flex items-center gap-1.5 text-slate-300 truncate">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                  <span className="truncate">{p.name}:</span>
                  <span className="font-bold text-white ml-auto">{p.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* PASTEL 2: USUARIOS DENTRO DE ESAS EMPRESAS */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex flex-col items-center">
            <div className="w-full text-center pb-2 border-b border-slate-850">
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 block">
                Usuarios Finales
              </span>
            </div>

            <div className="relative w-full h-52 flex items-center justify-center my-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieGeneralUsers}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    stroke="#090d16"
                    strokeWidth={2}
                  >
                    {pieGeneralUsers.map((entry, index) => (
                      <Cell key={`cell-user-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-cyan-400">
                  {(totalUsers / 1000).toFixed(1)}k
                </span>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Usuarios</span>
              </div>
            </div>

            <div className="w-full grid grid-cols-2 gap-1.5 pt-2 text-[11px] border-t border-slate-850">
              {pieGeneralUsers.map((p) => (
                <div key={p.name} className="flex items-center gap-1.5 text-slate-300 truncate">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                  <span className="truncate">{p.name}:</span>
                  <span className="font-bold text-white ml-auto">{p.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* PASTEL 3: INGRESOS, GASTOS Y NETO */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex flex-col items-center">
            <div className="w-full text-center pb-2 border-b border-slate-850">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block">
                Ingresos, Gastos & Margen
              </span>
            </div>

            <div className="relative w-full h-52 flex items-center justify-center my-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieGeneralFinances}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    stroke="#090d16"
                    strokeWidth={2}
                  >
                    {pieGeneralFinances.map((entry, index) => (
                      <Cell key={`cell-fin-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip isCurrency={true} />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-emerald-400">{globalMargin}%</span>
                <span className="text-[10px] text-slate-400 uppercase font-bold">Margen Neto</span>
              </div>
            </div>

            <div className="w-full space-y-1.5 pt-2 text-[11px] border-t border-slate-850">
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#34d399]" />
                  <span>Ganancia Neta:</span>
                </span>
                <span className="font-bold text-emerald-400">${totalProfit.toLocaleString()} ({globalMargin}%)</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#f87171]" />
                  <span>Gastos Fijos:</span>
                </span>
                <span className="font-bold text-rose-400">${totalCosts.toLocaleString()} ({100 - globalMargin}%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. SECCIÓN POR PROYECTO: 3 GRÁFICOS LADO A LADO EN CADA FILA              */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-1">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-400" />
            <span>Proyectos</span>
          </h2>
          <span className="text-xs text-slate-400 font-semibold">{projectStats.length} activos</span>
        </div>

        {/* LISTA VERTICAL DE PROYECTOS */}
        <div className="space-y-4">
          {projectStats.map((project) => {
            // GRÁFICO 1: Clientes, Usuarios y Posibles Clientes
            const pieClientsUsersLeads = [
              { name: 'Clientes (Empresas)', value: project.clients, color: '#60a5fa' },
              { name: 'Usuarios Finales', value: project.users, color: '#38bdf8' },
              { name: 'Posibles Clientes', value: Math.max(1, project.leads), color: '#a78bfa' },
            ];

            // GRÁFICO 2: Ingresos, Gastos y Margen Neto
            const pieProjectFinances = [
              { name: 'Margen Neto', value: project.profit, color: '#34d399' },
              { name: 'Gastos Fijos', value: project.costs, color: '#f87171' },
            ];

            // GRÁFICO 3: Procesos a agotar en orden de prioridad (1 al 10)
            const topNextStep = project.pendingTasks[0];

            return (
              <div
                key={project.id}
                className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700/80 transition shadow-sm space-y-4"
              >
                {/* Cabecera del Proyecto con Enlace Directo a su Panel */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-3">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => selectProject(project.id)}
                      className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm text-white shadow-sm hover:opacity-90 transition cursor-pointer"
                      style={{ backgroundColor: project.color }}
                      title="Abrir espacio completo de este proyecto"
                    >
                      {project.name.charAt(0)}
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => selectProject(project.id)}
                          className="text-base font-bold text-white tracking-tight hover:text-indigo-400 transition text-left"
                        >
                          {project.name}
                        </button>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                          {project.stage}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        {project.clients} clientes &bull; {project.users.toLocaleString()} usuarios &bull; {project.leads} prospectos
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => selectProject(project.id)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition shrink-0 ml-auto sm:ml-0"
                  >
                    <span>Gestionar Proyecto</span>
                    <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
                  </button>
                </div>

                {/* LOS 3 GRÁFICOS UNO AL LADO DEL OTRO */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                  {/* ======================================================== */}
                  {/* GRÁFICO 1: Clientes, Usuarios y Posibles Clientes        */}
                  {/* ======================================================== */}
                  <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
                    <div className="text-center pb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 block">
                        Gráfico 1: Clientes, Usuarios & Prospectos
                      </span>
                    </div>

                    <div className="relative w-full h-36 flex items-center justify-center my-1">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieClientsUsersLeads}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={36}
                            outerRadius={56}
                            paddingAngle={3}
                            stroke="#090d16"
                            strokeWidth={2}
                          >
                            {pieClientsUsersLeads.map((entry, index) => (
                              <Cell key={`cell-g1-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip content={<CustomPieTooltip />} />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-sm font-black text-white">{project.clients}</span>
                        <span className="text-[8px] text-slate-400 uppercase font-bold">Empresas</span>
                      </div>
                    </div>

                    <div className="space-y-1 text-[10px] text-slate-300 pt-1.5 border-t border-slate-850">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-blue-400 font-semibold">
                          <span className="w-2 h-2 rounded-full bg-[#60a5fa]" /> Clientes:
                        </span>
                        <span className="font-bold text-white">{project.clients}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-cyan-400 font-semibold">
                          <span className="w-2 h-2 rounded-full bg-[#38bdf8]" /> Usuarios:
                        </span>
                        <span className="font-bold text-white">{project.users.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-purple-400 font-semibold">
                          <span className="w-2 h-2 rounded-full bg-[#a78bfa]" /> Posibles Clientes:
                        </span>
                        <span className="font-bold text-white">{project.leads}</span>
                      </div>
                    </div>
                  </div>

                  {/* ======================================================== */}
                  {/* GRÁFICO 2: Ingresos, Gastos y Margen                     */}
                  {/* ======================================================== */}
                  <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
                    <div className="text-center pb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                        Gráfico 2: Ingresos, Gastos & Margen
                      </span>
                    </div>

                    <div className="relative w-full h-36 flex items-center justify-center my-1">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieProjectFinances}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={36}
                            outerRadius={56}
                            paddingAngle={4}
                            stroke="#090d16"
                            strokeWidth={2}
                          >
                            {pieProjectFinances.map((entry, index) => (
                              <Cell key={`cell-g2-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip content={<CustomPieTooltip isCurrency={true} />} />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-sm font-black text-emerald-400">{project.margin}%</span>
                        <span className="text-[8px] text-slate-400 uppercase font-bold">Margen</span>
                      </div>
                    </div>

                    <div className="space-y-1 text-[10px] text-slate-300 pt-1.5 border-t border-slate-850">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-slate-300 font-semibold">
                          <span>MRR Ingresos:</span>
                        </span>
                        <span className="font-bold text-white">${project.mrr}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-rose-400 font-semibold">
                          <span className="w-2 h-2 rounded-full bg-[#f87171]" /> Gastos Fijos:
                        </span>
                        <span className="font-bold text-rose-400">${project.costs}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                          <span className="w-2 h-2 rounded-full bg-[#34d399]" /> Margen Limpio:
                        </span>
                        <span className="font-black text-emerald-400">${project.profit}</span>
                      </div>
                    </div>
                  </div>

                  {/* ======================================================== */}
                  {/* GRÁFICO 3: Procesos a agotar en orden de prioridad (1-10)*/}
                  {/* ======================================================== */}
                  <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
                    <div className="flex items-center justify-between pb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                        Gráfico 3: Procesos por Prioridad (1 al 10)
                      </span>
                      <span className="text-[10px] text-slate-500 font-bold">
                        {project.pendingTasks.length} pendientes
                      </span>
                    </div>

                    {/* Próximo paso destacado */}
                    {topNextStep ? (
                      <div className="my-1 p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-black uppercase tracking-wider text-amber-300 flex items-center gap-1">
                            <Target className="w-3 h-3 text-amber-400" />
                            Próximo Paso Inmediato
                          </span>
                          <span className="px-1.5 py-0.2 rounded-md bg-amber-400 text-slate-950 text-[10px] font-black">
                            P-{topNextStep.priorityScore || 10}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-white truncate">
                          {topNextStep.title}
                        </p>
                      </div>
                    ) : (
                      <div className="my-1 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-center text-xs text-slate-500">
                        No hay procesos pendientes
                      </div>
                    )}

                    {/* Lista visual de procesos con barra medidora 1 al 10 */}
                    <div className="space-y-1.5 pt-1.5 border-t border-slate-850">
                      {project.pendingTasks.slice(0, 3).map((task, tIdx) => {
                        const score = task.priorityScore || 5;
                        const pct = (score / 10) * 100;
                        const barColor =
                          score >= 9 ? 'bg-red-400' : score >= 7 ? 'bg-amber-400' : 'bg-blue-400';

                        return (
                          <div key={task.id} className="space-y-0.5">
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="text-slate-300 truncate max-w-[170px]">
                                {tIdx + 1}. {task.title}
                              </span>
                              <span className="font-bold text-white ml-1 shrink-0">{score}/10</span>
                            </div>
                            <div className="h-1.5 w-full rounded-full bg-slate-900 overflow-hidden">
                              <div
                                style={{ width: `${pct}%` }}
                                className={`h-full rounded-full ${barColor}`}
                              />
                            </div>
                          </div>
                        );
                      })}

                      {project.pendingTasks.length > 3 && (
                        <div className="text-[9px] text-slate-500 text-center pt-0.5">
                          + {project.pendingTasks.length - 3} tareas más en cola
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
