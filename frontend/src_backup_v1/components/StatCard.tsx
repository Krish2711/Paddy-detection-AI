import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: string;
  trend?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'paddy',
  trend
}) => {
  const getColorClasses = () => {
    switch (color) {
      case 'emerald':
        return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';
      case 'blue':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400';
      case 'amber':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400';
      case 'purple':
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400';
      default:
        return 'bg-paddy-500/10 text-paddy-600 dark:text-paddy-400';
    }
  };

  return (
    <div className="glass-panel rounded-3xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-slate-200/80 dark:border-slate-800/80 flex items-start justify-between">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </p>
        <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white font-sans">
          {value}
        </h3>
        {subtitle && (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {subtitle}
          </p>
        )}
        {trend && (
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
            <span>{trend}</span>
          </div>
        )}
      </div>

      <div className={`p-3.5 rounded-2xl ${getColorClasses()} shrink-0`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
};
