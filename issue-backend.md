# Panduan Integrasi Backend API & Validasi Session JWT

## Deskripsi Singkat
Dokumen ini berisi perencanaan untuk mengintegrasikan endpoint backend API yang sudah tersedia ke dalam aplikasi frontend Next.js, serta mengimplementasikan validasi session menggunakan JWT dari backend.

Saat ini seluruh service di frontend (`authService.ts` dan `tasks-service.ts`) menggunakan **data mock/dummy**. Tahap ini akan mengganti semua data mock tersebut dengan panggilan API ke backend yang berjalan di `http://localhost:8080`.

Panduan ini disederhanakan agar dapat diikuti secara langsung oleh *Junior Programmer* atau diimplementasikan secara otomatis oleh *AI Model*.

---

## 1. Ringkasan Endpoint Backend

Berikut daftar endpoint yang tersedia di backend (lihat detail lengkap di `api_testing.md`):

### Auth Endpoints
| Method | Endpoint | Deskripsi | Auth Header? |
|---|---|---|---|
| `POST` | `/api/users/register` | Registrasi user baru | ❌ |
| `POST` | `/api/users/login` | Login, mendapatkan JWT token | ❌ |
| `POST` | `/api/users/logout` | Logout, menghapus token dari DB | ✅ Bearer Token |
| `GET` | `/api/users/info` | Mendapatkan info user yang sedang login | ✅ Bearer Token |

### Task CRUD Endpoints
| Method | Endpoint | Deskripsi | Auth Header? |
|---|---|---|---|
| `POST` | `/api/tasks` | Membuat task baru | ❌* |
| `GET` | `/api/tasks?user_id=X` | Mengambil daftar task (dengan filter) | ❌* |
| `PUT` | `/api/tasks/:id` | Mengupdate task | ❌* |
| `DELETE` | `/api/tasks/:id` | Menghapus task | ❌* |

> **Catatan:** Endpoint task saat ini belum memerlukan Auth Header, tapi memerlukan `user_id` sebagai identifier.

### Perbedaan Nama Field (Frontend vs Backend)

> [!IMPORTANT]  
> Field di backend **berbeda** dengan yang ada di frontend saat ini. Mapping ini sangat penting untuk diperhatikan.

| Frontend (saat ini) | Backend API | Keterangan |
|---|---|---|
| `id` (string) | `id` (number) | Tipe data berbeda |
| `activity` | `title` | Nama field berbeda |
| `duration` (menit) | `effort_time` (menit) | Nama field berbeda |
| `date` (format `YYYYMMDD`) | `date` (format `YYYY-MM-DD`) | Format tanggal berbeda |
| `status: "in-progress"` | `status: "in_progress"` | Separator berbeda (dash vs underscore) |
| - | `user_id` | Baru, diperlukan backend |
| `project` | `description` | **Perlu diklarifikasi** — backend menggunakan `description` untuk uraian, tapi frontend memakai `project` dan `description` terpisah |

---

## 2. Tahapan Implementasi

### Tahap 1: Setup Utilitas HTTP & Token Management

> **Tujuan:** Membuat fungsi helper untuk menyimpan/mengambil JWT token dan membuat HTTP request ke backend.

#### Langkah 1.1: Buat file `src/services/api.ts`

File ini berisi konfigurasi base URL dan helper function untuk HTTP request.

```typescript
// src/services/api.ts
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";

// Helper untuk menyimpan token ke localStorage
export function setToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("auth_token", token);
  }
}

// Helper untuk mengambil token dari localStorage
export function getToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth_token");
  }
  return null;
}

// Helper untuk menghapus token
export function removeToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token");
  }
}

// Generic fetch wrapper dengan Authorization header
export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error || `Request failed: ${res.status}`);
  }

  return res.json();
}
```

---

### Tahap 2: Update Auth Service

> **Tujuan:** Mengganti fungsi auth dummy dengan panggilan API ke backend.

#### Langkah 2.1: Update `src/types/auth.ts`

Sesuaikan interface dengan response format backend:

