import type { Occasion, ProductCategory } from '@/types';

/** Kategori produk sesuai PRD 1.1 (jenis buket AweFlorist). */
export const categories: ProductCategory[] = [
    { slug: 'buket-bunga', name: 'Buket Bunga Segar' },
    { slug: 'buket-uang', name: 'Buket Uang' },
    { slug: 'buket-satu-tangkai', name: 'Buket Satu Tangkai' },
    { slug: 'buket-custom', name: 'Buket Custom' },
];

/** Acara sesuai PRD 1.1 (FR-06). */
export const occasions: Occasion[] = [
    {
        slug: 'wisuda',
        name: 'Wisuda',
        description: 'Ucapan selamat untuk momen kelulusan.',
    },
    {
        slug: 'ulang-tahun',
        name: 'Ulang Tahun',
        description: 'Kejutan manis di hari spesial.',
    },
    {
        slug: 'anniversary',
        name: 'Anniversary',
        description: 'Rayakan perjalanan bersama orang tersayang.',
    },
];

export function categoryName(slug: ProductCategory['slug']): string {
    return categories.find((category) => category.slug === slug)?.name ?? slug;
}
