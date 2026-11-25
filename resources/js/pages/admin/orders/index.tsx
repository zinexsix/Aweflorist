import { Link, router } from '@inertiajs/react';
import AdminPage from '@/components/admin/admin-page';
import AdminTable, {
    type AdminTableColumn,
} from '@/components/admin/admin-table';
import FilterBar from '@/components/admin/filter-bar';
import Pagination from '@/components/admin/pagination';
import StatusBadge from '@/components/admin/status-badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { adminDate, adminDateTime, adminRupiah } from '@/lib/admin-format';
import { dashboard as adminDashboard } from '@/routes/admin';
import {
    index as ordersIndex,
    show as ordersShow,
} from '@/routes/admin/orders';
import type { AdminOrderRow, Option, Paginated } from '@/types/admin';

type Filters = {
    q: string;
    status: string;
    pembayaran: string;
    tindak_lanjut: boolean;
};

type Props = {
    orders: Paginated<AdminOrderRow>;
    statuses: Option[];
    paymentStatuses: Option[];
    filters: Filters;
};

function FilterSelect({
    id,
    label,
    value,
    options,
    allLabel,
    onChange,
}: {
    id: string;
    label: string;
    value: string;
    options: Option[];
    allLabel: string;
    onChange: (value: string) => void;
}) {
    return (
        <div className="grid w-full gap-1 sm:w-48">
            <Label htmlFor={id} className="text-xs">
                {label}
            </Label>
            <Select value={value || 'all'} onValueChange={onChange}>
                <SelectTrigger id={id} className="w-full">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">{allLabel}</SelectItem>
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}

/** Halaman daftar pesanan admin (US-21). */
export default function OrdersIndex({
    orders,
    statuses,
    paymentStatuses,
    filters,
}: Props) {
    const applyFilters = (changes: Partial<Filters>) => {
        const next = { ...filters, ...changes };

        router.get(
            ordersIndex.url(),
            {
                q: next.q || undefined,
                status: next.status || undefined,
                pembayaran: next.pembayaran || undefined,
                tindak_lanjut: next.tindak_lanjut ? 1 : undefined,
            },
            { preserveState: true, preserveScroll: true },
        );
    };

    const columns: AdminTableColumn<AdminOrderRow>[] = [
        {
            header: 'Nomor pesanan',
            cell: (order) => (
                <div className="space-y-0.5">
                    <Link
                        href={ordersShow(order.orderNumber)}
                        className="font-medium whitespace-nowrap underline decoration-muted-foreground/50 underline-offset-4 hover:decoration-foreground"
                    >
                        {order.orderNumber}
                    </Link>
                    <p className="text-xs whitespace-nowrap text-muted-foreground">
                        Masuk {adminDateTime(order.createdAt)}
                    </p>
                </div>
            ),
        },
        {
            header: 'Pelanggan',
            cell: (order) => (
                <div className="min-w-40 space-y-0.5">
                    <p className="font-medium">{order.customerName}</p>
                    <p className="text-xs text-muted-foreground">
                        {order.customerPhone}
                    </p>
                </div>
            ),
        },
        {
            header: 'Produk',
            cell: (order) => (
                <span className="block min-w-36">{order.itemsSummary}</span>
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
            header: 'Total',
            cell: (order) => (
                <span className="whitespace-nowrap">
                    {adminRupiah(order.totalAmount)}
                </span>
            ),
        },
        {
            header: 'Status pesanan',
            cell: (order) => (
                <StatusBadge
                    status={order.status.value}
                    label={order.status.label}
                />
            ),
        },
        {
            header: 'Pembayaran',
            cell: (order) => (
                <StatusBadge
                    status={order.paymentStatus.value}
                    label={order.paymentStatus.label}
                />
            ),
        },
    ];

    return (
        <AdminPage
            title="Pesanan"
            description="Pesanan produk yang masuk dari formulir website."
            breadcrumbs={[
                { title: 'Dashboard', href: adminDashboard() },
                { title: 'Pesanan', href: ordersIndex() },
            ]}
        >
            <FilterBar
                action={ordersIndex.url()}
                q={filters.q}
                placeholder="Cari nomor pesanan, nama, atau nomor HP"
            >
                {filters.status && (
                    <input type="hidden" name="status" value={filters.status} />
                )}
                {filters.pembayaran && (
                    <input
                        type="hidden"
                        name="pembayaran"
                        value={filters.pembayaran}
                    />
                )}
                {filters.tindak_lanjut && (
                    <input type="hidden" name="tindak_lanjut" value="1" />
                )}
                <FilterSelect
                    id="filter-status"
                    label="Status pesanan"
                    value={filters.status}
                    options={statuses}
                    allLabel="Semua status"
                    onChange={(value) =>
                        applyFilters({ status: value === 'all' ? '' : value })
                    }
                />
                <FilterSelect
                    id="filter-pembayaran"
                    label="Status pembayaran"
                    value={filters.pembayaran}
                    options={paymentStatuses}
                    allLabel="Semua pembayaran"
                    onChange={(value) =>
                        applyFilters({
                            pembayaran: value === 'all' ? '' : value,
                        })
                    }
                />
                <div className="flex h-9 items-center gap-2">
                    <Checkbox
                        id="filter-tindak-lanjut"
                        checked={filters.tindak_lanjut}
                        onCheckedChange={(checked) =>
                            applyFilters({ tindak_lanjut: checked === true })
                        }
                    />
                    <Label htmlFor="filter-tindak-lanjut" className="text-sm">
                        Perlu tindak lanjut
                    </Label>
                </div>
            </FilterBar>

            <p className="text-sm text-muted-foreground" aria-live="polite">
                {orders.total > 0
                    ? `Menampilkan ${orders.from}–${orders.to} dari ${orders.total} pesanan`
                    : 'Tidak ada pesanan yang cocok.'}
            </p>

            <AdminTable
                columns={columns}
                rows={orders.data}
                rowKey={(order) => order.orderNumber}
                emptyText="Belum ada pesanan yang cocok dengan filter."
            />

            <Pagination links={orders.links} />
        </AdminPage>
    );
}
