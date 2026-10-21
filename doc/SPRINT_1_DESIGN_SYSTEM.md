# Florify — Design System Sprint 1

Dokumen ini adalah **kontrak tampilan** halaman publik Florify. Semua anggota (Rofiq, Latif, Prety) wajib memakai token dan komponen di bawah ini. Jangan membuat warna, tombol, atau jarak baru tanpa diskusi dengan Rofiq.

- Acuan visual: mockup `doc/florify-html/` (terutama `panduan-visual.html`) dan PRD bagian 10.
- Teknologi: **Laravel 13 + Inertia + React 19 (TypeScript) + Tailwind CSS 4**. Komponen adalah komponen React (`.tsx`), styling memakai class Tailwind.
- Pemilik dokumen: Rofiq. Perubahan token/komponen bersama harus lewat Pull Request yang di-review Rofiq.

---

## 1. Peta file

| Lokasi | Isi | Pemilik |
|---|---|---|
| `resources/css/app.css` (blok `Florify design tokens`) | Design tokens | Rofiq |
| `resources/js/components/florify/` | Komponen bersama (button, card, header, footer, dst.) | Rofiq (product-* : Latif) |
| `resources/js/components/home/` | Section landing page | per section, lihat tabel §5 |
| `resources/js/layouts/public-layout.tsx` | Layout halaman publik (header + footer) | Rofiq |
| `resources/js/pages/public/` | Halaman: `home`, `catalog`, `product-detail`, `info` | lihat §5 |
| `resources/js/data/` | Data statis Sprint 1 (produk, kategori, FAQ) | Latif / Prety |
| `resources/js/config/site.ts` | Info usaha (WA, alamat, jam buka, foto hero) | Rofiq |
| `resources/js/lib/whatsapp.ts`, `lib/format.ts` | Pembuat tautan WhatsApp, format Rupiah | Rofiq |
| `resources/js/types/florify.ts` | Tipe data `Product`, `Occasion`, `FaqItem`, … | Rofiq |
| `routes/web.php` | Rute publik | Rofiq |

> Komponen di `resources/js/components/ui/` adalah bawaan starter kit (shadcn) untuk halaman login/dashboard. **Halaman publik memakai `components/florify/`**, bukan `components/ui/button`.

---

## 2. Design tokens

Semua token didefinisikan di `@theme` pada `resources/css/app.css`. Tailwind 4 otomatis membuat utility class dari token tersebut.

### 2.1 Warna

| Token | Hex | Class contoh | Dipakai untuk |
|---|---|---|---|
| `brand-50` | `#FFF7F9` | `bg-brand-50` | Latar halaman |
| `brand-100` | `#FBE3EA` | `bg-brand-100` | Panel hero, badge, hover lembut |
| `brand-200` | `#F4C6D4` | `bg-brand-200` | Placeholder foto, teks di panel maroon |
| `brand-300` | `#E8C5D0` | `border-brand-300` | Border kuat / hover kartu |
| `brand-600` | `#A3274D` | `bg-brand-600` | Kartu di atas panel maroon |
| `brand-700` | `#8A1538` | `bg-brand-700`, `text-brand-700` | **Warna utama**: tombol, link, aksen |
| `brand-800` | `#74112F` | `hover:bg-brand-800` | Hover tombol utama |
| `brand-900` | `#5E0E26` | `text-brand-900`, `bg-brand-900` | Judul, footer |
| `surface` | `#FFFFFF` | `bg-surface` | Kartu |
| `ink` | `#2A1A20` | `text-ink` | Teks utama |
| `ink-muted` | `#5A4650` | `text-ink-muted` | Deskripsi |
| `ink-subtle` | `#6B5560` | `text-ink-subtle` | Caption, breadcrumb |
| `line` | `#F1DCE3` | `border-line` | Border default |
| `petal-cream/sun/sage/lilac` | | `bg-petal-sun` | Latar placeholder & kartu kategori |
| `success`, `success-soft` | `#2F7A4D`, `#E3F2E8` | `text-success` | Status berhasil (Sprint 2+) |
| `warning`, `warning-soft` | `#8A5A00`, `#FDF1D6` | `bg-warning-soft` | Catatan "data contoh" |

