# Sprint 1 — Tugas Prety (Section Informasi & Konten)

Peranmu: membuat konten pendukung yang membantu pelanggan mengenal AweFlorist dan memahami cara memesan.
User story: **US-02** (profil singkat), **US-03** (promo event & kontak di footer), **US-08** (cara pemesanan, FAQ, kontak), dan kategori/acara (**FR-06**).

Dokumen acuan: [PRD](../../PRD_Florify.md) (bagian 4.1 FR-06, FR-09, 10.2, 15) · [Design system](../SPRINT_1_DESIGN_SYSTEM.md) (§3.6–3.10) · [Pembagian kerja lengkap](../SPRINT_1_WORK_DISTRIBUTION.md)

> Versi awal semua section milikmu **sudah ada dan sudah berjalan**. Tugasmu melengkapi isinya dengan data resmi dan merapikannya, bukan membuat dari nol.
> Mulai **setelah** Rofiq mengumumkan bahwa PR fondasi sudah di-merge ke `main`.

---

## 1. File yang boleh kamu ubah

| File | Isi |
|---|---|
| `resources/js/components/home/about-section.tsx` | Section "Tentang kami" di landing page |
| `resources/js/components/home/occasions-section.tsx` | Kartu kategori/acara |
| `resources/js/components/home/promo-section.tsx` | Promo/informasi unggulan |
| `resources/js/components/home/order-info-section.tsx` | Cara pesan, FAQ ringkas, CTA kontak di landing page |
| `resources/js/pages/public/info.tsx` | Halaman `/informasi` (cara pesan, FAQ, kontak) |
| `resources/js/pages/public/custom-bouquet.tsx` | Halaman `/buket-custom` (formulir buket custom) |
| `resources/js/data/info.ts` | Isi langkah pemesanan & FAQ |
| `resources/js/data/catalog.ts` | **Hanya** bagian `occasions` (bagian `categories` milik Latif) |
| `resources/js/config/site.ts` | **Hanya** field `address`, `openingHours`, `instagram`, `tiktok` (file milik Rofiq) |

Perlu mengubah file lain? Tanya Rofiq di grup dulu.

---

## 2. Daftar tugas (urut)

### Tugas 1 — Siapkan lingkungan (hari 1)
- [ ] Ikuti §4 langkah A (clone/pull, buat branch).
- [ ] Jalankan aplikasi, buka `http://localhost:8000` dan `http://localhost:8000/informasi`, pahami file-file di §1.

### Tugas 2 — Kumpulkan data dari PO (bersama Rofiq)
- [ ] Cerita singkat AweFlorist (sejak kapan, lokasi, keunggulan).
- [ ] Alamat, jam buka, Instagram, TikTok.
- [ ] Promo yang sedang/akan berjalan: nama, periode, syarat.
- [ ] Kebijakan: berapa hari sebelum hari H harus memesan, pengiriman vs ambil sendiri, metode pembayaran, uang muka.
- [ ] **Jangan mengarang** — jika belum ada jawaban, biarkan teks yang sekarang.

### Tugas 3 — Profil singkat "Tentang kami" (task jobsheet #6)
- [ ] Ganti paragraf di `about-section.tsx` dengan cerita resmi.
- [ ] Sesuaikan 3 kotak highlight. Jangan menambah angka/statistik yang belum pasti.

### Tugas 4 — Kategori/acara (FR-06)
- [ ] Rapikan deskripsi `occasions` di `data/catalog.ts`.
- [ ] Pastikan setiap kartu di `occasions-section.tsx` membuka katalog yang terfilter (klik → cek URL `/katalog?acara=…`).
- [ ] Jika PO menambah acara (mis. Hari Ibu), diskusikan dengan Rofiq & Latif dulu karena tipe datanya bersama.

### Tugas 5 — Promo event (task #8)
- [ ] Jika promo resmi sudah ada: ganti `eyebrow`, `title`, `description` di `promo-section.tsx` (tetap pakai `PromoBanner` dan `WhatsAppButton variant="inverse"`).
- [ ] Jika belum: biarkan informasi "buket custom" yang sekarang. Jangan menulis diskon/periode palsu.

### Tugas 6 — Cara pemesanan & FAQ (task #15)
- [ ] Sesuaikan langkah di `orderSteps` (`data/info.ts`) dengan proses toko yang sebenarnya.
- [ ] Perbarui jawaban `faqs` dengan kebijakan resmi; tambah pertanyaan bila perlu (mis. pengiriman, pembayaran).
- [ ] Ingat aturan PRD: pesanan **belum** dianggap terkonfirmasi hanya karena pelanggan mengirim chat WhatsApp.
- [ ] Cek accordion FAQ bisa dibuka dengan keyboard: `Tab` ke pertanyaan → `Enter`.

### Tugas 7 — Kontak (task #16, bagian kontak US-03)
- [ ] Isi 4 field di `config/site.ts`:
  ```ts
  address: 'Jl. …',
  openingHours: 'Senin–Sabtu, 08.00–20.00',
  instagram: '@aweflorist',
  tiktok: '@aweflorist',
  ```
  (contoh format saja — isi dengan data resmi). Field lain di `site.ts` jangan diubah.
- [ ] Cek hasilnya di footer (semua halaman) dan di `/informasi#kontak`.
- [ ] Opsional jika disetujui tim: peta lokasi di `/informasi#kontak`.

