import { OccasionCard } from '@/components/florify/occasion-card';
import { Section, SectionHeading } from '@/components/florify/section';
import { occasions } from '@/data/catalog';
import { customBouquetMessage, whatsappUrl } from '@/lib/whatsapp';
import { index as catalog } from '@/routes/catalog';
import type { Tone } from '@/types';

const occasionTones: Tone[] = ['sun', 'blush', 'lilac'];

/** Pemilik: Prety. FR-06 — kategori/acara. */
export function OccasionsSection() {
    return (
        <Section id="kategori" aria-labelledby="kategori-title" flush>
            <SectionHeading
                id="kategori-title"
                eyebrow="Kategori & acara"
                title="Temukan buket sesuai momen"
            />
            <ul className="grid gap-4 min-[420px]:grid-cols-2 lg:grid-cols-5">
                {occasions.map((occasion, index) => (
                    <li key={occasion.slug}>
                        <OccasionCard
                            title={occasion.name}
                            description={occasion.description}
                            href={catalog({ query: { acara: occasion.slug } })}
                            tone={occasionTones[index % occasionTones.length]}
                        />
                    </li>
                ))}
                <li>
                    <OccasionCard
                        title="Buket Uang"
                        description="Hadiah praktis dengan sentuhan bunga."
                        href={catalog({ query: { kategori: 'buket-uang' } })}
                        tone="sage"
                    />
                </li>
                <li className="min-[420px]:col-span-2 lg:col-span-1">
                    <OccasionCard
                        title="Buket Custom"
                        description="Konsultasikan warna, tema, dan anggaran."
                        href={whatsappUrl(customBouquetMessage)}
                        tone="cream"
                        external
                    />
                </li>
            </ul>
        </Section>
    );
}
