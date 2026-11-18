<?php

namespace App\Support;

/**
 * Menentukan kategori harga sebuah produk dari harganya.
 * Slug harus sama dengan kategori di resources/js/data/catalog.json.
 *
 *   harga kosong (dikonfirmasi admin)  → harga-premium
 *   < Rp50.000                          → harga-di-bawah-50rb
 *   < Rp80.000                          → harga-50rb-75rb
 *   ≤ Rp100.000 (bukan "mulai")         → harga-80rb-100rb
 *   > Rp100.000 atau "mulai Rp100.000"  → harga-di-atas-100rb
 */
class PriceCategory
{
    /** @var list<string> */
    public const SLUGS = [
        'harga-di-bawah-50rb',
        'harga-50rb-75rb',
        'harga-80rb-100rb',
        'harga-di-atas-100rb',
        'harga-premium',
    ];

    public static function slugFor(int|float|string|null $price, bool $priceFrom = false): string
    {
        if ($price === null || $price === '') {
            return 'harga-premium';
        }

        $price = (float) $price;

        return match (true) {
            $price < 50000 => 'harga-di-bawah-50rb',
            $price < 80000 => 'harga-50rb-75rb',
            $price <= 100000 && ! $priceFrom => 'harga-80rb-100rb',
            default => 'harga-di-atas-100rb',
        };
    }
}
