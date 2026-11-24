import type { Occasion, ProductCategory } from '@/types';
import catalog from './catalog.json';

/**
 * Kategori dan acara katalog AweFlorist.
 * Hanya untuk build statis Vercel (tanpa database); versi Laravel menerima data ini dari server.
 * Sumber data: ./catalog.json — file yang sama dipakai CatalogSeeder untuk
 * mengisi database, jadi web Laravel dan build statis selalu sama.
 * Kategori dikelompokkan berdasarkan harga; acara hanya Wisuda dan Other Occasion.
 */
export const categories: ProductCategory[] = catalog.categories;

export const occasions: Occasion[] = catalog.occasions;

export function categoryName(slug: ProductCategory['slug']): string {
    return categories.find((category) => category.slug === slug)?.name ?? slug;
}
