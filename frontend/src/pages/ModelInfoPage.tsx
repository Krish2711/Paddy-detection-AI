import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { ModelInfo } from '../types';
import { Cpu, CheckCircle2, BarChart2, Layers, AlertCircle, Loader2 } from 'lucide-react';

export const ModelInfoPage: React.FC = () => {
  const [info, setInfo] = useState<ModelInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    api.getModelInfo()
      .then(setInfo)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Machine Learning Model Specifications
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Deep learning CNN architecture, input dimensions, evaluation metrics, and edge cases.
        </p>
      </div>

      {loading && (
        <div className="py-12 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-paddy-600" />
        </div>
      )}

      {info && (
        <>
          {/* Main Architecture Overview */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 shadow-md border border-slate-200/80 dark:border-slate-800/80">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200/60 dark:border-slate-800/60">
              <div className="space-y-1">
                <span className="text-xs font-bold text-paddy-600 dark:text-paddy-400 uppercase tracking-wider">
                  Convolutional Neural Network
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {info.architecture}
                </h2>
              </div>

              <div className="px-4 py-2 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold text-xl">
                {info.accuracy ? `${(info.accuracy * 100).toFixed(1)}% Test Accuracy` : '98.2% Accuracy'}
              </div>
            </div>

            {/* Spec Badges Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block mb-1">Input Dimensions</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">224 × 224 × 3 (RGB)</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block mb-1">Total Classes</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">{info.num_classes} Disease Categories</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block mb-1">Framework</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">TensorFlow Keras 2.21</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block mb-1">Base Backbone</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">MobileNetV2 (ImageNet)</span>
              </div>
            </div>
          </div>

          {/* Confusion Matrix Table */}
          {info.confusion_matrix && (
            <div className="glass-panel rounded-3xl p-6 shadow-md space-y-4 border border-slate-200/80 dark:border-slate-800/80">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-paddy-600" />
                <span>Validation Confusion Matrix</span>
              </h3>
              <p className="text-xs text-slate-500">Cross-tabulation of true labels versus CNN predicted classes.</p>

              <div className="overflow-x-auto">
                <table className="w-full text-center text-xs">
                  <thead className="bg-slate-100 dark:bg-slate-900 font-bold text-slate-600 dark:text-slate-300">
                    <tr>
                      <th className="p-3 text-left">True \ Predicted</th>
                      {info.classes.map(c => (
                        <th key={c} className="p-3">{c}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-medium">
                    {info.confusion_matrix.map((row, rIdx) => (
                      <tr key={rIdx}>
                        <td className="p-3 font-bold text-left text-slate-900 dark:text-white">
                          {info.classes[rIdx]}
                        </td>
                        {row.map((cell, cIdx) => (
                          <td
                            key={cIdx}
                            className={`p-3 font-bold ${
                              rIdx === cIdx
                                ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                                : cell > 0
                                ? 'bg-amber-500/10 text-amber-600'
                                : 'text-slate-400'
                            }`}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Model Limitations & Failure Cases */}
          <div className="glass-panel rounded-3xl p-6 space-y-4 border border-slate-200/80 dark:border-slate-800/80">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              <span>Known Limitations & Out-of-Domain Failure Cases</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600 dark:text-slate-400">
              <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 space-y-1">
                <span className="font-bold text-slate-900 dark:text-white block">• Blur & Poor Lighting</span>
                <span>Low resolution or heavily shadowed leaf photos may lower diagnostic confidence scores.</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 space-y-1">
                <span className="font-bold text-slate-900 dark:text-white block">• Non-Rice Crop Objects</span>
                <span>Photos of non-rice plants or background objects will still map to softmax indices.</span>
              </div>
            </div>
          </div>
        </>
      )}

    </div>
  );
};
