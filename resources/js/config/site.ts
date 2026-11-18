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
    address:
        'Jl. Raya Gadut, Limau Manis Selatan, Kec. Lubuk Kilangan, Kota Padang, Sumatera Barat 25157' as
            | string
            | null,
    /**
     * Lokasi toko di Google Maps (profil beranda #tentang dan /informasi#kontak).
     * Koordinat dan alamat dari pin "Awe florist" di Google Maps (link dari pemilik, 18 Nov 2026).
     * `null` = peta disembunyikan.
     */
    location: {
        name: 'Awe florist',
        latitude: -0.9485417,
        longitude: 100.4475927,
        /** Membuka halaman tempat "Awe florist" di aplikasi/situs Google Maps. */
        mapsUrl: 'https://maps.google.com/?cid=17568107334415383527',
    } as {
        name: string;
        latitude: number;
        longitude: number;
        mapsUrl: string;
    } | null,
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
