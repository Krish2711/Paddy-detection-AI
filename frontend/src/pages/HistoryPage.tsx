import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { PredictionRecord, PredictionListResponse } from '../types';
import { 
  History, Search, Download, Trash2, Eye, ChevronLeft, ChevronRight, 
  Loader2, AlertCircle, ArrowDownWideNarrow, ArrowUpNarrowWide, LayoutGrid, 
  ListFilter, ShieldAlert, Sparkles, Calendar, Layers, X
} from 'lucide-react';

interface HistoryPageProps {
  onSelectPrediction: (id: number) => void;
  setActiveTab: (tab: string) => void;
}

const DISEASE_OPTIONS = [
  { id: 'all', label: 'All Diagnoses', color: 'bg-emerald-500' },
  { id: 'Bacterialblight', label: 'Bacterial Blight', color: 'bg-rose-500' },
  { id: 'Blast', label: 'Rice Blast', color: 'bg-amber-500' },
  { id: 'Brownspot', label: 'Brown Spot', color: 'bg-yellow-500' },
  { id: 'Tungro', label: 'Rice Tungro', color: 'bg-purple-500' },
];

export const HistoryPage: React.FC<HistoryPageProps> = ({ onSelectPrediction, setActiveTab }) => {
  const [data, setData] = useState<PredictionListResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>('');
  const [diseaseClass, setDiseaseClass] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [inspectedRecord, setInspectedRecord] = useState<PredictionRecord | null>(null);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getPredictions({
        page,
        page_size: viewMode === 'grid' ? 12 : 10,
        search: search.trim() || undefined,
        disease_class: diseaseClass !== 'all' ? diseaseClass : undefined,
        sort_order: sortOrder
      });
      setData(res);
    } catch (err: any) {
      setError('Unable to load history records. Please verify database connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [page, diseaseClass, sortOrder, viewMode]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchHistory();
  };

  const handleSelectFilter = (id: string) => {
    setDiseaseClass(id);
    setPage(1);
  };

  const handleToggleSort = () => {
    setSortOrder(prev => (prev === 'desc' ? 'asc' : 'desc'));
    setPage(1);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this diagnosis record?')) return;
    setDeletingId(id);
    try {
      await api.deletePrediction(id);
      if (inspectedRecord?.id === id) setInspectedRecord(null);
      await fetchHistory();
    } catch (err: any) {
      alert('Failed to delete diagnosis record.');
    } finally {
      setDeletingId(null);
    }
  };

  const getDiseaseBadgeColor = (cls: string) => {
    switch (cls) {
      case 'Bacterialblight': return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      case 'Blast': return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'Brownspot': return 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30';
      case 'Tungro': return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
      default: return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Top Telemetry Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-medium mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>SQLite Diagnostic Audit Trail</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Diagnostic History & Audit
          </h1>
          <p className="text-sm text-slate-400">
            Real-time querying, filterable by biological class, chronological order, and keyword.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center rounded-xl bg-slate-900/80 p-1 border border-white/10">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
              title="Grid Card View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
              title="Audit Table View"
            >
              <ListFilter className="w-4 h-4" />
            </button>
          </div>

          {/* Export CSV Button */}
          <a
            href={api.getExportCsvUrl()}
            download="paddycare_history.csv"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all shadow-lg shadow-emerald-950/40"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </a>
        </div>
      </div>

      {/* Disease Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {DISEASE_OPTIONS.map((opt) => {
          const isActive = diseaseClass.toLowerCase() === opt.id.toLowerCase();
          return (
            <button
              key={opt.id}
              onClick={() => handleSelectFilter(opt.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 border ${
                isActive
                  ? 'bg-emerald-500 text-black border-emerald-400 shadow-lg shadow-emerald-500/20 font-bold scale-[1.02]'
                  : 'glass-panel text-slate-300 hover:bg-white/10 border-white/10'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${opt.color}`} />
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search Bar & Chronological Sort Toggle */}
      <div className="glass-panel rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
        
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search filename or diagnosis..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
          {search && (
            <button
              type="button"
              onClick={() => { setSearch(''); setPage(1); }}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </form>

        {/* Chronological Sorting Switch */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleSort}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black/40 hover:bg-black/60 border border-white/10 text-xs font-medium text-slate-200 transition-colors"
            title="Toggle Sort Order"
          >
            {sortOrder === 'desc' ? (
              <>
                <ArrowDownWideNarrow className="w-4 h-4 text-emerald-400" />
                <span>Newest First (Latest)</span>
              </>
            ) : (
              <>
                <ArrowUpNarrowWide className="w-4 h-4 text-emerald-400" />
                <span>Oldest First (Earliest)</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* Loading & Error States */}
      {loading && (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
          <p className="text-xs text-slate-400">Loading audit records from SQLite...</p>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Content View: Grid vs Table */}
      {!loading && data && (
        <>
          {data.records.length > 0 ? (
            viewMode === 'grid' ? (
              /* Grid Mode */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.records.map((rec) => {
                  const confPct = (rec.confidence * 100).toFixed(1);
                  return (
                    <div
                      key={rec.id}
                      className="glass-panel rounded-3xl p-5 space-y-4 hover:border-emerald-500/40 transition-all duration-300 group flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        {/* Leaf Image Container */}
                        <div className="relative aspect-video rounded-2xl overflow-hidden bg-black/60 border border-white/10 group-hover:scale-[1.01] transition-transform">
                          <img
                            src={rec.image_url}
                            alt={rec.predicted_class}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-3 left-3">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border backdrop-blur-md uppercase tracking-wider ${getDiseaseBadgeColor(rec.predicted_class)}`}>
                              {rec.predicted_class}
                            </span>
                          </div>
                          <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-lg text-[10px] font-mono text-emerald-400 border border-emerald-500/30">
                            {confPct}%
                          </div>
                        </div>

                        {/* Title & Metadata */}
                        <div>
                          <p className="font-bold text-sm text-white truncate" title={rec.original_filename}>
                            {rec.original_filename}
                          </p>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                            <Calendar className="w-3 h-3 text-slate-500" />
                            <span>{new Date(rec.created_at).toLocaleString()}</span>
                            <span>•</span>
                            <span className="font-mono">#{rec.id}</span>
                          </div>
                        </div>

                        {/* Mini Probability Bar */}
                        <div className="space-y-1 pt-1">
                          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                            <span>Top Confidence</span>
                            <span className="text-emerald-400">{confPct}%</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-black/40 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                              style={{ width: `${Math.max(rec.confidence * 100, 5)}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-3 border-t border-white/5">
                        <button
                          onClick={() => setInspectedRecord(rec)}
                          className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Quick Inspect</span>
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              onSelectPrediction(rec.id);
                              setActiveTab('results');
                            }}
                            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-[11px] font-medium transition-colors"
                          >
                            Full Report
                          </button>
                          <button
                            onClick={() => handleDelete(rec.id)}
                            disabled={deletingId === rec.id}
                            className="p-1.5 rounded-xl hover:bg-rose-500/20 text-rose-400 transition-colors disabled:opacity-40"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            ) : (
              /* Dense Audit Table Mode */
              <div className="glass-panel rounded-3xl overflow-hidden border border-white/10">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-black/40 text-slate-400 uppercase font-mono tracking-wider text-[10px] border-b border-white/10">
                      <tr>
                        <th className="p-4">ID</th>
                        <th className="p-4">Leaf Sample</th>
                        <th className="p-4">Classification</th>
                        <th className="p-4">Confidence</th>
                        <th className="p-4">Original File</th>
                        <th className="p-4">Timestamp</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-medium">
                      {data.records.map((rec) => (
                        <tr key={rec.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-4 font-mono text-slate-400">#{rec.id}</td>
                          <td className="p-4">
                            <img
                              src={rec.image_url}
                              alt={rec.predicted_class}
                              className="w-12 h-12 rounded-xl object-cover border border-white/10"
                            />
                          </td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getDiseaseBadgeColor(rec.predicted_class)}`}>
                              {rec.predicted_class}
                            </span>
                          </td>
                          <td className="p-4 font-mono font-bold text-emerald-400">
                            {(rec.confidence * 100).toFixed(1)}%
                          </td>
                          <td className="p-4 text-slate-300 max-w-xs truncate">{rec.original_filename}</td>
                          <td className="p-4 text-slate-400 font-mono text-[11px]">{new Date(rec.created_at).toLocaleString()}</td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setInspectedRecord(rec)}
                                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-emerald-400 transition-colors"
                                title="Quick View"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  onSelectPrediction(rec.id);
                                  setActiveTab('results');
                                }}
                                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 transition-colors"
                                title="Full Diagnostic Report"
                              >
                                Full
                              </button>
                              <button
                                onClick={() => handleDelete(rec.id)}
                                disabled={deletingId === rec.id}
                                className="p-2 rounded-lg hover:bg-rose-500/20 text-rose-400 transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          ) : (
            /* Empty State */
            <div className="glass-panel rounded-3xl p-16 text-center space-y-4">
              <History className="w-12 h-12 mx-auto text-slate-500 stroke-1" />
              <h3 className="text-lg font-bold text-white">No Matching Diagnoses Found</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                No records match the active filter ({diseaseClass === 'all' ? 'All Classes' : diseaseClass}) or query. Try resetting filters or analyzing a new leaf.
              </p>
              <button
                onClick={() => { setDiseaseClass('all'); setSearch(''); }}
                className="px-4 py-2 rounded-xl bg-white/10 text-xs font-semibold text-white hover:bg-white/20 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* Pagination Controls */}
          {data.records.length > 0 && (
            <div className="glass-panel rounded-2xl p-4 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono">
                Records {((data.page - 1) * data.page_size) + 1} - {Math.min(data.page * data.page_size, data.total)} of {data.total}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-xl border border-white/10 text-white disabled:opacity-30 hover:bg-white/5"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-3 py-1 font-mono text-emerald-400 font-bold">Page {data.page}</span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page * data.page_size >= data.total}
                  className="p-2 rounded-xl border border-white/10 text-white disabled:opacity-30 hover:bg-white/5"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Quick Inspect Modal Drawer */}
      {inspectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="glass-panel rounded-3xl max-w-xl w-full p-6 space-y-6 border border-emerald-500/30 relative shadow-2xl">
            <button
              onClick={() => setInspectedRecord(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getDiseaseBadgeColor(inspectedRecord.predicted_class)}`}>
                {inspectedRecord.predicted_class}
              </span>
              <span className="font-mono text-xs text-emerald-400 font-bold">
                {(inspectedRecord.confidence * 100).toFixed(1)}% Confidence
              </span>
            </div>

            <div className="aspect-video rounded-2xl overflow-hidden bg-black/80 border border-white/10">
              <img
                src={inspectedRecord.image_url}
                alt={inspectedRecord.predicted_class}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="space-y-2 text-xs">
              <p className="font-bold text-white text-sm">{inspectedRecord.original_filename}</p>
              <p className="text-slate-400 font-mono">Captured: {new Date(inspectedRecord.created_at).toLocaleString()}</p>
            </div>

            <div className="flex items-center gap-3 pt-2 border-t border-white/10">
              <button
                onClick={() => {
                  onSelectPrediction(inspectedRecord.id);
                  setActiveTab('results');
                }}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-black font-extrabold text-xs transition-colors"
              >
                Open Full Clinical Diagnostic Dossier
              </button>
              <button
                onClick={() => setInspectedRecord(null)}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
