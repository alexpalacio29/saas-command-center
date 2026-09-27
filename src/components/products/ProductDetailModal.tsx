import React, { useState } from 'react';
import {
  X,
  ExternalLink,
  GitBranch,
  Globe,
  DollarSign,
  AlertTriangle,
  Activity,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  TrendingUp,
  History,
  Edit3,
  Plus,
  Trash2,
  Save,
  Check,
  ChevronDown,
  BookOpen,
  FileCode,
  Tag,
  Shield,
  BarChart2,
  Users,
  Target,
  Bug,
  Award,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';
import { useApp } from '../../context/AppContext';
import {
  SaaSProduct,
  ProductStage,
  BottleneckCategory,
  BottleneckSeverity,
  ChangelogCategory,
  KnowledgeCategory,
} from '../../types';
import { ALL_STAGES } from '../../data/defaultData';

export const ProductDetailModal: React.FC = () => {
  const {
    products,
    selectedProductId,
    closeProductDetail,
    updateProduct,
    changeProductStage,
    toggleChecklistItem,
    updateProductBottleneck,
    updateProductHealth,
    updateProductFinancials,
    tasks,
    customers,
    roadmapItems,
    bugs,
    changelogs,
    addChangelog,
    knowledgeDocs,
    addKnowledgeDoc,
    competitors,
    addCompetitor,
    leads,
    currentUser,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'analytics' | 'financials' | 'stage' | 'health' | 'tasks' | 'roadmap' | 'bugs' | 'knowledge' | 'changelog' | 'competitors' | 'history'
  >('overview');

  const [showStageChangeModal, setShowStageChangeModal] = useState(false);
  const [targetStage, setTargetStage] = useState<ProductStage>('MVP');
  const [stageComment, setStageComment] = useState('');

  // Editable states
  const [isEditingHealth, setIsEditingHealth] = useState(false);
  const [isEditingBottleneck, setIsEditingBottleneck] = useState(false);
  const [isEditingFinancials, setIsEditingFinancials] = useState(false);

  // New sub-entity modals
  const [showNewDocModal, setShowNewDocModal] = useState(false);
  const [newDoc, setNewDoc] = useState({
    title: '',
    category: 'Documentación técnica' as KnowledgeCategory,
    content: '',
    linksRaw: '',
  });

  const [showNewChangelogModal, setShowNewChangelogModal] = useState(false);
  const [newChangelog, setNewChangelog] = useState({
    version: 'v1.0.0',
    category: 'Feature' as ChangelogCategory,
    change: '',
  });

  const [showNewCompetitorModal, setShowNewCompetitorModal] = useState(false);
  const [newCompetitor, setNewCompetitor] = useState({
    name: '',
    url: '',
    description: '',
    pricing: '',
    features: '',
    notes: '',
  });

  const product = products.find((p) => p.id === selectedProductId);
  if (!product) return null;

  // Local state for health & financials
  const [healthValues, setHealthValues] = useState(product.health);
  const [bottleneckValues, setBottleneckValues] = useState(product.bottleneck);
  const [financialValues, setFinancialValues] = useState(product.financials);

  // Filter linked items for this specific SaaS product
  const productTasks = tasks.filter((t) => t.productId === product.id);
  const productRoadmap = roadmapItems.filter((r) => r.productId === product.id);
  const productCustomers = customers.filter((c) => c.productIds.includes(product.id));
  const productLeads = leads.filter((l) => l.productId === product.id);
  const productBugs = bugs.filter((b) => b.productId === product.id);
  const productChangelog = changelogs.filter((c) => c.productId === product.id);
  const productDocs = knowledgeDocs.filter((d) => d.productId === product.id);
  const productCompetitors = competitors.filter((c) => c.productId === product.id);

  // Stage checklist progress
  const currentChecklists = product.stageChecklists.filter(
    (c) => c.stage === product.currentStage
  );
  const completedChecklistCount = currentChecklists.filter((c) => c.completed).length;
  const stageProgressPct = currentChecklists.length > 0
    ? Math.round((completedChecklistCount / currentChecklists.length) * 100)
    : 0;

  const handleSaveHealth = () => {
    updateProductHealth(product.id, healthValues);
    setIsEditingHealth(false);
  };

  const handleSaveBottleneck = () => {
    updateProductBottleneck(product.id, bottleneckValues);
    setIsEditingBottleneck(false);
  };

  const handleSaveFinancials = () => {
    updateProductFinancials(product.id, financialValues);
    setIsEditingFinancials(false);
  };

  const handleConfirmStageChange = () => {
    changeProductStage(product.id, targetStage, stageComment);
    setShowStageChangeModal(false);
    setStageComment('');
  };

  const handleCreateKnowledgeDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoc.title) return;
    const linksParsed = newDoc.linksRaw
      .split('\n')
      .filter((l) => l.trim().length > 0)
      .map((line) => {
        const parts = line.split('|');
        return {
          title: parts[0]?.trim() || 'Enlace',
          url: parts[1]?.trim() || parts[0]?.trim(),
        };
      });

    addKnowledgeDoc({
      productId: product.id,
      title: newDoc.title,
      category: newDoc.category,
      content: newDoc.content,
      links: linksParsed,
      author: currentUser.name,
    });
    setShowNewDocModal(false);
    setNewDoc({
      title: '',
      category: 'Documentación técnica',
      content: '',
      linksRaw: '',
    });
  };

  const handleCreateChangelog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChangelog.change) return;
    addChangelog({
      productId: product.id,
      version: newChangelog.version,
      date: new Date().toISOString().split('T')[0],
      change: newChangelog.change,
      category: newChangelog.category,
      author: currentUser.name,
    });
    setShowNewChangelogModal(false);
    setNewChangelog({ version: 'v1.0.0', category: 'Feature', change: '' });
  };

  const handleCreateCompetitor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompetitor.name) return;
    addCompetitor({
      productId: product.id,
      name: newCompetitor.name,
      url: newCompetitor.url,
      description: newCompetitor.description,
      pricing: newCompetitor.pricing,
      features: newCompetitor.features,
      notes: newCompetitor.notes,
      analyzedAt: new Date().toISOString().split('T')[0],
    });
    setShowNewCompetitorModal(false);
    setNewCompetitor({ name: '', url: '', description: '', pricing: '', features: '', notes: '' });
  };

  const statusBadge = {
    saludable: { label: '🟢 Saludable', bg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' },
    atencion: { label: '🟡 Atención', bg: 'bg-amber-500/10 text-amber-300 border-amber-500/20' },
    critico: { label: '🔴 Crítico', bg: 'bg-red-500/10 text-red-300 border-red-500/20' },
    pausado: { label: '⚪ Pausado', bg: 'bg-slate-800 text-slate-300 border-slate-700' },
    archivado: { label: '🟣 Archivado', bg: 'bg-purple-500/10 text-purple-300 border-purple-500/20' },
  }[product.status];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="w-full max-w-5xl max-h-[94vh] flex flex-col rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl text-slate-100 overflow-hidden my-auto">
        {/* Header Modal */}
        <div className="p-4 sm:p-6 border-b border-slate-800 flex items-start justify-between gap-4 bg-slate-950/70">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center font-bold text-white text-lg shadow-lg border border-indigo-400/30">
              {product.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {product.name}
                </h2>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${statusBadge.bg}`}>
                  {statusBadge.label}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-indigo-950/80 text-indigo-300 font-mono border border-indigo-800/60">
                  {product.currentStage}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
                {product.shortDescription}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setTargetStage(product.currentStage);
                setShowStageChangeModal(true);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow transition flex items-center gap-1.5"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>Avanzar Etapa</span>
            </button>
            <button
              onClick={closeProductDetail}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation inside modal (Sections 10, 21, 24, 25, 28, 29, 30) */}
        <div className="px-6 border-b border-slate-800 bg-slate-950/40 flex gap-4 overflow-x-auto text-xs scrollbar-none">
          {[
            { id: 'overview', label: 'Resumen' },
            { id: 'analytics', label: 'Analytics' },
            { id: 'financials', label: 'Finanzas' },
            { id: 'stage', label: `Etapa (${stageProgressPct}%)` },
            { id: 'health', label: 'Salud (6 ejes)' },
            { id: 'tasks', label: `Tareas (${productTasks.length})` },
            { id: 'roadmap', label: `Roadmap (${productRoadmap.length})` },
            { id: 'bugs', label: `Bugs (${productBugs.length})` },
            { id: 'knowledge', label: `Knowledge (${productDocs.length})` },
            { id: 'changelog', label: `Changelog (${productChangelog.length})` },
            { id: 'competitors', label: `Competidores (${productCompetitors.length})` },
            { id: 'history', label: `Historial (${product.stageHistory.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-1 border-b-2 font-medium transition whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-400 font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">MRR Recurrente</span>
                  <span className="text-xl font-bold font-mono text-emerald-400">
                    ${product.mrr.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-500 block">ARR: ${product.arr.toLocaleString()}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Ingresos Totales Mes</span>
                  <span className="text-xl font-bold font-mono text-white">
                    ${product.financials.monthlyRevenue.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-400 block">+ ${product.financials.nonRecurringMonthly} no rec.</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Beneficio Estimado</span>
                  <span className="text-xl font-bold font-mono text-emerald-400">
                    ${product.financials.estimatedProfitMonthly.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-500 block">Costos: ${product.financials.monthlyCosts}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Clientes & Usuarios</span>
                  <span className="text-xl font-bold text-indigo-300">
                    {product.activeClientsCount} / {product.activeUsersCount.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-400 block">Responsable: {product.owner}</span>
                </div>
              </div>

              {/* Cuello de botella actual (Section 12) */}
              <div className="p-5 rounded-2xl bg-slate-950/90 border border-amber-500/30 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                    <h3 className="font-bold text-white text-sm">
                      Cuello de Botella Actual del Producto
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsEditingBottleneck(!isEditingBottleneck)}
                    className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{isEditingBottleneck ? 'Cancelar' : 'Editar Bloqueo'}</span>
                  </button>
                </div>

                {isEditingBottleneck ? (
                  <div className="space-y-3 pt-2 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-slate-400 block mb-1">Categoría del Cuello de Botella</label>
                        <select
                          value={bottleneckValues.category}
                          onChange={(e) =>
                            setBottleneckValues({
                              ...bottleneckValues,
                              category: e.target.value as BottleneckCategory,
                            })
                          }
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                        >
                          {[
                            'Desarrollo',
                            'Bugs',
                            'UX',
                            'Marketing',
                            'Captación',
                            'Ventas',
                            'Retención',
                            'Monetización',
                            'Soporte',
                            'Financiamiento',
                          ].map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-1">Severidad</label>
                        <select
                          value={bottleneckValues.severity}
                          onChange={(e) =>
                            setBottleneckValues({
                              ...bottleneckValues,
                              severity: e.target.value as BottleneckSeverity,
                            })
                          }
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                        >
                          <option value="critico">🔴 Crítico</option>
                          <option value="alto">🟡 Alto</option>
                          <option value="moderado">🔵 Moderado</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-400 block mb-1">Principal Bloqueo (Descripción)</label>
                      <textarea
                        rows={2}
                        value={bottleneckValues.description}
                        onChange={(e) => setBottleneckValues({ ...bottleneckValues, description: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                      />
                    </div>

                    <div>
                      <label className="text-slate-400 block mb-1">Acción Recomendada para Desbloquear</label>
                      <textarea
                        rows={2}
                        value={bottleneckValues.recommendedAction}
                        onChange={(e) => setBottleneckValues({ ...bottleneckValues, recommendedAction: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                      />
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={handleSaveBottleneck}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center gap-1.5"
                      >
                        <Save className="w-4 h-4" /> Guardar Cuello de Botella
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-400">Tipo de Bloqueo:</span>
                      <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                        {product.bottleneck?.category}
                      </span>
                      <span className="text-slate-500">
                        (Severidad: <strong className="text-slate-300">{product.bottleneck?.severity}</strong>)
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                      <div className="text-slate-400 font-semibold mb-0.5">Principal bloqueo:</div>
                      <div className="text-slate-200 leading-relaxed">{product.bottleneck?.description}</div>
                    </div>

                    <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30">
                      <div className="text-indigo-400 font-semibold mb-0.5">Acción recomendada:</div>
                      <div className="text-slate-200 leading-relaxed font-medium">
                        {product.bottleneck?.recommendedAction}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Technical specs & URLs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <h4 className="font-bold text-white uppercase tracking-wider text-slate-400">
                    Modelo de Negocio
                  </h4>
                  <div className="space-y-1">
                    <div>
                      <span className="text-slate-400 block">Esquema:</span>
                      <span className="text-slate-200 font-medium">{product.businessModel}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Estructura de Precio:</span>
                      <span className="text-slate-200 font-medium">{product.priceDetail}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <h4 className="font-bold text-white uppercase tracking-wider text-slate-400">
                    Entornos
                  </h4>
                  <div className="space-y-1">
                    {product.productionUrl && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 flex items-center gap-1.5">
                          <Globe className="w-3.5 h-3.5 text-emerald-400" /> Producción:
                        </span>
                        <a
                          href={product.productionUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-indigo-400 hover:underline flex items-center gap-1 font-mono"
                        >
                          {product.productionUrl} <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                    {product.repoUrl && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 flex items-center gap-1.5">
                          <GitBranch className="w-3.5 h-3.5 text-blue-400" /> Repositorio:
                        </span>
                        <a
                          href={product.repoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-300 hover:underline flex items-center gap-1 font-mono"
                        >
                          {product.repoUrl.replace('https://github.com/', '')} <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: ANALYTICS (Section 28) */}
          {activeTab === 'analytics' && (
            <div className="space-y-6 text-xs">
              <h3 className="font-bold text-white text-base">Dashboard Individual: {product.name}</h3>

              {/* 4 Pillars Grid: Growth, Revenue, Product, Activity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Growth */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Target className="w-4 h-4 text-blue-400" /> Crecimiento & Embudo
                    </span>
                    <span className="text-slate-400 font-mono">{productLeads.length} leads registrados</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="p-2 rounded-xl bg-slate-900">
                      <span className="text-slate-400 block text-[10px]">Leads</span>
                      <span className="font-bold text-white text-sm">{productLeads.length}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-900">
                      <span className="text-slate-400 block text-[10px]">Demos</span>
                      <span className="font-bold text-indigo-400 text-sm">
                        {productLeads.filter((l) => l.status === 'DEMO').length}
                      </span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-900">
                      <span className="text-slate-400 block text-[10px]">Trials</span>
                      <span className="font-bold text-amber-400 text-sm">
                        {productLeads.filter((l) => l.status === 'PRUEBA').length}
                      </span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-900">
                      <span className="text-slate-400 block text-[10px]">Clientes</span>
                      <span className="font-bold text-emerald-400 text-sm">{product.activeClientsCount}</span>
                    </div>
                  </div>
                </div>

                {/* Revenue */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4 text-emerald-400" /> Ingresos & Márgenes
                    </span>
                    <span className="text-emerald-400 font-mono font-bold">
                      ${product.financials.estimatedProfitMonthly} margen
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded-xl bg-slate-900">
                      <span className="text-slate-400 block text-[10px]">MRR Recurrente</span>
                      <span className="font-bold text-emerald-400 text-sm font-mono">${product.mrr}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-900">
                      <span className="text-slate-400 block text-[10px]">Revenue Total Mes</span>
                      <span className="font-bold text-white text-sm font-mono">${product.financials.monthlyRevenue}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-900">
                      <span className="text-slate-400 block text-[10px]">Costos Mes</span>
                      <span className="font-bold text-red-400 text-sm font-mono">${product.financials.monthlyCosts}</span>
                    </div>
                  </div>
                </div>

                {/* Product Execution */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-indigo-400" /> Ejecución de Producto
                    </span>
                    <span className="text-slate-400 font-mono">{productTasks.length} tareas</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="p-2 rounded-xl bg-slate-900">
                      <span className="text-slate-400 block text-[10px]">Abiertas</span>
                      <span className="font-bold text-white text-sm">
                        {productTasks.filter((t) => t.status !== 'Completada').length}
                      </span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-900">
                      <span className="text-slate-400 block text-[10px]">Completadas</span>
                      <span className="font-bold text-emerald-400 text-sm">
                        {productTasks.filter((t) => t.status === 'Completada').length}
                      </span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-900">
                      <span className="text-slate-400 block text-[10px]">Hitos / Road</span>
                      <span className="font-bold text-indigo-400 text-sm">{productRoadmap.length}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-900">
                      <span className="text-slate-400 block text-[10px]">Bugs</span>
                      <span className="font-bold text-red-400 text-sm">
                        {productBugs.filter((b) => b.status === 'Abierto').length}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Activity & Velocity */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-purple-400" /> Ritmo Operativo
                    </span>
                    <span className="text-slate-400">Última actividad: {product.lastActivityDate}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Versión actual en Changelog:</span>
                      <span className="font-mono text-white font-bold">
                        {productChangelog[0]?.version || 'v1.0.0'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Documentos de Conocimiento:</span>
                      <span className="font-mono text-slate-300">{productDocs.length} guías</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mini Graphic: Growth Funnel */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <span className="font-bold text-white uppercase text-[11px] block">
                  Embudo de Conversión ({product.name})
                </span>
                <div className="h-36 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { etapa: 'Leads', cantidad: productLeads.length },
                        { etapa: 'Demos', cantidad: productLeads.filter((l) => l.status === 'DEMO').length },
                        { etapa: 'Trials', cantidad: productLeads.filter((l) => l.status === 'PRUEBA').length },
                        { etapa: 'Clientes', cantidad: product.activeClientsCount },
                      ]}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <XAxis dataKey="etapa" stroke="#64748b" tick={{ fontSize: 10 }} />
                      <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                      />
                      <Bar dataKey="cantidad" fill="#6366f1" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* TAB: FINANCIALS (Section 21) */}
          {activeTab === 'financials' && (
            <div className="space-y-6 text-xs">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
                <div>
                  <h3 className="font-bold text-white text-base">
                    Desglose Financiero & Rentabilidad (No asumir MRR = Ingresos Totales)
                  </h3>
                  <p className="text-slate-400">
                    Distinción explícita entre Recurring Revenue (MRR/ARR) y Gross Revenue mensual.
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (isEditingFinancials) handleSaveFinancials();
                    else setIsEditingFinancials(true);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center gap-1.5"
                >
                  {isEditingFinancials ? (
                    <>
                      <Save className="w-3.5 h-3.5" /> Guardar Finanzas
                    </>
                  ) : (
                    <>
                      <Edit3 className="w-3.5 h-3.5" /> Ajustar Costos/Ingresos
                    </>
                  )}
                </button>
              </div>

              {isEditingFinancials ? (
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-700 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-slate-400 block mb-1 font-semibold">MRR Recurrente ($)</label>
                      <input
                        type="number"
                        value={financialValues.mrr}
                        onChange={(e) =>
                          setFinancialValues({
                            ...financialValues,
                            mrr: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1 font-semibold">Ingresos No Recurrentes Mes ($)</label>
                      <input
                        type="number"
                        value={financialValues.nonRecurringMonthly}
                        onChange={(e) =>
                          setFinancialValues({
                            ...financialValues,
                            nonRecurringMonthly: parseFloat(e.target.value) || 0,
                          })
                        }
                        placeholder="Setup, consultoría, comisiones..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1 font-semibold">Costos Operativos Mes ($)</label>
                      <input
                        type="number"
                        value={financialValues.monthlyCosts}
                        onChange={(e) =>
                          setFinancialValues({
                            ...financialValues,
                            monthlyCosts: parseFloat(e.target.value) || 0,
                          })
                        }
                        placeholder="Servidores, API keys, licencias..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                      MRR (Recurring)
                    </span>
                    <span className="text-2xl font-bold font-mono text-emerald-400">
                      ${product.financials.mrr.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-1">ARR: ${product.financials.arr.toLocaleString()}</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                      Ingresos Totales (Revenue)
                    </span>
                    <span className="text-2xl font-bold font-mono text-white">
                      ${product.financials.monthlyRevenue.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-1">
                      (MRR + ${product.financials.nonRecurringMonthly} puntual)
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                      Costos Operativos Mes
                    </span>
                    <span className="text-2xl font-bold font-mono text-red-400">
                      ${product.financials.monthlyCosts.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-1">Infraestructura & Herramientas</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                      Beneficio Mensual Estimado
                    </span>
                    <span className="text-2xl font-bold font-mono text-emerald-400">
                      ${product.financials.estimatedProfitMonthly.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-1">
                      Margen: {Math.round((product.financials.estimatedProfitMonthly / (product.financials.monthlyRevenue || 1)) * 100)}%
                    </span>
                  </div>
                </div>
              )}

              {/* Graphic: Financial Breakdown (MRR, Total Revenue, Costs, Profit) */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <span className="font-bold text-white uppercase text-[11px] block">
                  Comparativa Financiera: Recurrente vs Total vs Costos ({product.name})
                </span>
                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { label: 'MRR Recurrente', valor: product.financials.mrr, fill: '#10b981' },
                        { label: 'Revenue Mes', valor: product.financials.monthlyRevenue, fill: '#6366f1' },
                        { label: 'Costos Mes', valor: product.financials.monthlyCosts, fill: '#ef4444' },
                        { label: 'Beneficio Mes', valor: product.financials.estimatedProfitMonthly, fill: '#059669' },
                      ]}
                      margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                    >
                      <XAxis dataKey="label" stroke="#64748b" tick={{ fontSize: 10 }} />
                      <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                        formatter={(v: any) => [`$${Number(v).toLocaleString()}`, 'Valor']}
                      />
                      <Bar dataKey="valor" radius={[6, 6, 0, 0]}>
                        <Cell fill="#10b981" />
                        <Cell fill="#6366f1" />
                        <Cell fill="#ef4444" />
                        <Cell fill="#059669" />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* TAB: STAGE & CHECKLIST */}
          {activeTab === 'stage' && (
            <div className="space-y-6 text-xs">
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400">Etapa Actual del Ciclo de Vida:</span>
                    <h3 className="text-lg font-bold text-indigo-400 flex items-center gap-2">
                      <span>{product.currentStage}</span>
                      <span className="text-xs font-mono font-normal text-slate-400">
                        ({ALL_STAGES.find((s) => s.stage === product.currentStage)?.order}/15)
                      </span>
                    </h3>
                  </div>
                  <button
                    onClick={() => {
                      setTargetStage(product.currentStage);
                      setShowStageChangeModal(true);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
                  >
                    Mover Etapa
                  </button>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-slate-400">
                    <span>Requisitos completados de {product.currentStage}</span>
                    <span className="font-mono text-emerald-400 font-bold">
                      {completedChecklistCount} de {currentChecklists.length} ({stageProgressPct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all"
                      style={{ width: `${stageProgressPct}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Checklist */}
              <div className="space-y-2">
                {currentChecklists.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => toggleChecklistItem(product.id, item.id)}
                    className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                      item.completed
                        ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200'
                        : 'bg-slate-950/70 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-lg flex items-center justify-center border transition ${
                          item.completed
                            ? 'bg-emerald-600 border-emerald-500 text-white'
                            : 'border-slate-700 bg-slate-900 text-transparent'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className={item.completed ? 'line-through text-slate-400' : 'font-medium'}>
                        {item.label}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 uppercase font-mono">
                      {item.completed ? 'Completado' : 'Pendiente'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: HEALTH (Section 11) */}
          {activeTab === 'health' && (
            <div className="space-y-6 text-xs">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
                <div>
                  <h3 className="font-bold text-white text-base">Salud Multidimensional (6 Indicadores)</h3>
                  <p className="text-slate-400">
                    Definido directamente por ti sin algoritmos ficticios.
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (isEditingHealth) handleSaveHealth();
                    else setIsEditingHealth(true);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center gap-1.5"
                >
                  {isEditingHealth ? (
                    <>
                      <Save className="w-3.5 h-3.5" /> Guardar Indicadores
                    </>
                  ) : (
                    <>
                      <Edit3 className="w-3.5 h-3.5" /> Modificar Valores
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: 'producto', label: 'Producto', desc: '% desarrollo funcional / madurez de features' },
                  { key: 'tecnologia', label: 'Tecnología', desc: 'Estado técnico, estabilidad, infraestructura' },
                  { key: 'marketing', label: 'Marketing', desc: 'Progreso de marca, audiencia, visibilidad' },
                  { key: 'ventas', label: 'Ventas', desc: 'Efectividad del embudo comercial' },
                  { key: 'clientes', label: 'Clientes', desc: 'Tracción, retención y satisfacción' },
                  { key: 'finanzas', label: 'Finanzas', desc: 'Sostenibilidad, margen y flujo' },
                ].map((item) => {
                  const val = healthValues[item.key as keyof typeof healthValues] as number;
                  const barClass = val >= 75 ? 'bg-emerald-500' : val >= 50 ? 'bg-amber-500' : 'bg-red-500';

                  return (
                    <div key={item.key} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold text-white text-sm">{item.label}</span>
                          <div className="text-[11px] text-slate-400">{item.desc}</div>
                        </div>
                        <span className="text-base font-bold font-mono text-white">{val}%</span>
                      </div>
                      {isEditingHealth ? (
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={val}
                          onChange={(e) =>
                            setHealthValues({ ...healthValues, [item.key]: parseInt(e.target.value, 10) })
                          }
                          className="w-full accent-indigo-500 cursor-pointer"
                        />
                      ) : (
                        <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                          <div className={`h-full rounded-full ${barClass}`} style={{ width: `${val}%` }} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB: BUGS (Section 29) */}
          {activeTab === 'bugs' && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white uppercase text-slate-400">
                  Bugs de {product.name} ({productBugs.length})
                </h4>
              </div>

              {productBugs.length === 0 ? (
                <div className="py-8 text-center text-slate-500 bg-slate-950/40 rounded-2xl border border-dashed border-slate-800">
                  No hay bugs reportados para este producto.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {productBugs.map((b) => (
                    <div key={b.id} className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-red-500/20 text-red-300">
                            {b.severity}
                          </span>
                          <span className="font-bold text-white text-sm">{b.title}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-300">
                          {b.status}
                        </span>
                      </div>
                      <p className="text-slate-300 leading-relaxed">{b.description}</p>
                      {b.solution && (
                        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-emerald-300">
                          <strong className="text-slate-400">Solución:</strong> {b.solution}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: KNOWLEDGE / DOCUMENTACIÓN (Section 24: No almacenar contraseñas) */}
          {activeTab === 'knowledge' && (
            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3 text-amber-300">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 shrink-0 text-amber-400" />
                  <span>
                    <strong>Seguridad:</strong> No almacenar contraseñas, tokens, API keys ni secretos en esta sección.
                  </span>
                </div>
                <button
                  onClick={() => setShowNewDocModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shrink-0"
                >
                  + Agregar Documento
                </button>
              </div>

              <div className="space-y-3">
                {productDocs.map((doc) => (
                  <div key={doc.id} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-purple-400" />
                        <h4 className="font-bold text-white text-sm">{doc.title}</h4>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-semibold">
                        {doc.category}
                      </span>
                    </div>

                    <p className="text-slate-300 leading-relaxed whitespace-pre-line">{doc.content}</p>

                    {doc.links && doc.links.length > 0 && (
                      <div className="pt-2 border-t border-slate-800/80 flex flex-wrap gap-2">
                        {doc.links.map((link, idx) => (
                          <a
                            key={idx}
                            href={link.url}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-indigo-400 border border-slate-800 flex items-center gap-1 font-mono text-[11px]"
                          >
                            <span>{link.title}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: CHANGELOG (Section 25) */}
          {activeTab === 'changelog' && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white uppercase text-slate-400">
                  Registro de Versiones & Changelog
                </h4>
                <button
                  onClick={() => setShowNewChangelogModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                >
                  + Publicar Versión
                </button>
              </div>

              <div className="relative pl-6 space-y-3 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                {productChangelog.map((entry) => {
                  const catColor = {
                    Feature: 'bg-emerald-500/20 text-emerald-300',
                    Fix: 'bg-red-500/20 text-red-300',
                    Improvement: 'bg-blue-500/20 text-blue-300',
                    Security: 'bg-amber-500/20 text-amber-300',
                    'Breaking Change': 'bg-purple-500/20 text-purple-300',
                  }[entry.category];

                  return (
                    <div key={entry.id} className="relative">
                      <div className="absolute -left-6 top-1.5 h-3 w-3 rounded-full bg-indigo-500 ring-4 ring-slate-900" />
                      <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold font-mono text-white text-sm">{entry.version}</span>
                            <span className={`px-2 py-0.2 rounded text-[10px] font-bold ${catColor}`}>
                              {entry.category}
                            </span>
                          </div>
                          <span className="text-slate-400 font-mono text-[11px]">{entry.date}</span>
                        </div>
                        <p className="text-slate-300 leading-relaxed">{entry.change}</p>
                        <div className="text-[10px] text-slate-500">Por {entry.author}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB: COMPETIDORES (Section 30) */}
          {activeTab === 'competitors' && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white uppercase text-slate-400">
                  Benchmarking & Competidores de {product.name}
                </h4>
                <button
                  onClick={() => setShowNewCompetitorModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                >
                  + Registrar Competidor
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {productCompetitors.map((comp) => (
                  <div key={comp.id} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white text-sm">{comp.name}</h4>
                      {comp.url && (
                        <a
                          href={comp.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-indigo-400 hover:underline flex items-center gap-1 font-mono text-[11px]"
                        >
                          Visitar <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                    <p className="text-slate-300">{comp.description}</p>
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                      <div>
                        <span className="text-slate-400 font-semibold">Pricing:</span>{' '}
                        <span className="text-slate-200">{comp.pricing}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-semibold">Diferencial / Notas:</span>{' '}
                        <span className="text-slate-300">{comp.notes}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: TASKS */}
          {activeTab === 'tasks' && (
            <div className="space-y-3 text-xs">
              {productTasks.map((t) => (
                <div key={t.id} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex justify-between items-center">
                  <span className="font-medium text-white">{t.title}</span>
                  <span className="font-mono text-slate-400">{t.status}</span>
                </div>
              ))}
            </div>
          )}

          {/* TAB: ROADMAP */}
          {activeTab === 'roadmap' && (
            <div className="space-y-3 text-xs">
              {productRoadmap.map((r) => (
                <div key={r.id} className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <div className="flex justify-between font-bold text-white">
                    <span>{r.title}</span>
                    <span className="font-mono text-slate-400">{r.targetDate}</span>
                  </div>
                  <p className="text-slate-400">{r.description}</p>
                </div>
              ))}
            </div>
          )}

          {/* TAB: HISTORIAL */}
          {activeTab === 'history' && (
            <div className="space-y-3 text-xs">
              {product.stageHistory.map((h) => (
                <div key={h.id} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="font-mono text-slate-400">{h.changedAt}</span>: De {h.previousStage} a {h.newStage} por {h.changedBy}
                  {h.comment && <p className="text-slate-300 italic mt-1">"{h.comment}"</p>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/90 flex items-center justify-between text-xs text-slate-400">
          <span>Org ID: {product.organizationId}</span>
          <button
            onClick={closeProductDetail}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium"
          >
            Cerrar Ficha
          </button>
        </div>
      </div>

      {/* STAGE MODAL */}
      {showStageChangeModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100 space-y-4">
            <h3 className="font-bold text-white text-base">Avanzar Etapa del Ciclo de Vida</h3>
            <div className="text-xs text-slate-300 space-y-3">
              <select
                value={targetStage}
                onChange={(e) => setTargetStage(e.target.value as ProductStage)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
              >
                {ALL_STAGES.map((s) => (
                  <option key={s.stage} value={s.stage}>
                    {s.order}. {s.stage}
                  </option>
                ))}
              </select>
              <textarea
                rows={2}
                value={stageComment}
                onChange={(e) => setStageComment(e.target.value)}
                placeholder="Comentario sobre el hito alcanzado..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowStageChangeModal(false)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmStageChange}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NEW KNOWLEDGE DOC MODAL */}
      {showNewDocModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100 space-y-3 text-xs">
            <h3 className="font-bold text-white text-base">Nuevo Documento de Knowledge</h3>
            <form onSubmit={handleCreateKnowledgeDoc} className="space-y-3">
              <input
                type="text"
                required
                value={newDoc.title}
                onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
                placeholder="Título del documento o guía..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
              <select
                value={newDoc.category}
                onChange={(e) => setNewDoc({ ...newDoc, category: e.target.value as KnowledgeCategory })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
              >
                <option value="Documentación técnica">Documentación técnica</option>
                <option value="Documentación comercial">Documentación comercial</option>
                <option value="Decisiones de arquitectura">Decisiones de arquitectura</option>
                <option value="Procesos operativos">Procesos operativos</option>
                <option value="Enlaces clave">Enlaces clave</option>
                <option value="Notas generales">Notas generales</option>
              </select>
              <textarea
                rows={4}
                required
                value={newDoc.content}
                onChange={(e) => setNewDoc({ ...newDoc, content: e.target.value })}
                placeholder="Contenido de la documentación (NO incluir credenciales ni secretos)..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
              <textarea
                rows={2}
                value={newDoc.linksRaw}
                onChange={(e) => setNewDoc({ ...newDoc, linksRaw: e.target.value })}
                placeholder="Enlaces opcionales (formato: Título | URL por línea)"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewDocModal(false)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold"
                >
                  Guardar Documento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NEW CHANGELOG MODAL */}
      {showNewChangelogModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100 space-y-3 text-xs">
            <h3 className="font-bold text-white text-base">Registrar Nueva Versión en Changelog</h3>
            <form onSubmit={handleCreateChangelog} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  value={newChangelog.version}
                  onChange={(e) => setNewChangelog({ ...newChangelog, version: e.target.value })}
                  placeholder="v1.2.0"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                />
                <select
                  value={newChangelog.category}
                  onChange={(e) => setNewChangelog({ ...newChangelog, category: e.target.value as ChangelogCategory })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  <option value="Feature">Feature</option>
                  <option value="Fix">Fix</option>
                  <option value="Improvement">Improvement</option>
                  <option value="Security">Security</option>
                  <option value="Breaking Change">Breaking Change</option>
                </select>
              </div>
              <textarea
                rows={3}
                required
                value={newChangelog.change}
                onChange={(e) => setNewChangelog({ ...newChangelog, change: e.target.value })}
                placeholder="Descripción concisa de los cambios introducidos..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewChangelogModal(false)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancelar
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold">
                  Publicar Entrada
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NEW COMPETITOR MODAL */}
      {showNewCompetitorModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100 space-y-3 text-xs">
            <h3 className="font-bold text-white text-base">Registrar Competidor de Benchmarking</h3>
            <form onSubmit={handleCreateCompetitor} className="space-y-3">
              <input
                type="text"
                required
                value={newCompetitor.name}
                onChange={(e) => setNewCompetitor({ ...newCompetitor, name: e.target.value })}
                placeholder="Nombre del competidor..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
              <input
                type="url"
                value={newCompetitor.url}
                onChange={(e) => setNewCompetitor({ ...newCompetitor, url: e.target.value })}
                placeholder="https://competitor.com"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
              />
              <textarea
                rows={2}
                value={newCompetitor.description}
                onChange={(e) => setNewCompetitor({ ...newCompetitor, description: e.target.value })}
                placeholder="Descripción y propuesta de valor..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
              <input
                type="text"
                value={newCompetitor.pricing}
                onChange={(e) => setNewCompetitor({ ...newCompetitor, pricing: e.target.value })}
                placeholder="Estructura de precios del competidor..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
              <textarea
                rows={2}
                value={newCompetitor.notes}
                onChange={(e) => setNewCompetitor({ ...newCompetitor, notes: e.target.value })}
                placeholder="Nuestra ventaja competitiva frente a ellos..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewCompetitorModal(false)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancelar
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold">
                  Guardar Competidor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
