'use client';

import React from 'react';
import { Search, LayoutGrid, List, Plus } from 'lucide-react';
import { ThemeSelector } from './ThemeSelector';
import { FieldsDropdown, VisibleFields } from './FieldsDropdown';

interface HeaderProps {
  viewMode: 'board' | 'list';
  onViewChange: (mode: 'board' | 'list') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  visibleFields: VisibleFields;
  onFieldsChange: (fields: VisibleFields) => void;
  onAddTask: () => void;
}

export function Header({
  viewMode,
  onViewChange,
  searchQuery,
  onSearchChange,
  visibleFields,
  onFieldsChange,
  onAddTask,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
      {/* Title & View Switcher */}
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Tasks
        </h2>

        {/* View Toggle */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800/70 rounded-xl border border-slate-200/80 dark:border-slate-800">
          <button
            onClick={() => onViewChange('board')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'board'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" /> Board
          </button>
          <button
            onClick={() => onViewChange('list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'list'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <List className="w-3.5 h-3.5" /> List
          </button>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Search Bar */}
        <div className="relative w-48 sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 accent-bg-primary transition-all"
          />
        </div>

        {/* Fields Dropdown (when in list mode) */}
        {viewMode === 'list' && (
          <FieldsDropdown fields={visibleFields} onChange={onFieldsChange} />
        )}

        {/* Dual Axis Theme & Accent Customizer */}
        <ThemeSelector />

        {/* Add Task Primary Action */}
        <button
          onClick={onAddTask}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl accent-bg-primary text-white hover:opacity-90 transition-opacity shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Task</span>
        </button>
      </div>
    </header>
  );
}
