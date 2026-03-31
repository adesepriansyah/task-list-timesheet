import { Task, TaskSummary } from "../types/tasks-type";

let mockTasks: Task[] = [
  {
    id: "1",
    date: "20260330",
    activity: "Coding",
    project: "DTP Finnet",
    description: "https://github.com/adesepriansyah/task-list-timesheet/issues/1",
    status: "completed",
    duration: 300,
  }
];

export const taskService = {
  getTasks: async (): Promise<Task[]> => {
    return new Promise((resolve) => setTimeout(() => resolve([...mockTasks]), 500));
  },

  getSummary: async (): Promise<TaskSummary> => {
    const summary = mockTasks.reduce(
      (acc, task) => {
        if (task.status === "pending") acc.pending++;
        else if (task.status === "in-progress") acc.inProgress++;
        else if (task.status === "completed") acc.completed++;
        acc.total++;
        return acc;
      },
      { pending: 0, inProgress: 0, completed: 0, total: 0 }
    );
    return new Promise((resolve) => setTimeout(() => resolve(summary), 500));
  },

  createtask: async (task: Omit<Task, "id">): Promise<Task> => {
    const newTask = { ...task, id: Math.random().toString(36).substr(2, 9) };
    mockTasks = [newTask, ...mockTasks];
    return new Promise((resolve) => setTimeout(() => resolve(newTask), 500));
  },

  updateTask: async (id: string, updatedTask: Partial<Task>): Promise<Task> => {
    mockTasks = mockTasks.map((t) => (t.id === id ? { ...t, ...updatedTask } : t));
    const task = mockTasks.find((t) => t.id === id)!;
    return new Promise((resolve) => setTimeout(() => resolve(task), 500));
  },

  deleteTask: async (id: string): Promise<void> => {
    mockTasks = mockTasks.filter((t) => t.id !== id);
    return new Promise((resolve) => setTimeout(() => resolve(), 500));
  },
};
