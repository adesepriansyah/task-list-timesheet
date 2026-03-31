import { Task, TaskBackend } from "@/types/tasks-type";

// Konversi dari backend -> frontend
export function mapBackendToFrontend(task: TaskBackend): Task {
  return {
    id: String(task.id),
    date: task.date.replace(/-/g, ""),                      // "2026-04-01" -> "20260401"
    activity: task.title,
    project: "",                                             // Backend tidak punya field project
    description: task.description,
    status: task.status === "in_progress" ? "in-progress" : task.status as any,
    duration: task.effort_time,
  };
}

// Konversi dari frontend -> backend
export function mapFrontendToBackend(
  task: Omit<Task, "id">,
  userId: number
): Omit<TaskBackend, "id"> {
  const dateFormatted = task.date.length === 8
    ? `${task.date.slice(0, 4)}-${task.date.slice(4, 6)}-${task.date.slice(6, 8)}`
    : task.date;                                             // "20260401" -> "2026-04-01"

  return {
    title: task.activity,
    description: task.description,
    status: task.status === "in-progress" ? "in_progress" : task.status as any,
    user_id: userId,
    date: dateFormatted,
    effort_time: task.duration,
  };
}
