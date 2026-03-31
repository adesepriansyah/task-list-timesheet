export type TaskStatus = "pending" | "in_progress" | "completed";

export interface Task {
  id: string;
  date: string;
  activity: string;
  project: string;
  description: string;
  status: "pending" | "in-progress" | "completed"; // UI status
  duration: number; // total minutes
}

export interface TaskBackend {
  id: number;
  title: string;
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
