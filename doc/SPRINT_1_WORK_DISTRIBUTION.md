# Florify — Pembagian Kerja Sprint 1

Kelompok 2 (CodeHive) · MI 3B · Proyek Utama (ISY3215)
Scrum Master: Muhammad Rofiqul Islamy (Rofiq) · Product Owner: Nabilla Putri Insani

**Lembar tugas pribadi** (daftar tugas + panduan push masing-masing): [Rofiq](sprint-1/rofiq.md) · [Latif](sprint-1/latif.md) · [Prety](sprint-1/prety.md)

Baca dokumen ini sampai selesai sebelum menulis kode. Dokumen lain yang wajib dibaca:

1. `PRD_Florify.md` — bagian 4.1, 10, dan 12 (Sprint 1).
2. `doc/SPRINT_1_DESIGN_SYSTEM.md` — token & komponen yang wajib dipakai.
3. `doc/SPRINT_1_ASSET_GUIDE.md` — aturan gambar.

---

## A. Informasi Sprint

| | |
|---|---|
| **Sprint goal** (jobsheet) | Sprint ini bernilai bagi klien untuk meningkatkan pemasaran secara digital. |
| **Durasi** | 1 minggu (jobsheet J-01; PRD menyebut 2 minggu — ikut jobsheet). Sprint Planning: Selasa, 06 Oktober 2026. |
| **Scope** | Halaman publik: landing page, katalog (≥ 15 produk statis), detail produk, tombol WhatsApp, formulir buket custom (kirim via WhatsApp), cara pemesanan, FAQ, kontak. Responsif ponsel & desktop. |
| **Di luar scope** | Database produk, penyimpanan pesanan/permintaan custom ke basis data, formulir pemesanan produk, login admin, pembayaran, unggah gambar referensi (Sprint 2–3). Formulir buket custom Sprint 1 hanya mengirim detail lewat WhatsApp. |
| **Teknologi** | Laravel 13 + Inertia + React 19 (TypeScript) + Tailwind CSS 4. Jangan mengganti framework. |
| **Branch utama** | `main` (remote `origin` = `https://github.com/zinexsix/Aweflorist.git`) |

### A.1 Status saat ini (sudah ada di `main`)

Fondasi sudah tersedia dan berjalan: design tokens, komponen bersama, layout publik, rute `/`, `/katalog`, `/katalog/{slug}`, `/informasi`, `/buket-custom`, landing page lengkap (versi awal), 16 produk contoh dengan foto sementara, formulir buket custom (kirim lewat WhatsApp), dan test otomatis. Tugas Latif dan Prety adalah **menyempurnakan** bagian masing-masing — bukan membuat dari nol.

### A.2 Definition of Done (PRD Sprint 1 + kesepakatan tim)

- [ ] Kode tersimpan di repositori melalui Pull Request yang sudah di-merge ke `main`.
- [ ] Halaman utama, katalog, detail, dan informasi dapat dibuka tanpa login.
- [ ] Navigasi dasar dan semua tombol berfungsi (tidak ada `href="#"`).
- [ ] Diuji pada lebar 375 px (ponsel) dan 1440 px (desktop), tanpa scroll horizontal.
- [ ] `npm run check`, `npm run types:check`, dan `php artisan test` lulus.
- [ ] Tidak ada bug kritis yang menghalangi penelusuran katalog.
- [ ] Memakai komponen & token dari design system.

### A.3 Deliverable

1. Landing page (navbar, hero, profil, produk unggulan, kategori, promo, cara pesan, FAQ, CTA, footer).
2. Halaman katalog dengan ≥ 15 produk (foto, nama, kategori, harga), filter kategori dan pencarian.
3. Halaman detail produk dengan tombol "Pesan Sekarang" ke WhatsApp berisi pesan otomatis.
4. Halaman cara pemesanan, FAQ, dan kontak.
5. Design system, asset guide, dan dokumen ini.

### A.4 Dependensi antaranggota

```text
Rofiq: PR fondasi di-merge ke main  ──►  Latif & Prety mulai membuat branch dari main
Rofiq: foto produk di public/images  ──►  Latif mengisi field `image` di products.ts
PO: kontak, harga, promo, kebijakan  ──►  Prety (kontak/FAQ/promo), Latif (harga)
Latif & Prety: PR selesai            ──►  Rofiq review, merge, uji akhir, demo
```

**Latif dan Prety tidak perlu menunggu foto atau data PO** untuk mulai — komponen sudah punya placeholder.

