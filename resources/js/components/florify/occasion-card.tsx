import { Link } from '@inertiajs/react';
import type { InertiaLinkProps } from '@inertiajs/react';
import { ArrowUpRight } from 'lucide-react';
import { FlowerMark } from '@/components/florify/logo';
import { toneBackground } from '@/components/florify/tones';
import { cn } from '@/lib/utils';
import type { Tone } from '@/types';

type OccasionCardProps = {
    title: string;
    description?: string;
    href: NonNullable<InertiaLinkProps['href']>;
    tone?: Tone;
    /** Tautan eksternal (mis. WhatsApp) dibuka di tab baru dengan <a>. */
    external?: boolean;
    className?: string;
};

/** Kartu kategori/acara yang mengarah ke katalog terfilter atau WhatsApp. */
export function OccasionCard({
    title,
    description,
    href,
    tone = 'blush',
    external = false,
    className,
}: OccasionCardProps) {
    const classes = cn(
        'group relative flex min-h-44 flex-col justify-between gap-6 overflow-hidden rounded-card p-5 text-brand-900 transition-[transform,box-shadow] duration-300 ease-soft outline-none hover:-translate-y-1 hover:shadow-lift focus-visible:ring-4 focus-visible:ring-brand-700/30 motion-reduce:transition-none motion-reduce:hover:translate-y-0 md:p-6',
        toneBackground[tone],
        className,
    );

    const content = (
        <>
            <FlowerMark
                className="pointer-events-none absolute -right-4 -bottom-4 size-28 text-brand-700/15 transition-transform duration-500 group-hover:rotate-12 motion-reduce:transition-none"
                strokeWidth={1}
            />
            <span className="inline-flex size-10 items-center justify-center rounded-full bg-surface/80 text-brand-700 transition-colors group-hover:bg-brand-700 group-hover:text-white">
                <ArrowUpRight className="size-5" />
            </span>
            <span className="relative flex flex-col gap-1">
                <span className="font-display text-h3">{title}</span>
                {description && (
                    <span className="text-sm leading-relaxed text-ink-muted">
                        {description}
                    </span>
                )}
            </span>
        </>
    );

    if (external) {
        return (
            <a
                href={typeof href === 'string' ? href : href.url}
                target="_blank"
                rel="noopener noreferrer"
                className={classes}
            >
                {content}
            </a>
        );
    }

    return (
        <Link href={href} className={classes}>
            {content}
        </Link>
    );
}
