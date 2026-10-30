import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { ImageUploader } from '../components/ImageUploader';
import { api } from '../services/api';
import { PredictionRecord } from '../types';
import { Sparkles, ScanLine, ShieldCheck, Microscope, Layers, AlertCircle, ArrowRight } from 'lucide-react';

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
      
      try {
        confetti({
          particleCount: 75,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {}

      setActiveTab('results');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to complete disease analysis. Please verify image and backend connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-16">
      
      {/* Title Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-medium">
          <Microscope className="w-3.5 h-3.5" />
          <span>MobileNetV2 Lesion Inspection Matrix</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Precision Disease Detection
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
          Upload or drag a paddy leaf photograph. Our neural pipeline analyzes biological color channels, lesion geometry, and texture patterns.
        </p>
      </div>

      {/* Main Upload & Crop Workbench */}
      <ImageUploader
        onAnalyze={handleAnalyze}
        isLoading={loading}
        error={error}
      />

      {/* Photo Quality & Lesion Targeting Advice */}
      <div className="glass-panel rounded-3xl p-6 space-y-4 border border-white/10">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-sm text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Optimal Diagnostic Capture Protocol</span>
          </h4>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
            Field Standards
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1.5">
            <span className="font-bold text-white block">1. Tight Lesion Framing</span>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Use the Center or Macro crop presets if the leaf was taken from afar to isolate the lesion from surrounding soil or foliage.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1.5">
            <span className="font-bold text-white block">2. Single Leaf Specimen</span>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Ensure only one leaf blade is centered in the camera reticle without fingers, insects, or multi-panel graphic borders.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1.5">
            <span className="font-bold text-white block">3. Balanced White Exposure</span>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Natural indirect daylight prevents glare on leaf cuticles, preserving exact brown spot and blast lesion margins.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
