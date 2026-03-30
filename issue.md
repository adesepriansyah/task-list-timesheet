# Panduan Setup Proyek Frontend (React + Next.js + TypeScript)

## Deskripsi Singkat
Dokumen ini berisi instruksi tingkat tinggi (*high-level*) untuk menginisialisasi dan membangun tampilan proyek **Frontend**. 
Tugas utama fase ini adalah menyiapkan kerangka kerja dan komponen Antarmuka Pengguna (UI) menggunakan data statis/dummy terlebih dahulu. Nantinya, tim **Backend Developer** akan melanjutkan sistem ini untuk menyambungkan (*wiring*) UI tersebut dengan API server yang sebenarnya.

Mengingat instruksi ini dirancang agar dapat dieksekusi dengan efisien oleh model AI yang lebih ringan atau *junior programmer*, penjabaran telah dihindari dari kerumitan teknis (*low-level specific configuration*) dan difokuskan pada hasil akhir.

## Tech Stack Utama
- **Library Inti:** React
- **Framework Utama:** Next.js
- **Bahasa Pemrograman:** TypeScript
- **Package Manager:** Bun

---

## Ketentuan Desain & Tema (Penting!)
- **Gaya Visual (Aesthetics):** Aplikasi harus menggunakan tema desain UI/UX yang *modern*, *clean*, dan sesuai dengan standar industri startup/tech masa kini. 
- **Rekomendasi Styling:** 
  - Gunakan **Tailwind CSS** (biasanya otomatis terinstal saat setup Next.js) dipadukan dengan library komponen UI modern seperti **Shadcn/UI**, **Radix UI**, atau **Aceternity UI**.
  - Terapkan hierarki tipografi yang rapi (misalnya Font Inter/Mona Sans), perhatikan *white-space*, serta sediakan dukungan *Dark Mode* jika memungkinkan.
  - Tambahkan micro-animasi (*framer-motion* atau transisi CSS standar) agar aplikasi terasa "hidup" dan premium, tidak terlihat kaku atau generik.

---

## Langkah-Langkah Implementasi (*High-Level Action Plan*)

### Tahap 1: Inisialisasi Proyek Dasar
1. Inisialisasi proyek Next.js baru langsung di dalam direktori ini menggunakan Bun (`bun create next-app@latest .`).
2. Pastikan untuk **memilih (Enable) TypeScript** dan **Tailwind CSS** pada saat proses instalasi (Wajib).
3. Gunakan fitur *App Router* terbaru, pastikan lingkungan sudah siap berjalan bebas error.

### Tahap 2: Standardisasi Struktur Folder Utama
Rapikan dan susun hierarki folder agar Backend Developer mudah membaca alur data nantinya. Rekomendasi folder yang harus ada (di dalam `src/` atau *root*):
- **`components/`** : Tempat untuk menaruh semua blok bangunan UI fungsional dan *reusable* (seperti Tombol, Input Form, Tabel). Komponen UI *modern* seperti Shadcn diletakkan di sini.
- **`types/`** : Tempat sentral mendefinisikan bentuk data menggunakan *Interface* atau *Type* TypeScript.
- **`services/`** (atau `api/`) : Folder krusial. Buat semua fungsi pengambilan data server di sini. **Beri instruksi**: Untuk saat ini, kembalikan data *dummy* statis saja, jangan melakukan *fetch* HTTP secara nyata.

### Tahap 3: Pembuatan Antarmuka (UI) via Dummy Data
1. Bangun halaman web sesuai desain fitur yang diminta murni menggunakan React. Pastikan tampilan memenuhi standar **Premium/Modern** seperti yang dijelaskan di Ketentuan Desain di atas.
2. Seluruh data berulang yang muncul di layar (seperti List Tabel, atau Isi Berita) wajib mengambil data dari fungsi-fungsi dummy di dalam folder `services/`.
3. **Wajib bagi Frontend:** Definisikan dengan jelas skema data (*TypeScript Interface*) untuk setiap objek atau array yang digunakan. Ini merupakan "Kontrak Data" vital yang akan dibaca Backend Developer saat menyiapkan API mereka. 

### Tahap 4: Pemeriksaan Kualitas & Serah Terima (Handover)
1. Jalankan aplikasi secara lokal (mode developer `bun run dev`) dan tes navigasi halaman untuk memastikan UI sudah responsif dan utuh secara visual.
2. Pastikan terminal indikator kompilasi menyatakan **bebas dari Error System / TypeScript**.
3. Jika tahap UI dengan dummy ini berhasil dan terlihat estetik/modern, nyatakan fase *Frontend Setup* ini **Selesai**. Tahap *Integration* akan diserahkan ke *Backend Developer*.

---
**Catatan untuk Eksekutor (Programmer / AI Model Khusus Implementasi):**
- Tolong selesaikan instruksi secara lurus mengikuti tahapan. Jangan merancang *setup* yang kelewat rumit (misalnya menggunakan *Global State Manager* atau *Middlewares* spesifik jika tidak ditugaskan).
- Fokus ke hasil akhir visual: **Kerjakan desain UI yang memukau (WOW Factor)**, lalu isi dengan tampilan data secara dummy.
