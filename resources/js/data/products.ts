import type { Product } from '@/types';

/**
 * DATA CONTOH SPRINT 1 — bukan katalog/harga resmi AweFlorist.
 * Ganti nama, deskripsi, harga, dan foto setelah dikonfirmasi Product Owner.
 * Pada Sprint 2 data ini dipindah ke tabel `products` (PRD bagian 9).
 *
 * Aturan:
 * - `slug` unik, huruf kecil, dipisah tanda hubung (dipakai di URL /katalog/{slug}).
 * - `image` diisi hanya jika file sudah ada di public/images/products/.
 * - `price: null` untuk produk yang harganya dikonfirmasi via WhatsApp.
 */
export const products: Product[] = [
    {
        slug: 'buket-mawar-merah',
        name: 'Buket Mawar Merah',
        category: 'buket-bunga',
        occasions: ['anniversary', 'ulang-tahun'],
        description:
            'Rangkaian mawar merah segar dengan wrapping elegan, cocok untuk ungkapan sayang.',
        price: 250000,
        image: null,
        featured: true,
    },
    {
        slug: 'buket-mawar-pink',
        name: 'Buket Mawar Pink',
        category: 'buket-bunga',
        occasions: ['ulang-tahun', 'anniversary'],
        description:
            'Mawar pink lembut dengan aksen daun hijau untuk kejutan yang manis.',
        price: 230000,
        image: null,
    },
    {
        slug: 'buket-tulip-mix',
        name: 'Buket Tulip Mix',
        category: 'buket-bunga',
        occasions: ['ulang-tahun'],
        description: 'Perpaduan tulip warna-warni dalam rangkaian yang ceria.',
        price: 320000,
        image: null,
    },
    {
        slug: 'buket-baby-breath',
        name: 'Buket Baby Breath',
        category: 'buket-bunga',
        occasions: ['wisuda', 'ulang-tahun'],
        description:
            'Baby breath putih yang ringan dan manis, mudah dipadukan.',
        price: 150000,
        image: null,
    },
    {
        slug: 'buket-wisuda-sunflower',
        name: 'Buket Wisuda Sunflower',
        category: 'buket-bunga',
        occasions: ['wisuda'],
        description:
            'Bunga matahari cerah sebagai simbol semangat untuk sang wisudawan.',
        price: 180000,
        image: null,
        featured: true,
    },
    {
        slug: 'buket-wisuda-boneka',
        name: 'Buket Wisuda Boneka',
        category: 'buket-bunga',
        occasions: ['wisuda'],
        description:
            'Buket bunga dengan boneka wisuda kecil sebagai kenang-kenangan.',
        price: 210000,
        image: null,
    },
    {
        slug: 'buket-lily-putih',
        name: 'Buket Lily Putih',
        category: 'buket-bunga',
        occasions: ['anniversary'],
        description: 'Lily putih yang anggun dengan wangi lembut.',
        price: 280000,
        image: null,
    },
    {
        slug: 'buket-ulang-tahun-pastel',
        name: 'Buket Ulang Tahun Pastel',
        category: 'buket-bunga',
        occasions: ['ulang-tahun'],
        description: 'Kombinasi bunga bernuansa pastel untuk hari spesial.',
        price: 200000,
        priceFrom: true,
        image: null,
        featured: true,
    },
    {
        slug: 'buket-uang-kipas',
        name: 'Buket Uang Kipas',
        category: 'buket-uang',
        occasions: ['wisuda', 'ulang-tahun'],
        description:
            'Uang dilipat membentuk kipas dan dirangkai bersama bunga. Nominal uang sesuai permintaan.',
        price: null,
        image: null,
        featured: true,
    },
    {
        slug: 'buket-uang-mawar',
        name: 'Buket Uang Mawar',
        category: 'buket-uang',
        occasions: ['anniversary', 'ulang-tahun'],
        description:
            'Uang dilipat menyerupai kelopak mawar. Nominal uang sesuai permintaan.',
        price: null,
        image: null,
    },
    {
        slug: 'buket-uang-wisuda',
        name: 'Buket Uang Wisuda',
        category: 'buket-uang',
        occasions: ['wisuda'],
        description:
            'Buket uang dengan aksen toga untuk hadiah kelulusan. Nominal uang sesuai permintaan.',
        price: null,
        image: null,
    },
    {
        slug: 'mawar-satu-tangkai',
        name: 'Mawar Satu Tangkai',
        category: 'buket-satu-tangkai',
        occasions: ['anniversary', 'wisuda'],
        description: 'Satu tangkai mawar dengan wrapping sederhana dan pita.',
        price: 35000,
        image: null,
    },
    {
        slug: 'sunflower-satu-tangkai',
        name: 'Sunflower Satu Tangkai',
        category: 'buket-satu-tangkai',
        occasions: ['wisuda'],
        description: 'Satu tangkai bunga matahari yang cerah dan ringkas.',
        price: 45000,
        image: null,
    },
    {
        slug: 'tulip-satu-tangkai',
        name: 'Tulip Satu Tangkai',
        category: 'buket-satu-tangkai',
        occasions: ['ulang-tahun'],
        description: 'Satu tangkai tulip dengan wrapping kertas korea.',
        price: 55000,
        image: null,
    },
    {
        slug: 'buket-custom-tema-warna',
        name: 'Buket Custom Tema Warna',
        category: 'buket-custom',
        occasions: ['wisuda', 'ulang-tahun', 'anniversary'],
        description:
            'Pilih warna, tema, dan anggaran. Detail dan harga dikonfirmasi admin melalui WhatsApp.',
        price: null,
        image: null,
    },
    {
        slug: 'buket-custom-foto',
        name: 'Buket Custom dengan Foto',
        category: 'buket-custom',
        occasions: ['wisuda', 'ulang-tahun', 'anniversary'],
        description:
            'Buket dengan sisipan foto kenangan. Detail dan harga dikonfirmasi admin melalui WhatsApp.',
        price: null,
        image: null,
    },
];

export const featuredProducts = products.filter((product) => product.featured);

export function findProduct(slug: string): Product | undefined {
    return products.find((product) => product.slug === slug);
}