```typescript
export interface User {
  id: number;           // Backend menggunakan number
  name: string;
  email: string;
  expired_token?: string; // Dari endpoint /api/users/info
}

export interface AuthResponse {
  data: {
    token: string;      // Response backend: { data: { token: "..." } }
  };
}

export interface UserInfoResponse {
  data: User;           // Response backend: { data: { id, name, email, expired_token } }
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}
```

#### Langkah 2.2: Rewrite `src/services/authService.ts`

Ganti seluruh isi file dengan:

```typescript
import { apiFetch, setToken, removeToken } from "./api";
import { AuthResponse, LoginPayload, RegisterPayload, UserInfoResponse } from "../types/auth";

export async function loginUser(payload: LoginPayload) {
  const res = await apiFetch<AuthResponse>("/users/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  setToken(res.data.token);
  return res;
}

export async function registerUser(payload: RegisterPayload) {
  await apiFetch<{ data: string }>("/users/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  // Register hanya return { data: "Ok" }, tidak ada token
}

export async function logoutUser() {
  await apiFetch<{ data: string }>("/users/logout", {
    method: "POST",
  });
  removeToken();
}

export async function getUserInfo() {
  const res = await apiFetch<UserInfoResponse>("/users/info");
  return res.data;
}
```

#### Langkah 2.3: Update halaman Login (`src/app/login/page.tsx`)

Ubah handler `handleLogin` agar menyimpan token dan redirect sesuai respons baru backend:

```typescript
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  setErrorMsg("");
  try {
    await loginUser({ email, password });
    setToast({ message: "Login Success!", type: "success" });
    setTimeout(() => router.push("/dashboard"), 1000);
  } catch (err: any) {
    setErrorMsg(err.message || "Login failed");
  } finally {
    setIsLoading(false);
  }
};
```

#### Langkah 2.4: Update halaman Register (`src/app/register/page.tsx`)

Ubah handler `handleRegister` — backend register hanya return `{ data: "Ok" }`, bukan user object:

```typescript
const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  setErrorMsg("");
  try {
    await registerUser({ name, email, password });
    alert("Registration Success!");
    router.push("/login");
  } catch (err: any) {
    setErrorMsg(err.message || "Registration failed");
  } finally {
    setIsLoading(false);
  }
};
```

---

### Tahap 3: Implementasi Validasi Session JWT

> **Tujuan:** Melindungi halaman dashboard. Jika user belum login atau token kadaluarsa, redirect ke halaman login.

#### Langkah 3.1: Buat hook `src/hooks/useAuth.ts`

```typescript
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserInfo } from "@/services/authService";
import { getToken } from "@/services/api";
import { User } from "@/types/auth";

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/login");
      return;
    }

    getUserInfo()
      .then((userData) => {
        setUser(userData);
        setIsAuthLoading(false);
      })
      .catch(() => {
        // Token invalid atau expired
        router.replace("/login");
      });
  }, [router]);

  return { user, isAuthLoading };
}
```

#### Langkah 3.2: Pasang hook `useAuth` di Dashboard (`src/app/dashboard/page.tsx`)

Tambahkan di awal komponen `DashboardPage`:

```typescript
import { useAuth } from "@/hooks/useAuth";

export default function DashboardPage() {
  const { user, isAuthLoading } = useAuth();

  // Tampilkan loading saat validasi session
  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // ... kode dashboard lainnya
}
```

#### Langkah 3.3: Update fungsi Logout di Dashboard

Ganti fungsi `handleLogout` yang sekarang hanya redirect:

```typescript
import { logoutUser } from "@/services/authService";

const handleLogout = async () => {
  try {
    await logoutUser(); // Panggil API logout + hapus token
  } catch {
    // Tetap redirect meskipun gagal
  }
  router.push("/login");
};
```

---

### Tahap 4: Update Task Service

> **Tujuan:** Mengganti data mock task dengan panggilan API ke backend.

#### Langkah 4.1: Update `src/types/tasks-type.ts`

Sesuaikan dengan response backend:

