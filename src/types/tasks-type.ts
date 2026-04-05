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

export interface TaskBackend {
  id: number;
  title: string;
  project: string;
  description: string;
  status: "pending" | "in_progress" | "completed";
  user_id: number;
  date: string;          // "YYYY-MM-DD"
  effort_time: number;   // menit
}

export interface TaskSummary {
  pending: number;
  inProgress: number;
  completed: number;
  total: number;
}
