import { Head, Link } from '@inertiajs/react';
import { CustomBouquetForm } from '@/components/florify/custom-bouquet-form';
import { Notice } from '@/components/florify/empty-state';
import { PageHeader } from '@/components/florify/page-header';
import { Section } from '@/components/florify/section';
import { home } from '@/routes';
import { show as catalogShow } from '@/routes/catalog';

/**
 * Halaman /buket-custom (US-15). Data dikirim CustomRequestController@create.
 * Isi dan perilaku formulir: components/florify/custom-bouquet-form.tsx
 */
export default function CustomBouquet({
    bouquetTypes,
    reference,
}: {
    bouquetTypes: string[];
    reference: { slug: string; name: string } | null;
}) {
    return (
        <>
            <Head title="Buket Custom" />
            <PageHeader
                breadcrumbs={[
                    { label: 'Beranda', href: home.url() },
                    { label: 'Buket Custom' },
                ]}
                title="Pesan Buket Custom"
                description="Ceritakan buket yang Anda inginkan. Permintaan Anda tersimpan dengan nomor sendiri, lalu admin AweFlorist menghubungi Anda untuk mengonfirmasi detail dan harga."
            />
            <Section flush aria-label="Formulir buket custom">
                <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-14">
                    <div className="flex min-w-0 flex-col gap-4">
                        {reference && (
                            <p className="rounded-xl bg-brand-100 px-4 py-3 text-[0.9375rem] text-ink">
                                <span className="font-semibold">
                                    Model acuan:{' '}
                                </span>
                                <Link
                                    href={catalogShow.url(reference.slug)}
                                    className="rounded-sm text-brand-700 underline underline-offset-4 focus-visible:ring-2 focus-visible:ring-brand-700/40 focus-visible:outline-none"
                                >
                                    {reference.name}
                                </Link>
                            </p>
                        )}
                        <CustomBouquetForm
                            bouquetTypes={bouquetTypes}
                            reference={reference}
                        />
                    </div>

                    <aside className="flex flex-col gap-4 lg:pt-2">
                        <h2 className="font-display text-h3 text-brand-900">
                            Bagaimana prosesnya?
                        </h2>
                        <ol className="flex list-decimal flex-col gap-2 pl-5 text-[0.9375rem] leading-relaxed text-ink-muted marker:font-semibold marker:text-brand-700">
                            <li>Isi formulir buket custom.</li>
                            <li>
                                Anda mendapat nomor permintaan (awalan CST).
                            </li>
                            <li>
                                Admin menghubungi Anda lewat WhatsApp untuk
                                membahas detail dan harga.
                            </li>
                            <li>
                                Buket disiapkan setelah detail dan harga
                                disepakati.
                            </li>
                        </ol>
                        <Notice>
                            Permintaan custom belum dianggap pesanan final
                            sebelum Anda dan admin menyepakati detail dan harga.
                        </Notice>
                    </aside>
                </div>
            </Section>
        </>
    );
}
