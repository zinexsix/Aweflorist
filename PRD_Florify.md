# PRD Florify
## Sistem Informasi Pemesanan dan Manajemen Pelanggan Berbasis Web pada AweFlorist

**Versi dokumen:** 1.0  
**Status:** Draft untuk validasi pemilik  
**Metode pengembangan:** Scrum  
**Estimasi durasi:** 4 sprint × 2 minggu (8 minggu)

---

## 1. Ringkasan Produk

Florify adalah sistem informasi berbasis web untuk mendukung proses pemesanan dan pengelolaan pelanggan pada AweFlorist. Sistem ini menyediakan katalog produk, informasi buket berdasarkan acara, formulir pemesanan dan permintaan buket custom, serta panel admin untuk mengelola produk, pesanan, pelanggan, pembayaran, persediaan, dan tindak lanjut pesanan.

Florify ditujukan untuk mengurangi ketergantungan pada pencatatan manual dan percakapan chat sebagai satu-satunya sumber informasi pesanan. WhatsApp tetap digunakan sebagai kanal komunikasi pelanggan, sedangkan data pesanan dan operasional utama dicatat di sistem.

### 1.1 Latar Belakang

AweFlorist menawarkan berbagai jenis buket, seperti buket bunga segar, buket custom, buket uang, buket satu tangkai, dan buket untuk acara tertentu—misalnya wisuda, ulang tahun, serta anniversary. Promosi dilakukan melalui media sosial, sementara komunikasi dan pemesanan banyak berlangsung melalui WhatsApp.

Proses tersebut berpotensi menimbulkan pesan pelanggan yang terlewat atau terlambat ditanggapi, detail pesanan yang tersebar di chat, riwayat pelanggan yang tidak terpusat, serta pencatatan stok dan pembayaran yang masih manual. Florify dirancang untuk membantu menyatukan informasi tersebut melalui sistem web yang sederhana dan mudah digunakan.

### 1.2 Pernyataan Masalah

1. Informasi produk dan pilihan buket belum tersaji dalam satu katalog web yang terstruktur.
2. Permintaan buket custom dan detail pesanan berisiko tersebar di percakapan.
3. Riwayat pelanggan dan pesanan belum terpusat.
4. Pemilik/admin memerlukan cara yang lebih teratur untuk memantau status pesanan dan pembayaran.
5. Pencatatan stok serta daftar pesanan yang perlu ditindaklanjuti masih berpotensi dilakukan secara manual.
6. Keterbatasan waktu dapat membuat promosi dan tindak lanjut pesanan tidak konsisten.

### 1.3 Tujuan Produk

- Menyediakan katalog produk yang dapat diakses melalui browser desktop maupun ponsel.
- Mempermudah pelanggan mengirim detail pesanan dan permintaan buket custom.
- Menyimpan data pesanan secara terstruktur dan menghasilkan nomor pesanan.
- Memusatkan pengelolaan produk, pesanan, pelanggan, pembayaran, dan stok.
- Membantu admin menemukan pesanan yang belum dikonfirmasi atau belum lunas.
- Mempertahankan WhatsApp sebagai kanal komunikasi yang mudah digunakan.

### 1.4 Indikator Keberhasilan Awal

Target berikut merupakan usulan awal dan perlu dikonfirmasi setelah uji coba:

- Seluruh pesanan yang dikirim melalui formulir Florify tersimpan di basis data.
- Setiap pesanan memiliki nomor pesanan unik.
- Admin dapat melihat dan memperbarui status pesanan dari dashboard.
- Detail produk, harga, dan stok dapat dikelola tanpa mengubah kode program.
- Tampilan utama dan formulir dapat digunakan pada layar ponsel.
- Pengujian penerimaan pengguna (UAT) tidak menemukan masalah kritis yang menghalangi alur pemesanan utama.

---

## 2. Deskripsi Produk

### 2.1 Pengguna dan Aktor

**Pelanggan**
- Melihat katalog dan detail produk.
- Menelusuri produk berdasarkan kategori atau acara.
- Mengirim formulir pemesanan.
- Mengirim permintaan buket custom.
- Menghubungi AweFlorist melalui WhatsApp.

**Admin/Pemilik**
- Masuk ke panel admin.
- Mengelola produk, kategori, dan informasi acara.
- Memantau dan memperbarui status pesanan.
- Mengelola data pelanggan dan pembayaran.
- Memperbarui data stok.
- Melihat daftar pesanan yang memerlukan tindak lanjut.

Pada MVP, admin dan pemilik dianggap sebagai satu jenis aktor. Pembagian hak akses yang lebih terperinci dapat ditambahkan pada pengembangan berikutnya.

### 2.2 Ruang Lingkup MVP

