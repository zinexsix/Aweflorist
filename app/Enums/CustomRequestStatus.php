<?php

namespace App\Enums;

enum CustomRequestStatus: string
{
    case Baru = 'baru';
    case Ditinjau = 'ditinjau';
    case Disepakati = 'disepakati';
    case Dibatalkan = 'dibatalkan';

    public function label(): string
    {
        return match ($this) {
            self::Baru => 'Baru',
            self::Ditinjau => 'Ditinjau',
            self::Disepakati => 'Disepakati',
            self::Dibatalkan => 'Dibatalkan',
        };
    }
}
