"use client";

import React, { useState, useEffect } from "react";
import { Input } from "../Input";
import { Button } from "../Button";
import { Task, TaskStatus } from "../../types/tasks-type";

interface TaskFormProps {
  onSubmit: (task: Omit<Task, "id">) => void;
  initialData?: Task | null;
  onCancel?: () => void;
  isLoading?: boolean;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, initialData, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    date: "",
    activity: "",
    project: "",
    description: "",
    status: "pending" as TaskStatus,
    hours: 0,
    minutes: 0,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        date: initialData.date,
        activity: initialData.activity,
        project: initialData.project,
        description: initialData.description,
        status: initialData.status,
        hours: Math.floor(initialData.duration / 60),
        minutes: initialData.duration % 60,
      });
    } else {
      // Set default date to today for new tasks
      const today = new Date().toISOString().split('T')[0];
      setFormData(prev => ({ ...prev, date: today.replace(/-/g, "") }));
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalMinutes = (formData.hours || 0) * 60 + (formData.minutes || 0);
    onSubmit({
      date: formData.date.replace(/-/g, ""),
      activity: formData.activity,
      project: formData.project,
      description: formData.description,
      status: formData.status,
      duration: totalMinutes,
    });
  };

  const inputClass = "block w-full px-5 py-4 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all outline-none text-sm font-bold text-zinc-900 dark:text-white placeholder:text-zinc-400 placeholder:font-medium h-[58px]";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] ml-1">Work Date</label>
          <input
            type="date"
            required
            className={inputClass}
            value={formData.date.includes("-") ? formData.date : `${formData.date.slice(0,4)}-${formData.date.slice(4,6)}-${formData.date.slice(6,8)}`}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] ml-1">Activity Type</label>
          <select
            className={inputClass}
            value={formData.activity}
            onChange={(e) => setFormData({ ...formData, activity: e.target.value })}
            required
          >
            <option value="">Select Activity</option>
            <option value="Coding">Coding</option>
            <option value="Meeting">Meeting</option>
            <option value="Testing">Testing</option>
            <option value="Documentation">Documentation</option>
            <option value="Research">Research</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] ml-1">Project Name</label>
          <input
            placeholder="e.g. DTP Finnet"
            required
            className={inputClass}
            value={formData.project}
            onChange={(e) => setFormData({ ...formData, project: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] ml-1">
            Status (Auto)
          </label>
          <div className="relative group">
            <input
              type="text"
              value="Pending"
              disabled
              className={`${inputClass} !bg-zinc-100 dark:!bg-zinc-800/80 !text-zinc-400 dark:!text-zinc-500 !cursor-not-allowed border-dashed`}
            />
            <div className="absolute right-5 top-1/2 -translate-y-1/2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] ml-1">Detailed Description / Link</label>
        <textarea
          placeholder="Describe your work (e.g. Github Issue link)..."
          required
          rows={3}
          className="block w-full px-5 py-4 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 rounded-2xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all outline-none text-sm font-bold text-zinc-900 dark:text-white placeholder:text-zinc-400 placeholder:font-medium resize-none min-h-[120px]"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div className="bg-zinc-50/50 dark:bg-zinc-900/30 p-6 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800">
        <label className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] block mb-4 ml-1">Time Effort</label>
        <div className="grid grid-cols-2 gap-6">
          <div className="relative">
            <input
              type="number"
              min="0"
              className={inputClass}
              value={formData.hours}
              onChange={(e) => setFormData({ ...formData, hours: parseInt(e.target.value) || 0 })}
            />
            <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-black text-zinc-400 uppercase tracking-widest pointer-events-none">hours</span>
          </div>
          <div className="relative">
            <input
              type="number"
              min="0"
              max="59"
              className={inputClass}
              value={formData.minutes}
              onChange={(e) => setFormData({ ...formData, minutes: parseInt(e.target.value) || 0 })}
            />
            <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-black text-zinc-400 uppercase tracking-widest pointer-events-none">mins</span>
          </div>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <Button type="submit" isLoading={isLoading} className="flex-1 py-3 rounded-xl shadow-lg shadow-blue-600/20">
          {initialData ? "Update Task Entry" : "Create Task Entry"}
        </Button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 text-sm font-semibold text-gray-600 dark:text-gray-300 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-750 transition-all"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};
