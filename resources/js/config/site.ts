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
    openingHours: null as string | null,
    instagram: null as string | null,
    tiktok: null as string | null,
    /** Foto non-produk. Isi path setelah file ada di public/images (lihat doc/SPRINT_1_ASSET_GUIDE.md). */
    images: {
        hero: null as string | null, // '/images/hero/hero-florist.webp'
        heroSecondary: null as string | null, // '/images/hero/hero-bouquet-best-seller.webp'
        about: null as string | null, // '/images/banners/about-aweflorist.webp'
    },
    /** Tampilkan catatan bahwa produk & harga masih data contoh Sprint 1. */
    isSampleData: true,
};
