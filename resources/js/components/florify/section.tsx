import type * as React from 'react';
import { cn } from '@/lib/utils';

/** Pembungkus lebar konten (maks. 1240px) dengan gutter 16px mobile / 24px desktop. */
export function Container({
    className,
    ...props
}: React.ComponentProps<'div'>) {
    return (
        <div
            className={cn(
                'mx-auto w-full max-w-site px-4 sm:px-gutter',
                className,
            )}
            {...props}
        />
    );
}

type SectionProps = React.ComponentProps<'section'> & {
    /** Hilangkan padding atas, mis. untuk section pertama setelah hero. */
    flush?: boolean;
};

/** Section halaman publik: jarak vertikal standar + Container. */
export function Section({
    className,
    flush = false,
    children,
    ...props
}: SectionProps) {
    return (
        <section
            className={cn(
                'pb-section-sm md:pb-section',
                !flush && 'pt-section-sm md:pt-section',
                className,
            )}
            {...props}
        >
            <Container>{children}</Container>
        </section>
    );
}

type SectionHeadingProps = {
    eyebrow?: string;
    title: string;
    description?: string;
    /** Elemen di kanan judul (desktop), mis. tombol "Lihat semua". */
    action?: React.ReactNode;
    align?: 'start' | 'center';
    /** Tag judul. Gunakan 'h1' hanya untuk judul halaman. */
    as?: 'h1' | 'h2';
    id?: string;
    className?: string;
};

/** Judul section: eyebrow kapital + judul serif + deskripsi opsional. */
export function SectionHeading({
    eyebrow,
    title,
    description,
    action,
    align = 'start',
    as: Heading = 'h2',
    id,
    className,
}: SectionHeadingProps) {
    return (
        <div
            className={cn(
                'mb-8 flex flex-wrap items-end justify-between gap-x-6 gap-y-4 md:mb-10',
                align === 'center' && 'justify-center text-center',
                className,
            )}
        >
            <div
                className={cn(
                    'flex max-w-2xl flex-col gap-3',
                    align === 'center' && 'items-center',
                )}
            >
                {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
                <Heading
                    id={id}
                    className="font-display text-[2rem] leading-tight font-normal text-balance text-brand-900 md:text-h2"
                >
                    {title}
                </Heading>
                {description && (
                    <p className="text-base leading-relaxed text-pretty text-ink-muted md:text-[1.0625rem]">
                        {description}
                    </p>
                )}
            </div>
            {action}
        </div>
    );
}

/** Label kecil kapital di atas judul. */
export function Eyebrow({ className, ...props }: React.ComponentProps<'span'>) {
    return (
        <span
            className={cn(
                'text-eyebrow font-bold tracking-[0.08em] text-brand-700 uppercase',
                className,
            )}
            {...props}
        />
    );
}
