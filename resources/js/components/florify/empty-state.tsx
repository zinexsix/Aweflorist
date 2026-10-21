import type * as React from 'react';
import { FlowerMark } from '@/components/florify/logo';
import { cn } from '@/lib/utils';

/** Tampilan saat data kosong / pencarian tanpa hasil / produk tidak ditemukan (FR-11). */
export function EmptyState({
    title,
    description,
    action,
    className,
}: {
    title: string;
    description?: string;
    action?: React.ReactNode;
    className?: string;
}) {
    return (
        <div
            role="status"
            className={cn(
                'flex flex-col items-center gap-4 rounded-card border border-dashed border-brand-300 bg-surface px-6 py-14 text-center',
                className,
            )}
        >
            <span className="inline-flex size-16 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                <FlowerMark className="size-9" strokeWidth={1.4} />
            </span>
            <h2 className="font-display text-h3 text-brand-900">{title}</h2>
            {description && (
                <p className="max-w-md text-[0.9375rem] leading-relaxed text-ink-muted">
                    {description}
                </p>
            )}
            {action}
        </div>
    );
}

/** Catatan kecil di atas daftar produk selama data masih contoh (site.isSampleData). */
export function Notice({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <p
            className={cn(
                'rounded-xl bg-warning-soft px-4 py-3 text-sm leading-relaxed text-warning',
                className,
            )}
        >
            {children}
        </p>
    );
}
