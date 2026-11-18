import { MapPin } from 'lucide-react';
import { BrandButton } from '@/components/florify/brand-button';
import { site } from '@/config/site';
import { cn } from '@/lib/utils';

/**
 * Peta Google Maps interaktif (bisa digeser dan diperbesar) lokasi AweFlorist.
 * Memakai embed publik tanpa API key. Tidak tampil bila `site.location` kosong.
 */
export function LocationMap({
    className,
    frameClassName = 'aspect-[4/3] sm:aspect-[16/9]',
}: {
    className?: string;
    /** Ukuran kotak peta, mis. disamakan dengan foto yang digantikannya. */
    frameClassName?: string;
}) {
    const location = site.location;

    if (!location) {
        return null;
    }

    // Format embed Google Maps: cari "<nama toko>" di sekitar titik koordinat, zoom 17.
    const embedUrl =
        'https://www.google.com/maps/embed?pb=' +
        `!1m12!1m8!1m3!1d3989.27!2d${location.longitude}!3d${location.latitude}` +
        `!3m2!1i1024!2i768!4f13.1!2m1!1s${encodeURIComponent(location.name).replace(/%20/g, '+')}` +
        '!6i17!3m1!1sid!5m1!1sid';

    return (
        <figure className={cn('flex w-full min-w-0 flex-col gap-3', className)}>
            <div className="overflow-hidden rounded-panel border border-line bg-surface">
                <iframe
                    title={`Peta lokasi ${site.name} di Google Maps`}
                    src={embedUrl}
                    className={cn('block w-full', frameClassName)}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                />
            </div>
            <figcaption className="flex flex-wrap items-center justify-between gap-3">
                <span className="flex min-w-0 items-start gap-2 text-sm leading-relaxed text-ink-muted">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-brand-700" />
                    {site.address ?? location.name}
                </span>
                <BrandButton asChild variant="outline">
                    <a
                        href={location.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Buka di Google Maps
                    </a>
                </BrandButton>
            </figcaption>
        </figure>
    );
}
