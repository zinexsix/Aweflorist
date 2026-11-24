import { router, useForm } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import AdminPage from '@/components/admin/admin-page';
import AdminTable, {
    type AdminTableColumn,
} from '@/components/admin/admin-table';
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
    destroy as eventsDestroy,
    index as eventsIndex,
    store as eventsStore,
    update as eventsUpdate,
} from '@/routes/admin/events';
import type { AdminEventRow } from '@/types/admin';

type Props = {
    events: AdminEventRow[];
};

const textareaClass =
    'border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 flex min-h-20 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] md:text-sm';

export default function EventsIndex({ events }: Props) {
    const [editing, setEditing] = useState<AdminEventRow | null>(null);
    const [deleting, setDeleting] = useState<AdminEventRow | null>(null);

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
        createForm.post(eventsStore().url, {
            preserveScroll: true,
            onSuccess: () => createForm.reset(),
        });
    };

    const submitEdit = (event: FormEvent) => {
        event.preventDefault();
        editForm.put(eventsUpdate(editForm.data.id).url, {
            preserveScroll: true,
            onSuccess: () => setEditing(null),
        });
    };

    const columns: AdminTableColumn<AdminEventRow>[] = [
        {
            header: 'Nama',
            cell: (event) => (
                <div className="space-y-1">
                    <span className="font-medium">{event.name}</span>
                    <span className="block text-xs text-muted-foreground">
                        {event.slug}
                    </span>
                </div>
            ),
        },
        { header: 'Deskripsi', cell: (event) => event.description ?? '—' },
        { header: 'Produk', cell: (event) => `${event.productsCount} produk` },
        {
            header: 'Aksi',
            cell: (event) => (
                <div className="flex gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setEditing(event)}
                    >
                        <Pencil />
                        Ubah
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeleting(event)}
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
            title="Acara"
            description="Kelola acara yang bisa dipilih pada produk."
            breadcrumbs={[
                { title: 'Dashboard', href: adminDashboard() },
                { title: 'Acara', href: eventsIndex() },
            ]}
        >
            <form
                onSubmit={submitCreate}
                className="grid max-w-3xl gap-4 rounded-lg border border-border bg-card p-5"
            >
                <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Nama acara</Label>
                        <Input
                            id="name"
                            value={createForm.data.name}
                            onChange={(changeEvent) =>
                                createForm.setData(
                                    'name',
                                    changeEvent.target.value,
                                )
                            }
                            placeholder="Misalnya Wisuda"
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
                            onChange={(changeEvent) =>
                                createForm.setData(
                                    'description',
                                    changeEvent.target.value,
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
                        Tambah Acara
                    </Button>
                </div>
            </form>

            <AdminTable
                columns={columns}
                rows={events}
                emptyText="Belum ada acara."
            />

            <Dialog
                open={editing !== null}
                onOpenChange={(open) => !open && setEditing(null)}
            >
                <DialogContent>
                    <form onSubmit={submitEdit} className="grid gap-4">
                        <DialogHeader>
                            <DialogTitle>Ubah Acara</DialogTitle>
                            <DialogDescription>
                                Nama boleh diubah; slug acara tetap
                                dipertahankan.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-name">Nama acara</Label>
                            <Input
                                id="edit-name"
                                value={editForm.data.name}
                                onChange={(changeEvent) =>
                                    editForm.setData(
                                        'name',
                                        changeEvent.target.value,
                                    )
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
                                onChange={(changeEvent) =>
                                    editForm.setData(
                                        'description',
                                        changeEvent.target.value,
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
                        <DialogTitle>Hapus acara?</DialogTitle>
                        <DialogDescription>
                            Acara {deleting?.name} akan dihapus dan hubungannya
                            dengan produk dilepas.
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
                                        eventsDestroy(deleting.id).url,
                                        {
                                            onSuccess: () => setDeleting(null),
                                        },
                                    );
                                }
                            }}
                        >
                            Hapus
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminPage>
    );
}
