import React from 'react';
import { Calendar } from 'lucide-react';

interface DueDateBadgeProps {
  dueDate?: string;
  className?: string;
}

export function DueDateBadge({ dueDate, className = '' }: DueDateBadgeProps) {
  if (!dueDate) return null;

  const isOverdue = new Date(dueDate) < new Date();

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full border transition-colors ${
        isOverdue
          ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800'
          : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
      } ${className}`}
    >
      <Calendar className="w-3 h-3" />
      <span>{dueDate}</span>
    </span>
  );
}
