<?php

namespace App\Models;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use Database\Factories\OrderFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['order_number', 'customer_id', 'order_status', 'payment_status', 'needed_at', 'notes', 'total_amount'])]
class Order extends Model
{
    /** @use HasFactory<OrderFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'order_status' => OrderStatus::class,
            'payment_status' => PaymentStatus::class,
            'needed_at' => 'date',
            'total_amount' => 'decimal:2',
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'order_number';
    }

    /**
     * Pesanan yang perlu ditindaklanjuti admin (US-21, kontrak §4.6):
     * belum dikonfirmasi, atau belum lunas selama pesanan belum selesai/dibatalkan.
     *
     * @param  Builder<Order>  $query
     */
    public function scopeNeedsFollowUp(Builder $query): void
    {
        $query->where(function (Builder $query): void {
            $query->whereIn('order_status', [OrderStatus::Baru, OrderStatus::MenungguKonfirmasi])
                ->orWhere(function (Builder $query): void {
                    $query->whereIn('payment_status', [PaymentStatus::BelumDibayar, PaymentStatus::Dp])
                        ->whereNotIn('order_status', [OrderStatus::Selesai, OrderStatus::Dibatalkan]);
                });
        });
    }

    /**
     * @return BelongsTo<Customer, $this>
     */
    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    /**
     * @return HasMany<OrderItem, $this>
     */
    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
}
