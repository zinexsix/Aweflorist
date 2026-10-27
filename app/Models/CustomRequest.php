<?php

namespace App\Models;

use App\Enums\CustomRequestStatus;
use Database\Factories\CustomRequestFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['request_number', 'customer_id', 'product_id', 'budget', 'theme_color', 'bouquet_type', 'needed_at', 'reference_image_path', 'notes', 'status'])]
class CustomRequest extends Model
{
    /** @use HasFactory<CustomRequestFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'status' => CustomRequestStatus::class,
            'needed_at' => 'date',
            'budget' => 'decimal:2',
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'request_number';
    }

    /**
     * @return BelongsTo<Customer, $this>
     */
    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    /**
     * @return BelongsTo<Product, $this>
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
