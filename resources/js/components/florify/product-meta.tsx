import type * as React from 'react';
import { formatPrice } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { Product } from '@/types';

/** Label kategori kecil kapital di kartu/detail produk. */
export function CategoryBadge({
    children,
    variant = 'text',
    className,
}: {
    children: React.ReactNode;
    /** 'text' = label polos (kartu), 'pill' = latar blush (detail, hero). */
    variant?: 'text' | 'pill';
    className?: string;
}) {
    return (
        <span
            className={cn(
                'inline-flex w-fit items-center text-xs font-semibold tracking-[0.04em] text-brand-700 uppercase',
                variant === 'pill' && 'rounded-full bg-brand-100 px-3 py-1.5',
                className,
            )}
        >
            {children}
        </span>
    );
}

/** Harga produk. Selalu lewat komponen ini agar format Rupiah konsisten. */
export function PriceLabel({
    product,
    size = 'md',
    className,
}: {
    product: Pick<Product, 'price' | 'priceFrom'>;
    size?: 'md' | 'lg';
    className?: string;
}) {
    return (
        <span
            className={cn(
                'font-semibold',
                size === 'md'
                    ? 'text-[0.9375rem] text-ink-muted'
                    : 'font-display text-[1.75rem] font-normal text-brand-700',
                className,
            )}
        >
            {formatPrice(product)}
        </span>
    );
}