**Termasuk dalam MVP**
- Landing page/profil usaha.
- Katalog produk dan kategori.
- Daftar buket berdasarkan acara.
- Halaman detail produk.
- Formulir pemesanan.
- Formulir permintaan buket custom.
- Tombol kontak/pemesanan melalui WhatsApp.
- Login admin.
- Dashboard admin.
- CRUD produk dan kategori.
- Pengelolaan status pesanan.
- Pencatatan pembayaran.
- Riwayat pelanggan dan pesanan.
- Pencatatan stok sederhana.
- Daftar tindak lanjut untuk pesanan belum dikonfirmasi atau belum lunas.
- Validasi input, pengujian, dokumentasi, dan deployment.

**Tidak termasuk dalam MVP**
- Payment gateway dan pembayaran otomatis.
- Integrasi API pesan masuk Instagram/Facebook/WhatsApp.
- Aplikasi mobile native.
- Pelacakan kurir secara langsung.
- Rekomendasi produk berbasis AI.
- Kustomisasi komposisi setiap tangkai bunga secara rinci.
- Sistem akuntansi lengkap.
- Multi-cabang atau multi-gudang kompleks.
- Program loyalitas dan poin pelanggan.

---

## 3. Alur Pengguna Utama

### 3.1 Alur Pemesanan Produk

1. Pelanggan membuka landing page Florify.
2. Pelanggan melihat katalog atau memilih kategori/acara.
3. Pelanggan membuka halaman detail produk.
4. Pelanggan memilih tombol pemesanan.
5. Pelanggan mengisi data kontak, detail pesanan, tanggal kebutuhan, dan catatan.
6. Sistem memvalidasi data yang dikirim.
7. Sistem menyimpan pesanan dan membuat nomor pesanan.
8. Sistem menampilkan konfirmasi bahwa permintaan berhasil dikirim.
9. Pelanggan dapat melanjutkan komunikasi dengan admin melalui WhatsApp.

### 3.2 Alur Permintaan Buket Custom

1. Pelanggan membuka halaman buket custom.
2. Pelanggan mengisi anggaran, warna/tema, jenis buket, tanggal kebutuhan, dan catatan.
3. Pelanggan dapat melampirkan gambar referensi jika fitur unggah diaktifkan.
4. Sistem memvalidasi dan menyimpan permintaan.
5. Admin memeriksa permintaan dan menghubungi pelanggan untuk mengonfirmasi detail serta harga.
6. Setelah disepakati, admin memperbarui status permintaan/pesanan sesuai proses operasional.

Kustomisasi dibuat sederhana. Pelanggan tidak perlu memilih setiap tangkai bunga satu per satu.

### 3.3 Alur Admin

1. Admin masuk menggunakan akun yang sah.
2. Admin melihat ringkasan pesanan dan tindak lanjut.
3. Admin membuka daftar pesanan dan memeriksa detail.
4. Admin memperbarui status pesanan dan mencatat pembayaran.
5. Admin mengelola produk, kategori, dan stok sesuai kebutuhan.
6. Admin menggunakan riwayat pelanggan untuk melihat transaksi sebelumnya.

---

## 4. Persyaratan Fungsional

Prioritas:
- **Must:** wajib tersedia pada MVP.
- **Should:** diupayakan tersedia pada MVP jika kapasitas mencukupi.

### 4.1 Halaman Publik dan Katalog

| ID | Persyaratan | Prioritas |
|---|---|---|
| FR-01 | Sistem menampilkan landing page berisi identitas, ringkasan layanan, dan ajakan melihat katalog. | Must |
| FR-02 | Sistem menampilkan navigasi ke katalog, kategori/acara, cara pemesanan, dan kontak. | Must |
| FR-03 | Sistem menampilkan daftar produk beserta nama, gambar, harga atau keterangan harga, dan status ketersediaan jika relevan. | Must |
| FR-04 | Sistem menyediakan halaman detail produk. | Must |
| FR-05 | Sistem mengelompokkan produk berdasarkan kategori. | Must |
| FR-06 | Sistem menyediakan daftar produk berdasarkan acara, misalnya wisuda atau ulang tahun. | Should |
| FR-07 | Sistem menyediakan pencarian sederhana berdasarkan nama produk. | Should |
| FR-08 | Sistem menyediakan filter kategori atau acara jika data mendukung. | Should |
| FR-09 | Sistem menampilkan informasi cara pemesanan, FAQ, dan kontak. | Must |
| FR-10 | Sistem menyediakan tombol WhatsApp dengan pesan awal yang relevan jika memungkinkan. | Must |
| FR-11 | Halaman publik menampilkan kondisi yang sesuai ketika belum ada produk atau pencarian tidak menemukan hasil. | Must |
| FR-12 | Halaman publik dapat digunakan pada ukuran layar ponsel, tablet, dan desktop. | Must |

### 4.2 Pemesanan dan Buket Custom