### A.5 Pemetaan task jobsheet (bagian C)

| No | Task jobsheet | Penanggung jawab | Status |
|---|---|---|---|
| 1 | Setup repositori dan struktur proyek | Rofiq | Selesai (tunggu PR) |
| 2 | Menentukan stack teknologi dan hosting | Rofiq | Stack selesai; hosting belum |
| 3 | Wireframe/mockup dan panduan visual | Rofiq | Selesai (`doc/florify-html`, design system) |
| 4 | Navbar | Rofiq | Selesai |
| 5 | Hero section | Rofiq | Selesai (tunggu foto) |
| 6 | Profil singkat AweFlorist | Prety | Versi awal ada, isi cerita dari PO |
| 7 | Produk unggulan | Latif | Versi awal ada |
| 8 | Promo event | Prety | Versi awal (informasi unggulan), tunggu data promo |
| 9 | Footer kontak & media sosial | Rofiq (data dari Prety) | Selesai, tunggu data kontak |
| 10 | Data produk sementara (min. 15) | Latif | 16 data contoh ada, sesuaikan dengan produk asli |
| 11 | Komponen kartu produk | Latif | Versi awal ada |
| 12 | Halaman katalog responsif | Latif | Versi awal ada; filter chip & pencarian belum |
| 13 | Halaman detail produk | Latif | Versi awal ada; catatan kartu ucapan belum |
| 14 | Tombol Pesan Sekarang ke WhatsApp | Latif | Selesai di detail; perlu nomor WA |
| 15 | Halaman cara pemesanan & FAQ | Prety | Versi awal ada |
| 16 | Halaman kontak | Prety | Digabung di `/informasi#kontak`; tunggu data |
| — | Formulir buket custom (tambahan, PRD FR-19/20) | Rofiq (dibuat), Prety (isi & uji) | Versi awal ada di `/buket-custom`; kirim lewat WhatsApp, belum disimpan |

---

## B. Tabel tugas

> Path relatif dari folder proyek. **Hanya ubah file milik sendiri.** Perlu mengubah file orang lain? Kabari pemiliknya di grup dulu.

### B.1 Rofiq — Koordinator & integrasi

| | |
|---|---|
| **Tugas** | 1) Commit & PR fondasi (lihat §G.1). 2) Siapkan foto sesuai asset guide. 3) Isi `VITE_WHATSAPP_NUMBER` setelah dikonfirmasi PO. 4) Review & merge PR Latif/Prety. 5) Uji akhir & siapkan demo. |
| **File/folder** | `resources/css/app.css`, `resources/js/components/florify/*` (kecuali `product-*`), `resources/js/layouts/public-layout.tsx`, `resources/js/pages/public/home.tsx`, `resources/js/components/home/hero-section.tsx`, `resources/js/config/site.ts`, `resources/js/lib/*`, `resources/js/types/florify.ts`, `routes/web.php`, `vite.config.ts`, `public/images/**`, `doc/*.md`, `README.md` |
| **Output** | PR `feature/rofiq-design-system` ter-merge; foto di `public/images`; laporan uji akhir |
| **Dependensi** | Data dari PO (WA, foto) |
| **Kriteria penerimaan** | Semua halaman memakai layout & token yang sama; CI hijau; demo berjalan dari `main` |
| **Risiko konflik** | `site.ts` (Prety mengisi kontak) dan `products.ts` (Latif mengisi `image`) — koordinasikan siapa yang mengubah kapan. |

### B.2 Latif — Katalog & produk

| | |
|---|---|
| **Tugas** | 1) Sesuaikan 15+ data produk dengan produk asli dari PO (nama, kategori, deskripsi, harga). 2) Katalog: tambah **chip filter kategori** (pakai `BrandButton` variant `primary` aktif / `outline` tidak aktif, `aria-pressed`) dan **pencarian nama** (FR-07) dengan `EmptyState` saat tidak ada hasil. 3) Detail: tambah kolom "Pesan di kartu ucapan (opsional)" yang ikut masuk ke pesan WhatsApp (`productOrderMessage(product, note)`), pakai `components/ui/label` + textarea dengan gaya token. 4) Uji grid di 320/375/768/1024/1440 px. 5) Pasang foto produk setelah Rofiq menyediakannya. 6) Perbarui §3.5 design system jika menambah prop. |
| **File/folder** | `resources/js/pages/public/catalog.tsx`, `resources/js/pages/public/product-detail.tsx`, `resources/js/components/florify/product-card.tsx`, `product-image.tsx`, `product-meta.tsx`, `resources/js/components/home/featured-products-section.tsx`, `resources/js/data/products.ts`, `resources/js/data/catalog.ts` (bagian `categories`) |
| **Output** | PR `feature/latif-product-catalog` |
| **Dependensi** | PR fondasi Rofiq sudah di `main`; daftar produk & harga dari PO; foto dari Rofiq (tidak menghalangi) |
| **Kriteria penerimaan** | ≥ 15 produk tampil dengan foto/placeholder, nama, kategori, harga (US-04); filter & pencarian berfungsi, URL `?kategori=` tetap didukung; detail membuka WhatsApp dengan nama produk + catatan (US-06, US-07); tidak ada scroll horizontal di 320 px |
| **Risiko konflik** | `data/catalog.ts` juga dibaca Prety (bagian `occasions`). Latif hanya mengubah `categories`. |

