export type TaskStatus = "pending" | "in-progress" | "completed";

export interface Task {
  id: string;
  date: string;
  activity: string;
  project: string;
  description: string;
  status: TaskStatus;
  duration: number; // total minutes
}

export interface TaskSummary {
  pending: number;
  inProgress: number;
  completed: number;
  total: number;
}
