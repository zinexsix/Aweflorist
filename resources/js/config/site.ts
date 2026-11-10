/**
 * Informasi usaha AweFlorist yang tampil di halaman publik.
 *
 * Isi HANYA dengan data yang sudah dikonfirmasi Product Owner/pemilik.
 * Nilai `null` berarti belum dikonfirmasi; komponen otomatis menyembunyikannya.
 * Nomor WhatsApp diatur lewat VITE_WHATSAPP_NUMBER di file .env (format 628xxx).
 */
export const site = {
    name: 'AweFlorist',
    product: 'Florify',
    tagline: 'Rangkaian bunga untuk setiap momen berharga',
    whatsappNumber: (import.meta.env.VITE_WHATSAPP_NUMBER ?? '').replace(
        /\D/g,
        '',
    ),
    address: null as string | null,
    /**
     * Lokasi toko untuk Google Maps di profil (beranda #tentang) dan /informasi#kontak.
     * `mapsQuery`: alamat lengkap atau "Nama Toko, Kota" persis seperti di Google Maps.
     *   Kosong (`null`) = memakai `address`; keduanya kosong = peta disembunyikan.
     * `mapsUrl`: link "Bagikan" dari aplikasi Google Maps (mis. https://maps.app.goo.gl/...).
     */
    mapsQuery: null as string | null,
    mapsUrl: null as string | null,
    openingHours: null as string | null,
    instagram: null as string | null,
    tiktok: null as string | null,
    /** Foto non-produk. Isi path setelah file ada di public/images (lihat doc/SPRINT_1_ASSET_GUIDE.md). */
    images: {
        hero: '/images/hero/hero-florist.webp' as string | null,
        heroSecondary: '/images/hero/hero-bouquet-best-seller.webp' as
            | string
            | null,
        about: '/images/banners/about-aweflorist.webp' as string | null,
    },
};