| ID | Persyaratan | Prioritas |
|---|---|---|
| FR-13 | Pelanggan dapat mengirim formulir pemesanan produk. | Must |
| FR-14 | Formulir meminta data minimum yang diperlukan, seperti nama, nomor WhatsApp, produk, jumlah, tanggal kebutuhan, dan catatan. | Must |
| FR-15 | Sistem memvalidasi kolom wajib dan format data di sisi server. | Must |
| FR-16 | Sistem menyimpan pesanan ke basis data setelah validasi berhasil. | Must |
| FR-17 | Sistem menghasilkan nomor pesanan yang unik. | Must |
| FR-18 | Sistem menampilkan konfirmasi pengiriman pesanan. | Must |
| FR-19 | Pelanggan dapat mengirim permintaan buket custom. | Must |
| FR-20 | Formulir custom mencakup anggaran, warna/tema, jenis buket, tanggal kebutuhan, dan catatan. | Must |
| FR-21 | Sistem dapat menerima gambar referensi dengan batas ukuran dan tipe berkas yang ditentukan. | Should |
| FR-22 | Admin dapat menghubungi pelanggan melalui nomor kontak yang dicatat. | Must |
| FR-23 | Sistem dapat menampilkan tautan WhatsApp untuk melanjutkan komunikasi, tanpa menganggap pesan WhatsApp sebagai bukti bahwa pesanan sudah dikonfirmasi. | Must |

### 4.3 Panel Admin

| ID | Persyaratan | Prioritas |
|---|---|---|
| FR-24 | Admin dapat masuk menggunakan akun terdaftar. | Must |
| FR-25 | Sistem melindungi halaman admin agar hanya dapat diakses setelah autentikasi. | Must |
| FR-26 | Admin dapat menambah, melihat, mengubah, dan menghapus/menonaktifkan produk. | Must |
| FR-27 | Admin dapat mengelola kategori produk. | Must |
| FR-28 | Admin dapat mengelola informasi acara dan keterkaitannya dengan produk jika fitur acara diaktifkan. | Should |
| FR-29 | Admin dapat melihat daftar dan detail pesanan. | Must |
| FR-30 | Admin dapat memperbarui status pesanan. | Must |
| FR-31 | Admin dapat mencatat pembayaran, termasuk nominal, tanggal, metode, dan status verifikasi. | Must |
| FR-32 | Admin dapat melihat riwayat pesanan berdasarkan pelanggan. | Must |
| FR-33 | Admin dapat memperbarui jumlah stok yang dikelola sistem. | Should |
| FR-34 | Sistem mencatat perubahan stok sebagai pergerakan stok jika fitur inventaris diaktifkan. | Should |
| FR-35 | Dashboard menampilkan ringkasan operasional dasar, misalnya jumlah pesanan berdasarkan status dan pesanan yang perlu ditindaklanjuti. | Must |
| FR-36 | Admin dapat melihat daftar pesanan belum dikonfirmasi atau belum lunas. | Must |

---

## 5. Kriteria Penerimaan

### 5.1 Katalog Produk

- Pengunjung dapat membuka katalog tanpa login.
- Setiap kartu produk menampilkan informasi utama yang tersedia.
- Pengunjung dapat membuka halaman detail produk.
- Jika tidak ada produk yang tersedia, sistem menampilkan pesan yang jelas dan tidak mengalami error.

### 5.2 Formulir Pemesanan

- Formulir tidak dapat dikirim jika kolom wajib tidak valid.
- Pesanan valid tersimpan satu kali dan memperoleh nomor pesanan unik.
- Setelah penyimpanan berhasil, pelanggan menerima konfirmasi di halaman.
- Jika terjadi kegagalan penyimpanan, sistem menampilkan pesan yang mudah dipahami dan tidak menyatakan pesanan berhasil.
- Data pelanggan dan pesanan yang tersimpan dapat ditemukan oleh admin.

### 5.3 Pengelolaan Pesanan

- Admin yang sudah login dapat melihat daftar pesanan.
- Admin dapat membuka detail pesanan dan mengubah statusnya.
- Status pesanan dan status pembayaran disimpan sebagai informasi terpisah.
- Perubahan status dapat terlihat ketika halaman daftar/detail dimuat kembali.
- Pengunjung yang belum login tidak dapat mengakses halaman pengelolaan pesanan.

### 5.4 Permintaan Buket Custom

- Pelanggan dapat mengirim permintaan dengan mengisi data minimum yang diwajibkan.
- Permintaan tersimpan dan dapat dilihat admin.
- Gambar referensi—jika fitur ini diaktifkan—divalidasi tipe dan ukurannya.
- Permintaan custom tidak otomatis dianggap sebagai pesanan final sebelum detail dan harga disepakati.

---

## 6. Aturan Bisnis

