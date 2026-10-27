<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['name', 'phone', 'email', 'notes'])]
class Customer extends Model
{
    use HasFactory;

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function customRequests(): HasMany
    {
        return $this->hasMany(CustomRequest::class);
    }

    /**
     * Ubah nomor WhatsApp ke format 628xxxxxxxxxx.
     * Contoh: "0812-3456-7890" dan "+62 812 3456 7890" menjadi "6281234567890".
     */
    public static function normalizePhone(string $phone): string
    {
        $phone = preg_replace('/[^0-9]/', '', $phone);

        if (str_starts_with($phone, '0')) {
            $phone = '62'.substr($phone, 1);
        }

        return $phone;
    }
}
