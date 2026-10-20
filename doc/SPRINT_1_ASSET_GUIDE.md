# Florify — Panduan Aset Gambar Sprint 1

Penanggung jawab aset: **Rofiq**. Dokumen ini menjelaskan di mana gambar disimpan, cara menamai, dan cara memasangnya di halaman.

## 1. Struktur folder

Gambar statis disimpan di folder `public/` milik Laravel, sehingga dapat dipanggil langsung dengan path `/images/...`.

```text
public/
  images/
    hero/          foto besar di hero landing page
    products/      foto produk (1 file per produk, boleh -01, -02 untuk galeri)
    categories/    foto kartu kategori/acara (opsional, Sprint 1 masih memakai warna)
    banners/       foto section "Tentang kami", promo, dll.
    placeholders/  gambar pengganti sementara bila diperlukan di luar komponen React
```

Folder sudah dibuat (berisi `.gitkeep` agar ikut ter-commit). **Jangan membuat folder gambar lain** seperti `resources/images` atau `public/img`.

> Sprint 3+ (unggah gambar dari panel admin) akan memakai Laravel Storage (`storage/app/public`). Folder `public/images` khusus aset statis Sprint 1.

## 2. Format, rasio, dan ukuran

| Jenis | Folder | Rasio | Ukuran export | Batas file |
|---|---|---|---|---|
| Foto produk | `products/` | **4:5 (portrait)** | 1000 × 1250 px | ≤ 200 KB |
| Hero utama | `hero/` | 4:5 | 1000 × 1250 px | ≤ 250 KB |
| Hero kedua | `hero/` | 1:1 | 800 × 800 px | ≤ 150 KB |
| Tentang kami | `banners/` | 4:3 (ditampilkan 16:9 di tablet, otomatis dipotong tengah) | 1600 × 1200 px | ≤ 250 KB |
| Kategori | `categories/` | 4:3 | 800 × 600 px | ≤ 120 KB |

- Format utama: **`.webp`** (kualitas 75–82). Gunakan `.jpg` bila tidak bisa export webp. Logo/ikon: `.svg`.
- Objek utama (buket) di tengah, sisakan ruang ±8% di tepi — komponen memakai `object-cover`, tepi bisa terpotong sedikit.
- Latar foto sebaiknya terang/netral agar serasi dengan palet blush.
- Konversi cepat: [squoosh.app](https://squoosh.app) (gratis, berjalan di browser) atau `cwebp -q 80 input.jpg -o output.webp`.

## 3. Penamaan file

Aturan: huruf kecil, kata dipisah tanda hubung `-`, tanpa spasi, tanpa huruf kapital, diakhiri nomor urut 2 digit.

```text
<slug-produk>-01.webp        contoh: buket-mawar-merah-01.webp
hero-<deskripsi>.webp        contoh: hero-florist.webp
category-<slug>.webp         contoh: category-wisuda.webp
about-<deskripsi>.webp       contoh: about-aweflorist.webp
```

`<slug-produk>` **harus sama** dengan `slug` di `resources/js/data/products.ts` agar mudah dicocokkan.

## 4. Cara memasang gambar

### 4.1 Foto produk (Latif)

1. Simpan file, mis. `public/images/products/buket-mawar-merah-01.webp`.
2. Buka `resources/js/data/products.ts`, cari produk dengan slug yang sama, ubah:
   ```ts
   image: null,
   ```
   menjadi
   ```ts
   image: '/images/products/buket-mawar-merah-01.webp',
   ```
3. Jalankan aplikasi dan buka `/katalog` serta `/katalog/buket-mawar-merah`.

### 4.2 Foto hero & tentang kami (Rofiq)

Isi path di `resources/js/config/site.ts`:

```ts
images: {
    hero: '/images/hero/hero-florist.webp',
    heroSecondary: '/images/hero/hero-bouquet-best-seller.webp',
    about: '/images/banners/about-aweflorist.webp',
},
```

### 4.3 Di komponen

Selalu gunakan `ProductImage` (bukan `<img>` langsung):

```tsx
<ProductImage src={product.image} alt={product.name} />
```

`ProductImage` sudah mengatur rasio, `object-cover`, lazy-load, dan menampilkan placeholder "Foto segera hadir" bila `src` kosong atau file tidak ditemukan.

## 5. Mencegah path gambar rusak

- Path selalu diawali `/images/...` (garis miring di depan, tanpa `public`).
- Nama file **case-sensitive** di server Linux: `Buket.webp` ≠ `buket.webp`.
- Biarkan `image: null` sampai file benar-benar ada — jangan isi path untuk file yang belum dibuat (akan menimbulkan error 404 di console).
- Cek cepat setelah menambah gambar: buka `http://localhost:8000/images/products/<nama-file>` di browser. Jika muncul gambar, path benar.
- Jangan memakai URL gambar dari internet (Google Images, Pinterest, dll.): hak cipta tidak jelas dan bisa hilang sewaktu-waktu. Gunakan foto milik AweFlorist atau foto yang izinnya jelas.

## 6. Daftar aset yang perlu disiapkan Rofiq

Status awal: **belum ada satu pun foto** — semua tampil sebagai placeholder.

| No | File | Dipakai di | Prioritas |
|---|---|---|---|
| 1 | `hero/hero-florist.webp` | Hero (besar) | Must |
| 2 | `hero/hero-bouquet-best-seller.webp` | Hero (kecil) | Should |
| 3 | `banners/about-aweflorist.webp` | Tentang kami | Must |
| 4–19 | `products/<slug>-01.webp` untuk 16 produk: `buket-mawar-merah`, `buket-mawar-pink`, `buket-tulip-mix`, `buket-baby-breath`, `buket-wisuda-sunflower`, `buket-wisuda-boneka`, `buket-lily-putih`, `buket-ulang-tahun-pastel`, `buket-uang-kipas`, `buket-uang-mawar`, `buket-uang-wisuda`, `mawar-satu-tangkai`, `sunflower-satu-tangkai`, `tulip-satu-tangkai`, `buket-custom-tema-warna`, `buket-custom-foto` | Katalog, detail | Must (min. 4 produk unggulan dulu) |
| 20 | `categories/category-<slug>.webp` | Kartu kategori (opsional) | Could |

Jika produk asli AweFlorist berbeda dari daftar contoh, perbarui `products.ts` (nama + slug) terlebih dahulu, lalu namai foto sesuai slug baru.

Informasi non-gambar yang juga perlu dikonfirmasi ke Product Owner: nomor WhatsApp, alamat, jam buka, akun Instagram/TikTok, daftar produk & harga resmi, isi promo, kebijakan pemesanan (untuk FAQ).
