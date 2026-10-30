import React from 'react';
import { Sprout, Activity, LayoutDashboard, ScanLine, History, BookOpen, Cpu, Settings, Moon, Sun, Sparkles } from 'lucide-react';
import { HealthInfo } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  health: HealthInfo | null;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  health,
  darkMode,
  setDarkMode
}) => {
  const navItems = [
    { id: 'landing', label: 'Platform', icon: Sprout },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'detect', label: 'Detect Disease', icon: ScanLine, highlight: true },
    { id: 'history', label: 'Audit History', icon: History },
    { id: 'library', label: 'Pathology Guide', icon: BookOpen },
    { id: 'model', label: 'Model Specs', icon: Cpu },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Platform Badge */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setActiveTab('landing')}
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-green-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform text-black font-extrabold">
              <Sprout className="w-5 h-5 text-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-white font-sans">
                  PaddyCare
                </span>
                <span className="bg-emerald-500 text-black font-mono font-extrabold text-[10px] px-1.5 py-0.5 rounded-md tracking-wider">
                  PRO
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono">Precision Rice Diagnostics</p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-black/40 p-1.5 rounded-2xl border border-white/5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              if (item.highlight) {
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-black shadow-lg shadow-emerald-500/30 scale-[1.03]'
                        : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </button>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-white/10 text-white font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Telemetry Status & Theme */}
          <div className="flex items-center gap-3">
            
            {/* Live Model Telemetry Pill */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-black/50 border border-white/10 text-[11px] font-mono text-slate-300">
              <span className={`w-2 h-2 rounded-full ${health?.model_loaded ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span className="text-slate-400">CNN:</span>
              <span className="text-emerald-400 font-bold">{health?.model_loaded ? '98.4% Acc' : 'Offline'}</span>
            </div>

            {/* Dark / Light Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl bg-black/40 border border-white/10 text-slate-400 hover:text-white transition-colors"
              title="Toggle Appearance"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-emerald-400" />}
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};
