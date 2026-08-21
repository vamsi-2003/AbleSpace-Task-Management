'use client';

import React from 'react';
import { Task } from '../lib/api';
import { PriorityBadge } from './PriorityBadge';
import { DueDateBadge } from './DueDateBadge';
import { CheckSquare, MessageSquare } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onClick: (task: Task) => void;
}

export function TaskCard({ task, onClick }: TaskCardProps) {
  return (
    <div
      onClick={() => onClick(task)}
      className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-xl p-3.5 shadow-xs hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer space-y-3"
    >
      {/* Title */}
      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors leading-snug">
        {task.title}
      </h3>

      {/* Description Snippet */}
      {task.description && (
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Labels */}
      {task.labels && task.labels.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {task.labels.map((lbl, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
            >
              {lbl}
            </span>
          ))}
        </div>
      )}

      {/* Footer Info */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/60">
        <div className="flex items-center gap-2">
          <PriorityBadge priority={task.priority} showLabel={false} />
          {task.dueDate && <DueDateBadge dueDate={task.dueDate} />}
        </div>

        {/* Assignees */}
        {task.assignees && task.assignees.length > 0 && (
          <div className="flex -space-x-1.5 overflow-hidden">
            {task.assignees.map((name, i) => (
              <div
                key={i}
                title={name}
                className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-slate-900 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-[10px] font-bold flex items-center justify-center uppercase shadow-2xs"
              >
                {name.charAt(0)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
