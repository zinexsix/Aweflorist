# Tugas Latif — Katalog & Produk

Kamu mengerjakan halaman **katalog** dan **detail produk**.
Story yang kamu pegang: US-04 (kartu produk), US-05 (katalog di ponsel), US-06 (detail produk), US-07 (tombol WhatsApp).

Semua halaman ini **sudah jadi dan sudah jalan**. Tugasmu melengkapi dan merapikan, bukan membuat dari awal.

Bacaan sebelum mulai (10 menit):
- [Design system](../SPRINT_1_DESIGN_SYSTEM.md) — bagian 3.5 (komponen produk)
- [Panduan gambar](../SPRINT_1_ASSET_GUIDE.md)

---

## 1. Kondisi sekarang (sudah ada di `main`)

- Landing page, katalog, detail produk, dan halaman buket custom sudah jalan.
- Ada 16 produk contoh. Semua sudah punya foto, tapi itu **foto sementara** (6 foto dipakai berulang, belum cocok dengan nama produk).
- Produk kategori **Buket Custom** otomatis menampilkan formulir custom di halaman detailnya. Formulir itu bukan milikmu, jangan diubah.

## 2. File yang boleh kamu ubah

| File | Isinya |
|---|---|
| `resources/js/pages/public/catalog.tsx` | Halaman katalog |
| `resources/js/pages/public/product-detail.tsx` | Halaman detail (hanya bagian produk biasa, bukan bagian custom) |
| `resources/js/components/florify/product-card.tsx` | Kartu produk |
| `resources/js/components/florify/product-image.tsx` | Foto produk |
| `resources/js/components/florify/product-meta.tsx` | Harga dan label kategori |
| `resources/js/components/home/featured-products-section.tsx` | Produk unggulan di beranda |
| `resources/js/data/products.ts` | Data produk |
| `resources/js/data/catalog.ts` | Hanya bagian `categories` |

File di luar daftar ini: tanya Rofiq dulu.

---

## 3. Yang harus dikerjakan (urut)

### Tugas 1 — Siapkan laptop
Ikuti bagian 5 langkah A. Lalu jalankan `composer dev` dan buka http://localhost:8000/katalog.

### Tugas 2 — Data produk asli
- [ ] Minta daftar produk dan harga asli ke Rofiq.
- [ ] Ubah `resources/js/data/products.ts`: minimal **15 produk**, tiap produk punya `slug` unik, nama, kategori, deskripsi, dan harga.
- [ ] Harga belum pasti? Isi `price: null` (tampil "Harga via WhatsApp"). Jangan mengarang harga.
- [ ] Tandai 4 produk andalan dengan `featured: true`.

### Tugas 3 — Filter dan pencarian di katalog
Kerjakan di `catalog.tsx`.
- [ ] Tombol filter kategori: "Semua" dan tiap kategori dari `categories`. Pakai `BrandButton` (`primary` untuk yang aktif, `outline` untuk yang lain) dan tambah `aria-pressed`.
- [ ] Kotak pencarian nama produk, dengan label yang terlihat.
- [ ] Filter lewat alamat (`/katalog?kategori=buket-uang` dan `?acara=wisuda`) **harus tetap jalan**, karena kartu di beranda memakainya.
- [ ] Kalau tidak ada hasil, tampilkan `EmptyState`.

### Tugas 4 — Detail produk biasa
Kerjakan di `product-detail.tsx`, bagian produk biasa saja (bagian `buket-custom` jangan disentuh).
- [ ] Tambah kolom "Pesan di kartu ucapan" (boleh kosong, maksimal 200 huruf).
- [ ] Isinya ikut masuk ke pesan WhatsApp lewat `productOrderMessage(product, catatan)` (fungsi ini sudah ada di `lib/whatsapp.ts`).

### Tugas 5 — Ganti foto sementara
Kalau Rofiq sudah memberi foto asli:
- [ ] Simpan di `public/images/products/` dengan nama `<slug>-01.webp`.
- [ ] Ubah `image` produk itu di `products.ts` ke path baru.
- [ ] Cek di browser: `http://localhost:8000/images/products/<nama-file>`.

