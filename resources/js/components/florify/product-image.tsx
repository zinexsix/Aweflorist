import { useState } from 'react';
import { FlowerMark } from '@/components/florify/logo';
import { toneBackground, toneFor } from '@/components/florify/tones';
import { cn } from '@/lib/utils';
import type { Tone } from '@/types';

type ProductImageProps = {
    src: string | null;
    alt: string;
    /** Rasio bingkai. Default 4/5 (portrait) untuk foto buket. */
    ratio?: 'portrait' | 'square' | 'landscape';
    /** Warna latar placeholder. Default dipilih stabil dari `alt`. */
    tone?: Tone;
    /** true untuk gambar di atas lipatan (hero/detail) agar tidak di-lazy-load. */
    priority?: boolean;
    className?: string;
};

const ratioClass = {
    portrait: 'aspect-[4/5]',
    square: 'aspect-square',
    landscape: 'aspect-[4/3]',
};

/**
 * Bingkai foto dengan rasio tetap (mencegah layout shift), object-cover,
 * dan fallback placeholder bila `src` kosong atau gagal dimuat.
 */
export function ProductImage({
    src,
    alt,
    ratio = 'portrait',
    tone,
    priority = false,
    className,
}: ProductImageProps) {
    const [failed, setFailed] = useState(false);
    const showImage = src !== null && !failed;

    return (
        <div
            className={cn(
                'relative overflow-hidden rounded-media',
                ratioClass[ratio],
                toneBackground[tone ?? toneFor(alt)],
                className,
            )}
        >
            {showImage ? (
                <img
                    src={src}
                    alt={alt}
                    loading={priority ? 'eager' : 'lazy'}
                    decoding="async"
                    onError={() => setFailed(true)}
                    className="size-full object-cover transition-transform duration-500 ease-soft group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
            ) : (
                <div
                    role="img"
                    aria-label={`${alt} (foto belum tersedia)`}
                    className="flex size-full flex-col items-center justify-center gap-2 text-brand-700/70"
                >
                    <FlowerMark className="size-12" strokeWidth={1.2} />
                    <span className="text-xs font-semibold">
                        Foto segera hadir
                    </span>
                </div>
            )}
        </div>
    );
}