### B.3 Prety — Section informasi & konten

| | |
|---|---|
| **Tugas** | 1) Lengkapi "Tentang kami" dengan cerita AweFlorist dari PO (tanpa angka/klaim yang belum pasti). 2) Kategori/acara: rapikan deskripsi; tambah foto kategori bila tersedia. 3) Promo: ganti teks informasi unggulan dengan promo resmi **hanya jika** nama, periode, syarat sudah dikonfirmasi. 4) FAQ & cara pemesanan: sesuaikan jawaban dengan kebijakan toko (waktu pesan, pengiriman, pembayaran). 5) Kontak: kumpulkan alamat, jam buka, Instagram/TikTok dari PO dan isi di `config/site.ts` (hanya field `address`, `openingHours`, `instagram`, `tiktok`). 6) Opsional bila disetujui: peta lokasi di `/informasi#kontak`. 7) Uji responsif. |
| **File/folder** | `resources/js/components/home/about-section.tsx`, `occasions-section.tsx`, `promo-section.tsx`, `order-info-section.tsx`, `resources/js/pages/public/info.tsx`, `resources/js/data/info.ts`, `resources/js/data/catalog.ts` (bagian `occasions`), `resources/js/config/site.ts` (hanya 4 field kontak) |
| **Output** | PR `feature/prety-content-sections` |
| **Dependensi** | PR fondasi Rofiq sudah di `main`; data kontak/promo/kebijakan dari PO |
| **Kriteria penerimaan** | Profil & promo tampil (US-02, US-03); halaman cara pemesanan, FAQ, kontak tersedia (US-08); footer menampilkan kontak yang sudah dikonfirmasi; accordion FAQ bisa dibuka dengan keyboard (Tab + Enter) |
| **Risiko konflik** | `config/site.ts` milik Rofiq → ubah hanya 4 field kontak dalam commit terpisah dan beri tahu Rofiq. `data/catalog.ts` → hanya bagian `occasions`. |

---

## C. Git workflow

### C.1 Aturan dasar

1. **Tidak ada yang commit atau push langsung ke `main`.** Semua perubahan masuk lewat Pull Request (PR) dan di-review minimal satu orang (Rofiq untuk PR Latif/Prety; Latif atau Prety untuk PR Rofiq).
2. Satu branch = satu kelompok tugas. Nama branch:
   - `feature/rofiq-design-system`
   - `feature/latif-product-catalog`
   - `feature/prety-content-sections`
   - `fix/<nama>-<masalah>` untuk perbaikan bug, mis. `fix/latif-gambar-detail`.
3. Buat branch terpisah hanya jika tugasnya bisa di-merge sendiri dan tidak saling bergantung (mis. Latif menyelesaikan katalog lebih dulu lalu membuat `feature/latif-product-detail`). Perubahan kecil (typo, ganti teks) cukup di branch yang sedang aktif.
4. Branch `frontend` dan `backend` yang ada di remote saat ini isinya sama dengan `main` dan **tidak dipakai** di Sprint 1. Jangan membuat PR ke branch tersebut kecuali tim memutuskan lain.
5. Selalu mulai hari dengan mengambil perubahan terbaru dari `main` (§D langkah 2–4, 12).
6. Dilarang tanpa persetujuan tim: `git push --force`, `git reset --hard`, menghapus branch orang lain, mengubah `package.json`/`composer.json`.

### C.2 Alur singkat

