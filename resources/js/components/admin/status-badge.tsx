import type { VariantProps } from 'class-variance-authority';
import { Badge, type badgeVariants } from '@/components/ui/badge';

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>['variant']>;

const tones: Record<string, BadgeVariant> = {
    aktif: 'default',
    nonaktif: 'secondary',
    unggulan: 'default',
    baru: 'default',
    menunggu: 'secondary',
    menunggu_konfirmasi: 'secondary',
    dikonfirmasi: 'default',
    diproses: 'default',
    siap: 'default',
    selesai: 'default',
    dibatalkan: 'destructive',
    belum_dibayar: 'destructive',
    dp: 'secondary',
    lunas: 'default',
    dikembalikan: 'secondary',
    tidak_berlaku: 'secondary',
    disetujui: 'default',
    ditolak: 'destructive',
    disepakati: 'default',
    ditinjau: 'secondary',
    terverifikasi: 'default',
    belum_diverifikasi: 'secondary',
};

export default function StatusBadge({
    status,
    label,
    variant,
}: {
    status: string;
    label?: string;
    variant?: BadgeVariant;
}) {
    return (
        <Badge
            variant={variant ?? tones[status.trim().toLowerCase()] ?? 'outline'}
        >
            {label ?? status}
        </Badge>
    );
}
