import React, { useState } from 'react';
import {
  Rocket,
  Plus,
  ExternalLink,
  DollarSign,
  Users,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  Edit2,
  Trash2,
  ChevronRight,
  MessageSquarePlus,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProductStage, SaaSProduct } from '../../types';

export const STAGES_LIST: { id: ProductStage; label: string; step: number; color: string; desc: string }[] = [
  { id: 'Idea & Validación', label: 'Idea & Validación', step: 1, color: 'text-amber-400 bg-amber-500/10 border-amber-500/30', desc: 'Validar dolor y mercado' },
  { id: 'Construcción / MVP', label: 'Construcción / MVP', step: 2, color: 'text-blue-400 bg-blue-500/10 border-blue-500/30', desc: 'Desarrollo del núcleo' },
  { id: 'Beta & Primeros Usuarios', label: 'Beta & Pruebas', step: 3, color: 'text-purple-400 bg-purple-500/10 border-purple-500/30', desc: 'Feedback de primeros usuarios' },
  { id: 'Lanzamiento', label: 'Lanzamiento', step: 4, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30', desc: 'Apertura comercial' },
  { id: 'Crecimiento & Rentabilidad', label: 'Crecimiento & Escala', step: 5, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', desc: 'Ventas y márgenes' },
];

export const normalizeStage = (stage: ProductStage): ProductStage => {
  if (stage === 'IDEA' || stage === 'VALIDACIÓN' || stage === 'DEFINICIÓN' || stage === 'Idea & Validación') return 'Idea & Validación';
  if (stage === 'MVP' || stage === 'DESARROLLO' || stage === 'PRUEBA INTERNA' || stage === 'Construcción / MVP') return 'Construcción / MVP';
  if (stage === 'BETA' || stage === 'PRIMEROS CLIENTES' || stage === 'Beta & Primeros Usuarios') return 'Beta & Primeros Usuarios';
  if (stage === 'LANZAMIENTO' || stage === 'VALIDACIÓN COMERCIAL' || stage === 'Lanzamiento') return 'Lanzamiento';
  return 'Crecimiento & Rentabilidad';
};

export const SimplePortfolioView: React.FC = () => {
  const {
    products,
    addProduct,
    deleteProduct,
    changeProductStageQuick,
    updateProductFinancialsQuick,
    leads,
    customers,
    feedbacks,
    addFeedback,
    setActiveTab,
  } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingFinanceProd, setEditingFinanceProd] = useState<SaaSProduct | null>(null);
  const [financeMrr, setFinanceMrr] = useState(0);
  const [financeCosts, setFinanceCosts] = useState(0);

  const [quickFeedbackProd, setQuickFeedbackProd] = useState<SaaSProduct | null>(null);
  const [fbTitle, setFbTitle] = useState('');
  const [fbType, setFbType] = useState<'Opinion' | 'Mejora' | 'Bug'>('Mejora');
  const [fbSource, setFbSource] = useState('');

  // Formulario nuevo producto
  const [newProdName, setNewProdName] = useState('');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdStage, setNewProdStage] = useState<ProductStage>('Idea & Validación');
  const [newProdMrr, setNewProdMrr] = useState(0);
  const [newProdCosts, setNewProdCosts] = useState(0);
  const [newProdUrl, setNewProdUrl] = useState('');

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;

    addProduct({
      name: newProdName.trim(),
      shortDescription: newProdDesc.trim() || 'SaaS en portafolio',
      currentStage: newProdStage,
      mrr: newProdMrr,
      websiteUrl: newProdUrl.trim() || undefined,
      financials: {
        mrr: newProdMrr,
        arr: newProdMrr * 12,
        nonRecurringMonthly: 0,
        monthlyCosts: newProdCosts,
        monthlyRevenue: newProdMrr,
        annualRevenue: newProdMrr * 12,
        estimatedProfitMonthly: newProdMrr - newProdCosts,
        lastUpdated: new Date().toISOString(),
      },
      status: 'saludable',
      priority: 'Alta',
    });

    setIsAddModalOpen(false);
    setNewProdName('');
    setNewProdDesc('');
    setNewProdMrr(0);
    setNewProdCosts(0);
    setNewProdUrl('');
  };

  const handleSaveFinances = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFinanceProd) return;
    updateProductFinancialsQuick(editingFinanceProd.id, financeMrr, financeCosts);
    setEditingFinanceProd(null);
  };

  const handleSaveQuickFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickFeedbackProd || !fbTitle.trim()) return;
    addFeedback({
      productId: quickFeedbackProd.id,
      type: fbType,
      title: fbTitle.trim(),
      description: 'Registrado desde tarjeta de portafolio',
      source: fbSource.trim() || undefined,
      status: 'Pendiente',
      priority: 'Media',
    });
    setQuickFeedbackProd(null);
    setFbTitle('');
    setFbSource('');
  };

  // Totales
  const totalMrr = products.reduce((acc, p) => acc + (p.mrr || 0), 0);
  const totalCosts = products.reduce((acc, p) => acc + (p.financials?.monthlyCosts || 0), 0);
  const totalProfit = totalMrr - totalCosts;
  const totalClients = customers.filter((c) => c.status === 'Activo').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in">
      {/* Top Banner & Fast KPIs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Rocket className="w-5 h-5" />
            </span>
            Portafolio & Etapas de tus SaaS
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Supervisa el ritmo de vida de cada proyecto, sus ingresos netos y comentarios clave.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/20 transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo SaaS</span>
        </button>
      </div>

      {/* Resumen rápido superior */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Proyectos Activos
          </span>
          <span className="text-2xl font-black text-white">{products.length}</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
            MRR Total
          </span>
          <span className="text-2xl font-black text-emerald-400">${totalMrr.toLocaleString()}</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 block mb-1">
            Margen Neto Mensual
          </span>
          <span className="text-2xl font-black text-white">${totalProfit.toLocaleString()}</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 block mb-1">
            Clientes Activos
          </span>
          <span className="text-2xl font-black text-white">{totalClients}</span>
        </div>
      </div>

      {/* Lista de Tarjetas de SaaS */}
      <div className="grid grid-cols-1 gap-4">
        {products.map((product) => {
          const normStage = normalizeStage(product.currentStage);
          const currentStageObj = STAGES_LIST.find((s) => s.id === normStage) || STAGES_LIST[0];
          const prodMrr = product.mrr || 0;
          const prodCosts = product.financials?.monthlyCosts || 0;
          const prodProfit = prodMrr - prodCosts;

          // Conteos
          const prodCustomers = customers.filter((c) => c.productIds.includes(product.id) && c.status === 'Activo').length;
          const prodLeads = leads.filter((l) => l.productId === product.id && l.status !== 'CLIENTE' && l.status !== 'PERDIDO').length;
          const prodFeedbacks = feedbacks.filter((f) => f.productId === product.id);

          return (
            <div
              key={product.id}
              className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition shadow-sm space-y-4"
            >
              {/* Header de la tarjeta */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 font-black text-base flex items-center justify-center border border-indigo-500/30 shrink-0">
                    {product.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                        {product.name}
                      </h2>
                      {product.websiteUrl && (
                        <a
                          href={product.websiteUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-400 hover:text-indigo-400 transition"
                          title="Abrir enlace"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">{product.shortDescription}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setQuickFeedbackProd(product);
                      setFbTitle('');
                      setFbSource('');
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition"
                    title="Añadir opinión o mejora para este SaaS"
                  >
                    <MessageSquarePlus className="w-3.5 h-3.5 text-indigo-400" />
                    <span>+ Opinión / Mejora</span>
                  </button>

                  <button
                    onClick={() => {
                      setEditingFinanceProd(product);
                      setFinanceMrr(product.mrr || 0);
                      setFinanceCosts(product.financials?.monthlyCosts || 0);
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition"
                    title="Editar finanzas del proyecto"
                  >
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Finanzas</span>
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`¿Eliminar ${product.name} del portafolio?`)) {
                        deleteProduct(product.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition"
                    title="Eliminar SaaS"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* RITMO / ETAPAS CLARAS (5 PASOS) */}
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                    Etapa Actual:{' '}
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${currentStageObj.color}`}>
                      Paso {currentStageObj.step}: {currentStageObj.label}
                    </span>
                  </span>
                  <span className="text-slate-500 text-[11px] hidden sm:inline">
                    Haz clic en cualquier etapa para mover el SaaS
                  </span>
                </div>

                {/* Stepper interactivo */}
                <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                  {STAGES_LIST.map((st) => {
                    const isPassedOrCurrent = st.step <= currentStageObj.step;
                    const isCurrent = st.step === currentStageObj.step;

                    return (
                      <button
                        key={st.step}
                        onClick={() => changeProductStageQuick(product.id, st.id)}
                        className={`p-2 rounded-xl text-left border transition text-xs flex flex-col justify-between ${
                          isCurrent
                            ? 'bg-indigo-600/20 border-indigo-500 text-white font-bold ring-1 ring-indigo-500/40 shadow-sm'
                            : isPassedOrCurrent
                            ? 'bg-slate-950/80 border-slate-700 text-slate-300 hover:border-slate-500'
                            : 'bg-slate-950/40 border-slate-800/80 text-slate-600 hover:text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase font-bold text-slate-400">
                            Paso {st.step}
                          </span>
                          {isPassedOrCurrent && (
                            <CheckCircle2 className={`w-3 h-3 ${isCurrent ? 'text-indigo-400' : 'text-emerald-400'}`} />
                          )}
                        </div>
                        <span className="truncate mt-1 text-[11px] font-semibold">{st.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Métricas y Datos del Negocio */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                {/* Finanzas MRR */}
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-0.5">
                    MRR Recurrente
                  </span>
                  <span className="text-base sm:text-lg font-bold text-emerald-400">
                    ${prodMrr.toLocaleString()}
                    <span className="text-[10px] font-normal text-slate-500"> /mes</span>
                  </span>
                </div>

                {/* Finanzas Costos y Margen */}
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-0.5">
                    Margen Neto
                  </span>
                  <span className="text-base sm:text-lg font-bold text-white">
                    ${prodProfit.toLocaleString()}
                    <span className="text-[10px] font-normal text-slate-500"> /mes</span>
                  </span>
                </div>

                {/* Clientes Activos */}
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-0.5">
                    Clientes Activos
                  </span>
                  <span className="text-base sm:text-lg font-bold text-white">
                    {prodCustomers}
                    <span className="text-[10px] font-normal text-slate-500"> pagando</span>
                  </span>
                </div>

                {/* Posibles Clientes / Leads */}
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-0.5">
                    Prospectos en cola
                  </span>
                  <span className="text-base sm:text-lg font-bold text-blue-400">
                    {prodLeads}
                    <span className="text-[10px] font-normal text-slate-500"> leads</span>
                  </span>
                </div>
              </div>

              {/* Registro de mejoras/opiniones resumido */}
              {prodFeedbacks.length > 0 && (
                <div className="pt-2 border-t border-slate-850 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>{prodFeedbacks.length} opiniones o mejoras registradas</span>
                  </span>
                  <button
                    onClick={() => setActiveTab('feedback')}
                    className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 transition"
                  >
                    <span>Ver comentarios</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal: Nuevo SaaS */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Registrar Nuevo SaaS</h3>

            <form onSubmit={handleCreateProduct} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Nombre del SaaS *</label>
                <input
                  type="text"
                  required
                  placeholder="ej. EduGest, FacturaFácil..."
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Descripción corta</label>
                <input
                  type="text"
                  placeholder="ej. Software de gestión para colegios privados"
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Etapa Inicial</label>
                <select
                  value={newProdStage}
                  onChange={(e) => setNewProdStage(e.target.value as ProductStage)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  {STAGES_LIST.map((st) => (
                    <option key={st.step} value={st.id}>
                      Paso {st.step}: {st.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">MRR Inicial ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={newProdMrr}
                    onChange={(e) => setNewProdMrr(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Costo Mensual ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={newProdCosts}
                    onChange={(e) => setNewProdCosts(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">URL / Dominio (opcional)</label>
                <input
                  type="url"
                  placeholder="https://tusaas.com"
                  value={newProdUrl}
                  onChange={(e) => setNewProdUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
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
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 transition"
                >
                  Guardar SaaS
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Editar Finanzas Rápidas */}
      {editingFinanceProd && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              <span>Finanzas: {editingFinanceProd.name}</span>
            </h3>

            <form onSubmit={handleSaveFinances} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Ingreso Mensual Recurrente (MRR en $)
                </label>
                <input
                  type="number"
                  min="0"
                  value={financeMrr}
                  onChange={(e) => setFinanceMrr(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Costos Mensuales Fijos (Hosting, APIs, software en $)
                </label>
                <input
                  type="number"
                  min="0"
                  value={financeCosts}
                  onChange={(e) => setFinanceCosts(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <span className="text-slate-400 block mb-0.5">Margen Neto Calculado:</span>
                <span className="text-base font-bold text-emerald-400">
                  ${(financeMrr - financeCosts).toLocaleString()} / mes
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingFinanceProd(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition"
                >
                  Actualizar Finanzas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Nueva Opinión o Mejora Rápida */}
      {quickFeedbackProd && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <MessageSquarePlus className="w-5 h-5 text-indigo-400" />
              <span>Registrar Opinión / Mejora</span>
            </h3>
            <p className="text-xs text-slate-400">Para el proyecto: <strong>{quickFeedbackProd.name}</strong></p>

            <form onSubmit={handleSaveQuickFeedback} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Tipo</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['Opinion', 'Mejora', 'Bug'] as const).map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setFbType(t)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-semibold border text-center transition ${
                        fbType === t
                          ? 'bg-indigo-600 text-white border-indigo-500'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {t === 'Opinion' ? 'Opinión' : t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Título / Qué sugirió o qué opinó *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="ej. El cliente pide descargar reportes en PDF directamente"
                  value={fbTitle}
                  onChange={(e) => setFbTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  ¿Quién lo dijo? (Cliente o contacto)
                </label>
                <input
                  type="text"
                  placeholder="ej. Dra. Martínez (Clínica Dental)"
                  value={fbSource}
                  onChange={(e) => setFbSource(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setQuickFeedbackProd(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 transition"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
