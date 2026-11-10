<?php

namespace App\Actions;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Customer;
use App\Models\Order;
use App\Models\Product;
use App\Support\ReferenceNumber;
use Illuminate\Support\Facades\DB;

/**
 * Menyimpan pesanan produk baru (US-12).
 * Customer, order, dan order item disimpan dalam satu transaksi supaya
 * tidak ada pesanan setengah jadi (NFR-07).
 */
class PlaceOrder
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function handle(Product $product, array $data): Order
    {
        return DB::transaction(function () use ($product, $data): Order {
            $phone = Customer::normalizePhone((string) $data['phone']);

            // Nomor yang sama memakai customer yang sudah ada; nama lama tidak ditimpa.
            $customer = Customer::query()->firstOrCreate(
                ['phone' => $phone],
                ['name' => (string) $data['name']],
            );

            $quantity = (int) $data['quantity'];
            $unitPrice = $product->price === null ? null : (float) $product->price;
            $subtotal = $unitPrice === null ? null : $unitPrice * $quantity;

            $order = Order::query()->create([
                'order_number' => ReferenceNumber::generate('AWF', Order::class, 'order_number'),
                'customer_id' => $customer->getKey(),
                'order_status' => OrderStatus::MenungguKonfirmasi,
                'payment_status' => PaymentStatus::BelumDibayar,
                'needed_at' => (string) $data['needed_at'],
                'notes' => $data['notes'] ?? null,
                'total_amount' => $subtotal,
            ]);

            // Nama dan harga disimpan sebagai snapshot (PRD §6 no.7).
            $order->items()->create([
                'product_id' => $product->getKey(),
                'product_name_snapshot' => $product->name,
                'unit_price_snapshot' => $unitPrice,
                'quantity' => $quantity,
                'subtotal' => $subtotal,
            ]);

            return $order;
        });
    }
}