1. Setiap pesanan memiliki nomor pesanan unik.
2. Status pesanan dan status pembayaran harus dipisahkan.
3. Status pesanan yang disarankan: `Baru`, `Menunggu Konfirmasi`, `Dikonfirmasi`, `Diproses`, `Siap Diambil/Dikirim`, `Selesai`, dan `Dibatalkan`.
4. Status pembayaran yang disarankan: `Belum Dibayar`, `DP`, `Lunas`, `Dikembalikan`, atau `Tidak Berlaku`.
5. Pembayaran yang dicatat admin tidak otomatis berarti pembayaran telah diverifikasi; status verifikasi harus eksplisit.
6. Permintaan buket custom belum menjadi pesanan final sampai admin dan pelanggan menyepakati detail serta harga.
7. Harga dan nama produk yang disimpan pada item pesanan sebaiknya berupa snapshot saat pesanan dibuat agar riwayat tidak berubah ketika katalog diperbarui.
8. Produk yang sudah pernah digunakan pada pesanan sebaiknya dinonaktifkan, bukan dihapus permanen, untuk menjaga riwayat.
9. Stok produk jadi dan stok bahan baku bunga dapat berbeda. MVP hanya perlu mengelola jenis stok yang benar-benar digunakan AweFlorist.
10. Perubahan jumlah stok harus divalidasi agar tidak menghasilkan nilai negatif kecuali pemilik secara eksplisit mengizinkannya.
11. Pesanan yang dikirim melalui formulir berstatus awal `Baru` atau `Menunggu Konfirmasi`; sistem tidak boleh menganggapnya sudah dikonfirmasi hanya karena pelanggan mengeklik WhatsApp.
12. Zona waktu aplikasi mengikuti lokasi operasional AweFlorist dan dikonfirmasi saat konfigurasi deployment.

---

## 7. Persyaratan Nonfungsional

| ID | Area | Persyaratan |
|---|---|---|
| NFR-01 | Responsif | Halaman utama, katalog, detail, dan formulir harus nyaman digunakan pada ponsel maupun desktop. |
| NFR-02 | Performa | Halaman utama dan katalog ditargetkan dapat digunakan dengan cepat pada koneksi internet umum; gambar dioptimalkan dan pagination dipakai bila data bertambah. |
| NFR-03 | Keamanan | Password disimpan menggunakan hashing; akses admin dilindungi autentikasi dan middleware. |
| NFR-04 | Validasi | Semua input penting divalidasi di sisi server, bukan hanya di browser. |
| NFR-05 | Perlindungan web | Gunakan perlindungan CSRF, escaping output, dan query aman melalui ORM/query builder. |
| NFR-06 | Unggah berkas | Tipe, ukuran, dan nama berkas divalidasi; berkas tidak dipercaya hanya berdasarkan ekstensi. |
| NFR-07 | Integritas data | Relasi basis data dan operasi yang saling bergantung dijaga konsistensinya, termasuk penggunaan transaksi bila diperlukan. |
| NFR-08 | Kemudahan pemeliharaan | Kode mengikuti struktur dan konvensi framework serta dipisahkan ke dalam lapisan yang jelas. |
| NFR-09 | Kompatibilitas | Mendukung versi modern browser utama yang masih umum digunakan. |
| NFR-10 | Aksesibilitas | Formulir memiliki label, pesan validasi jelas, dan elemen penting dapat digunakan dengan keyboard. |
| NFR-11 | Pencadangan | Basis data dan berkas penting memiliki prosedur backup yang ditetapkan sebelum digunakan secara operasional. |
| NFR-12 | Konfigurasi | Kredensial, kunci, dan konfigurasi lingkungan disimpan di environment variables, bukan di repositori kode. |

---

## 8. Tech Stack yang Direkomendasikan

Untuk MVP Florify, pendekatan yang direkomendasikan adalah **aplikasi monolitik Laravel dengan Blade**, bukan memisahkan frontend dan backend menjadi dua aplikasi. Pilihan ini mengurangi kompleksitas setup, autentikasi, deployment, dan pemeliharaan untuk tim kecil/proyek akademik.

| Lapisan | Teknologi | Peran |
|---|---|---|
| Backend | **Laravel (PHP)** | Routing, autentikasi, validasi, logika bisnis, dan pengelolaan data. |
| Frontend template | **Blade** | Merender halaman server-side dengan integrasi langsung ke Laravel. |
| Styling | **Tailwind CSS** | Membuat antarmuka responsif dan konsisten. |
| Interaktivitas ringan | **Alpine.js** | Interaksi sederhana seperti menu mobile, modal, atau toggle tanpa membangun SPA. |
| Database | **MySQL** | Menyimpan produk, pelanggan, pesanan, pembayaran, dan data terkait. |
| ORM | **Eloquent ORM** | Mengelola model dan relasi basis data melalui Laravel. |
| Validasi | **Laravel Validation** | Memvalidasi input pada server. |
| Autentikasi | **Laravel authentication scaffolding yang kompatibel** | Login admin dan perlindungan halaman privat. |
| Penyimpanan gambar | **Laravel Storage** | Mengelola gambar produk dan gambar referensi custom. |
| Pengujian | **Pest atau PHPUnit** | Unit test dan feature test untuk fungsi utama. |
| Version control | **Git + GitHub** | Mengelola versi kode, kolaborasi, dan riwayat perubahan. |
| UI/UX design | **Figma** | Membuat wireframe dan rancangan antarmuka sebelum implementasi. |
| Pengembangan lokal | **PHP, Composer, Node.js/npm, dan lingkungan lokal yang sesuai** | Menjalankan Laravel serta membangun aset frontend. |
| Deployment | **Hosting yang mendukung versi PHP dan kebutuhan Laravel** | Menjalankan aplikasi untuk demo atau penggunaan operasional. |

