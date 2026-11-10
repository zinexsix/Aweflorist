import { OccasionCard } from '@/components/florify/occasion-card';
import { Section, SectionHeading } from '@/components/florify/section';
import { categories, categoryDescription } from '@/data/catalog';
import { custom } from '@/routes';
import { index as catalog } from '@/routes/catalog';
import type { Tone } from '@/types';

const categoryTones: Tone[] = ['sun', 'blush', 'lilac', 'sage', 'cream'];

/** Pemilik: Prety. FR-06 — kategori berdasarkan harga + buket custom. */
export function OccasionsSection() {
    return (
        <Section id="kategori" aria-labelledby="kategori-title" flush>
            <SectionHeading
                id="kategori-title"
                eyebrow="Kategori harga"
                title="Temukan buket sesuai anggaran"
            />
            <ul className="grid gap-4 min-[420px]:grid-cols-2 lg:grid-cols-3">
                {categories.map((category, index) => (
                    <li key={category.slug}>
                        <OccasionCard
                            title={category.name}
                            description={categoryDescription(category.slug)}
                            href={catalog({
                                query: { kategori: category.slug },
                            })}
                            tone={categoryTones[index % categoryTones.length]}
                        />
                    </li>
                ))}
                <li>
                    <OccasionCard
                        title="Buket Custom"
                        description="Untuk wisuda atau other occasion. Tentukan warna, tema, dan anggaran."
                        href={custom()}
                        tone="blush"
                    />
                </li>
            </ul>
        </Section>
    );
}
