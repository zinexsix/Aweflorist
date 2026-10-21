import { PromoBanner } from '@/components/florify/promo-banner';
import { Section } from '@/components/florify/section';
import { Link } from '@inertiajs/react';
import { BrandButton } from '@/components/florify/brand-button';
import { occasions } from '@/data/catalog';
import { custom } from '@/routes';

/**
 * Pemilik: Prety. US-03 — promo event / informasi unggulan.
 * Ganti teks dengan promo resmi HANYA setelah nama, periode, dan syarat
 * promo dikonfirmasi Product Owner.
 */
export function PromoSection() {
    return (
        <Section aria-label="Informasi unggulan" flush>
            <PromoBanner
                eyebrow="Siap untuk momen spesial"
                title="Punya ide buket sendiri? Kami bantu wujudkan"
                description="Ceritakan acara, warna favorit, dan anggaran Anda. Admin akan membantu memilih rangkaian yang paling sesuai."
                action={
                    <BrandButton asChild variant="inverse" size="lg">
                        <Link href={custom()}>Pesan Buket Custom</Link>
                    </BrandButton>
                }
                aside={
                    <ul className="grid grid-cols-3 gap-3">
                        {occasions.map((occasion) => (
                            <li
                                key={occasion.slug}
                                className="flex min-h-28 flex-col justify-between gap-6 rounded-card bg-brand-600 p-4 sm:p-5"
                            >
                                <span className="text-xs text-brand-200 sm:text-[0.8125rem]">
                                    Acara
                                </span>
                                <span className="font-display text-base leading-tight sm:text-[1.375rem]">
                                    {occasion.name}
                                </span>
                            </li>
                        ))}
                    </ul>
                }
            />
        </Section>
    );
}
