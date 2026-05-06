# Admin Web Agent Guidelines (SvelteKit 2)

## 1. Instruksi dan Panduan Teknis Mendalam

Dokumen ini merupakan panduan arsitektur ketat untuk aplikasi `admin-web`. SvelteKit pada aplikasi ini difungsikan murni sebagai *BFF-consumer* (Bukan backend penyedia layanan).

### Arsitektur Inti: Headless SvelteKit
- **Agnostik Basis Data**: Direktori `apps/admin-web` dilarang keras menginisialisasi modul seperti `@prisma/client`. SvelteKit digunakan semata-mata untuk merender SSR (Server-Side Rendering) HTML dan menyediakan lapisan API internal tipis yang hanya meneruskan (*forward*) panggilan ke API Gateway utama.

### Svelte 5 Runes (Reaktivitas Modern)
Kode komponen diwajibkan menggunakan pola reaktivitas **Svelte 5 Runes**:
- `$props()`: Pendeklarasian properti masuk. Gantikan standar lama `export let variable`.
- `$state()`: Digunakan untuk nilai primitif atau objek yang dapat bermutasi secara lokal.
- `$derived()`: Digunakan untuk nilai turunan komputasi dari `$state()` atau `$props()`.
- `$effect()`: Sebagai pengganti `onMount` atau `afterUpdate` untuk menangani efek samping (*side effects*) yang bergantung pada pelacakan referensi lokal. Peringatan lint `state_referenced_locally` sering terjadi jika `$state` direferensikan dalam penutupan yang salah; gunakan blok penugasan eksplisit atau `$derived`.

### SvelteKit Loaders & Actions
- **Load Functions (`+page.server.ts`)**:
  - Gunakan `import type { PageServerLoad } from './$types';`.
  - Akses `fetch` parameter bawaan SvelteKit. Klien `DashboardAPI` bergantung pada instansiasi `fetch` spesifik halaman untuk memastikan penerusan header cookie secara mulus.
- **API Routes (`+server.ts`)**:
  - Selalu beri tipe ekspilisit `import { type RequestEvent, json } from '@sveltejs/kit';`.
  - Kesalahan *implicit any* (`Binding element 'request' implicitly has an 'any' type`) akan memecahkan CI *type-check*. Pastikan tanda tangannya `export async function GET({ request, url }: RequestEvent)`.

### Manajemen Cookie (Otentikasi Admin)
Sistem ini menggunakan JWT berbasis cookie (`novure_jwt`).
- SvelteKit mensyaratkan `path: '/'` saat Anda mengatur atau menghapus cookie agar berlaku secara global.
- Logika pengelolaan (*login/logout*) harus diisolasi di `src/lib/auth/session.ts` atau endpoint SvelteKit di `src/routes/(auth)/logout/auth-logout.handler.ts`.

### Standar UI/UX Admin Dashboard
- **Komponen Modular Terpusat**: Hindari gaya HTML *inline*. Gunakan kelas-kelas spesifik yang didefinisikan dalam `src/styles/admin.css` (mis. `.insight-card`, `.btn-studio`).
- **Aksesibilitas (A11y)**:
  - Jangan lekatkan interaksi klik (`onclick`) pada elemen non-semantik seperti `<div>` jika bisa menggunakan `<button>` atau `<a>`.
  - Apabila Anda *harus* melakukannya (seperti pada *backdrop* modal), pastikan properti `role="button"`, `tabindex="0"`, dan *event handler* `onkeydown={(e) => e.key === 'Enter' && action()}` ditambahkan. Svelte akan memunculkan *warning* ketat bila ini diabaikan.

---

## 2. Kondisi Saat Ini (Source of Truth)

Berikut adalah anatomi presisi dari aplikasi `admin-web` pada waktu terkini:

### Struktur Direktori (`src/`)
- `routes/` (Pola SvelteKit File-Based Routing)
  - `(auth)/`: Berisi alur autentikasi. Terdapat `/login` (dengan `+page.server.ts` yang mengirim kredensial ke Gateway lalu mengatur cookie lokal) dan `/logout` (endpoint `+server.ts`).
  - `(dashboard)/`: Rute utama yang diamankan. Dilengkapi file `+layout.svelte` terpusat yang memuat navigasi Sidebar/Header.
    - `/analytics`: Analisis visual, tren *Velocity*, Model ML (mockup arsitektur).
    - `/categories`: Manajemen grup katalog.
    - `/orders`: Tabel pesanan komprehensif, pelacakan status (`ShippingTrack`).
    - `/products`: Inventaris komoditas dasar. Rute ini menggunakan ejaan **`products`** secara konsisten.
- `features/`
  - Isolasi Logika UI. Terbagi atas domain `analytics`, `catalog`, `order`, dan `products`.
  - Berisi komponen spesifik (seperti `ExecutiveSummary.svelte`, `ProductFilter.svelte`).
- `components/`
  - Menerapkan pola *Atomic Design*.
  - `atoms/`: `UploadImage.svelte` (dengan *graceful degradation* untuk Supabase), `StatusPill.svelte`.
  - `molecules/`: `InsightCard.svelte`.
- `lib/`
  - `api/`: Berisi klien komunikasi Gateway murni (`analytics.ts`, `config.ts`, `dashboard.ts`, `orders.ts`, `products.ts`, `supabase.ts`). Pemetaan URL menggunakan `INTERNAL_API_URL` dengan pola penulisan `${GATEWAY_URL}/api/admin`.
  - `auth/`: `session.ts` untuk abstraksi manipulasi cookie.
- `styles/`
  - `globals.css`: Variabel CSS dan *reset*.
  - `admin.css`: Kelas-kelas atomik untuk *grid* dan *layouting* dasbor (seperti form-grid 2 kolom, utilitas `.text-right`, dll).
- `types/`
  - Tersedia untuk Tipe data Svelte global dan penghubung antarmuka Prisma (jika diambil lewat kontrak API Gateway).

### Konfigurasi Inti
- `svelte.config.js`: Telah dikonfigurasikan dengan *path aliases* komprehensif (`@components`, `@features`, `@styles`, `@lib`, `@/`) untuk mencegah resolusi *import* yang membingungkan.
