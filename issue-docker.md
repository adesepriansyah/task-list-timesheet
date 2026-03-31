# Panduan Implementasi Docker & Deployment

## Deskripsi Singkat
Dokumen ini berisi perencanaan teknis untuk konfigurasi environment, membungkus (*containerize*) aplikasi menggunakan Docker, dan panduan deployment ke server.

---

## 1. Setup Environment Variables (`.env`)

### 1.1. Deskripsi
Proyek ini membutuhkan file environment (`.env`) untuk menyimpan konfigurasi yang bisa berubah-ubah tergantung lingkungan (development/staging/production). File `.env` **TIDAK boleh di-commit ke Git** (sudah ada di `.gitignore`).

### 1.2. Informasi Teknis Proyek
| Item | Nilai |
|---|---|
| Framework | Next.js `16.2.1` |
| Runtime | Bun |
| UI Library | React `19.2.4` |
| CSS | TailwindCSS `4` + PostCSS |
| Language | TypeScript `5` |
| Port Default | `3000` |

### 1.3. Tahapan Implementasi

#### Langkah 1: Buat file `.env.example` di root proyek

> **Tujuan:** File ini adalah *template* yang di-commit ke Git agar developer lain tahu variabel apa saja yang dibutuhkan.

Buat file `.env.example` dengan isi berikut:

```env
# ========================================
# APP CONFIGURATION
# ========================================
PORT=3000
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# ========================================
# API / BACKEND CONFIGURATION
# ========================================
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api

# ========================================
# DATABASE (opsional)
# ========================================
# DATABASE_URL=postgresql://user:password@localhost:5432/task_timesheet_db
```

> **Penting:** Variabel `NEXT_PUBLIC_` tersedia di browser. Untuk JWT, token dikelola oleh **backend** — frontend hanya menyimpan dan mengirim token tersebut.

#### Langkah 2: Buat file `.env` untuk development lokal
Salin `.env.example` menjadi `.env`. Isi nilai-nilai sesuai environment lokal kamu.

#### Langkah 3: Update service aplikasi
Pastikan variabel environment seperti `NEXT_PUBLIC_API_BASE_URL` digunakan di dalam folder `src/services/` untuk menggantikan data dummy saat backend sudah siap.

---

## 2. Setup Docker untuk Deployment

### 2.1. Deskripsi
Docker digunakan agar aplikasi bisa di-deploy ke server manapun secara konsisten. Kita akan membuat `Dockerfile`, `docker-compose.yml`, dan `.dockerignore`.

### 2.2. Tahapan Implementasi

#### Langkah 1: Buat file `.dockerignore`
Abaikan `node_modules`, `.next`, `.env`, dan file non-esensial lainnya.

#### Langkah 2: Update `next.config.ts`
Set `output: "standalone"` agar build Next.js lebih efisien di dalam Docker.

#### Langkah 3: Buat file `Dockerfile`
Gunakan multi-stage build dengan runtime **Bun**.

#### Langkah 4: Buat file `docker-compose.yml`
Gunakan orchestrator ini untuk menjalankan container dengan environment variables yang sesuai.

#### Langkah 5: Build & Jalankan
```bash
docker compose up -d --build
```

---

## 3. Deployment ke Server (Panduan Singkat)

### Opsi A: Build di Server
Clone repo, siapkan `.env.production`, lalu jalankan `docker compose up -d --build`.

### Opsi B: Docker Registry
Push image ke Docker Hub/GHCR, lalu pull di server tujuan.

---

## 4. Checklist Akhir Docker & Env

- [ ] File `.env.example` sudah dibuat.
- [ ] File `.env` lokal sudah siap.
- [ ] `next.config.ts` sudah di-set `standalone`.
- [ ] `Dockerfile` & `.dockerignore` sudah siap.
- [ ] `docker-compose.yml` sudah dikonfigurasi.
- [ ] `docker compose up` berhasil diuji coba.

---

## Catatan Penting

> [!WARNING]
> **Jangan pernah commit file `.env` yang berisi nilai rahasia ke Git!** Gunakan `.env.example` sebagai template.

> [!TIP]
> Untuk image production yang lebih kecil, pastikan menggunakan stage `runner` yang bersih dari dev dependencies.
