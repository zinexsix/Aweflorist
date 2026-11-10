import { Head, Link } from '@inertiajs/react';
import { Check, Copy } from 'lucide-react';
import { BrandButton } from '@/components/florify/brand-button';
import { Notice } from '@/components/florify/empty-state';
import { PageHeader } from '@/components/florify/page-header';
import { Section } from '@/components/florify/section';
import { WhatsAppButton } from '@/components/florify/whatsapp-button';
import { useClipboard } from '@/hooks/use-clipboard';
import { formatRupiah } from '@/lib/format';
import { customRequestFollowUpMessage } from '@/lib/whatsapp';
import { custom, home } from '@/routes';
import { index as catalog } from '@/routes/catalog';
import type { CustomRequestSummary } from '@/types';

function formatIndoDate(isoDate: string): string {
    if (!isoDate) {
        return '-';
    }

    return new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'long',
    }).format(new Date(`${isoDate}T00:00:00`));
}

/**
 * Halaman konfirmasi permintaan buket custom (US-15).
 * Permintaan custom belum menjadi pesanan final sampai detail dan harga
 * disepakati. WhatsApp hanya kanal komunikasi, bukan konfirmasi.
 */
export default function CustomConfirmation({
    customRequest,
}: {
    customRequest: CustomRequestSummary;
}) {
    const [copied, copy] = useClipboard();
    const isCopied = copied === customRequest.requestNumber;

    const details = [
        { label: 'Nama', value: customRequest.customerName },
        ...(customRequest.referenceProductName
            ? [
                  {
                      label: 'Model acuan',
                      value: customRequest.referenceProductName,
                  },
              ]
            : []),
        { label: 'Jenis buket', value: customRequest.bouquetType },
        { label: 'Anggaran', value: formatRupiah(customRequest.budget) },
        { label: 'Warna atau tema', value: customRequest.themeColor },
        {
            label: 'Tanggal dibutuhkan',
            value: formatIndoDate(customRequest.neededAt),
        },
        { label: 'Status', value: customRequest.statusLabel },
        { label: 'Persetujuan', value: customRequest.approvalLabel },
        ...(customRequest.hasReferenceImage
            ? [{ label: 'Gambar referensi', value: 'Terlampir' }]
            : []),
    ];

    return (
        <>
            <Head title="Permintaan terkirim" />
            <PageHeader
                breadcrumbs={[
                    { label: 'Beranda', href: home.url() },
                    { label: 'Buket Custom', href: custom.url() },
                    { label: 'Konfirmasi' },
                ]}
                title="Permintaan terkirim"
                description="Simpan nomor permintaan di bawah ini. Admin akan menghubungi Anda untuk membahas detail dan harga."
            />
            <Section flush aria-label="Konfirmasi permintaan buket custom">
                <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
                    <div className="flex flex-col gap-6">
                        <div className="rounded-panel border border-line bg-surface p-6 sm:p-8">
                            <p className="text-eyebrow font-bold tracking-[0.08em] text-brand-700 uppercase">
                                Nomor permintaan
                            </p>
                            <div className="mt-3 flex flex-wrap items-center gap-3">
                                <p className="font-display text-[clamp(1.5rem,7vw,2.5rem)] leading-tight break-words text-brand-900">
                                    {customRequest.requestNumber}
                                </p>
                                <BrandButton
                                    variant="outline"
                                    onClick={() =>
                                        void copy(customRequest.requestNumber)
                                    }
                                    aria-live="polite"
                                >
                                    {isCopied ? <Check /> : <Copy />}
                                    {isCopied ? 'Tersalin' : 'Salin'}
                                </BrandButton>
                            </div>
                        </div>

                        <div className="rounded-panel border border-line bg-surface p-6 sm:p-8">
                            <h2 className="font-display text-h3 text-brand-900">
                                Rincian permintaan
                            </h2>
                            <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
                                {details.map((item) => (
                                    <div
                                        key={item.label}
                                        className="flex flex-col gap-1"
                                    >
                                        <dt className="font-semibold text-ink-subtle">
                                            {item.label}
                                        </dt>
                                        <dd className="text-base text-ink">
                                            {item.value}
                                        </dd>
                                    </div>
                                ))}
                            </dl>

                            {customRequest.notes && (
                                <p className="mt-5 rounded-xl bg-brand-100 px-4 py-3 text-sm leading-relaxed text-ink">
                                    <span className="font-semibold">
                                        Catatan:{' '}
                                    </span>
                                    {customRequest.notes}
                                </p>
                            )}
                        </div>
                    </div>

                    <aside className="flex flex-col gap-4">
                        <div className="flex flex-col gap-4 rounded-panel border border-line bg-surface p-6 sm:p-8">
                            <h2 className="font-display text-h3 text-brand-900">
                                Langkah berikutnya
                            </h2>
                            <p className="text-[0.9375rem] leading-relaxed text-ink-muted">
                                Lanjutkan di WhatsApp dengan menyertakan nomor
                                permintaan. Admin akan membahas detail, foto
                                referensi, dan harga akhir bersama Anda.
                            </p>
                            <WhatsAppButton
                                size="lg"
                                className="w-full"
                                message={customRequestFollowUpMessage(
                                    customRequest,
                                )}
                            >
                                Lanjutkan di WhatsApp
                            </WhatsAppButton>
                            <BrandButton
                                asChild
                                variant="outline"
                                size="lg"
                                className="w-full"
                            >
                                <Link href={catalog()}>Lihat katalog</Link>
                            </BrandButton>
                        </div>
                        <Notice>
                            Permintaan custom belum menjadi pesanan sampai
                            detail dan harga disepakati bersama admin.
                        </Notice>
                    </aside>
                </div>
            </Section>
        </>
    );
}
