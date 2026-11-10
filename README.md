# Florify

Sistem informasi pemesanan dan manajemen pelanggan berbasis web untuk AweFlorist
(Kelompok 2 · CodeHive · MI 3B).

Stack: Laravel 13 + Inertia.js + React 19 + Tailwind CSS 4.

## Menjalankan proyek

```bash
composer setup     # sekali saja: install dependensi, .env, key, migrasi, build
composer dev       # server Laravel + Vite (http://localhost:8000)
```

Jika `composer setup` gagal di tengah jalan, jalankan manual:

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan storage:link   # agar gambar referensi custom bisa dibuka
npm install
npm run dev        # terminal 1
php artisan serve  # terminal 2
```

## Dokumen penting

| Dokumen                                                                | Isi                                                      |
| ---------------------------------------------------------------------- | -------------------------------------------------------- |
| [PRD_Florify.md](PRD_Florify.md)                                       | Kebutuhan produk                                         |
| [doc/SPRINT_1_DESIGN_SYSTEM.md](doc/SPRINT_1_DESIGN_SYSTEM.md)         | Design tokens & komponen                                 |
| [doc/SPRINT_1_ASSET_GUIDE.md](doc/SPRINT_1_ASSET_GUIDE.md)             | Aturan gambar                                            |
| [doc/SPRINT_1_WORK_DISTRIBUTION.md](doc/SPRINT_1_WORK_DISTRIBUTION.md) | Pembagian tugas, Git workflow, panduan push              |
| [doc/sprint-1/](doc/sprint-1/)                                         | Lembar tugas pribadi: `rofiq.md`, `latif.md`, `prety.md` |
| [doc/florify-html/](doc/florify-html/)                                 | Mockup HTML awal (acuan visual)                          |
