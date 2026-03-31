# Panduan Implementasi Fitur Dashboard (Home & Tasks)

## Deskripsi Singkat
Dokumen ini berisi perencanaan tingkat tinggi (*high-level plan*) untuk membangun halaman **Dashboard**. Halaman ini akan memuat fitur ringkasan progres tugas (*Home*) dan fitur pengelolaan / pencatatan tugas (*Task*). 

Panduan ini disederhanakan agar dapat diikuti secara langsung dan mudah oleh *Junior Programmer* atau diimplementasikan secara otomatis oleh *AI Model*.

---

## 1. Lingkup Fitur yang Akan Dibangun
Halaman Dashboard harus mencakup 2 fitur utama berikut:

### Fitur A: Home (Summary)
- Bagian ini menampilkan ringkasan (*summary*) dari progres seluruh *task*/tugas.
- (Contoh: Menampilkan jumlah *task* berstatus *Pending*, *In-Progress*, dan *Completed*).

### Fitur B: Task (CRUD & Fitur Copy Khusus)
- Mengimplementasikan sistem **CRUD (Create, Read, Update, Delete)** penuh. Tidak hanya formulir input, melainkan ada daftar/tabel untuk menampilkan seluruh data task, mengubah (Edit), dan menghapus (Delete).
- **Struktur Kolom Data / Formulir Input**:
  1. **Tanggal** (Input *date*).
  2. **Activity** (Input teks, misal: "Coding", "Meeting").
  3. **Project** (Input teks, misal: "DTP Finnet").
  4. **Deskripsi Task** (Input urain/link/teks area panjang).
  5. **Status Task** (*Dropdown*: `pending`, `in-progress`, `completed`).
  6. **Total Waktu** (Penting!):
     - Di UI disediakan 2 input tersendiri: **Jam** dan **Menit**.
     - *Konversi Latar Belakang*: Harus dijumlahkan menjadi satuan Total Menit saja sebelum disimpan ke *Logic/Backend*. (`Total Menit = (Jam * 60) + Menit`).
  7. **Tombol Simpan**.
- **Aksi pada Tabel (Read/List)**:
  - Setiap baris *Task* yang tampil harus memiliki tombol Edit, Delete, dan **Copy**.
  - **Logika Tombol Copy (Sangat Spesifik):** Ketika tombol Copy ditekan, sistem harus menyalin susunan teks ke memori/clipboard pengguna dengan *format mutlak* berikut:
    ```text
    /effort date:[YYYYMMDD] activity:[Isi Activity] project:[Isi Project] description:[Isi Deskripsi] duration:[Total Menit]
    ```
    *(**Contoh Format Output Nyata:** `/effort date:20260330 activity:Coding project:DTP Finnet description:https://github.com/adesepriansyah/task-list-timesheet/issues/1 duration:300`)*

---

## 2. Standardisasi Struktur Folder & File
Seluruh kode fitur diletakkan di dalam *root directory* `src/`. Patuhi penamaan folder dan *File Naming Convention* di bawah ini:

### Hierarki Folder (`src/`)
- `app/` : Menyimpan halaman visual aplikasi (*Pages*).
- `component/` : Menyimpan potongan UI (*reusable components*, mis: Form, Modal, Tabel, Tombol Copy).
- `service/` : Menyimpan logika interaksi ke Backend (fungsi fetch/simpan).
- `type/` : Menyimpan kerangka data (struktur *TypeScript Interface/Types*).

### Format Penamaan File (*Kebab-case*)
- **File route/page**: Gunakan akhiran `-route.ts` atau standar page framework (mis: `tasks-route.ts`).
- **File komponen/UI**: Nama standar PascalCase atau *kebab-case* deskriptif.
- **File logika servis**: Wajib dengan akhiran `-service.ts` (mis: `tasks-service.ts`).
- **File tipe variabel**: Wajib dengan akhiran `-type.ts` (mis: `tasks-type.ts`).

---

## 3. Tahapan Implementasi (*Action Plan* Lengkap)
Programmer atau AI Model dapat mengerjakan fitur ini dengan mengikuti urutan tahap berikut:

1. **Definisi Kerangka Data (Folder `type/`)**
   - Buat `type/tasks-type.ts`.
   - Rumuskan kerangka *Interface* Objek Task yang memuat seluruh kolom (Tanggal, Activity, Project, Deskripsi, Status, Total Menit).

2. **Pembuatan Komponen Tabel & Formulir (Folder `component/`)**
   - Buat komponen **Formulir Input** dengan otomatisasi konversi waktu (Jam & Menit -> Menit).
   - Buat komponen **Tabel (List)** yang memuat baris data.
   - Buat **Tombol Copy** dengan melampirkan *handler string interpolation* sesuai aturan format `/effort date:...` ke dalam *Clipboard API* peramban (*browser*).

3. **Pembuatan Fungsi CRUD (Folder `service/`)**
   - Buat `service/tasks-service.ts`.
   - Siapkan metode operasi CRUD (Create task, Read/Get tasks, Update task, Delete task).

4. **Integrasi Halaman / Perakitan Akhir (Folder `app/`)**
   - Rangkai semuanya di halaman Dashboard.
   - Pasang elemen statis **Fitur A (Summary)** di bagian atas halaman (hitungan total status task).
   - Tempatkan Formulir (Create) dan Tabel Data List (Read, Edit, Delete, Copy) dari **Fitur B** melengkapi halaman tersebut.

*(Pastikan aplikasi berjalan tanpa Error TypeScript. Uji coba tombol **Copy** secara spesifik memastikan *string*-nya persis sama dengan contoh).*

---

## 4. Implementasi Docker & Environment

Perencanaan untuk **Konfigurasi Environment (`.env`)** dan **Deployment Docker** telah dipindahkan ke panduan terpisah agar lebih terfokus:

👉 **[issue-docker.md](file:///home/ades/storage/learn/task-list-timesheet/issue-docker.md)**

---

## 5. Checklist Akhir Fitur

Gunakan checklist ini untuk memastikan pengembangan fitur Dashboard sudah selesai:

- [ ] Kerangka data di `type/tasks-type.ts` sudah sesuai.
- [ ] Komponen Tabel & Formulir sudah dibuat (dengan konversi waktu).
- [ ] Tombol Copy menghasilkan format `/effort ...` yang tepat.
- [ ] Service CRUD di `service/tasks-service.ts` sudah berfungsi.
- [ ] Integrasi halaman Dashboard sudah selesai dan diuji coba.

