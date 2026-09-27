import React, { useState } from 'react';
import {
  Rocket,
  Search,
  DollarSign,
  Users,
  ChevronDown,
  Building,
  Command,
  Settings,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PWAInstallButton } from '../common/PWAInstallButton';

export const Header: React.FC = () => {
  const {
    currentUser,
    currentOrganization,
    products,
    customers,
    setIsCmdKOpen,
    setActiveTab,
  } = useApp();

  const [showUserMenu, setShowUserMenu] = useState(false);

  const totalMrr = products.reduce((acc, p) => acc + (p.mrr || 0), 0);
  const activeClients = customers.filter((c) => c.status === 'Activo').length;

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 py-2.5 transition-all">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Branding */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 shadow-md shadow-indigo-500/20 border border-indigo-400/30 text-white">
            <Rocket className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                SaaS Command Center
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.2 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Simple & Directo
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">Control ejecutivo de portafolio</p>
          </div>
        </div>

        {/* Center: Search & CMD+K */}
        <div className="hidden md:flex flex-1 max-w-sm mx-4">
          <button
            onClick={() => setIsCmdKOpen(true)}
            className="w-full flex items-center justify-between pl-3 pr-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-400 hover:text-slate-200 hover:border-slate-700 transition"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-slate-500" />
              <span>Buscar proyectos, clientes...</span>
            </div>
            <kbd className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono text-slate-400">
              <Command className="w-3 h-3" /> K
            </kbd>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Pill: MRR Total */}
          <button
            onClick={() => setActiveTab('finances')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold hover:bg-emerald-500/20 transition"
            title="Ver Finanzas"
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>${totalMrr.toLocaleString()} MRR</span>
          </button>

          {/* Quick Pill: Clientes Activos */}
          <button
            onClick={() => setActiveTab('customers')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold hover:bg-blue-500/20 transition"
            title="Ver Clientes"
          >
            <Users className="w-3.5 h-3.5" />
            <span>{activeClients} Clientes</span>
          </button>

          {/* PWA Install Button */}
          <PWAInstallButton />

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 transition"
            >
              <div className="h-7 w-7 rounded-lg bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 flex items-center justify-center font-bold text-xs">
                {currentUser.name.charAt(0)}
              </div>
              <div className="hidden sm:block text-left text-xs leading-tight">
                <span className="font-semibold text-slate-200 block">{currentUser.name}</span>
                <span className="text-[10px] text-indigo-400 block">{currentUser.role}</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-800 p-3 shadow-2xl z-50 text-slate-200 text-xs">
                <div className="px-3 py-2 border-b border-slate-800 mb-2">
                  <div className="font-semibold text-white text-sm">{currentUser.name}</div>
                  <div className="text-slate-400 text-xs truncate">{currentUser.email}</div>
                  <div className="mt-1 text-[11px] text-slate-500">
                    Org: {currentOrganization.name}
                  </div>
                </div>

                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      setActiveTab('settings');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition text-left"
                  >
                    <Settings className="w-4 h-4 text-indigo-400" />
                    <span>Configuración & Datos</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