Aturan: **jangan menulis hex langsung** (mis. `text-[#8A1538]`). Pakai class token. Status penting jangan hanya dibedakan warna — sertakan teks (PRD 10.4).

### 2.2 Tipografi

| Token | Ukuran | Class | Dipakai untuk |
|---|---|---|---|
| `font-display` | Fraunces | `font-display` | Semua judul (h1–h3), harga besar |
| `font-sans` | Plus Jakarta Sans | (default) | Body, tombol, label |
| `text-display` | 60px / 1.05 | `xl:text-display` | Judul hero desktop |
| `text-h1` | 48px / 1.1 | `md:text-h1` | Judul halaman |
| `text-h2` | 44px / 1.1 | `md:text-h2` | Judul section desktop (mobile 32px: `text-[2rem]`) |
| `text-h3` | 22px / 1.25 | `text-h3` | Judul kartu |
| `text-eyebrow` | 13px | lewat komponen `<Eyebrow>` | Label kapital di atas judul |

Font di-host sendiri oleh plugin `laravel-vite-plugin/fonts` (konfigurasi di `vite.config.ts`), tidak memanggil Google Fonts saat runtime.

### 2.3 Spasi, radius, shadow, layout

| Token | Nilai | Class | Keterangan |
|---|---|---|---|
| `spacing-section` | 96px | `md:py-section` | Jarak antarseksi desktop |
| `spacing-section-sm` | 56px | `py-section-sm` | Jarak antarseksi mobile |
| `spacing-gutter` | 24px | `sm:px-gutter` | Padding sisi container (mobile 16px `px-4`) |
| `spacing-tap` | 44px | `min-h-tap`, `size-tap` | Tinggi minimum elemen yang bisa diklik |
| `container-site` | 1240px | `max-w-site` | Lebar konten maksimum |
| `radius-media` | 16px | `rounded-media` | Foto di dalam kartu |
| `radius-card` | 22px | `rounded-card` | Kartu |
| `radius-panel` | 28px | `rounded-panel` | Panel besar (hero, promo) |
| (Tailwind) | 9999px | `rounded-full` | Tombol, chip, badge |
| `shadow-card` | | `shadow-card` | Kartu diam |
| `shadow-lift` | | `hover:shadow-lift` | Kartu saat hover |

### 2.4 Breakpoint (bawaan Tailwind + 1 tambahan)

| Nama | Lebar | Perubahan utama |
|---|---|---|
| (default) | < 420px | 1 kolom, tombol hero lebar penuh |
| `min-[420px]:` | ≥ 420px | Grid produk 2 kolom |
| `sm:` | ≥ 640px | Tombol WA muncul di navbar, gutter 24px |
| `md:` | ≥ 768px | Ukuran judul desktop, jarak section 96px |
| `lg:` | ≥ 1024px | Navbar penuh (menu burger hilang), grid produk 3 kolom |
| `xl:` | ≥ 1280px | Grid produk 4 kolom, judul hero 60px |

### 2.5 Gerak

- Durasi: `duration-200` (hover warna/tombol), `duration-300` (kartu naik), `duration-500` (zoom foto).
- Easing: `ease-soft` (token `--ease-soft`).
- Setiap animasi wajib punya pasangan `motion-reduce:` (contoh: `motion-reduce:transition-none`). Scroll halus otomatis mati bila pengguna memilih *reduce motion*.
- Jangan memakai library animasi tambahan.

---

## 3. Komponen bersama (`resources/js/components/florify/`)

Import selalu memakai alias `@/`, contoh: `import { BrandButton } from '@/components/florify/brand-button';`

### 3.1 `BrandButton` — `brand-button.tsx`

Tombol halaman publik.

