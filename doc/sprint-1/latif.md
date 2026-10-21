# Sprint 1 — Tugas Latif (Katalog & Produk)

Peranmu: membuat katalog dan halaman produk yang rapi, lengkap, dan nyaman di ponsel.
User story: **US-04** (kartu produk), **US-05** (katalog responsif), **US-06** (detail produk), **US-07** (tombol WhatsApp), dan produk unggulan dari **US-02**.

Dokumen acuan: [PRD](../../PRD_Florify.md) (bagian 4.1, 5.1) · [Design system](../SPRINT_1_DESIGN_SYSTEM.md) (§3.5 Produk) · [Asset guide](../SPRINT_1_ASSET_GUIDE.md) §4.1 · [Pembagian kerja lengkap](../SPRINT_1_WORK_DISTRIBUTION.md)

> Versi awal semua halamanmu **sudah ada dan sudah berjalan**. Tugasmu menyempurnakan, bukan membuat dari nol.
> Mulai **setelah** Rofiq mengumumkan bahwa PR fondasi sudah di-merge ke `main`.

---

## 1. File yang boleh kamu ubah

| File | Isi |
|---|---|
| `resources/js/pages/public/catalog.tsx` | Halaman `/katalog` |
| `resources/js/pages/public/product-detail.tsx` | Halaman `/katalog/{slug}` |
| `resources/js/components/florify/product-card.tsx` | `ProductCard`, `ProductGrid` |
| `resources/js/components/florify/product-image.tsx` | Foto + placeholder |
| `resources/js/components/florify/product-meta.tsx` | `PriceLabel`, `CategoryBadge` |
| `resources/js/components/home/featured-products-section.tsx` | Produk unggulan di landing page |
| `resources/js/data/products.ts` | Data produk |
| `resources/js/data/catalog.ts` | **Hanya** bagian `categories` (bagian `occasions` milik Prety) |

Perlu mengubah file lain (mis. `brand-button.tsx`, `site.ts`)? Tanya Rofiq di grup dulu.

---

## 2. Daftar tugas (urut)

### Tugas 1 — Siapkan lingkungan (hari 1)
- [ ] Ikuti §4 langkah A (clone/pull, buat branch).
- [ ] Jalankan aplikasi, buka `http://localhost:8000/katalog`, pahami kode `catalog.tsx` dan `product-card.tsx`.

### Tugas 2 — Data produk asli (task jobsheet #10)
- [ ] Minta daftar produk & harga dari Rofiq/PO.
- [ ] Sesuaikan `data/products.ts`: minimal **15 produk**, tiap produk punya `slug` unik (huruf kecil-pakai-tanda-hubung), `name`, `category`, `occasions`, `description`, `price` (atau `null` = "Harga via WhatsApp"; `priceFrom: true` = "Mulai Rp …").
- [ ] Tandai 4 produk unggulan dengan `featured: true`.
- [ ] Jika ada kategori baru yang disetujui PO, tambahkan di `ProductCategorySlug` (`types/florify.ts`, minta izin Rofiq) dan `categories` di `data/catalog.ts`.
- [ ] Jangan mengarang harga. Jika belum pasti, biarkan data contoh (catatan "data contoh" tetap tampil).

### Tugas 3 — Filter kategori & pencarian di katalog (task #12, FR-07, FR-08, FR-11)
- [ ] Tambahkan chip filter dari `categories` + chip "Semua": pakai `BrandButton` (`variant="primary"` saat aktif, `variant="outline"` saat tidak), atribut `aria-pressed`, `type="button"`.
- [ ] Tambahkan input pencarian nama produk dengan `<label>` yang terlihat, tinggi minimal `min-h-tap`, border `border-line`, `rounded-full`.
- [ ] Filter URL yang sudah ada (`/katalog?kategori=buket-uang`, `/katalog?acara=wisuda`) **harus tetap berfungsi**, karena kartu kategori di landing page memakainya.
- [ ] Jika tidak ada hasil → `EmptyState` dengan tombol "Tampilkan semua".
- [ ] Teks "Menampilkan N produk" ikut berubah.

### Tugas 4 — Detail produk (task #13, #14)
- [ ] Tambahkan textarea opsional **"Pesan di kartu ucapan"** (pakai `Label` dari `@/components/ui/label`, maks. 200 karakter).
- [ ] Isi textarea ikut masuk ke pesan WhatsApp: `productOrderMessage(product, note)` (fungsi sudah ada di `lib/whatsapp.ts`).
- [ ] Pastikan tombol "Pesan Sekarang via WhatsApp" membuka WhatsApp dengan nama produk + catatan.
- [ ] Opsional: galeri beberapa foto (lihat mockup `doc/florify-html/detail.html`) — kerjakan hanya jika waktu cukup.

### Tugas 5 — Foto produk (setelah Rofiq menyediakan)
- [ ] Untuk setiap file di `public/images/products/`, ubah `image: null` menjadi `image: '/images/products/<slug>-01.webp'`.
- [ ] Cek setiap path di browser: `http://localhost:8000/images/products/<nama-file>`.

### Tugas 6 — Uji responsif (task #12, US-05)
- [ ] DevTools → Toggle device toolbar: 320, 375, 768, 1024, 1440 px.
- [ ] Grid: 1 kolom (< 420 px) → 2 → 3 (≥ 1024) → 4 (≥ 1280). Tidak ada scroll horizontal, nama produk tidak terpotong.
- [ ] Console (F12) bebas error.

