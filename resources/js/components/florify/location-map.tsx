import { MapPin } from 'lucide-react';
import { BrandButton } from '@/components/florify/brand-button';
import { site } from '@/config/site';
import { cn } from '@/lib/utils';

/** Kata kunci lokasi toko; `null` bila alamat belum diisi di config/site.ts. */
export function mapsQuery(): string | null {
    return site.mapsQuery ?? site.address;
}

/**
 * Peta Google Maps lokasi AweFlorist (tanpa API key, memakai embed publik).
 * Tidak tampil sama sekali bila alamat belum diisi, supaya tidak ada lokasi karangan.
 */
export function LocationMap({ className }: { className?: string }) {
    const query = mapsQuery();

    if (!query) {
        return null;
    }

    const embedUrl = `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
    const openUrl =
        site.mapsUrl ??
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

    return (
        <figure className={cn('flex w-full flex-col gap-3', className)}>
            <div className="overflow-hidden rounded-panel border border-line bg-surface">
                <iframe
                    title={`Lokasi ${site.name} di Google Maps`}
                    src={embedUrl}
                    className="aspect-[4/3] w-full sm:aspect-[16/9]"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                />
            </div>
            <figcaption className="flex flex-wrap items-center justify-between gap-3">
                <span className="flex min-w-0 items-start gap-2 text-sm leading-relaxed text-ink-muted">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-brand-700" />
                    {site.address ?? query}
                </span>
                <BrandButton asChild variant="outline">
                    <a href={openUrl} target="_blank" rel="noopener noreferrer">
                        Buka di Google Maps
                    </a>
                </BrandButton>
            </figcaption>
        </figure>
    );
}
