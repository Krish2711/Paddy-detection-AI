import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { PredictionRecord, PredictionListResponse } from '../types';
import { History, Search, Download, Trash2, Eye, ChevronLeft, ChevronRight, Loader2, AlertCircle } from 'lucide-react';

interface HistoryPageProps {
  onSelectPrediction: (id: number) => void;
  setActiveTab: (tab: string) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ onSelectPrediction, setActiveTab }) => {
  const [data, setData] = useState<PredictionListResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>('');
  const [diseaseClass, setDiseaseClass] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getPredictions({
        page,
        page_size: 10,
        search: search.trim() || undefined,
        disease_class: diseaseClass !== 'all' ? diseaseClass : undefined,
        sort_order: sortOrder
      });
      setData(res);
    } catch (err: any) {
      setError('Failed to fetch prediction history records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [page, diseaseClass, sortOrder]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchHistory();
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this prediction record and image?')) return;
    setDeletingId(id);
    try {
      await api.deletePrediction(id);
      await fetchHistory();
    } catch (err: any) {
      alert('Failed to delete record.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Prediction History
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Search, filter, inspect, and export persistent SQLite disease analysis records.
          </p>
        </div>

        <a
          href={api.getExportCsvUrl()}
          download="paddycare_history.csv"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-paddy-600 hover:bg-paddy-700 text-white font-semibold text-sm shadow-md transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </a>
      </div>

      {/* Controls: Search, Filter, Sorting */}
      <div className="glass-panel rounded-3xl p-4 sm:p-6 shadow-md space-y-4 border border-slate-200/80 dark:border-slate-800/80">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          
          {/* Search Box */}
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search filename or disease class..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-paddy-500"
            />
          </div>

          {/* Filter Dropdown */}
          <div>
            <select
              value={diseaseClass}
              onChange={(e) => { setDiseaseClass(e.target.value); setPage(1); }}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-paddy-500"
            >
              <option value="all">All Diseases</option>
              <option value="Bacterialblight">Bacterial Leaf Blight</option>
              <option value="Blast">Rice Blast</option>
              <option value="Brownspot">Brown Spot</option>
              <option value="Tungro">Rice Tungro</option>
            </select>
          </div>

          {/* Sort Dropdown */}
          <div>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-paddy-500"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>

        </form>
      </div>

      {/* Loading & Error */}
      {loading && (
        <div className="py-12 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-paddy-600" />
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 text-red-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {/* History Records Table */}
      {!loading && data && (
        <>
          {data.records.length > 0 ? (
            <div className="glass-panel rounded-3xl overflow-hidden shadow-md border border-slate-200/80 dark:border-slate-800/80">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100/80 dark:bg-slate-900/80 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="p-4">Leaf Photo</th>
                      <th className="p-4">Predicted Class</th>
                      <th className="p-4">Confidence</th>
                      <th className="p-4">Original Filename</th>
                      <th className="p-4">Date & Time</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60 font-medium">
                    {data.records.map((rec) => (
                      <tr key={rec.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/50 transition-colors">
                        <td className="p-4">
                          <img
                            src={rec.image_url}
                            alt={rec.predicted_class}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-800"
                          />
                        </td>
                        <td className="p-4 font-bold text-slate-900 dark:text-white">
                          {rec.predicted_class}
                        </td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded-full bg-paddy-100 text-paddy-800 dark:bg-paddy-950 dark:text-paddy-300 font-bold">
                            {(rec.confidence * 100).toFixed(1)}%
                          </span>
                        </td>
                        <td className="p-4 text-slate-500 max-w-xs truncate">
                          {rec.original_filename}
                        </td>
                        <td className="p-4 text-slate-500">
                          {new Date(rec.created_at).toLocaleString()}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                onSelectPrediction(rec.id);
                                setActiveTab('results');
                              }}
                              className="p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
                              title="Inspect Result"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(rec.id)}
                              disabled={deletingId === rec.id}
                              className="p-2 rounded-xl hover:bg-red-100 dark:hover:bg-red-950 text-red-600 transition-colors disabled:opacity-50"
                              title="Delete Record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Footer */}
              <div className="p-4 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  Showing {data.records.length} of {data.total} records (Page {data.page})
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 disabled:opacity-40"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page * data.page_size >= data.total}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 disabled:opacity-40"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-panel rounded-3xl p-12 text-center text-slate-400 space-y-3">
              <History className="w-12 h-12 mx-auto stroke-1" />
              <p className="font-semibold text-sm">No analysis history found.</p>
              <p className="text-xs">Run a new disease detection analysis or clear active search filters.</p>
            </div>
          )}
        </>
      )}

    </div>
  );
};
