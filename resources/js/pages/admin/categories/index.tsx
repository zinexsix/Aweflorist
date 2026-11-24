import { useForm, router } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import AdminPage from '@/components/admin/admin-page';
import AdminTable, {
    type AdminTableColumn,
} from '@/components/admin/admin-table';
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
import {
    destroy as categoriesDestroy,
    index as categoriesIndex,
    store as categoriesStore,
    update as categoriesUpdate,
} from '@/routes/admin/categories';
import type { AdminCategoryRow } from '@/types/admin';

type Props = {
    categories: AdminCategoryRow[];
};

const textareaClass =
    'border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 flex min-h-20 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] md:text-sm';

export default function CategoriesIndex({ categories }: Props) {
    const [editing, setEditing] = useState<AdminCategoryRow | null>(null);
    const [deleting, setDeleting] = useState<AdminCategoryRow | null>(null);

    const createForm = useForm({ name: '', description: '' });
    const editForm = useForm({ id: 0, name: '', description: '' });

    useEffect(() => {
        if (editing) {
            editForm.reset();
            editForm.setData({
                id: editing.id,
                name: editing.name,
                description: editing.description ?? '',
            });
        }
    }, [editing]);

    const submitCreate = (event: FormEvent) => {
        event.preventDefault();
        createForm.post(categoriesStore().url, {
            preserveScroll: true,
            onSuccess: () => createForm.reset(),
        });
    };

    const submitEdit = (event: FormEvent) => {
        event.preventDefault();
        editForm.put(categoriesUpdate(editForm.data.id).url, {
            preserveScroll: true,
            onSuccess: () => setEditing(null),
        });
    };

    const columns: AdminTableColumn<AdminCategoryRow>[] = [
        {
            header: 'Nama',
            cell: (category) => (
                <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium">{category.name}</span>
                        {category.isPriceCategory && (
                            <StatusBadge
                                status="bawaan"
                                label="Kategori harga"
                                variant="secondary"
                            />
                        )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                        {category.slug}
                    </span>
                </div>
            ),
        },
        {
            header: 'Deskripsi',
            cell: (category) => category.description ?? '—',
        },
        {
            header: 'Produk',
            cell: (category) => `${category.productsCount} produk`,
        },
        {
            header: 'Aksi',
            cell: (category) => (
                <div className="flex gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setEditing(category)}
                    >
                        <Pencil />
                        Ubah
                    </Button>
                    {!category.isPriceCategory && (
                        <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => setDeleting(category)}
                        >
                            <Trash2 />
                            Hapus
                        </Button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <AdminPage
            title="Kategori"
            description="Kelola pengelompokan produk berdasarkan kategori."
            breadcrumbs={[
                { title: 'Dashboard', href: adminDashboard() },
                { title: 'Kategori', href: categoriesIndex() },
            ]}
        >
            <form
                onSubmit={submitCreate}
                className="grid max-w-3xl gap-4 rounded-lg border border-border bg-card p-5"
            >
                <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Nama kategori</Label>
                        <Input
                            id="name"
                            value={createForm.data.name}
                            onChange={(event) =>
                                createForm.setData('name', event.target.value)
                            }
                            placeholder="Misalnya Buket Musim Semi"
                            autoComplete="off"
                        />
                        <InputError message={createForm.errors.name} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description">
                            Deskripsi{' '}
                            <span className="font-normal text-muted-foreground">
                                (opsional)
                            </span>
                        </Label>
                        <textarea
                            id="description"
                            rows={2}
                            value={createForm.data.description}
                            onChange={(event) =>
                                createForm.setData(
                                    'description',
                                    event.target.value,
                                )
                            }
                            className={textareaClass}
                        />
                        <InputError message={createForm.errors.description} />
                    </div>
                </div>
                <div>
                    <Button type="submit" disabled={createForm.processing}>
                        <Plus />
                        Tambah Kategori
                    </Button>
                </div>
            </form>

            <AdminTable
                columns={columns}
                rows={categories}
                emptyText="Belum ada kategori."
            />

            <Dialog
                open={editing !== null}
                onOpenChange={(open) => !open && setEditing(null)}
            >
                <DialogContent>
                    <form onSubmit={submitEdit} className="grid gap-4">
                        <DialogHeader>
                            <DialogTitle>Ubah Kategori</DialogTitle>
                            <DialogDescription>
                                Nama boleh diubah; slug kategori tetap
                                dipertahankan.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-name">Nama kategori</Label>
                            <Input
                                id="edit-name"
                                value={editForm.data.name}
                                onChange={(event) =>
                                    editForm.setData('name', event.target.value)
                                }
                                autoComplete="off"
                            />
                            <InputError message={editForm.errors.name} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-description">Deskripsi</Label>
                            <textarea
                                id="edit-description"
                                rows={3}
                                value={editForm.data.description}
                                onChange={(event) =>
                                    editForm.setData(
                                        'description',
                                        event.target.value,
                                    )
                                }
                                className={textareaClass}
                            />
                            <InputError message={editForm.errors.description} />
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setEditing(null)}
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={editForm.processing}
                            >
                                Simpan
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog
                open={deleting !== null}
                onOpenChange={(open) => !open && setDeleting(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hapus kategori?</DialogTitle>
                        <DialogDescription>
                            {deleting?.productsCount
                                ? `Kategori ${deleting.name} masih memiliki ${deleting.productsCount} produk dan tidak bisa dihapus.`
                                : `Kategori ${deleting?.name} akan dihapus permanen.`}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setDeleting(null)}
                        >
                            Tutup
                        </Button>
                        {!deleting?.productsCount && (
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={() => {
                                    if (deleting) {
                                        router.delete(
                                            categoriesDestroy(deleting.id).url,
                                            {
                                                onSuccess: () =>
                                                    setDeleting(null),
                                            },
                                        );
                                    }
                                }}
                            >
                                Hapus
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminPage>
    );
}
