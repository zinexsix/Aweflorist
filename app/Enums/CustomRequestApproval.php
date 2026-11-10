<?php

namespace App\Enums;

/**
 * Persetujuan admin atas permintaan buket custom (kolom custom_requests.approval_status).
 */
enum CustomRequestApproval: string
{
    case Menunggu = 'menunggu';
    case Disetujui = 'disetujui';
    case Ditolak = 'ditolak';

    public function label(): string
    {
        return match ($this) {
            self::Menunggu => 'Menunggu persetujuan admin',
            self::Disetujui => 'Disetujui',
            self::Ditolak => 'Ditolak',
        };
    }
}
