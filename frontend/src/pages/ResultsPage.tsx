import React from 'react';
import { PredictionRecord } from '../types';
import { DISEASE_DATA } from '../data/diseaseData';
import { ProbabilityBar } from '../components/ProbabilityBar';
import { ScanLine, Printer, ArrowLeft, BookOpen, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';

interface ResultsPageProps {
  prediction: PredictionRecord | null;
  setActiveTab: (tab: string) => void;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({
  prediction,
  setActiveTab
}) => {
  if (!prediction) {
    return (
      <div className="text-center py-16 space-y-4">
        <ScanLine className="w-12 h-12 mx-auto text-slate-400 stroke-1" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">No Active Diagnostic Result</h2>
        <p className="text-sm text-slate-500">Please upload a paddy leaf photo to run analysis.</p>
        <button
          onClick={() => setActiveTab('detect')}
          className="px-6 py-2.5 rounded-xl bg-paddy-600 text-white text-sm font-semibold hover:bg-paddy-700 transition-colors"
        >
          Go to Disease Detection
        </button>
      </div>
    );
  }

  const diseaseDetail = DISEASE_DATA[prediction.predicted_class] || {
    name: prediction.predicted_class,
    scientificName: 'Paddy Crop Specimen',
    category: 'Rice Crop Classification',
    severity: 'Moderate',
    color: '#3b82f6',
    symptoms: ['Visual lesions or spot characteristics detected on leaf surface.'],
    environmentalFactors: ['High humidity or temperature fluctuations.'],
    prevention: ['Maintain balanced fertilization and clean field sanitation.'],
    management: ['Consult your local agricultural extension service for specific advice.'],
    whenToSeekExpert: 'Seek professional advice if symptoms spread rapidly.'
  };

  const confidencePct = (prediction.confidence * 100).toFixed(1);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 print:space-y-4">
      
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
        <button
          onClick={() => setActiveTab('detect')}
          className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-paddy-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Analyze Another Leaf</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('library')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl glass-panel text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            <span>Disease Library</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-paddy-600 hover:bg-paddy-700 text-white text-xs font-semibold shadow-md transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Uncertainty & Out-of-Domain Notice */}
      {(prediction.is_uncertain || prediction.confidence < 0.65) && (
        <div className="p-4 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-200 text-xs space-y-1 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm text-amber-900 dark:text-amber-100">
              Moderate Confidence / Out-of-Domain Warning
            </h4>
            <p className="opacity-90 leading-relaxed">
              {prediction.uncertainty_warning ||
                "This photo has background elements, lighting, or multiple panels differing from close-up field leaves. For maximum diagnostic precision, upload a tightly cropped photograph focused strictly on the symptomatic leaf lesion."}
            </p>
          </div>
        </div>
      )}

      {/* Main Diagnostic Header Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80 dark:border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Leaf Image Preview */}
        <div className="space-y-2">
          <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-square flex items-center justify-center border border-slate-200 dark:border-slate-800">
            <img
              src={prediction.image_url}
              alt={prediction.predicted_class}
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-[10px] text-slate-400 text-center truncate">
            {prediction.original_filename}
          </p>
        </div>

        {/* Diagnosis Summary & Severity */}
        <div className="md:col-span-2 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                AI Diagnostic Result
              </span>
              
              <span
                className="px-3 py-1 rounded-full text-xs font-extrabold tracking-wide uppercase text-white shadow-sm"
                style={{ backgroundColor: diseaseDetail.color }}
              >
                Severity: {diseaseDetail.severity}
              </span>
            </div>

            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-sans">
                {diseaseDetail.name}
              </h1>
              <p className="text-xs italic text-slate-500 dark:text-slate-400 font-serif">
                {diseaseDetail.scientificName} • {diseaseDetail.category}
              </p>
            </div>

            {/* Model Confidence Score */}
            <div className="p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">Model Classification Confidence</span>
                <span className="text-2xl font-extrabold text-paddy-600 dark:text-paddy-400">{confidencePct}%</span>
              </div>
              <div className="text-right text-[11px] text-slate-400 max-w-[140px]">
                Calculated via MobileNetV2 Softmax distribution
              </div>
            </div>

          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
            Analysis Date: {new Date(prediction.created_at).toLocaleString()}
          </div>
        </div>

      </div>

      {/* Probabilities & Symptoms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Ranked Probabilities Card */}
        <div className="glass-panel rounded-3xl p-6 shadow-md space-y-4 border border-slate-200/80 dark:border-slate-800/80">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">Ranked Class Probabilities</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Relative confidence scores across all 4 disease classes</p>
          <ProbabilityBar
            probabilities={prediction.ranked_probabilities}
            predictedClass={prediction.predicted_class}
          />
        </div>

        {/* Symptoms Card */}
        <div className="glass-panel rounded-3xl p-6 shadow-md space-y-4 border border-slate-200/80 dark:border-slate-800/80">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">Observed Clinical Symptoms</h3>
          <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
            {diseaseDetail.symptoms.map((symptom, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-paddy-500 shrink-0 mt-0.5" />
                <span>{symptom}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Management & Prevention Guidance */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-6 shadow-md border border-slate-200/80 dark:border-slate-800/80">
        <h3 className="font-bold text-xl text-slate-900 dark:text-white">Recommended Crop Care & Management Plan</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          
          {/* Prevention */}
          <div className="space-y-3 p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/60">
            <h4 className="font-bold text-emerald-800 dark:text-emerald-300 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Preventive Actions</span>
            </h4>
            <ul className="space-y-2 text-slate-700 dark:text-slate-300">
              {diseaseDetail.prevention.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Direct Treatment */}
          <div className="space-y-3 p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/60">
            <h4 className="font-bold text-amber-800 dark:text-amber-300 text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Curative Management</span>
            </h4>
            <ul className="space-y-2 text-slate-700 dark:text-slate-300">
              {diseaseDetail.management.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* When to Seek Expert Notice */}
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
          <ShieldAlert className="w-5 h-5 text-paddy-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-900 dark:text-white block">When to Consult Agricultural Extension Officer</span>
            <span>{diseaseDetail.whenToSeekExpert}</span>
          </div>
        </div>

      </div>

    </div>
  );
};
