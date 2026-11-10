# J-06 Laporan Mingguan Tim

Politeknik Negeri Padang · Jurusan Teknologi Informasi · D3 Manajemen Informatika
Mata Kuliah Proyek Utama (ISY3215)

| | | | |
|---|---|---|---|
| **Kelas** | MI 3B | **Kelompok** | 2 (CodeHive) |
| **Nama Proyek** | Florify | **Klien / Mitra** | Awe Florist |
| **Minggu ke-** | `[isi]` | **Sprint ke-** | 1 |
| **Periode laporan** | 20–27 Oktober 2026 | **Disusun oleh** | Muhammad Rofiqul Islamy (Scrum Master) |

**Sprint goal:** Sprint ini bernilai bagi klien untuk meningkatkan pemasaran secara digital.

*Skala status: 0 = belum dikerjakan · 1 = sedang dikerjakan · 2 = selesai sebagian / menunggu data · 3 = selesai dan sudah di `main`.*

## A. Capaian Minggu Ini terhadap Sprint Goal

| Kode US | Pekerjaan yang diselesaikan minggu ini | Status (0–3) | Bukti |
|---|---|---|---|
| US-01 | Navbar (menu mobile) dan hero section dengan tagline, tombol "Lihat Katalog" dan "Pesan Sekarang", foto hero | 3 | [PR #2](https://github.com/zinexsix/Aweflorist/pull/2), [PR #3](https://github.com/zinexsix/Aweflorist/pull/3) |
| US-02 | Section profil "Tentang kami" (foto toko) dan produk unggulan (4 kartu) | 3 | PR #2, PR #3 |
| US-03 | Section promo/informasi unggulan dan footer; **kontak & media sosial belum diisi** (menunggu data pemilik) | 2 | PR #2 |
| US-04 | Komponen kartu produk; 16 produk contoh dengan foto, nama, kategori, harga | 3 | PR #2, PR #3 |
| US-05 | Halaman katalog responsif (1–4 kolom), diuji di 320–1440 px; filter kategori lewat URL | 3 | PR #2 |
| US-06 | Halaman detail produk: foto, deskripsi, harga, produk serupa | 3 | PR #2 |
| US-07 | Tombol "Pesan Sekarang" membuka WhatsApp dengan pesan otomatis; nomor WA toko belum dipasang | 3 | PR #2 |
| US-08 | Halaman cara pemesanan, FAQ, dan kontak (`/informasi`); **isi FAQ & kontak belum dari data pemilik** | 2 | PR #2 |
| Tambahan | Design system, folder aset, formulir buket custom (kirim via WhatsApp), build statis Vercel, test otomatis | 3 | PR #2–#3, [PR #5](https://github.com/zinexsix/Aweflorist/pull/5) |

## B. Kontribusi Anggota

| No | Nama Anggota | Task yang diselesaikan | Jumlah commit | Hadir Daily Scrum |
|---|---|---|---|---|
| 1 | Muhammad Rofiqul Islamy | Setup struktur repo, design system & panduan visual, navbar, hero, landing page, katalog, detail, halaman informasi, aset foto, formulir custom, dokumentasi & pembagian tugas, review/merge PR #2–#4 | 4 | `[isi]` |
| 2 | M. Khairul Umrdi Latif | Inisialisasi proyek Laravel, build statis & deploy Vercel (PR #5), perbaikan CI | 4 | `[isi]` |
| 3 | Prety | Tugas konten (profil, promo, FAQ, kontak) **belum masuk PR** | 0 | `[isi]` |
| 4 | Nabilla Putri Insani (PO) | `[isi: mis. konfirmasi backlog & data ke pemilik]` | 0 | `[isi]` |
| 5 | Suci | `[isi]` | 0 | `[isi]` |

## C. Sisa Pekerjaan Sprint

| Sisa story point | Sisa hari sprint | Velocity berjalan | Prognosis |
|---|---|---|---|
| 5 SP (US-03: 3, US-08: 2) | 0 (sprint 1 minggu sudah berakhir) | 16 dari 21 SP | Terlambat; sisa 5 SP dibawa ke Sprint 2 |

## D. Hambatan yang Belum Teratasi

| No | Uraian hambatan | Sejak tanggal | Bantuan yang dibutuhkan |
|---|---|---|---|
| 1 | Data usaha belum dikonfirmasi pemilik: nomor WhatsApp, alamat, jam buka, media sosial, harga & foto produk asli. Katalog masih memakai data dan foto contoh. | 21 Okt 2026 | PO menjadwalkan pertemuan dengan pemilik AweFlorist |
| 2 | Kontribusi kode belum merata: 3 anggota belum punya commit; tugas Sprint 1 Latif (filter, catatan kartu) dan Prety (konten) belum di-PR. | 21 Okt 2026 | Daily Scrum rutin dan pendampingan Git/GitHub |
| 3 | Hosting Vercel hanya bisa halaman statis; Sprint 2 (database & pesanan) butuh hosting PHP + MySQL. | 27 Okt 2026 | Saran hosting dari dosen/kampus |

## E. Rencana Minggu Berikutnya

| No | Rencana pekerjaan | Penanggung Jawab |
|---|---|---|
| 1 | Lengkapi sisa US-03 & US-08 (kontak, media sosial, FAQ dari data pemilik) | Prety, Nabilla (data) |
| 2 | Sprint 2: US-09 fondasi database (sudah di-merge, PR #6), US-10 katalog dari database, US-11 pencarian | Latif |
| 3 | Sprint 2: US-12 simpan pesanan & nomor unik, US-13 formulir pemesanan | Suci |
| 4 | Sprint 2: US-14 halaman konfirmasi, US-17 pengujian alur; US-15/16 buket custom tersimpan | Nabilla, Prety |
| 5 | Review & merge PR, pilih hosting PHP + MySQL, isi Jobsheet J-01 Sprint 2 | Rofiq |

| Scrum Master, | Diterima, Dosen Pengampu, |
|---|---|
| <br><br><br>(Muhammad Rofiqul Islamy) | <br><br><br>(............................................) |
