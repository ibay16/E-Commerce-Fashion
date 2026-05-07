# Customer Service Agent Guidelines (Express Layered)

*(Updated 2026-05-07 to reflect standardized routing and Layered Architecture. Existing non-contradictory guidelines must be preserved.)*

## 1. Instruksi dan Panduan Teknis Mendalam

Dokumen ini adalah spesifikasi arsitektur untuk `customer-service`. Layanan ini adalah modul tersibuk yang menangani seluruh siklus hidup pelanggan: identitas, profil, keranjang, hingga proses checkout.

### Arsitektur Inti: Layered Architecture
- **Routes (`src/routes/`)**: Memetakan rute publik (login/register) dan rute terlindungi (account/cart).
- **Controllers (`src/controllers/`)**: Mengelola interaksi request/response dan pemanggilan Service.
- **Services (`src/services/`)**: **Tempat tinggal Logika Bisnis**. 
  - `CheckoutService`: Menangani integrasi Midtrans yang kompleks.
  - `CartService`: Menangani hidrasi data produk dari layanan lain melalui Gateway.
- **DB Client (`src/db/client.ts`)**: Satu-satunya pintu gerbang ke Prisma, menggunakan `@prisma/adapter-pg` dengan `pg.Pool`.

### Integrasi Pembayaran (Midtrans)
- Seluruh logika **Midtrans Core API** (Charge, Status, Webhook) wajib diisolasi di dalam `CheckoutService`.
- Pastikan verifikasi tanda tangan (*signature verification*) dilakukan pada setiap notifikasi webhook untuk mencegah serangan pemalsuan status transaksi.

### Keamanan & Validasi
- **Zero Trust**: Meskipun berada di belakang Gateway, gunakan middleware `authenticateJWT` untuk memverifikasi ulang identitas pengguna.
- **Joi Validation**: Gateway melakukan validasi pertama, namun Service dapat melakukan validasi tambahan jika ada logika bisnis yang bergantung pada kondisi database.

---

## 2. Kondisi Saat Ini (Source of Truth)

### Struktur Direktori (`src/`)
- **`controllers/`**:
  - `auth.controller.ts`: Pendaftaran dan login pelanggan.
  - `account.controller.ts`: Alamat, metode pembayaran, dan profil.
  - `cart.controller.ts`: Manajemen keranjang belanja asinkron.
  - `checkout.controller.ts`: Inisiasi pembayaran.
  - `orders.controller.ts`: Riwayat transaksi pelanggan.
  - `shipping.controller.ts`: Pelacakan status kiriman pelanggan.
- **`services/`**: Implementasi logika untuk seluruh modul di atas (misal: `AuthService.ts`).
- **`dtos/`**: `customer.dto.ts`, `order.dto.ts` (Menjamin konsistensi data yang dikirim ke Frontend).
- **`middleware/`**: `auth.ts` (JWT handling) dan `error-handler.ts`.
- **`db/`**: Instansiasi Prisma klien.

### Integrasi
- **Framework**: Express 5.
- **Database**: PostgreSQL (Prisma).
- **Runtime & Execution**: Dockerfile menggunakan `npx tsx src/index.ts` untuk menjalankan layanan.
- **Port**: **4002** (Internal Docker).
- **BFF Alignment**: Di-mount oleh API Gateway pada jalur internal `/api/customer`.
- **Mesh Communication**: Memanggil `commerce-service` melalui API Gateway (8000) menggunakan `INTERNAL_SERVICE_KEY` untuk mengambil data produk terkini.
