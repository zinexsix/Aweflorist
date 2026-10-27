<?php

namespace App\Support;

use Illuminate\Database\Eloquent\Model;
use RuntimeException;

class ReferenceNumber
{
    /**
     * Karakter acak tanpa huruf/angka yang mirip (O/0, I/1).
     */
    private const CHARACTERS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

    private const MAX_ATTEMPTS = 5;

    /**
     * Buat nomor unik berformat PREFIX-YYYYMMDD-XXXXX, misalnya AWF-20261029-K7M2Q.
     *
     * @param  class-string<Model>  $modelClass
     */
    public static function generate(string $prefix, string $modelClass, string $column): string
    {
        for ($attempt = 0; $attempt < self::MAX_ATTEMPTS; $attempt++) {
            $number = $prefix.'-'.now()->format('Ymd').'-'.self::randomCode(5);

            if (! $modelClass::query()->where($column, $number)->exists()) {
                return $number;
            }
        }

        throw new RuntimeException("Gagal membuat nomor {$prefix} yang unik.");
    }

    private static function randomCode(int $length): string
    {
        $code = '';

        for ($i = 0; $i < $length; $i++) {
            $code .= self::CHARACTERS[random_int(0, strlen(self::CHARACTERS) - 1)];
        }

        return $code;
    }
}
