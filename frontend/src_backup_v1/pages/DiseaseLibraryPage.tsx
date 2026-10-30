import React, { useState } from 'react';
import { DISEASE_DATA } from '../data/diseaseData';
import { BookOpen, CheckCircle2, AlertTriangle, ShieldCheck, Thermometer, Sprout } from 'lucide-react';

export const DiseaseLibraryPage: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>('Bacterialblight');
  const activeDisease = DISEASE_DATA[selectedId] || DISEASE_DATA['Bacterialblight'];

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Paddy Disease Library & Crop Care Guide
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Authoritative agricultural extension reference guide for model-supported rice leaf diseases.
        </p>
      </div>

      {/* Disease Selection Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Object.values(DISEASE_DATA).map((d) => {
          const isSelected = selectedId === d.id;
          return (
            <button
              key={d.id}
              onClick={() => setSelectedId(d.id)}
              className={`p-4 rounded-2xl text-left transition-all border ${
                isSelected
                  ? 'bg-paddy-600 text-white shadow-lg border-paddy-500 scale-[1.02]'
                  : 'glass-panel text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold uppercase tracking-wider opacity-80">
                  {d.category.split(' ')[0]}
                </span>
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: d.color }}
                />
              </div>
              <p className="font-bold text-sm sm:text-base leading-snug">
                {d.name}
              </p>
            </button>
          );
        })}
      </div>

      {/* Active Disease Detail View */}
      <div className="glass-panel rounded-3xl p-6 sm:p-10 space-y-8 shadow-xl border border-slate-200/80 dark:border-slate-800/80">
        
        {/* Title & Scientific Info */}
        <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-slate-200/60 dark:border-slate-800/60">
          <div>
            <span
              className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase text-white mb-2"
              style={{ backgroundColor: activeDisease.color }}
            >
              {activeDisease.category} • Severity: {activeDisease.severity}
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {activeDisease.name}
            </h2>
            <p className="text-sm italic text-slate-500 dark:text-slate-400 font-serif">
              Pathogen: {activeDisease.scientificName}
            </p>
          </div>
        </div>

        {/* Symptoms & Environmental Trigger Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Symptoms */}
          <div className="space-y-3">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <Sprout className="w-5 h-5 text-paddy-600" />
              <span>Key Field Symptoms</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              {activeDisease.symptoms.map((s, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-paddy-500 shrink-0 mt-0.5" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Environmental Conditions */}
          <div className="space-y-3">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <Thermometer className="w-5 h-5 text-amber-500" />
              <span>Environmental Risk Factors</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              {activeDisease.environmentalFactors.map((e, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>{e}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Prevention & Curative Strategy */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-slate-200/60 dark:border-slate-800/60 text-xs">
          
          {/* Preventive Control */}
          <div className="space-y-3 p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/60">
            <h4 className="font-bold text-emerald-800 dark:text-emerald-300 text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Preventive Cultural Practices</span>
            </h4>
            <ul className="space-y-2 text-slate-700 dark:text-slate-300">
              {activeDisease.prevention.map((p, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Chemical / Biological Management */}
          <div className="space-y-3 p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/60">
            <h4 className="font-bold text-amber-800 dark:text-amber-300 text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Curative Chemical & Biological Control</span>
            </h4>
            <ul className="space-y-2 text-slate-700 dark:text-slate-300">
              {activeDisease.management.map((m, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
};
