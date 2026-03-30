import React from "react";
import { TaskSummary } from "../../types/tasks-type";

interface SummaryCardProps {
  label: string;
  value: number;
  color: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ label, value, color }) => (
  <div className={`p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 flex flex-col items-center justify-center transition-all hover:shadow-md`}>
    <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{label}</span>
    <span className={`text-3xl font-bold ${color}`}>{value}</span>
  </div>
);

export const DashboardSummary: React.FC<{ summary: TaskSummary }> = ({ summary }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <SummaryCard label="Total Tasks" value={summary.total} color="text-blue-600 dark:text-blue-400" />
      <SummaryCard label="Pending" value={summary.pending} color="text-yellow-600 dark:text-yellow-400" />
      <SummaryCard label="In-Progress" value={summary.inProgress} color="text-indigo-600 dark:text-indigo-400" />
      <SummaryCard label="Completed" value={summary.completed} color="text-emerald-600 dark:text-emerald-400" />
    </div>
  );
};
