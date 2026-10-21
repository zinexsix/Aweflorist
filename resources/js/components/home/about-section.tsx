import { ProductImage } from '@/components/florify/product-image';
import { Eyebrow, Section } from '@/components/florify/section';
import { site } from '@/config/site';

const highlights = [
    {
        title: 'Beragam pilihan',
        description: 'Buket bunga segar, buket uang, satu tangkai, dan custom.',
    },
    {
        title: 'Untuk setiap acara',
        description: 'Wisuda, ulang tahun, anniversary, dan momen lainnya.',
    },
    {
        title: 'Komunikasi mudah',
        description: 'Konsultasi dan konfirmasi pesanan lewat WhatsApp.',
    },
];

/**
 * Pemilik: Prety. US-02 — profil singkat AweFlorist.
 * Isi cerita/tahun berdiri/lokasi hanya setelah dikonfirmasi Product Owner.
 */
export function AboutSection() {
    return (
        <Section aria-labelledby="tentang-title" id="tentang">
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
                <ProductImage
                    src={site.images.about}
                    alt="Toko dan tim AweFlorist"
                    ratio="landscape"
                    tone="cream"
                    className="aspect-[16/9] rounded-panel lg:aspect-[4/3]"
                />
                <div className="flex min-w-0 flex-col gap-5">
                    <Eyebrow>Tentang kami</Eyebrow>
                    <h2
                        id="tentang-title"
                        className="font-display text-[2rem] leading-tight font-normal text-balance text-brand-900 md:text-h2"
                    >
                        Florist lokal yang merangkai dengan hati
                    </h2>
                    <p className="text-base leading-relaxed text-ink-muted md:text-[1.0625rem]">
                        {site.name} menghadirkan rangkaian bunga untuk berbagai
                        momen berharga. Melalui {site.product}, Anda dapat
                        melihat pilihan buket dalam satu katalog lalu
                        melanjutkan pemesanan bersama admin kami.
                    </p>
                    <ul className="grid gap-3 pt-2 sm:grid-cols-3">
                        {highlights.map((item) => (
                            <li
                                key={item.title}
                                className="flex flex-col gap-1 rounded-card bg-surface p-4"
                            >
                                <span className="font-semibold text-brand-900">
                                    {item.title}
                                </span>
                                <span className="text-sm leading-relaxed text-ink-muted">
                                    {item.description}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </Section>
    );
}
