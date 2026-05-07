# Admin Service Agent Guidelines (Express Layered)

*(Updated 2026-05-07 to reflect standardized routing and Layered Architecture. Existing non-contradictory guidelines must be preserved.)*

## 1. Instruksi dan Panduan Teknis Mendalam

Dokumen ini merupakan mandat arsitektural untuk `admin-service`. Layanan ini bertanggung jawab atas manajemen pengguna admin, operasional pesanan, dan manajemen logistik internal.

### Arsitektur Inti: Layered Architecture
- **Routes (`src/routes/`)**: Definisi endpoint yang bersih, memisahkan rute manajemen internal dan rute *storefront-exposed*.
- **Controllers (`src/controllers/`)**: Menangani parsing request dan pemetaan DTO sebelum dikirim ke client.
- **Services (`src/services/`)**: Mengelola logika bisnis kompleks (seperti verifikasi password admin, perubahan status pesanan massal).
- **DB Client (`src/db/client.ts`)**: Akses terpusat ke database PostgreSQL, sekarang menggunakan `@prisma/adapter-pg` dengan `pg.Pool`.

### Protokol Keamanan
- **Admin Authentication**: Menggunakan JWT. Rahasia token diambil dari `env.JWT_SECRET`.
- **Internal Security**: Validasi header `x-internal-key` terhadap `INTERNAL_SERVICE_KEY` untuk memastikan integritas komunikasi antar-layanan di dalam cluster Docker.
- **Standard Response**: Wajib mengembalikan respon sukses `200/201` atau error `400/401/404/500` dalam format JSON standar.

---

## 2. Kondisi Saat Ini (Source of Truth)

### Struktur Direktori (`src/`)
- **`controllers/`**:
  - `auth.controller.ts`: Manajemen sesi admin (Login, Logout, Me).
  - `order.controller.ts`: Pengaturan rincian pesanan dan status.
  - `shipping.controller.ts`: Manajemen kurir dan pelacakan resi internal.
- **`services/`**: Berisi logika operasional seperti `OrderService.ts`.
- **`routes/`**: `auth.routes.ts`, `order.routes.ts`, `shipping.routes.ts`.
- **`dtos/`**: `dashboard.dto.ts` (Mendefinisikan bentuk data agregat untuk dashboard).
- **`middleware/`**: `error-handler.ts` terpusat.
- **`utils/`**: `password.ts` untuk verifikasi kredensial admin.

### Integrasi
- **Framework**: Express 5.
- **Database**: PostgreSQL (Prisma).
- **Runtime & Execution**: Dockerfile menggunakan `npx tsx src/index.ts` untuk menjalankan layanan.
- **Port**: **4001** (Internal).
- **BFF Alignment**: Di-mount oleh API Gateway pada jalur internal standar `/api/admin`.
