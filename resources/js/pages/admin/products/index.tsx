import { Link, router } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import AdminPage from '@/components/admin/admin-page';
import AdminTable, {
    type AdminTableColumn,
} from '@/components/admin/admin-table';
import FilterBar from '@/components/admin/filter-bar';
import Pagination from '@/components/admin/pagination';
import StatusBadge from '@/components/admin/status-badge';
import { Button, buttonVariants } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { dashboard as adminDashboard } from '@/routes/admin';
import {
    create as productsCreate,
    destroy as productsDestroy,
    edit as productsEdit,
    index as productsIndex,
} from '@/routes/admin/products';
import type { AdminProductRow, Option, Paginated } from '@/types/admin';

type Props = {
    products: Paginated<AdminProductRow>;
    categories: Option[];
    filters: { q: string; kategori: string; status: string };
};

const statuses: Option[] = [
    { value: 'aktif', label: 'Aktif' },
    { value: 'nonaktif', label: 'Nonaktif' },
];

function rupiah(price: number | null, priceFrom: boolean): string {
    if (price === null) {
        return 'Dikonfirmasi admin';
    }

    const formatted = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(price);

    return priceFrom ? `Mulai ${formatted}` : formatted;
}

function FilterSelect({
    label,
    value,
    options,
    allLabel,
    onChange,
}: {
    label: string;
    value: string;
    options: Option[];
    allLabel: string;
    onChange: (value: string) => void;
}) {
    return (
        <div className="grid w-full gap-1 sm:w-44">
            <Label className="text-xs">{label}</Label>
            <Select value={value || 'all'} onValueChange={onChange}>
                <SelectTrigger className="w-full">
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

export default function ProductsIndex({
    products,
    categories,
    filters,
}: Props) {
    const [deleting, setDeleting] = useState<AdminProductRow | null>(null);

    const updateFilter = (name: 'kategori' | 'status', value: string) => {
        router.get(
            productsIndex.url(),
            {
                ...filters,
                [name]: value === 'all' ? '' : value,
            },
            { preserveState: true, preserveScroll: true },
        );
    };

    const columns: AdminTableColumn<AdminProductRow>[] = [
        {
            header: 'Foto',
            cell: (product) =>
                product.image ? (
                    <img
                        src={product.image}
                        alt={product.name}
                        className="size-12 rounded-md border border-border object-cover"
                    />
                ) : (
                    <div className="flex size-12 items-center justify-center rounded-md border border-dashed border-border text-xs text-muted-foreground">
                        Tanpa foto
                    </div>
                ),
        },
        {
            header: 'Produk',
            cell: (product) => (
                <div className="min-w-48 space-y-0.5">
                    <p className="font-medium">{product.name}</p>
                    <p className="text-xs text-muted-foreground">
                        {product.slug}
                    </p>
                </div>
            ),
        },
        { header: 'Kategori', cell: (product) => product.category },
        {
            header: 'Harga',
            cell: (product) => rupiah(product.price, product.priceFrom),
        },
        {
            header: 'Status',
            cell: (product) => (
                <StatusBadge
                    status={product.isActive ? 'aktif' : 'nonaktif'}
                    label={product.isActive ? 'Aktif' : 'Nonaktif'}
                />
            ),
        },
        {
            header: 'Unggulan',
            cell: (product) => (
                <StatusBadge
                    status={product.isFeatured ? 'unggulan' : 'tidak'}
                    label={product.isFeatured ? 'Ya' : 'Tidak'}
                />
            ),
        },
        {
            header: 'Aksi',
            cell: (product) => (
                <div className="flex gap-2">
                    <Link
                        href={productsEdit(product.id).url}
                        className={buttonVariants({
                            variant: 'outline',
                            size: 'sm',
                        })}
                    >
                        <Pencil />
                        Ubah
                    </Link>
                    <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeleting(product)}
                    >
                        <Trash2 />
                        Hapus
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <AdminPage
            title="Produk"
            description="Kelola produk yang tampil di katalog AweFlorist."
            breadcrumbs={[
                { title: 'Dashboard', href: adminDashboard() },
                { title: 'Produk', href: productsIndex() },
            ]}
            actions={
                <Link href={productsCreate().url} className={buttonVariants()}>
                    <Plus />
                    Tambah Produk
                </Link>
            }
        >
            <FilterBar
                action={productsIndex.url()}
                q={filters.q}
                placeholder="Cari nama produk..."
            >
                <FilterSelect
                    label="Kategori"
                    value={filters.kategori}
                    options={categories}
                    allLabel="Semua kategori"
                    onChange={(value) => updateFilter('kategori', value)}
                />
                <FilterSelect
                    label="Status"
                    value={filters.status}
                    options={statuses}
                    allLabel="Semua status"
                    onChange={(value) => updateFilter('status', value)}
                />
            </FilterBar>

            <AdminTable
                columns={columns}
                rows={products.data}
                emptyText="Tidak ada produk yang cocok dengan pencarian."
            />

            <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-muted-foreground">
                    {products.total === 0
                        ? 'Tidak ada produk.'
                        : `Menampilkan ${products.from}–${products.to} dari ${products.total} produk.`}
                </p>
                <Pagination links={products.links} />
            </div>

            <Dialog
                open={deleting !== null}
                onOpenChange={(open) => !open && setDeleting(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hapus produk?</DialogTitle>
                        <DialogDescription>
                            {deleting?.canDelete
                                ? `Produk ${deleting.name} akan dihapus permanen beserta gambar unggahannya.`
                                : `Produk ${deleting?.name} sudah pernah dipesan atau diminta. Produk hanya akan dinonaktifkan agar riwayat tetap terbaca.`}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDeleting(null)}
                        >
                            Batal
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={() => {
                                if (deleting) {
                                    router.delete(
                                        productsDestroy(deleting.id).url,
                                        {
                                            onSuccess: () => setDeleting(null),
                                        },
                                    );
                                }
                            }}
                        >
                            {deleting?.canDelete ? 'Hapus' : 'Nonaktifkan'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminPage>
    );
}
