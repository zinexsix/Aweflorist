import type { Occasion, ProductCategory } from '@/types';
import catalog from './catalog.json';

/**
 * Kategori dan acara katalog AweFlorist.
 * Sumber data: ./catalog.json — file yang sama dipakai CatalogSeeder untuk
 * mengisi database, jadi web Laravel dan build statis selalu sama.
 * Kategori dikelompokkan berdasarkan harga; acara hanya Wisuda dan Other Occasion.
 */
export const categories: ProductCategory[] = catalog.categories.map(
    ({ slug, name }) => ({ slug, name }),
);

export const occasions: Occasion[] = catalog.occasions;

export function categoryName(slug: ProductCategory['slug']): string {
    return categories.find((category) => category.slug === slug)?.name ?? slug;
}

export function categoryDescription(slug: ProductCategory['slug']): string {
    return (
        catalog.categories.find((category) => category.slug === slug)
            ?.description ?? ''
    );
}
