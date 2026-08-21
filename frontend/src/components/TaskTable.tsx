'use client';

import React, { useState } from 'react';
import { Task } from '../lib/api';
import { VisibleFields } from './FieldsDropdown';
import { PriorityBadge } from './PriorityBadge';
import { DueDateBadge } from './DueDateBadge';
import { ChevronDown, ChevronRight, Circle, Clock, CheckCircle2, PauseCircle } from 'lucide-react';

interface TaskTableProps {
  tasks: Task[];
  fields: VisibleFields;
  onTaskClick: (task: Task) => void;
}

export function TaskTable({ tasks, fields, onTaskClick }: TaskTableProps) {
  const groups: { id: string; title: string; icon: any; color: string }[] = [
    { id: 'ToDo', title: 'To Do', icon: Circle, color: 'text-slate-400' },
    { id: 'Doing', title: 'Doing', icon: Clock, color: 'text-blue-400' },
    { id: 'Completed', title: 'Completed', icon: CheckCircle2, color: 'text-emerald-500' },
    { id: 'OnHold', title: 'On Hold', icon: PauseCircle, color: 'text-rose-500' },
  ];

  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (groupId: string) => {
    setCollapsedGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  return (
    <div className="w-full overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 shadow-xs">
      <table className="w-full text-left text-xs border-collapse">
        {/* Table Header */}
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
            <th className="py-3 px-4 min-w-[240px]">Task Name</th>
            {fields.status && <th className="py-3 px-4 min-w-[100px]">Status</th>}
            {fields.priority && <th className="py-3 px-4 min-w-[120px]">Priority</th>}
            {fields.dueDate && <th className="py-3 px-4 min-w-[120px]">Due Date</th>}
            {fields.members && <th className="py-3 px-4 min-w-[140px]">Members</th>}
            {fields.labels && <th className="py-3 px-4 min-w-[150px]">Labels</th>}
            {fields.reporter && <th className="py-3 px-4 min-w-[130px]">Reporter</th>}
          </tr>
        </thead>

        {/* Table Body Grouped by Status */}
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {groups.map((group) => {
            const groupTasks = tasks.filter((t) => t.status === group.id);
            const isCollapsed = collapsedGroups[group.id];
            const Icon = group.icon;

            return (
              <React.Fragment key={group.id}>
                {/* Group Header Row */}
                <tr
                  onClick={() => toggleGroup(group.id)}
                  className="bg-slate-50/50 dark:bg-slate-800/20 hover:bg-slate-100/60 dark:hover:bg-slate-800/50 cursor-pointer transition-colors border-t border-slate-200 dark:border-slate-800"
                >
                  <td colSpan={7} className="py-2.5 px-4 font-bold text-slate-800 dark:text-slate-200">
                    <div className="flex items-center gap-2">
                      {isCollapsed ? (
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                      <Icon className={`w-4 h-4 ${group.color}`} />
                      <span className="text-xs uppercase tracking-wider">{group.title}</span>
                      <span className="px-2 py-0.5 text-[10px] rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {groupTasks.length}
                      </span>
                    </div>
                  </td>
                </tr>

                {/* Group Tasks Rows */}
                {!isCollapsed &&
                  groupTasks.map((task) => (
                    <tr
                      key={task.id}
                      onClick={() => onTaskClick(task)}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors"
                    >
                      {/* Title */}
                      <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">
                        {task.title}
                      </td>

                      {/* Status */}
                      {fields.status && (
                        <td className="py-3 px-4">
                          <span className="px-2.5 py-1 text-[11px] font-semibold rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {task.status}
                          </span>
                        </td>
                      )}

                      {/* Priority */}
                      {fields.priority && (
                        <td className="py-3 px-4">
                          <PriorityBadge priority={task.priority} />
                        </td>
                      )}

                      {/* Due Date */}
                      {fields.dueDate && (
                        <td className="py-3 px-4">
                          <DueDateBadge dueDate={task.dueDate} />
                        </td>
                      )}

                      {/* Members */}
                      {fields.members && (
                        <td className="py-3 px-4">
                          {task.assignees && task.assignees.length > 0 ? (
                            <div className="flex -space-x-1 overflow-hidden">
                              {task.assignees.map((name, i) => (
                                <div
                                  key={i}
                                  title={name}
                                  className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-slate-900 accent-bg-primary text-white text-[10px] font-bold flex items-center justify-center uppercase shadow-2xs"
                                >
                                  {name.charAt(0)}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                      )}

                      {/* Labels */}
                      {fields.labels && (
                        <td className="py-3 px-4">
                          {task.labels && task.labels.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {task.labels.map((lbl, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                                >
                                  {lbl}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                      )}

                      {/* Reporter */}
                      {fields.reporter && (
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-400 font-medium">
                          {task.reporterName || 'Alex Morgan'}
                        </td>
                      )}
                    </tr>
                  ))}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
