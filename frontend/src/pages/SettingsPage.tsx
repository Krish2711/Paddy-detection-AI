import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { HealthInfo } from '../types';
import { Settings, ShieldCheck, Database, HardDrive, RefreshCw, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface SettingsPageProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ darkMode, setDarkMode }) => {
  const [health, setHealth] = useState<HealthInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchHealth = async () => {
    setLoading(true);
    try {
      const data = await api.getHealth();
      setHealth(data);
    } catch (err) {
      setHealth(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Application Settings & System Status
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Inspect backend service status, storage configurations, and system health telemetry.
        </p>
      </div>

      {/* Health Telemetry Box */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 shadow-md border border-slate-200/80 dark:border-slate-800/80">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-paddy-600" />
            <span>Backend Telemetry & Status</span>
          </h2>

          <button
            onClick={fetchHealth}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-paddy-600 transition-colors"
            title="Refresh Status"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {health ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            
            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-slate-400 block mb-1">FastAPI Backend</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm capitalize">{health.status}</span>
              </div>
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            </div>

            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-slate-400 block mb-1">CNN Model Engine</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">
                  {health.model_loaded ? 'Active & Ready' : 'Unavailable'}
                </span>
              </div>
              {health.model_loaded ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              ) : (
                <AlertCircle className="w-5 h-5 text-amber-500" />
              )}
            </div>

            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-slate-400 block mb-1">SQLite Database</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">
                  {health.database_connected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              <Database className="w-5 h-5 text-paddy-600" />
            </div>

          </div>
        ) : (
          <div className="py-6 text-center text-slate-400 text-xs">
            Failed to connect to backend server. Make sure FastAPI is running on port 8000.
          </div>
        )}
      </div>

      {/* Resource & Restriction Limits */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 shadow-md border border-slate-200/80 dark:border-slate-800/80">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <HardDrive className="w-5 h-5 text-paddy-600" />
          <span>Upload Restrictions & File Policies</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-100/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 space-y-1">
            <span className="font-bold text-slate-900 dark:text-white block">Maximum File Size</span>
            <span className="text-slate-500">10 megabytes (10 MB) per upload request.</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-100/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 space-y-1">
            <span className="font-bold text-slate-900 dark:text-white block">Supported Formats</span>
            <span className="text-slate-500">JPEG (.jpg, .jpeg), PNG (.png), WebP (.webp), BMP (.bmp)</span>
          </div>
        </div>
      </div>

      {/* UI Preferences */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4 shadow-md border border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">Dark Theme Interface</h3>
          <p className="text-xs text-slate-500">Switch between dark mode and light agricultural mode.</p>
        </div>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            darkMode ? 'bg-paddy-600 text-white' : 'bg-slate-200 text-slate-800'
          }`}
        >
          {darkMode ? 'Dark Mode Active' : 'Light Mode Active'}
        </button>
      </div>

    </div>
  );
};