| Prop | Nilai | Keterangan |
|---|---|---|
| `variant` | `primary` (default), `secondary`, `outline`, `inverse`, `ghost` | `primary` maksimal 1 per area; `inverse` = tombol putih di atas panel maroon |
| `size` | `md` (44px, default), `lg` (52px) | `lg` untuk CTA hero/section |
| `asChild` | boolean | Terapkan gaya ke child (`<Link>` atau `<a>`) |

```tsx
<BrandButton asChild size="lg">
    <Link href={catalog()}>Lihat Katalog</Link>
</BrandButton>
<BrandButton variant="outline" type="button" onClick={...}>Filter</BrandButton>
```

Sudah memiliki hover, focus ring (`focus-visible`), active (sedikit mengecil), dan disabled. **Jangan** override warna lewat `className`.

### 3.2 `WhatsAppButton` — `whatsapp-button.tsx`

CTA WhatsApp. Satu-satunya cara membuat tombol WA.

```tsx
<WhatsAppButton />                                  // "Pesan via WhatsApp", pesan umum
<WhatsAppButton message={productOrderMessage(product)} size="lg">Pesan Sekarang</WhatsAppButton>
<WhatsAppButton variant="inverse" message={customBouquetMessage}>Konsultasi</WhatsAppButton>
```

- Nomor diambil dari `VITE_WHATSAPP_NUMBER` di `.env` (format `628xxxxxxxxxx`). Jika kosong, WhatsApp tetap terbuka dan pengguna memilih kontak.
- Pesan siap pakai di `lib/whatsapp.ts`: `generalInquiryMessage`, `customBouquetMessage`, `productOrderMessage(product, note?)`.
- Jangan menulis `https://wa.me/...` manual di komponen lain.

### 3.3 Layout: `Container`, `Section`, `SectionHeading`, `Eyebrow` — `section.tsx`

```tsx
<Section id="produk" aria-labelledby="produk-title" flush>
    <SectionHeading
        id="produk-title"
        eyebrow="Produk unggulan"
        title="Pilihan favorit pelanggan"
        description="Opsional"
        action={<BrandButton variant="outline">…</BrandButton>}
    />
    …isi…
</Section>
```

- `Section` = `<section>` + `Container` + padding bawah standar. Prop `flush` menghilangkan padding atas — **pakai `flush` untuk section yang langsung mengikuti section lain**, agar jarak tidak dobel.
- `SectionHeading` prop: `eyebrow`, `title`, `description`, `action`, `align` (`start`/`center`), `as` (`h2` default, `h1` hanya untuk judul halaman), `id`.
- `Container` dipakai bila butuh lebar konten tanpa `<section>` (header, footer).

### 3.4 `PageHeader` — `page-header.tsx`

Breadcrumb + judul untuk halaman dalam (katalog, detail, informasi).

```tsx
<PageHeader
    breadcrumbs={[{ label: 'Beranda', href: home.url() }, { label: 'Katalog' }]}
    title="Katalog Bunga"
    description="…"
/>
```

### 3.5 Produk — `product-card.tsx`, `product-image.tsx`, `product-meta.tsx` (pemilik: Latif)

| Komponen | Kegunaan |
|---|---|
| `ProductCard product={…}` | Kartu: foto 4:5, kategori, nama, harga, "Detail →". Seluruh kartu adalah link ke `/katalog/{slug}`. |
| `ProductGrid products={[…]}` | Grid responsif 1 → 2 → 3 → 4 kolom. Selalu pakai ini untuk daftar produk. |
| `ProductImage src alt ratio tone priority` | Bingkai foto dengan rasio tetap, `object-cover`, lazy-load, dan **fallback otomatis** ("Foto segera hadir") bila `src` `null` atau file gagal dimuat. `ratio`: `portrait` (4:5), `square`, `landscape` (4:3). `priority` hanya untuk gambar di atas lipatan. |
| `PriceLabel product size` | Harga Rupiah konsisten (`Rp 250.000`, `Mulai Rp …`, atau `Harga via WhatsApp` bila `price: null`). |
| `CategoryBadge variant` | Label kategori: `text` (di kartu) atau `pill` (latar blush). |

