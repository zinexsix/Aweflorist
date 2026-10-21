# Tugas Prety — Konten & Informasi

Kamu mengerjakan bagian **informasi**: Tentang kami, kategori/acara, promo, cara pemesanan, FAQ, kontak, dan halaman buket custom.
Story yang kamu pegang: US-02 (profil), US-03 (promo dan kontak), US-08 (cara pesan, FAQ, kontak).

Semua bagian ini **sudah jadi dan sudah jalan**. Tugasmu mengisi dengan data asli dan merapikan, bukan membuat dari awal.

Bacaan sebelum mulai (10 menit):
- [Design system](../SPRINT_1_DESIGN_SYSTEM.md) — bagian 3.6 sampai 3.10
- [PRD](../../PRD_Florify.md) — bagian 3.2 (alur buket custom)

---

## 1. Kondisi sekarang (sudah ada di `main`)

- Beranda, katalog, detail, `/informasi`, dan `/buket-custom` sudah jalan.
- Foto toko AweFlorist sudah terpasang di bagian "Tentang kami".
- Alamat, jam buka, dan media sosial **masih kosong** (disembunyikan otomatis). Jangan diisi dengan data karangan.
- Formulir buket custom sudah ada: pelanggan mengisi, lalu WhatsApp terbuka dengan pesan siap kirim. **Datanya belum disimpan ke database** (itu Sprint 2).

## 2. File yang boleh kamu ubah

| File | Isinya |
|---|---|
| `resources/js/components/home/about-section.tsx` | Tentang kami |
| `resources/js/components/home/occasions-section.tsx` | Kartu kategori/acara |
| `resources/js/components/home/promo-section.tsx` | Promo / informasi unggulan |
| `resources/js/components/home/order-info-section.tsx` | Cara pesan, FAQ ringkas, ajakan kontak di beranda |
| `resources/js/pages/public/info.tsx` | Halaman `/informasi` |
| `resources/js/pages/public/custom-bouquet.tsx` | Halaman `/buket-custom` (teks penjelasan di sekitar formulir) |
| `resources/js/data/info.ts` | Isi langkah pesan dan FAQ |
| `resources/js/data/catalog.ts` | Hanya bagian `occasions` |
| `resources/js/config/site.ts` | Hanya 4 baris: `address`, `openingHours`, `instagram`, `tiktok` |

**Formulirnya sendiri** ada di `components/florify/custom-bouquet-form.tsx` milik Rofiq. Mau ubah isi formulir (kolom, pilihan, pesan)? Minta ke Rofiq.

File di luar daftar ini: tanya Rofiq dulu.

---

## 3. Yang harus dikerjakan (urut)

### Tugas 1 — Siapkan laptop
Ikuti bagian 5 langkah A. Lalu jalankan `composer dev` dan buka http://localhost:8000 dan http://localhost:8000/informasi.

### Tugas 2 — Kumpulkan data dari pemilik toko (lewat Rofiq)
- [ ] Cerita singkat AweFlorist.
- [ ] Alamat, jam buka, Instagram, TikTok.
- [ ] Promo yang sedang berjalan (nama, tanggal, syarat), kalau ada.
- [ ] Aturan toko: pesan berapa hari sebelumnya, kirim atau ambil sendiri, cara bayar.

Belum ada jawabannya? Biarkan tulisan yang sekarang. **Jangan mengarang.**

### Tugas 3 — Tentang kami
- [ ] Ganti paragraf di `about-section.tsx` dengan cerita asli.
- [ ] Jangan menulis angka (tahun berdiri, jumlah pesanan) kalau belum dikonfirmasi.

### Tugas 4 — Kategori/acara
- [ ] Rapikan tulisan `occasions` di `data/catalog.ts`.
- [ ] Klik tiap kartu di beranda. Pastikan katalog yang terbuka sudah terfilter (alamatnya `/katalog?acara=...`).
- [ ] Kartu "Buket Custom" harus membuka halaman `/buket-custom`.

### Tugas 5 — Promo
- [ ] Ada promo resmi? Ubah tulisan di `promo-section.tsx`.
- [ ] Belum ada? Biarkan seperti sekarang (ajakan pesan buket custom). **Jangan menulis diskon atau tanggal palsu.**

### Tugas 6 — Cara pesan dan FAQ
- [ ] Sesuaikan `orderSteps` dan `faqs` di `data/info.ts` dengan aturan toko yang asli.
- [ ] Tambah pertanyaan tentang buket custom kalau perlu.
- [ ] Ingat: pesanan **belum pasti** hanya karena pelanggan mengirim chat. Pesanan pasti setelah admin dan pelanggan sepakat soal detail dan harga.
- [ ] Uji FAQ dengan keyboard: tombol `Tab` ke pertanyaan, lalu `Enter`.

