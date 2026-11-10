# Florify

Sistem informasi pemesanan dan manajemen pelanggan berbasis web untuk AweFlorist
(Kelompok 2 · CodeHive · MI 3B).

Stack: Laravel 13 + Inertia.js + React 19 + Tailwind CSS 4.

## Menjalankan proyek

Database memakai **MySQL 8 lewat Docker** (`compose.yaml`). Nyalakan dulu Docker Desktop, lalu:

```bash
docker compose up -d   # MySQL di port 3307 + phpMyAdmin di http://localhost:8788
```

Login phpMyAdmin: user `aweflorist`, password `aweflorist` (hanya untuk laptop sendiri).

```bash
composer setup     # sekali saja: install dependensi, .env, key, migrasi, build
composer dev       # server Laravel + Vite (http://localhost:8000)
```

Jika `composer setup` gagal di tengah jalan, jalankan manual:

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed   # tabel + katalog asli (67 produk dari Drive pemilik)
php artisan storage:link     # agar gambar referensi custom bisa dibuka
npm install
npm run dev        # terminal 1
php artisan serve  # terminal 2
```

Isi `VITE_WHATSAPP_NUMBER` di `.env` (format 628xxx). Setelah formulir pesanan atau
buket custom dikirim, data tersimpan di database lalu pelanggan langsung dibawa ke
WhatsApp nomor ini.

### Data katalog dan persetujuan custom

- Katalog (kategori harga, acara Wisuda/Other Occasion, produk, harga, foto) ada di
  `resources/js/data/catalog.json`. Setelah mengubahnya, jalankan
  `php artisan db:seed --class=CatalogSeeder`.
- Permintaan buket custom tersimpan dengan `approval_status = menunggu`. Admin
  mengubahnya menjadi `disetujui` atau `ditolak` (sementara lewat phpMyAdmin, tabel
  `custom_requests`, sampai panel admin dibuat).
- Alamat toko untuk Google Maps diisi di `resources/js/config/site.ts`
  (`address`/`mapsQuery`/`mapsUrl`). Peta tersembunyi selama kosong.

## Dokumen penting

| Dokumen                                                                | Isi                                                      |
| ---------------------------------------------------------------------- | -------------------------------------------------------- |
| [PRD_Florify.md](PRD_Florify.md)                                       | Kebutuhan produk                                         |
| [doc/SPRINT_1_DESIGN_SYSTEM.md](doc/SPRINT_1_DESIGN_SYSTEM.md)         | Design tokens & komponen                                 |
| [doc/SPRINT_1_ASSET_GUIDE.md](doc/SPRINT_1_ASSET_GUIDE.md)             | Aturan gambar                                            |
| [doc/SPRINT_1_WORK_DISTRIBUTION.md](doc/SPRINT_1_WORK_DISTRIBUTION.md) | Pembagian tugas, Git workflow, panduan push              |
| [doc/sprint-1/](doc/sprint-1/)                                         | Lembar tugas pribadi: `rofiq.md`, `latif.md`, `prety.md` |
| [doc/florify-html/](doc/florify-html/)                                 | Mockup HTML awal (acuan visual)                          |
