# Florify — Sprint 2: Data Dinamis & Pemesanan

Kelompok 2 (CodeHive) · MI 3B · Proyek Utama (ISY3215)
Disusun oleh: Rofiq (Scrum Master). Product Owner: Nabila.

> **Cara memakai dokumen ini**
> 1. Baca **Bagian 1–4** sampai selesai (semua anggota).
> 2. Cari user story milikmu di **Bagian 5**.
> 3. Ikuti **Git** di bagian story itu. Semua perintah Git **kamu jalankan sendiri**.
> 4. Boleh memakai OpenCode: berikan file ini dan prompt di bagian story-mu. OpenCode hanya menulis kode, **tidak boleh** menjalankan `git add`, `git commit`, atau `git push`.

---

## Daftar isi

1. [Tujuan Sprint 2](#1-tujuan-sprint-2)
2. [Kondisi proyek sekarang](#2-kondisi-proyek-sekarang)
3. [Pembagian tugas & urutan kerja](#3-pembagian-tugas--urutan-kerja)
4. [Kontrak bersama (WAJIB diikuti semua orang)](#4-kontrak-bersama-wajib-diikuti-semua-orang)
5. [Detail per user story](#5-detail-per-user-story)
6. [Git & GitHub — panduan umum](#6-git--github--panduan-umum)
7. [Checklist Pull Request](#7-checklist-pull-request)
8. [Tugas Rofiq (koordinator)](#8-tugas-rofiq-koordinator)

---

## 1. Tujuan Sprint 2

**Sprint goal (usulan, disahkan saat Sprint Planning):**
Pelanggan bisa memesan buket dan mengirim permintaan buket custom melalui website, dan setiap pesanan tersimpan rapi dengan nomor pesanan sendiri.

Sumber: PRD §12 "Sprint 2 — Data Dinamis dan Pemesanan", FR-05 s.d. FR-23, aturan bisnis PRD §6, rancangan data PRD §9.

**Masuk Sprint 2**
- Produk, kategori, dan acara dipindah dari file `.ts` ke **database**.
- Katalog, detail, dan beranda membaca data dari database.
- Pencarian dan filter di server (Should).
- **Formulir pemesanan produk** dengan validasi server.
- Pesanan **tersimpan** dan mendapat **nomor pesanan unik**.
- **Halaman konfirmasi** pesanan dan tautan WhatsApp lanjutan.
- **Permintaan buket custom tersimpan** di database.
- Unggah gambar referensi custom (Should).

**Tidak masuk Sprint 2** (Sprint 3+): login admin, dashboard, CRUD produk, status pesanan oleh admin, pembayaran, stok.

**Definition of Done Sprint 2** (PRD §12):
- [ ] Data produk berasal dari database.
- [ ] Formulir yang valid tersimpan dengan benar.
- [ ] Input yang tidak valid menampilkan pesan galat yang jelas.
- [ ] Nomor pesanan unik.
- [ ] Skenario pemesanan utama lulus pengujian otomatis.
- [ ] Semua PR di-merge ke `main`, CI GitHub hijau.
- [ ] Tampilan diuji di ponsel (375 px) dan desktop (1440 px).

---

## 2. Kondisi proyek sekarang

| Hal | Kondisi |
|---|---|
| Stack | Laravel 13 + Inertia v3 + React 19 (TypeScript) + Tailwind 4. **Jangan diganti.** |
| Database lokal | SQLite (`database/database.sqlite`, dibuat oleh `composer setup`). Test memakai SQLite di memori. |
| Database produksi | MySQL (PRD §8). Karena itu kode **wajib** memakai Eloquent/migration, bukan SQL khusus SQLite. |
| Halaman publik | `/`, `/katalog`, `/katalog/{slug}`, `/buket-custom`, `/informasi` sudah jalan. |
| Data produk | Masih statis di `resources/js/data/products.ts` (16 produk contoh, foto sementara). |
| Formulir custom | Ada di `components/florify/custom-bouquet-form.tsx`; validasi di browser lalu buka WhatsApp, **belum disimpan**. |
| Komponen | Pakai yang ada: `BrandButton`, `FormField`, `ProductCard`, `ProductGrid`, `ProductImage`, `PriceLabel`, `EmptyState`, `Notice`, `PageHeader`, `Section`, `SectionHeading`, `WhatsAppButton`. Lihat `doc/SPRINT_1_DESIGN_SYSTEM.md`. |
| Form Inertia | Contoh pola resmi: `resources/js/pages/auth/login.tsx` (`<Form {...store.form()}>`). |
| Build statis Vercel | `resources/js/static/*` + `vite.static.config.ts` (dibuat Latif). Tidak bisa menjalankan Laravel/database. Lihat [US-10](#us-10--katalog-detail-dan-beranda-membaca-database-latif) dan [Bagian 8](#8-tugas-rofiq-koordinator). |
| Pengujian | Pest. `php artisan test`, `npm run check`, `npm run types:check`. CI menjalankan ketiganya. |

**Sebelum mulai Sprint 2:** sisa tugas Sprint 1 milikmu (lihat `doc/sprint-1/<nama>.md`) sebaiknya sudah di-merge. Kalau belum, selesaikan atau pindahkan ke backlog bersama Rofiq.

---

## 3. Pembagian tugas & urutan kerja

### 3.1 Tabel user story

| Kode | User story | Pemilik | Prioritas | SP | Branch |
|---|---|---|---|---|---|
| **US-09** | Sebagai tim, saya ingin struktur database siap agar semua fitur Sprint 2 punya tempat menyimpan data | **Latif** | Must | 5 | `feature/latif-us09-database` |
| US-10 | Sebagai pengunjung, saya ingin katalog, detail, dan beranda menampilkan data dari database agar informasinya selalu terbaru | **Latif** | Must | 3 | `feature/latif-us10-katalog-db` |
| US-11 | Sebagai pengunjung, saya ingin mencari produk dan memfilter kategori/acara agar cepat menemukan buket | **Latif** | Should | 2 | `feature/latif-us11-cari-filter` |
| US-12 | Sebagai pelanggan, saya ingin pesanan saya tersimpan dengan nomor pesanan agar tidak hilang di chat | **Suci** | Must | 5 | `feature/suci-us12-simpan-pesanan` |
| US-13 | Sebagai pelanggan, saya ingin mengisi formulir pemesanan produk agar detail pesanan tercatat lengkap | **Suci** | Must | 3 | `feature/suci-us13-form-pesanan` |
| US-14 | Sebagai pelanggan, saya ingin melihat konfirmasi dan nomor pesanan setelah mengirim, lalu lanjut chat WhatsApp | **Nabila** | Must | 3 | `feature/nabila-us14-konfirmasi` |
| US-15 | Sebagai pelanggan, saya ingin permintaan buket custom saya tersimpan agar admin bisa menindaklanjuti | **Prety** | Must | 5 | `feature/prety-us15-custom-simpan` |
| US-16 | Sebagai pelanggan, saya ingin melampirkan gambar referensi buket custom | **Prety** | Should | 2 | `feature/prety-us16-gambar-referensi` |
| US-17 | Sebagai Product Owner, saya ingin alur pemesanan diuji dan datanya sesuai toko agar siap didemokan | **Nabila** | Must | 3 | `feature/nabila-us17-pengujian` |

Total: **31 SP** (Must 27, Should 4). Velocity Sprint 1 = 21 SP dengan 3 orang. Jika kapasitas tidak cukup saat Sprint Planning, **US-11 dan US-16 dipindah ke Sprint 3**.

### 3.2 Ringkasan per orang

| Orang | Story | Fokus |
|---|---|---|
| **Latif** | US-09, US-10, US-11 | Database, seeder, katalog dari database, pencarian |
| **Suci** | US-12, US-13 | Menyimpan pesanan (backend) + halaman formulir pesanan |
| **Nabila** | US-14, US-17 | Halaman konfirmasi + pengujian alur + data asli toko (sebagai PO) |
| **Prety** | US-15, US-16 | Permintaan buket custom tersimpan + unggah gambar referensi |
| **Rofiq** | — | Menulis dokumen ini, review & merge PR, hosting, koordinasi (Bagian 8) |

### 3.3 Urutan kerja & urutan merge

```text
Hari 1   Latif: US-09 (database)  ── PR ── Rofiq review & merge HARI ITU JUGA
         Yang lain: baca dokumen, pelajari komponen, siapkan tampilan (belum commit)

Hari 2-4 (paralel, semua mulai dari main yang sudah berisi US-09)
         Latif  : US-10  → lalu US-11
         Nabila : US-14  (pakai data factory, tidak menunggu Suci)
         Suci   : US-12  → lalu US-13
         Prety  : US-15  → lalu US-16

Hari 5-6 Nabila: US-17 (pengujian ujung-ke-ujung + data asli)
Hari 7   Rofiq : integrasi akhir, demo
```

**Urutan merge yang wajib** (Rofiq menjaga ini):

1. **US-09** (semua bergantung padanya)
2. **US-10** dan **US-14** (boleh urutan mana saja)
3. **US-12**, harus **setelah US-14**, karena US-12 mengarahkan ke halaman konfirmasi milik US-14
4. **US-13**, setelah US-12 dan US-10
5. **US-15**, setelah US-09
6. US-11, US-16, US-17

Kalau PR-mu menunggu PR lain: tetap kerjakan di branch-mu. Setelah PR yang ditunggu di-merge, jalankan `git fetch origin` lalu `git merge origin/main` (Bagian 6.3).

---

## 4. Kontrak bersama (WAJIB diikuti semua orang)

Bagian ini adalah "kesepakatan bentuk". Karena tiap orang memakai OpenCode di laptop sendiri, **nama tabel, kolom, model, rute, dan props harus persis seperti di bawah**, supaya kode semua orang cocok saat digabung. Mau mengubah kontrak? Tanya Rofiq dulu.

### 4.1 Tabel database (dibuat semua di US-09 oleh Latif)

Nama file migration **persis** seperti ini (urutan penting karena ada foreign key):

| File migration | Tabel |
|---|---|
| `2026_10_28_000001_create_categories_table.php` | `categories` |
| `2026_10_28_000002_create_events_table.php` | `events` |
| `2026_10_28_000003_create_products_table.php` | `products` |
| `2026_10_28_000004_create_event_product_table.php` | `event_product` |
| `2026_10_28_000005_create_customers_table.php` | `customers` |
| `2026_10_28_000006_create_orders_table.php` | `orders` |
| `2026_10_28_000007_create_order_items_table.php` | `order_items` |
| `2026_10_28_000008_create_custom_requests_table.php` | `custom_requests` |

**`categories`**
| Kolom | Tipe | Catatan |
|---|---|---|
| id | id | |
| name | string(100) | "Buket Bunga Segar" |
| slug | string(100), unique | "buket-bunga" |
| description | text, nullable | |
| timestamps | | |

**`events`** (acara)
| Kolom | Tipe | Catatan |
|---|---|---|
| id | id | |
| name | string(100) | "Wisuda" |
| slug | string(100), unique | "wisuda" |
| description | text, nullable | |
| timestamps | | |

**`products`**
| Kolom | Tipe | Catatan |
|---|---|---|
| id | id | |
| category_id | foreignId → categories, `restrictOnDelete` | |
| name | string(150) | |
| slug | string(150), unique | dipakai di URL |
| description | text | |
| price | decimal(12,2), nullable | `null` = "Harga via WhatsApp" |
| price_from | boolean, default false | tampil "Mulai Rp …" |
| image_path | string, nullable | contoh `/images/products/buket-tulip-mix-01.webp` |
| is_featured | boolean, default false | produk unggulan beranda |
| is_active | boolean, default true | produk nonaktif tidak tampil (PRD §6 no.8) |
| timestamps | | |

**`event_product`** (pivot): `event_id` foreignId cascadeOnDelete, `product_id` foreignId cascadeOnDelete, primary key gabungan (`event_id`, `product_id`).

**`customers`**
| Kolom | Tipe | Catatan |
|---|---|---|
| id | id | |
| name | string(100) | |
| phone | string(20), index | disimpan sebagai **teks**, format `628xxxxxxxxxx` (PRD §9.1) |
| email | string, nullable | belum dipakai di form Sprint 2 |
| notes | text, nullable | |
| timestamps | | |

**`orders`**
| Kolom | Tipe | Catatan |
|---|---|---|
| id | id | |
| order_number | string(20), **unique** | format `AWF-YYYYMMDD-XXXXX` (§4.5) |
| customer_id | foreignId → customers, `restrictOnDelete` | |
| order_status | string(30), default `menunggu_konfirmasi` | nilai dari enum `OrderStatus` |
| payment_status | string(30), default `belum_dibayar` | nilai dari enum `PaymentStatus` (terpisah dari status pesanan, PRD §6 no.2) |
| needed_at | date | tanggal buket dibutuhkan |
| notes | text, nullable | |
| total_amount | decimal(12,2), nullable | `null` jika ada produk berharga "via WhatsApp" |
| timestamps | | |

**`order_items`**
| Kolom | Tipe | Catatan |
|---|---|---|
| id | id | |
| order_id | foreignId → orders, cascadeOnDelete | |
| product_id | foreignId → products, nullable, nullOnDelete | |
| product_name_snapshot | string(150) | **snapshot** nama saat dipesan (PRD §6 no.7) |
| unit_price_snapshot | decimal(12,2), nullable | snapshot harga |
| quantity | unsignedSmallInteger | 1–50 |
| subtotal | decimal(12,2), nullable | `unit_price × quantity`, `null` jika harga null |
| timestamps | | |

**`custom_requests`**
| Kolom | Tipe | Catatan |
|---|---|---|
| id | id | |
| request_number | string(20), **unique** | format `CST-YYYYMMDD-XXXXX` (tambahan agar mudah dirujuk di WhatsApp) |
| customer_id | foreignId → customers, restrictOnDelete | |
| product_id | foreignId → products, nullable, nullOnDelete | model acuan, jika dikirim dari halaman detail (tambahan) |
| budget | decimal(12,2) | |
| theme_color | string(100) | |
| bouquet_type | string(100) | |
| needed_at | date | |
| reference_image_path | string, nullable | diisi di US-16 |
| notes | text, nullable | |
| status | string(30), default `baru` | nilai dari enum `CustomRequestStatus` |
| timestamps | | |

> Uang selalu `decimal(12,2)`, **jangan** `float` (PRD §9.1).

### 4.2 Model, enum, factory (dibuat di US-09)

| File | Isi wajib |
|---|---|
| `app/Models/Category.php` | `hasMany(Product)` |
| `app/Models/Event.php` | `belongsToMany(Product)` |
| `app/Models/Product.php` | `belongsTo(Category)`, `belongsToMany(Event)`, scope `active()`, scope `featured()`, method `toCatalogArray(): array` (§4.4), cast `price` → `decimal:2`, `price_from`/`is_featured`/`is_active` → `boolean` |
| `app/Models/Customer.php` | `hasMany(Order)`, `hasMany(CustomRequest)`, static `normalizePhone(string): string` (§4.6) |
| `app/Models/Order.php` | `belongsTo(Customer)`, `hasMany(OrderItem)`, cast `order_status` → `OrderStatus`, `payment_status` → `PaymentStatus`, `needed_at` → `date`, `total_amount` → `decimal:2`, `getRouteKeyName()` → `'order_number'` |
| `app/Models/OrderItem.php` | `belongsTo(Order)`, `belongsTo(Product)` |
| `app/Models/CustomRequest.php` | `belongsTo(Customer)`, `belongsTo(Product)`, cast `status` → `CustomRequestStatus`, `needed_at` → `date`, `getRouteKeyName()` → `'request_number'` |
| `app/Enums/OrderStatus.php` | backed enum string: `Baru='baru'`, `MenungguKonfirmasi='menunggu_konfirmasi'`, `Dikonfirmasi='dikonfirmasi'`, `Diproses='diproses'`, `SiapDiambilDikirim='siap'`, `Selesai='selesai'`, `Dibatalkan='dibatalkan'` + method `label(): string` (teks Indonesia, PRD §6 no.3) |
| `app/Enums/PaymentStatus.php` | `BelumDibayar='belum_dibayar'`, `Dp='dp'`, `Lunas='lunas'`, `Dikembalikan='dikembalikan'`, `TidakBerlaku='tidak_berlaku'` + `label()` (PRD §6 no.4) |
| `app/Enums/CustomRequestStatus.php` | `Baru='baru'`, `Ditinjau='ditinjau'`, `Disepakati='disepakati'`, `Dibatalkan='dibatalkan'` + `label()` |
| `app/Support/ReferenceNumber.php` | `generate(string $prefix, string $modelClass, string $column): string` (§4.5) |
| `database/factories/*Factory.php` | factory untuk **semua** model di atas (dipakai test semua orang) |
| `database/seeders/CatalogSeeder.php` | 4 kategori, 3 acara, 16 produk **sama persis** dengan `resources/js/data/products.ts` (nama, slug, harga, foto, acara, unggulan) |
| `database/seeders/DatabaseSeeder.php` | tambahkan `$this->call(CatalogSeeder::class);` |

### 4.3 Rute (`routes/web.php`)

| Method | URL | Nama rute | Controller | Halaman Inertia | Story |
|---|---|---|---|---|---|
| GET | `/` | `home` | `HomeController` (invokable) | `public/home` | US-10 |
| GET | `/katalog` | `catalog.index` | `CatalogController@index` | `public/catalog` | US-10, US-11 |
| GET | `/katalog/{product:slug}` | `catalog.show` | `CatalogController@show` | `public/product-detail` | US-10 |
| GET | `/pesan/{product:slug}` | `orders.create` | `OrderController@create` | `public/order-create` | US-13 |
| POST | `/pesan/{product:slug}` | `orders.store` | `OrderController@store`, middleware `throttle:10,1` | — (redirect) | US-12 |
| GET | `/pesanan/{order:order_number}` | `orders.confirmation` | `OrderConfirmationController` (invokable), middleware **`signed`** | `public/order-confirmation` | US-14 |
| GET | `/buket-custom` | `custom` | `CustomRequestController@create` | `public/custom-bouquet` | US-15 |
| POST | `/buket-custom` | `custom.store` | `CustomRequestController@store`, `throttle:10,1` | — (redirect) | US-15 |
| GET | `/buket-custom/terkirim/{customRequest:request_number}` | `custom.confirmation` | `CustomRequestController@confirmation`, **`signed`** | `public/custom-confirmation` | US-15 |
| GET | `/informasi` | `info` | (tetap `Route::inertia`) | `public/info` | — |

Controller ada di `app/Http/Controllers/Public/` (PRD §8.3).

**Supaya tidak bentrok di `routes/web.php`:** di US-09 Latif menambahkan **komentar penanda** per story (lihat US-09). Setiap orang menulis rutenya **di bawah penanda miliknya sendiri**, tidak di tempat lain.

Halaman konfirmasi memakai **signed URL** (`URL::signedRoute(...)`) supaya orang lain tidak bisa menebak nomor pesanan dan melihat data pelanggan (PRD §11).

### 4.4 Bentuk data ke frontend (props)

Backend **harus** mengirim produk dalam bentuk yang sama dengan tipe `Product` yang sudah dipakai komponen (`resources/js/types/florify.ts`). Dengan begitu `ProductCard`, `ProductGrid`, dan `PriceLabel` tidak perlu diubah.

`Product::toCatalogArray()` mengembalikan:

```php
[
    'slug' => $this->slug,
    'name' => $this->name,
    'category' => $this->category->slug,          // string
    'occasions' => $this->events->pluck('slug')->all(), // string[]
    'description' => $this->description,
    'price' => $this->price === null ? null : (int) $this->price, // number|null
    'priceFrom' => $this->price_from,
    'image' => $this->image_path,                  // string|null
    'featured' => $this->is_featured,
]
```

Selalu muat relasi dengan `with(['category', 'events'])` agar tidak terjadi query berulang (N+1).

Di US-09, tipe TypeScript diubah agar kategori/acara bukan daftar tetap lagi:

```ts
export type ProductCategorySlug = string;
export type OccasionSlug = string;
```

Props per halaman:

| Halaman | Props |
|---|---|
| `public/home` | `featuredProducts: Product[]` |
| `public/catalog` | `products: Product[]`, `categories: ProductCategory[]`, `occasions: Occasion[]`, `filters: { kategori: string \| null; acara: string \| null; q: string \| null }` |
| `public/product-detail` | `product: Product`, `related: Product[]` |
| `public/order-create` | `product: Product` |
| `public/order-confirmation` | `order: OrderSummary` |
| `public/custom-bouquet` | `bouquetTypes: string[]`, `reference: { slug: string; name: string } \| null` |
| `public/custom-confirmation` | `customRequest: CustomRequestSummary` |

Tipe baru (ditambahkan di `resources/js/types/florify.ts` oleh pemilik story):

```ts
// US-14 (Nabila)
export type OrderSummary = {
    orderNumber: string;
    customerName: string;
    customerPhoneMasked: string; // contoh "6281****6789"
    neededAt: string;            // "YYYY-MM-DD"
    notes: string | null;
    statusLabel: string;         // OrderStatus::label()
    paymentStatusLabel: string;  // PaymentStatus::label()
    items: { name: string; quantity: number; unitPrice: number | null; subtotal: number | null }[];
    totalAmount: number | null;
    createdAt: string;           // ISO 8601
};

// US-15 (Prety)
export type CustomRequestSummary = {
    requestNumber: string;
    customerName: string;
    bouquetType: string;
    budget: number;
    themeColor: string;
    neededAt: string;
    notes: string | null;
    referenceProductName: string | null;
    hasReferenceImage: boolean;
    statusLabel: string;
};
```

### 4.5 Nomor pesanan

- Pesanan: `AWF-` + tanggal `Ymd` + `-` + 5 karakter acak dari `ABCDEFGHJKLMNPQRSTUVWXYZ23456789` (tanpa huruf/angka yang mirip seperti O/0, I/1). Contoh: `AWF-20261029-K7M2Q`.
- Custom: sama, awalan `CST-`.
- `ReferenceNumber::generate()` mencoba hingga 5 kali jika nomor sudah dipakai. Kolom tetap `unique` di database sebagai pengaman terakhir.
- Cara ini aman untuk SQLite dan MySQL (tidak memakai nomor urut berbasis `count()`).

### 4.6 Aturan validasi bersama

| Kolom | Aturan |
|---|---|
| Nama | wajib, string, maks 100 |
| Nomor WhatsApp | wajib, regex `/^(\+62\|62\|0)8[0-9]{7,12}$/` (spasi/tanda hubung dibuang dulu), lalu **dinormalkan** jadi `628…` lewat `Customer::normalizePhone()` |
| Tanggal dibutuhkan | wajib, `date`, `after_or_equal:today` |
| Catatan | opsional, maks 500 |
| Jumlah (pesanan) | wajib, integer, 1–50 |
| Anggaran (custom) | wajib, integer, min 10000, maks 100000000 |
| Warna/tema (custom) | wajib, maks 100 |
| Jenis buket (custom) | wajib, harus salah satu dari `bouquetTypes` |
| Gambar referensi (US-16) | opsional, `image`, `mimes:jpg,jpeg,png,webp`, maks **2 MB** (usulan; konfirmasi PO, PRD §15 no.6) |

Semua pesan galat dalam **Bahasa Indonesia**, ditulis di method `messages()` dan `attributes()` di masing-masing FormRequest.

**Pelanggan:** cari berdasarkan nomor yang sudah dinormalkan. Kalau belum ada, buat baru. Kalau sudah ada, **jangan** menimpa nama lama.

### 4.7 Aturan kode

- Validasi **di server** dengan FormRequest (`app/Http/Requests/Public/...`). Validasi di browser hanya tambahan.
- Simpan pesanan + item dalam **satu transaksi** (`DB::transaction`) (PRD §9.1, NFR-07).
- Tampilan memakai komponen dan token design system. **Tidak ada** warna hex baru, **tidak ada** paket npm/composer baru.
- Form memakai `<Form {...route.form()}>` dari `@inertiajs/react` + `FormField` (contoh: `pages/auth/login.tsx`). Galat dari server ditampilkan lewat `error={errors.nama_kolom}`.
- Tautan WhatsApp **tidak** dianggap konfirmasi pesanan (FR-23, PRD §6 no.11).
- Setiap story menyertakan **test Pest** (lihat bagian story).
- `npm run check`, `npm run types:check`, `php artisan test` harus lulus sebelum PR.

### 4.8 Siapa memegang file apa (Sprint 2)

| File / folder | Pemilik | Catatan |
|---|---|---|
| `database/migrations/2026_10_28_*`, `app/Models/*` (kecuali `User`), `app/Enums/*`, `app/Support/ReferenceNumber.php`, `database/factories/*`, `database/seeders/*` | Latif | Setelah US-09 di-merge, **ubah lewat Latif/Rofiq** |
| `app/Http/Controllers/Public/HomeController.php`, `CatalogController.php` | Latif | |
| `resources/js/pages/public/home.tsx`, `catalog.tsx`, `product-detail.tsx` (bagian produk biasa), `components/home/featured-products-section.tsx`, `resources/js/static/*` | Latif | |
| `app/Http/Controllers/Public/OrderController.php`, `app/Http/Requests/Public/StoreOrderRequest.php`, `app/Actions/PlaceOrder.php` | Suci | |
| `resources/js/pages/public/order-create.tsx`, tombol "Pesan Sekarang" di `product-detail.tsx` | Suci | koordinasi dengan Latif untuk `product-detail.tsx` |
| `app/Http/Controllers/Public/OrderConfirmationController.php`, `resources/js/pages/public/order-confirmation.tsx`, `orderFollowUpMessage()` di `lib/whatsapp.ts` | Nabila | |
| `tests/Feature/Sprint2/*` (pengujian ujung-ke-ujung), `doc/sprint-2/uji-penerimaan.md` | Nabila | test per story tetap ditulis pemilik story |
| `app/Http/Controllers/Public/CustomRequestController.php`, `app/Http/Requests/Public/StoreCustomRequestRequest.php`, `resources/js/pages/public/custom-bouquet.tsx`, `custom-confirmation.tsx`, `components/florify/custom-bouquet-form.tsx`, `customRequestFollowUpMessage()` di `lib/whatsapp.ts` | Prety | |
| `routes/web.php` | semua | hanya di bawah penanda masing-masing |
| `resources/js/types/florify.ts` | semua | hanya menambah tipe milik story sendiri |
| `resources/css/app.css`, `components/florify/*` lainnya, `layouts/*`, `config/site.ts` | Rofiq | minta lewat grup |

---

## 5. Detail per user story

Setiap story berisi: tujuan, file, langkah, kriteria selesai, test, **prompt OpenCode**, dan **perintah Git**.

---

### US-09 — Fondasi database (Latif)

**Story:** Sebagai tim, saya ingin struktur database siap agar semua fitur Sprint 2 punya tempat menyimpan data.
**Prioritas:** Must · **SP:** 5 · **Dikerjakan:** Hari 1 (yang lain menunggu ini)
**PRD:** §9, §9.1, FR-05, aturan bisnis §6

**Yang dibuat:** semua isi §4.1 dan §4.2, ditambah:

1. Migration 8 tabel dengan nama file persis §4.1.
2. Model, enum, `ReferenceNumber`, factory, `CatalogSeeder` (§4.2).
3. Ubah `ProductCategorySlug` dan `OccasionSlug` menjadi `string` di `resources/js/types/florify.ts` (§4.4).
4. Tambahkan **penanda** di `routes/web.php`, tepat di atas `Route::middleware(['auth', 'verified'])`:
   ```php
   // --- US-10 Latif: beranda & katalog dari database ---

   // --- US-12 Suci: simpan pesanan ---

   // --- US-13 Suci: formulir pesanan ---

   // --- US-14 Nabila: konfirmasi pesanan ---

   // --- US-15 Prety: buket custom ---
   ```
   Rute lama (`/`, `/katalog`, `/katalog/{slug}`, `/buket-custom`, `/informasi`) **dibiarkan dulu**. Rute lama diganti di story masing-masing.

**Kriteria selesai:**
- [ ] `php artisan migrate:fresh --seed` berhasil di SQLite tanpa galat.
- [ ] Setelah seeding: 4 kategori, 3 acara, 16 produk, 4 produk unggulan.
- [ ] `Product::active()->with(['category','events'])->first()->toCatalogArray()` menghasilkan bentuk §4.4.
- [ ] `ReferenceNumber::generate('AWF', Order::class, 'order_number')` menghasilkan format §4.5.
- [ ] Semua factory bisa dipakai: `Order::factory()->has(OrderItem::factory()->count(2), 'items')->create()`.
- [ ] Tampilan website **tidak berubah** (masih membaca file `.ts`).

**Test (`tests/Feature/DatabaseFoundationTest.php`, `tests/Unit/ReferenceNumberTest.php`):**
- seeder menghasilkan jumlah data yang benar;
- `toCatalogArray()` sesuai bentuk;
- `order_number` unik (insert ganda gagal);
- format nomor sesuai regex `^AWF-\d{8}-[A-HJ-NP-Z2-9]{5}$`;
- `Customer::normalizePhone('0812-3456-7890')` → `6281234567890`.

**Prompt OpenCode:**
```text
Baca doc/SPRINT_2_WORK_DISTRIBUTION.md bagian 2, 4 (seluruhnya), dan "US-09".
Baca juga PRD_Florify.md bagian 6 dan 9, resources/js/data/products.ts, resources/js/data/catalog.ts,
resources/js/types/florify.ts, routes/web.php, database/seeders/DatabaseSeeder.php.

Kerjakan US-09 persis sesuai kontrak di bagian 4.1, 4.2, 4.4, 4.5:
- 8 migration dengan nama file persis seperti tabel 4.1.
- Model, enum, app/Support/ReferenceNumber.php, factory untuk semua model, CatalogSeeder berisi
  data yang sama persis dengan resources/js/data/products.ts.
- Ubah ProductCategorySlug dan OccasionSlug menjadi string di resources/js/types/florify.ts.
- Tambahkan komentar penanda di routes/web.php seperti di US-09 langkah 4. Jangan ubah rute lama.
- Buat test Pest: tests/Feature/DatabaseFoundationTest.php dan tests/Unit/ReferenceNumberTest.php.
Stack: Laravel 13, PHP 8.3, Pest. Harus jalan di SQLite dan MySQL. Uang memakai decimal(12,2).
Jangan menambah paket composer/npm. Jangan mengubah tampilan React.
Jangan menjalankan perintah git. Setelah selesai, jalankan php artisan migrate:fresh --seed dan
php artisan test, lalu laporkan file yang dibuat/diubah dan hasil test.
```

**Git (Latif):**
```bash
git switch main
git pull origin main
git switch -c feature/latif-us09-database

# ... kerjakan / jalankan OpenCode ...

php artisan migrate:fresh --seed
php artisan test
npm run check
npm run types:check

git status
git add database/migrations/ database/factories/ database/seeders/
git commit -m "feat(db): migration, factory, dan seeder Sprint 2 (US-09)"
git add app/Models/ app/Enums/ app/Support/
git commit -m "feat(db): model, enum, dan nomor referensi (US-09)"
git add resources/js/types/florify.ts routes/web.php tests/
git commit -m "feat(db): tipe frontend, penanda rute, dan test fondasi (US-09)"
git push -u origin feature/latif-us09-database
```
Lalu buat PR (Bagian 6.4), judul: **`US-09: Fondasi database Sprint 2`**, reviewer **Rofiq**. Kabari grup begitu PR di-merge: *"US-09 sudah di main, silakan mulai."*

---

### US-10 — Katalog, detail, dan beranda membaca database (Latif)

**Story:** Sebagai pengunjung, saya ingin katalog, detail, dan beranda menampilkan data dari database agar informasinya selalu terbaru.
**Prioritas:** Must · **SP:** 3 · **Butuh:** US-09
**PRD:** FR-03, FR-04, FR-05, FR-11

**Yang dibuat/diubah:**

| File | Perubahan |
|---|---|
| `app/Http/Controllers/Public/HomeController.php` | baru. Mengirim `featuredProducts` (aktif + unggulan, maks 4). |
| `app/Http/Controllers/Public/CatalogController.php` | baru. `index`: produk aktif, filter `kategori`/`acara` dari query string, plus `categories`, `occasions`, `filters`. `show`: produk aktif berdasarkan slug (404 jika tidak ada/nonaktif) + `related` (kategori sama, maks 3). |
| `routes/web.php` | di bawah penanda US-10: ganti rute `/`, `/katalog`, `/katalog/{slug}` dengan controller (§4.3). Rute `catalog.show` memakai `{product:slug}`. |
| `pages/public/home.tsx` | terima prop `featuredProducts`, teruskan ke `FeaturedProductsSection`. |
| `components/home/featured-products-section.tsx` | terima prop `products` (bukan import dari `data/products.ts`). |
| `pages/public/catalog.tsx` | pakai props `products`, `categories`, `occasions`, `filters` (bukan import file `.ts`). |
| `pages/public/product-detail.tsx` | pakai props `product`, `related`. Hapus cabang "produk tidak ditemukan" (server sudah 404). |
| `resources/js/static/main.tsx` | kirim data dari `data/products.ts` & `data/catalog.ts` sebagai props, supaya **build statis Vercel tetap jalan** dan `npm run types:check` lulus. |
| `config/site.ts` | **jangan** diubah. (`isSampleData` diputuskan Rofiq.) |

`resources/js/data/products.ts` **tidak dihapus**, karena masih dipakai build statis.

**Kriteria selesai:**
- [ ] Mengubah nama produk lewat `php artisan tinker` langsung terlihat di katalog setelah reload.
- [ ] `/katalog?kategori=buket-uang` dan `/katalog?acara=wisuda` tetap memfilter (kartu kategori di beranda memakainya).
- [ ] `/katalog/tidak-ada` → halaman 404.
- [ ] Produk dengan `is_active = false` tidak muncul di mana pun.
- [ ] Tampilan sama seperti sebelumnya (kartu, foto, harga).
- [ ] `npm run build:static` masih berhasil.

**Test (`tests/Feature/CatalogTest.php`):** beranda mengirim 4 produk unggulan · katalog mengirim produk aktif saja · filter kategori & acara · detail 200 untuk slug aktif · 404 untuk slug nonaktif/tidak ada · `related` tidak berisi produk itu sendiri. Ubah test lama di `PublicPagesTest.php` bila perlu (jalankan seeder atau factory di test).

**Prompt OpenCode:**
```text
Baca doc/SPRINT_2_WORK_DISTRIBUTION.md bagian 2, 4, dan "US-10".
Baca: app/Models/Product.php, routes/web.php, resources/js/pages/public/home.tsx, catalog.tsx,
product-detail.tsx, resources/js/components/home/featured-products-section.tsx,
resources/js/static/main.tsx, resources/js/types/florify.ts, tests/Feature/PublicPagesTest.php.

Kerjakan US-10: buat HomeController dan CatalogController di app/Http/Controllers/Public,
ganti rute lama di bawah penanda "US-10" di routes/web.php sesuai tabel 4.3, dan ubah halaman
React agar memakai props sesuai tabel props 4.4 (bukan import dari resources/js/data).
Produk dikirim lewat Product::toCatalogArray() dengan with(['category','events']).
Komponen ProductCard/ProductGrid/PriceLabel jangan diubah.
Perbarui resources/js/static/main.tsx agar mengirim data dari resources/js/data sebagai props,
supaya npm run build:static dan npm run types:check tetap lulus.
Buat tests/Feature/CatalogTest.php sesuai daftar test US-10.
Jangan menambah paket. Jangan menjalankan perintah git.
Setelah selesai jalankan php artisan test, npm run check, npm run types:check, npm run build:static,
lalu laporkan file yang berubah dan hasilnya.
```

**Git (Latif):**
```bash
git switch main
git pull origin main                      # pastikan US-09 sudah ada
git switch -c feature/latif-us10-katalog-db

# ... kerjakan ...

php artisan test && npm run check && npm run types:check && npm run build:static

git add app/Http/Controllers/Public/HomeController.php app/Http/Controllers/Public/CatalogController.php routes/web.php
git commit -m "feat(katalog): controller beranda dan katalog dari database (US-10)"
git add resources/js/pages/public/ resources/js/components/home/featured-products-section.tsx resources/js/static/
git commit -m "feat(katalog): halaman memakai props dari server (US-10)"
git add tests/
git commit -m "test(katalog): uji katalog, filter, dan detail (US-10)"
git push -u origin feature/latif-us10-katalog-db
```
PR: **`US-10: Katalog dari database`**, reviewer Rofiq.

---

### US-11 — Pencarian & filter di server (Latif)

**Story:** Sebagai pengunjung, saya ingin mencari produk dan memfilter kategori/acara agar cepat menemukan buket.
**Prioritas:** Should · **SP:** 2 · **Butuh:** US-10
**PRD:** FR-07, FR-08, FR-11

**Yang dibuat/diubah:**
- `CatalogController@index`: dukung `?q=` (cari di `name`, `LIKE`, tidak peka huruf besar/kecil, maks 100 karakter), digabung dengan `kategori` dan `acara`. Kirim `filters.q`.
- `pages/public/catalog.tsx`:
  - tombol filter kategori ("Semua" + tiap kategori) memakai `BrandButton` (`primary` aktif, `outline` tidak), `aria-pressed`, berupa `<Link>` ke URL dengan query;
  - kotak pencarian `<form method="get">` + `FormField` + tombol "Cari";
  - pertahankan `kategori`/`acara` saat mencari;
  - tanpa hasil → `EmptyState` + tombol "Tampilkan semua".

**Kriteria selesai:**
- [ ] `/katalog?q=mawar` hanya menampilkan produk bernama "mawar".
- [ ] `/katalog?q=mawar&kategori=buket-uang` menggabungkan keduanya.
- [ ] Tombol filter bisa dipakai dengan keyboard; tombol aktif terlihat jelas.
- [ ] Tidak ada scroll horizontal di 320 px.

**Test:** tambahkan ke `tests/Feature/CatalogTest.php`: pencarian, gabungan pencarian+filter, hasil kosong, `q` lebih dari 100 karakter tidak error.

**Prompt OpenCode:**
```text
Baca doc/SPRINT_2_WORK_DISTRIBUTION.md bagian 4 dan "US-11".
Baca app/Http/Controllers/Public/CatalogController.php, resources/js/pages/public/catalog.tsx,
resources/js/components/florify/brand-button.tsx, form-field.tsx, empty-state.tsx.
Kerjakan US-11: pencarian ?q= di server digabung filter kategori/acara, tombol filter kategori
(BrandButton + Link, aria-pressed), dan kotak pencarian GET memakai FormField.
Pakai token design system, jangan warna hex. Hanya ubah CatalogController.php, catalog.tsx,
dan tests/Feature/CatalogTest.php. Jangan menjalankan perintah git.
Jalankan php artisan test, npm run check, npm run types:check, lalu laporkan hasilnya.
```

**Git (Latif):**
```bash
git switch main && git pull origin main
git switch -c feature/latif-us11-cari-filter
# ... kerjakan ...
php artisan test && npm run check && npm run types:check
git add app/Http/Controllers/Public/CatalogController.php resources/js/pages/public/catalog.tsx tests/Feature/CatalogTest.php
git commit -m "feat(katalog): pencarian dan filter kategori di server (US-11)"
git push -u origin feature/latif-us11-cari-filter
```
PR: **`US-11: Pencarian dan filter katalog`**.

---

### US-12 — Menyimpan pesanan dengan nomor unik (Suci)

**Story:** Sebagai pelanggan, saya ingin pesanan saya tersimpan dengan nomor pesanan agar tidak hilang di chat.
**Prioritas:** Must · **SP:** 5 · **Butuh:** US-09 · **Merge setelah:** US-14
**PRD:** FR-15, FR-16, FR-17, §5.2, §6 no.1/2/7/11, §9.1, NFR-04/05/07

Story ini **backend saja**. Halaman formulirnya dibuat di US-13.

**Yang dibuat:**

| File | Isi |
|---|---|
| `app/Http/Requests/Public/StoreOrderRequest.php` | aturan §4.6 untuk `name`, `phone`, `quantity`, `needed_at`, `notes`; `messages()` + `attributes()` Bahasa Indonesia; `prepareForValidation()` membuang spasi/tanda hubung dari `phone`. |
| `app/Actions/PlaceOrder.php` | `handle(Product $product, array $data): Order`. Di dalam `DB::transaction`: cari/buat `Customer` (nomor dinormalkan, nama lama tidak ditimpa) → buat `Order` (`order_number` dari `ReferenceNumber`, status awal `menunggu_konfirmasi`, pembayaran `belum_dibayar`) → buat satu `OrderItem` dengan **snapshot** nama & harga → hitung `subtotal` & `total_amount` (keduanya `null` jika harga produk `null`). |
| `app/Http/Controllers/Public/OrderController.php` | method `store(StoreOrderRequest $request, Product $product)`: tolak (404) jika produk nonaktif, panggil `PlaceOrder`, lalu `redirect()->to(URL::signedRoute('orders.confirmation', $order))`. (Method `create` dibuat di US-13.) |
| `routes/web.php` | di bawah penanda US-12: `Route::post('pesan/{product:slug}', [OrderController::class, 'store'])->middleware('throttle:10,1')->name('orders.store');` |

**Kriteria selesai:**
- [ ] Data valid → 1 customer, 1 order, 1 order item tersimpan; redirect ke URL konfirmasi bertanda tangan.
- [ ] Data tidak valid → kembali ke formulir dengan pesan galat Bahasa Indonesia; **tidak ada** data tersimpan.
- [ ] Nomor WA yang sama dipakai dua kali → hanya **1** customer.
- [ ] Mengubah harga produk setelah memesan **tidak** mengubah `unit_price_snapshot` pesanan lama.
- [ ] Produk "Harga via WhatsApp" → `total_amount` = `null`, pesanan tetap tersimpan.
- [ ] Jika penyimpanan item gagal, order juga batal (transaksi).
- [ ] Lebih dari 10 kiriman per menit dari IP yang sama → ditolak (429).

**Test (`tests/Feature/PlaceOrderTest.php`):** semua kriteria di atas (pakai factory dari US-09). Gunakan `Product::factory()`. Untuk redirect, cek `assertRedirectContains('/pesanan/AWF-')`.

**Prompt OpenCode:**
```text
Baca doc/SPRINT_2_WORK_DISTRIBUTION.md bagian 2, 4 (seluruhnya), dan "US-12".
Baca PRD_Florify.md bagian 4.2, 5.2, 6, 9.1. Baca app/Models/*.php, app/Enums/*.php,
app/Support/ReferenceNumber.php, database/factories/*, routes/web.php.

Kerjakan US-12 (backend saja, tanpa halaman React):
- app/Http/Requests/Public/StoreOrderRequest.php dengan aturan validasi bagian 4.6 dan pesan Bahasa Indonesia.
- app/Actions/PlaceOrder.php: simpan customer, order, order item dalam DB::transaction, snapshot nama dan
  harga, nomor pesanan dari ReferenceNumber, status awal menunggu_konfirmasi dan belum_dibayar.
- app/Http/Controllers/Public/OrderController.php method store, redirect ke URL::signedRoute('orders.confirmation', $order).
- Tambahkan rute POST di bawah penanda "US-12" di routes/web.php sesuai tabel 4.3.
- tests/Feature/PlaceOrderTest.php untuk semua kriteria selesai US-12.
Catatan: rute orders.confirmation dibuat Nabila di US-14. Jika belum ada di main, test redirect
akan gagal; itu wajar, tunggu US-14 di-merge lalu jalankan ulang.
Jangan menambah paket. Jangan mengubah model/migration (milik Latif). Jangan menjalankan perintah git.
Jalankan php artisan test dan laporkan hasilnya.
```

**Git (Suci):**
```bash
git switch main
git pull origin main                      # pastikan US-09 sudah ada
git switch -c feature/suci-us12-simpan-pesanan

# ... kerjakan ...

php artisan test && npm run check && npm run types:check

git add app/Http/Requests/Public/StoreOrderRequest.php app/Actions/PlaceOrder.php
git commit -m "feat(pesanan): validasi dan penyimpanan pesanan dalam transaksi (US-12)"
git add app/Http/Controllers/Public/OrderController.php routes/web.php
git commit -m "feat(pesanan): rute simpan pesanan (US-12)"
git add tests/Feature/PlaceOrderTest.php
git commit -m "test(pesanan): uji simpan pesanan dan nomor unik (US-12)"
git push -u origin feature/suci-us12-simpan-pesanan
```
PR: **`US-12: Simpan pesanan dan nomor pesanan unik`**. Tulis di deskripsi PR: *"Merge setelah US-14."* Jika US-14 sudah di-merge saat kamu selesai:
```bash
git fetch origin
git merge origin/main
php artisan test
git push
```

---

### US-13 — Halaman formulir pemesanan produk (Suci)

**Story:** Sebagai pelanggan, saya ingin mengisi formulir pemesanan produk agar detail pesanan tercatat lengkap.
**Prioritas:** Must · **SP:** 3 · **Butuh:** US-10, US-12
**PRD:** FR-13, FR-14, NFR-10, §10.2 no.5

**Yang dibuat/diubah:**

| File | Isi |
|---|---|
| `OrderController@create(Product $product)` | 404 jika nonaktif; render `public/order-create` dengan `product` (`toCatalogArray()`). |
| `routes/web.php` | di bawah penanda US-13: `Route::get('pesan/{product:slug}', [OrderController::class, 'create'])->name('orders.create');` |
| `resources/js/pages/public/order-create.tsx` | `PageHeader` (Beranda › Katalog › nama produk › Pesan). Kiri: ringkasan produk (`ProductImage`, nama, `PriceLabel`). Kanan: `<Form {...store.form(product.slug)}>` dengan `FormField` untuk: Nama, Nomor WhatsApp (`type="tel"`, `inputMode="tel"`, `autoComplete="tel"`), Jumlah (`type="number"`, 1–50, awal 1), Tanggal dibutuhkan (`type="date"`, min hari ini), Catatan (textarea, opsional). Tombol `BrandButton` "Kirim Pesanan" (nonaktif + teks "Mengirim…" saat `processing`). Galat dari `errors`. `Notice`: "Pesanan baru dianggap pasti setelah admin mengonfirmasi detail dan harga." |
| `pages/public/product-detail.tsx` | untuk produk **bukan** custom: tombol utama jadi `BrandButton` **"Pesan Sekarang"** → `orders.create`; tombol WhatsApp tetap ada sebagai `variant="secondary"` "Tanya via WhatsApp". (Koordinasi dengan Latif karena file ini juga diubah di US-10.) |

`store` diimpor dari `@/routes/orders` (hasil Wayfinder setelah rute ada).

**Kriteria selesai:**
- [ ] Dari detail produk → "Pesan Sekarang" → formulir → kirim → halaman konfirmasi.
- [ ] Kirim kosong → galat muncul di bawah setiap kolom, isian lain tidak hilang.
- [ ] Semua kolom punya label; bisa diisi hanya dengan keyboard.
- [ ] Rapi di 320, 375, 768, 1440 px.

**Test (`tests/Feature/OrderFormTest.php`):** halaman formulir 200 + komponen `public/order-create` + prop `product.slug` · 404 untuk produk nonaktif.

**Prompt OpenCode:**
```text
Baca doc/SPRINT_2_WORK_DISTRIBUTION.md bagian 4 dan "US-13".
Baca resources/js/pages/auth/login.tsx (contoh pola <Form>), resources/js/components/florify/form-field.tsx,
brand-button.tsx, product-image.tsx, product-meta.tsx, page-header.tsx, empty-state.tsx,
resources/js/pages/public/product-detail.tsx, app/Http/Controllers/Public/OrderController.php, routes/web.php.

Kerjakan US-13:
- method create di OrderController dan rute GET di bawah penanda "US-13" sesuai tabel 4.3.
- resources/js/pages/public/order-create.tsx sesuai tabel US-13, memakai <Form {...store.form(product.slug)}>
  dari @inertiajs/react dan FormField untuk setiap kolom, galat dari errors.
- Ubah tombol di product-detail.tsx untuk produk non-custom: "Pesan Sekarang" ke orders.create,
  WhatsApp jadi tombol secondary "Tanya via WhatsApp". Jangan ubah bagian produk custom.
- tests/Feature/OrderFormTest.php.
Pakai token design system, jangan warna hex, jangan tambah paket. Jangan menjalankan perintah git.
Jalankan php artisan test, npm run check, npm run types:check, lalu laporkan hasilnya.
```

**Git (Suci):**
```bash
git switch main && git pull origin main  # pastikan US-10 dan US-12 sudah ada
git switch -c feature/suci-us13-form-pesanan
# ... kerjakan ...
php artisan test && npm run check && npm run types:check
git add app/Http/Controllers/Public/OrderController.php routes/web.php
git commit -m "feat(pesanan): rute halaman formulir pesanan (US-13)"
git add resources/js/pages/public/order-create.tsx resources/js/pages/public/product-detail.tsx
git commit -m "feat(pesanan): halaman formulir pemesanan produk (US-13)"
git add tests/Feature/OrderFormTest.php
git commit -m "test(pesanan): uji halaman formulir pesanan (US-13)"
git push -u origin feature/suci-us13-form-pesanan
```
PR: **`US-13: Formulir pemesanan produk`**.

---

### US-14 — Halaman konfirmasi pesanan & WhatsApp lanjutan (Nabila)

**Story:** Sebagai pelanggan, saya ingin melihat konfirmasi dan nomor pesanan setelah mengirim, lalu lanjut chat WhatsApp.
**Prioritas:** Must · **SP:** 3 · **Butuh:** US-09 (tidak menunggu Suci, cukup pakai factory)
**PRD:** FR-18, FR-23, §5.2, §6 no.11, §10.2 no.6, §11 (data pelanggan tidak terlihat orang lain)

**Yang dibuat:**

| File | Isi |
|---|---|
| `app/Http/Controllers/Public/OrderConfirmationController.php` | invokable `__invoke(Order $order)`; muat `customer` & `items`; render `public/order-confirmation` dengan `order` berbentuk `OrderSummary` (§4.4). Nomor WA disamarkan: 4 digit awal + `****` + 4 digit akhir. Harga dikirim sebagai `int` atau `null`. |
| `routes/web.php` | di bawah penanda US-14: `Route::get('pesanan/{order:order_number}', OrderConfirmationController::class)->middleware('signed')->name('orders.confirmation');` |
| `resources/js/types/florify.ts` | tambah tipe `OrderSummary` (§4.4). |
| `resources/js/lib/whatsapp.ts` | tambah `orderFollowUpMessage(order: OrderSummary): string`, berisi "Halo AweFlorist, saya sudah mengirim pesanan nomor AWF-…" + daftar item + tanggal. |
| `resources/js/pages/public/order-confirmation.tsx` | `PageHeader` judul "Pesanan terkirim". Kotak besar berisi **nomor pesanan** (font display, mudah disalin, plus tombol "Salin" memakai `navigator.clipboard`). Ringkasan: nama, nomor WA tersamar, tanggal dibutuhkan, item (nama × jumlah, `formatRupiah` atau "Harga via WhatsApp"), total (atau "Dikonfirmasi admin"), status pesanan & pembayaran (**teks**, bukan hanya warna). `Notice`: "Pesanan belum pasti sampai admin mengonfirmasi detail dan harga." Tombol `WhatsAppButton` "Lanjutkan di WhatsApp" dengan `orderFollowUpMessage`. Tombol `outline` "Kembali ke katalog". |

**Kriteria selesai:**
- [ ] URL bertanda tangan → halaman tampil lengkap.
- [ ] URL tanpa tanda tangan atau yang diubah → **403**.
- [ ] Nomor WA pelanggan tidak tampil lengkap.
- [ ] Tombol WhatsApp berisi nomor pesanan.
- [ ] Rapi di ponsel dan desktop.

**Test (`tests/Feature/OrderConfirmationTest.php`):** buat order lewat factory → `URL::signedRoute(...)` → 200 + komponen `public/order-confirmation` + `order.orderNumber` benar · URL tanpa signature → 403 · nomor WA tersamar · produk harga null → `totalAmount` null.

**Prompt OpenCode:**
```text
Baca doc/SPRINT_2_WORK_DISTRIBUTION.md bagian 2, 4, dan "US-14".
Baca app/Models/Order.php, OrderItem.php, Customer.php, app/Enums/*.php, database/factories/*,
routes/web.php, resources/js/lib/whatsapp.ts, resources/js/lib/format.ts, resources/js/types/florify.ts,
resources/js/components/florify/page-header.tsx, whatsapp-button.tsx, brand-button.tsx, empty-state.tsx.

Kerjakan US-14:
- app/Http/Controllers/Public/OrderConfirmationController.php (invokable) yang mengirim prop order
  berbentuk OrderSummary persis seperti bagian 4.4, nomor WA disamarkan.
- Rute GET bermiddleware 'signed' di bawah penanda "US-14" di routes/web.php sesuai tabel 4.3.
- Tipe OrderSummary di resources/js/types/florify.ts dan fungsi orderFollowUpMessage di resources/js/lib/whatsapp.ts.
- resources/js/pages/public/order-confirmation.tsx sesuai tabel US-14 memakai komponen yang ada.
- tests/Feature/OrderConfirmationTest.php memakai factory (jangan menunggu fitur simpan pesanan).
Jangan mengubah model/migration. Jangan menambah paket. Jangan menjalankan perintah git.
Jalankan php artisan test, npm run check, npm run types:check, lalu laporkan hasilnya.
```

**Git (Nabila):**
```bash
git switch main
git pull origin main                      # pastikan US-09 sudah ada
git switch -c feature/nabila-us14-konfirmasi

# ... kerjakan ...

php artisan test && npm run check && npm run types:check

git add app/Http/Controllers/Public/OrderConfirmationController.php routes/web.php
git commit -m "feat(konfirmasi): rute konfirmasi pesanan bertanda tangan (US-14)"
git add resources/js/types/florify.ts resources/js/lib/whatsapp.ts resources/js/pages/public/order-confirmation.tsx
git commit -m "feat(konfirmasi): halaman konfirmasi dan WhatsApp lanjutan (US-14)"
git add tests/Feature/OrderConfirmationTest.php
git commit -m "test(konfirmasi): uji halaman konfirmasi pesanan (US-14)"
git push -u origin feature/nabila-us14-konfirmasi
```
PR: **`US-14: Halaman konfirmasi pesanan`**. Kabari Suci begitu di-merge.

---

### US-15 — Permintaan buket custom tersimpan (Prety)

**Story:** Sebagai pelanggan, saya ingin permintaan buket custom saya tersimpan agar admin bisa menindaklanjuti.
**Prioritas:** Must · **SP:** 5 · **Butuh:** US-09
**PRD:** FR-19, FR-20, FR-22, FR-23, §3.2, §5.4, §6 no.6

**Yang dibuat/diubah:**

| File | Isi |
|---|---|
| `app/Http/Requests/Public/StoreCustomRequestRequest.php` | aturan §4.6 untuk `name`, `phone`, `bouquet_type` (harus ada di daftar), `budget`, `theme_color`, `needed_at`, `notes`, `product` (opsional, slug produk aktif). Pesan Bahasa Indonesia. |
| `app/Http/Controllers/Public/CustomRequestController.php` | `create(Request)`: render `public/custom-bouquet` dengan `bouquetTypes` (nama kategori dari DB kecuali "Buket Custom", plus "Lainnya (jelaskan di catatan)") dan `reference` (jika ada `?produk=<slug>` yang aktif). `store()`: dalam transaksi, cari/buat customer → buat `CustomRequest` (`request_number` dari `ReferenceNumber` prefix `CST`, status `baru`, `product_id` dari referensi) → redirect `URL::signedRoute('custom.confirmation', $customRequest)`. `confirmation(CustomRequest)`: render `public/custom-confirmation` dengan `CustomRequestSummary`. |
| `routes/web.php` | di bawah penanda US-15: ganti `Route::inertia('buket-custom', …)` dengan 3 rute di tabel §4.3 (nama `custom` **tetap**). |
| `resources/js/components/florify/custom-bouquet-form.tsx` | ubah dari "buka WhatsApp" menjadi `<Form {...store.form()}>` (dari `@/routes/custom`). Tambah kolom **Nama** dan **Nomor WhatsApp** di paling atas. Pilihan jenis buket dari prop `bouquetTypes`. Hidden input `product` jika ada referensi. Galat dari `errors`. Tombol "Kirim Permintaan". Hapus validasi manual di browser (server yang memvalidasi). |
| `pages/public/custom-bouquet.tsx` | terima props `bouquetTypes`, `reference`; tampilkan "Model acuan: …" jika ada. |
| `pages/public/product-detail.tsx` (bagian custom saja) | ganti formulir di halaman detail produk custom dengan tombol `BrandButton` **"Isi Formulir Custom"** → `custom({ query: { produk: product.slug } })`. Koordinasi dengan Latif. |
| `pages/public/custom-confirmation.tsx` | mirip konfirmasi pesanan: nomor permintaan besar + tombol Salin, ringkasan, `Notice` "Permintaan custom belum menjadi pesanan sampai detail dan harga disepakati.", `WhatsAppButton` dengan `customRequestFollowUpMessage`. |
| `resources/js/types/florify.ts` | tambah `CustomRequestSummary` (§4.4). |
| `resources/js/lib/whatsapp.ts` | tambah `customRequestFollowUpMessage(summary)`. Hapus `customRequestMessage` dan `CustomRequest` jika tidak dipakai lagi. |
| `resources/js/static/main.tsx` | kirim `bouquetTypes` contoh & `reference: null` ke `<CustomBouquet />` agar `types:check` lulus (formulir di versi statis tidak bisa mengirim; itu wajar). |
| `resources/js/data/info.ts` | perbarui langkah pemesanan & FAQ ke alur baru: isi formulir → dapat nomor → admin konfirmasi lewat WhatsApp. |

**Kriteria selesai:**
- [ ] Data valid → 1 `custom_requests` tersimpan dengan status `baru` dan nomor `CST-…`; redirect ke konfirmasi bertanda tangan.
- [ ] Data tidak valid → galat di bawah kolom, tidak ada data tersimpan.
- [ ] Dari detail produk custom → formulir menampilkan "Model acuan" dan `product_id` tersimpan.
- [ ] URL konfirmasi tanpa tanda tangan → 403.
- [ ] Teks halaman tidak menyatakan permintaan sebagai pesanan final.

**Test (`tests/Feature/CustomRequestTest.php`):** halaman create mengirim `bouquetTypes` · simpan valid · galat validasi · referensi produk tersimpan · nomor WA sama → 1 customer · konfirmasi 200 dengan signature & 403 tanpa · `bouquet_type` di luar daftar ditolak.

**Prompt OpenCode:**
```text
Baca doc/SPRINT_2_WORK_DISTRIBUTION.md bagian 2, 4 (seluruhnya), dan "US-15".
Baca PRD_Florify.md bagian 3.2, 4.2, 5.4, 6. Baca app/Models/*.php, app/Enums/*.php,
app/Support/ReferenceNumber.php, database/factories/*, routes/web.php,
resources/js/components/florify/custom-bouquet-form.tsx, form-field.tsx,
resources/js/pages/public/custom-bouquet.tsx, product-detail.tsx, resources/js/pages/auth/login.tsx,
resources/js/lib/whatsapp.ts, resources/js/types/florify.ts, resources/js/static/main.tsx, resources/js/data/info.ts.

Kerjakan US-15 persis sesuai tabel di bagian US-15:
- StoreCustomRequestRequest, CustomRequestController (create, store, confirmation), 3 rute di bawah
  penanda "US-15" (nama rute 'custom' tetap).
- Ubah custom-bouquet-form.tsx menjadi <Form {...store.form()}> dengan kolom Nama dan Nomor WhatsApp
  tambahan, pilihan jenis buket dari prop bouquetTypes, galat dari server.
- Halaman custom-confirmation.tsx, tipe CustomRequestSummary, fungsi customRequestFollowUpMessage.
- Di product-detail.tsx HANYA bagian produk custom: ganti formulir dengan tombol ke /buket-custom?produk=<slug>.
- Perbarui static/main.tsx agar types:check lulus, dan data/info.ts ke alur baru.
- tests/Feature/CustomRequestTest.php.
Jangan mengubah model/migration. Jangan menambah paket. Jangan menjalankan perintah git.
Jalankan php artisan test, npm run check, npm run types:check, npm run build:static, lalu laporkan hasilnya.
```

**Git (Prety):**
```bash
git switch main
git pull origin main                      # pastikan US-09 sudah ada
git switch -c feature/prety-us15-custom-simpan

# ... kerjakan ...

php artisan test && npm run check && npm run types:check && npm run build:static

git add app/Http/Requests/Public/StoreCustomRequestRequest.php app/Http/Controllers/Public/CustomRequestController.php routes/web.php
git commit -m "feat(custom): simpan permintaan buket custom (US-15)"
git add resources/js/components/florify/custom-bouquet-form.tsx resources/js/pages/public/custom-bouquet.tsx resources/js/pages/public/custom-confirmation.tsx resources/js/pages/public/product-detail.tsx
git commit -m "feat(custom): formulir terhubung server dan halaman konfirmasi (US-15)"
git add resources/js/types/florify.ts resources/js/lib/whatsapp.ts resources/js/static/main.tsx resources/js/data/info.ts
git commit -m "feat(custom): tipe, pesan WhatsApp, dan info alur baru (US-15)"
git add tests/Feature/CustomRequestTest.php
git commit -m "test(custom): uji permintaan buket custom (US-15)"
git push -u origin feature/prety-us15-custom-simpan
```
PR: **`US-15: Permintaan buket custom tersimpan`**.

---

### US-16 — Gambar referensi buket custom (Prety)

**Story:** Sebagai pelanggan, saya ingin melampirkan gambar referensi buket custom.
**Prioritas:** Should · **SP:** 2 · **Butuh:** US-15
**PRD:** FR-21, NFR-06, §5.4, §11

**Yang dibuat/diubah:**
- `StoreCustomRequestRequest`: kolom `reference_image` opsional, aturan §4.6.
- `CustomRequestController@store`: simpan file dengan `$file->store('custom-references', 'public')` (nama acak dari Laravel, **bukan** nama asli file), isi `reference_image_path`.
- `custom-bouquet-form.tsx`: `FormField` "Gambar referensi (opsional)" dengan `<input type="file" accept="image/jpeg,image/png,image/webp">` dan hint "JPG, PNG, atau WEBP, maksimal 2 MB". Inertia otomatis mengirim sebagai multipart.
- `custom-confirmation.tsx`: tampilkan "Gambar referensi terlampir" jika `hasReferenceImage`.
- `README.md`: tambahkan `php artisan storage:link` di langkah setup manual. (Beri tahu Rofiq.)

**Kriteria selesai:**
- [ ] JPG/PNG/WEBP ≤ 2 MB tersimpan di `storage/app/public/custom-references/`.
- [ ] File > 2 MB, PDF, atau file berekstensi `.jpg` padahal bukan gambar → ditolak dengan pesan jelas.
- [ ] Tanpa gambar tetap bisa kirim.

**Test (tambah ke `CustomRequestTest.php`):** pakai `Storage::fake('public')` dan `UploadedFile::fake()->image('ref.jpg')` · file terlalu besar ditolak · tipe salah ditolak · path tersimpan.

**Prompt OpenCode:**
```text
Baca doc/SPRINT_2_WORK_DISTRIBUTION.md bagian 4.6 dan "US-16".
Baca app/Http/Requests/Public/StoreCustomRequestRequest.php, app/Http/Controllers/Public/CustomRequestController.php,
resources/js/components/florify/custom-bouquet-form.tsx, resources/js/pages/public/custom-confirmation.tsx,
tests/Feature/CustomRequestTest.php.
Kerjakan US-16: unggah gambar referensi opsional (jpg, jpeg, png, webp, maks 2 MB) ke disk public folder
custom-references dengan nama acak, simpan path ke reference_image_path, tampilkan kolom file di formulir,
dan tambah test memakai Storage::fake dan UploadedFile::fake.
Jangan menambah paket. Jangan menjalankan perintah git.
Jalankan php artisan test, npm run check, npm run types:check, lalu laporkan hasilnya.
```

**Git (Prety):**
```bash
git switch main && git pull origin main  # pastikan US-15 sudah ada
git switch -c feature/prety-us16-gambar-referensi
# ... kerjakan ...
php artisan test && npm run check && npm run types:check
git add app/Http/Requests/Public/StoreCustomRequestRequest.php app/Http/Controllers/Public/CustomRequestController.php
git commit -m "feat(custom): validasi dan simpan gambar referensi (US-16)"
git add resources/js/components/florify/custom-bouquet-form.tsx resources/js/pages/public/custom-confirmation.tsx README.md
git commit -m "feat(custom): kolom unggah gambar referensi (US-16)"
git add tests/Feature/CustomRequestTest.php
git commit -m "test(custom): uji unggah gambar referensi (US-16)"
git push -u origin feature/prety-us16-gambar-referensi
```
PR: **`US-16: Gambar referensi buket custom`**.

---

### US-17 — Pengujian alur & data asli toko (Nabila)

**Story:** Sebagai Product Owner, saya ingin alur pemesanan diuji dan datanya sesuai toko agar siap didemokan.
**Prioritas:** Must · **SP:** 3 · **Butuh:** US-10, US-12, US-13, US-14, US-15
**PRD:** §12 DoD Sprint 2, §13.2, §13.3, §15

**Yang dikerjakan:**

1. **Jawab pertanyaan PRD §15** bersama pemilik toko. Jawaban dicatat di file `doc/sprint-2/uji-penerimaan.md` bagian "Keputusan PO":
   - harga langsung atau "mulai dari" (no.1);
   - diambil sendiri, dikirim, atau keduanya (no.5);
   - batas ukuran dan format gambar referensi (no.6);
   - kebijakan uang muka & pembatalan (no.9).
2. **Data asli:** kirim daftar produk, harga, dan foto asli ke Latif agar `CatalogSeeder` diperbarui (Latif yang mengubah seeder).
3. **Test ujung-ke-ujung** `tests/Feature/Sprint2/OrderFlowTest.php`:
   - pengunjung membuka katalog → detail → formulir → kirim → mengikuti redirect → halaman konfirmasi menampilkan nomor yang sama dengan di database;
   - kirim formulir custom → konfirmasi → data ada di database;
   - input tidak valid tidak menyimpan apa pun (hitung jumlah baris sebelum/sesudah);
   - dua pesanan berturut-turut mendapat nomor berbeda.
4. **Uji manual** di HP sungguhan & desktop, dicatat di `doc/sprint-2/uji-penerimaan.md` dengan tabel: skenario · langkah · hasil diharapkan · hasil nyata · lulus/gagal · catatan. Minimal skenario PRD §13.4 no.1–4.
5. Bug yang ditemukan dilaporkan sebagai **GitHub Issue** (Bagian 6.6) dan ditugaskan ke pemilik story.

**Kriteria selesai:**
- [ ] `OrderFlowTest.php` lulus.
- [ ] `uji-penerimaan.md` terisi, semua skenario Must lulus atau punya Issue.
- [ ] Keputusan PO §15 tercatat.

**Prompt OpenCode:**
```text
Baca doc/SPRINT_2_WORK_DISTRIBUTION.md bagian 1, 4, dan "US-17". Baca PRD_Florify.md bagian 12, 13, 15.
Baca routes/web.php, app/Http/Controllers/Public/*, app/Actions/PlaceOrder.php, app/Models/*, database/factories/*,
tests/Feature/*.
Kerjakan US-17 langkah 3: buat tests/Feature/Sprint2/OrderFlowTest.php dengan skenario yang tertulis
(pakai factory atau seeder, ikuti redirect dengan followingRedirects()).
Lalu buat kerangka doc/sprint-2/uji-penerimaan.md berisi bagian "Keputusan PO" (pertanyaan PRD 15 no.1, 5, 6, 9
dengan jawaban kosong) dan tabel uji manual untuk skenario PRD 13.4 no.1-4.
Jangan mengubah kode aplikasi. Jika test gagal karena bug, laporkan bug-nya, jangan perbaiki sendiri.
Jangan menjalankan perintah git. Jalankan php artisan test dan laporkan hasilnya.
```

**Git (Nabila):**
```bash
git switch main && git pull origin main  # setelah US-12, 13, 14, 15 di-merge
git switch -c feature/nabila-us17-pengujian
# ... kerjakan ...
php artisan test
git add tests/Feature/Sprint2/OrderFlowTest.php
git commit -m "test(sprint-2): uji alur pemesanan dan custom ujung-ke-ujung (US-17)"
git add doc/sprint-2/uji-penerimaan.md
git commit -m "docs(sprint-2): keputusan PO dan hasil uji penerimaan (US-17)"
git push -u origin feature/nabila-us17-pengujian
```
PR: **`US-17: Pengujian alur Sprint 2`**.

---

## 6. Git & GitHub — panduan umum

> **Aturan utama:** kamu sendiri yang menjalankan semua perintah Git. OpenCode/AI tidak boleh `add`, `commit`, atau `push`. **Jangan pernah push ke `main`.**

### 6.1 Persiapan (sekali per laptop)

```bash
git config --global user.name "Nama Lengkap"
git config --global user.email "email-github-kamu@contoh.com"

git clone https://github.com/zinexsix/Aweflorist.git
cd Aweflorist
composer setup
```

Sudah punya proyek? Cukup:
```bash
cd Aweflorist
git switch main
git pull origin main
composer install
npm install
php artisan migrate:fresh --seed     # setelah US-09 di-merge; ini MENGHAPUS data lokal lalu mengisi ulang
```

Login GitHub saat `git push` pertama: pakai **Personal Access Token**, bukan password (GitHub → Settings → Developer settings → Personal access tokens → Fine-grained → repo `Aweflorist` → Contents & Pull requests: *Read and write*).

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
php artisan migrate:fresh --seed   # jika ada migration baru
php artisan test
git push
```

**Konflik?**
1. `git status` → lihat file "both modified".
2. Buka file di VS Code → pilih bagian yang benar (sering kali **keduanya**, misalnya di `routes/web.php` dan `types/florify.ts`).
3. Hapus semua tanda `<<<<<<<`, `=======`, `>>>>>>>`.
4. `php artisan test` → `git add <file>` → `git commit` → `git push`.
5. Ragu? Batalkan dengan `git merge --abort`, lalu tanya Rofiq.

### 6.4 Membuat Pull Request di GitHub

1. Buka https://github.com/zinexsix/Aweflorist → muncul tombol **Compare & pull request** untuk branch-mu → klik.
2. **base:** `main` ← **compare:** branch-mu.
3. **Judul:** `US-xx: <judul story>`.
4. **Deskripsi:** salin checklist Bagian 7, isi "Cara menguji".
5. Kanan: **Reviewers** → `Rofiq`. **Assignees** → dirimu.
6. **Create pull request**.
7. Tunggu tanda centang hijau CI ("tests"). Merah? Klik **Details**, baca galatnya, perbaiki di branch yang sama, lalu `git push` lagi (PR otomatis ter-update).

Alternatif dari terminal (jika GitHub CLI `gh` terpasang dan sudah `gh auth login`):
```bash
gh pr create --base main --title "US-xx: <judul>" --body "<isi checklist>" --reviewer <username-rofiq>
gh pr checks          # lihat status CI
gh pr view --web      # buka PR di browser
```

### 6.5 Setelah PR di-merge

```bash
git switch main
git pull origin main
git branch -d feature/<nama>-<us-xx>-<topik>
```
Di GitHub, klik **Delete branch** di halaman PR yang sudah di-merge.

### 6.6 Melaporkan bug (GitHub Issues)

GitHub → tab **Issues** → **New issue**:
- Judul: `[US-xx] <masalah singkat>`
- Isi: langkah mengulang, hasil yang diharapkan, hasil nyata, screenshot, ukuran layar.
- **Assignees:** pemilik story. **Labels:** `bug`.

Perbaikan dikerjakan di branch `fix/<nama>-<masalah>`, PR-nya menulis `Closes #<nomor-issue>`.

### 6.7 Dilarang

| Perintah | Kenapa |
|---|---|
| `git push origin main` / commit di `main` | `main` hanya berubah lewat PR |
| `git push --force` | bisa menghapus pekerjaan orang lain |
| `git reset --hard` | menghapus perubahanmu yang belum di-commit, tanpa bisa kembali |
| `git add .` / `git add -A` | bisa ikut menambah `.env`, `database.sqlite`, file orang lain |
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
2. php artisan migrate:fresh --seed
3. composer dev → buka <URL>
4. Langkah: ...

## Checklist
- [ ] Sesuai kontrak bagian 4 (nama tabel/kolom/rute/props tidak diubah)
- [ ] Hanya mengubah file milik story ini (cek `git diff --stat origin/main`)
- [ ] Validasi di server (FormRequest), pesan galat Bahasa Indonesia
- [ ] Test Pest untuk story ini ditambahkan dan lulus
- [ ] `php artisan test`, `npm run check`, `npm run types:check` lulus
- [ ] Diuji di 375 px dan 1440 px, tanpa scroll horizontal
- [ ] Tidak ada error di Console browser
- [ ] Tidak ada `.env`, password, `database.sqlite`, atau file pribadi
- [ ] Tidak menambah paket npm/composer
- [ ] Kode hasil OpenCode sudah saya baca dan pahami
```

---

## 8. Tugas Rofiq (koordinator)

| Kapan | Tugas |
|---|---|
| Sebelum sprint | Unggah dokumen ini lewat PR, bagikan ke grup, pastikan Suci & Nabila sudah jadi *collaborator* repo dan bisa `composer setup`. |
| Sprint Planning | Sahkan sprint goal & story point bersama Nabila (PO). Isi Jobsheet J-01 Sprint 2. Putuskan US-11/US-16 ikut atau pindah ke Sprint 3. |
| Hari 1 | Review & merge **US-09 hari itu juga**. Umumkan ke grup. |
| Setiap hari | Review PR sesuai **urutan merge 3.3**. Cek tab *Files changed*: hanya file milik story. Jalankan di lokal sebelum merge. |
| Konflik bersama | Bantu menyelesaikan konflik di `routes/web.php`, `types/florify.ts`, `product-detail.tsx`. |
| Hosting | Vercel statis **tidak bisa** menjalankan pesanan/database. Untuk demo Sprint 2, pilih hosting yang mendukung PHP 8.3 + MySQL. Build statis Vercel tetap boleh sebagai demo tampilan Sprint 1. |
| `config/site.ts` | Ubah `isSampleData` jadi `false` setelah data asli dari Nabila masuk seeder. Isi `VITE_WHATSAPP_NUMBER`. |
| Akhir sprint | Pastikan DoD Sprint 2 (Bagian 1) terpenuhi, CI hijau, demo jalan dari `main`. Catat sisa pekerjaan ke backlog Sprint 3 (admin). |

**Perintah review PR di lokal:**
```bash
git fetch origin
git switch <nama-branch-pr>
composer install && npm install
php artisan migrate:fresh --seed
php artisan test && npm run check && npm run types:check
composer dev
# setelah selesai
git switch main
```
Merge lewat tombol **Merge pull request** di GitHub (bukan dari terminal), lalu **Delete branch**.