### Tugas 8 — Formulir buket custom (FR-19, FR-20)
Versi awal sudah dibuat Rofiq di `/buket-custom`. Isi: jenis buket, anggaran, warna/tema, tanggal dibutuhkan, catatan; divalidasi di browser lalu dikirim lewat WhatsApp. **Data belum disimpan ke basis data** (itu Sprint 2).

- [ ] Coba isi formulir: kirim kosong (pesan galat muncul, fokus pindah ke kolom pertama yang salah), lalu isi lengkap (WhatsApp terbuka dengan pesan rapi).
- [ ] Sesuaikan pilihan jenis buket, teks petunjuk, dan batas anggaran minimal (`MIN_BUDGET`) dengan data PO.
- [ ] Jangan menambah unggah gambar atau penyimpanan data (di luar scope Sprint 1).
- [ ] Uji di 320 px dan 1440 px.

### Tugas 9 — Uji responsif
- [ ] DevTools → Toggle device toolbar: 320, 375, 768, 1024, 1440 px.
- [ ] Kartu kategori, langkah pemesanan, FAQ, dan panel kontak tidak terpotong dan tidak membuat scroll horizontal.
- [ ] Console (F12) bebas error.

---

## 3. Kriteria selesai

- Formulir `/buket-custom` memvalidasi isian dan membuka WhatsApp dengan detail permintaan.
- Profil singkat dan promo/informasi unggulan tampil di landing page dengan data resmi (atau teks netral jika data belum ada).
- Halaman `/informasi` berisi cara pemesanan, FAQ, dan kontak; footer menampilkan kontak yang sudah dikonfirmasi.
- Tidak ada informasi bisnis palsu.
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
git switch -c feature/prety-content-sections
npm install
composer dev               # buka http://localhost:8000/informasi
```

### B. Setiap selesai satu bagian

```bash
git status                 # pastikan hanya file milikmu yang berubah
git diff                   # baca perubahanmu (tekan q untuk keluar)
npm run check && npm run types:check && php artisan test

git add resources/js/data/info.ts
git commit -m "feat(info): perbarui cara pemesanan dan FAQ sesuai kebijakan toko"
git push -u origin feature/prety-content-sections    # -u hanya saat push PERTAMA
```

Perubahan `config/site.ts` (file milik Rofiq) dibuat **dalam commit terpisah** supaya mudah di-review:

```bash
git add resources/js/config/site.ts
git commit -m "feat(kontak): isi alamat, jam buka, dan media sosial AweFlorist"
git push
```

Section lain:

```bash
git add resources/js/components/home/about-section.tsx resources/js/components/home/promo-section.tsx
git commit -m "feat(landing): perbarui profil singkat dan informasi promo"
git push
```

### C. Hari berikutnya / jika `main` sudah berubah

```bash
git switch feature/prety-content-sections
git fetch origin
git merge origin/main      # jika konflik: lihat Pembagian kerja §D.1, JANGAN reset --hard
git push
```

### D. Buat Pull Request

GitHub `zinexsix/Aweflorist` → **Compare & pull request** → base `main` ← compare `feature/prety-content-sections` → salin checklist dari [Pembagian kerja §F](../SPRINT_1_WORK_DISTRIBUTION.md) → reviewer: **Rofiq** → **Create pull request**.

### E. Setelah PR di-merge

```bash
git switch main
git pull origin main
git branch -d feature/prety-content-sections
```

**Jangan pernah:** push ke `main`, `git push --force`, `git reset --hard`, `git add .` (bisa ikut menambahkan file orang lain atau `.env`).

---

## 5. Prompt OpenCode (opsional)

OpenCode hanya alat bantu. Kalau tidak bisa dipakai, kerjakan manual — sebagian besar tugasmu adalah mengganti teks di file data. Selalu cek `git diff` sebelum commit, dan commit/push sendiri.

**FAQ & kontak:**

```text
Kamu membantu proyek Florify (Laravel 13 + Inertia + React 19 + TypeScript + Tailwind 4).
Jangan mengganti framework dan jangan menambah dependensi.
1. Baca: PRD_Florify.md (4.1 FR-09, 10.2, 15), doc/SPRINT_1_DESIGN_SYSTEM.md, doc/sprint-1/prety.md.
2. Baca: resources/js/data/info.ts, resources/js/pages/public/info.tsx,
   resources/js/components/florify/faq-list.tsx, resources/js/config/site.ts.
3. Tugas: perbarui jawaban FAQ di data/info.ts dengan kebijakan resmi berikut:
   <tempel kebijakan: waktu pemesanan, pengiriman, pembayaran>.
   Isi field address, openingHours, instagram, tiktok di config/site.ts dengan:
   <tempel data kontak resmi>. Jangan mengubah field lain di site.ts.
4. HANYA ubah resources/js/data/info.ts dan resources/js/config/site.ts.
5. Jangan mengarang informasi. Jika data tidak ada, biarkan nilai lama / null.
6. Laporkan file yang berubah dan cara mengujinya. Jangan menjalankan git commit atau git push.
```

**Tentang kami:**

```text
Proyek Florify (Laravel + Inertia + React + TS + Tailwind 4). Baca doc/SPRINT_1_DESIGN_SYSTEM.md,
doc/sprint-1/prety.md, dan resources/js/components/home/about-section.tsx.
Ganti paragraf dan tiga highlight dengan cerita AweFlorist berikut: <tempel teks dari PO>.
Pertahankan struktur komponen, class token, dan heading; jangan menambah angka/statistik yang tidak ada di teks.
Hanya ubah about-section.tsx. Laporkan file yang berubah dan cara menguji di 375px dan 1440px.
Jangan menjalankan git commit atau git push.
```
