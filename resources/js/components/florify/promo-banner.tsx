import type * as React from 'react';
import { Eyebrow } from '@/components/florify/section';
import { FlowerMark } from '@/components/florify/logo';
import { cn } from '@/lib/utils';

type PromoBannerProps = {
    eyebrow: string;
    title: string;
    description: string;
    /** Tombol aksi; gunakan BrandButton variant="inverse". */
    action?: React.ReactNode;
    /** Konten kanan (mis. daftar acara). Disembunyikan bila kosong. */
    aside?: React.ReactNode;
    className?: string;
};

/**
 * Panel maroon untuk promo/informasi unggulan.
 * Jangan isi diskon/periode promo yang belum dikonfirmasi pemilik.
 */
export function PromoBanner({
    eyebrow,
    title,
    description,
    action,
    aside,
    className,
}: PromoBannerProps) {
    return (
        <div
            className={cn(
                'relative isolate flex flex-wrap items-center gap-10 overflow-hidden rounded-panel bg-brand-700 px-6 py-10 text-white sm:px-10 md:px-12 md:py-12',
                className,
            )}
        >
            <FlowerMark
                className="pointer-events-none absolute -top-10 -right-10 -z-10 size-64 text-white/10"
                strokeWidth={0.8}
            />
            <div className="flex min-w-0 flex-[1_1_22rem] flex-col items-start gap-4">
                <Eyebrow className="text-brand-200">{eyebrow}</Eyebrow>
                <h2 className="font-display text-[2rem] leading-tight font-normal text-balance md:text-h2">
                    {title}
                </h2>
                <p className="max-w-xl text-base leading-relaxed text-brand-100 md:text-[1.0625rem]">
                    {description}
                </p>
                {action}
            </div>
            {aside && <div className="min-w-0 flex-[1_1_22rem]">{aside}</div>}
        </div>
    );
}
