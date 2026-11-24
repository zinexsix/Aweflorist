# Florify — Sprint 3: Panel Admin dan Operasional

Kelompok 2 (CodeHive) · MI 3B · Proyek Utama (ISY3215)
Disusun oleh: Rofiq (Scrum Master). Product Owner: Nabilla.

> **Cara memakai dokumen ini**
> 1. Baca **Bagian 1–4** sampai selesai (semua anggota).
> 2. Cari user story milikmu di **Bagian 5**.
> 3. Ikuti **Git** di bagian story itu. Semua perintah Git **kamu jalankan sendiri**.
> 4. Boleh memakai OpenCode: salin template di **Bagian 9**. OpenCode hanya menulis kode, **tidak boleh** menjalankan `git add`, `git commit`, atau `git push`.

---

## Daftar isi

1. [Tujuan Sprint 3](#1-tujuan-sprint-3)
2. [Kondisi proyek sekarang](#2-kondisi-proyek-sekarang)
3. [Pembagian tugas & urutan kerja](#3-pembagian-tugas--urutan-kerja)
4. [Kontrak bersama (WAJIB diikuti semua orang)](#4-kontrak-bersama-wajib-diikuti-semua-orang)
5. [Detail per user story](#5-detail-per-user-story)
6. [Git & GitHub — panduan umum](#6-git--github--panduan-umum)
7. [Checklist Pull Request](#7-checklist-pull-request)
8. [Tugas Rofiq (koordinator)](#8-tugas-rofiq-koordinator)
9. [Template prompt OpenCode (salin-tempel)](#9-template-prompt-opencode-salin-tempel)

---

## 1. Tujuan Sprint 3

**Sprint goal (usulan, disahkan saat Sprint Planning):**
Pemilik AweFlorist dapat masuk ke panel admin dan mengelola produk, pesanan, pembayaran, dan permintaan buket custom sehari-hari langsung dari website, tanpa membuka phpMyAdmin.

Sumber: PRD §12 "Sprint 3 — Panel Admin dan Operasional", FR-24 s.d. FR-36, §3.3 alur admin, §5.3, §6 aturan bisnis, §10.3 halaman admin, §11 keamanan.

**Masuk Sprint 3**
- Login admin dan seluruh halaman `/admin` terlindungi. **Pendaftaran akun publik ditutup.**
- Dashboard ringkas dan daftar pesanan yang perlu ditindaklanjuti.
- Kelola produk (tambah, ubah, nonaktifkan) dan kategori.
- Daftar dan detail pesanan, ubah status pesanan.
- Catat pembayaran beserta verifikasinya; status pembayaran terpisah dari status pesanan.
- Kelola permintaan buket custom: lihat detail dan setujui/tolak (menggantikan edit lewat phpMyAdmin).
- Riwayat pelanggan.
- Stok sederhana (Should, menunggu konfirmasi PO apakah AweFlorist memakai stok).

**Tidak masuk Sprint 3** (Sprint 4): deployment ke hosting, UAT final dengan pemilik, pengujian lintas browser, dokumentasi pengguna, mengubah permintaan custom menjadi pesanan, riwayat perubahan status, laporan penjualan.

**Definition of Done Sprint 3** (PRD §12):
- [ ] Semua halaman `/admin` hanya bisa dibuka setelah login; tamu diarahkan ke halaman login.
- [ ] Tidak ada yang bisa membuat akun sendiri lewat `/register`.
- [ ] Admin dapat mengelola produk, kategori, pesanan, pembayaran, dan permintaan custom.
- [ ] Status pesanan dan status pembayaran disimpan dan diubah secara terpisah.
- [ ] Riwayat pesanan tetap terbaca walau produk diubah atau dinonaktifkan (snapshot).
- [ ] Test akses tanpa login dan alur admin lulus.
- [ ] Semua PR di-merge ke `main`, CI GitHub hijau.
- [ ] Halaman admin diuji di ponsel (375 px) dan desktop (1440 px); tabel bisa digeser ke samping di layar kecil.

---

## 2. Kondisi proyek sekarang

| Hal | Kondisi |
|---|---|
| Stack | Laravel 13 + Inertia v3 + React 19 (TypeScript) + Tailwind 4 + Pest. **Jangan diganti.** |
| Database lokal | **MySQL 8 lewat Docker** (`compose.yaml`, port 3307) + phpMyAdmin http://localhost:8788. Test tetap memakai SQLite di memori. |
| Katalog | 67 produk asli dari Drive pemilik, 5 kategori **berdasarkan harga**, acara hanya **Wisuda** dan **Other Occasion**. Sumber data awal: `resources/js/data/catalog.json`. |
| Kategori otomatis | `App\Support\PriceCategory`: saat harga produk disimpan, kategorinya ikut berpindah (dari PR #17). |
| Pesanan | Formulir → tersimpan di `orders` + `order_items` (snapshot nama & harga) → pelanggan langsung dibawa ke WhatsApp admin. Status awal `menunggu_konfirmasi` / `belum_dibayar`. |
| Buket custom | Tersimpan di `custom_requests`, kolom persetujuan `approval_status` (`menunggu`/`disetujui`/`ditolak`), `approved_at`, `approval_note`. Saat ini admin mengubahnya lewat phpMyAdmin. |
| Enum | `OrderStatus`, `PaymentStatus`, `CustomRequestStatus`, `CustomRequestApproval` di `app/Enums`. Semua punya `label()` Bahasa Indonesia. |
| Akun admin | Dibuat `php artisan db:seed` bila `ADMIN_EMAIL` dan `ADMIN_PASSWORD` diisi di `.env`. |
| Autentikasi | Kit bawaan Laravel (Fortify): login, lupa password, 2FA, passkey, pengaturan profil. **Masalah:** `/register` masih terbuka, jadi siapa saja bisa membuat akun dan masuk. Ditutup di US-18. |
| Tampilan admin | Layout sidebar bawaan `resources/js/layouts/app-layout.tsx` + komponen shadcn di `resources/js/components/ui` (button, input, select, badge, card, dialog, dropdown-menu, sheet, sonner, …). **Belum ada komponen tabel**; dibuat di US-18. |
| Pengujian | `php artisan test`, `npm run check`, `npm run types:check`. CI menjalankan semuanya + migrasi ke MySQL. |

**Sebelum mulai Sprint 3:** PR #17 (peta Google Maps, beranda dari database, kategori otomatis) harus sudah di-merge ke `main`, karena US-19 memakai `PriceCategory`.

---

## 3. Pembagian tugas & urutan kerja

### 3.1 Tabel user story

| Kode | User story | Pemilik | Prioritas | SP | Branch |
|---|---|---|---|---|---|
| **US-18** | Sebagai admin, saya ingin masuk ke area admin yang terlindungi agar hanya pemilik yang bisa mengelola data | **Latif** | Must | 3 | `feature/latif-us18-area-admin` |
| US-19 | Sebagai admin, saya ingin menambah, mengubah, dan menonaktifkan produk agar katalog selalu sesuai toko | **Latif** | Must | 5 | `feature/latif-us19-kelola-produk` |
| US-20 | Sebagai admin, saya ingin mengelola kategori dan acara agar pengelompokan produk tetap rapi | **Latif** | Must (kategori) / Should (acara) | 2 | `feature/latif-us20-kategori-acara` |
| US-21 | Sebagai admin, saya ingin melihat daftar dan detail pesanan agar tahu pesanan yang masuk | **Suci** | Must | 3 | `feature/suci-us21-daftar-pesanan` |
| US-22 | Sebagai admin, saya ingin mengubah status pesanan agar progres pesanan tercatat | **Suci** | Must | 3 | `feature/suci-us22-status-pesanan` |
| US-23 | Sebagai admin, saya ingin dashboard ringkas dan daftar tindak lanjut agar tahu apa yang harus dikerjakan hari ini | **Suci** | Must | 3 | `feature/suci-us23-dashboard` |
| US-24 | Sebagai admin, saya ingin melihat dan menyetujui/menolak permintaan buket custom dari panel admin | **Prety** | Must | 5 | `feature/prety-us24-kelola-custom` |
| US-25 | Sebagai admin, saya ingin mencatat stok produk agar tahu sisa barang | **Prety** | Should | 3 | `feature/prety-us25-stok` |
| US-26 | Sebagai admin, saya ingin mencatat pembayaran dan memverifikasinya agar status bayar jelas | **Nabila** | Must | 5 | `feature/nabila-us26-pembayaran` |
| US-27 | Sebagai admin, saya ingin melihat riwayat pesanan per pelanggan | **Nabila** | Must | 2 | `feature/nabila-us27-riwayat-pelanggan` |
| US-28 | Sebagai Product Owner, saya ingin alur admin diuji agar siap didemokan | **Nabila** | Must | 2 | `feature/nabila-us28-uji-admin` |

Total: **36 SP** (Must 33, Should 3). Velocity Sprint 2 = **31 SP** (semua story Sprint 2 selesai). Jika kapasitas tidak cukup saat Sprint Planning, **US-25 (stok) dipindah ke Sprint 4**, apalagi bila PO memutuskan AweFlorist tidak memakai stok (PRD §15).

### 3.2 Ringkasan per orang

| Orang | Story | SP | Fokus |
|---|---|---|---|
| **Latif** | US-18, US-19, US-20 | 10 | Area admin + komponen bersama, kelola produk, kategori & acara |
| **Suci** | US-21, US-22, US-23 | 9 | Daftar/detail pesanan, ubah status, dashboard & tindak lanjut |
| **Prety** | US-24, US-25 | 8 | Kelola permintaan custom + persetujuan, stok sederhana |
| **Nabila** | US-26, US-27, US-28 | 9 | Pembayaran, riwayat pelanggan, pengujian alur admin (sebagai PO) |
| **Rofiq** | — | — | Dokumen ini, review & merge PR, hosting, akun admin, koordinasi (Bagian 8) |

### 3.3 Urutan kerja & urutan merge

```text
Hari 1   Latif: US-18 (area admin + komponen bersama) ── PR ── Rofiq review & merge HARI ITU JUGA
         Yang lain: baca dokumen, pelajari komponen ui/ dan admin/, rancang tampilan (belum commit)

Hari 2-4 (paralel, semua mulai dari main yang sudah berisi US-18)
         Latif  : US-19 → lalu US-20
         Suci   : US-21 → lalu US-22 → lalu US-23
         Prety  : US-24 → lalu US-25
         Nabila : US-27 → lalu US-26 (tunggu US-21 di-merge)

Hari 5-6 Nabila: US-28 (pengujian alur admin ujung-ke-ujung)
Hari 7   Rofiq : integrasi akhir, demo
```

**Urutan merge yang wajib** (Rofiq menjaga ini):

1. **US-18** (semua bergantung padanya)
2. **US-19**, **US-21**, **US-24**, **US-27** (boleh urutan mana saja)
3. **US-20** setelah US-19 · **US-22** dan **US-23** setelah US-21
4. **US-26** setelah US-21 (menambah bagian pembayaran di halaman detail pesanan)
5. **US-25** setelah US-19
6. **US-28** paling akhir

Kalau PR-mu menunggu PR lain: tetap kerjakan di branch-mu. Setelah PR yang ditunggu di-merge, jalankan `git fetch origin` lalu `git merge origin/main` (Bagian 6.3).

---

## 4. Kontrak bersama (WAJIB diikuti semua orang)

Kontrak ini mencegah kode saling bertabrakan. **Jangan mengganti nama** tabel, kolom, rute, nama halaman, atau props di bawah ini. Kalau perlu berubah, tanya Rofiq dulu.

### 4.1 Tabel database baru

Tabel lama (Sprint 2) **tidak diubah** kecuali yang tertulis di sini. Setiap tabel baru dibuat oleh pemilik story-nya, lewat **migration baru** (jangan mengedit migration lama).

**`payments`** — dibuat di US-26 (Nabila)

| Kolom | Tipe | Keterangan |
|---|---|---|
| id | bigint PK | |
| order_id | FK → orders, `cascadeOnDelete` | |
| amount | decimal(12,2) | nominal, > 0 |
| paid_at | date | tanggal bayar, tidak boleh di masa depan |
| method | string(30) | `transfer`, `tunai`, `qris`, `lainnya` (enum `PaymentMethod`) |
| is_verified | boolean, default false | PRD §6 no.5: dicatat ≠ terverifikasi |
| verified_at | timestamp nullable | diisi saat diverifikasi |
| notes | text nullable | mis. nama pengirim transfer |
| recorded_by | FK → users nullable, `nullOnDelete` | admin yang mencatat |
| timestamps | | |

**Kolom `products.stock` + tabel `stock_movements`** — dibuat di US-25 (Prety)

| Tabel.kolom | Tipe | Keterangan |
|---|---|---|
| products.stock | unsigned int nullable, setelah `is_active` | `null` = stok tidak dikelola (dibuat sesuai pesanan) |
| stock_movements.id | bigint PK | |
| stock_movements.product_id | FK → products, `cascadeOnDelete` | |
| stock_movements.user_id | FK → users nullable, `nullOnDelete` | |
| stock_movements.quantity_change | int | positif = masuk, negatif = keluar |
| stock_movements.stock_after | unsigned int | stok setelah perubahan |
| stock_movements.reason | string(100) | mis. "Restok", "Rusak" |
| stock_movements.timestamps | | |

### 4.2 Model, enum, helper

| Nama | Dibuat di | Isi |
|---|---|---|
| `App\Models\Payment` | US-26 | `belongsTo(Order)`, `belongsTo(User, 'recorded_by')`; cast `amount` decimal:2, `paid_at` date, `method` → `PaymentMethod`, `is_verified` bool, `verified_at` datetime. `Order` mendapat `hasMany(Payment)`. |
| `App\Enums\PaymentMethod` | US-26 | `Transfer='transfer'`, `Tunai='tunai'`, `Qris='qris'`, `Lainnya='lainnya'` + `label()`. |
| `App\Models\StockMovement` | US-25 | `belongsTo(Product)`, `belongsTo(User)`. `Product` mendapat `hasMany(StockMovement)`. |
| `App\Support\EnumOptions` | US-18 | `EnumOptions::from(OrderStatus::class)` → `[['value' => 'baru', 'label' => 'Baru'], …]`. Dipakai semua halaman untuk isi `<select>`. |
| `Order::scopeNeedsFollowUp()` | US-21 | lihat definisi tindak lanjut di §4.6. |

### 4.3 Rute (`routes/admin.php`)

Semua rute admin ada di file baru **`routes/admin.php`** (dibuat US-18), di dalam grup:

```php
Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    // --- US-23 Suci: dashboard ---
    // --- US-19 Latif: produk ---
    // --- US-20 Latif: kategori & acara ---
    // --- US-21 Suci: pesanan ---
    // --- US-22 Suci: status pesanan ---
    // --- US-26 Nabila: pembayaran ---
    // --- US-24 Prety: permintaan custom ---
    // --- US-27 Nabila: pelanggan ---
    // --- US-25 Prety: stok ---
});
```

Tulis rute **hanya di bawah penanda story-mu**. Controller ada di `app/Http/Controllers/Admin/`, FormRequest di `app/Http/Requests/Admin/`.

| Method | URL | Nama rute | Controller | Story |
|---|---|---|---|---|
| GET | `/admin` | `admin.dashboard` | `DashboardController` (invokable) | US-18 (halaman kosong) → diisi US-23 |
| GET | `/admin/produk` | `admin.products.index` | `ProductController@index` | US-19 |
| GET | `/admin/produk/tambah` | `admin.products.create` | `ProductController@create` | US-19 |
| POST | `/admin/produk` | `admin.products.store` | `ProductController@store` | US-19 |
| GET | `/admin/produk/{product}/ubah` | `admin.products.edit` | `ProductController@edit` | US-19 |
| PUT | `/admin/produk/{product}` | `admin.products.update` | `ProductController@update` | US-19 |
| DELETE | `/admin/produk/{product}` | `admin.products.destroy` | `ProductController@destroy` | US-19 |
| GET | `/admin/kategori` | `admin.categories.index` | `CategoryController@index` | US-20 |
| POST | `/admin/kategori` | `admin.categories.store` | `CategoryController@store` | US-20 |
| PUT | `/admin/kategori/{category}` | `admin.categories.update` | `CategoryController@update` | US-20 |
| DELETE | `/admin/kategori/{category}` | `admin.categories.destroy` | `CategoryController@destroy` | US-20 |
| GET/POST/PUT/DELETE | `/admin/acara…` | `admin.events.*` (sama seperti kategori) | `EventController` | US-20 (Should) |
| GET | `/admin/pesanan` | `admin.orders.index` | `OrderController@index` | US-21 |
| GET | `/admin/pesanan/{order}` | `admin.orders.show` | `OrderController@show` | US-21 |
| PATCH | `/admin/pesanan/{order}/status` | `admin.orders.status` | `OrderStatusController` (invokable) | US-22 |
| POST | `/admin/pesanan/{order}/pembayaran` | `admin.payments.store` | `PaymentController@store` | US-26 |
| PATCH | `/admin/pembayaran/{payment}/verifikasi` | `admin.payments.verify` | `PaymentController@verify` | US-26 |
| PATCH | `/admin/pesanan/{order}/status-pembayaran` | `admin.orders.payment-status` | `PaymentController@updateStatus` | US-26 |
| GET | `/admin/custom` | `admin.custom-requests.index` | `CustomRequestController@index` | US-24 |
| GET | `/admin/custom/{customRequest}` | `admin.custom-requests.show` | `CustomRequestController@show` | US-24 |
| PATCH | `/admin/custom/{customRequest}/persetujuan` | `admin.custom-requests.approval` | `CustomRequestController@approval` | US-24 |
| GET | `/admin/pelanggan` | `admin.customers.index` | `CustomerController@index` | US-27 |
| GET | `/admin/pelanggan/{customer}` | `admin.customers.show` | `CustomerController@show` | US-27 |
| GET | `/admin/stok` | `admin.stock.index` | `StockController@index` | US-25 |
| POST | `/admin/produk/{product}/stok` | `admin.stock.store` | `StockController@store` | US-25 |

Catatan kunci rute: `{order}` memakai `order_number`, `{customRequest}` memakai `request_number` (sudah diatur di model). `{product}`, `{category}`, `{customer}`, `{payment}` memakai `id`.

Setelah menambah rute, jalankan `php artisan wayfinder:generate --with-form` agar `@/routes/admin/...` tersedia di React.

### 4.4 Halaman Inertia dan props

Semua halaman admin ada di `resources/js/pages/admin/`, memakai layout `AppLayout` dan komponen dari `resources/js/components/admin/` (US-18). Tipe TypeScript ada di **`resources/js/types/admin.ts`** (dibuat US-18; setiap story menambah tipenya sendiri di bawah penanda story).

| Halaman | Props utama | Story |
|---|---|---|
| `admin/dashboard` | `stats: { ordersByStatus: {value,label,count}[], needsFollowUp: number, unpaid: number, customPending: number }`, `followUps: AdminOrderRow[]` (maks 5) | US-23 |
| `admin/products/index` | `products: Paginated<AdminProductRow>`, `categories: Option[]`, `filters: { q, kategori, status }` | US-19 |
| `admin/products/form` | `product: AdminProductForm \| null` (null = tambah), `categories: Option[]`, `occasions: Option[]` | US-19 |
| `admin/categories/index` | `categories: { id, name, slug, description, productsCount, isPriceCategory }[]` | US-20 |
| `admin/events/index` | `events: { id, name, slug, description, productsCount }[]` | US-20 |
| `admin/orders/index` | `orders: Paginated<AdminOrderRow>`, `statuses: Option[]`, `paymentStatuses: Option[]`, `filters: { q, status, pembayaran, tindak_lanjut }` | US-21 |
| `admin/orders/show` | `order: AdminOrderDetail`, `statuses: Option[]`; US-26 menambah `payments: AdminPayment[]`, `paymentMethods: Option[]`, `paymentStatuses: Option[]` | US-21, US-22, US-26 |
| `admin/custom-requests/index` | `requests: Paginated<AdminCustomRequestRow>`, `approvals: Option[]`, `filters: { q, persetujuan }` | US-24 |
| `admin/custom-requests/show` | `request: AdminCustomRequestDetail` | US-24 |
| `admin/customers/index` | `customers: Paginated<AdminCustomerRow>`, `filters: { q }` | US-27 |
| `admin/customers/show` | `customer: AdminCustomerDetail` (+ `orders`, `customRequests`) | US-27 |
| `admin/stock/index` | `products: Paginated<AdminStockRow>`, `movements: AdminStockMovement[]` (20 terbaru), `filters: { q }` | US-25 |

Tipe dasar (dibuat US-18 di `types/admin.ts`):
```ts
export type Option = { value: string; label: string };
export type Paginated<T> = {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
    from: number | null; to: number | null; total: number;
};
```
Paginasi memakai `->paginate(15)->withQueryString()` dari Laravel; bentuknya otomatis sesuai `Paginated<T>`.

### 4.5 Komponen bersama admin (dibuat US-18, dipakai semua)

| Komponen | File | Kegunaan |
|---|---|---|
| `AdminPage` | `components/admin/admin-page.tsx` | `<Head>` + breadcrumb + judul + deskripsi + slot tombol aksi |
| `AdminTable` | `components/admin/admin-table.tsx` | tabel dengan header, scroll horizontal di HP, `emptyText` bila data kosong |
| `StatusBadge` | `components/admin/status-badge.tsx` | badge berisi **teks** status + warna (status tidak hanya dibedakan warna, PRD §10.4) |
| `Pagination` | `components/admin/pagination.tsx` | tautan halaman dari `Paginated.links` |
| `FilterBar` | `components/admin/filter-bar.tsx` | form GET berisi kotak cari + slot `<select>` filter |
| Notifikasi | `HandleInertiaRequests` membagikan `flash.success`/`flash.error`; `AppLayout` menampilkannya dengan `sonner` | dipanggil dari controller: `->with('success', 'Produk disimpan.')` |

Input, tombol, select, dialog: pakai yang sudah ada di `components/ui/` (`Button`, `Input`, `Label`, `Select`, `Dialog`, `Badge`, `Card`) dan `InputError`. **Jangan membuat komponen tombol/input baru.** Komponen `florify/*` (BrandButton dll.) hanya untuk halaman publik.

### 4.6 Aturan bisnis yang dipakai bersama

- **Tindak lanjut** (`Order::needsFollowUp()`): pesanan dengan `order_status` `baru` atau `menunggu_konfirmasi`, **atau** `payment_status` `belum_dibayar`/`dp` yang `order_status`-nya bukan `selesai`/`dibatalkan`.
- **Status pesanan** `selesai` dan `dibatalkan` adalah status akhir: tidak bisa diubah lagi (US-22).
- **Status pembayaran** diubah admin secara eksplisit (US-26). Mencatat pembayaran **tidak** otomatis mengubah status menjadi Lunas.
- **Produk yang pernah dipesan** (ada di `order_items` atau `custom_requests`) **tidak boleh dihapus**; tombol hapus menonaktifkannya (`is_active = false`). Produk yang belum pernah dipakai boleh dihapus (US-19, PRD §6 no.8).
- **Kategori harga** (5 slug di `PriceCategory::SLUGS`) tidak bisa dihapus dan slug-nya tidak bisa diubah; namanya boleh diubah (US-20).
- **Stok** tidak boleh negatif (US-25, PRD §6 no.10).
- **Nomor HP pelanggan** boleh tampil lengkap **hanya** di halaman admin.

### 4.7 Aturan kode

- Validasi di server memakai FormRequest di `app/Http/Requests/Admin/`. Pesan galat dan `attributes()` Bahasa Indonesia.
- Semua teks tampilan Bahasa Indonesia. Tanggal ditampilkan format Indonesia (`id-ID`).
- Query memakai Eloquent; hindari N+1 (`with()`/`withCount()`).
- Setiap aksi yang mengubah data mengembalikan `back()->with('success', '…')` atau redirect ke halaman daftar.
- Test Pest per story di `tests/Feature/Admin/<Nama>Test.php`. Login di test: `$this->actingAs(User::factory()->create())`.
- Setiap test file admin punya minimal satu test "tamu diarahkan ke login".
- Jangan menambah paket composer/npm. Jangan memakai warna hex; pakai class Tailwind/token yang ada.

### 4.8 Siapa memegang file apa (Sprint 3)

| File / folder | Pemilik | Catatan |
|---|---|---|
| `routes/admin.php`, `bootstrap/app.php` (daftar rute admin) | Latif (US-18) | yang lain hanya menambah baris di bawah penandanya |
| `config/fortify.php`, `pages/auth/*`, `tests/Feature/Auth/*` | Latif (US-18) | |
| `components/admin/*`, `types/admin.ts` (tipe dasar), `HandleInertiaRequests.php`, `layouts/app-layout.tsx` | Latif (US-18) | story lain hanya menambah tipe di bawah penandanya |
| `components/app-sidebar.tsx` | Latif (US-18) | setiap story menambah **satu** item menu di bawah penandanya |
| `Admin/ProductController`, `pages/admin/products/*`, `CatalogSeeder` | Latif (US-19) | |
| `Admin/CategoryController`, `Admin/EventController`, `pages/admin/categories/*`, `pages/admin/events/*` | Latif (US-20) | |
| `Admin/OrderController`, `pages/admin/orders/index.tsx`, `pages/admin/orders/show.tsx`, `Order::scopeNeedsFollowUp` | Suci (US-21) | US-22 dan US-26 menambah bagian di `show.tsx` di bawah penanda |
| `Admin/OrderStatusController`, `components/admin/order-status-form.tsx` | Suci (US-22) | |
| `Admin/DashboardController`, `pages/admin/dashboard.tsx` | Suci (US-23) | US-18 membuat versi kosongnya |
| `Admin/CustomRequestController`, `pages/admin/custom-requests/*` | Prety (US-24) | |
| migration stok, `StockMovement`, `Admin/StockController`, `pages/admin/stock/*` | Prety (US-25) | |
| migration `payments`, `Payment`, `PaymentMethod`, `Admin/PaymentController`, `components/admin/order-payments.tsx` | Nabila (US-26) | |
| `Admin/CustomerController`, `pages/admin/customers/*` | Nabila (US-27) | |
| `tests/Feature/Admin/AdminFlowTest.php`, `doc/sprint-3/uji-penerimaan.md` | Nabila (US-28) | |

---

## 5. Detail per user story

### US-18 — Area admin terlindungi dan komponen bersama (Latif)

**Story:** Sebagai admin, saya ingin masuk ke area admin yang terlindungi agar hanya pemilik yang bisa mengelola data.
**Prioritas:** Must · **SP:** 3 · **Butuh:** — · **Merge:** paling awal, hari 1
**PRD:** FR-24, FR-25, §11 (password di-hash, middleware auth, CSRF)

**Yang dibuat:**

| File | Isi |
|---|---|
| `config/fortify.php` | hapus `Features::registration()`; `'home' => '/admin'`. |
| `pages/auth/register.tsx`, `tests/Feature/Auth/RegistrationTest.php` | hapus. Hapus juga tautan "Daftar" di `pages/auth/login.tsx` dan `pages/welcome.tsx`. |
| `routes/admin.php` | grup rute §4.3 dengan semua penanda story + `Route::get('/', DashboardController::class)->name('dashboard')`. |
| `bootstrap/app.php` | daftarkan `routes/admin.php` (lewat `then:` di `withRouting`, atau `require` di `routes/web.php`). |
| `routes/web.php` | ganti rute `dashboard` bawaan menjadi `Route::redirect('dashboard', '/admin')->name('dashboard');` agar tautan lama tetap jalan. |
| `app/Http/Controllers/Admin/DashboardController.php` | invokable, render `admin/dashboard` tanpa props (diisi US-23). |
| `pages/admin/dashboard.tsx` | `AdminPage` judul "Dashboard" + teks "Ringkasan akan tersedia di US-23." |
| `app/Support/EnumOptions.php` | helper §4.2. |
| `components/admin/*` | 5 komponen di §4.5. |
| `types/admin.ts` | `Option`, `Paginated<T>` + penanda kosong untuk setiap story. |
| `HandleInertiaRequests.php` + `layouts/app-layout.tsx` | bagikan dan tampilkan `flash.success`/`flash.error` (sonner). |
| `components/app-sidebar.tsx` | menu: Dashboard (`admin.dashboard`). Hapus menu bawaan "Repository" dan "Documentation". Tambahkan penanda `// US-19 …` s.d. `// US-27 …` untuk menu story lain. Logo mengarah ke `/admin`. |

**Kriteria selesai:**
- [ ] `/register` (GET dan POST) mengembalikan 404.
- [ ] Tamu yang membuka `/admin` diarahkan ke `/login`.
- [ ] Setelah login, admin diarahkan ke `/admin`; `/dashboard` mengarah ke `/admin`.
- [ ] Sidebar hanya berisi menu Florify (tanpa menu bawaan starter kit).
- [ ] Komponen `AdminTable` bisa digeser ke samping di layar 375 px.
- [ ] Notifikasi sukses tampil setelah redirect dengan `->with('success', …)`.
- [ ] Akun admin dibuat dari `ADMIN_EMAIL`/`ADMIN_PASSWORD` lewat `php artisan db:seed` (sudah ada; dicatat di README).

**Test (`tests/Feature/Admin/AdminAccessTest.php`):** register 404; tamu ke `/admin` → redirect login; user login → 200 + komponen `admin/dashboard`; `/dashboard` → redirect `/admin`; `EnumOptions::from(OrderStatus::class)` menghasilkan 7 opsi dengan label Indonesia. Perbarui test bawaan yang memakai `/dashboard` atau register.

**Prompt OpenCode:**
```text
Baca doc/SPRINT_3_WORK_DISTRIBUTION.md bagian 2, 4 (seluruhnya), dan "US-18".
Baca config/fortify.php, routes/web.php, routes/settings.php, bootstrap/app.php,
app/Http/Middleware/HandleInertiaRequests.php, resources/js/layouts/app-layout.tsx,
resources/js/components/app-sidebar.tsx, resources/js/components/ui/*, resources/js/pages/auth/login.tsx.

Kerjakan US-18:
- Tutup pendaftaran akun (hapus Features::registration, halaman register, tautan Daftar, RegistrationTest).
- Buat routes/admin.php dengan grup dan penanda story persis seperti bagian 4.3, daftarkan di bootstrap/app.php.
- DashboardController invokable + pages/admin/dashboard.tsx sederhana.
- app/Support/EnumOptions.php, resources/js/types/admin.ts, dan 5 komponen di bagian 4.5.
- Flash success/error dibagikan HandleInertiaRequests dan ditampilkan dengan sonner di AppLayout.
- Sidebar: hanya menu Dashboard + penanda untuk story lain; hapus menu Repository dan Documentation.
- tests/Feature/Admin/AdminAccessTest.php untuk semua kriteria selesai.
Jangan menambah paket. Jangan menjalankan perintah git. Jalankan php artisan test, npm run check,
npm run types:check, lalu laporkan hasilnya.
```

**Git (Latif):**
```bash
git switch main
git pull origin main
git switch -c feature/latif-us18-area-admin

# ... kerjakan / jalankan OpenCode ...

php artisan wayfinder:generate --with-form
php artisan test && npm run check && npm run types:check

git add config/fortify.php resources/js/pages/auth/login.tsx resources/js/pages/welcome.tsx
git rm resources/js/pages/auth/register.tsx tests/Feature/Auth/RegistrationTest.php
git commit -m "feat(admin): tutup pendaftaran akun publik (US-18)"
git add routes/admin.php routes/web.php bootstrap/app.php app/Http/Controllers/Admin app/Support/EnumOptions.php
git commit -m "feat(admin): grup rute admin terlindungi dan dashboard awal (US-18)"
git add resources/js/components/admin resources/js/types/admin.ts resources/js/pages/admin resources/js/components/app-sidebar.tsx resources/js/layouts/app-layout.tsx app/Http/Middleware/HandleInertiaRequests.php
git commit -m "feat(admin): komponen bersama, sidebar, dan notifikasi (US-18)"
git add tests/Feature/Admin/AdminAccessTest.php
git commit -m "test(admin): uji akses area admin (US-18)"
git push -u origin feature/latif-us18-area-admin
```
PR: **`US-18: Area admin terlindungi dan komponen bersama`**. Beri tahu grup begitu di-merge.

---

### US-19 — Kelola produk (Latif)

**Story:** Sebagai admin, saya ingin menambah, mengubah, dan menonaktifkan produk agar katalog selalu sesuai toko.
**Prioritas:** Must · **SP:** 5 · **Butuh:** US-18
**PRD:** FR-26, §6 no.7 dan 8, §11 (unggah gambar aman)

**Yang dibuat:**

| File | Isi |
|---|---|
| `app/Http/Controllers/Admin/ProductController.php` | `index` (cari nama, filter kategori, filter `status=aktif/nonaktif`, `paginate(15)`), `create`, `store`, `edit`, `update`, `destroy` (nonaktifkan bila pernah dipakai, hapus bila belum; hapus file gambar unggahan bila produk dihapus). |
| `app/Http/Requests/Admin/ProductRequest.php` | `name` wajib ≤150; `slug` opsional, unik, huruf kecil-angka-tanda hubung (kosong = dibuat dari nama); `category_id` ada; `description` wajib; `price` nullable integer 1.000–100.000.000; `price_from` boolean; `image` nullable `image|mimes:jpg,jpeg,png,webp|max:2048`; `is_featured`, `is_active` boolean; `occasions` array id acara. Pesan Bahasa Indonesia. |
| `pages/admin/products/index.tsx` | `AdminPage` + tombol "Tambah Produk", `FilterBar`, `AdminTable` (foto kecil, nama, kategori, harga, status aktif sebagai `StatusBadge`, unggulan, aksi Ubah/Hapus dengan dialog konfirmasi), `Pagination`. |
| `pages/admin/products/form.tsx` | satu halaman untuk tambah & ubah. Pratinjau gambar. Catatan di bawah kategori: "Kategori harga menyesuaikan otomatis dengan harga." |
| `database/seeders/CatalogSeeder.php` | **hapus bagian yang menghapus produk/kategori/acara** di luar `catalog.json`, supaya produk buatan admin tidak hilang saat seeder dijalankan lagi. |
| `components/app-sidebar.tsx` | menu "Produk" di bawah penanda US-19. |

Gambar disimpan dengan `store('products', 'public')` (nama acak) dan `image_path` diisi `'/storage/products/…'`. Gambar katalog lama di `/images/products` tetap berlaku.

**Kriteria selesai:**
- [ ] Admin bisa menambah produk dengan gambar; produk tampil di katalog publik.
- [ ] Mengubah harga memindahkan kategori harga otomatis (`PriceCategory`).
- [ ] Produk yang pernah dipesan → tombol hapus hanya menonaktifkan; pesanan lama tetap menampilkan nama snapshot.
- [ ] Produk yang belum pernah dipesan → benar-benar terhapus beserta gambar unggahannya.
- [ ] File bukan gambar atau > 2 MB ditolak dengan pesan jelas.
- [ ] Slug ganda ditolak.
- [ ] `php artisan db:seed --class=CatalogSeeder` tidak menghapus produk buatan admin.

**Test (`tests/Feature/Admin/ProductManagementTest.php`):** tamu → login; daftar + filter + cari; tambah dengan gambar (`Storage::fake('public')`); ubah harga → kategori pindah; hapus produk terpakai → nonaktif; hapus produk baru → terhapus; validasi gambar/slug; seeder tidak menghapus produk admin.

**Prompt OpenCode:**
```text
Baca doc/SPRINT_3_WORK_DISTRIBUTION.md bagian 4 dan "US-19". Baca app/Models/Product.php,
app/Support/PriceCategory.php, database/seeders/CatalogSeeder.php, resources/js/components/admin/*,
resources/js/types/admin.ts, routes/admin.php.
Kerjakan US-19 sesuai tabel file dan kriteria selesai. Tulis rute hanya di bawah penanda US-19.
Tambah tipe AdminProductRow dan AdminProductForm di types/admin.ts di bawah penanda US-19.
Jangan menambah paket. Jangan menjalankan perintah git. Jalankan php artisan test, npm run check,
npm run types:check, lalu laporkan hasilnya.
```

**Git (Latif):**
```bash
git switch main && git pull origin main
git switch -c feature/latif-us19-kelola-produk
# ... kerjakan ...
php artisan wayfinder:generate --with-form
php artisan test && npm run check && npm run types:check
git add app/Http/Controllers/Admin/ProductController.php app/Http/Requests/Admin/ProductRequest.php routes/admin.php
git commit -m "feat(admin): tambah, ubah, dan nonaktifkan produk (US-19)"
git add resources/js/pages/admin/products resources/js/types/admin.ts resources/js/components/app-sidebar.tsx
git commit -m "feat(admin): halaman daftar dan formulir produk (US-19)"
git add database/seeders/CatalogSeeder.php tests/Feature/Admin/ProductManagementTest.php
git commit -m "test(admin): uji kelola produk; seeder tidak menghapus produk admin (US-19)"
git push -u origin feature/latif-us19-kelola-produk
```
PR: **`US-19: Kelola produk`**.

---

### US-20 — Kelola kategori dan acara (Latif)

**Story:** Sebagai admin, saya ingin mengelola kategori dan acara agar pengelompokan produk tetap rapi.
**Prioritas:** Must (kategori) / Should (acara) · **SP:** 2 · **Butuh:** US-18 · **Merge setelah:** US-19
**PRD:** FR-27, FR-28

**Yang dibuat:**

| File | Isi |
|---|---|
| `Admin/CategoryController.php` + `CategoryRequest.php` | `index` (dengan `withCount('products')`), `store`, `update`, `destroy`. Slug dibuat dari nama saat tambah. |
| `Admin/EventController.php` + `EventRequest.php` | sama seperti kategori untuk tabel `events`. |
| `pages/admin/categories/index.tsx`, `pages/admin/events/index.tsx` | tabel + formulir tambah di atas tabel + dialog ubah. Kategori harga diberi label "Kategori harga" dan tombol hapusnya tidak ada. |
| `components/app-sidebar.tsx` | menu "Kategori" dan "Acara" di bawah penanda US-20. |

**Kriteria selesai:**
- [ ] Tambah/ubah nama dan deskripsi kategori/acara; nama ganda ditolak.
- [ ] Kategori yang masih punya produk tidak bisa dihapus (pesan jelas).
- [ ] 5 kategori harga tidak bisa dihapus dan slug-nya tidak berubah saat diubah namanya.
- [ ] Perubahan nama langsung terlihat di beranda dan katalog.

**Test (`tests/Feature/Admin/CategoryManagementTest.php`):** tamu → login; tambah; ubah; hapus kategori kosong; tolak hapus kategori berisi produk; tolak hapus kategori harga; acara sama.

**Prompt OpenCode:**
```text
Baca doc/SPRINT_3_WORK_DISTRIBUTION.md bagian 4 dan "US-20". Baca app/Models/Category.php, Event.php,
app/Support/PriceCategory.php, resources/js/components/admin/*, routes/admin.php.
Kerjakan US-20 sesuai tabel file dan kriteria selesai. Rute hanya di bawah penanda US-20.
Jangan menjalankan perintah git. Jalankan php artisan test, npm run check, npm run types:check, laporkan hasilnya.
```

**Git (Latif):** sama polanya dengan US-19, branch `feature/latif-us20-kategori-acara`, commit `feat(admin): kelola kategori dan acara (US-20)` dan `test(admin): uji kelola kategori dan acara (US-20)`. PR: **`US-20: Kelola kategori dan acara`**.

---

### US-21 — Daftar dan detail pesanan (Suci)

**Story:** Sebagai admin, saya ingin melihat daftar dan detail pesanan agar tahu pesanan yang masuk.
**Prioritas:** Must · **SP:** 3 · **Butuh:** US-18
**PRD:** FR-29, FR-36, §5.3

**Yang dibuat:**

| File | Isi |
|---|---|
| `app/Models/Order.php` | `scopeNeedsFollowUp` sesuai §4.6 (hanya menambah method ini). |
| `Admin/OrderController.php` | `index`: terbaru di atas, cari `q` (nomor pesanan / nama / nomor HP pelanggan), filter `status`, `pembayaran`, `tindak_lanjut=1`, `paginate(15)`. `show`: muat `customer` dan `items`. |
| `pages/admin/orders/index.tsx` | `FilterBar` (cari + select status + select pembayaran + centang "Perlu tindak lanjut"), `AdminTable`: nomor pesanan, tanggal masuk, pelanggan, tanggal dibutuhkan, total, `StatusBadge` status pesanan, `StatusBadge` status pembayaran. Baris bisa diklik ke detail. |
| `pages/admin/orders/show.tsx` | kartu pelanggan (nama, nomor HP lengkap + tombol WhatsApp ke pelanggan), item (nama snapshot × jumlah, subtotal), total, catatan, tanggal dibutuhkan, kedua status. **Sediakan penanda** `{/* US-22: form status */}` dan `{/* US-26: pembayaran */}`. |
| `components/app-sidebar.tsx` | menu "Pesanan" di bawah penanda US-21. |

**Kriteria selesai:**
- [ ] Daftar pesanan terurut terbaru; cari dan filter bisa digabung; filter tetap saat pindah halaman.
- [ ] Filter "Perlu tindak lanjut" sesuai definisi §4.6.
- [ ] Detail menampilkan nama dan harga **snapshot**, bukan data produk sekarang.
- [ ] Pesanan dengan harga "dikonfirmasi admin" (total `null`) tampil "Dikonfirmasi admin".
- [ ] Nomor pesanan yang tidak ada → 404.

**Test (`tests/Feature/Admin/OrderListTest.php`):** tamu → login; urutan; cari nomor & nama; filter status/pembayaran/tindak lanjut; detail memakai snapshot; 404.

**Prompt OpenCode:**
```text
Baca doc/SPRINT_3_WORK_DISTRIBUTION.md bagian 4 dan "US-21". Baca app/Models/Order.php, OrderItem.php,
Customer.php, app/Enums/OrderStatus.php, PaymentStatus.php, app/Support/EnumOptions.php,
resources/js/components/admin/*, resources/js/types/admin.ts, routes/admin.php.
Kerjakan US-21 sesuai tabel file dan kriteria selesai. Di orders/show.tsx sediakan penanda untuk US-22 dan US-26.
Jangan menjalankan perintah git. Jalankan php artisan test, npm run check, npm run types:check, laporkan hasilnya.
```

**Git (Suci):**
```bash
git switch main && git pull origin main
git switch -c feature/suci-us21-daftar-pesanan
# ... kerjakan ...
php artisan wayfinder:generate --with-form
php artisan test && npm run check && npm run types:check
git add app/Models/Order.php app/Http/Controllers/Admin/OrderController.php routes/admin.php
git commit -m "feat(admin): daftar dan detail pesanan dengan filter tindak lanjut (US-21)"
git add resources/js/pages/admin/orders resources/js/types/admin.ts resources/js/components/app-sidebar.tsx
git commit -m "feat(admin): halaman daftar dan detail pesanan (US-21)"
git add tests/Feature/Admin/OrderListTest.php
git commit -m "test(admin): uji daftar dan detail pesanan (US-21)"
git push -u origin feature/suci-us21-daftar-pesanan
```
PR: **`US-21: Daftar dan detail pesanan`**.

---

### US-22 — Ubah status pesanan (Suci)

**Story:** Sebagai admin, saya ingin mengubah status pesanan agar progres pesanan tercatat.
**Prioritas:** Must · **SP:** 3 · **Butuh:** US-21
**PRD:** FR-30, §5.3, §6 no.2/3/11

**Yang dibuat:**

| File | Isi |
|---|---|
| `Admin/OrderStatusController.php` + `UpdateOrderStatusRequest.php` | `order_status` wajib, `Rule::enum(OrderStatus::class)`. Tolak bila status sekarang `selesai`/`dibatalkan` ("Pesanan yang sudah selesai atau dibatalkan tidak bisa diubah."). **Hanya** mengubah `order_status`. |
| `components/admin/order-status-form.tsx` | select status + tombol "Simpan Status"; dipasang di `orders/show.tsx` di bawah penanda US-22. Untuk pilihan "Dibatalkan" tampilkan dialog konfirmasi. |

**Kriteria selesai:**
- [ ] Status berubah dan terlihat setelah halaman dimuat ulang.
- [ ] `payment_status` tidak ikut berubah.
- [ ] Status akhir tidak bisa diubah; nilai di luar enum ditolak.
- [ ] Notifikasi "Status pesanan diperbarui." tampil.

**Test (`tests/Feature/Admin/OrderStatusTest.php`):** tamu → login; ubah status; payment_status tetap; tolak dari selesai/dibatalkan; tolak nilai asing.

**Git (Suci):** branch `feature/suci-us22-status-pesanan`; commit `feat(admin): ubah status pesanan (US-22)` dan `test(admin): uji ubah status pesanan (US-22)`. PR: **`US-22: Ubah status pesanan`**.

---

### US-23 — Dashboard ringkas dan daftar tindak lanjut (Suci)

**Story:** Sebagai admin, saya ingin dashboard ringkas dan daftar tindak lanjut agar tahu apa yang harus dikerjakan hari ini.
**Prioritas:** Must · **SP:** 3 · **Butuh:** US-21
**PRD:** FR-35, FR-36, §10.3 no.2 dan 9

**Yang dibuat:**

| File | Isi |
|---|---|
| `Admin/DashboardController.php` | props §4.4: jumlah pesanan per status (semua status, termasuk 0), jumlah perlu tindak lanjut, jumlah belum lunas (`belum_dibayar`/`dp`, bukan dibatalkan), jumlah permintaan custom `menunggu`, 5 pesanan tindak lanjut terlama berdasarkan tanggal dibutuhkan. |
| `pages/admin/dashboard.tsx` | 4 kartu angka (Perlu tindak lanjut, Belum lunas, Custom menunggu persetujuan, Pesanan bulan ini), daftar jumlah per status, tabel 5 tindak lanjut + tautan "Lihat semua" ke `admin.orders.index?tindak_lanjut=1`. Kartu custom mengarah ke `admin.custom-requests.index?persetujuan=menunggu` (aktif setelah US-24). |

**Kriteria selesai:**
- [ ] Angka di dashboard sama dengan hasil filter di daftar pesanan.
- [ ] Tidak ada query di dalam perulangan (pakai `groupBy`/`count`).
- [ ] Tampilan rapi di 375 px (kartu bertumpuk).

**Test (`tests/Feature/Admin/DashboardTest.php`):** tamu → login; angka per status; tindak lanjut; belum lunas; custom menunggu; daftar 5 tindak lanjut terurut.

**Git (Suci):** branch `feature/suci-us23-dashboard`; commit `feat(admin): dashboard ringkas dan tindak lanjut (US-23)` dan `test(admin): uji dashboard (US-23)`. PR: **`US-23: Dashboard ringkas`**.

---

### US-24 — Kelola permintaan buket custom (Prety)

**Story:** Sebagai admin, saya ingin melihat dan menyetujui/menolak permintaan buket custom dari panel admin.
**Prioritas:** Must · **SP:** 5 · **Butuh:** US-18
**PRD:** §5.4, §6 no.6, FR-22

**Yang dibuat:**

| File | Isi |
|---|---|
| `Admin/CustomRequestController.php` + `CustomRequestApprovalRequest.php` | `index`: cari nomor/nama, filter `persetujuan`, terbaru di atas, `paginate(15)`. `show`: semua data + URL gambar referensi (`Storage::disk('public')->url(...)`) + model acuan. `approval`: `approval_status` wajib (`disetujui`/`ditolak`), `approval_note` opsional ≤500 (wajib bila ditolak). Disetujui → `approved_at = now()`, `status = disepakati`. Ditolak → `approved_at = null`, `status = dibatalkan`. |
| `pages/admin/custom-requests/index.tsx` | `FilterBar` + `AdminTable`: nomor CST, tanggal masuk, pelanggan, jenis buket (Wisuda/Other Occasion), anggaran, tanggal dibutuhkan, `StatusBadge` persetujuan. |
| `pages/admin/custom-requests/show.tsx` | detail lengkap, gambar referensi (klik untuk ukuran penuh), tombol WhatsApp ke pelanggan, formulir Setujui / Tolak + catatan. |
| `components/app-sidebar.tsx` | menu "Buket Custom" di bawah penanda US-24 (tampilkan jumlah yang menunggu bila mudah). |

**Kriteria selesai:**
- [ ] Admin tidak perlu lagi membuka phpMyAdmin untuk menyetujui permintaan.
- [ ] Disetujui/ditolak tercatat beserta waktu dan catatan; halaman konfirmasi pelanggan ikut menampilkan status barunya.
- [ ] Menolak tanpa catatan → galat "Tulis alasan penolakan."
- [ ] Gambar referensi tampil bila ada.

**Test (`tests/Feature/Admin/CustomRequestManagementTest.php`):** tamu → login; daftar + filter; detail dengan gambar; setujui; tolak + catatan wajib; nilai asing ditolak.

**Git (Prety):**
```bash
git switch main && git pull origin main
git switch -c feature/prety-us24-kelola-custom
# ... kerjakan ...
php artisan wayfinder:generate --with-form
php artisan test && npm run check && npm run types:check
git add app/Http/Controllers/Admin/CustomRequestController.php app/Http/Requests/Admin/CustomRequestApprovalRequest.php routes/admin.php
git commit -m "feat(admin): daftar, detail, dan persetujuan buket custom (US-24)"
git add resources/js/pages/admin/custom-requests resources/js/types/admin.ts resources/js/components/app-sidebar.tsx
git commit -m "feat(admin): halaman kelola buket custom (US-24)"
git add tests/Feature/Admin/CustomRequestManagementTest.php
git commit -m "test(admin): uji kelola buket custom (US-24)"
git push -u origin feature/prety-us24-kelola-custom
```
PR: **`US-24: Kelola permintaan buket custom`**.

---

### US-25 — Stok sederhana (Prety)

**Story:** Sebagai admin, saya ingin mencatat stok produk agar tahu sisa barang.
**Prioritas:** Should · **SP:** 3 · **Butuh:** US-19
**PRD:** FR-33, FR-34, §6 no.9 dan 10

> **Tanyakan dulu ke Nabila (PO) di hari 1:** apakah AweFlorist benar-benar mencatat stok produk jadi? Jika tidak, story ini dipindah ke Sprint 4 atau dihapus, dan Prety membantu US-28.

**Yang dibuat:**

| File | Isi |
|---|---|
| migration `add_stock_to_products_table` + `create_stock_movements_table` | §4.1. |
| `app/Models/StockMovement.php` | §4.2; tambah relasi `stockMovements()` di `Product`. |
| `Admin/StockController.php` + `StockMovementRequest.php` | `index`: produk aktif + stok, cari nama, 20 pergerakan terbaru. `store`: `quantity_change` integer ≠ 0, `reason` wajib ≤100; dalam `DB::transaction` dengan `lockForUpdate()`, tolak bila hasil < 0, simpan `stock_after`. Stok `null` dianggap 0 saat pertama kali dicatat. |
| `pages/admin/stock/index.tsx` | tabel produk + kolom stok ("Tidak dikelola" bila `null`), dialog "Ubah Stok" (jumlah +/− dan alasan), tabel riwayat pergerakan. |
| `components/app-sidebar.tsx` | menu "Stok" di bawah penanda US-25. |

**Kriteria selesai:**
- [ ] Menambah dan mengurangi stok tercatat di riwayat beserta admin dan alasannya.
- [ ] Stok tidak bisa menjadi negatif (pesan jelas).
- [ ] Halaman publik tidak berubah (stok belum ditampilkan ke pelanggan).

**Test (`tests/Feature/Admin/StockTest.php`):** tamu → login; tambah; kurangi; tolak negatif; riwayat tercatat dengan `stock_after` benar.

**Git (Prety):** branch `feature/prety-us25-stok`; commit `feat(admin): stok sederhana dan riwayat pergerakan (US-25)` dan `test(admin): uji stok (US-25)`. PR: **`US-25: Stok sederhana`**.

---

### US-26 — Pencatatan pembayaran (Nabila)

**Story:** Sebagai admin, saya ingin mencatat pembayaran dan memverifikasinya agar status bayar jelas.
**Prioritas:** Must · **SP:** 5 · **Butuh:** US-21
**PRD:** FR-31, §5.3, §6 no.2/4/5

**Yang dibuat:**

| File | Isi |
|---|---|
| migration `create_payments_table` | §4.1. |
| `app/Models/Payment.php`, `app/Enums/PaymentMethod.php` | §4.2; relasi `payments()` di `Order` (hanya menambah method ini). |
| `Admin/PaymentController.php` + `StorePaymentRequest.php` + `UpdatePaymentStatusRequest.php` | `store`: `amount` integer ≥1.000, `paid_at` tanggal ≤ hari ini, `method` enum, `notes` ≤500; `recorded_by` = admin yang login; tolak bila pesanan `dibatalkan`. `verify`: set `is_verified = true`, `verified_at = now()`. `updateStatus`: ubah `payment_status` saja (enum `PaymentStatus`). |
| `Admin/OrderController@show` | tambah props `payments`, `paymentMethods`, `paymentStatuses` (hanya baris ini). |
| `components/admin/order-payments.tsx` | daftar pembayaran (nominal, tanggal, metode, `StatusBadge` Terverifikasi/Belum diverifikasi, tombol Verifikasi), total dibayar vs total pesanan, formulir catat pembayaran, select status pembayaran + tombol simpan. Dipasang di `orders/show.tsx` di bawah penanda US-26. |

**Kriteria selesai:**
- [ ] Pembayaran tersimpan dengan nominal, tanggal, metode, dan status verifikasi.
- [ ] Mencatat pembayaran **tidak** otomatis mengubah status menjadi Lunas; admin mengubahnya sendiri.
- [ ] Mengubah status pembayaran **tidak** mengubah status pesanan.
- [ ] Tanggal di masa depan, nominal 0, atau pesanan dibatalkan → ditolak.
- [ ] Total dibayar ditampilkan; bila melebihi total pesanan, tampil peringatan (bukan galat).

**Test (`tests/Feature/Admin/PaymentTest.php`):** tamu → login; catat; verifikasi; ubah status pembayaran; order_status tetap; validasi; tolak pesanan dibatalkan.

**Git (Nabila):**
```bash
git switch main && git pull origin main          # pastikan US-21 sudah ada
git switch -c feature/nabila-us26-pembayaran
# ... kerjakan ...
php artisan migrate
php artisan wayfinder:generate --with-form
php artisan test && npm run check && npm run types:check
git add database/migrations/*_create_payments_table.php app/Models/Payment.php app/Enums/PaymentMethod.php app/Models/Order.php
git commit -m "feat(pembayaran): tabel dan model pembayaran (US-26)"
git add app/Http/Controllers/Admin/PaymentController.php app/Http/Controllers/Admin/OrderController.php app/Http/Requests/Admin/StorePaymentRequest.php app/Http/Requests/Admin/UpdatePaymentStatusRequest.php routes/admin.php
git commit -m "feat(admin): catat, verifikasi, dan ubah status pembayaran (US-26)"
git add resources/js/components/admin/order-payments.tsx resources/js/pages/admin/orders/show.tsx resources/js/types/admin.ts
git commit -m "feat(admin): bagian pembayaran di detail pesanan (US-26)"
git add tests/Feature/Admin/PaymentTest.php
git commit -m "test(admin): uji pembayaran (US-26)"
git push -u origin feature/nabila-us26-pembayaran
```
PR: **`US-26: Pencatatan pembayaran`**. Tulis di deskripsi PR: *"Merge setelah US-21."*

---

### US-27 — Riwayat pelanggan (Nabila)

**Story:** Sebagai admin, saya ingin melihat riwayat pesanan per pelanggan.
**Prioritas:** Must · **SP:** 2 · **Butuh:** US-18
**PRD:** FR-32, §10.3 no.7

**Yang dibuat:**

| File | Isi |
|---|---|
| `Admin/CustomerController.php` | `index`: cari nama/nomor HP, `withCount('orders')`, `withSum` total pesanan non-batal, tanggal pesanan terakhir, `paginate(15)`. `show`: data pelanggan + semua pesanan (terbaru di atas) + permintaan custom. |
| `pages/admin/customers/index.tsx` | `AdminTable`: nama, nomor HP, jumlah pesanan, total belanja, pesanan terakhir. |
| `pages/admin/customers/show.tsx` | kartu pelanggan + tombol WhatsApp, tabel pesanan (tautan ke `admin.orders.show` — aktif setelah US-21), tabel permintaan custom (tautan ke `admin.custom-requests.show` — aktif setelah US-24). |
| `components/app-sidebar.tsx` | menu "Pelanggan" di bawah penanda US-27. |

**Kriteria selesai:**
- [ ] Riwayat menampilkan semua pesanan pelanggan beserta status dan total, termasuk produk yang sudah dinonaktifkan/dihapus (nama snapshot).
- [ ] Cari dengan nomor `0812…` maupun `62812…` menemukan pelanggan yang sama (pakai `Customer::normalizePhone`).

**Test (`tests/Feature/Admin/CustomerHistoryTest.php`):** tamu → login; daftar + jumlah pesanan; cari nama & nomor (dua format); detail berisi pesanan dan custom.

**Git (Nabila):** branch `feature/nabila-us27-riwayat-pelanggan`; commit `feat(admin): riwayat pelanggan (US-27)` dan `test(admin): uji riwayat pelanggan (US-27)`. PR: **`US-27: Riwayat pelanggan`**.

---

### US-28 — Pengujian alur admin (Nabila)

**Story:** Sebagai Product Owner, saya ingin alur admin diuji agar siap didemokan.
**Prioritas:** Must · **SP:** 2 · **Butuh:** semua story lain di-merge
**PRD:** §12 DoD Sprint 3, §13.2, §13.4

**Yang dibuat:**

| File | Isi |
|---|---|
| `tests/Feature/Admin/AdminFlowTest.php` | (1) tamu ditolak di **setiap** rute `admin.*` (pakai dataset nama rute); (2) alur lengkap: pelanggan memesan lewat formulir → admin login → pesanan muncul di tindak lanjut dashboard → admin buka detail → ubah status Dikonfirmasi → catat pembayaran → verifikasi → status pembayaran Lunas → pesanan hilang dari tindak lanjut; (3) alur custom: pelanggan kirim → admin setujui → halaman konfirmasi pelanggan menampilkan "Disetujui". |
| `doc/sprint-3/uji-penerimaan.md` | sama formatnya dengan `doc/sprint-2/uji-penerimaan.md`: hasil test otomatis, uji manual per halaman admin di 375 px & 1440 px, temuan (link ke GitHub Issues), keputusan PO (stok dipakai atau tidak, status pesanan sudah sesuai toko atau belum). |

**Kriteria selesai:**
- [ ] `AdminFlowTest` lulus di CI.
- [ ] Uji manual semua menu admin di HP dan laptop tercatat.
- [ ] Bug yang ditemukan dibuat Issue dan diberikan ke pemilik story.

**Git (Nabila):** branch `feature/nabila-us28-uji-admin`; commit `test(admin): uji alur admin ujung-ke-ujung (US-28)` dan `docs(sprint-3): hasil uji penerimaan (US-28)`. PR: **`US-28: Pengujian alur admin`**.

---

## 6. Git & GitHub — panduan umum

> **Aturan utama:** kamu sendiri yang menjalankan semua perintah Git. OpenCode/AI tidak boleh `add`, `commit`, atau `push`. **Jangan push ke `main`**; semua perubahan kode lewat Pull Request.

### 6.1 Persiapan (sekali per laptop)

```bash
git config --global user.name "Nama Lengkap"
git config --global user.email "email-github-kamu@contoh.com"

git clone https://github.com/zinexsix/Aweflorist.git
cd Aweflorist
cp .env.example .env
docker compose up -d          # MySQL + phpMyAdmin (Docker Desktop harus menyala)
composer setup
php artisan db:seed
php artisan storage:link
```

Sudah punya proyek? Cukup:
```bash
cd Aweflorist
docker compose up -d
git switch main
git pull origin main
composer install
npm install
php artisan migrate            # menjalankan migration baru tanpa menghapus data
```

Akun admin lokal: isi di `.env` lalu jalankan `php artisan db:seed`:
```dotenv
ADMIN_EMAIL=admin@aweflorist.test
ADMIN_PASSWORD=isi-password-sendiri
```

### 6.2 Siklus kerja satu user story

```bash
# 1. mulai dari main terbaru
git switch main
git pull origin main

# 2. buat branch story (lihat nama branch di tabel 3.1)
git switch -c feature/<nama>-<us-xx>-<topik>

# 3. kerjakan, lalu cek
git status
git diff
php artisan wayfinder:generate --with-form   # setelah menambah rute
php artisan test
npm run check
npm run types:check

# 4. simpan per bagian (sebut file satu per satu, JANGAN git add .)
git add <file-1> <file-2>
git commit -m "feat(<area>): <apa yang dibuat> (US-xx)"

# 5. kirim ke GitHub
git push -u origin feature/<nama>-<us-xx>-<topik>   # push pertama
git push                                             # push berikutnya
```

Format pesan commit: `feat` (fitur), `fix` (perbaikan), `test` (test), `docs` (dokumen), diikuti `(area)` dan kode story di akhir.

### 6.3 Kalau `main` sudah berubah saat kamu masih bekerja

```bash
git fetch origin
git merge origin/main
php artisan migrate               # jika ada migration baru
php artisan wayfinder:generate --with-form
php artisan test
git push
```

**Konflik?** Paling sering terjadi di `routes/admin.php`, `types/admin.ts`, `app-sidebar.tsx`, dan `orders/show.tsx`. Di file-file itu biasanya **kedua** perubahan dipertahankan (masing-masing di bawah penanda story-nya).
1. `git status` → lihat file "both modified".
2. Buka file di VS Code → pilih bagian yang benar (sering kali **keduanya**).
3. Hapus semua tanda `<<<<<<<`, `=======`, `>>>>>>>`.
4. `php artisan test` → `git add <file>` → `git commit` → `git push`.
5. Ragu? Batalkan dengan `git merge --abort`, lalu tanya Rofiq.

### 6.4 Membuat Pull Request di GitHub

1. Buka https://github.com/zinexsix/Aweflorist → klik **Compare & pull request** untuk branch-mu.
2. **base:** `main` ← **compare:** branch-mu. **Selalu ke `main`**, jangan ke branch orang lain.
3. **Judul:** `US-xx: <judul story>`.
4. **Deskripsi:** salin checklist Bagian 7, isi "Cara menguji".
5. **Reviewers** → Rofiq. **Assignees** → dirimu.
6. **Create pull request**, tunggu centang hijau CI. Merah? Klik **Details**, perbaiki di branch yang sama, `git push` lagi.

### 6.5 Setelah PR di-merge

```bash
git switch main
git pull origin main
git branch -d feature/<nama>-<us-xx>-<topik>
```
Di GitHub, klik **Delete branch** di halaman PR yang sudah di-merge.

### 6.6 Melaporkan bug (GitHub Issues)

GitHub → **Issues** → **New issue**. Judul `[US-xx] <masalah singkat>`; isi langkah mengulang, hasil yang diharapkan, hasil nyata, screenshot, ukuran layar. **Assignees:** pemilik story. **Labels:** `bug`. Perbaikan di branch `fix/<nama>-<masalah>`, PR menulis `Closes #<nomor-issue>`.

### 6.7 Dilarang

| Perintah | Kenapa |
|---|---|
| `git push origin main` / commit di `main` | kode di `main` hanya berubah lewat PR |
| `git push --force` | bisa menghapus pekerjaan orang lain |
| `git reset --hard` | menghapus perubahanmu yang belum di-commit |
| `git add .` / `git add -A` | bisa ikut menambah `.env`, file unggahan, file orang lain |
| `php artisan migrate:fresh` tanpa sadar | menghapus semua data lokal, termasuk akun admin |
| Commit `package-lock.json` tanpa menambah paket | batalkan dengan `git restore package-lock.json` |
| Membiarkan AI menjalankan git | kamu harus tahu persis apa yang dikirim |

---

## 7. Checklist Pull Request

Salin ke deskripsi PR:

```markdown
## Story
US-xx: <judul>

## Perubahan
- ...

## Cara menguji
1. git switch <branch> && composer install && npm install
2. docker compose up -d && php artisan migrate && php artisan db:seed
3. composer dev → login di http://localhost:8000/login → buka <URL admin>
4. Langkah: ...

## Checklist
- [ ] Sesuai kontrak bagian 4 (nama tabel/kolom/rute/props tidak diubah)
- [ ] Rute ditulis di bawah penanda story ini di routes/admin.php
- [ ] Hanya mengubah file milik story ini (cek `git diff --stat origin/main`)
- [ ] Validasi di server (FormRequest), pesan galat Bahasa Indonesia
- [ ] Ada test "tamu diarahkan ke login" untuk halaman baru
- [ ] Test Pest untuk story ini ditambahkan dan lulus
- [ ] `php artisan test`, `npm run check`, `npm run types:check` lulus
- [ ] Diuji di 375 px dan 1440 px; tabel bisa digeser, tidak ada scroll horizontal di halaman
- [ ] Status ditampilkan dengan teks, bukan hanya warna
- [ ] Tidak ada error di Console browser
- [ ] Tidak ada `.env`, password, atau file unggahan
- [ ] Tidak menambah paket npm/composer
- [ ] Kode hasil OpenCode sudah saya baca dan pahami
```

---

## 8. Tugas Rofiq (koordinator)

| Kapan | Tugas |
|---|---|
| Sebelum sprint | Merge PR #17. Bagikan dokumen ini ke grup. Pastikan semua anggota bisa `docker compose up -d` dan login admin lokal. |
| Sprint Planning | Sahkan sprint goal & story point bersama Nabilla (PO). Isi Jobsheet J-01 Sprint 3. Putuskan US-25 (stok) ikut atau pindah ke Sprint 4. |
| Hari 1 | Review & merge **US-18 hari itu juga**. Umumkan ke grup. |
| Setiap hari | Review PR sesuai **urutan merge 3.3**. Cek *Files changed*: hanya file milik story. Jalankan di lokal sebelum merge. Pastikan **base PR = `main`**. |
| Konflik bersama | Bantu konflik di `routes/admin.php`, `types/admin.ts`, `app-sidebar.tsx`, `orders/show.tsx`. |
| Hosting | Siapkan hosting PHP 8.3 + MySQL (mis. Railway) agar panel admin bisa didemokan. Isi `VITE_WHATSAPP_NUMBER`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` di server, jalankan `php artisan storage:link`. |
| Keamanan | Pastikan `/register` tertutup sebelum deploy dan password admin produksi kuat (bukan password contoh). |
| Akhir sprint | Pastikan DoD Sprint 3 (Bagian 1) terpenuhi, CI hijau, demo jalan dari `main`. Catat sisa pekerjaan ke backlog Sprint 4. |

**Perintah review PR di lokal:**
```bash
git fetch origin
git switch <nama-branch-pr>
composer install && npm install
php artisan migrate
php artisan wayfinder:generate --with-form
php artisan test && npm run check && npm run types:check
composer dev
# setelah selesai
git switch main
```
Merge lewat tombol **Merge pull request** di GitHub, lalu **Delete branch**. Setelah merge, cek dengan `git log origin/main` bahwa commit-nya benar-benar masuk ke `main`.

---

## 9. Template prompt OpenCode (salin-tempel)

### 9.0 Cara pakai

1. Pastikan kamu sudah di branch story-mu (Bagian 6.2). Cek dengan `git branch --show-current`.
2. Buka terminal di folder proyek, jalankan `opencode`.
3. Salin **Prompt A** dulu (sekali di awal sesi), tunggu jawabannya.
4. Lalu salin **Prompt B** dan ganti bagian `<...>`.
5. Pakai Prompt C–G bila perlu.
6. Setelah OpenCode selesai: **baca `git diff`**, jalankan test sendiri, lalu commit dan push **sendiri** (Bagian 6.2).

> Ganti hanya teks di dalam `<...>`. Jangan hapus aturan di dalam prompt.

---

### Prompt A — Pembuka sesi (wajib, sekali per sesi)

```text
Kamu membantu proyek Florify (website florist AweFlorist). Sprint 3 membuat PANEL ADMIN.
Stack: Laravel 13, PHP 8.3, Inertia v3, React 19, TypeScript, Tailwind CSS 4, Pest.
Database lokal MySQL lewat Docker; test memakai SQLite di memori.

Sebelum menulis kode, baca file berikut:
1. doc/SPRINT_3_WORK_DISTRIBUTION.md — bagian 1, 2, dan 4 (kontrak bersama) WAJIB dibaca penuh.
2. PRD_Florify.md — bagian 4.3 (panel admin), 5.3, 6 (aturan bisnis), 10.3, 11 (keamanan).
3. resources/js/components/ui/* dan resources/js/components/admin/* (komponen yang wajib dipakai).

Aturan selama sesi ini:
- Ikuti kontrak bagian 4 PERSIS: nama tabel, kolom, model, enum, rute, nama rute, nama halaman Inertia, dan bentuk props.
- Rute admin hanya ditulis di routes/admin.php di bawah penanda story saya.
- Hanya ubah file milik story yang saya sebutkan (tabel 4.8). Jika perlu mengubah file lain, BERHENTI dan tanya saya dulu.
- Pakai komponen ui/ (Button, Input, Label, Select, Dialog, Badge, Card) dan admin/ (AdminPage, AdminTable,
  StatusBadge, Pagination, FilterBar). Jangan membuat komponen tombol/input/tabel baru.
- Jangan menulis warna hex. Jangan menambah paket composer atau npm.
- Validasi di server memakai FormRequest di app/Http/Requests/Admin. Pesan galat dan teks tampilan Bahasa Indonesia.
- Setiap halaman admin harus punya test "tamu diarahkan ke login".
- JANGAN menjalankan perintah git apa pun (git add, commit, push, merge, reset, checkout, switch, stash).
- Jangan menjalankan php artisan migrate:fresh atau db:wipe (menghapus data lokal).

Setelah membaca, jawab singkat:
1. Ringkasan kontrak bagian 4 dalam 5 poin.
2. Daftar komponen di resources/js/components/admin (jika sudah ada) dan components/ui.
Belum perlu menulis kode.
```

---

### Prompt B — Mengerjakan satu user story

```text
Saya <NAMA>. Kerjakan <US-XX> dari doc/SPRINT_3_WORK_DISTRIBUTION.md bagian 5.

Langkah:
1. Baca bagian "<US-XX>" sampai habis, termasuk tabel file, kriteria selesai, dan daftar test.
2. Baca semua file yang disebut di bagian itu dan di prompt OpenCode milik story tersebut.
3. Sebelum menulis kode, tampilkan RENCANA singkat: daftar file yang akan dibuat/diubah dan isi utamanya. Tunggu saya menjawab "lanjut".
4. Setelah saya jawab "lanjut", kerjakan sesuai rencana.
5. Tulis test Pest sesuai daftar test story itu (termasuk test tamu diarahkan ke login).
6. Jalankan dan laporkan hasil:
   php artisan wayfinder:generate --with-form
   php artisan test
   npm run check
   npm run types:check
7. Laporan akhir berisi:
   - daftar file yang dibuat/diubah,
   - kriteria selesai mana yang sudah terpenuhi (centang) dan mana yang belum,
   - cara saya menguji manual di browser (login, URL, dan langkah),
   - hal yang perlu saya tanyakan ke Rofiq.

Ingat aturan Prompt A. Jangan menjalankan perintah git.
```

**Contoh yang sudah diisi (story pertama tiap orang):**

| Orang | Isi baris pertama Prompt B |
|---|---|
| Latif | `Saya Latif. Kerjakan US-18 dari doc/SPRINT_3_WORK_DISTRIBUTION.md bagian 5.` |
| Suci | `Saya Suci. Kerjakan US-21 dari doc/SPRINT_3_WORK_DISTRIBUTION.md bagian 5.` |
| Prety | `Saya Prety. Kerjakan US-24 dari doc/SPRINT_3_WORK_DISTRIBUTION.md bagian 5.` |
| Nabila | `Saya Nabila. Kerjakan US-27 dari doc/SPRINT_3_WORK_DISTRIBUTION.md bagian 5.` |

Story berikutnya: Latif US-19 lalu US-20 · Suci US-22 lalu US-23 · Prety US-25 · Nabila US-26 lalu US-28.

---

### Prompt C — Test atau pemeriksaan gagal

```text
Perintah berikut gagal:
<tempel perintahnya, misalnya: php artisan test>

Pesan galatnya:
<tempel seluruh pesan galat dari terminal>

Cari penyebabnya dan perbaiki HANYA di file milik <US-XX>.
Jika penyebabnya ada di file milik orang lain (lihat tabel 4.8 di doc/SPRINT_3_WORK_DISTRIBUTION.md),
JANGAN ubah file itu. Jelaskan masalahnya supaya saya bisa menyampaikan ke pemiliknya.
Jangan mengubah atau menghapus test agar lulus, kecuali test itu memang salah menurut kontrak bagian 4.
Setelah memperbaiki, jalankan ulang perintahnya dan laporkan hasilnya. Jangan menjalankan perintah git.
```

---

### Prompt D — Cek mandiri sebelum membuat Pull Request

```text
Saya akan membuat Pull Request untuk <US-XX>. Periksa pekerjaan saya, JANGAN mengubah file apa pun dulu.

1. Jalankan: git diff --stat origin/main   (perintah ini hanya MEMBACA, boleh dijalankan)
2. Bandingkan daftar file yang berubah dengan file milik <US-XX> di doc/SPRINT_3_WORK_DISTRIBUTION.md (tabel 4.8 dan bagian story).
   Sebutkan file yang berubah padahal BUKAN milik story ini.
3. Cek kesesuaian dengan kontrak bagian 4: nama tabel/kolom, nama rute, penanda di routes/admin.php, nama halaman Inertia, bentuk props.
4. Cek: semua rute baru memakai middleware auth (ada di dalam grup admin), dan ada test tamu diarahkan ke login.
5. Cek checklist bagian 7 satu per satu, beri tanda [x] atau [ ] beserta alasannya.
6. Cari: warna hex baru, paket baru, console.log, kode yang dikomentari, teks bahasa Inggris di tampilan, file .env.
7. Tuliskan draf deskripsi PR memakai template bagian 7 (bagian "Cara menguji" diisi lengkap).

Hanya laporkan. Jangan memperbaiki tanpa izin saya. Jangan menjalankan git add/commit/push.
```

---

### Prompt E — Membantu menyelesaikan konflik merge

Pakai setelah kamu sendiri menjalankan `git fetch origin` dan `git merge origin/main`, lalu muncul konflik.

```text
Saya sedang merge origin/main ke branch <NAMA-BRANCH> dan ada konflik di file:
<tempel daftar file dari "git status" bagian "both modified">

Untuk setiap file konflik:
1. Jelaskan bagian "<<<<<<< HEAD" (perubahan saya) dan bagian ">>>>>>> origin/main" (perubahan orang lain).
2. Usulkan hasil gabungan yang MEMPERTAHANKAN perubahan kedua pihak jika keduanya diperlukan
   (contoh: di routes/admin.php, app-sidebar.tsx, types/admin.ts, orders/show.tsx, baris milik story lain dan
   baris saya sama-sama dipertahankan di bawah penandanya masing-masing).
3. Setelah saya setuju, tulis hasil gabungannya ke file dan pastikan tidak ada lagi tanda <<<<<<<, =======, >>>>>>>.
4. Jalankan php artisan wayfinder:generate --with-form, php artisan test, npm run check, npm run types:check dan laporkan hasilnya.

JANGAN menjalankan git add, git commit, git merge --abort, git checkout, atau git reset. Saya yang menjalankannya.
```

Setelah OpenCode selesai, kamu sendiri yang menjalankan:
```bash
git add <file-yang-konflik>
git commit
git push
```

---

### Prompt F — Memperbaiki komentar review dari Rofiq

```text
Rofiq memberi komentar review di Pull Request <US-XX>:
<tempel semua komentar review dari GitHub, lengkap dengan nama file dan baris>

Untuk setiap komentar:
1. Jelaskan apa yang diminta.
2. Perbaiki di file yang disebut (hanya file milik <US-XX>).
3. Jika menurutmu komentar itu bertentangan dengan kontrak bagian 4, jangan diubah; jelaskan alasannya supaya saya bisa membalas di GitHub.
Setelah selesai jalankan php artisan test, npm run check, npm run types:check dan laporkan hasilnya.
Jangan menjalankan perintah git.
```

Setelah itu kamu sendiri: `git add <file>` → `git commit -m "fix(<area>): perbaikan review (US-XX)"` → `git push`. PR ter-update otomatis.

---

### Prompt G — Menjelaskan kode (persiapan review & demo)

```text
Jelaskan pekerjaan <US-XX> kepada saya dengan bahasa sederhana, seperti menjelaskan ke teman yang baru belajar Laravel.
1. Alur dari admin membuka halaman sampai data tersimpan/tampil: rute (dan middleware auth) → controller → FormRequest → model → halaman React.
2. Untuk setiap file yang dibuat/diubah di story ini: apa fungsinya dalam 1-2 kalimat.
3. Bagian yang paling penting untuk keamanan/kebenaran data (login wajib, validasi, transaksi, status terpisah, snapshot) dan kenapa.
4. Tiga pertanyaan yang mungkin ditanyakan dosen saat demo, beserta jawabannya.
Jangan mengubah file apa pun.
```

---

### 9.1 Hal yang harus kamu lakukan sendiri (bukan OpenCode)

| Langkah | Perintah / tindakan |
|---|---|
| Membuat branch | `git switch -c feature/<nama>-<us-xx>-<topik>` |
| Membaca hasil AI | `git status`, `git diff` |
| Membatalkan file yang tidak seharusnya berubah | `git restore <file>` |
| Menyimpan | `git add <file>` + `git commit -m "..."` |
| Mengirim | `git push` |
| Membuat PR (base `main`), merespons review | di GitHub (Bagian 6.4) |
| Menguji di browser | `composer dev`, login admin, buka di HP & desktop |
