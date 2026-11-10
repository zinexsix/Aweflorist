<?php

namespace App\Support;

use App\Models\Category;

/**
 * Pilihan "jenis buket" di formulir buket custom (US-15).
 * Dipakai bersama oleh halaman formulir dan validasi supaya isinya selalu sama.
 */
class BouquetTypes
{
    public const OTHER = 'Lainnya (jelaskan di catatan)';

    /**
     * Nama kategori dari database (kecuali "Buket Custom") ditambah pilihan "Lainnya".
     *
     * @return list<string>
     */
    public static function all(): array
    {
        $names = Category::query()
            ->where('slug', '!=', 'buket-custom')
            ->orderBy('id')
            ->pluck('name')
            ->all();

        return [...array_values($names), self::OTHER];
    }
}
