import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import type { FormEvent } from 'react';
import AdminPage from '@/components/admin/admin-page';
import StatusBadge from '@/components/admin/status-badge';
import InputError from '@/components/input-error';
import { Button, buttonVariants } from '@/components/ui/button';
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
    approval as customRequestsApproval,
    index as customRequestsIndex,
} from '@/routes/admin/custom-requests';
import type { AdminCustomRequestDetail } from '@/types/admin';

type Props = {
    request: AdminCustomRequestDetail;
};

const decisions = [
    { value: 'disetujui', label: 'Setujui' },
    { value: 'ditolak', label: 'Tolak' },
];

function formatDate(isoDate: string): string {
    if (!isoDate) {
        return '-';
    }

    return new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'long',
    }).format(new Date(`${isoDate}T00:00:00`));
}

export default function CustomRequestsShow({ request }: Props) {
    const form = useForm({
        approval_status:
            request.approvalStatus === 'ditolak' ? 'ditolak' : 'disetujui',
        approval_note: request.approvalNote ?? '',
    });

    const submit = (event: FormEvent) => {
        event.preventDefault();

        form.patch(customRequestsApproval(request.requestNumber).url, {
            preserveScroll: true,
        });
    };

    const details = [
        { label: 'Nomor permintaan', value: request.requestNumber },
        { label: 'Pelanggan', value: request.customerName },
        {
            label: 'Nomor WhatsApp',
            value: request.customerPhone || '-',
        },
        { label: 'Email', value: request.customerEmail || '-' },
        { label: 'Jenis buket', value: request.bouquetType },
        { label: 'Anggaran', value: formatRupiah(request.budget) },
        { label: 'Warna atau tema', value: request.themeColor },
        { label: 'Tanggal dibutuhkan', value: formatDate(request.neededAt) },
        { label: 'Model acuan', value: request.productName || '-' },
        { label: 'Status', value: request.statusLabel },
    ];

    return (
        <AdminPage
            title="Detail Buket Custom"
            description="Periksa permintaan lalu ambil keputusan persetujuan."
            breadcrumbs={[
                { title: 'Dashboard', href: adminDashboard() },
                { title: 'Buket Custom', href: customRequestsIndex() },
                { title: request.requestNumber, href: customRequestsIndex() },
            ]}
            actions={
                <Link
                    href={customRequestsIndex().url}
                    className={buttonVariants({ variant: 'outline' })}
                >
                    <ArrowLeft />
                    Kembali
                </Link>
            }
        >
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
                <div className="grid gap-6">
                    <section className="grid gap-4 rounded-lg border border-border bg-card p-5">
                        <div className="flex flex-wrap items-center gap-2">
                            <h2 className="text-lg font-semibold">
                                Data permintaan
                            </h2>
                            <StatusBadge
                                status={request.approvalStatus}
                                label={request.approvalLabel}
                            />
                        </div>
                        <dl className="grid gap-4 sm:grid-cols-2">
                            {details.map((item) => (
                                <div key={item.label} className="grid gap-1">
                                    <dt className="text-xs font-medium text-muted-foreground">
                                        {item.label}
                                    </dt>
                                    <dd className="text-sm break-words">
                                        {item.value}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                        {request.notes && (
                            <div className="grid gap-1">
                                <p className="text-xs font-medium text-muted-foreground">
                                    Catatan pelanggan
                                </p>
                                <p className="text-sm whitespace-pre-wrap">
                                    {request.notes}
                                </p>
                            </div>
                        )}
                        <a
                            href={request.whatsappUrl}
                            target="_blank"
                            rel="noreferrer"
                            className={buttonVariants({ variant: 'outline' })}
                        >
                            <MessageCircle />
                            Hubungi Pelanggan
                        </a>
                    </section>

                    {request.referenceImageUrl && (
                        <section className="grid gap-3 rounded-lg border border-border bg-card p-5">
                            <h2 className="text-lg font-semibold">
                                Gambar referensi
                            </h2>
                            <a
                                href={request.referenceImageUrl}
                                target="_blank"
                                rel="noreferrer"
                            >
                                <img
                                    src={request.referenceImageUrl}
                                    alt="Gambar referensi buket custom"
                                    className="max-h-96 w-full rounded-md border border-border object-contain"
                                />
                                <p className="mt-2 text-sm text-muted-foreground hover:underline">
                                    Klik untuk melihat ukuran penuh
                                </p>
                            </a>
                        </section>
                    )}
                </div>

                <div className="grid gap-6">
                    <section className="grid gap-4 rounded-lg border border-border bg-card p-5">
                        <div className="grid gap-1">
                            <h2 className="text-lg font-semibold">
                                Keputusan persetujuan
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Persetujuan mengubah status permintaan menjadi
                                Disepakati atau Dibatalkan.
                            </p>
                        </div>
                        <form onSubmit={submit} className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="approval-status">
                                    Keputusan
                                </Label>
                                <Select
                                    value={form.data.approval_status}
                                    onValueChange={(value) =>
                                        form.setData('approval_status', value)
                                    }
                                >
                                    <SelectTrigger id="approval-status">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {decisions.map((decision) => (
                                            <SelectItem
                                                key={decision.value}
                                                value={decision.value}
                                            >
                                                {decision.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError
                                    message={form.errors.approval_status}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="approval-note">
                                    Catatan{' '}
                                    <span className="font-normal text-muted-foreground">
                                        (wajib saat menolak)
                                    </span>
                                </Label>
                                <textarea
                                    id="approval-note"
                                    rows={4}
                                    value={form.data.approval_note}
                                    onChange={(event) =>
                                        form.setData(
                                            'approval_note',
                                            event.target.value,
                                        )
                                    }
                                    className="flex min-h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 md:text-sm"
                                />
                                <InputError
                                    message={form.errors.approval_note}
                                />
                            </div>
                            <Button type="submit" disabled={form.processing}>
                                Simpan Keputusan
                            </Button>
                        </form>
                    </section>

                    <section className="grid gap-3 rounded-lg border border-border bg-card p-5 text-sm">
                        <h2 className="text-lg font-semibold">
                            Riwayat persetujuan
                        </h2>
                        <p>
                            <span className="text-muted-foreground">
                                Waktu keputusan:{' '}
                            </span>
                            {request.approvedAt || 'Belum ada'}
                        </p>
                        <p>
                            <span className="text-muted-foreground">
                                Catatan:{' '}
                            </span>
                            {request.approvalNote || '-'}
                        </p>
                    </section>
                </div>
            </div>
        </AdminPage>
    );
}
