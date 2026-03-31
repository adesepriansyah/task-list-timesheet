import { Task, TaskSummary, TaskBackend } from "@/types/tasks-type";
import { apiFetch } from "./api";
import { mapBackendToFrontend, mapFrontendToBackend } from "./task-mapper";

export const taskService = {
  getTasks: async (userId: number): Promise<Task[]> => {
    const res = await apiFetch<{ data: TaskBackend[] }>(`/tasks?user_id=${userId}`);
    return (res.data || []).map(mapBackendToFrontend);
  },

  getSummary: async (userId: number): Promise<TaskSummary> => {
    const tasks = await taskService.getTasks(userId);
    return tasks.reduce(
      (acc, task) => {
        if (task.status === "pending") acc.pending++;
        else if (task.status === "in-progress") acc.inProgress++;
        else if (task.status === "completed") acc.completed++;
        acc.total++;
        return acc;
      },
      { pending: 0, inProgress: 0, completed: 0, total: 0 }
    );
  },

  createTask: async (task: Omit<Task, "id">, userId: number): Promise<Task> => {
    const payload = mapFrontendToBackend(task, userId);
    const res = await apiFetch<{ data: TaskBackend }>("/tasks", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return mapBackendToFrontend(res.data);
  },

  updateTask: async (id: string, updatedTask: Omit<Task, "id">, userId: number): Promise<Task> => {
    const payload = mapFrontendToBackend(updatedTask, userId);
    const res = await apiFetch<{ data: TaskBackend }>(`/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    return mapBackendToFrontend(res.data);
  },

  deleteTask: async (id: string): Promise<void> => {
    await apiFetch(`/tasks/${id}`, { method: "DELETE" });
  },
};
