# Sprint 1 — Tugas Rofiq (Scrum Master · Koordinator & Integrasi)

Peranmu: menjaga fondasi bersama (design system, layout, rute), menyiapkan aset, me-review & menggabungkan pekerjaan Latif dan Prety, lalu memastikan aplikasi siap demo.

Dokumen acuan: [PRD](../../PRD_Florify.md) · [Design system](../SPRINT_1_DESIGN_SYSTEM.md) · [Asset guide](../SPRINT_1_ASSET_GUIDE.md) · [Pembagian kerja lengkap](../SPRINT_1_WORK_DISTRIBUTION.md)

---

## 1. File yang menjadi tanggung jawabmu

| File/folder | Isi |
|---|---|
| `resources/css/app.css` | Design tokens |
| `resources/js/components/florify/*` (kecuali `product-card.tsx`, `product-image.tsx`, `product-meta.tsx`) | Komponen bersama |
| `resources/js/components/home/hero-section.tsx` | Hero |
| `resources/js/layouts/public-layout.tsx` | Layout publik |
| `resources/js/pages/public/home.tsx` | Susunan landing page |
| `resources/js/config/site.ts` | Info usaha & foto non-produk (Prety boleh mengisi 4 field kontak) |
| `resources/js/lib/*`, `resources/js/types/florify.ts` | WhatsApp, format harga, tipe data |
| `routes/web.php`, `vite.config.ts` | Rute & konfigurasi build |
| `public/images/**` | Semua foto |
| `doc/**`, `README.md` | Dokumentasi |

---

## 2. Daftar tugas (urut)

### Tugas 1 — Push fondasi & buat PR (hari 1, WAJIB PERTAMA)
Latif dan Prety baru bisa mulai setelah ini di-merge.

- [ ] Ikuti langkah §4 di bawah.
- [ ] Minta Latif atau Prety me-review PR.
- [ ] Merge setelah CI hijau, lalu umumkan di grup: "Fondasi sudah di main, silakan mulai."

### Tugas 2 — Kumpulkan data dari Product Owner (hari 1–2)
Kirim daftar pertanyaan ini ke Nabilla (PO) / pemilik AweFlorist:

- [ ] Nomor WhatsApp untuk pemesanan (format `628…`).
- [ ] Daftar produk asli + harga (atau keterangan "mulai dari") → teruskan ke **Latif**.
- [ ] Alamat, jam buka, akun Instagram/TikTok → teruskan ke **Prety**.
- [ ] Cerita singkat usaha, promo yang sedang berjalan (nama, periode, syarat) → **Prety**.
- [ ] Kebijakan: berapa hari sebelum hari H harus pesan, pengiriman/ambil sendiri, metode pembayaran → **Prety** (FAQ).
- [ ] Foto produk, foto toko/tim → **kamu sendiri** (Tugas 3).

### Tugas 3 — Siapkan aset gambar (hari 2–4)
Ikuti [Asset guide](../SPRINT_1_ASSET_GUIDE.md) §2–§6.

- [ ] `public/images/hero/hero-florist.webp` (4:5, 1000×1250, ≤ 250 KB)
- [ ] `public/images/hero/hero-bouquet-best-seller.webp` (1:1, 800×800)
- [ ] `public/images/banners/about-aweflorist.webp` (4:3, 1600×1200)
- [ ] Foto produk `public/images/products/<slug>-01.webp` — minimal 4 produk unggulan dulu, lalu sisanya. Kirim daftar file ke Latif agar ia mengisi field `image`.
- [ ] Isi path hero & about di `resources/js/config/site.ts` → `images`.
- [ ] Push dengan branch `feature/rofiq-assets` (§5).

### Tugas 4 — Nomor WhatsApp
- [ ] Isi `VITE_WHATSAPP_NUMBER=628…` di file `.env` lokal untuk demo (file `.env` **tidak** di-commit).
- [ ] Beri tahu anggota lain nilainya lewat grup agar `.env` mereka sama.

### Tugas 5 — Review & merge PR Latif dan Prety (hari 4–6)
- [ ] Buka PR → tab **Files changed** → pastikan hanya file milik mereka yang berubah.
- [ ] Uji di lokal:
  ```bash
  git fetch origin
  git switch feature/latif-product-catalog     # atau feature/prety-content-sections
  npm run dev                                  # terminal 1
  php artisan serve                            # terminal 2
  ```
