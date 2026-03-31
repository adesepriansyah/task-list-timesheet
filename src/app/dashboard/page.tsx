"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { DashboardSummary } from "@/components/tasks/DashboardSummary";
import { TaskForm } from "@/components/tasks/TaskForm";
import { TaskTable } from "@/components/tasks/TaskTable";
import { Sidebar } from "@/components/Sidebar";
import { Toast } from "@/components/Toast";
import { Modal } from "@/components/Modal";
import { ConfirmModal } from "@/components/ConfirmModal";
import { taskService } from "@/services/tasks-service";
import { Task, TaskSummary } from "@/types/tasks-type";
import { useAuth } from "@/hooks/useAuth";
import { logoutUser } from "@/services/authService";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<"home" | "tasks">("home");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [summary, setSummary] = useState<TaskSummary>({ pending: 0, inProgress: 0, completed: 0, total: 0 });
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  
  // Filtering & Copy logic
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [copyingTask, setCopyingTask] = useState<Task | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

  const filteredTasks = tasks.filter((task) => {
    const taskDate = task.date;
    const start = dateRange.start.replace(/-/g, "");
    const end = dateRange.end.replace(/-/g, "");

    const matchesDate =
      (!start || taskDate >= start) && (!end || taskDate <= end);
    
    const matchesSearch = 
      !searchQuery || 
      task.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.activity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesDate && matchesSearch;
  });

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
  };

  const fetchData = useCallback(async () => {
    if (!user) return;
    try {
      const [allTasks, taskSummary] = await Promise.all([
        taskService.getTasks(user.id),
        taskService.getSummary(user.id)
      ]);
      setTasks(allTasks);
      setSummary(taskSummary);
    } catch (error) {
      showToast("task belum di tambahkan", "error");
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = async (taskData: Omit<Task, "id">) => {
    if (!user) return;
    setIsLoading(true);
    try {
      if (editingTask) {
        await taskService.updateTask(editingTask.id, taskData, user.id);
        showToast("Entry updated!");
        setEditingTask(null);
      } else {
        await taskService.createTask({ ...taskData, status: "pending" }, user.id);
        showToast("Data Berhasil di Tambahkan");
      }
      setIsModalOpen(false);
      await fetchData();
    } catch (error) {
      showToast("Operation failed", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyConfirm = async () => {
    if (!copyingTask || !user) return;
    
    const copyText = `/effort date:${copyingTask.date} activity:${copyingTask.activity} project:${copyingTask.project} description:${copyingTask.description} duration:${copyingTask.duration}`;
    
    try {
      await navigator.clipboard.writeText(copyText);
      const { id, ...taskData } = copyingTask;
      await taskService.updateTask(id, { ...taskData, status: "completed" }, user.id);
      showToast("Copied & status updated to Done!");
      await fetchData();
    } catch (err) {
      showToast("Copy failed", "error");
    } finally {
      setCopyingTask(null);
    }
  };

  const confirmDelete = async () => {
    if (!deletingTaskId) return;
    try {
      await taskService.deleteTask(deletingTaskId);
      showToast("Entry removed successfully.");
      await fetchData();
    } catch (error) {
      showToast("Delete failed", "error");
    } finally {
      setDeletingTaskId(null);
    }
  };

  const handleDelete = (id: string) => {
    setDeletingTaskId(id);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      // Still redirect even if backend fails
    }
    router.push("/login");
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white dark:bg-zinc-950 font-[family-name:var(--font-quicksand)] border-t-4 border-blue-600 transition-colors">
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      {/* Warning/Confirmation Modal for Copy */}
      <ConfirmModal
        isOpen={!!copyingTask}
        onClose={() => setCopyingTask(null)}
        onConfirm={handleCopyConfirm}
        title="Copy Effort Format?"
        type="warning"
        message="Copying this will automatically change the task status to COMPLETED (Done). Proceed?"
        confirmLabel="Yes, Copy & Done"
      />

      {/* Danger Modal for Delete */}
      <ConfirmModal
        isOpen={!!deletingTaskId}
        onClose={() => setDeletingTaskId(null)}
        onConfirm={confirmDelete}
        title="Remove Effort Log?"
        type="danger"
        message="Are you sure you want to permanently delete this entry? This action cannot be reversed."
        confirmLabel="Permanent Delete"
      />

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingTask ? "Edit Work Log" : "Log New Work Entry"}
      >
        <TaskForm 
          onSubmit={handleSubmit} 
          initialData={editingTask} 
          onCancel={() => setIsModalOpen(false)}
          isLoading={isLoading}
        />
      </Modal>

      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        onLogout={handleLogout} 
      />

      <main className="flex-1 p-8 overflow-y-auto">
        <div className={activeTab === "tasks" ? "max-w-[1600px] mx-auto" : "max-w-6xl mx-auto"}>
          <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="animate-in slide-in-from-left duration-500">
              <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight uppercase italic decoration-blue-600 underline underline-offset-8">
                {activeTab}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-4 text-lg font-medium">
                {activeTab === "home" 
                  ? "Real-time effort analytics and summary." 
                  : "Search and manage your professional effort logs."}
              </p>
            </div>
            {activeTab === "tasks" && (
              <button 
                onClick={openAddModal}
                className="flex items-center gap-3 px-8 py-4 bg-zinc-900 dark:bg-blue-600 text-white rounded-2xl font-bold hover:scale-105 transition-all shadow-xl shadow-blue-600/20 active:scale-95"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Log Effort
              </button>
            )}
          </header>

          {activeTab === "home" ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <DashboardSummary summary={summary} />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-zinc-50 dark:bg-zinc-900 rounded-[2rem] p-10 border border-zinc-100 dark:border-zinc-800 shadow-sm">
                  <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-700 dark:text-blue-400 mb-8">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                  </div>
                  <h3 className="text-3xl font-black mb-4 text-zinc-900 dark:text-white uppercase tracking-tighter">Peak Productivity</h3>
                  <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed mb-8 text-xl font-medium">
                    Finished <span className="text-blue-600 font-black">{summary.completed} tasks</span>! 
                    Your current efficiency is at an all-time high.
                  </p>
                  <button 
                    onClick={() => setActiveTab("tasks")}
                    className="group px-10 py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all flex items-center gap-3 uppercase tracking-wider"
                  >
                    View Logs
                    <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4 4H3"/></svg>
                  </button>
                </div>

                <div className="bg-zinc-900 rounded-[2rem] p-10 text-white flex flex-col justify-center relative overflow-hidden ring-1 ring-white/10">
                  <div className="relative z-10">
                    <h3 className="text-3xl font-black mb-4 uppercase tracking-tighter text-blue-600">Quick Reminder</h3>
                    <p className="text-zinc-400 text-xl leading-relaxed font-medium">
                      Automated reporting is active. Copying a task format will mark it as <span className="text-white underline">Done</span> automatically.
                    </p>
                  </div>
                  <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl"></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-6">
              <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm flex flex-col lg:flex-row items-center gap-6">
                <div className="relative w-full lg:w-96 group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-blue-600 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search project, activity, or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 rounded-2xl focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 transition-all outline-none text-sm font-bold text-zinc-900 dark:text-white placeholder:text-zinc-400 placeholder:font-medium"
                  />
                </div>

                <div className="hidden lg:block w-px h-10 bg-zinc-100 dark:bg-zinc-800 mx-2"></div>

                <div className="flex items-center gap-4 w-full lg:w-auto">
                  <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] whitespace-nowrap">Filter Period:</span>
                  <div className="flex flex-1 lg:flex-initial items-center gap-2">
                    <input
                      type="date"
                      className="flex-1 lg:w-44 px-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 rounded-xl focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 transition-all outline-none text-xs font-bold text-zinc-900 dark:text-white"
                      value={dateRange.start}
                      onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                    />
                    <span className="text-zinc-300 dark:text-zinc-700 font-bold">to</span>
                    <input
                      type="date"
                      className="flex-1 lg:w-44 px-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 rounded-xl focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 transition-all outline-none text-xs font-bold text-zinc-900 dark:text-white"
                      value={dateRange.end}
                      onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden p-2">
                <div className="mb-4 flex items-center justify-between px-6 pt-6 pb-2">
                  <h3 className="text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter">Registry</h3>
                  <div className="flex items-center gap-3 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] bg-zinc-50 dark:bg-zinc-800/50 px-4 py-2 rounded-full">
                    Validated History ({filteredTasks.length})
                  </div>
                </div>
                <TaskTable 
                  tasks={filteredTasks} 
                  onEdit={handleEdit} 
                  onDelete={handleDelete} 
                  onStatusChange={(id) => {
                    const task = tasks.find(t => t.id === id);
                    if (task) setCopyingTask(task);
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
