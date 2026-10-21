import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { ProductImage } from '@/components/florify/product-image';
import { CategoryBadge, PriceLabel } from '@/components/florify/product-meta';
import { categoryName } from '@/data/catalog';
import { cn } from '@/lib/utils';
import { show } from '@/routes/catalog';
import type { Product } from '@/types';

/**
 * Kartu produk standar: foto 4:5, kategori, nama, harga, tautan detail.
 * Seluruh kartu adalah satu tautan ke /katalog/{slug}.
 */
export function ProductCard({
    product,
    className,
}: {
    product: Product;
    className?: string;
}) {
    return (
        <Link
            href={show(product.slug)}
            className={cn(
                'group flex h-full flex-col gap-4 rounded-card border border-line bg-surface p-3.5 pb-5 text-ink shadow-card transition-[box-shadow,transform,border-color] duration-300 ease-soft outline-none hover:-translate-y-1 hover:border-brand-300 hover:shadow-lift focus-visible:ring-4 focus-visible:ring-brand-700/30 motion-reduce:transition-none motion-reduce:hover:translate-y-0',
                className,
            )}
        >
            <ProductImage src={product.image} alt={product.name} />
            <div className="flex flex-1 flex-col gap-1.5 px-1.5">
                <CategoryBadge>{categoryName(product.category)}</CategoryBadge>
                <h3 className="font-display text-h3 text-ink">
                    {product.name}
                </h3>
                <div className="mt-auto flex items-center justify-between gap-3 pt-1">
                    <PriceLabel product={product} />
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700">
                        Detail
                        <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none" />
                    </span>
                </div>
            </div>
        </Link>
    );
}

/** Grid responsif untuk kartu produk: 1 → 2 → 3 → 4 kolom. */
export function ProductGrid({
    products,
    className,
}: {
    products: Product[];
    className?: string;
}) {
    return (
        <ul
            className={cn(
                'grid grid-cols-1 gap-5 min-[420px]:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4',
                className,
            )}
        >
            {products.map((product) => (
                <li key={product.slug}>
                    <ProductCard product={product} />
                </li>
            ))}
        </ul>
    );
}
