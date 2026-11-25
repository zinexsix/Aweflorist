import { Link } from '@inertiajs/react';
import {
    ArrowRight,
    ClipboardList,
    Flower2,
    ReceiptText,
    Wallet,
} from 'lucide-react';
import type { ReactNode } from 'react';
import AdminPage from '@/components/admin/admin-page';
import AdminTable, {
    type AdminTableColumn,
} from '@/components/admin/admin-table';
import StatusBadge from '@/components/admin/status-badge';
import { buttonVariants } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { adminDate } from '@/lib/admin-format';
import { cn } from '@/lib/utils';
import { dashboard as adminDashboard } from '@/routes/admin';
import {
    index as ordersIndex,
    show as ordersShow,
} from '@/routes/admin/orders';
import type { AdminDashboardStats, AdminOrderRow } from '@/types/admin';

type Props = {
    stats: AdminDashboardStats;
    followUps: AdminOrderRow[];
    /** `null` sampai halaman kelola buket custom (US-24) tersedia. */
    customRequestsUrl: string | null;
};

function StatCard({
    title,
    value,
    hint,
    icon,
    href,
}: {
    title: string;
    value: number;
    hint: string;
    icon: ReactNode;
    href?: string | null;
}) {
    const body = (
        <Card
            className={cn(
                'h-full gap-3 py-5',
                href && 'transition-colors hover:border-primary/50',
            )}
        >
            <CardHeader className="flex flex-row items-center justify-between gap-2 px-5">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>
                <span className="text-muted-foreground" aria-hidden="true">
                    {icon}
                </span>
            </CardHeader>
            <CardContent className="space-y-1 px-5">
                <p className="text-3xl font-semibold tabular-nums">{value}</p>
                <p className="text-xs text-muted-foreground">{hint}</p>
            </CardContent>
        </Card>
    );

    return href ? (
        <Link
            href={href}
            className="rounded-xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
            {body}
        </Link>
    ) : (
        body
    );
}

/** Dashboard admin: ringkasan dan daftar tindak lanjut (US-23). */
export default function Dashboard({
    stats,
    followUps,
    customRequestsUrl,
}: Props) {
    const followUpUrl = ordersIndex.url({ query: { tindak_lanjut: 1 } });

    const columns: AdminTableColumn<AdminOrderRow>[] = [
        {
            header: 'Nomor pesanan',
            cell: (order) => (
                <Link
                    href={ordersShow(order.orderNumber)}
                    className="font-medium whitespace-nowrap underline decoration-muted-foreground/50 underline-offset-4 hover:decoration-foreground"
                >
                    {order.orderNumber}
                </Link>
            ),
        },
        {
            header: 'Pelanggan',
            cell: (order) => (
                <span className="block min-w-28">{order.customerName}</span>
            ),
        },
        {
            header: 'Dibutuhkan',
            cell: (order) => (
                <span className="whitespace-nowrap">
                    {adminDate(order.neededAt)}
                </span>
            ),
        },
        {
            header: 'Status',
            cell: (order) => (
                <div className="flex flex-col items-start gap-1">
                    <StatusBadge
                        status={order.status.value}
                        label={order.status.label}
                    />
                    <StatusBadge
                        status={order.paymentStatus.value}
                        label={order.paymentStatus.label}
                    />
                </div>
            ),
        },
    ];

    return (
        <AdminPage
            title="Dashboard"
            description="Ringkasan pesanan dan pekerjaan yang perlu ditindaklanjuti."
            breadcrumbs={[{ title: 'Dashboard', href: adminDashboard() }]}
        >
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    title="Perlu tindak lanjut"
                    value={stats.needsFollowUp}
                    hint="Belum dikonfirmasi atau belum lunas"
                    icon={<ClipboardList className="size-5" />}
                    href={followUpUrl}
                />
                <StatCard
                    title="Belum lunas"
                    value={stats.unpaid}
                    hint="Belum dibayar atau baru DP"
                    icon={<Wallet className="size-5" />}
                />
                <StatCard
                    title="Custom menunggu persetujuan"
                    value={stats.customPending}
                    hint={
                        customRequestsUrl
                            ? 'Permintaan buket custom baru'
                            : 'Halaman kelola custom menyusul (US-24)'
                    }
                    icon={<Flower2 className="size-5" />}
                    href={customRequestsUrl}
                />
                <StatCard
                    title="Pesanan bulan ini"
                    value={stats.ordersThisMonth}
                    hint="Sejak tanggal 1 bulan ini"
                    icon={<ReceiptText className="size-5" />}
                    href={ordersIndex.url()}
                />
            </div>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                <Card className="min-w-0">
                    <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3">
                        <div className="space-y-1.5">
                            <CardTitle>Tindak lanjut terdekat</CardTitle>
                            <CardDescription>
                                5 pesanan dengan tanggal dibutuhkan paling
                                dekat.
                            </CardDescription>
                        </div>
                        <Link
                            href={followUpUrl}
                            className={buttonVariants({
                                variant: 'outline',
                                size: 'sm',
                            })}
                        >
                            Lihat semua
                            <ArrowRight className="size-4" aria-hidden="true" />
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <AdminTable
                            columns={columns}
                            rows={followUps}
                            rowKey={(order) => order.orderNumber}
                            emptyText="Tidak ada pesanan yang perlu ditindaklanjuti."
                        />
                    </CardContent>
                </Card>

                <Card className="min-w-0">
                    <CardHeader>
                        <CardTitle>Pesanan per status</CardTitle>
                        <CardDescription>
                            Semua pesanan yang tercatat.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="divide-y divide-border">
                            {stats.ordersByStatus.map((status) => (
                                <li key={status.value}>
                                    <Link
                                        href={ordersIndex.url({
                                            query: { status: status.value },
                                        })}
                                        className="flex items-center justify-between gap-3 py-2.5 text-sm hover:text-primary"
                                    >
                                        <StatusBadge
                                            status={status.value}
                                            label={status.label}
                                        />
                                        <span className="font-semibold tabular-nums">
                                            {status.count}
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </AdminPage>
    );
}
