'use client';

import React from 'react';
import { Task } from '../lib/api';
import { TaskCard } from './TaskCard';
import { Plus, Circle, Clock, CheckCircle2, PauseCircle } from 'lucide-react';

interface KanbanBoardProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onAddTask: (status: string) => void;
  onStatusChange: (taskId: string, newStatus: string) => void;
}

export function KanbanBoard({ tasks, onTaskClick, onAddTask, onStatusChange }: KanbanBoardProps) {
  const columns: { id: string; title: string; icon: any; color: string }[] = [
    { id: 'ToDo', title: 'To Do', icon: Circle, color: 'text-slate-400' },
    { id: 'Doing', title: 'Doing', icon: Clock, color: 'text-amber-500' },
    { id: 'Completed', title: 'Completed', icon: CheckCircle2, color: 'text-emerald-500' },
    { id: 'OnHold', title: 'On Hold', icon: PauseCircle, color: 'text-rose-500' },
  ];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStatus: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      onStatusChange(taskId, targetStatus);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 p-1">
      {columns.map((col) => {
        const Icon = col.icon;
        const colTasks = tasks.filter((t) => t.status === col.id);

        return (
          <div
            key={col.id}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.id)}
            className="flex flex-col bg-slate-100/70 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3 min-h-[500px]"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 px-1">
              <div className="flex items-center gap-2">
                <Icon className={`w-4 h-4 ${col.color}`} />
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                  {col.title}
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {colTasks.length}
                </span>
              </div>
              <button
                onClick={() => onAddTask(col.id)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                title={`Add task to ${col.title}`}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Task List Container */}
            <div className="flex-1 space-y-3 overflow-y-auto pr-0.5">
              {colTasks.map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', task.id);
                  }}
                  className="cursor-grab active:cursor-grabbing"
                >
                  <TaskCard task={task} onClick={onTaskClick} />
                </div>
              ))}

              {colTasks.length === 0 && (
                <div className="h-32 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center text-xs text-slate-400 font-medium">
                  Drop task here
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