- [ ] Cek checklist PR terisi, CI hijau → **Merge pull request**.
- [ ] Kembali: `git switch main && git pull origin main`.
- [ ] Jika kedua PR menyentuh file yang sama, merge satu dulu, lalu minta yang lain menjalankan `git fetch origin && git merge origin/main`.

### Tugas 6 — Uji akhir & demo (hari 6–7)
- [ ] Jalankan checklist integrasi di [Pembagian kerja §H](../SPRINT_1_WORK_DISTRIBUTION.md).
- [ ] Uji di 320, 375, 390/430, 768, 1024, 1440 px (DevTools → Toggle device toolbar).
- [ ] Menu mobile: buka/tutup dengan klik, tombol `Esc`, dan `Tab`.
- [ ] Ubah `isSampleData` menjadi `false` di `site.ts` **hanya** jika produk & harga sudah resmi.
- [ ] Catat pekerjaan yang belum selesai ke backlog Sprint 2.

---

## 3. Kriteria selesai

- Semua halaman memakai layout, token, dan komponen yang sama.
- Fondasi, aset, serta PR Latif & Prety sudah ada di `main`, CI hijau.
- Demo berjalan dari `main` setelah `composer setup`.

---

## 4. Panduan push — fondasi (Tugas 1)

Perubahan fondasi saat ini **belum di-commit** di `main` lokal. Pindahkan ke branch fitur (perubahan ikut, tidak hilang):

```bash
cd ~/Aweflorist
git status
git switch -c feature/rofiq-design-system
```

> ⚠️ `doc/florify-html/` berisi repo Git terpisah (ada folder `.git`). **Jangan** `git add doc/` sekaligus.
> Pilihan: (A, disarankan) jangan commit folder itu; atau (B) `mv doc/florify-html/.git ~/florify-design-git-backup` lalu `git add doc/florify-html/*.html`.

```bash
# 1. Design tokens, konfigurasi, rute
git add resources/css/app.css vite.config.ts routes/web.php .env.example
git add resources/js/app.tsx resources/js/types/ resources/js/config/ resources/js/lib/whatsapp.ts resources/js/lib/format.ts
git commit -m "feat(design-system): tambah design tokens, font, dan rute publik Florify"

# 2. Komponen, layout, section, halaman, data
git add resources/js/components/florify/ resources/js/components/home/ resources/js/layouts/public-layout.tsx
git add resources/js/pages/public/ resources/js/data/
git commit -m "feat(landing): komponen reusable, landing page, katalog, detail, dan informasi"

# 3. Folder gambar, test, dokumentasi
git add public/images/ tests/Feature/PublicPagesTest.php
git add README.md PRD_Florify.md doc/SPRINT_1_DESIGN_SYSTEM.md doc/SPRINT_1_ASSET_GUIDE.md doc/SPRINT_1_WORK_DISTRIBUTION.md doc/sprint-1/
git add doc/Jobsheet-J01-Sprint-Planning-dan-Sprint-Backlog.docx
git commit -m "docs: design system, asset guide, dan pembagian kerja Sprint 1"

git status                       # sisa hanya doc/florify-html/ (opsi A)
npm run check && npm run types:check && php artisan test
git push -u origin feature/rofiq-design-system
```

Buka GitHub `zinexsix/Aweflorist` → **Compare & pull request** → base `main` ← compare `feature/rofiq-design-system` → isi deskripsi → **Create pull request**.

## 5. Panduan push — pekerjaan berikutnya (aset, perbaikan)

```bash
git switch main
git pull origin main
git switch -c feature/rofiq-assets            # perbaikan bug: fix/rofiq-<masalah>

# salin foto ke public/images/..., isi path di config/site.ts
git status
git diff
git add public/images/hero/hero-florist.webp public/images/banners/about-aweflorist.webp resources/js/config/site.ts
git commit -m "feat(assets): tambah foto hero dan tentang kami"
git push -u origin feature/rofiq-assets
```

Lalu buat PR ke `main`. Setelah di-merge:

```bash
git switch main
git pull origin main
git branch -d feature/rofiq-assets
```

**Jangan pernah:** push langsung ke `main`, `git push --force`, `git reset --hard`. Masalah umum saat push: lihat [Pembagian kerja §G.4](../SPRINT_1_WORK_DISTRIBUTION.md).
