import type * as React from 'react';
import { cn } from '@/lib/utils';
import { site } from '@/config/site';

/** Ikon bunga garis (dari mockup doc/florify-html). Warna mengikuti currentColor. */
export function FlowerMark({
    className,
    strokeWidth = 1.8,
    ...props
}: React.ComponentProps<'svg'>) {
    return (
        <svg
            viewBox="0 0 32 32"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            aria-hidden="true"
            className={cn('size-7', className)}
            {...props}
        >
            <circle cx="16" cy="14" r="3.5" />
            <ellipse cx="16" cy="6.5" rx="3.5" ry="4.5" />
            <ellipse cx="16" cy="21.5" rx="3.5" ry="4.5" />
            <ellipse cx="8.5" cy="14" rx="4.5" ry="3.5" />
            <ellipse cx="23.5" cy="14" rx="4.5" ry="3.5" />
        </svg>
    );
}

/** Wordmark AweFlorist. `tone="light"` untuk latar gelap (footer). */
export function Logo({
    tone = 'brand',
    className,
}: {
    tone?: 'brand' | 'light';
    className?: string;
}) {
    return (
        <span
            className={cn(
                'inline-flex items-center gap-2.5',
                tone === 'brand' ? 'text-brand-700' : 'text-white',
                className,
            )}
        >
            <FlowerMark />
            <span className="font-display text-2xl leading-none font-semibold">
                {site.name}
            </span>
        </span>
    );
}
