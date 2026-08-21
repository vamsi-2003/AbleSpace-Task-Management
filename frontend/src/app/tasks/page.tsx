'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Header } from '../../components/Header';
import { KanbanBoard } from '../../components/KanbanBoard';
import { TaskTable } from '../../components/TaskTable';
import { TaskDetailPanel } from '../../components/TaskDetailPanel';
import { VisibleFields } from '../../components/FieldsDropdown';
import { Task, api } from '../../lib/api';
import { Plus, X } from 'lucide-react';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [user, setUser] = useState<any>(null);

  const [visibleFields, setVisibleFields] = useState<VisibleFields>({
    priority: true,
    members: true,
    dueDate: true,
    labels: true,
    status: true,
    reporter: true,
  });

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('Medium');
  const [newTaskStatus, setNewTaskStatus] = useState('ToDo');

  useEffect(() => {
    loadTasks();
    api.getProfile().then(setUser).catch(() => {});
  }, []);

  const loadTasks = () => {
    api.getTasks().then(setTasks).catch(() => {
      // Seed fallback tasks if server unreachable
      setTasks([
        {
          id: '1',
          title: 'Design System & Component Tokens Update',
          description: 'Update buttons, inputs, modal dialogs, and color tokens matching Figma guidelines.',
          status: 'ToDo',
          priority: 'High',
          dueDate: '2026-08-20',
          reporterName: 'Alex Morgan',
          projectName: 'Mobile App Redesign',
          assignees: ['Alex Morgan'],
          labels: ['Design', 'UI/UX'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          title: 'API Authentication & Guest Session Store',
          description: 'Implement NestJS AuthModule guest user token generation and persistent state.',
          status: 'Doing',
          priority: 'Urgent',
          dueDate: '2026-08-15',
          reporterName: 'Alex Morgan',
          projectName: 'Backend Infrastructure',
          assignees: ['David Kim'],
          labels: ['Backend', 'Security'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]);
    });
  };

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus as any } : t))
    );
    try {
      await api.updateTaskStatus(taskId, newStatus);
    } catch (err) {
      console.error('Failed to update status on server:', err);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const created = await api.createTask({
        title: newTaskTitle,
        priority: newTaskPriority as any,
        status: newTaskStatus as any,
        assignees: [user?.fullName || 'Alex Morgan'],
        labels: ['Task'],
      });
      setTasks((prev) => [created, ...prev]);
      setNewTaskTitle('');
      setIsCreateModalOpen(false);
    } catch (err) {
      console.error('Failed to create task:', err);
    }
  };

  const filteredTasks = tasks.filter((t) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.title.toLowerCase().includes(q) ||
      (t.description && t.description.toLowerCase().includes(q))
    );
  });

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Sidebar user={user} />

      <main className="flex-1 flex flex-col min-w-0">
        <Header
          viewMode={viewMode}
          onViewChange={setViewMode}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          visibleFields={visibleFields}
          onFieldsChange={setVisibleFields}
          onAddTask={() => setIsCreateModalOpen(true)}
        />

        <div className="flex-1 p-6 overflow-y-auto">
          {viewMode === 'board' ? (
            <KanbanBoard
              tasks={filteredTasks}
              onTaskClick={setSelectedTask}
              onAddTask={(status) => {
                setNewTaskStatus(status);
                setIsCreateModalOpen(true);
              }}
              onStatusChange={handleStatusChange}
            />
          ) : (
            <TaskTable
              tasks={filteredTasks}
              fields={visibleFields}
              onTaskClick={setSelectedTask}
            />
          )}
        </div>
      </main>

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskDetailPanel
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={(updated) => {
            setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
            setSelectedTask(updated);
          }}
          onDelete={(id) => {
            setTasks((prev) => prev.filter((t) => t.id !== id));
            api.deleteTask(id).catch(() => {});
          }}
        />
      )}

      {/* Quick Add Task Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Add New Task</h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">
                  Task Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter task name..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 accent-bg-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">
                    Status
                  </label>
                  <select
                    value={newTaskStatus}
                    onChange={(e) => setNewTaskStatus(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  >
                    <option value="ToDo">To Do</option>
                    <option value="Doing">Doing</option>
                    <option value="Completed">Completed</option>
                    <option value="OnHold">On Hold</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">
                    Priority
                  </label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  >
                    <option value="NoPriority">No Priority</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold rounded-xl accent-bg-primary text-white hover:opacity-90 transition-opacity"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
