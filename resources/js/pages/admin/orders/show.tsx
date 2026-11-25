import { Link } from '@inertiajs/react';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import AdminPage from '@/components/admin/admin-page';
import StatusBadge from '@/components/admin/status-badge';
import { buttonVariants } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    adminDate,
    adminDateTime,
    adminRupiah,
    customerWhatsappUrl,
} from '@/lib/admin-format';
import { dashboard as adminDashboard } from '@/routes/admin';
import {
    index as ordersIndex,
    show as ordersShow,
} from '@/routes/admin/orders';
import type { AdminOrderDetail, Option } from '@/types/admin';

type Props = {
    order: AdminOrderDetail;
    statuses: Option[];
};

function Detail({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col gap-1">
            <dt className="text-xs font-medium text-muted-foreground">
                {label}
            </dt>
            <dd className="text-sm">{children}</dd>
        </div>
    );
}

/**
 * Detail pesanan admin (US-21).
 * US-22 (Nabila) menambah formulir status, US-26 (Nabila) menambah bagian pembayaran,
 * masing-masing di bawah penandanya.
 */
export default function OrderShow({ order }: Props) {
    const followUpMessage = `Halo ${order.customer.name}, kami dari AweFlorist ingin mengonfirmasi pesanan nomor ${order.orderNumber}.`;

    return (
        <AdminPage
            title={`Pesanan ${order.orderNumber}`}
            description={`Masuk ${adminDateTime(order.createdAt)}`}
            breadcrumbs={[
                { title: 'Dashboard', href: adminDashboard() },
                { title: 'Pesanan', href: ordersIndex() },
                {
                    title: order.orderNumber,
                    href: ordersShow(order.orderNumber),
                },
            ]}
            actions={
                <Link
                    href={ordersIndex()}
                    className={buttonVariants({ variant: 'outline' })}
                >
                    <ArrowLeft className="size-4" aria-hidden="true" />
                    Kembali ke daftar
                </Link>
            }
        >
            <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                <div className="flex min-w-0 flex-col gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Status</CardTitle>
                            <CardDescription>
                                Status pesanan dan status pembayaran dicatat
                                terpisah.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <dl className="grid gap-4 sm:grid-cols-3">
                                <Detail label="Status pesanan">
                                    <StatusBadge
                                        status={order.status.value}
                                        label={order.status.label}
                                    />
                                </Detail>
                                <Detail label="Status pembayaran">
                                    <StatusBadge
                                        status={order.paymentStatus.value}
                                        label={order.paymentStatus.label}
                                    />
                                </Detail>
                                <Detail label="Tindak lanjut">
                                    {order.needsFollowUp
                                        ? 'Perlu ditindaklanjuti'
                                        : 'Tidak ada'}
                                </Detail>
                            </dl>

                            {/* US-22: form status */}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Rincian pesanan</CardTitle>
                            <CardDescription>
                                Nama dan harga produk sesuai saat pesanan
                                dibuat.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            <ul className="divide-y divide-border rounded-lg border border-border">
                                {order.items.map((item) => (
                                    <li
                                        key={item.id}
                                        className="flex flex-wrap items-start justify-between gap-3 p-4"
                                    >
                                        <div className="min-w-0 space-y-1">
                                            <p className="font-medium">
                                                {item.name}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {item.quantity} ×{' '}
                                                {adminRupiah(item.unitPrice)}
                                            </p>
                                            {item.productSlug === null && (
                                                <p className="text-xs text-muted-foreground">
                                                    Produk sudah dihapus dari
                                                    katalog.
                                                </p>
                                            )}
                                            {item.productActive === false && (
                                                <p className="text-xs text-muted-foreground">
                                                    Produk sedang nonaktif.
                                                </p>
                                            )}
                                        </div>
                                        <p className="font-medium whitespace-nowrap">
                                            {adminRupiah(item.subtotal)}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                            <div className="flex items-baseline justify-between gap-3">
                                <span className="text-sm font-medium text-muted-foreground">
                                    Total
                                </span>
                                <span className="text-lg font-semibold">
                                    {adminRupiah(order.totalAmount)}
                                </span>
                            </div>
                            {order.notes && (
                                <div className="rounded-lg bg-muted p-4 text-sm">
                                    <span className="font-medium">
                                        Catatan pelanggan:{' '}
                                    </span>
                                    {order.notes}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* US-26: pembayaran */}
                </div>

                <div className="flex min-w-0 flex-col gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Pelanggan</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            <dl className="grid gap-4">
                                <Detail label="Nama">
                                    {order.customer.name}
                                </Detail>
                                <Detail label="Nomor WhatsApp">
                                    {order.customer.phone}
                                </Detail>
                                {order.customer.email && (
                                    <Detail label="Email">
                                        {order.customer.email}
                                    </Detail>
                                )}
                                <Detail label="Tanggal dibutuhkan">
                                    {adminDate(order.neededAt)}
                                </Detail>
                            </dl>
                            <a
                                href={customerWhatsappUrl(
                                    order.customer.phone,
                                    followUpMessage,
                                )}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={buttonVariants({
                                    variant: 'outline',
                                })}
                            >
                                <MessageCircle
                                    className="size-4"
                                    aria-hidden="true"
                                />
                                Chat pelanggan di WhatsApp
                            </a>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminPage>
    );
}
