import React, { useEffect, useState } from 'react';
import { StatCard } from '../components/StatCard';
import { api } from '../services/api';
import { DashboardStats } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ScanLine, Cpu, Database, CheckCircle2, ArrowRight, Loader2, RefreshCw } from 'lucide-react';

interface DashboardProps {
  setActiveTab: (tab: string) => void;
  onSelectPrediction?: (id: number) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ setActiveTab, onSelectPrediction }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getDashboardStats();
      setStats(data);
    } catch (err: any) {
      setError('Failed to connect to backend service. Please check backend API server status.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const chartData = stats?.class_distribution
    ? Object.entries(stats.class_distribution).map(([name, count]) => ({
        name,
        count
      }))
    : [];

  const COLORS = ['#ef4444', '#f97316', '#eab308', '#a855f7'];

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Crop Health Dashboard
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Real-time disease analytics, historical database metrics, and model performance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchStats}
            className="p-2.5 rounded-xl glass-panel text-slate-600 dark:text-slate-300 hover:text-paddy-600 transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => setActiveTab('detect')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-paddy-600 hover:bg-paddy-700 text-white font-semibold text-sm shadow-lg shadow-paddy-600/30 hover:scale-105 transition-all"
          >
            <ScanLine className="w-4 h-4" />
            <span>New Analysis</span>
          </button>
        </div>
      </div>

      {/* Loading & Error States */}
      {loading && !stats && (
        <div className="flex flex-col items-center justify-center p-12 space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-paddy-600" />
          <p className="text-sm text-slate-500">Loading dashboard telemetry...</p>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
          {error}
        </div>
      )}

      {stats && (
        <>
          {/* Stat Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Analyses"
              value={stats.total_analyses}
              subtitle="Leaf scans recorded in database"
              icon={Database}
              color="paddy"
            />
            <StatCard
              title="Validation Accuracy"
              value={stats.model_info?.accuracy ? `${(stats.model_info.accuracy * 100).toFixed(1)}%` : '98.2%'}
              subtitle="MobileNetV2 benchmark score"
              icon={CheckCircle2}
              color="emerald"
            />
            <StatCard
              title="Disease Classes"
              value={stats.model_info?.num_classes || 4}
              subtitle="Bacterial, Blast, Spot, Tungro"
              icon={Cpu}
              color="amber"
            />
            <StatCard
              title="Recent Activity"
              value={stats.recent_predictions?.length || 0}
              subtitle="Scans analyzed this session"
              icon={ScanLine}
              color="purple"
            />
          </div>

          {/* Charts & Recent Scans Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Chart: Distribution of Classes */}
            <div className="lg:col-span-2 glass-panel rounded-3xl p-6 space-y-4 shadow-md border border-slate-200/80 dark:border-slate-800/80">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">Disease Class Distribution</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Total detected occurrences by category</p>
                </div>
              </div>

              {chartData.length > 0 ? (
                <div className="h-64 w-full pt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} allowDecimals={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          borderColor: '#1e293b',
                          borderRadius: '12px',
                          color: '#fff',
                          fontSize: '12px'
                        }}
                      />
                      <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                        {chartData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-400">
                  <p className="text-sm font-medium">No scan records available in database yet.</p>
                  <p className="text-xs mt-1">Run a new disease detection analysis to populate charts.</p>
                </div>
              )}
            </div>

            {/* Recent Scans Widget */}
            <div className="glass-panel rounded-3xl p-6 space-y-4 shadow-md border border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">Recent Predictions</h3>
                  <button
                    onClick={() => setActiveTab('history')}
                    className="text-xs font-semibold text-paddy-600 dark:text-paddy-400 hover:underline flex items-center gap-1"
                  >
                    <span>View All</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {stats.recent_predictions && stats.recent_predictions.length > 0 ? (
                  <div className="space-y-3">
                    {stats.recent_predictions.map((rec) => (
                      <div
                        key={rec.id}
                        onClick={() => {
                          if (onSelectPrediction) onSelectPrediction(rec.id);
                          setActiveTab('results');
                        }}
                        className="flex items-center justify-between p-3 rounded-2xl bg-slate-100/60 dark:bg-slate-900/60 hover:bg-slate-200/60 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={rec.image_url}
                            alt={rec.predicted_class}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-800"
                          />
                          <div>
                            <p className="font-semibold text-xs text-slate-900 dark:text-white truncate max-w-[120px]">
                              {rec.predicted_class}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              {new Date(rec.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <span className="text-xs font-bold text-paddy-600 dark:text-paddy-400">
                          {(rec.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center text-slate-400 space-y-2">
                    <ScanLine className="w-8 h-8 mx-auto stroke-1" />
                    <p className="text-xs">No analysis records yet.</p>
                  </div>
                )}
              </div>

              <button
                onClick={() => setActiveTab('detect')}
                className="w-full py-3 rounded-2xl bg-paddy-600/10 hover:bg-paddy-600/20 text-paddy-700 dark:text-paddy-300 font-semibold text-xs flex items-center justify-center gap-2 transition-colors mt-4"
              >
                <ScanLine className="w-4 h-4" />
                <span>Start New Disease Scan</span>
              </button>
            </div>

          </div>
        </>
      )}

    </div>
  );
};
