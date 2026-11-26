import { Link, router } from '@inertiajs/react';
import AdminPage from '@/components/admin/admin-page';
import AdminTable, {
    type AdminTableColumn,
} from '@/components/admin/admin-table';
import FilterBar from '@/components/admin/filter-bar';
import Pagination from '@/components/admin/pagination';
import StatusBadge from '@/components/admin/status-badge';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { formatRupiah } from '@/lib/format';
import { dashboard as adminDashboard } from '@/routes/admin';
import {
    index as customRequestsIndex,
    show as customRequestsShow,
} from '@/routes/admin/custom-requests';
import type { AdminCustomRequestRow, Option, Paginated } from '@/types/admin';

type Props = {
    requests: Paginated<AdminCustomRequestRow>;
    approvals: Option[];
    filters: { q: string; persetujuan: string };
};

function formatDate(isoDate: string): string {
    if (!isoDate) {
        return '-';
    }

    return new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'long',
    }).format(new Date(`${isoDate}T00:00:00`));
}

export default function CustomRequestsIndex({
    requests,
    approvals,
    filters,
}: Props) {
    const updateFilter = (value: string) => {
        router.get(
            customRequestsIndex.url(),
            {
                ...filters,
                persetujuan: value === 'all' ? '' : value,
            },
            { preserveState: true, preserveScroll: true },
        );
    };

    const columns: AdminTableColumn<AdminCustomRequestRow>[] = [
        {
            header: 'Nomor CST',
            cell: (item) => (
                <div className="min-w-44 space-y-0.5">
                    <Link
                        href={customRequestsShow(item.requestNumber).url}
                        className="font-medium hover:underline"
                    >
                        {item.requestNumber}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                        {formatDate(item.createdAt)}
                    </p>
                </div>
            ),
        },
        {
            header: 'Pelanggan',
            cell: (item) => item.customerName,
        },
        {
            header: 'Jenis buket',
            cell: (item) => item.bouquetType,
        },
        {
            header: 'Anggaran',
            cell: (item) => formatRupiah(item.budget),
        },
        {
            header: 'Dibutuhkan',
            cell: (item) => formatDate(item.neededAt),
        },
        {
            header: 'Persetujuan',
            cell: (item) => (
                <StatusBadge
                    status={item.approvalStatus}
                    label={item.approvalLabel}
                />
            ),
        },
    ];

    return (
        <AdminPage
            title="Buket Custom"
            description="Lihat dan setujui permintaan buket custom dari pelanggan."
            breadcrumbs={[
                { title: 'Dashboard', href: adminDashboard() },
                { title: 'Buket Custom', href: customRequestsIndex() },
            ]}
        >
            <FilterBar
                action={customRequestsIndex.url()}
                q={filters.q}
                placeholder="Cari nomor atau nama pelanggan..."
            >
                <div className="grid w-full gap-1 sm:w-52">
                    <Label className="text-xs" htmlFor="filter-persetujuan">
                        Persetujuan
                    </Label>
                    <Select
                        value={filters.persetujuan || 'all'}
                        onValueChange={updateFilter}
                    >
                        <SelectTrigger
                            id="filter-persetujuan"
                            className="w-full"
                        >
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">
                                Semua persetujuan
                            </SelectItem>
                            {approvals.map((option) => (
                                <SelectItem
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </FilterBar>

            <AdminTable
                columns={columns}
                rows={requests.data}
                emptyText="Tidak ada permintaan buket custom yang cocok dengan pencarian."
            />

            <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-muted-foreground">
                    {requests.total === 0
                        ? 'Tidak ada permintaan.'
                        : `Menampilkan ${requests.from}–${requests.to} dari ${requests.total} permintaan.`}
                </p>
                <Pagination links={requests.links} />
            </div>
        </AdminPage>
    );
}
