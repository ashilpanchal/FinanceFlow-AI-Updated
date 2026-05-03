import React from 'react';
import * as Icons from 'lucide-react';
import { SummaryStat } from '../types';
import { cn } from '../lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard: React.FC<SummaryStat> = ({ 
  label, 
  value, 
  trend, 
  comparison, 
  icon, 
  colorClass,
  progress 
}) => {
  const IconComponent = (Icons as any)[icon];

  return (
    <div className="bg-white p-5 rounded-xl border border-outline-variant shadow-sm flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <div className={cn("p-2 rounded-lg", colorClass || "bg-blue-50 text-blue-600")}>
          {IconComponent && <IconComponent className="w-5 h-5" />}
        </div>
        {trend && (
          <span className={cn(
            "flex items-center gap-1 px-2 py-1 text-[11px] font-bold rounded-full",
            trend.isUp ? "bg-secondary-container text-on-secondary-container" : "bg-error-container text-on-error-container"
          )}>
            {trend.isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {trend.value}
          </span>
        )}
        {comparison && !trend && (
          <span className="text-on-surface-variant text-[11px] font-medium">{comparison}</span>
        )}
        {progress !== undefined && (
          <div className="w-12 h-1 bg-surface-container rounded-full mt-3 relative overflow-hidden">
            <div 
              className="absolute inset-0 bg-primary h-full" 
              style={{ width: `${progress}%` }} 
            />
          </div>
        )}
      </div>
      <div>
        <p className="text-on-surface-variant label-caps text-[10px] mb-1">{label}</p>
        <h3 className="text-2xl font-display text-on-surface">{value}</h3>
      </div>
    </div>
  );
};

export default StatCard;
