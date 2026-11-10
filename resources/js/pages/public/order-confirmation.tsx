import { Head, Link } from '@inertiajs/react';
import { Check, Copy } from 'lucide-react';
import { BrandButton } from '@/components/florify/brand-button';
import { Notice } from '@/components/florify/empty-state';
import { PageHeader } from '@/components/florify/page-header';
import { Section } from '@/components/florify/section';
import { WhatsAppButton } from '@/components/florify/whatsapp-button';
import { useClipboard } from '@/hooks/use-clipboard';
import { formatRupiah } from '@/lib/format';
import { orderFollowUpMessage } from '@/lib/whatsapp';
import { home } from '@/routes';
import { index as catalog } from '@/routes/catalog';
import type { OrderSummary } from '@/types';

function formatIndoDate(isoDate: string): string {
    if (!isoDate) {
        return '-';
    }

    return new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'long',
    }).format(new Date(`${isoDate}T00:00:00`));
}

function formatIndoDateTime(isoDateTime: string): string {
    return new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'long',
        timeStyle: 'short',
    }).format(new Date(isoDateTime));
}

/**
 * Halaman konfirmasi pesanan produk (US-14).
 * Nomor pesanan ditampilkan besar, data pelanggan disamarkan, dan pelanggan
 * bisa melanjutkan komunikasi lewat WhatsApp. WhatsApp bukan konfirmasi pesanan.
 */
export default function OrderConfirmation({ order }: { order: OrderSummary }) {
    const [copied, copy] = useClipboard();
    const isCopied = copied === order.orderNumber;

    return (
        <>
            <Head title="Pesanan terkirim" />
            <PageHeader
                breadcrumbs={[
                    { label: 'Beranda', href: home.url() },
                    { label: 'Katalog', href: catalog.url() },
                    { label: 'Konfirmasi' },
                ]}
                title="Pesanan terkirim"
                description="Simpan nomor pesanan di bawah ini. Admin akan mengonfirmasi detail dan harga lewat WhatsApp."
            />
            <Section flush aria-label="Konfirmasi pesanan">
                <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
                    <div className="flex flex-col gap-6">
                        <div className="rounded-panel border border-line bg-surface p-6 sm:p-8">
                            <p className="text-eyebrow font-bold tracking-[0.08em] text-brand-700 uppercase">
                                Nomor pesanan
                            </p>
                            <div className="mt-3 flex flex-wrap items-center gap-3">
                                <p className="font-display text-[2rem] leading-tight break-all text-brand-900 md:text-[2.5rem]">
                                    {order.orderNumber}
                                </p>
                                <BrandButton
                                    variant="outline"
                                    onClick={() => void copy(order.orderNumber)}
                                    aria-live="polite"
                                >
                                    {isCopied ? <Check /> : <Copy />}
                                    {isCopied ? 'Tersalin' : 'Salin'}
                                </BrandButton>
                            </div>
                            <p className="mt-3 text-sm leading-relaxed text-ink-subtle">
                                Dikirim pada{' '}
                                {formatIndoDateTime(order.createdAt)}.
                            </p>
                        </div>

                        <div className="rounded-panel border border-line bg-surface p-6 sm:p-8">
                            <h2 className="font-display text-h3 text-brand-900">
                                Rincian pesanan
                            </h2>
                            <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
                                <div className="flex flex-col gap-1">
                                    <dt className="font-semibold text-ink-subtle">
                                        Nama
                                    </dt>
                                    <dd className="text-base text-ink">
                                        {order.customerName}
                                    </dd>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <dt className="font-semibold text-ink-subtle">
                                        WhatsApp
                                    </dt>
                                    <dd className="text-base text-ink">
                                        {order.customerPhoneMasked}
                                    </dd>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <dt className="font-semibold text-ink-subtle">
                                        Tanggal dibutuhkan
                                    </dt>
                                    <dd className="text-base text-ink">
                                        <time dateTime={order.neededAt}>
                                            {formatIndoDate(order.neededAt)}
                                        </time>
                                    </dd>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <dt className="font-semibold text-ink-subtle">
                                        Status pesanan
                                    </dt>
                                    <dd className="text-base text-ink">
                                        {order.statusLabel}
                                    </dd>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <dt className="font-semibold text-ink-subtle">
                                        Status pembayaran
                                    </dt>
                                    <dd className="text-base text-ink">
                                        {order.paymentStatusLabel}
                                    </dd>
                                </div>
                            </dl>

                            {order.notes && (
                                <p className="mt-5 rounded-xl bg-brand-100 px-4 py-3 text-sm leading-relaxed text-ink">
                                    <span className="font-semibold">
                                        Catatan:{' '}
                                    </span>
                                    {order.notes}
                                </p>
                            )}

                            <ul className="mt-6 flex flex-col divide-y divide-line border-y border-line">
                                {order.items.map((item, index) => (
                                    <li
                                        key={`${item.name}-${index}`}
                                        className="flex flex-wrap items-start justify-between gap-3 py-4"
                                    >
                                        <div className="flex min-w-0 flex-col gap-1">
                                            <p className="font-semibold text-ink">
                                                {item.name}
                                            </p>
                                            <p className="text-sm text-ink-muted">
                                                {item.quantity} ×{' '}
                                                {item.unitPrice === null
                                                    ? 'Harga via WhatsApp'
                                                    : formatRupiah(
                                                          item.unitPrice,
                                                      )}
                                            </p>
                                        </div>
                                        <p className="font-semibold text-ink">
                                            {item.subtotal === null
                                                ? 'Dikonfirmasi admin'
                                                : formatRupiah(item.subtotal)}
                                        </p>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-4 flex flex-wrap items-baseline justify-between gap-2">
                                <span className="text-sm font-semibold text-ink-subtle">
                                    Total
                                </span>
                                <span className="font-display text-[1.5rem] font-normal text-brand-700">
                                    {order.totalAmount === null
                                        ? 'Dikonfirmasi admin'
                                        : formatRupiah(order.totalAmount)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <aside className="flex flex-col gap-4">
                        <div className="flex flex-col gap-4 rounded-panel border border-line bg-surface p-6 sm:p-8">
                            <h2 className="font-display text-h3 text-brand-900">
                                Langkah berikutnya
                            </h2>
                            <p className="text-[0.9375rem] leading-relaxed text-ink-muted">
                                Lanjutkan di WhatsApp dengan menyertakan nomor
                                pesanan. Admin akan mengonfirmasi ketersediaan,
                                detail, dan harga akhir.
                            </p>
                            <WhatsAppButton
                                size="lg"
                                className="w-full"
                                message={orderFollowUpMessage(order)}
                            >
                                Lanjutkan di WhatsApp
                            </WhatsAppButton>
                            <BrandButton
                                asChild
                                variant="outline"
                                size="lg"
                                className="w-full"
                            >
                                <Link href={catalog()}>Kembali ke katalog</Link>
                            </BrandButton>
                        </div>
                        <Notice>
                            Pesanan belum pasti sampai admin mengonfirmasi
                            detail dan harga.
                        </Notice>
                    </aside>
                </div>
            </Section>
        </>
    );
}