### Tugas 7 — Dokumentasi
- [ ] Jika menambah prop/komponen, perbarui §3.5 di `doc/SPRINT_1_DESIGN_SYSTEM.md` (beri tahu Rofiq karena file itu miliknya).

---

## 3. Kriteria selesai

- ≥ 15 produk tampil dengan foto/placeholder, nama, kategori, harga.
- Filter kategori + pencarian berfungsi; `?kategori=` dan `?acara=` tetap berfungsi; tanpa hasil → EmptyState.
- Detail menampilkan foto, deskripsi, harga; tombol WhatsApp berisi pesan otomatis (nama produk + catatan).
- Rapi di 320 px dan 1440 px. `npm run check`, `npm run types:check`, `php artisan test` lulus.
- Hanya memakai token & komponen design system (tidak ada warna hex baru, tidak ada dependensi baru).

---

## 4. Panduan push

### A. Mulai kerja (sekali, setelah fondasi Rofiq di-merge)

Belum punya proyek di laptop:

```bash
git clone https://github.com/zinexsix/Aweflorist.git
cd Aweflorist
git config --global user.name "<Nama Lengkap>"
git config --global user.email "<email-github>"
composer setup
```

Sudah punya:

```bash
cd Aweflorist
git switch main
git pull origin main
```

Lalu buat branch milikmu:

```bash
git switch -c feature/latif-product-catalog
npm install
composer dev               # buka http://localhost:8000/katalog
```

### B. Setiap selesai satu bagian

```bash
git status                 # pastikan hanya file milikmu yang berubah
git diff                   # baca perubahanmu (tekan q untuk keluar)
npm run check && npm run types:check && php artisan test

git add resources/js/pages/public/catalog.tsx
git commit -m "feat(katalog): tambah chip filter kategori dan pencarian"
git push -u origin feature/latif-product-catalog     # -u hanya saat push PERTAMA
```

Commit berikutnya:

```bash
git add resources/js/pages/public/product-detail.tsx
git commit -m "feat(detail): catatan kartu ucapan ikut ke pesan WhatsApp"
git push

git add resources/js/data/products.ts
git commit -m "feat(produk): sesuaikan data produk dengan katalog AweFlorist"
git push
```

### C. Hari berikutnya / jika `main` sudah berubah

```bash
git switch feature/latif-product-catalog
git fetch origin
git merge origin/main      # jika konflik: lihat Pembagian kerja §D.1, JANGAN reset --hard
git push
```

### D. Buat Pull Request

GitHub `zinexsix/Aweflorist` → **Compare & pull request** → base `main` ← compare `feature/latif-product-catalog` → salin checklist dari [Pembagian kerja §F](../SPRINT_1_WORK_DISTRIBUTION.md) → reviewer: **Rofiq** → **Create pull request**.

### E. Setelah PR di-merge

```bash
git switch main
git pull origin main
git branch -d feature/latif-product-catalog
```

**Jangan pernah:** push ke `main`, `git push --force`, `git reset --hard`, `git add .` (bisa ikut menambahkan file orang lain atau `.env`).

---

## 5. Prompt OpenCode (opsional)

OpenCode hanya alat bantu. Kalau tidak bisa dipakai, kerjakan manual dengan meniru pola di `catalog.tsx` yang sudah ada. Selalu cek `git diff` sebelum commit, dan commit/push sendiri.

**Filter & pencarian:**

```text
Kamu membantu proyek Florify (Laravel 13 + Inertia + React 19 + TypeScript + Tailwind 4).
Jangan mengganti framework dan jangan menambah dependensi.
1. Baca: PRD_Florify.md (4.1 FR-07, FR-08, FR-11), doc/SPRINT_1_DESIGN_SYSTEM.md, doc/sprint-1/latif.md.
2. Baca: resources/js/pages/public/catalog.tsx, resources/js/data/catalog.ts, resources/js/data/products.ts,
   resources/js/components/florify/brand-button.tsx, resources/js/components/florify/empty-state.tsx.
3. Tugas: di catalog.tsx tambahkan chip filter kategori (BrandButton primary saat aktif, outline saat tidak,
   aria-pressed) dan input pencarian nama dengan <label> terlihat. Filter URL ?kategori= dan ?acara=
   harus tetap berfungsi. Tanpa hasil tampilkan EmptyState.
4. HANYA ubah resources/js/pages/public/catalog.tsx.
5. Pakai class token design system, jangan warna hex. Tinggi elemen klik minimal min-h-tap.
6. Laporkan file yang berubah dan cara mengujinya. Jangan menjalankan git commit atau git push.
```

**Catatan kartu ucapan:**

```text
Proyek Florify (Laravel + Inertia + React + TS + Tailwind 4). Baca doc/SPRINT_1_DESIGN_SYSTEM.md,
doc/sprint-1/latif.md, resources/js/pages/public/product-detail.tsx, dan resources/js/lib/whatsapp.ts.
Tambahkan textarea opsional "Pesan di kartu ucapan" (Label dari @/components/ui/label, maks. 200 karakter,
border-line, rounded-card) di halaman detail. Isinya ikut ke pesan WhatsApp lewat productOrderMessage(product, note).
Hanya ubah product-detail.tsx. Jangan menambah dependensi. Laporkan file yang berubah dan cara menguji.
Jangan menjalankan git commit atau git push.
```
