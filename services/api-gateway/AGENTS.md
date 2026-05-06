# API Gateway Agent Guidelines (Express BFF)

## 1. Instruksi dan Panduan Teknis Mendalam

Dokumen ini memaparkan aturan mikroskopik untuk memodifikasi `api-gateway`. Gateway (pada `port 8000`) adalah jantung dari sistem E-Commerce ini. Satu kesalahan konfigurasi proksi berpotensi menyebabkan kebocoran data silang layanan atau serangan eksfiltrasi.

### Arsitektur BFF (Backend for Frontend)
API Gateway ini menerapkan pola isolasi lalu lintas yang ketat:
- Konsumen akhir (*storefront*) dan pengelola (*admin*) memanggil rute turunan yang diisolasi (mis. `/api/storefront/*` vs `/api/admin/*`).
- Modul internal di belakang gateway (`commerce-service`, `admin-service`, `customer-service`) adalah layanan *microservice* modular (di-deploy dalam Docker) yang di-proksi oleh gateway.

### Panduan Manajemen Proksi (`http-proxy-middleware` v3)
Semua konfigurasi proksi **harus mewarisi (*extend*)** fungsi `proxyOptions` dari `src/proxies/common.proxy.ts`. 
- **`fixRequestBody`**: Karena Gateway menggunakan `express.json()` (untuk membaca body guna validasi Joi), *stream* data `req.body` telah dikonsumsi. Fungsi bawaan `fixRequestBody` dari modul proxy dipanggil dalam *hook* `onProxyReq` untuk menyuntikkan ulang (`re-stringify`) *body JSON* sebelum diteruskan ke *microservice* hilir. Jangan pernah menghapus logika ini.
- **Cookies & Headers Validation**: Gateway bertanggung jawab menyebarkan cookie `novure_jwt` dan header terdekripsi `x-user-id` serta `x-user-role`. Jika proxy kustom dibuat, penyalinan header ini wajib disertakan.

### Protokol Keamanan Tingkat Lanjut
- **Otentikasi JWT (`src/middlewares/auth.ts`)**: 
  - Mencari token berurutan dari 1) `Authorization: Bearer` lalu 2) cookie `novure_jwt`.
  - Jika token tidak valid atau kadaluwarsa, wajib mengembalikan kode `401 Unauthorized` dengan struktur JSON amplop (terdapat `{ success: false }`).
- **Internal Service Mesh (`x-internal-key`)**:
  - Antar-microservice sering kali perlu melakukan panggilan sinkron. Daripada layanan membuat JWT palsu, layanan internal memanggil API Gateway dengan menyertakan header `x-internal-key` (sesuai nilai `process.env.INTERNAL_SERVICE_KEY`).
  - Middleware otentikasi akan mengabaikan pengecekan JWT *(bypass)* jika kunci internal ini tervalidasi. Jangan pernah membocorkan kunci ini ke *frontend client*.
- **Validasi Permintaan (Joi)**:
  - Sebelum diteruskan (di-proksi) ke layanan hilir, rute-rute publik spesifik memanggil `validate(schema)` dari `src/middlewares/validate.ts`.
  - Jika format `req.body` salah, gateway akan memblokirnya dengan `400 Bad Request` beserta detail struktur (*path*) kesalahannya. Semua skema validasi wajib merujuk ke modul *shared* `@novure/contracts`.

---

## 2. Kondisi Saat Ini (Source of Truth)

Inilah topologi lengkap dari layanan API Gateway saat ini:

### Struktur Direktori Inti
- `config/`
  - `env.ts`: Satu-satunya titik validasi dan pengumpulan *Environment Variables* (PORT, JWT_SECRET, target URL microservices, dan daftar *Whitelist* CORS). Menggunakan metode ini untuk mencegah *TypeError* `undefined` saat *runtime*.
- `src/`
  - `app.ts`: Titik pangkal (Entry point) instansiasi aplikasi Express. Di sinilah terpasang fungsi CORS tingkat tinggi, *body parser*, dan endpoint `/health` (mem-ping semua microservice untuk memeriksa ketersediaan sistem penuh secara simultan).
- `src/middlewares/`
  - `auth.ts`: Middleware validasi JWT dan verifikasi Mesh internal.
  - `validate.ts`: Fungsi *High-order* yang menerima instansi objek Joi dan mengembalikan middleware Express standar.
- `src/proxies/`
  - `common.proxy.ts`: Pabrik opsi proksi global (pengatur `onProxyReq`, penanganan *Fix Body*, dan log kegagalan `502 Bad Gateway`).
  - `admin.proxy.ts`: Konfigurasi koneksi ke `ADMIN_SERVICE_URL`. Mendefinisikan manipulasi *rewrite* seperti `adminAuthProxy` (mengubah pemanggilan `/api/admin/auth` menjadi `/api/admin/management/auth`).
  - `commerce.proxy.ts`: Menangani perutean produk, katalog, dan *checkout* ke URL e-commerce inti. Memodifikasi prefix `/api/storefront/` menjadi `/api/`.
  - `geography.proxy.ts`: Proksi passthrough transparan untuk layanan *Emsifa* API Wilayah Indonesia. Menangani isu lintas-domain (CORS) di *client-side*.
- `src/routes/`
  - Pola hirarki: Indeks *root* (`index.ts`) mendaftarkan router berdasarkan perannya (mis. `router.use('/storefront', storefrontCatalogRoutes)`).
  - Terdapat pemisahan jelas antara rute aman (`authenticateJWT` diaktifkan untuk `/cart` dan `/orders`) dan rute terbuka (login, registrasi).
