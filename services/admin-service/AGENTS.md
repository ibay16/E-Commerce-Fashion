# Admin Service Agent Guidelines (Express Layered)

## 1. Instruksi dan Panduan Teknis Mendalam

Dokumen ini adalah spesifikasi arsitektur untuk `admin-service`. Layanan ini bertanggung jawab atas manajemen pengguna admin, pesanan, dan operasional logistik internal.

### Arsitektur: Layered Architecture
- **Routes**: `src/routes/`. Definisi endpoint Express.
- **Controllers**: `src/controllers/`. Handler HTTP yang mendelegasikan logika ke Service.
- **Services**: `src/services/`. Logika bisnis internal admin.
- **DB Client**: `src/db/client.ts`. Akses Prisma terpusat.

### Keamanan Internal (Mesh)
- Layanan ini menerima panggilan dari layanan lain (seperti `customer-service` untuk validasi pesanan).
- Verifikasi header `x-internal-key` wajib dilakukan untuk endpoint non-publik antar layanan.

---

## 2. Kondisi Saat Ini (Source of Truth)

### Struktur Direktori (`src/`)
- `controllers/`: `auth.controller.ts`, `order.controller.ts`, `shipping.controller.ts`.
- `routes/`: `auth.routes.ts`, `order.routes.ts`, `shipping.routes.ts`.
- `db/client.ts`: Instansiasi Prisma.
- `lib/auth/`: Logika helper untuk token dan hashing password.

### Integrasi
- **Database**: PostgreSQL (Prisma).
- **Networking**: Berjalan pada port **4001** (internal). Dipanggil oleh API Gateway pada rute `/api/admin/management/*`.
