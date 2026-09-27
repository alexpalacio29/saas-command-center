import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  Terminal,
  Send,
  HelpCircle,
  ShieldCheck,
  Zap,
  ArrowRight,
  Info,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AIAssistantView: React.FC = () => {
  const { products, leads, tasks } = useApp();
  const [selectedPrompt, setSelectedPrompt] = useState<string>('');

  const preparedQuestions = [
    '¿Qué SaaS necesita más atención?',
    '¿Qué leads debo contactar hoy?',
    '¿Qué productos no han tenido actividad reciente?',
    '¿Qué tareas están retrasadas?',
    '¿Cuánto MRR total y beneficio estimado tengo?',
    '¿Cuáles son mis próximos milestones en roadmaps?',
    'Muéstrame todos los prospectos de EduGest que llevan más de 7 días sin seguimiento.',
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 animate-in fade-in">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-500/30 shadow-xl space-y-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 block">
              Módulo de Inteligencia Artificial (Sección 50)
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              SaaS AI Assistant
            </h2>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
          Arquitectura preparada para consultas analíticas sobre el portafolio en lenguaje natural.
        </p>
      </div>

      {/* Compliance / Specification Banner */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-start gap-3 text-xs text-slate-300">
        <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="text-white block font-semibold">
            Principio de no-ficción funcional (Sección 46 & 50)
          </strong>
          <p className="text-slate-400 leading-relaxed">
            De acuerdo con el mandato de diseño, en esta versión no se simulan respuestas ficticias ni alucinadas. La interfaz y las rutas de consulta quedan estructuradas para enlazarse con el backend y las Edge Functions de Supabase.
          </p>
        </div>
      </div>

      {/* Preset Queries Library */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-md space-y-4 text-xs">
        <h3 className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span>Consultas Analíticas Preparadas</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {preparedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedPrompt(q)}
              className={`p-3 rounded-xl border text-left transition flex items-center justify-between gap-2 ${
                selectedPrompt === q
                  ? 'bg-indigo-950/60 border-indigo-500 text-white font-medium shadow-sm'
                  : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <span className="line-clamp-2">"{q}"</span>
              <ArrowRight className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* Prompt input box */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
        <input
          type="text"
          value={selectedPrompt}
          onChange={(e) => setSelectedPrompt(e.target.value)}
          placeholder="Escribe tu consulta ejecutiva sobre el portafolio..."
          className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
        />
        <button
          onClick={() => {
            if (selectedPrompt) {
              alert(`Consulta preparada: "${selectedPrompt}". El endpoint de inferencia se conectará en Fase 2.`);
            }
          }}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shrink-0 flex items-center gap-1.5 transition"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Consultar</span>
        </button>
      </div>
    </div>
  );
};
