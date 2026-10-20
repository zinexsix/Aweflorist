import { PromoBanner } from '@/components/florify/promo-banner';
import { Section } from '@/components/florify/section';
import { WhatsAppButton } from '@/components/florify/whatsapp-button';
import { occasions } from '@/data/catalog';
import { customBouquetMessage } from '@/lib/whatsapp';

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
                    <WhatsAppButton
                        variant="inverse"
                        size="lg"
                        message={customBouquetMessage}
                    >
                        Konsultasi Buket Custom
                    </WhatsAppButton>
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