### Tugas 6 — Uji
- [ ] Buka katalog di lebar 320, 375, 768, dan 1440 px (F12 → ikon ponsel).
- [ ] Tidak ada geser kanan-kiri, nama produk tidak terpotong.
- [ ] Tidak ada tulisan merah di Console (F12).
- [ ] Jalankan: `npm run check`, `npm run types:check`, `php artisan test`. Semua harus lulus.

---

## 4. Selesai kalau

- 15 produk atau lebih tampil lengkap (foto, nama, kategori, harga).
- Filter dan pencarian jalan, alamat `?kategori=` dan `?acara=` tetap jalan.
- Tombol WhatsApp di detail membawa nama produk dan catatan.
- Rapi di ponsel dan desktop, tiga perintah uji lulus.
- Tidak ada warna atau paket baru yang ditambah sendiri.

---

## 5. Git — semua kamu jalankan sendiri

Tidak ada yang push untukmu. **Jangan push ke `main`.** Selalu lewat branch lalu Pull Request.

### A. Mulai (sekali)

Belum punya proyek:
```bash
git clone https://github.com/zinexsix/Aweflorist.git
cd Aweflorist
composer setup
```

Sudah punya proyek:
```bash
cd Aweflorist
git switch main
git pull origin main
npm install
```

Lalu buat branch milikmu:
```bash
git switch -c feature/latif-product-catalog
```

### B. Setiap selesai satu bagian

```bash
git status                  # lihat file apa saja yang berubah
git diff                    # baca perubahannya (tekan q untuk keluar)
npm run check
npm run types:check
php artisan test
```

Kalau semua lulus, simpan:
```bash
git add resources/js/pages/public/catalog.tsx
git commit -m "feat(katalog): tambah filter kategori dan pencarian"
git push -u origin feature/latif-product-catalog
```
`-u` hanya dipakai saat push **pertama**. Setelah itu cukup `git push`.

Tambah satu file per commit, ganti nama file dan pesannya sesuai yang kamu ubah. **Jangan** pakai `git add .`.

> Jika `git status` menampilkan `package-lock.json` berubah dan kamu tidak menambah paket, batalkan: `git restore package-lock.json`.

### C. Kalau `main` sudah berubah (misalnya PR Prety sudah masuk)

```bash
git fetch origin
git merge origin/main
git push
```
Kalau ada konflik, jangan panik dan jangan pakai `reset --hard`. Kabari Rofiq di grup.

### D. Buat Pull Request

1. Buka https://github.com/zinexsix/Aweflorist
2. Klik **Compare & pull request** pada branch milikmu.
3. Base: `main`. Compare: `feature/latif-product-catalog`.
4. Isi: apa yang diubah, dan cara mengujinya.
5. Klik **Create pull request**, lalu minta **Rofiq** me-review.

### E. Setelah PR di-merge

```bash
git switch main
git pull origin main
git branch -d feature/latif-product-catalog
```

### Dilarang
`git push --force`, `git reset --hard`, `git add .`, dan push ke `main`.

---

## 6. Kalau memakai OpenCode (boleh, tidak wajib)

OpenCode hanya membantu menulis kode. **Kamu yang memeriksa hasilnya dan menjalankan semua perintah Git sendiri.** AI tidak boleh menjalankan `git add`, `git commit`, atau `git push`.

Contoh perintah ke OpenCode:
```text
Proyek Laravel + Inertia + React + TypeScript + Tailwind 4. Jangan ganti framework dan jangan tambah paket.
Baca doc/SPRINT_1_DESIGN_SYSTEM.md dan doc/sprint-1/latif.md.
Baca resources/js/pages/public/catalog.tsx, resources/js/data/catalog.ts, dan resources/js/data/products.ts.
Tugas: tambah tombol filter kategori dan kotak pencarian nama di catalog.tsx.
Filter lewat alamat ?kategori= dan ?acara= harus tetap jalan.
Pakai BrandButton dan EmptyState yang sudah ada. Jangan tulis warna hex.
Hanya ubah catalog.tsx. Jangan jalankan perintah git.
Setelah selesai, sebutkan file yang berubah dan cara mengujinya.
```

Setelah AI selesai: cek `git diff`, pastikan hanya file milikmu yang berubah. Kalau ada file lain berubah, batalkan dengan `git restore <nama-file>`.
