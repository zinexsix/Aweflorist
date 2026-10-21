import { Head } from '@inertiajs/react';
import { CustomBouquetForm } from '@/components/florify/custom-bouquet-form';
import { Notice } from '@/components/florify/empty-state';
import { PageHeader } from '@/components/florify/page-header';
import { Section } from '@/components/florify/section';
import { home } from '@/routes';

/** Halaman /buket-custom. Isi dan perilaku formulir: components/florify/custom-bouquet-form.tsx */
export default function CustomBouquet() {
    return (
        <>
            <Head title="Buket Custom" />
            <PageHeader
                breadcrumbs={[
                    { label: 'Beranda', href: home.url() },
                    { label: 'Buket Custom' },
                ]}
                title="Pesan Buket Custom"
                description="Ceritakan buket yang Anda inginkan. Detail akan dikirim ke admin AweFlorist lewat WhatsApp untuk dikonfirmasi."
            />
            <Section flush aria-label="Formulir buket custom">
                <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-14">
                    <CustomBouquetForm />

                    <aside className="flex flex-col gap-4 lg:pt-2">
                        <h2 className="font-display text-h3 text-brand-900">
                            Bagaimana prosesnya?
                        </h2>
                        <ol className="flex list-decimal flex-col gap-2 pl-5 text-[0.9375rem] leading-relaxed text-ink-muted marker:font-semibold marker:text-brand-700">
                            <li>Isi formulir buket custom.</li>
                            <li>
                                WhatsApp terbuka dengan detail permintaan Anda.
                            </li>
                            <li>Admin mengonfirmasi ketersediaan dan harga.</li>
                            <li>
                                Pesanan disiapkan setelah detail dan harga
                                disepakati.
                            </li>
                        </ol>
                        <Notice>
                            Permintaan custom belum dianggap pesanan final
                            sebelum Anda dan admin menyepakati detail dan harga.
                            Foto referensi dapat dikirim langsung lewat chat
                            WhatsApp.
                        </Notice>
                    </aside>
                </div>
            </Section>
        </>
    );
}
