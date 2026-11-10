<?php

use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Facades\URL;
use Inertia\Testing\AssertableInertia as Assert;

/**
 * @param  array<string, mixed>  $overrides
 */
function nabilaOrderSummary(array $overrides = []): Order
{
    $customer = Customer::factory()->create([
        'name' => 'Nabila',
        'phone' => '6281234567890',
    ]);

    $order = Order::factory()->create(array_merge([
        'customer_id' => $customer->id,
        'needed_at' => '2026-11-20',
        'notes' => 'Tolong tulis: Selamat wisuda',
        'total_amount' => 300000,
    ], $overrides));

    OrderItem::factory()->create([
        'order_id' => $order->id,
        'product_name_snapshot' => 'Buket Mawar Merah',
        'unit_price_snapshot' => 150000,
        'quantity' => 2,
        'subtotal' => 300000,
    ]);

    return $order;
}

test('URL bertanda tangan menampilkan halaman konfirmasi lengkap', function () {
    $order = nabilaOrderSummary();

    $this->get(URL::signedRoute('orders.confirmation', $order))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/order-confirmation')
            ->where('order.orderNumber', $order->order_number)
            ->where('order.customerName', 'Nabila')
            ->where('order.neededAt', '2026-11-20')
            ->where('order.notes', 'Tolong tulis: Selamat wisuda')
            ->where('order.statusLabel', 'Menunggu Konfirmasi')
            ->where('order.paymentStatusLabel', 'Belum Dibayar')
            ->has('order.items', 1)
            ->where('order.items.0.name', 'Buket Mawar Merah')
            ->where('order.items.0.quantity', 2)
            ->where('order.items.0.unitPrice', 150000)
            ->where('order.items.0.subtotal', 300000)
            ->where('order.totalAmount', 300000)
            ->etc()
        );
});

test('URL tanpa tanda tangan ditolak', function () {
    $order = nabilaOrderSummary();

    $this->get(route('orders.confirmation', $order))->assertForbidden();
});

test('nomor WhatsApp pelanggan disamarkan', function () {
    $order = nabilaOrderSummary();

    $this->get(URL::signedRoute('orders.confirmation', $order))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('order.customerPhoneMasked', '6281****7890')
            ->etc()
        );
});

test('harga via WhatsApp membuat total kosong', function () {
    $order = nabilaOrderSummary(['total_amount' => null]);
    $order->items()->update([
        'unit_price_snapshot' => null,
        'subtotal' => null,
    ]);

    $this->get(URL::signedRoute('orders.confirmation', $order->fresh()))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('order.totalAmount', null)
            ->where('order.items.0.unitPrice', null)
            ->where('order.items.0.subtotal', null)
            ->etc()
        );
});
