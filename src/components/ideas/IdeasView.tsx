import React, { useState } from 'react';
import {
  Lightbulb,
  Plus,
  Sparkles,
  ArrowRight,
  TrendingUp,
  CheckCircle,
  XCircle,
  HelpCircle,
  Zap,
  Filter,
  Search,
  BookOpen,
  Edit2,
  Save,
  Check,
  ChevronDown,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { IdeaItem, IdeaVaultStatus, IdeaValidationDetails } from '../../types';

export const IdeasView: React.FC = () => {
  const { ideas, addIdea, updateIdea, deleteIdea, promoteIdeaToProduct, openProductDetail, currentUser } = useApp();

  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [showNewIdeaModal, setShowNewIdeaModal] = useState(false);
  const [selectedIdeaForValidation, setSelectedIdeaForValidation] = useState<IdeaItem | null>(null);

  // New idea state (Section 22 fields)
  const [newIdeaData, setNewIdeaData] = useState<Omit<IdeaItem, 'id' | 'createdAt' | 'organizationId'>>({
    title: '',
    description: '',
    problem: '',
    targetAudience: '',
    solution: '',
    competition: '',
    businessModel: '',
    category: 'B2B / SaaS',
    notes: '',
    date: new Date().toISOString().split('T')[0],
    status: 'IDEA',
    validation: {
      hipotesis: '',
      problema: '',
      segmento: '',
      entrevistas: '',
      evidencias: '',
      competencia: '',
      riesgos: '',
      oportunidades: '',
      conclusionUsuario: '',
    },
  });

  const statuses: IdeaVaultStatus[] = [
    'IDEA',
    'INVESTIGACIÓN',
    'VALIDACIÓN',
    'APROBADA',
    'MVP',
    'DESCARTADA',
    'PAUSADA',
  ];

  const statusColors: Record<IdeaVaultStatus, string> = {
    IDEA: 'bg-slate-800 text-slate-300 border-slate-700',
    INVESTIGACIÓN: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    VALIDACIÓN: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    APROBADA: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    MVP: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    DESCARTADA: 'bg-red-500/20 text-red-300 border-red-500/30',
    PAUSADA: 'bg-slate-800 text-slate-400 border-slate-700',
  };

  const filteredIdeas = ideas.filter((idea) => {
    if (selectedStatusFilter !== 'ALL' && idea.status !== selectedStatusFilter) return false;
    return true;
  });

  const handleCreateIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIdeaData.title) return;
    addIdea(newIdeaData);
    setShowNewIdeaModal(false);
    setNewIdeaData({
      title: '',
      description: '',
      problem: '',
      targetAudience: '',
      solution: '',
      competition: '',
      businessModel: '',
      category: 'B2B / SaaS',
      notes: '',
      date: new Date().toISOString().split('T')[0],
      status: 'IDEA',
      validation: {
        hipotesis: '',
        problema: '',
        segmento: '',
        entrevistas: '',
        evidencias: '',
        competencia: '',
        riesgos: '',
        oportunidades: '',
        conclusionUsuario: '',
      },
    });
  };

  const handleSaveValidation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIdeaForValidation) return;
    updateIdea(selectedIdeaForValidation.id, {
      validation: selectedIdeaForValidation.validation,
      status: selectedIdeaForValidation.status,
    });
    setSelectedIdeaForValidation(null);
  };

  const handlePromote = (ideaId: string) => {
    const created = promoteIdeaToProduct(ideaId);
    openProductDetail(created.id);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-amber-400" />
            <span>Idea Vault & Validación de Oportunidades</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Registro estructurado de ideas y cuaderno de validación cualitativa (sin notas artificiales)
          </p>
        </div>

        <button
          onClick={() => setShowNewIdeaModal(true)}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/20 flex items-center gap-2 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Nueva Idea</span>
        </button>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
        <Filter className="w-4 h-4 text-amber-400" />
        <span className="font-semibold text-slate-300">Estado de Madurez:</span>
        <select
          value={selectedStatusFilter}
          onChange={(e) => setSelectedStatusFilter(e.target.value)}
          className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-white"
        >
          <option value="ALL">Todas las Ideas ({ideas.length})</option>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Grid of Ideas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredIdeas.map((idea) => (
          <div
            key={idea.id}
            className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-md flex flex-col justify-between space-y-4 text-xs"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusColors[idea.status]}`}>
                  {idea.status}
                </span>
                <span className="text-[11px] font-mono text-slate-400">{idea.date}</span>
              </div>

              <div>
                <h3 className="font-bold text-white text-base leading-snug">{idea.title}</h3>
                <span className="text-[11px] text-slate-400 font-medium">{idea.category}</span>
              </div>

              <p className="text-slate-300 line-clamp-2">{idea.description || idea.problem}</p>

              <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-semibold">Público Objetivo:</span>
                  <div className="text-slate-200">{idea.targetAudience}</div>
                </div>
                <div>
                  <span className="text-indigo-400 text-[10px] uppercase font-semibold">Solución:</span>
                  <div className="text-slate-200 line-clamp-2">{idea.solution}</div>
                </div>
              </div>

              {idea.validation?.conclusionUsuario && (
                <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-emerald-300 text-[11px]">
                  <strong>Conclusión del Fundador:</strong> "{idea.validation.conclusionUsuario}"
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-800/80 space-y-2">
              <button
                onClick={() => setSelectedIdeaForValidation(idea)}
                className="w-full py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold flex items-center justify-center gap-1.5"
              >
                <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                <span>Cuaderno de Validación</span>
              </button>

              {idea.status === 'APROBADA' || idea.status === 'MVP' ? (
                <button
                  onClick={() => handlePromote(idea.id)}
                  className="w-full py-1.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center justify-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Convertir a Producto SaaS →</span>
                </button>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: CUADERNO DE VALIDACIÓN DE IDEAS (Section 23) */}
      {selectedIdeaForValidation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in">
          <div className="w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100 space-y-4 my-auto max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-400" />
                  <span>Cuaderno de Validación: {selectedIdeaForValidation.title}</span>
                </h3>
                <span className="text-slate-400 text-xs">
                  Criterios cualitativos propios del fundador (sin scores artificiales)
                </span>
              </div>
              <button
                onClick={() => setSelectedIdeaForValidation(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveValidation} className="space-y-3.5 text-slate-300">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-slate-400">Estado de Madurez:</span>
                <select
                  value={selectedIdeaForValidation.status}
                  onChange={(e) =>
                    setSelectedIdeaForValidation({
                      ...selectedIdeaForValidation,
                      status: e.target.value as IdeaVaultStatus,
                    })
                  }
                  className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-white font-bold"
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">1. Hipótesis Principal de Valor</label>
                <textarea
                  rows={2}
                  value={selectedIdeaForValidation.validation.hipotesis}
                  onChange={(e) =>
                    setSelectedIdeaForValidation({
                      ...selectedIdeaForValidation,
                      validation: { ...selectedIdeaForValidation.validation, hipotesis: e.target.value },
                    })
                  }
                  placeholder="¿Qué creemos que el cliente pagará por resolver?"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">2. Segmento de Clientes</label>
                  <input
                    type="text"
                    value={selectedIdeaForValidation.validation.segmento}
                    onChange={(e) =>
                      setSelectedIdeaForValidation({
                        ...selectedIdeaForValidation,
                        validation: { ...selectedIdeaForValidation.validation, segmento: e.target.value },
                      })
                    }
                    placeholder="Perfil exacto del tomador de decisión"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">3. Entrevistas Realizadas</label>
                  <input
                    type="text"
                    value={selectedIdeaForValidation.validation.entrevistas}
                    onChange={(e) =>
                      setSelectedIdeaForValidation({
                        ...selectedIdeaForValidation,
                        validation: { ...selectedIdeaForValidation.validation, entrevistas: e.target.value },
                      })
                    }
                    placeholder="Cantidad de entrevistas y descubrimientos"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">4. Evidencias de Dolor o Demanda</label>
                <textarea
                  rows={2}
                  value={selectedIdeaForValidation.validation.evidencias}
                  onChange={(e) =>
                    setSelectedIdeaForValidation({
                      ...selectedIdeaForValidation,
                      validation: { ...selectedIdeaForValidation.validation, evidencias: e.target.value },
                    })
                  }
                  placeholder="Pruebas reales: cartas de intención, pagos piloto, listas de espera..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">5. Riesgos Principales</label>
                  <textarea
                    rows={2}
                    value={selectedIdeaForValidation.validation.riesgos}
                    onChange={(e) =>
                      setSelectedIdeaForValidation({
                        ...selectedIdeaForValidation,
                        validation: { ...selectedIdeaForValidation.validation, riesgos: e.target.value },
                      })
                    }
                    placeholder="Regulación, costos de adquisición, adopción lenta..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">6. Oportunidades Clave</label>
                  <textarea
                    rows={2}
                    value={selectedIdeaForValidation.validation.oportunidades}
                    onChange={(e) =>
                      setSelectedIdeaForValidation({
                        ...selectedIdeaForValidation,
                        validation: { ...selectedIdeaForValidation.validation, oportunidades: e.target.value },
                      })
                    }
                    placeholder="Expansión a otros mercados, alianzas..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-emerald-400 font-bold block mb-1">
                  7. Conclusión Definitiva del Fundador
                </label>
                <textarea
                  rows={2}
                  value={selectedIdeaForValidation.validation.conclusionUsuario}
                  onChange={(e) =>
                    setSelectedIdeaForValidation({
                      ...selectedIdeaForValidation,
                      validation: { ...selectedIdeaForValidation.validation, conclusionUsuario: e.target.value },
                    })
                  }
                  placeholder="¿Merece convertirse en producto SaaS? Justificación final..."
                  className="w-full bg-slate-950 border border-emerald-500/40 rounded-xl px-3 py-2 text-white font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedIdeaForValidation(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                >
                  Guardar Validación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: REGISTRAR NUEVA IDEA (Section 22) */}
      {showNewIdeaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in">
          <div className="w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-slate-100 space-y-4 my-auto text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">Registrar Nueva Idea en Idea Vault</h3>
              <button onClick={() => setShowNewIdeaModal(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateIdea} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Nombre de la Idea *</label>
                  <input
                    type="text"
                    required
                    value={newIdeaData.title}
                    onChange={(e) => setNewIdeaData({ ...newIdeaData, title: e.target.value })}
                    placeholder="Ej: RentProp RD"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Categoría</label>
                  <input
                    type="text"
                    value={newIdeaData.category}
                    onChange={(e) => setNewIdeaData({ ...newIdeaData, category: e.target.value })}
                    placeholder="Ej: PropTech / Finanzas"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Problema Detectado *</label>
                <textarea
                  rows={2}
                  required
                  value={newIdeaData.problem}
                  onChange={(e) => setNewIdeaData({ ...newIdeaData, problem: e.target.value })}
                  placeholder="¿Cuál es el dolor real que experimenta el cliente?"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Público Objetivo *</label>
                  <input
                    type="text"
                    required
                    value={newIdeaData.targetAudience}
                    onChange={(e) => setNewIdeaData({ ...newIdeaData, targetAudience: e.target.value })}
                    placeholder="Ej: Propietarios de 5 a 50 inmuebles"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Modelo de Negocio</label>
                  <input
                    type="text"
                    value={newIdeaData.businessModel}
                    onChange={(e) => setNewIdeaData({ ...newIdeaData, businessModel: e.target.value })}
                    placeholder="Ej: $25/mes base + $1 por unidad"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Solución Propuesta *</label>
                <textarea
                  rows={2}
                  required
                  value={newIdeaData.solution}
                  onChange={(e) => setNewIdeaData({ ...newIdeaData, solution: e.target.value })}
                  placeholder="¿Cómo lo resuelve el software?"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Competencia Conocida</label>
                <input
                  type="text"
                  value={newIdeaData.competition}
                  onChange={(e) => setNewIdeaData({ ...newIdeaData, competition: e.target.value })}
                  placeholder="Hojas de Excel, software tradicional..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewIdeaModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                >
                  Guardar en Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
