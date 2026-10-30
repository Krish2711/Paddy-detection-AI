import React from 'react';
import { Sprout, Activity, LayoutDashboard, ScanLine, History, BookOpen, Cpu, Settings, Moon, Sun } from 'lucide-react';
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
    { id: 'landing', label: 'Home', icon: Sprout },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'detect', label: 'Detect Disease', icon: ScanLine, highlight: true },
    { id: 'history', label: 'History', icon: History },
    { id: 'library', label: 'Disease Guide', icon: BookOpen },
    { id: 'model', label: 'Model Specs', icon: Cpu },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Branding */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setActiveTab('landing')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-paddy-700 to-paddy-500 flex items-center justify-center shadow-md shadow-paddy-900/20 group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5 font-sans">
                PaddyCare <span className="text-paddy-600 dark:text-paddy-400 font-normal text-sm bg-paddy-100 dark:bg-paddy-950 px-2 py-0.5 rounded-full border border-paddy-200 dark:border-paddy-800">AI</span>
              </span>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Precision Rice Health Diagnostics</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              if (item.highlight) {
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 shadow-md ${
                      isActive
                        ? 'bg-paddy-600 text-white shadow-paddy-600/30 scale-105 ring-2 ring-paddy-400'
                        : 'bg-paddy-600 hover:bg-paddy-700 text-white shadow-paddy-600/20 hover:scale-105'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl font-medium text-sm transition-all duration-150 ${
                    isActive
                      ? 'bg-paddy-100 text-paddy-800 dark:bg-paddy-950/80 dark:text-paddy-300 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-paddy-700 dark:hover:text-paddy-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* System Status & Theme Toggle */}
          <div className="flex items-center gap-3">
            
            {/* Health Badge */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300">
              <span className={`w-2 h-2 rounded-full ${health?.model_loaded ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <Activity className="w-3.5 h-3.5 text-slate-400" />
              <span>{health?.model_loaded ? 'Model Ready' : 'Model Loading'}</span>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-paddy-600 dark:hover:text-paddy-400 transition-colors"
              title="Toggle Theme"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};
