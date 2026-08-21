'use client';

import React, { useState, useRef, useEffect } from 'react';
import { SlidersHorizontal, Check } from 'lucide-react';

export interface VisibleFields {
  priority: boolean;
  members: boolean;
  dueDate: boolean;
  labels: boolean;
  status: boolean;
  reporter: boolean;
}

interface FieldsDropdownProps {
  fields: VisibleFields;
  onChange: (fields: VisibleFields) => void;
}

export function FieldsDropdown({ fields, onChange }: FieldsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleField = (key: keyof VisibleFields) => {
    onChange({ ...fields, [key]: !fields[key] });
  };

  const fieldLabels: { key: keyof VisibleFields; label: string }[] = [
    { key: 'priority', label: 'Priority' },
    { key: 'members', label: 'Members / Assignees' },
    { key: 'dueDate', label: 'Due Date' },
    { key: 'labels', label: 'Labels' },
    { key: 'status', label: 'Status' },
    { key: 'reporter', label: 'Reporter' },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-xs"
      >
        <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
        <span>Fields</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-52 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-2 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Visible Columns
          </div>
          <div className="space-y-0.5">
            {fieldLabels.map((item) => (
              <button
                key={item.key}
                onClick={() => toggleField(item.key)}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <span>{item.label}</span>
                <div
                  className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                    fields[item.key]
                      ? 'accent-bg-primary text-white border-transparent'
                      : 'border-slate-300 dark:border-slate-700'
                  }`}
                >
                  {fields[item.key] && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
