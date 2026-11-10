import type { Product } from '@/types';
import catalog from './catalog.json';

/**
 * Produk asli AweFlorist (foto & harga dari Google Drive pemilik, 10 Nov 2026).
 * Sumber data: ./catalog.json, sama dengan isi tabel `products` setelah
 * `php artisan db:seed`. Nama produk sengaja berdasarkan harga, bukan nama bunga.
 * Dipakai oleh build statis Vercel; versi Laravel mengambil data dari database.
 */
export const products: Product[] = catalog.products;

export const featuredProducts = products.filter((product) => product.featured);

export function findProduct(slug: string): Product | undefined {
    return products.find((product) => product.slug === slug);
}
