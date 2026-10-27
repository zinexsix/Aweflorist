<?php

namespace App\Enums;

enum OrderStatus: string
{
    case Baru = 'baru';
    case MenungguKonfirmasi = 'menunggu_konfirmasi';
    case Dikonfirmasi = 'dikonfirmasi';
    case Diproses = 'diproses';
    case SiapDiambilDikirim = 'siap';
    case Selesai = 'selesai';
    case Dibatalkan = 'dibatalkan';

    public function label(): string
    {
        return match ($this) {
            self::Baru => 'Baru',
            self::MenungguKonfirmasi => 'Menunggu Konfirmasi',
            self::Dikonfirmasi => 'Dikonfirmasi',
            self::Diproses => 'Diproses',
            self::SiapDiambilDikirim => 'Siap Diambil/Dikirim',
            self::Selesai => 'Selesai',
            self::Dibatalkan => 'Dibatalkan',
        };
    }
}
