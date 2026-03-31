"use client";

import React from "react";
import { Task } from "../../types/tasks-type";

interface TaskTableProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Task["status"]) => void;
}

export const TaskTable: React.FC<TaskTableProps> = ({ tasks, onEdit, onDelete, onStatusChange }) => {
  const handleCopyRequest = (task: Task) => {
    onStatusChange(task.id, "completed"); // This now happens on confirmation in reality
  };

  return (
    <div className="overflow-x-auto px-4 pb-4">
      <table className="min-w-full border-separate border-spacing-y-4 table-auto">
        <thead className="bg-transparent">
          <tr>
            <th scope="col" className="px-6 py-4 text-left text-[11px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em]">
              Date
            </th>
            <th scope="col" className="px-6 py-4 text-left text-[11px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em]">
              Activity
            </th>
            <th scope="col" className="px-6 py-4 text-left text-[11px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em]">
              Project
            </th>
            <th scope="col" className="px-6 py-4 text-left text-[11px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em]">
              Description
            </th>
            <th scope="col" className="px-6 py-4 text-left text-[11px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em]">
              Status
            </th>
            <th scope="col" className="px-6 py-4 text-left text-[11px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em]">
              Duration
            </th>
            <th scope="col" className="px-6 py-4 text-right text-[11px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em]">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-transparent">
          {tasks.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-12 text-center text-sm font-medium text-zinc-400 italic font-geist-sans bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800">
                No effort records found. Start by logging a new entry.
              </td>
            </tr>
          ) : (
            tasks.map((task) => (
              <tr key={task.id} className="group transition-all duration-300 hover:-translate-y-1">
                <td className="px-6 py-8 whitespace-nowrap text-sm font-bold text-zinc-900 dark:text-white tabular-nums align-top bg-white dark:bg-zinc-900 rounded-l-[1.5rem] border-y border-l border-zinc-100 dark:border-zinc-800 group-hover:border-orange-500/50 group-hover:bg-zinc-50 dark:group-hover:bg-zinc-800/20 shadow-sm transition-all">
                  {task.date.slice(0, 4)}-{task.date.slice(4, 6)}-{task.date.slice(6, 8)}
                </td>
                <td className="px-6 py-8 whitespace-nowrap align-top bg-white dark:bg-zinc-900 border-y border-zinc-100 dark:border-zinc-800 group-hover:border-orange-500/50 group-hover:bg-zinc-50 dark:group-hover:bg-zinc-800/20 shadow-sm transition-all">
                  <span className="inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 uppercase tracking-wider">
                    {task.activity}
                  </span>
                </td>
                <td className="px-6 py-8 whitespace-nowrap text-sm font-bold text-zinc-600 dark:text-zinc-300 align-top bg-white dark:bg-zinc-900 border-y border-zinc-100 dark:border-zinc-800 group-hover:border-orange-500/50 group-hover:bg-zinc-50 dark:group-hover:bg-zinc-800/20 shadow-sm transition-all">
                  {task.project}
                </td>
                <td className="px-6 py-8 text-sm text-zinc-500 dark:text-zinc-400 align-top max-w-md bg-white dark:bg-zinc-900 border-y border-zinc-100 dark:border-zinc-800 group-hover:border-orange-500/50 group-hover:bg-zinc-50 dark:group-hover:bg-zinc-800/20 shadow-sm transition-all">
                  <div className="leading-relaxed whitespace-pre-wrap break-words min-w-[200px]" title={task.description}>
                    {task.description}
                  </div>
                </td>
                <td className="px-6 py-8 whitespace-nowrap align-top bg-white dark:bg-zinc-900 border-y border-zinc-100 dark:border-zinc-800 group-hover:border-orange-500/50 group-hover:bg-zinc-50 dark:group-hover:bg-zinc-800/20 shadow-sm transition-all">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ring-1 ring-inset ${
                    task.status === "completed"
                      ? "bg-emerald-50 text-emerald-600 ring-emerald-600/20 dark:bg-emerald-900/20 dark:text-emerald-400 dark:ring-emerald-400/20"
                      : "bg-amber-50 text-amber-600 ring-amber-600/20 dark:bg-amber-900/20 dark:text-amber-400 dark:ring-amber-400/20"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full mr-2 ${task.status === "completed" ? "bg-emerald-500" : "bg-amber-500"}`}></span>
                    {task.status === "completed" ? "Done" : "Pending"}
                  </span>
                </td>
                <td className="px-6 py-8 whitespace-nowrap text-sm font-bold text-zinc-900 dark:text-white tabular-nums align-top bg-white dark:bg-zinc-900 border-y border-zinc-100 dark:border-zinc-800 group-hover:border-orange-500/50 group-hover:bg-zinc-50 dark:group-hover:bg-zinc-800/20 shadow-sm transition-all">
                  {task.duration} <span className="text-zinc-400 font-medium">min</span>
                </td>
                <td className="px-6 py-8 whitespace-nowrap text-right text-sm font-medium space-x-4 align-top bg-white dark:bg-zinc-900 border-y border-r border-zinc-100 dark:border-zinc-800 rounded-r-[1.5rem] group-hover:border-orange-500/50 group-hover:bg-zinc-50 dark:group-hover:bg-zinc-800/20 shadow-sm transition-all">
                  <button
                    onClick={() => onEdit(task)}
                    className="text-zinc-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
                    title="Edit Entry"
                  >
                    <svg className="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                  </button>
                  <button
                    onClick={() => onStatusChange(task.id, "completed")}
                    className="px-4 py-2 bg-zinc-900 dark:bg-orange-500 text-white rounded-xl text-[10px] font-black uppercase tracking-wider hover:scale-105 active:scale-95 transition-all shadow-lg shadow-orange-500/10"
                  >
                    Copy
                  </button>
                  <button
                    onClick={() => onDelete(task.id)}
                    className="text-zinc-300 hover:text-red-500 transition-colors"
                    title="Delete Entry"
                  >
                    <svg className="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