**Catatan versi:** gunakan versi Laravel, PHP, Node.js, dan dependensi frontend yang saling kompatibel serta masih mendapat dukungan ketika proyek dimulai. Catat versi yang benar-benar digunakan di dokumentasi proyek dan file dependensi; jangan menentukan versi secara sembarang.

### 8.1 Alasan Pemilihan

- Laravel menyediakan routing, validasi, migrasi, ORM, middleware, dan fitur keamanan umum dalam satu framework.
- Blade memudahkan halaman katalog dan dashboard tanpa perlu membangun REST API terpisah.
- Tailwind CSS mendukung pembuatan tampilan responsif secara cepat.
- Alpine.js cukup untuk interaksi ringan dan tidak menambah kompleksitas frontend yang besar.
- MySQL cocok untuk data relasional seperti pelanggan, pesanan, item pesanan, dan pembayaran.
- Pest atau PHPUnit dapat digunakan untuk menguji validasi formulir, akses admin, dan proses pemesanan.

### 8.2 Arsitektur Aplikasi

```text
Pelanggan/Admin (Browser)
          |
          v
Halaman Blade + Tailwind CSS + Alpine.js
          |
          v
Laravel Routes + Middleware
          |
          v
Controller + Validasi + Logika Bisnis
          |
          v
Eloquent ORM
          |
          v
MySQL Database

Laravel Storage --> Gambar Produk / Gambar Referensi
WhatsApp         --> Kanal komunikasi eksternal
```

### 8.3 Struktur Folder Awal

Struktur akhir mengikuti konvensi Laravel. Contoh pembagian area aplikasi:

```text
app/
  Http/
    Controllers/
      Public/
      Admin/
    Requests/
  Models/
resources/
  views/
    layouts/
    public/
      home.blade.php
      catalog/
      products/
      orders/
    admin/
      dashboard.blade.php
      products/
      orders/
      customers/
      payments/
  css/
  js/
routes/
  web.php
database/
  migrations/
  seeders/
tests/
  Feature/
  Unit/
storage/
  app/
```

Gunakan struktur bawaan Laravel sebagai dasar. Folder atau kelas tambahan dibuat ketika memang diperlukan, bukan semata-mata untuk memperbanyak lapisan.

---

## 9. Rancangan Data Awal

Rancangan berikut merupakan titik awal dan dapat disesuaikan setelah kebutuhan pemilik dikonfirmasi.

| Entitas | Kegunaan | Contoh atribut utama |
|---|---|---|
| `users` | Akun admin | `id`, `name`, `email`, `password`, `created_at` |
| `categories` | Kategori produk | `id`, `name`, `slug`, `description` |
| `products` | Data produk | `id`, `category_id`, `name`, `slug`, `description`, `price`, `image_path`, `is_active` |
| `events` | Jenis acara | `id`, `name`, `slug`, `description` |
| `event_product` | Relasi produk dan acara | `event_id`, `product_id` |
| `customers` | Data pelanggan | `id`, `name`, `phone`, `email`, `notes` |
| `orders` | Data utama pesanan | `id`, `order_number`, `customer_id`, `order_status`, `payment_status`, `needed_at`, `notes`, `total_amount` |
| `order_items` | Rincian produk per pesanan | `id`, `order_id`, `product_id`, `product_name_snapshot`, `unit_price_snapshot`, `quantity`, `subtotal` |
| `custom_requests` | Permintaan buket custom | `id`, `customer_id`, `budget`, `theme_color`, `bouquet_type`, `needed_at`, `reference_image_path`, `notes`, `status` |
| `payments` | Catatan pembayaran | `id`, `order_id`, `amount`, `method`, `paid_at`, `verification_status`, `notes` |
| `inventory_items` | Barang/bahan yang stoknya dilacak | `id`, `name`, `unit`, `quantity_on_hand`, `minimum_quantity` |
| `inventory_movements` | Riwayat perubahan stok | `id`, `inventory_item_id`, `movement_type`, `quantity`, `notes`, `created_by` |

### 9.1 Catatan Pemodelan Data

