'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { ThemeSelector } from '../../components/ThemeSelector';
import { Project, api } from '../../lib/api';
import { PriorityBadge } from '../../components/PriorityBadge';
import { DueDateBadge } from '../../components/DueDateBadge';
import { FolderKanban, Plus, User, Calendar, X } from 'lucide-react';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectPriority, setNewProjectPriority] = useState('Medium');
  const [newProjectLead, setNewProjectLead] = useState('Alex Morgan');
  const [newProjectDueDate, setNewProjectDueDate] = useState('2026-09-30');

  useEffect(() => {
    loadProjects();
    api.getProfile().then(setUser).catch(() => {});
  }, []);

  const loadProjects = () => {
    api.getProjects().then(setProjects).catch(() => {
      setProjects([
        {
          id: 'p1',
          name: 'Mobile App Redesign',
          priority: 'High',
          leadName: 'Alex Morgan',
          dueDate: '2026-09-15',
          workspaceName: 'Pyramid Workspace',
        },
        {
          id: 'p2',
          name: 'Backend Infrastructure',
          priority: 'Urgent',
          leadName: 'David Kim',
          dueDate: '2026-08-30',
          workspaceName: 'Pyramid Workspace',
        },
      ]);
    });
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    try {
      const created = await api.createProject({
        name: newProjectName,
        priority: newProjectPriority,
        leadName: newProjectLead,
        dueDate: newProjectDueDate,
      });
      setProjects((prev) => [created, ...prev]);
      setNewProjectName('');
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to create project:', err);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Sidebar user={user} />

      <main className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FolderKanban className="w-5 h-5 text-slate-700 dark:text-slate-300" />
            <h2 className="text-xl font-extrabold tracking-tight">Projects</h2>
          </div>

          <div className="flex items-center gap-3">
            <ThemeSelector />
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:opacity-90 transition-opacity shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Project</span>
            </button>
          </div>
        </header>

        <div className="p-6">
          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-5">Project Name</th>
                  <th className="py-3.5 px-5">Priority</th>
                  <th className="py-3.5 px-5">Project Lead</th>
                  <th className="py-3.5 px-5">Target Due Date</th>
                  <th className="py-3.5 px-5">Workspace</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {projects.map((proj) => (
                  <tr
                    key={proj.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="py-3.5 px-5 font-bold text-slate-900 dark:text-slate-100 text-sm">
                      {proj.name}
                    </td>
                    <td className="py-3.5 px-5">
                      <PriorityBadge priority={proj.priority} />
                    </td>
                    <td className="py-3.5 px-5 font-semibold text-slate-700 dark:text-slate-300">
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>{proj.leadName || 'Alex Morgan'}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-5">
                      <DueDateBadge dueDate={proj.dueDate} />
                    </td>
                    <td className="py-3.5 px-5 text-slate-500 dark:text-slate-400 font-medium">
                      {proj.workspaceName || 'Pyramid Workspace'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Create New Project</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">
                  Project Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter project name..."
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">
                    Priority
                  </label>
                  <select
                    value={newProjectPriority}
                    onChange={(e) => setNewProjectPriority(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">
                    Lead
                  </label>
                  <input
                    type="text"
                    value={newProjectLead}
                    onChange={(e) => setNewProjectLead(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:opacity-90 transition-opacity"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
