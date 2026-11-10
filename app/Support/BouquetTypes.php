<?php

namespace App\Support;

/**
 * Pilihan "jenis buket" di formulir buket custom (US-15).
 * Sesuai keputusan pemilik (11 Nov 2026): cukup Wisuda dan Other Occasion.
 * Dipakai bersama oleh halaman formulir dan validasi supaya isinya selalu sama.
 */
class BouquetTypes
{
    public const WISUDA = 'Wisuda';

    public const OTHER = 'Other Occasion';

    /**
     * @return list<string>
     */
    public static function all(): array
    {
        return [self::WISUDA, self::OTHER];
    }
}
