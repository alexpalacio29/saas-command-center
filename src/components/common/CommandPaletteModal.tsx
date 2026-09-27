import React, { useState } from 'react';
import {
  Search,
  Box,
  Users,
  Target,
  CheckSquare,
  Lightbulb,
  FileText,
  Bug,
  X,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CommandPaletteModal: React.FC = () => {
  const {
    isCmdKOpen,
    setIsCmdKOpen,
    products,
    customers,
    leads,
    tasks,
    ideas,
    knowledgeDocs,
    openProductDetail,
    setActiveTab,
  } = useApp();

  const [query, setQuery] = useState('');

  if (!isCmdKOpen) return null;

  const q = query.toLowerCase().trim();

  // Search matches
  const matchedProducts = q ? products.filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)) : [];
  const matchedCustomers = q ? customers.filter((c) => c.name.toLowerCase().includes(q) || c.company.toLowerCase().includes(q)) : [];
  const matchedLeads = q ? leads.filter((l) => l.name.toLowerCase().includes(q) || l.institutionOrCompany.toLowerCase().includes(q)) : [];
  const matchedTasks = q ? tasks.filter((t) => t.title.toLowerCase().includes(q)) : [];
  const matchedIdeas = q ? ideas.filter((i) => i.title.toLowerCase().includes(q) || i.problem.toLowerCase().includes(q)) : [];
  const matchedDocs = q ? knowledgeDocs.filter((d) => d.title.toLowerCase().includes(q) || d.content.toLowerCase().includes(q)) : [];

  const totalResults =
    matchedProducts.length +
    matchedCustomers.length +
    matchedLeads.length +
    matchedTasks.length +
    matchedIdeas.length +
    matchedDocs.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl text-slate-100 overflow-hidden flex flex-col max-h-[75vh]">
        {/* Search input header */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-950">
          <Search className="w-5 h-5 text-indigo-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar productos, clientes, leads, tareas, ideas, documentación..."
            className="w-full bg-transparent text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none"
          />
          <kbd className="hidden sm:inline-block px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] text-slate-400 font-mono">
            ESC
          </kbd>
          <button
            onClick={() => setIsCmdKOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results area */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs">
          {!q && (
            <div className="py-8 text-center text-slate-400 space-y-2">
              <p className="text-sm font-medium text-slate-300">
                Escribe algo para buscar en todo el sistema
              </p>
              <p className="text-xs text-slate-500">
                Atajo global activo: <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">CMD + K</kbd> / <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">CTRL + K</kbd>
              </p>
            </div>
          )}

          {q && totalResults === 0 && (
            <div className="py-10 text-center text-slate-400">
              No se encontraron coincidencias para "{query}".
            </div>
          )}

          {/* Products */}
          {matchedProducts.length > 0 && (
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block mb-1.5 flex items-center gap-1.5">
                <Box className="w-3.5 h-3.5 text-indigo-400" /> Productos SaaS ({matchedProducts.length})
              </span>
              <div className="space-y-1">
                {matchedProducts.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      setIsCmdKOpen(false);
                      openProductDetail(p.id);
                    }}
                    className="p-2.5 rounded-xl bg-slate-950/70 hover:bg-indigo-950/40 border border-slate-800/80 cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-white text-xs">{p.name}</span>
                      <span className="text-slate-400 ml-2 text-[11px]">{p.category}</span>
                    </div>
                    <span className="text-emerald-400 font-mono font-bold">${p.mrr} MRR</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Leads */}
          {matchedLeads.length > 0 && (
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block mb-1.5 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-blue-400" /> Leads / CRM ({matchedLeads.length})
              </span>
              <div className="space-y-1">
                {matchedLeads.map((l) => (
                  <div
                    key={l.id}
                    onClick={() => {
                      setIsCmdKOpen(false);
                      setActiveTab('pipeline');
                    }}
                    className="p-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-800 border border-slate-800/80 cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-white">{l.name}</span>
                      <span className="text-slate-400 ml-2 text-[11px]">({l.institutionOrCompany})</span>
                    </div>
                    <span className="text-blue-300 font-mono font-semibold">{l.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Customers */}
          {matchedCustomers.length > 0 && (
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block mb-1.5 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-emerald-400" /> Clientes ({matchedCustomers.length})
              </span>
              <div className="space-y-1">
                {matchedCustomers.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => {
                      setIsCmdKOpen(false);
                      setActiveTab('customers');
                    }}
                    className="p-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-800 border border-slate-800/80 cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-white">{c.name}</span>
                      <span className="text-slate-400 ml-2 text-[11px]">{c.company}</span>
                    </div>
                    <span className="text-emerald-400 font-mono font-bold">${c.mrr} MRR</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tasks */}
          {matchedTasks.length > 0 && (
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block mb-1.5 flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5 text-indigo-400" /> Tareas ({matchedTasks.length})
              </span>
              <div className="space-y-1">
                {matchedTasks.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => {
                      setIsCmdKOpen(false);
                      setActiveTab('tasks');
                    }}
                    className="p-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-800 border border-slate-800/80 cursor-pointer flex items-center justify-between"
                  >
                    <span className="font-medium text-white">{t.title}</span>
                    <span className="text-slate-400 font-mono text-[10px]">{t.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ideas */}
          {matchedIdeas.length > 0 && (
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block mb-1.5 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" /> Idea Vault ({matchedIdeas.length})
              </span>
              <div className="space-y-1">
                {matchedIdeas.map((i) => (
                  <div
                    key={i.id}
                    onClick={() => {
                      setIsCmdKOpen(false);
                      setActiveTab('ideas');
                    }}
                    className="p-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-800 border border-slate-800/80 cursor-pointer flex items-center justify-between"
                  >
                    <span className="font-medium text-white">{i.title}</span>
                    <span className="text-amber-400 font-mono text-[10px]">{i.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Knowledge Docs */}
          {matchedDocs.length > 0 && (
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block mb-1.5 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-purple-400" /> Documentación Knowledge ({matchedDocs.length})
              </span>
              <div className="space-y-1">
                {matchedDocs.map((d) => (
                  <div
                    key={d.id}
                    onClick={() => {
                      setIsCmdKOpen(false);
                      openProductDetail(d.productId);
                    }}
                    className="p-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-800 border border-slate-800/80 cursor-pointer flex items-center justify-between"
                  >
                    <span className="font-medium text-white">{d.title}</span>
                    <span className="text-purple-300 font-mono text-[10px]">{d.category}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-[11px] text-slate-500">
          <span>Pulsa un resultado para navegar directamente</span>
          <span>Búsqueda Multi-Entidad</span>
        </div>
      </div>
    </div>
  );
};