- Nomor pesanan diberi constraint unik pada basis data.
- Nilai uang disimpan dengan tipe desimal yang sesuai, bukan floating point.
- Relasi utama menggunakan foreign key jika sesuai.
- Harga dan nama produk pada item pesanan disimpan sebagai snapshot.
- Nomor WhatsApp disimpan sebagai teks agar tanda `+` dan angka nol di depan tidak hilang.
- Gambar disimpan sebagai berkas, sedangkan basis data menyimpan path atau identifikasinya.
- Penggabungan pelanggan berdasarkan nomor WhatsApp harus menangani kemungkinan nomor yang sama dipakai bersama.
- `inventory_items` dan `inventory_movements` dapat disederhanakan jika pemilik hanya ingin melacak jumlah produk jadi.
- Status pesanan dan pembayaran sebaiknya memakai nilai yang konsisten dan dibatasi melalui validasi.
- Pembuatan pesanan beserta item-itemnya dilakukan dalam transaksi basis data agar tidak tersimpan sebagian ketika terjadi kegagalan.

---

## 10. Pedoman UI/UX

### 10.1 Arah Visual

- Gunakan kesan floral, bersih, hangat, dan elegan.
- Warna utama yang disarankan: pink lembut, putih, dan aksen netral.
- Pastikan teks memiliki kontras yang cukup dan tetap mudah dibaca.
- Gunakan foto produk yang jelas dengan rasio dan ukuran yang konsisten.
- Hindari animasi berlebihan yang memperlambat halaman.

### 10.2 Halaman Pelanggan

1. **Beranda:** identitas AweFlorist, hero section, produk unggulan, kategori/acara, dan CTA.
2. **Katalog:** daftar produk, harga/keterangan harga, pencarian/filter sederhana.
3. **Detail produk:** foto, nama, deskripsi, harga, ketersediaan, dan tombol pesan.
4. **Buket custom:** anggaran, warna/tema, jenis buket, tanggal kebutuhan, catatan, dan gambar referensi opsional.
5. **Formulir pemesanan:** data pelanggan, produk, jumlah, tanggal kebutuhan, dan catatan.
6. **Konfirmasi:** informasi bahwa formulir berhasil diterima serta nomor pesanan.
7. **Informasi bantuan:** cara pemesanan, FAQ, kontak, dan WhatsApp.

### 10.3 Halaman Admin

1. Login.
2. Dashboard ringkas.
3. Daftar dan formulir produk.
4. Pengelolaan kategori.
5. Daftar dan detail pesanan.
6. Catatan pembayaran.
7. Riwayat pelanggan.
8. Pengelolaan stok sederhana.
9. Daftar tindak lanjut.

### 10.4 Prinsip Responsif

- Navigasi di layar kecil menggunakan menu yang mudah dijangkau.
- Kartu produk menyesuaikan lebar layar.
- Formulir menggunakan label yang jelas dan tombol dengan area sentuh memadai.
- Tabel admin harus tetap dapat dibaca pada layar kecil, misalnya melalui scroll horizontal atau tampilan daftar.
- Status penting tidak hanya dibedakan melalui warna, tetapi juga melalui teks.

---

## 11. Keamanan dan Privasi

- Password admin harus di-hash menggunakan mekanisme bawaan framework.
- Halaman admin dilindungi middleware autentikasi.
- Terapkan validasi server-side untuk semua formulir.
- Gunakan CSRF protection pada formulir yang mengubah data.
- Escape output untuk mengurangi risiko XSS.
- Gunakan Eloquent/query builder atau query berparameter, bukan menyusun SQL dari input mentah pengguna.
- Batasi tipe dan ukuran gambar yang diunggah serta buat nama berkas yang aman.
- Jangan menyimpan password, API key, atau kredensial di repositori.
- Gunakan HTTPS pada deployment.
- Batasi data pribadi yang dikumpulkan hanya pada kebutuhan operasional.
- Hindari menampilkan nomor kontak pelanggan kepada pengguna lain.
- Tetapkan prosedur backup dan pembatasan akses backup.
- Sediakan prosedur untuk memperbarui dependensi dan memperbaiki kerentanan.

---

## 12. Rencana Pengembangan Scrum

Estimasi total adalah 8 minggu, dengan empat sprint berdurasi dua minggu. Estimasi ini perlu disesuaikan dengan jumlah anggota tim dan kapasitas aktual.

### Sprint 1 — Fondasi dan Halaman Publik

**Tujuan:** menyiapkan proyek dan membangun tampilan publik dasar.

Pekerjaan utama:
- Mengonfirmasi kebutuhan dan menyiapkan repositori.
- Menyiapkan proyek Laravel dan basis data.
- Membuat wireframe/UI dasar.
- Membuat navbar, hero, profil singkat, dan footer.
- Menampilkan katalog dengan minimal 15 produk contoh.
- Membuat halaman detail produk.
- Membuat tampilan responsif.
- Menambahkan CTA WhatsApp.
- Menambahkan cara pemesanan, FAQ, dan kontak.

