'use client';

import React from 'react';
import { Search, Plus, Moon, Sun, LayoutGrid, ListFilter } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { FieldsDropdown, VisibleFields } from './FieldsDropdown';

interface HeaderProps {
  viewMode?: 'board' | 'list';
  onViewChange?: (view: 'board' | 'list') => void;
  onAddTask?: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  visibleFields?: VisibleFields;
  onFieldsChange?: (fields: VisibleFields) => void;
}

export const Header: React.FC<HeaderProps> = ({
  viewMode = 'board',
  onViewChange,
  onAddTask,
  searchQuery = '',
  onSearchChange,
  visibleFields,
  onFieldsChange,
}) => {
  const { mode, toggleMode } = useTheme();

  return (
    <header className="sticky top-0 z-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-6">
        <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          Tasks
        </h1>

        {onViewChange && (
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => onViewChange('board')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'board'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Board</span>
            </button>
            <button
              onClick={() => onViewChange('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            className="pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-400 focus:outline-hidden focus:border-slate-400 w-48 sm:w-64"
          />
        </div>

        {visibleFields && onFieldsChange && (
          <FieldsDropdown fields={visibleFields} onChange={onFieldsChange} />
        )}

        <button
          onClick={toggleMode}
          className="flex items-center gap-2 px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
        >
          {mode === 'dark' ? (
            <>
              <Sun className="w-3.5 h-3.5 text-slate-300" />
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-slate-600" />
              <span>Dark Mode</span>
            </>
          )}
        </button>

        {onAddTask && (
          <button
            onClick={onAddTask}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 font-bold text-xs transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        )}
      </div>
    </header>
  );
};
