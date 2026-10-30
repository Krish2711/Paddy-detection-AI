import React from 'react';
import { Sprout, ShieldAlert, Sparkles, ScanLine, LayoutDashboard, ArrowRight, CheckCircle2, Cpu, BarChart3, Database, FileSpreadsheet } from 'lucide-react';

interface LandingPageProps {
  setActiveTab: (tab: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ setActiveTab }) => {
  return (
    <div className="space-y-16 pb-12">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-paddy-900 via-paddy-800 to-slate-900 text-white p-8 sm:p-16 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-paddy-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-6">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-paddy-500/20 border border-paddy-400/30 text-paddy-300 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-paddy-400 animate-spin" />
            <span>Powered by MobileNetV2 Deep Learning & TensorFlow</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight font-sans">
            Instant AI Paddy Disease Detection & Crop Health Analytics
          </h1>

          <p className="text-lg sm:text-xl text-paddy-100 font-normal leading-relaxed">
            Diagnose rice leaf diseases in seconds. Upload leaf photos to classify Bacterial Blight, Blast, Brown Spot, and Tungro with 98%+ validation accuracy and actionable agricultural care guidance.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              onClick={() => setActiveTab('detect')}
              className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-paddy-500 hover:bg-paddy-400 text-white font-bold text-base shadow-xl shadow-paddy-900/40 hover:scale-105 active:scale-95 transition-all"
            >
              <ScanLine className="w-5 h-5" />
              <span>Detect Disease Now</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-base backdrop-blur-md border border-white/10 transition-colors"
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Explore Dashboard</span>
            </button>
          </div>

        </div>
      </section>

      {/* 3-Step Process */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            How PaddyCare AI Works
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            A seamless three-step workflow designed for farmers, researchers, and agronomists.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel rounded-3xl p-8 space-y-4 hover:shadow-xl transition-all border border-slate-200/80 dark:border-slate-800/80">
            <div className="w-12 h-12 rounded-2xl bg-paddy-100 dark:bg-paddy-950 text-paddy-600 dark:text-paddy-400 flex items-center justify-center font-bold text-xl">
              1
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Upload Leaf Photo</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Take or upload a clear close-up photo of the symptomatic paddy rice leaf. Drag & drop supported.
            </p>
          </div>

          <div className="glass-panel rounded-3xl p-8 space-y-4 hover:shadow-xl transition-all border border-slate-200/80 dark:border-slate-800/80">
            <div className="w-12 h-12 rounded-2xl bg-paddy-100 dark:bg-paddy-950 text-paddy-600 dark:text-paddy-400 flex items-center justify-center font-bold text-xl">
              2
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">CNN Model Inference</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Our trained TensorFlow CNN model processes color channels, extracts visual features, and evaluates confidence scores.
            </p>
          </div>

          <div className="glass-panel rounded-3xl p-8 space-y-4 hover:shadow-xl transition-all border border-slate-200/80 dark:border-slate-800/80">
            <div className="w-12 h-12 rounded-2xl bg-paddy-100 dark:bg-paddy-950 text-paddy-600 dark:text-paddy-400 flex items-center justify-center font-bold text-xl">
              3
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Diagnostic & Treatment</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Receive instant diagnosis, probability breakdown, symptoms verification, and authoritative care recommendations.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel rounded-3xl p-6 space-y-3">
          <div className="p-3 w-fit rounded-2xl bg-red-500/10 text-red-600 dark:text-red-400">
            <Cpu className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-lg text-slate-900 dark:text-white">4 Disease Classes</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">Classifies Bacterial Blight, Blast, Brown Spot, and Tungro accurately.</p>
        </div>

        <div className="glass-panel rounded-3xl p-6 space-y-3">
          <div className="p-3 w-fit rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <BarChart3 className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-lg text-slate-900 dark:text-white">Ranked Probabilities</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">Detailed probability distribution breakdown across all supported classes.</p>
        </div>

        <div className="glass-panel rounded-3xl p-6 space-y-3">
          <div className="p-3 w-fit rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Database className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-lg text-slate-900 dark:text-white">Persistent History</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">SQLite database stores past scans with search, filtering, and pagination.</p>
        </div>

        <div className="glass-panel rounded-3xl p-6 space-y-3">
          <div className="p-3 w-fit rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-lg text-slate-900 dark:text-white">CSV History Export</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">Export prediction records to CSV for recordkeeping and report generation.</p>
        </div>
      </section>

      {/* Technology Stack Explanation */}
      <section className="glass-panel rounded-3xl p-8 sm:p-12 space-y-6">
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Built with Modern Tech Stack</h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm">Modular architecture separating model inference, backend persistence, and modern reactive frontend UI.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-xs font-semibold text-paddy-600 dark:text-paddy-400 block">ML Backend</span>
            <span className="font-bold text-slate-900 dark:text-white text-base">TensorFlow 2.21</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-xs font-semibold text-paddy-600 dark:text-paddy-400 block">REST API</span>
            <span className="font-bold text-slate-900 dark:text-white text-base">Python FastAPI</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-xs font-semibold text-paddy-600 dark:text-paddy-400 block">Frontend App</span>
            <span className="font-bold text-slate-900 dark:text-white text-base">React 18 + Vite</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-xs font-semibold text-paddy-600 dark:text-paddy-400 block">Database</span>
            <span className="font-bold text-slate-900 dark:text-white text-base">SQLite 3</span>
          </div>
        </div>
      </section>

      {/* Advisory Disclaimer */}
      <section className="flex items-start gap-4 p-6 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 text-sm">
        <ShieldAlert className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-bold">Agricultural Advisory Disclaimer</h4>
          <p className="text-xs leading-relaxed opacity-90">
            PaddyCare AI predictions are generated using artificial intelligence and convolutional neural network models. While high accuracy is maintained on dataset benchmarks, predictions are advisory and should be confirmed by a certified agricultural extension officer or agronomist before applying chemical treatments.
          </p>
        </div>
      </section>

    </div>
  );
};
