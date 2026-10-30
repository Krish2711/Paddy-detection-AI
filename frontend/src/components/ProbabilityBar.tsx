import React from 'react';
import { ProbabilityItem } from '../types';

interface ProbabilityBarProps {
  probabilities: ProbabilityItem[];
  predictedClass: string;
}

export const ProbabilityBar: React.FC<ProbabilityBarProps> = ({
  probabilities,
  predictedClass
}) => {
  const getBarColor = (className: string, isTop: boolean) => {
    if (isTop) {
      if (className === 'Bacterialblight') return 'bg-red-500';
      if (className === 'Blast') return 'bg-orange-500';
      if (className === 'Brownspot') return 'bg-amber-500';
      if (className === 'Tungro') return 'bg-purple-500';
      return 'bg-paddy-600';
    }
    return 'bg-slate-300 dark:bg-slate-700';
  };

  return (
    <div className="space-y-3">
      {probabilities.map((item, idx) => {
        const isTop = item.class_name === predictedClass;
        const percentage = (item.probability * 100).toFixed(1);

        return (
          <div key={item.class_name} className="space-y-1">
            <div className="flex items-center justify-between text-xs sm:text-sm font-medium">
              <span className={`flex items-center gap-2 ${isTop ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-600 dark:text-slate-400'}`}>
                {isTop && <span className="w-2 h-2 rounded-full bg-paddy-500" />}
                {item.class_name}
              </span>
              <span className={`${isTop ? 'text-paddy-600 dark:text-paddy-400 font-bold' : 'text-slate-500 dark:text-slate-400'}`}>
                {percentage}%
              </span>
            </div>

            <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden p-0.5 border border-slate-200/50 dark:border-slate-800/50">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${getBarColor(item.class_name, isTop)}`}
                style={{ width: `${Math.max(item.probability * 100, 2)}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
