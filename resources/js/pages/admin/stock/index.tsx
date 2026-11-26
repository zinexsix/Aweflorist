import { useForm } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import AdminPage from '@/components/admin/admin-page';
import AdminTable, {
    type AdminTableColumn,
} from '@/components/admin/admin-table';
import FilterBar from '@/components/admin/filter-bar';
import Pagination from '@/components/admin/pagination';
import StatusBadge from '@/components/admin/status-badge';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { dashboard as adminDashboard } from '@/routes/admin';
import { index as stockIndex, store as stockStore } from '@/routes/admin/stock';
import type {
    AdminStockMovement,
    AdminStockRow,
    Paginated,
} from '@/types/admin';

type Props = {
    products: Paginated<AdminStockRow>;
    movements: AdminStockMovement[];
    filters: { q: string };
};

export default function StockIndex({ products, movements, filters }: Props) {
    const [selected, setSelected] = useState<AdminStockRow | null>(null);
    const form = useForm({ quantity_change: '', reason: '' });

    const openDialog = (product: AdminStockRow) => {
        form.reset();
        setSelected(product);
    };

    const submit = (event: FormEvent) => {
        event.preventDefault();

        if (!selected) {
            return;
        }

        form.post(stockStore(selected.id).url, {
            preserveScroll: true,
            onSuccess: () => setSelected(null),
        });
    };

    const productColumns: AdminTableColumn<AdminStockRow>[] = [
        {
            header: 'Produk',
            cell: (product) => (
                <div className="min-w-48 space-y-0.5">
                    <p className="font-medium">{product.name}</p>
                    <p className="text-xs text-muted-foreground">
                        {product.category}
                    </p>
                </div>
            ),
        },
        {
            header: 'Stok',
            cell: (product) =>
                product.stock === null ? (
                    <span className="text-muted-foreground">
                        Tidak dikelola
                    </span>
                ) : (
                    <span className="font-medium">{product.stock}</span>
                ),
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
            header: 'Aksi',
            cell: (product) => (
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => openDialog(product)}
                >
                    <Plus />
                    Ubah Stok
                </Button>
            ),
        },
    ];

    const movementColumns: AdminTableColumn<AdminStockMovement>[] = [
        {
            header: 'Waktu',
            cell: (movement) => (
                <span className="whitespace-nowrap">{movement.createdAt}</span>
            ),
        },
        { header: 'Produk', cell: (movement) => movement.productName },
        {
            header: 'Perubahan',
            cell: (movement) => (
                <span
                    className={
                        movement.quantityChange > 0
                            ? 'font-medium text-emerald-700'
                            : 'font-medium text-red-600'
                    }
                >
                    {movement.quantityChange > 0 ? '+' : ''}
                    {movement.quantityChange}
                </span>
            ),
        },
        { header: 'Stok setelah', cell: (movement) => movement.stockAfter },
        { header: 'Alasan', cell: (movement) => movement.reason },
        {
            header: 'Admin',
            cell: (movement) => movement.userName ?? '—',
        },
    ];

    return (
        <AdminPage
            title="Stok"
            description="Catat barang masuk dan keluar beserta alasannya."
            breadcrumbs={[
                { title: 'Dashboard', href: adminDashboard() },
                { title: 'Stok', href: stockIndex() },
            ]}
        >
            <FilterBar
                action={stockIndex.url()}
                q={filters.q}
                placeholder="Cari nama produk..."
            />

            <AdminTable
                columns={productColumns}
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

            <section className="grid gap-3">
                <div>
                    <h2 className="text-lg font-semibold">
                        Riwayat pergerakan
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        20 pergerakan terbaru.
                    </p>
                </div>
                <AdminTable
                    columns={movementColumns}
                    rows={movements}
                    emptyText="Belum ada pergerakan stok."
                />
            </section>

            <Dialog
                open={selected !== null}
                onOpenChange={(open) => !open && setSelected(null)}
            >
                <DialogContent>
                    <form onSubmit={submit} className="grid gap-4">
                        <DialogHeader>
                            <DialogTitle>Ubah Stok</DialogTitle>
                            <DialogDescription>
                                {selected
                                    ? `Produk ${selected.name}. Gunakan angka negatif untuk stok keluar.`
                                    : ''}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-2">
                            <Label htmlFor="quantity-change">
                                Jumlah perubahan
                            </Label>
                            <Input
                                id="quantity-change"
                                type="number"
                                step="1"
                                value={form.data.quantity_change}
                                onChange={(event) =>
                                    form.setData(
                                        'quantity_change',
                                        event.target.value,
                                    )
                                }
                                placeholder="Misalnya 10 atau -3"
                            />
                            <InputError message={form.errors.quantity_change} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="reason">Alasan</Label>
                            <Input
                                id="reason"
                                value={form.data.reason}
                                onChange={(event) =>
                                    form.setData('reason', event.target.value)
                                }
                                placeholder="Misalnya Restok atau Rusak"
                                autoComplete="off"
                            />
                            <InputError message={form.errors.reason} />
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setSelected(null)}
                            >
                                Batal
                            </Button>
                            <Button type="submit" disabled={form.processing}>
                                Simpan
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AdminPage>
    );
}
