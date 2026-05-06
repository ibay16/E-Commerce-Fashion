# Storefront Web Agent Guidelines (Next.js 15)

## 1. Instruksi dan Panduan Teknis Mendalam

Dokumen ini adalah spesifikasi arsitektur tingkat rendah untuk semua agen AI dan pengembang yang memodifikasi `storefront-web`. Kegagalan mematuhi instruksi ini akan menyebabkan *build failure* atau kerentanan keamanan.

### Arsitektur Inti: Murni Headless (Decoupled)
- **Larangan Akses Database**: `storefront-web` adalah lapisan presentasi murni. Menginstal `@prisma/client`, `@supabase/supabase-js`, atau ORM lainnya di dalam `apps/storefront-web` adalah **pelanggaran arsitektur fatal**.
- **Gateway sebagai Single Source of Truth**: Semua data (baik baca maupun tulis) harus melewati API Gateway (`http://localhost:8000` di lokal, atau internal docker networking `http://api-gateway:8000`).

### Next.js 15: Komponen Server & Fetching
- **Default Caching**: Pada Next.js 15, fungsi `fetch()` secara default adalah `no-store` (tidak di-cache).
  - Jika Anda memerlukan caching untuk katalog produk statis, Anda harus secara eksplisit mendefinisikannya: `fetch(url, { cache: 'force-cache', next: { revalidate: 3600 } })`.
- **Kredensial dan Sesi**:
  - Di **Client Components**, gunakan `fetchOptions({ credentials: "include" })` agar browser otomatis mengirim `novure_jwt` (httpOnly cookie).
  - Di **Server Components / Server Actions**, Anda wajib membaca cookie dari objek request menggunakan `import { cookies } from 'next/headers';` dan secara manual melampirkannya ke header `Cookie` pada pemanggilan API internal jika diperlukan.
- **Server Actions (`use server`)**:
  - Hanya letakkan Server Actions di direktori `src/lib/actions/`.
  - Tangkap (*catch*) semua error di Server Action dan kembalikan objek standar `{ success: boolean, data?: any, error?: string }` untuk mencegah aplikasi *crash*. Jangan biarkan error *unhandled* bocor ke sisi klien.

### Panduan Tipe Data (TypeScript)
- **No `any` Types**: Gunakan tipe `Record<string, unknown>` jika bentuk data dinamis, atau definisikan `interface` yang ketat. Penggunaan `any` tidak diizinkan.
- **Type Guarding**: Saat menangkap error pada blok `catch (err: unknown)`, lakukan type guard `err instanceof Error ? err.message : "Unknown error"` sebelum merendernya.

### Panduan Komponen Interaktif (React 19 Hooks)
- **Hindari Cascading Renders**: Dilarang menggunakan `useEffect` yang secara sinkron memanggil `setState` yang hanya bergantung pada derivasi *props*. Gunakan `useMemo` untuk perhitungan turunan.
- **Image Optimization**: Wajib menggunakan komponen `<Image />` dari `next/image` daripada `<img>` standar HTML. Jika URL gambar berasal dari Supabase Storage eksternal, pastikan domain tersebut sudah didaftarkan pada `remotePatterns` di dalam `next.config.ts`.

### Panduan UI/UX (Editorial & High-Fidelity)
- **Tipografi**: Gunakan variasi berat (*weight*) untuk menetapkan hierarki (contoh: 900 untuk judul hero, 700 untuk harga, 500 untuk deskripsi).
- **Whitespace**: Desain *editorial* membutuhkan margin/padding yang berlimpah (seperti `padding: 4rem 0`). Jangan memadatkan elemen UI.
- **Framer Motion**: Gunakan `motion.div` untuk transisi halaman lambat dan *staggered reveals*. Konfigurasi default kurva animasi: `transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}` (menggunakan kurva *smooth bezier* ala Apple/Linear).

---

## 2. Kondisi Saat Ini (Source of Truth)

Berikut adalah pemetaan tepat dari sistem saat ini. Jangan berasumsi ada struktur lain.

### Struktur Direktori (`src/`)
- `app/`
  - `(routing)`: Berisi file `page.tsx`, `layout.tsx`, `error.tsx`. Semuanya merender UI menggunakan komponen dari `features` atau `components`.
  - `catalogue/`: Induk rute untuk daftar produk, termasuk sub-rute kompleks `cart/pembayaran/status/[orderId]`.
- `features/`
  - Isolasi domain yang tegas. Komponen yang menyimpan banyak *state* atau *logic* bisnis tidak boleh berada di `components/`.
  - `auth/`: (Subfolder: `login`, `register`, `profile`). Menangani form otentikasi dan riwayat pesanan/alamat (*profile views*).
  - `catalogue/`: Menggunakan ejaan British. Berisi `CatalogueGrid.tsx`, `ProductDetailModal.tsx`.
  - `checkout/`: Berisi integrasi peta geolokasi (Leaflet) `LocationMap.tsx`.
- `components/`
  - `atoms/`: `AnimatedText.tsx`, `ProductCard.tsx`, `StatusPill.tsx`.
  - `animations/`: `InfiniteMarquee.tsx`, `ImmersiveSlider3D.tsx`, `MultiColorWave.tsx`. (Folder ini menggantikan nama `features` lama yang bias).
  - `layout/`: `Navbar.tsx`, `Footer.tsx`.
- `styles/`
  - Repositori CSS global. Tidak ada CSS Modules yang tersebar di luar folder ini. Prefix `.pv-` digunakan untuk gaya khusus *Profile Views*.
- `context/`
  - `AuthContext.tsx`, `CartContext.tsx`, `ProfileDataContext.tsx`. Menggunakan React Context untuk *state* global.
- `lib/`
  - `api/config.ts`: Sentralisasi pembacaan `process.env.NEXT_PUBLIC_API_URL` (atau fallback Gateway).
  - `api/account.ts`, `auth.ts`, `cart.ts`, `catalogue.ts`, `orders.ts`, `shipping.ts`: Berisi fungsi asinkron (klien HTTP murni) untuk berinteraksi dengan API Gateway.
  - `actions/`: Berisi Server Actions (`use server`) yang kemudian memanggil klien di `lib/api/`.

### Integrasi Eksternal (Via Gateway)
- **Midtrans**: Frontend tidak memiliki server-key Midtrans. Frontend memanggil `ordersApi.initiateMidtransCharge()` lalu menerima *Snap Token* atau detail Virtual Account, yang kemudian dirender di antarmuka `PaymentStatusPage`.
- **Emsifa (Geografi)**: API eksternal wilayah Indonesia dipanggil melalui `getApiBaseUrl() + "/api/geography"` yang di-proxy oleh API Gateway (mencegah isu CORS dan pelacakan pihak ketiga).
