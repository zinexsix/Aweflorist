# Florify — Uji Penerimaan Sprint 2

**Pemilik dokumen:** Nabila (Product Owner)
**Diuji oleh:** Rofiq (Scrum Master), mewakili Nabila. Uji di HP sungguhan oleh Nabila masih perlu dilakukan.
**Tanggal uji:** 10 November 2026
**Lingkungan uji:** laptop Fedora, `php artisan serve` + `npm run build`, Firefox (mode headless) di lebar 375 px dan 1440 px, database SQLite hasil `php artisan migrate:fresh --seed`. Kode yang diuji: gabungan branch `fix/rofiq-hapus-submodule`, `fix/suci-static-orders`, `feature/prety-us15-custom-simpan`, `feature/prety-us16-gambar-referensi`, dan `fix/nabila-us14-us17`.

Dokumen ini mencatat keputusan Product Owner, hasil pengujian otomatis, dan hasil
uji manual alur pemesanan Sprint 2 (PRD §12, §13.2, §13.4, §15).

---

## 1. Keputusan PO (PRD §15)

Jawaban dicatat setelah dikonfirmasi bersama pemilik AweFlorist. Isi dengan
keputusan final agar seeder dan tampilan tidak menebak.

> **Status 10 November 2026: belum dikonfirmasi.** Bagian ini sengaja belum
> diisi karena jawabannya harus dari pemilik toko. Sementara itu sistem memakai
> usulan Sprint 2: harga per produk atau "Harga via WhatsApp", gambar referensi
> JPG/PNG/WEBP maksimal 2 MB, tanpa kebijakan uang muka di sistem.

### 1.1 Harga tampil langsung atau "mulai dari" (PRD §15 no.1)

- **Keputusan:** _(isi)_
- **Produk yang memakai "mulai dari":** _(isi daftar/jenis)_
- **Catatan:** _(isi)_

### 1.2 Pengambilan atau pengiriman pesanan (PRD §15 no.5)

- **Keputusan:** _(diambil sendiri / dikirim / keduanya)_
- **Biaya kirim dan area layanan:** _(isi)_
- **Catatan:** _(isi)_

### 1.3 Batas ukuran dan format gambar referensi custom (PRD §15 no.6)

- **Format yang diterima:** _(isi, mis. JPG, PNG, WEBP)_
- **Ukuran maksimal:** _(isi, usulan Sprint 2: 2 MB)_
- **Catatan:** _(isi)_

### 1.4 Kebijakan uang muka, pelunasan, dan pembatalan (PRD §15 no.9)

- **Uang muka:** _(isi)_
- **Pelunasan:** _(isi)_
- **Pembatalan:** _(isi)_
- **Catatan:** _(isi)_

---

## 2. Data asli toko

Daftar produk, harga, dan foto asli diserahkan ke Latif untuk memperbarui
`database/seeders/CatalogSeeder.php`. Setelah seeder diperbarui dan di-merge,
Rofiq mengubah `isSampleData` menjadi `false` di `config/site.ts`.

- [ ] Daftar produk asli (nama, kategori, acara) sudah diserahkan.
- [ ] Harga asli (atau penanda "harga via WhatsApp") sudah diserahkan.
- [ ] Foto produk asli sudah diserahkan sesuai `doc/SPRINT_1_ASSET_GUIDE.md`.
- [ ] `CatalogSeeder` sudah diperbarui dan di-merge.
- [ ] `isSampleData` sudah diubah menjadi `false`.

---

## 3. Pengujian otomatis

Berkas: `tests/Feature/Sprint2/OrderFlowTest.php`

| Skenario | Hasil |
|---|---|
| Pengunjung membuka katalog → detail → formulir → kirim → konfirmasi menampilkan nomor yang sama dengan database | Lulus |
| Permintaan custom tersimpan dan tampil di halaman konfirmasi | Lulus (tidak lagi dilewati setelah US-15) |
| Input tidak valid tidak menyimpan apa pun (jumlah baris sebelum = sesudah) | Lulus |
| Dua pesanan berturut-turut mendapat nomor berbeda | Lulus |

Seluruh test proyek pada tanggal uji: **117 lulus, 0 gagal, 0 dilewati**
(`php artisan test`), ditambah `npm run check`, `npm run types:check`, Pint,
PHPStan, dan `npm run build:static` lulus.

Perintah:

```bash
php artisan test --filter=OrderFlowTest
```

---

## 4. Uji manual (PRD §13.4 no.1–4)