```typescript
export type TaskStatus = "pending" | "in_progress" | "completed";

// Interface sesuai format backend
export interface TaskBackend {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  user_id: number;
  date: string;          // "YYYY-MM-DD"
  effort_time: number;   // menit
}

// Interface untuk frontend (digunakan di komponen UI)
export interface Task {
  id: string;
  date: string;          // "YYYYMMDD"
  activity: string;
  project: string;
  description: string;
  status: "pending" | "in-progress" | "completed";
  duration: number;
}

export interface TaskSummary {
  pending: number;
  inProgress: number;
  completed: number;
  total: number;
}
```

#### Langkah 4.2: Buat mapper functions di `src/services/task-mapper.ts`

> **Tujuan:** Konversi format data antara backend dan frontend.

```typescript
import { Task, TaskBackend } from "@/types/tasks-type";

// Konversi dari backend -> frontend
export function mapBackendToFrontend(task: TaskBackend): Task {
  return {
    id: String(task.id),
    date: task.date.replace(/-/g, ""),                      // "2026-04-01" -> "20260401"
    activity: task.title,
    project: "",                                             // Backend tidak punya field project
    description: task.description,
    status: task.status === "in_progress" ? "in-progress" : task.status,
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
    status: task.status === "in-progress" ? "in_progress" : task.status,
    user_id: userId,
    date: dateFormatted,
    effort_time: task.duration,
  };
}
```

#### Langkah 4.3: Rewrite `src/services/tasks-service.ts`

```typescript
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

  updateTask: async (id: string, updatedTask: Partial<Task>, userId: number): Promise<Task> => {
    const payload = mapFrontendToBackend(updatedTask as Omit<Task, "id">, userId);
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
```

#### Langkah 4.4: Update Dashboard untuk menggunakan `user.id`

Karena task endpoint memerlukan `user_id`, update pemanggilan service di `src/app/dashboard/page.tsx`:

```typescript
// Sebelum:
// const allTasks = await taskService.getTasks();

// Sesudah:
const allTasks = await taskService.getTasks(user!.id);
const taskSummary = await taskService.getSummary(user!.id);

// Untuk create:
await taskService.createTask({ ...taskData, status: "pending" }, user!.id);

// Untuk update:
await taskService.updateTask(editingTask.id, taskData, user!.id);
```

---

### Tahap 5: Update `.env.example`

Tambahkan atau pastikan variabel berikut ada:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
```

---

## 3. Checklist Implementasi

- [ ] `src/services/api.ts` — HTTP helper + token management
- [ ] `src/types/auth.ts` — Update interface sesuai backend response
- [ ] `src/services/authService.ts` — Ganti mock dengan API call
- [ ] `src/app/login/page.tsx` — Sesuaikan handler login
- [ ] `src/app/register/page.tsx` — Sesuaikan handler register
- [ ] `src/hooks/useAuth.ts` — Hook validasi session JWT
- [ ] `src/app/dashboard/page.tsx` — Pasang `useAuth` + update logout + gunakan `user.id`
- [ ] `src/types/tasks-type.ts` — Tambahkan `TaskBackend` interface
- [ ] `src/services/task-mapper.ts` — Mapper backend ↔ frontend
- [ ] `src/services/tasks-service.ts` — Ganti mock dengan API call
- [ ] `.env.example` — Pastikan `NEXT_PUBLIC_API_BASE_URL` tercantum
- [ ] Test login → dashboard → CRUD task → logout → akses dashboard (harus redirect ke login)

---

## Catatan Penting

> [!WARNING]
> Perhatikan perbedaan nama field antara frontend dan backend (lihat tabel di Bagian 1). Pastikan mapper functions bekerja dengan benar.

> [!IMPORTANT]
> Token JWT disimpan di `localStorage`. Pastikan setiap request ke endpoint yang memerlukan autentikasi mengirimkan header `Authorization: Bearer <token>`.

> [!TIP]
> Gunakan backend yang sudah berjalan di `http://localhost:8080` untuk menguji. Jalankan backend dengan `make run` di repository `task-list-timesheet-be`.