**Definition of Done:**
- Kode tersimpan di repositori.
- Halaman utama dan katalog dapat dibuka.
- Navigasi dasar berfungsi.
- Tampilan diuji pada ukuran layar ponsel dan desktop.
- Tidak ada bug kritis yang menghalangi penelusuran katalog.

### Sprint 2 — Data Dinamis dan Pemesanan

**Tujuan:** menghubungkan katalog ke basis data dan menyelesaikan alur pemesanan pelanggan.

Pekerjaan utama:
- Membuat migrasi dan model data produk, kategori, pelanggan, pesanan, dan item pesanan.
- Menampilkan katalog dari basis data.
- Membuat pencarian/filter sederhana jika masuk kapasitas.
- Membuat formulir pemesanan dan validasi.
- Membuat formulir permintaan buket custom.
- Menyimpan pesanan dan menghasilkan nomor unik.
- Menampilkan halaman konfirmasi.
- Menambahkan tautan WhatsApp untuk komunikasi lanjutan.

**Definition of Done:**
- Data produk berasal dari basis data.
- Formulir valid tersimpan dengan benar.
- Input tidak valid menghasilkan pesan kesalahan yang jelas.
- Nomor pesanan unik.
- Skenario pemesanan utama lulus pengujian.

### Sprint 3 — Panel Admin dan Operasional

**Tujuan:** menyediakan fungsi untuk mengelola aktivitas harian AweFlorist.

Pekerjaan utama:
- Membuat autentikasi admin.
- Membuat dashboard ringkas.
- Membuat CRUD produk dan kategori.
- Membuat daftar/detail pesanan.
- Membuat perubahan status pesanan.
- Membuat pencatatan pembayaran.
- Menampilkan riwayat pelanggan.
- Membuat pengelolaan stok sederhana sesuai kebutuhan.
- Membuat daftar pesanan yang perlu ditindaklanjuti.

**Definition of Done:**
- Halaman admin terlindungi autentikasi.
- Admin dapat mengelola data utama.
- Status pesanan dan pembayaran tidak tercampur.
- Riwayat pesanan tetap dapat dibaca.
- Pengujian akses tanpa login dan alur admin lulus.

### Sprint 4 — Integrasi, Pengujian, dan Rilis

**Tujuan:** memastikan semua fungsi utama terintegrasi dan siap didemonstrasikan.

Pekerjaan utama:
- Mengintegrasikan halaman publik dan admin.
- Melakukan unit test dan feature test.
- Melakukan pengujian responsif dan lintas browser.
- Melakukan UAT bersama pemilik/perwakilan pengguna.
- Memperbaiki bug berdasarkan prioritas.
- Menyiapkan deployment dan konfigurasi lingkungan.
- Menyusun dokumentasi penggunaan dan teknis.
- Menyiapkan demo dan presentasi akhir.

**Definition of Done:**
- Semua kriteria penerimaan Must terpenuhi.
- Tidak ada bug kritis yang diketahui pada alur utama.
- UAT diselesaikan dan hasilnya dicatat.
- Aplikasi dapat dijalankan di lingkungan target.
- Dokumentasi dasar tersedia.

---

## 13. Strategi Pengujian

### 13.1 Unit Test

Uji fungsi atau aturan kecil, misalnya:
- Pembuatan nomor pesanan.
- Perhitungan subtotal dan total.
- Validasi status pesanan.
- Perhitungan perubahan stok jika inventaris diaktifkan.

### 13.2 Feature Test

Uji alur dari sisi aplikasi:
- Pengunjung membuka katalog.
- Pelanggan mengirim pesanan valid.
- Sistem menolak input yang tidak valid.
- Pesanan tersimpan dengan item dan total yang benar.
- Pengunjung tanpa login ditolak ketika membuka panel admin.
- Admin login dan memperbarui status pesanan.
- Admin mencatat pembayaran.

### 13.3 UI dan Responsivitas

- Uji navigasi, formulir, pesan validasi, dan CTA.
- Periksa tampilan pada layar ponsel, tablet, dan desktop.
- Pastikan gambar tidak merusak tata letak.
- Periksa bahwa tombol dan label dapat digunakan dengan jelas.

### 13.4 User Acceptance Testing (UAT)

Minta pemilik atau perwakilan pengguna menjalankan skenario nyata:
1. Menemukan produk tertentu.
2. Membuka detail produk.
3. Mengirim pesanan.
4. Mengirim permintaan custom.
5. Login sebagai admin.
6. Memeriksa pesanan baru.
7. Memperbarui status pesanan.
8. Mencatat pembayaran.
9. Memeriksa riwayat pelanggan.

Catat hasil, kendala, tingkat keparahan, dan keputusan perbaikan.

---