Struktur kartu produk **tidak boleh diubah per halaman** (urutan foto → kategori → nama → harga). Bila perlu variasi, tambahkan prop di `ProductCard`, jangan menyalin markup.

### 3.6 `OccasionCard` — `occasion-card.tsx`

Kartu kategori/acara berwarna lembut dengan ikon panah.

```tsx
<OccasionCard title="Wisuda" description="…" href={catalog({ query: { acara: 'wisuda' } })} tone="sun" />
<OccasionCard title="Buket Custom" href={whatsappUrl(customBouquetMessage)} external tone="cream" />
```

`tone`: `blush`, `cream`, `sun`, `sage`, `lilac`.

### 3.7 `PromoBanner` — `promo-banner.tsx`

Panel maroon untuk promo/informasi unggulan. Prop: `eyebrow`, `title`, `description`, `action` (pakai `variant="inverse"`), `aside` (opsional). **Jangan mengisi diskon/periode promo yang belum dikonfirmasi pemilik.**

### 3.8 `EmptyState` dan `Notice` — `empty-state.tsx`

- `EmptyState title description action` — untuk data kosong, pencarian tanpa hasil, produk tidak ditemukan (FR-11).
- `Notice` — catatan kuning, mis. "data contoh". Ditampilkan otomatis selama `site.isSampleData = true`.

### 3.9 `FaqList` — `faq-list.tsx`

Accordion berbasis `<details>/<summary>`: bisa dipakai keyboard, terbaca screen reader, berfungsi tanpa JavaScript. Item pertama terbuka.

```tsx
<FaqList items={faqs} />
```

### 3.10 `OrderSteps` — `order-steps.tsx`

Langkah bernomor 1 → 2 → 4 kolom. `steps` diambil dari `data/info.ts`.

### 3.11 `SiteHeader`, `SiteFooter`, `Logo`, `FlowerMark`

- Dipasang otomatis oleh `PublicLayout` untuk semua halaman `pages/public/*` — **jangan** memanggil header/footer lagi di halaman.
- Header: sticky, menu penuh ≥ 1024px; di bawahnya menjadi tombol menu (burger) dengan `aria-expanded`, tertutup oleh `Esc`, klik link, atau navigasi.
- Footer hanya menampilkan alamat/jam buka/media sosial bila sudah diisi di `config/site.ts` (tidak ada data palsu).
- `FlowerMark` = ikon bunga garis dari mockup; dipakai di logo, placeholder, dekorasi.

### 3.11a `FormField` — `form-field.tsx`

Label + kontrol + petunjuk + pesan galat, dengan `id`, `aria-invalid`, dan `aria-describedby` otomatis. Dipakai oleh formulir buket custom.

```tsx
<FormField label="Warna atau tema" required error={errors.themeColor}>
    {(props) => <input {...props} name="themeColor" type="text" />}
</FormField>
```

`props.className` sudah berisi gaya input (`fieldClass`); tempelkan apa adanya ke `<input>`, `<select>`, atau `<textarea>`. Label menambahkan tanda `*` untuk wajib dan "(opsional)" untuk sisanya.

### 3.12 Loading & form

- Sprint 1 tidak memuat data dari server, jadi belum ada loading state. Jika dibutuhkan (Sprint 2), pakai `components/ui/skeleton.tsx`.
- Form halaman publik: pakai `FormField` (§3.11a). Setiap input wajib punya label.

### 3.13 Ikon

Gunakan `lucide-react` (sudah terpasang). Jangan memakai emoji sebagai ikon. Ikon dekoratif diberi `aria-hidden` (lucide melakukannya otomatis).

---

## 4. Aturan konsistensi (wajib)