```text
main ─┬─────────────────────────●(merge PR Rofiq)───┬──────●(merge Latif)──●(merge Prety)──► demo
      └─ feature/rofiq-design-system ─● PR ─┘       ├─ feature/latif-product-catalog ─● PR ┘      ┘
                                                    └─ feature/prety-content-sections ─● PR ───────┘
```

---

## D. Command Git lengkap

Jalankan di terminal (Linux/macOS) atau **Git Bash** (Windows), di dalam folder proyek. Teks dalam `<...>` adalah placeholder yang harus diganti.

| No | Tujuan | Command | Kapan |
|---|---|---|---|
| 1 | Cek status | `git status` | Sebelum & sesudah setiap langkah. Pastikan tahu file apa yang berubah. |
| 2 | Unduh info terbaru | `git fetch origin` | Awal kerja, sebelum merge. |
| 3 | Pindah ke main | `git switch main` | Sebelum membuat branch baru. |
| 4 | Perbarui main | `git pull origin main` | Setelah pindah ke main. |
| 5 | Buat branch fitur | `git switch -c feature/<nama>-<tugas>` | Sekali, saat mulai tugas. |
| 5b | Pindah ke branch yang sudah ada | `git switch feature/<nama>-<tugas>` | Hari berikutnya. |
| 6 | Lihat perubahan | `git status` lalu `git diff` (q untuk keluar) | Sebelum `git add`. Baca diff — terutama hasil AI. |
| 7 | Tambah perubahan | `git add <path-file>` (contoh: `git add resources/js/pages/public/catalog.tsx`) | Tambahkan file milik sendiri satu per satu. Hindari `git add .` |
| 7b | Batalkan `git add` | `git restore --staged <path-file>` | Jika salah menambahkan file. |
| 8 | Commit | `git commit -m "feat(katalog): tambah filter kategori"` | Setelah `npm run check` lulus. Awalan: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`. |
| 9 | Push branch | Pertama kali: `git push -u origin feature/<nama>-<tugas>` · selanjutnya: `git push` | Setelah commit. |
| 10 | Buat PR | GitHub → repo `zinexsix/Aweflorist` → tombol **Compare & pull request** → base `main`, compare `feature/...` → isi deskripsi (template §F) → **Create pull request**. Alternatif CLI (jika `gh` terpasang): `gh pr create --base main --fill` | Saat tugas siap di-review. |
| 11 | Ambil main terbaru ke branch fitur | `git fetch origin` lalu `git merge origin/main` | Jika PR lain sudah di-merge, atau GitHub bilang "branch is out-of-date". |
| 12 | Setelah PR di-merge | `git switch main` → `git pull origin main` | Agar main lokal sama dengan GitHub. |
| 13 | Cek sebelum merge | `git status` (harus bersih) · `git log --oneline -5` · `npm run check` · `npm run types:check` · `php artisan test` | Sebelum minta review / sebelum klik merge. |
| 14 | Hapus branch lokal yang sudah di-merge | `git branch -d feature/<nama>-<tugas>` (huruf kecil `-d`, aman: menolak jika belum di-merge) | Setelah langkah 12. |

### D.1 Menyelesaikan konflik secara aman

Konflik muncul saat `git merge origin/main` jika dua orang mengubah baris yang sama.

1. Jangan panik dan **jangan** menjalankan `git reset --hard` atau memilih "accept all" begitu saja.
2. `git status` → file berstatus `both modified` adalah file yang konflik.
3. Buka file tersebut di editor (VS Code menampilkan tombol *Accept Current / Incoming / Both*). Bagian konflik berbentuk:
   ```text
   <<<<<<< HEAD
   versi di branch kamu
   =======
   versi dari main
   >>>>>>> origin/main
   ```
4. Gabungkan **secara manual**: pertahankan perubahan kamu *dan* perubahan orang lain bila keduanya diperlukan. Hapus semua penanda `<<<<<<<`, `=======`, `>>>>>>>`.
5. Jika file konflik milik orang lain dan kamu tidak yakin, hubungi pemiliknya sebelum melanjutkan.
6. Uji: `npm run check`, `npm run types:check`, buka halaman di browser.
7. `git add <file-yang-konflik>` lalu `git commit` (pesan merge otomatis sudah terisi; simpan dan tutup editor).
8. `git push`.
9. Mau membatalkan merge yang sedang berlangsung (sebelum commit)? `git merge --abort` — aman, branch kembali seperti sebelum merge.

### D.2 Perintah berisiko (baca sebelum memakai)

| Perintah | Akibat | Alternatif aman |
|---|---|---|
| `git reset --hard` | Menghapus **permanen** semua perubahan yang belum di-commit | `git stash` (simpan sementara), `git restore <file>` untuk satu file |
| `git push --force` | Menimpa riwayat di GitHub; pekerjaan orang lain bisa hilang | `git merge origin/main` lalu `git push` biasa |
| `git branch -D` (huruf besar) | Menghapus branch walau belum di-merge | `git branch -d` (huruf kecil) |
| `git add .` / `git add -A` | Bisa ikut menambahkan `.env`, file sementara, atau file orang lain | `git add <path>` per file |

---

## E. Workflow dengan OpenCode (atau tanpa AI)

OpenCode hanyalah **alat bantu menulis kode**. Alat kolaborasi tim adalah **Git + GitHub**. Semua langkah di dokumen ini bisa dijalankan tanpa AI sama sekali.

### E.1 Persiapan sekali saja

1. Install: Git, PHP ≥ 8.3, Composer, Node.js 22, editor (VS Code).
2. Clone & jalankan proyek:
   ```bash
   git clone https://github.com/zinexsix/Aweflorist.git
   cd Aweflorist
   composer setup          # install, .env, key, migrasi, build
   composer dev            # buka http://localhost:8000
   ```
   Jika `composer dev` bermasalah, buka 2 terminal: `npm run dev` dan `php artisan serve`.
3. (Opsional) OpenCode versi gratis: ikuti petunjuk resmi di <https://opencode.ai>, pilih model gratis yang tersedia. Jalankan `opencode` dari folder proyek. File konfigurasi OpenCode (`opencode.json`) sudah di-ignore oleh Git — jangan di-commit.

### E.2 Cara kerja harian (dengan atau tanpa OpenCode)

1. `git switch main` → `git pull origin main` → `git switch feature/<nama>-<tugas>` → `git merge main`.
2. Baca PRD, design system, asset guide, dan bagian tugasmu di dokumen ini.
3. Pilih **satu tugas kecil** (mis. "chip filter kategori").
4. Kerjakan sendiri di editor **atau** minta OpenCode dengan prompt di §E.4.
5. Periksa hasil: `git diff` — pastikan hanya file milikmu yang berubah dan kodenya kamu pahami.
6. Jalankan `npm run check`, `npm run types:check`, `php artisan test`, buka halaman di browser (ponsel: DevTools → *Toggle device toolbar*, lebar 375).
7. Commit & push sendiri (§G).

Jika OpenCode tidak bisa dijalankan (kuota habis, error, internet lambat): lanjutkan secara manual dengan menyalin pola dari komponen yang sudah ada — contoh terlengkap ada di `resources/js/pages/public/catalog.tsx` dan `resources/js/components/home/*`.

### E.3 Aturan saat memakai AI

- Satu prompt = satu tugas kecil. Jangan minta "buatkan seluruh website".
- AI **dilarang**: mengganti framework, menambah dependensi, menghapus/merombak file di luar tugasmu, menulis warna hex baru, mengarang harga/promo/kontak.
- Jika AI mengubah file di luar daftar milikmu: batalkan dengan `git restore <file>`.
- AI tidak boleh menjalankan `git commit`/`git push` untukmu. Kamu yang memeriksa dan commit.
- Kamu tetap bertanggung jawab atas kode — harus bisa menjelaskannya saat review/demo.

### E.4 Contoh prompt OpenCode

**Latif — filter kategori & pencarian katalog**

```text
Kamu membantu proyek Florify (Laravel 13 + Inertia + React 19 + TypeScript + Tailwind 4).
Jangan mengganti framework dan jangan menambah dependensi.

1. Baca dulu: PRD_Florify.md (bagian 4.1 FR-07, FR-08, FR-11), doc/SPRINT_1_DESIGN_SYSTEM.md,
   dan bagian "B.2 Latif" di doc/SPRINT_1_WORK_DISTRIBUTION.md.
2. Baca file: resources/js/pages/public/catalog.tsx, resources/js/data/catalog.ts,
   resources/js/data/products.ts, resources/js/components/florify/brand-button.tsx,
   resources/js/components/florify/empty-state.tsx.
3. Tugas: di catalog.tsx tambahkan (a) chip filter kategori dari `categories`
   memakai BrandButton (variant primary saat aktif, outline saat tidak, atribut aria-pressed),
   dan (b) input pencarian nama produk dengan <label> yang terlihat.
   Filter lewat URL ?kategori= dan ?acara= yang sudah ada harus tetap berfungsi.
   Saat tidak ada hasil tampilkan EmptyState.
4. HANYA ubah resources/js/pages/public/catalog.tsx. Jika file lain perlu diubah, tanyakan dulu.
5. Gunakan class token dari design system (mis. text-ink-muted, border-line, rounded-full),
   jangan menulis warna hex. Tinggi elemen klik minimal min-h-tap.
6. Setelah selesai, laporkan: file yang berubah, ringkasan perubahan, dan cara mengujinya
   (URL dan langkah di browser). Jangan menjalankan git commit atau git push.
```

**Latif — catatan kartu ucapan di detail produk**

```text
Proyek Florify (Laravel + Inertia + React + TS + Tailwind 4). Baca doc/SPRINT_1_DESIGN_SYSTEM.md
dan resources/js/pages/public/product-detail.tsx serta resources/js/lib/whatsapp.ts.
Tambahkan textarea opsional "Pesan di kartu ucapan" (pakai Label dari @/components/ui/label,
maks. 200 karakter, border-line, rounded-card) di halaman detail. Isi textarea harus ikut
masuk ke pesan WhatsApp lewat productOrderMessage(product, note) yang sudah ada.
Hanya ubah product-detail.tsx. Jangan menambah dependensi. Laporkan file yang berubah dan cara menguji.
```

**Prety — kontak & FAQ**

```text
Kamu membantu proyek Florify (Laravel 13 + Inertia + React 19 + TypeScript + Tailwind 4).
Jangan mengganti framework dan jangan menambah dependensi.

1. Baca dulu: PRD_Florify.md (bagian 4.1 FR-09, 10.2, 15), doc/SPRINT_1_DESIGN_SYSTEM.md,
   dan bagian "B.3 Prety" di doc/SPRINT_1_WORK_DISTRIBUTION.md.
2. Baca file: resources/js/data/info.ts, resources/js/pages/public/info.tsx,
   resources/js/components/florify/faq-list.tsx, resources/js/config/site.ts.
3. Tugas: perbarui jawaban FAQ di data/info.ts dengan data berikut dari pemilik toko:
   <tempel di sini kebijakan resmi: waktu pemesanan, pengiriman, pembayaran>.
   Lalu isi field address, openingHours, instagram, tiktok di config/site.ts dengan:
   <tempel data kontak resmi>. Jangan mengubah field lain di site.ts.
4. HANYA ubah resources/js/data/info.ts dan resources/js/config/site.ts.
5. Jangan mengarang informasi. Jika data tidak ada, biarkan nilai lama / null.
6. Laporkan file yang berubah dan cara mengujinya (buka /informasi dan footer).
   Jangan menjalankan git commit atau git push.
```

**Prety — section Tentang kami**

```text
Proyek Florify (Laravel + Inertia + React + TS + Tailwind 4). Baca doc/SPRINT_1_DESIGN_SYSTEM.md
dan resources/js/components/home/about-section.tsx. Ganti paragraf dan tiga highlight dengan
cerita AweFlorist berikut: <tempel teks dari PO>. Pertahankan struktur komponen, class token,
dan heading yang ada; jangan menambah angka/statistik yang tidak ada di teks tersebut.
Hanya ubah about-section.tsx. Laporkan file yang berubah dan cara menguji di 375px dan 1440px.
```

---

## F. Checklist sebelum Pull Request

Salin ke deskripsi PR dan centang:

```markdown
## Ringkasan
<apa yang diubah dan user story terkait, mis. US-04>

## Cara menguji
1. `git switch <nama-branch>` → `npm run dev` + `php artisan serve`
2. Buka <URL> …
3. Cek di lebar 375px dan 1440px

## Checklist
- [ ] Perubahan sesuai tugas di SPRINT_1_WORK_DISTRIBUTION.md dan PRD
- [ ] Hanya file milik saya yang berubah (`git diff --stat origin/main`)
- [ ] Tidak menghapus/menimpa pekerjaan anggota lain
- [ ] Tidak ada `.env`, password, token, atau file pribadi yang ikut ter-commit
- [ ] Tidak ada path gambar rusak (gambar tampil atau placeholder)
- [ ] Tidak ada error di console browser (F12 → Console)
- [ ] Diuji di mobile (375px) dan desktop (1440px), tidak ada scroll horizontal
- [ ] Tidak menambah/mengubah dependensi (package.json, composer.json)
- [ ] Kode sudah saya baca dan pahami, bukan diterima mentah dari AI
- [ ] `npm run check`, `npm run types:check`, `php artisan test` lulus
- [ ] Pesan commit jelas (feat/fix/docs: …)
```

---

## G. Panduan push per anggota

> Prinsip: setiap orang **push ke branch fitur miliknya sendiri**, lalu membuat PR ke `main`. Tidak ada yang push langsung ke `main`.

### Persiapan sekali (semua anggota)

```bash
git config --global user.name "<Nama Lengkap>"
git config --global user.email "<email-yang-terdaftar-di-github>"
git remote -v      # harus menampilkan origin https://github.com/zinexsix/Aweflorist.git
```

Pastikan akun GitHub kamu sudah diundang sebagai *collaborator* repo `zinexsix/Aweflorist` (minta pemilik repo). Saat `git push` pertama kali meminta password, gunakan **Personal Access Token** (GitHub → Settings → Developer settings → Personal access tokens → *Fine-grained*, akses repo Aweflorist: Contents *Read and write*, Pull requests *Read and write*), bukan password akun. Alternatif: `gh auth login` jika GitHub CLI terpasang.

### G.1 Rofiq — push fondasi (dikerjakan pertama)

Perubahan fondasi saat ini masih **belum di-commit** di branch `main` lokal. Pindahkan ke branch fitur (perubahan ikut pindah, tidak hilang):

```bash
cd ~/Aweflorist
git status                                   # lihat daftar perubahan
git switch -c feature/rofiq-design-system    # buat branch baru, membawa perubahan
```

**Perhatian — folder `doc/florify-html/`** berisi repo Git terpisah (`qifor27/florify-design`, ada folder `.git` di dalamnya). Jangan `git add doc/` sekaligus, karena Git akan menambahkannya sebagai *embedded repository* (folder kosong di GitHub). Pilih salah satu:

- **(A, disarankan)** Biarkan mockup tetap di repo `florify-design` dan jangan di-commit ke repo ini.
- **(B)** Jika tim ingin mockup ikut di repo ini: pindahkan dulu riwayat Git-nya ke luar proyek — `mv doc/florify-html/.git ~/florify-design-git-backup` — baru tambahkan `doc/florify-html/*.html`.

Tambahkan file satu per satu per kelompok, lalu commit:

```bash
# 1. Design tokens, konfigurasi, rute
git add resources/css/app.css vite.config.ts routes/web.php .env.example
git add resources/js/app.tsx resources/js/types/ resources/js/config/ resources/js/lib/whatsapp.ts resources/js/lib/format.ts
git commit -m "feat(design-system): tambah design tokens, font, dan rute publik Florify"

# 2. Komponen bersama, layout, section, halaman, data
git add resources/js/components/florify/ resources/js/components/home/ resources/js/layouts/public-layout.tsx
git add resources/js/pages/public/ resources/js/data/
git commit -m "feat(landing): komponen reusable, landing page, katalog, detail, dan informasi"

# 3. Folder gambar, test, dokumentasi
git add public/images/ tests/Feature/PublicPagesTest.php
git add README.md PRD_Florify.md doc/SPRINT_1_DESIGN_SYSTEM.md doc/SPRINT_1_ASSET_GUIDE.md doc/SPRINT_1_WORK_DISTRIBUTION.md doc/sprint-1/
git add doc/Jobsheet-J01-Sprint-Planning-dan-Sprint-Backlog.docx
git commit -m "docs: design system, asset guide, pembagian kerja Sprint 1"

git status                                   # sisa hanya doc/florify-html/ (jika memilih opsi A)
npm run check && npm run types:check && php artisan test
git push -u origin feature/rofiq-design-system
```

Lalu buka GitHub → **Compare & pull request** → base `main` → minta Latif atau Prety me-review → setelah disetujui dan CI hijau, klik **Merge pull request**. Umumkan di grup: "Fondasi sudah di main, silakan mulai."

Setiap kali menambahkan foto atau perbaikan berikutnya:

```bash
git switch main && git pull origin main
git switch -c feature/rofiq-assets            # atau fix/rofiq-<masalah>
# ... salin foto ke public/images/..., isi path di config/site.ts ...
git add public/images/hero/hero-florist.webp resources/js/config/site.ts
git commit -m "feat(assets): tambah foto hero"
git push -u origin feature/rofiq-assets
```

Saat me-review PR Latif/Prety: buka tab **Files changed**, pastikan hanya file milik mereka yang berubah, jalankan di lokal (`git fetch origin` → `git switch feature/latif-product-catalog` → `npm run dev`), baru **Merge**. Setelah merge: `git switch main && git pull origin main`.

### G.2 Latif — push katalog & produk

Mulai **setelah** PR fondasi Rofiq di-merge.

```bash
cd Aweflorist
git switch main
git pull origin main
git switch -c feature/latif-product-catalog
npm install                                   # bila ada perubahan dependensi dari main
```

Setelah satu bagian selesai (mis. filter kategori):

```bash
git status
git diff                                      # baca perubahan
npm run check && npm run types:check && php artisan test
git add resources/js/pages/public/catalog.tsx
git commit -m "feat(katalog): tambah chip filter kategori dan pencarian"
git push -u origin feature/latif-product-catalog     # pertama kali
```

Commit berikutnya di branch yang sama:

```bash
git add resources/js/pages/public/product-detail.tsx
git commit -m "feat(detail): catatan kartu ucapan ikut ke pesan WhatsApp"
git push
```

Jika `main` sudah berubah (mis. PR Prety di-merge lebih dulu):

```bash
git fetch origin
git merge origin/main         # selesaikan konflik bila ada (§D.1)
git push
```

Buat PR: GitHub → **Compare & pull request** → base `main` ← compare `feature/latif-product-catalog` → isi template §F → reviewer: Rofiq. Setelah di-merge:

```bash
git switch main
git pull origin main
git branch -d feature/latif-product-catalog
```

### G.3 Prety — push section konten

Mulai **setelah** PR fondasi Rofiq di-merge.

```bash
cd Aweflorist
git switch main
git pull origin main
git switch -c feature/prety-content-sections
npm install
```

Setelah satu bagian selesai (mis. FAQ):

```bash
git status
git diff
npm run check && npm run types:check && php artisan test
git add resources/js/data/info.ts
git commit -m "feat(info): perbarui FAQ sesuai kebijakan toko"
git push -u origin feature/prety-content-sections     # pertama kali
```

Perubahan kontak di `config/site.ts` (file milik Rofiq) dibuat **dalam commit terpisah** agar mudah di-review:

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

Jika `main` sudah berubah:

```bash
git fetch origin
git merge origin/main         # selesaikan konflik bila ada (§D.1)
git push
```

Buat PR: base `main` ← compare `feature/prety-content-sections` → isi template §F → reviewer: Rofiq. Setelah di-merge:

```bash
git switch main
git pull origin main
git branch -d feature/prety-content-sections
```

### G.4 Masalah umum saat push

| Pesan | Arti | Solusi |
|---|---|---|
| `rejected ... (fetch first)` / `non-fast-forward` | Ada commit baru di branch remote yang belum kamu punya | `git pull` (atau `git fetch origin && git merge origin/<branch>`) lalu `git push`. **Jangan** `--force`. |
| `Permission denied` / `403` | Akun belum jadi collaborator atau token salah | Minta undangan repo; buat token baru dengan akses *Contents: Read and write*. |
| `src refspec ... does not match any` | Belum ada commit di branch | Lakukan `git add` + `git commit` dulu. |
| `Your local changes would be overwritten` saat `git switch`/`pull` | Ada perubahan belum di-commit | Commit dulu, atau `git stash` → lakukan perintah → `git stash pop`. |
| `has no upstream branch` | Push pertama tanpa `-u` | `git push -u origin <nama-branch>` |
| Tidak sengaja commit di `main` lokal | — | `git switch -c feature/<nama>-<tugas>` (commit ikut pindah), lalu push branch itu. Jangan push `main`. |

---

## H. Checklist integrasi akhir (Rofiq)

- [ ] Semua PR Sprint 1 di-merge ke `main`, CI GitHub Actions hijau.
- [ ] `git switch main && git pull origin main && composer setup` di folder bersih berhasil.
- [ ] Uji manual di 320, 375, 390/430, 768, 1024, 1440 px: navbar, menu mobile (buka/tutup, Esc, Tab), hero, grid produk, kartu kategori, FAQ, footer.
- [ ] Semua link navbar/footer/kartu menuju halaman yang benar; tombol WhatsApp membuka nomor yang benar dengan pesan otomatis.
- [ ] Gambar tampil, tidak melar; placeholder muncul untuk produk tanpa foto.
- [ ] Console browser bebas error.
- [ ] `site.isSampleData` diubah ke `false` hanya jika harga & produk sudah resmi.
- [ ] Item yang belum selesai dicatat ke backlog Sprint 2.
