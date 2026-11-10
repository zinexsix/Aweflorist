# Florify — Uji Penerimaan Sprint 2

**Pemilik dokumen:** Nabila (Product Owner)
**Diuji oleh:** Nabila
**Tanggal uji:** _(isi tanggal)_
**Lingkungan uji:** _(isi, mis. Chrome desktop 1440 px + Android 375 px, `composer dev`)_

Dokumen ini mencatat keputusan Product Owner, hasil pengujian otomatis, dan hasil
uji manual alur pemesanan Sprint 2 (PRD §12, §13.2, §13.4, §15).

---

## 1. Keputusan PO (PRD §15)

Jawaban dicatat setelah dikonfirmasi bersama pemilik AweFlorist. Isi dengan
keputusan final agar seeder dan tampilan tidak menebak.

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
| Pengunjung membuka katalog → detail → formulir → kirim → konfirmasi menampilkan nomor yang sama dengan database | _(lulus/gagal)_ |
| Permintaan custom tersimpan dan tampil di halaman konfirmasi | _(lulus/gagal/dilewati sampai US-15)_ |
| Input tidak valid tidak menyimpan apa pun (jumlah baris sebelum = sesudah) | _(lulus/gagal)_ |
| Dua pesanan berturut-turut mendapat nomor berbeda | _(lulus/gagal)_ |

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
| 1. Menemukan produk tertentu | Buka `/katalog`, cari "mawar", pilih filter kategori | Produk yang cocok tampil; filter bisa dipakai dengan keyboard | | | |
| 2. Membuka detail produk | Klik salah satu produk | Detail menampilkan foto, nama, harga, deskripsi, tombol "Pesan Sekarang" | | | |
| 3. Mengirim pesanan | Dari detail → "Pesan Sekarang", isi nama, WA, jumlah, tanggal, catatan → kirim | Data tersimpan, muncul halaman konfirmasi dengan nomor `AWF-…`, tombol salin berfungsi | | | |
| 4. Mengirim permintaan custom | Buka `/buket-custom`, isi nama, WA, jenis buket, anggaran, warna/tema, tanggal → kirim | Data tersimpan, muncul konfirmasi dengan nomor `CST-…` | | | |

Tambahan yang perlu dicek pada setiap skenario:

- [ ] Tanpa scroll horizontal di 375 px.
- [ ] Semua kolom punya label dan bisa diisi hanya dengan keyboard.
- [ ] Pesan galat validasi muncul dalam Bahasa Indonesia.
- [ ] Nomor WhatsApp pelanggan di halaman konfirmasi tampil tersamar.
- [ ] URL konfirmasi tanpa tanda tangan ditolak (403).
- [ ] Tidak ada galat di Console browser.

---

## 5. Temuan dan tindak lanjut

Bug yang ditemukan dicatat sebagai GitHub Issue (lihat `SPRINT_2_WORK_DISTRIBUTION.md`
Bagian 6.6) dan ditugaskan ke pemilik story.

| No. | Temuan | Tingkat keparahan | Pemilik story | Issue |
|---|---|---|---|---|
| | | | | |

---

## 6. Kesimpulan

- [ ] Semua skenario Must lulus atau punya Issue yang tercatat.
- [ ] Keputusan PO (Bagian 1) sudah lengkap.
- [ ] Sprint 2 siap didemokan dari `main`.
