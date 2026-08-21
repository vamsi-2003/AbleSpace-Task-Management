import React from 'react';
import { AlertCircle, ArrowUp, ArrowDown, Minus, Flame } from 'lucide-react';

interface PriorityBadgeProps {
  priority: string;
  showLabel?: boolean;
  className?: string;
}

export function PriorityBadge({ priority, showLabel = true, className = '' }: PriorityBadgeProps) {
  const getDetails = (p: string) => {
    switch (p) {
      case 'Urgent':
        return {
          label: 'Urgent',
          color: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800',
          icon: <Flame className="w-3.5 h-3.5 text-red-500 fill-red-500 animate-pulse" />,
        };
      case 'High':
        return {
          label: 'High',
          color: 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-800',
          icon: <ArrowUp className="w-3.5 h-3.5 text-orange-500" />,
        };
      case 'Medium':
        return {
          label: 'Medium',
          color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800',
          icon: <Minus className="w-3.5 h-3.5 text-blue-500" />,
        };
      case 'Low':
        return {
          label: 'Low',
          color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800',
          icon: <ArrowDown className="w-3.5 h-3.5 text-blue-500" />,
        };
      default:
        return {
          label: 'No Priority',
          color: 'text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700',
          icon: <Minus className="w-3.5 h-3.5 text-slate-400" />,
        };
    }
  };

  const details = getDetails(priority);

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-md border ${details.color} ${className}`}>
      {details.icon}
      {showLabel && <span>{details.label}</span>}
    </span>
  );
}