1. Tombol → `BrandButton` / `WhatsAppButton`. Kartu produk → `ProductCard`. Foto → `ProductImage`. Harga → `PriceLabel`.
2. Judul section → `SectionHeading`. Jarak antarseksi → `Section` (+ `flush`). Jangan menulis `py-24` dsb. sendiri.
3. Warna, radius, shadow → token. Tidak boleh ada hex di file `.tsx`.
4. Semua elemen interaktif: hover, `focus-visible` ring, tinggi ≥ 44px.
5. Hover sederhana: perubahan warna, naik 4px, atau zoom foto 3%. Tidak lebih.
6. Gambar punya `alt` deskriptif. Rasio diatur `ProductImage`, bukan tinggi tetap.
7. Tidak ada `href="#"`. Link internal pakai Wayfinder (`import { home, info } from '@/routes'`, `import { index as catalog, show } from '@/routes/catalog'`).
8. Teks bisnis (harga, promo, alamat, kebijakan) hanya dari data yang dikonfirmasi Product Owner.
9. Tidak menambah dependensi npm/composer tanpa persetujuan tim.

---

## 5. Peta halaman & kepemilikan section

| Halaman/section | File | Pemilik | User story |
|---|---|---|---|
| Navbar | `components/florify/site-header.tsx` | Rofiq | US-01 |
| Hero | `components/home/hero-section.tsx` | Rofiq | US-01 |
| Tentang kami | `components/home/about-section.tsx` | Prety | US-02 |
| Produk unggulan | `components/home/featured-products-section.tsx` | Latif | US-02 |
| Kategori/acara | `components/home/occasions-section.tsx` | Prety | FR-06 |
| Promo/informasi unggulan | `components/home/promo-section.tsx` | Prety | US-03 |
| Cara pesan, FAQ ringkas, CTA kontak | `components/home/order-info-section.tsx` | Prety | US-08, US-03 |
| Footer | `components/florify/site-footer.tsx` | Rofiq | US-03 |
| Susunan landing page | `pages/public/home.tsx` | Rofiq | — |
| Katalog `/katalog` | `pages/public/catalog.tsx` | Latif | US-04, US-05 |
| Detail `/katalog/{slug}` | `pages/public/product-detail.tsx` | Latif | US-06, US-07 |
| Informasi `/informasi` | `pages/public/info.tsx` | Prety | US-08 |
| Buket custom `/buket-custom` | `pages/public/custom-bouquet.tsx` | Rofiq (dibuat), Prety (penyempurnaan) | FR-19, FR-20 |

Urutan landing page: Hero → Tentang → Produk unggulan → Kategori/acara → Informasi unggulan → Cara pemesanan → FAQ → CTA kontak → Footer.

---

## 6. Konflik dokumen yang perlu diketahui

| Topik | PRD | Jobsheet / mockup / kode | Keputusan Sprint 1 |
|---|---|---|---|
| Stack frontend | Blade + Alpine.js | Repo sudah memakai Inertia + React (starter kit Laravel) | **Tetap Inertia + React**, sesuai kode yang ada. Perlu dicatat di laporan sprint. |
| Kategori | Buket segar, uang, satu tangkai, custom; acara wisuda/ulang tahun/anniversary | Mockup: Bunga Papan, Bunga Meja, Hampers | Ikut **PRD**. Tambahkan kategori lain hanya jika PO mengonfirmasi. |
| Durasi sprint | 2 minggu | Jobsheet: 1 minggu | Ikut **jobsheet** (1 minggu). |
| Harga/kontak/promo | Belum dikonfirmasi (PRD §15) | Mockup memakai `[placeholder]` | Data contoh dengan catatan "data contoh"; kontak `null` sampai dikonfirmasi. |
| Formulir buket custom | Must (FR-19/20), dijadwalkan Sprint 2 | Tidak ada di backlog Sprint 1 | **Versi Sprint 1 ditambahkan** di `/buket-custom`: validasi di browser, dikirim lewat WhatsApp, belum disimpan ke basis data. Penyimpanan, validasi server, dan unggah gambar tetap Sprint 2. |
| Halaman kontak terpisah (task 16) | Cara pesan, FAQ, kontak | — | Digabung di `/informasi#kontak`. |
