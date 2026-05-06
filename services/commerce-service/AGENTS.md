# Commerce Service Agent Guidelines (Express Layered)

## 1. Instruksi dan Panduan Teknis Mendalam

Dokumen ini adalah spesifikasi arsitektur untuk `commerce-service`. Layanan ini bertanggung jawab atas domain produk, kategori, ulasan, dan kalkulasi logistik.

### Arsitektur: Layered Architecture
Layanan ini menggunakan pola desain berlapis untuk pemisahan tanggung jawab yang jelas:
- **Routes**: Terletak di `src/routes/`. Hanya bertanggung jawab untuk definisi endpoint dan pemetaan middleware.
- **Controllers**: Terletak di `src/controllers/`. Menangani orkestrasi request/response, ekstraksi data dari `req`, dan memanggil layer Service.
- **Services**: Terletak di `src/services/`. Berisi logika bisnis murni, perhitungan, dan aturan validasi tingkat tinggi.
- **DB Client**: Terletak di `src/db/client.ts`. Satu-satunya titik akses untuk instance Prisma.

### Standar Pengembangan
- **Zero UI Logic**: Dilarang memasukkan logika rendering atau elemen frontend di sini. Balasan harus selalu berupa JSON.
- **Validasi Joi**: Gunakan skema validasi Joi untuk setiap input non-GET.
- **Error Handling**: Gunakan blok try-catch di level controller dan kembalikan status code yang tepat (400 untuk input salah, 404 untuk data tidak ada, 500 untuk sistem).

---

## 2. Kondisi Saat Ini (Source of Truth)

### Struktur Direktori (`src/`)
- `controllers/`: `product.controller.ts`, `category.controller.ts`, `review.controller.ts`, `shipping.controller.ts`, `analytics.controller.ts`, `health.controller.ts`.
- `routes/`: Menghubungkan endpoint Express ke controller di atas.
- `db/`: Berisi `client.ts` untuk koneksi Prisma.
- `middleware/`: Middleware kustom (auth, validation).
- `utils/`: Fungsi pembantu umum.

### Integrasi
- **Database**: Terhubung ke PostgreSQL (via `@novure/database`).
- **Networking**: Berjalan pada port **3001** di dalam container Docker. Dipanggil secara eksklusif oleh API Gateway.
