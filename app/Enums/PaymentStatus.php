<?php

namespace App\Enums;

enum PaymentStatus: string
{
    case BelumDibayar = 'belum_dibayar';
    case Dp = 'dp';
    case Lunas = 'lunas';
    case Dikembalikan = 'dikembalikan';
    case TidakBerlaku = 'tidak_berlaku';

    public function label(): string
    {
        return match ($this) {
            self::BelumDibayar => 'Belum Dibayar',
            self::Dp => 'DP',
            self::Lunas => 'Lunas',
            self::Dikembalikan => 'Dikembalikan',
            self::TidakBerlaku => 'Tidak Berlaku',
        };
    }
}
