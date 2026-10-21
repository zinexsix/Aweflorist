import { Head } from '@inertiajs/react';
import { FaqList } from '@/components/florify/faq-list';
import { OrderSteps } from '@/components/florify/order-steps';
import { PageHeader } from '@/components/florify/page-header';
import { Eyebrow, Section, SectionHeading } from '@/components/florify/section';
import { WhatsAppButton } from '@/components/florify/whatsapp-button';
import { site } from '@/config/site';
import { faqs, orderSteps } from '@/data/info';
import { home } from '@/routes';

/**
 * Halaman informasi: cara pemesanan, FAQ, kontak (pemilik: Prety). US-08.
 * TODO Prety: lengkapi kontak (alamat, jam buka, media sosial) di
 * config/site.ts setelah dikonfirmasi; tambahkan peta lokasi bila disetujui.
 */
export default function Info() {
    const contacts = [
        { label: 'Alamat toko', value: site.address },
        { label: 'Jam buka', value: site.openingHours },
        { label: 'Instagram', value: site.instagram },
        { label: 'TikTok', value: site.tiktok },
    ].filter((item): item is { label: string; value: string } =>
        Boolean(item.value),
    );

    return (
        <>
            <Head title="Cara Pemesanan, FAQ & Kontak" />
            <PageHeader
                breadcrumbs={[
                    { label: 'Beranda', href: home.url() },
                    { label: 'Informasi' },
                ]}
                title="Informasi Pemesanan"
                description="Cara memesan, pertanyaan yang sering diajukan, dan kontak AweFlorist."
            />

            <Section id="cara-pesan" aria-labelledby="cara-pesan-title" flush>
                <SectionHeading
                    id="cara-pesan-title"
                    eyebrow="Cara pemesanan"
                    title={`Pesan bunga dalam ${orderSteps.length} langkah`}
                />
                <OrderSteps steps={orderSteps} />
            </Section>

            <Section id="faq" aria-labelledby="faq-title" flush>
                <SectionHeading
                    id="faq-title"
                    eyebrow="FAQ"
                    title="Pertanyaan yang sering diajukan"
                />
                <FaqList items={faqs} className="max-w-3xl" />
            </Section>

            <Section id="kontak" aria-labelledby="kontak-title" flush>
                <div className="flex flex-col items-start gap-5 rounded-panel bg-brand-100 px-6 py-10 sm:px-10 md:py-12">
                    <Eyebrow>Kontak</Eyebrow>
                    <h2
                        id="kontak-title"
                        className="font-display text-[2rem] leading-tight font-normal text-brand-900 md:text-h2"
                    >
                        Hubungi {site.name}
                    </h2>
                    {contacts.length > 0 ? (
                        <dl className="grid w-full gap-4 sm:grid-cols-2">
                            {contacts.map((item) => (
                                <div
                                    key={item.label}
                                    className="rounded-card bg-surface p-5"
                                >
                                    <dt className="text-sm text-ink-subtle">
                                        {item.label}
                                    </dt>
                                    <dd className="font-semibold text-ink">
                                        {item.value}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    ) : (
                        <p className="max-w-xl text-base leading-relaxed text-ink-muted">
                            Cara tercepat menghubungi kami adalah melalui
                            WhatsApp. Admin akan membantu pertanyaan seputar
                            produk dan pemesanan.
                        </p>
                    )}
                    <WhatsAppButton size="lg">Chat WhatsApp</WhatsAppButton>
                </div>
            </Section>
        </>
    );
}
