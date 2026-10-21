import { Link } from '@inertiajs/react';
import { BrandButton } from '@/components/florify/brand-button';
import { FaqList } from '@/components/florify/faq-list';
import { OrderSteps } from '@/components/florify/order-steps';
import { Section, SectionHeading } from '@/components/florify/section';
import { WhatsAppButton } from '@/components/florify/whatsapp-button';
import { faqs, orderSteps } from '@/data/info';
import { info } from '@/routes';

/** Pemilik: Prety. US-08 — ringkasan cara pemesanan di landing page. */
export function OrderStepsSection() {
    return (
        <Section id="cara-pesan" aria-labelledby="cara-pesan-title" flush>
            <SectionHeading
                id="cara-pesan-title"
                eyebrow="Cara pemesanan"
                title={`Pesan bunga dalam ${orderSteps.length} langkah`}
            />
            <OrderSteps steps={orderSteps} />
        </Section>
    );
}

/** Pemilik: Prety. US-08 — FAQ ringkas (3 teratas) + tautan ke halaman informasi. */
export function FaqSection() {
    return (
        <Section id="faq" aria-labelledby="faq-title" flush>
            <div className="grid items-start gap-8 lg:grid-cols-[1fr_1.4fr] lg:gap-14">
                <SectionHeading
                    id="faq-title"
                    eyebrow="FAQ"
                    title="Pertanyaan yang sering diajukan"
                    description="Belum menemukan jawaban? Hubungi admin kami melalui WhatsApp."
                    className="mb-0 md:mb-0"
                />
                <div className="flex flex-col items-start gap-5">
                    <FaqList items={faqs.slice(0, 3)} className="w-full" />
                    <BrandButton asChild variant="outline">
                        <Link href={`${info.url()}#faq`}>Lihat semua FAQ</Link>
                    </BrandButton>
                </div>
            </div>
        </Section>
    );
}

/** Pemilik: Prety. US-03 — ajakan akhir sebelum footer. */
export function ContactCtaSection() {
    return (
        <Section aria-labelledby="kontak-cta-title" flush>
            <div className="flex flex-col items-center gap-5 rounded-panel border border-line bg-surface px-6 py-12 text-center md:py-16">
                <h2
                    id="kontak-cta-title"
                    className="max-w-2xl font-display text-[2rem] leading-tight font-normal text-balance text-brand-900 md:text-h2"
                >
                    Siap mengirim bunga untuk orang tersayang?
                </h2>
                <p className="max-w-lg text-base leading-relaxed text-ink-muted">
                    Lihat katalog atau tanyakan langsung kepada admin kami.
                </p>
                <div className="flex w-full flex-col justify-center gap-3 min-[420px]:w-auto min-[420px]:flex-row">
                    <WhatsAppButton size="lg">Chat WhatsApp</WhatsAppButton>
                    <BrandButton asChild variant="secondary" size="lg">
                        <Link href={`${info.url()}#kontak`}>
                            Informasi Kontak
                        </Link>
                    </BrandButton>
                </div>
            </div>
        </Section>
    );
}
