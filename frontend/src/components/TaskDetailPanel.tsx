'use client';

import React, { useState, useEffect } from 'react';
import { Task, Subtask, Comment, ActivityLog, api } from '../lib/api';
import { PriorityBadge } from './PriorityBadge';
import {
  X,
  Plus,
  CheckCircle2,
  Circle,
  MessageSquare,
  Paperclip,
  Clock,
  Send,
  Calendar,
  User,
  Tag,
  Users,
  Flame,
  ArrowUp,
  ArrowDown,
  Minus,
  Trash2,
} from 'lucide-react';

interface TaskDetailPanelProps {
  task: Task | null;
  onClose: () => void;
  onUpdate: (updatedTask: Task) => void;
  onDelete: (taskId: string) => void;
}

export function TaskDetailPanel({ task, onClose, onUpdate, onDelete }: TaskDetailPanelProps) {
  if (!task) return null;

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [status, setStatus] = useState(task.status);
  const [priority, setPriority] = useState(task.priority);
  const [dueDate, setDueDate] = useState(task.dueDate || '');

  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  const [comments, setComments] = useState<Comment[]>([]);
  const [newCommentBody, setNewCommentBody] = useState('');

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [resources, setResources] = useState<{ name: string; url: string }[]>([
    { name: 'Figma Assessment Specification', url: 'https://figma.com' },
  ]);
  const [newResourceUrl, setNewResourceUrl] = useState('');

  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description || '');
    setStatus(task.status);
    setPriority(task.priority);
    setDueDate(task.dueDate || '');

    api.getSubtasks(task.id).then(setSubtasks).catch(() => {});
    api.getComments(task.id).then(setComments).catch(() => {});
    api.getActivityLogs(task.id).then(setActivityLogs).catch(() => {});
  }, [task]);

  const handleTitleBlur = async () => {
    if (title !== task.title) {
      const updated = await api.updateTask(task.id, { title });
      onUpdate(updated);
    }
  };

  const handleDescriptionBlur = async () => {
    if (description !== task.description) {
      const updated = await api.updateTask(task.id, { description });
      onUpdate(updated);
    }
  };

  const handleStatusChange = async (newStatus: any) => {
    setStatus(newStatus);
    const updated = await api.updateTaskStatus(task.id, newStatus);
    onUpdate(updated);
    refreshActivity();
  };

  const handlePriorityChange = async (newPriority: any) => {
    setPriority(newPriority);
    const updated = await api.updateTask(task.id, { priority: newPriority });
    onUpdate(updated);
    refreshActivity();
  };

  const handleDueDateChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDueDate(val);
    const updated = await api.updateTask(task.id, { dueDate: val });
    onUpdate(updated);
    refreshActivity();
  };

  const handleAddSubtask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    const created = await api.createSubtask(task.id, { title: newSubtaskTitle });
    setSubtasks((prev) => [...prev, created]);
    setNewSubtaskTitle('');
  };

  const handleToggleSubtask = async (st: Subtask) => {
    const updated = await api.updateSubtask(task.id, st.id, { completed: !st.completed });
    setSubtasks((prev) => prev.map((item) => (item.id === st.id ? updated : item)));
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentBody.trim()) return;
    const comment = await api.createComment(task.id, newCommentBody);
    setComments((prev) => [...prev, comment]);
    setNewCommentBody('');
  };

  const handleAddResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResourceUrl.trim()) return;
    setResources((prev) => [...prev, { name: newResourceUrl, url: newResourceUrl }]);
    setNewResourceUrl('');
  };

  const refreshActivity = () => {
    api.getActivityLogs(task.id).then(setActivityLogs).catch(() => {});
  };

  const priorities = ['NoPriority', 'Low', 'Medium', 'High', 'Urgent'];
  const statuses = ['ToDo', 'Doing', 'Completed', 'OnHold', 'Backlog'];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-4xl h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col md:flex-row overflow-hidden animate-in slide-in-from-right duration-200">
        <div className="flex-1 flex flex-col h-full overflow-y-auto p-6 space-y-6">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              {task.projectName || 'Pyramid Workspace'}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to delete this task?')) {
                    onDelete(task.id);
                    onClose();
                  }
                }}
                className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                title="Delete Task"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleBlur}
            className="w-full text-2xl font-extrabold bg-transparent text-slate-900 dark:text-slate-100 border-b border-transparent hover:border-slate-200 dark:hover:border-slate-800 focus:border-slate-400 focus:outline-hidden py-1 transition-all"
            placeholder="Task title..."
          />

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={handleDescriptionBlur}
              className="w-full text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-slate-400 transition-all resize-none"
              placeholder="Add detailed description or notes..."
            />
          </div>

          <div className="space-y-2 border-t border-slate-100 dark:border-slate-800/80 pt-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <Paperclip className="w-4 h-4" />
              <span>Resources & Documentation</span>
            </div>
            <div className="space-y-1.5">
              {resources.map((res, i) => (
                <a
                  key={i}
                  href={res.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800"
                >
                  <Paperclip className="w-3.5 h-3.5" />
                  <span>{res.name}</span>
                </a>
              ))}
            </div>
            <form onSubmit={handleAddResource} className="flex gap-2 pt-1">
              <input
                type="text"
                placeholder="Add document link or URL..."
                value={newResourceUrl}
                onChange={(e) => setNewResourceUrl(e.target.value)}
                className="flex-1 text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-hidden"
              />
              <button
                type="submit"
                className="px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:opacity-90 transition-opacity"
              >
                Add Link
              </button>
            </form>
          </div>

          <div className="space-y-3 border-t border-slate-100 dark:border-slate-800/80 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Subtasks ({subtasks.filter((s) => s.completed).length}/{subtasks.length})
              </span>
            </div>
            <div className="space-y-2">
              {subtasks.map((st) => (
                <div
                  key={st.id}
                  onClick={() => handleToggleSubtask(st)}
                  className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                >
                  {st.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-300 dark:text-slate-600 shrink-0" />
                  )}
                  <span
                    className={`text-xs font-medium flex-1 ${
                      st.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    {st.title}
                  </span>
                </div>
              ))}
            </div>
            <form onSubmit={handleAddSubtask} className="flex gap-2">
              <input
                type="text"
                placeholder="Add new subtask..."
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-hidden"
              />
              <button
                type="submit"
                className="px-3 py-2 text-xs font-bold rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:opacity-90 transition-opacity flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </form>
          </div>

          <div className="space-y-3 border-t border-slate-100 dark:border-slate-800/80 pt-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> Activity Log
            </span>
            <div className="space-y-2">
              {activityLogs.map((log) => (
                <div key={log.id} className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-900 dark:bg-slate-100" />
                  <span className="font-bold text-slate-800 dark:text-slate-200">{log.userName}</span>
                  <span>{log.action}</span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 border-t border-slate-100 dark:border-slate-800/80 pt-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4" /> Comments ({comments.length})
            </span>
            <div className="space-y-3">
              {comments.map((c) => (
                <div key={c.id} className="flex gap-3 text-xs">
                  <img
                    src={c.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                    alt="Author"
                    className="w-7 h-7 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                  />
                  <div className="flex-1 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-slate-900 dark:text-slate-100">{c.authorName}</span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{c.body}</p>
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={handleAddComment} className="flex gap-2">
              <input
                type="text"
                placeholder="Write a comment..."
                value={newCommentBody}
                onChange={(e) => setNewCommentBody(e.target.value)}
                className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-hidden"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:opacity-90 transition-opacity"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        <div className="w-full md:w-72 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 p-5 space-y-5">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Details & Properties
          </h4>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">Status</label>
            <select
              value={status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-semibold focus:outline-hidden"
            >
              {statuses.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">Priority</label>
            <select
              value={priority}
              onChange={(e) => handlePriorityChange(e.target.value)}
              className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-semibold focus:outline-hidden"
            >
              {priorities.map((pr) => (
                <option key={pr} value={pr}>
                  {pr}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Calendar className="w-3 h-3" /> Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={handleDueDateChange}
              className="w-full text-xs p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-medium focus:outline-hidden"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <User className="w-3 h-3" /> Reporter
            </label>
            <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              {task.reporterName || 'Alex Morgan'}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Users className="w-3 h-3" /> Members / Assignees
            </label>
            <div className="flex flex-wrap gap-1 pt-1">
              {(task.assignees || ['Alex Morgan']).map((name, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