Setiap skenario diuji di ponsel (375 px) dan desktop (1440 px). Isi kolom
"Hasil nyata" apa adanya; jangan diubah agar terlihat lulus.

| Skenario | Langkah | Hasil diharapkan | Hasil nyata | Lulus/Gagal | Catatan |
|---|---|---|---|---|---|
| 1. Menemukan produk tertentu | Buka `/katalog`, cari "mawar", pilih filter kategori | Produk yang cocok tampil; filter bisa dipakai dengan keyboard | `/katalog?q=mawar&kategori=buket-bunga` menampilkan 2 produk dengan teks "Menampilkan 2 produk untuk Buket Bunga Segar dengan kata "mawar""; tombol filter aktif terlihat | Lulus | Uji keyboard belum dilakukan |
| 2. Membuka detail produk | Klik salah satu produk | Detail menampilkan foto, nama, harga, deskripsi, tombol "Pesan Sekarang" | `/katalog/buket-mawar-merah` tampil lengkap dengan tombol "Pesan Sekarang" dan "Tanya via WhatsApp" | Lulus | Foto masih foto sementara |
| 3. Mengirim pesanan | Dari detail → "Pesan Sekarang", isi nama, WA, jumlah, tanggal, catatan → kirim | Data tersimpan, muncul halaman konfirmasi dengan nomor `AWF-…`, tombol salin berfungsi | Pesanan dikirim (2 × Buket Mawar Merah) → diarahkan ke konfirmasi `AWF-20261110-U4H6Z`, total Rp 500.000, WA tampil `6281****6666`; data ada di database | Lulus | Tombol "Salin" belum dicoba dengan klik |
| 4. Mengirim permintaan custom | Buka `/buket-custom`, isi nama, WA, jenis buket, anggaran, warna/tema, tanggal → kirim | Data tersimpan, muncul konfirmasi dengan nomor `CST-…` | Permintaan dikirim → konfirmasi `CST-20261110-UJ7CV`; data ada di database. Unggah gambar WEBP asli diterima, file teks berekstensi `.jpg` ditolak | Lulus | |

Tambahan yang perlu dicek pada setiap skenario:

- [x] Tanpa scroll horizontal di 375 px (dilihat dari screenshot keempat skenario).
- [ ] Semua kolom punya label dan bisa diisi hanya dengan keyboard. *Label ada di semua kolom; uji keyboard belum dilakukan.*
- [x] Pesan galat validasi muncul dalam Bahasa Indonesia (dicek lewat test otomatis; kiriman tidak valid dikembalikan ke formulir dan tidak tersimpan).
- [x] Nomor WhatsApp pelanggan di halaman konfirmasi tampil tersamar.
- [x] URL konfirmasi tanpa tanda tangan ditolak (403), untuk pesanan dan custom.
- [ ] Tidak ada galat di Console browser. *Belum dicek; perlu dibuka di browser biasa (F12).*

---

## 5. Temuan dan tindak lanjut

Bug yang ditemukan dicatat sebagai GitHub Issue (lihat `SPRINT_2_WORK_DISTRIBUTION.md`
Bagian 6.6) dan ditugaskan ke pemilik story.

| No. | Temuan | Tingkat keparahan | Pemilik story | Issue |
|---|---|---|---|---|
| 1 | CI GitHub gagal sejak commit `gass`: `doc/florify-html` tersimpan sebagai submodule tanpa URL | Tinggi | Rofiq | Diperbaiki di branch `fix/rofiq-hapus-submodule` |
| 2 | Build statis Vercel gagal karena `@/routes/orders` tidak ada tanpa PHP | Tinggi | Suci (US-13) | Diperbaiki di branch `fix/suci-static-orders` |
| 3 | Nomor pesanan terpotong di tengah kode pada layar 390 px | Rendah | Nabila (US-14) | Diperbaiki di branch `fix/nabila-us14-us17` |
| 4 | Data factory pesanan: total tidak sama dengan jumlah subtotal item (hanya data test/demo, alur pesanan asli benar) | Rendah | Latif (US-09) | Belum dibuat |
| 5 | Foto produk masih foto sementara dan belum cocok dengan nama produk | Sedang | Latif / Rofiq | Menunggu data asli dari pemilik |

---

## 6. Kesimpulan

- [x] Semua skenario Must lulus atau punya Issue yang tercatat.
- [ ] Keputusan PO (Bagian 1) sudah lengkap. *Belum; menunggu pemilik toko.*
- [ ] Sprint 2 siap didemokan dari `main`. *Setelah PR perbaikan di-merge, data asli masuk seeder, dan uji di HP sungguhan selesai.*