## 14. Risiko dan Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Kebutuhan pemilik berubah selama pengembangan | Pekerjaan bertambah dan jadwal mundur | Tetapkan ruang lingkup MVP dan catat perubahan pada backlog. |
| Foto produk belum tersedia atau kualitasnya berbeda | Katalog terlihat tidak konsisten | Siapkan daftar foto dan panduan ukuran/aspek rasio sebelum pengisian data. |
| Data stok sulit distandardisasi | Informasi stok tidak akurat | Konfirmasi apakah yang dilacak adalah buket jadi, bahan baku, atau keduanya. |
| Pesanan melalui WhatsApp tidak tercatat di Florify | Riwayat operasional tidak lengkap | Tentukan prosedur admin untuk memasukkan pesanan yang datang dari kanal lain. |
| Koneksi atau hosting bermasalah | Pelanggan tidak dapat mengirim pesanan | Pilih hosting yang sesuai, lakukan backup, dan sediakan kontak alternatif. |
| Fitur bertambah di luar MVP | Risiko proyek tidak selesai | Prioritaskan fitur Must dan pindahkan fitur tambahan ke backlog berikutnya. |
| Data pribadi tidak dikelola dengan baik | Risiko privasi | Batasi pengumpulan data, atur akses admin, dan dokumentasikan prosedur backup. |

---

## 15. Asumsi dan Hal yang Harus Dikonfirmasi

Sebelum implementasi, konfirmasikan hal-hal berikut dengan pemilik AweFlorist:

1. Apakah semua harga ditampilkan langsung atau beberapa produk memakai keterangan “mulai dari”?
2. Apakah pelanggan perlu membuat akun, atau pemesanan tanpa akun sudah cukup? Rekomendasi MVP: tanpa akun.
3. Apakah pembayaran dicatat manual oleh admin atau pelanggan perlu mengunggah bukti transfer?
4. Apakah stok yang dikelola berupa produk jadi, bahan baku, atau keduanya?
5. Apakah pesanan dapat diambil sendiri, dikirim, atau keduanya?
6. Berapa batas maksimal ukuran dan format gambar referensi custom?
7. Apakah informasi acara akan menjadi fitur terpisah atau cukup berupa kategori?
8. Siapa yang memiliki akses admin dan bagaimana akun awal dibuat?
9. Apakah ada kebijakan pembatalan, uang muka, dan pelunasan yang harus tercermin di sistem?
10. Di mana aplikasi akan di-hosting dan siapa yang bertanggung jawab atas pemeliharaan?
11. Apakah pesanan yang masuk melalui WhatsApp/Instagram perlu dicatat manual oleh admin ke Florify?
12. Berapa target realistis jumlah produk dan pesanan pada tahap awal?

Asumsi sementara untuk MVP: pelanggan tidak perlu login, pembayaran dicatat manual, WhatsApp tetap menjadi kanal komunikasi, dan pengelolaan stok dibuat sesederhana mungkin sesuai proses usaha.

---

## 16. Deliverables

- Dokumen PRD.
- Wireframe dan rancangan UI/UX di Figma.
- Repositori kode sumber.
- Migrasi dan seeder basis data.
- Aplikasi web Florify.
- Panel admin.
- Test case dan hasil pengujian.
- Dokumentasi instalasi dan konfigurasi.
- Panduan penggunaan singkat untuk admin.
- Aplikasi yang ter-deploy untuk demo atau penggunaan sesuai kesepakatan.

---

## 17. Kriteria Penerimaan Akhir

Florify dapat dianggap memenuhi MVP jika:

- Pengunjung dapat membuka landing page dan katalog tanpa login.
- Produk dapat dilihat pada halaman detail.
- Pelanggan dapat mengirim pesanan dan permintaan buket custom.
- Sistem memvalidasi data, menyimpan pesanan, dan menghasilkan nomor pesanan unik.
- Admin dapat login dan hanya admin terautentikasi yang dapat membuka panel pengelolaan.
- Admin dapat mengelola produk dan kategori.
- Admin dapat melihat pesanan serta memperbarui statusnya.
- Admin dapat mencatat pembayaran dan melihat riwayat pelanggan.
- Daftar tindak lanjut menampilkan pesanan yang perlu diperiksa.
- Fitur stok sederhana tersedia jika disepakati dalam ruang lingkup akhir.
- Halaman utama dan alur pemesanan responsif.
- Pengujian alur utama dan UAT selesai, dan tidak ada bug kritis yang belum ditangani.
- Dokumentasi dasar tersedia dan aplikasi dapat dijalankan di lingkungan target.

---

## 18. Catatan Versi Dokumen

| Versi | Perubahan |
|---|---|
| 1.0 | Draft PRD awal: ruang lingkup MVP, persyaratan fungsional/nonfungsional, rekomendasi tech stack, rancangan data, roadmap Scrum, pengujian, risiko, dan kriteria penerimaan. |

**Dokumen ini adalah draft awal.** Ruang lingkup, prioritas, aturan bisnis, dan target keberhasilan perlu divalidasi bersama pemilik AweFlorist sebelum backlog sprint ditetapkan secara final.