### Tugas 7 — Kontak
- [ ] Isi 4 baris ini di `config/site.ts` (jangan ubah baris lain):
  ```ts
  address: 'isi alamat asli',
  openingHours: 'isi jam buka asli',
  instagram: '@akun_asli',
  tiktok: '@akun_asli',
  ```
- [ ] Buat **commit terpisah** untuk file ini, lalu kabari Rofiq (file ini miliknya).
- [ ] Cek hasilnya di footer (semua halaman) dan di `/informasi#kontak`.

### Tugas 8 — Halaman buket custom
- [ ] Buka `/buket-custom`. Coba kirim kosong (harus muncul pesan merah), lalu isi lengkap (WhatsApp harus terbuka dengan pesan yang rapi).
- [ ] Rapikan tulisan penjelasan di `custom-bouquet.tsx` kalau perlu.
- [ ] Ada saran untuk kolom atau pilihan di formulir? Kirim ke Rofiq.
- [ ] Jangan menambah fitur upload gambar atau simpan data (itu Sprint 2).

### Tugas 9 — Uji
- [ ] Buka beranda, `/informasi`, dan `/buket-custom` di lebar 320, 375, 768, dan 1440 px (F12 → ikon ponsel).
- [ ] Tidak ada geser kanan-kiri, tidak ada tulisan terpotong.
- [ ] Tidak ada tulisan merah di Console (F12).
- [ ] Jalankan: `npm run check`, `npm run types:check`, `php artisan test`. Semua harus lulus.

---

## 4. Selesai kalau

- Tentang kami dan promo tampil dengan isi asli (atau tulisan netral kalau data belum ada).
- `/informasi` berisi cara pesan, FAQ, dan kontak. Footer menampilkan kontak yang sudah pasti.
- Tidak ada informasi bisnis karangan.
- Rapi di ponsel dan desktop, tiga perintah uji lulus.

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
git switch -c feature/prety-content-sections
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
git add resources/js/data/info.ts
git commit -m "feat(info): sesuaikan FAQ dengan aturan toko"
git push -u origin feature/prety-content-sections
```
`-u` hanya dipakai saat push **pertama**. Setelah itu cukup `git push`.

Tambah satu file per commit, ganti nama file dan pesannya sesuai yang kamu ubah. **Jangan** pakai `git add .`.

Perubahan kontak di `config/site.ts` dibuat commit sendiri:
```bash
git add resources/js/config/site.ts
git commit -m "feat(kontak): isi alamat, jam buka, dan media sosial"
git push
```

> Jika `git status` menampilkan `package-lock.json` berubah dan kamu tidak menambah paket, batalkan: `git restore package-lock.json`.

### C. Kalau `main` sudah berubah (misalnya PR Latif sudah masuk)

```bash
git fetch origin
git merge origin/main
git push
```
Kalau ada konflik, jangan panik dan jangan pakai `reset --hard`. Kabari Rofiq di grup.

### D. Buat Pull Request

1. Buka https://github.com/zinexsix/Aweflorist
2. Klik **Compare & pull request** pada branch milikmu.
3. Base: `main`. Compare: `feature/prety-content-sections`.
4. Isi: apa yang diubah, dan cara mengujinya.
5. Klik **Create pull request**, lalu minta **Rofiq** me-review.

### E. Setelah PR di-merge

```bash
git switch main
git pull origin main
git branch -d feature/prety-content-sections
```

### Dilarang
`git push --force`, `git reset --hard`, `git add .`, dan push ke `main`.

---

## 6. Kalau memakai OpenCode (boleh, tidak wajib)

OpenCode hanya membantu menulis kode. **Kamu yang memeriksa hasilnya dan menjalankan semua perintah Git sendiri.** AI tidak boleh menjalankan `git add`, `git commit`, atau `git push`.

Contoh perintah ke OpenCode:
```text
Proyek Laravel + Inertia + React + TypeScript + Tailwind 4. Jangan ganti framework dan jangan tambah paket.
Baca doc/SPRINT_1_DESIGN_SYSTEM.md dan doc/sprint-1/prety.md.
Baca resources/js/data/info.ts dan resources/js/pages/public/info.tsx.
Tugas: ganti jawaban FAQ di data/info.ts dengan aturan toko berikut: <tempel aturan dari pemilik toko>.
Jangan mengarang informasi. Kalau datanya tidak ada, biarkan isi lama.
Hanya ubah data/info.ts. Jangan jalankan perintah git.
Setelah selesai, sebutkan file yang berubah dan cara mengujinya.
```

Setelah AI selesai: cek `git diff`, pastikan hanya file milikmu yang berubah. Kalau ada file lain berubah, batalkan dengan `git restore <nama-file>`.
