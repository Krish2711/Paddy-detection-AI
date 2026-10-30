import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { ImageUploader } from '../components/ImageUploader';
import { api } from '../services/api';
import { PredictionRecord } from '../types';
import { Sparkles, ScanLine, ShieldCheck } from 'lucide-react';

interface DetectionPageProps {
  setActiveTab: (tab: string) => void;
  setCurrentPrediction: (pred: PredictionRecord) => void;
}

export const DetectionPage: React.FC<DetectionPageProps> = ({
  setActiveTab,
  setCurrentPrediction
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.predictDisease(file);
      setCurrentPrediction(result);
      
      // Trigger confetti celebration on successful classification
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Fallback if confetti fails
      }

      setActiveTab('results');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to complete disease analysis. Please verify image and backend connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-paddy-500/10 text-paddy-700 dark:text-paddy-300 text-xs font-semibold">
          <ScanLine className="w-3.5 h-3.5" />
          <span>Real-time CNN Disease Inference</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Paddy Leaf Disease Detection
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          Upload a clear photograph of your rice leaf. Our neural network will analyze visual features and return instant diagnostic reports.
        </p>
      </div>

      {/* Main Uploader Box */}
      <ImageUploader
        onAnalyze={handleAnalyze}
        isLoading={loading}
        error={error}
      />

      {/* Photo Quality & Cropping Guidelines */}
      <div className="p-5 rounded-3xl bg-paddy-500/10 border border-paddy-500/20 text-xs text-slate-700 dark:text-slate-300 space-y-2">
        <h4 className="font-bold text-sm text-paddy-900 dark:text-paddy-100 flex items-center gap-2">
          <span>🌿 Best Practices for Accurate Analysis</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50">
            <span className="font-bold block text-slate-900 dark:text-white mb-1">1. Tight Crop on Lesions</span>
            <span>Crop closely around the diseased spots/streaks. Avoid photos showing broad fields, insects, or hands.</span>
          </div>
          <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50">
            <span className="font-bold block text-slate-900 dark:text-white mb-1">2. Single Leaf In View</span>
            <span>Ensure the leaf fills at least 70% of the frame horizontally or vertically for clean feature extraction.</span>
          </div>
          <div className="p-3 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50">
            <span className="font-bold block text-slate-900 dark:text-white mb-1">3. Clear Daylight</span>
            <span>Avoid heavy flash glare or dark evening shadows that distort lesion color gradients.</span>
          </div>
        </div>
      </div>

      {/* Security & Reliability Banner */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800/80 flex flex-wrap items-center justify-around gap-4 text-xs text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-paddy-600 dark:text-paddy-400" />
          <span>100% On-Premise / Private Processing</span>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-paddy-600 dark:text-paddy-400" />
          <span>Multi-Scale Test-Time Augmentation (TTA)</span>
        </div>
        <div className="flex items-center gap-2">
          <ScanLine className="w-4 h-4 text-paddy-600 dark:text-paddy-400" />
          <span>Automatic SQLite Record Keeping</span>
        </div>
      </div>

    </div>
  );
};
