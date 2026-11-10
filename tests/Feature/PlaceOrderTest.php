<?php

use App\Actions\PlaceOrder;
use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Support\Facades\Route;

/**
 * Rute konfirmasi milik US-14 (Nabila) mungkin belum ada di main.
 * Daftarkan pengganti bertanda tangan supaya redirect US-12 tetap bisa diuji;
 * begitu rute asli sudah ada, blok ini dilewati.
 */
beforeEach(function () {
    if (! Route::has('orders.confirmation')) {
        Route::get('pesanan/{order:order_number}', fn (Order $order) => $order->order_number)
            ->middleware('signed')
            ->name('orders.confirmation');
        Route::getRoutes()->refreshNameLookups();
    }
});

/**
 * @param  array<string, mixed>  $overrides
 * @return array<string, mixed>
 */
function suciOrderPayload(array $overrides = []): array
{
    return array_merge([
        'name' => 'Suci',
        'phone' => '0812-3456-7890',
        'quantity' => 1,
        'needed_at' => now()->addDays(3)->toDateString(),
        'notes' => null,
    ], $overrides);
}

test('data valid menyimpan customer, pesanan, dan item lalu langsung ke WhatsApp', function () {
    $product = Product::factory()->create([
        'name' => 'Buket Mawar Merah',
        'price' => 150000,
    ]);

    $response = $this->post(route('orders.store', $product->slug), suciOrderPayload([
        'quantity' => 2,
        'notes' => 'Tolong tulis: Selamat wisuda',
    ]));

    $message = whatsappMessageFrom($response);

    expect(Customer::count())->toBe(1)
        ->and(Order::count())->toBe(1)
        ->and(OrderItem::count())->toBe(1);

    $customer = Customer::first();
    expect($customer->phone)->toBe('6281234567890')
        ->and($customer->name)->toBe('Suci');

    $order = Order::first();
    expect($order->order_status)->toBe(OrderStatus::MenungguKonfirmasi)
        ->and($order->payment_status)->toBe(PaymentStatus::BelumDibayar)
        ->and((float) $order->total_amount)->toBe(300000.0);

    $item = OrderItem::first();
    expect($item->product_name_snapshot)->toBe('Buket Mawar Merah')
        ->and((float) $item->unit_price_snapshot)->toBe(150000.0)
        ->and($item->quantity)->toBe(2)
        ->and((float) $item->subtotal)->toBe(300000.0);

    expect($message)->toContain('nomor *'.$order->order_number.'*')
        ->toContain('• Nama: Suci')
        ->toContain('• Produk: Buket Mawar Merah × 2 (Rp300.000)')
        ->toContain('• Catatan: Tolong tulis: Selamat wisuda')
        ->toContain('• Total: Rp300.000')
        ->toContain('/pesanan/'.$order->order_number.'?signature=');
});

test('pesanan dikirim ke nomor WhatsApp admin dari konfigurasi', function () {
    config(['florify.whatsapp_number' => '6281111111111']);
    $product = Product::factory()->create();

    $response = $this->post(route('orders.store', $product->slug), suciOrderPayload());

    expect($response->headers->get('Location'))->toStartWith('https://wa.me/6281111111111?text=');
});

test('permintaan Inertia diarahkan ke WhatsApp lewat header X-Inertia-Location', function () {
    $product = Product::factory()->create();

    $this->post(route('orders.store', $product->slug), suciOrderPayload(), ['X-Inertia' => 'true'])
        ->assertStatus(409)
        ->assertHeader('X-Inertia-Location');

    expect(Order::count())->toBe(1);
});

test('produk harga mulai ditandai di pesan WhatsApp', function () {
    $product = Product::factory()->create(['price' => 100000, 'price_from' => true]);

    $message = whatsappMessageFrom($this->post(route('orders.store', $product->slug), suciOrderPayload()));

    expect($message)->toContain('• Total: mulai Rp100.000 (dikonfirmasi admin)');
});

test('data tidak valid kembali ke formulir dengan galat Bahasa Indonesia', function () {
    $product = Product::factory()->create();

    $response = $this->from('/pesan/'.$product->slug)
        ->post(route('orders.store', $product->slug), [
            'name' => '',
            'phone' => '123',
            'quantity' => 0,
            'needed_at' => now()->subDay()->toDateString(),
            'notes' => str_repeat('a', 501),
        ]);

    $response->assertRedirect('/pesan/'.$product->slug)
        ->assertSessionHasErrors([
            'name' => 'Nama wajib diisi.',
            'phone' => 'Nomor WhatsApp tidak valid. Contoh: 0812-3456-7890.',
            'quantity' => 'Jumlah minimal 1.',
            'needed_at' => 'Tanggal dibutuhkan tidak boleh sebelum hari ini.',
            'notes' => 'Catatan maksimal 500 huruf.',
        ]);

    expect(Customer::count())->toBe(0)
        ->and(Order::count())->toBe(0)
        ->and(OrderItem::count())->toBe(0);
});

test('nomor WhatsApp yang sama hanya membuat satu customer', function () {
    $product = Product::factory()->create();

    $this->post(route('orders.store', $product->slug), suciOrderPayload())
        ->assertRedirect();
    $this->post(route('orders.store', $product->slug), suciOrderPayload([
        'name' => 'Nama Lain',
    ]))->assertRedirect();

    expect(Customer::count())->toBe(1)
        ->and(Order::count())->toBe(2)
        ->and(Customer::first()->name)->toBe('Suci');
});

test('perubahan harga produk tidak mengubah snapshot pesanan lama', function () {
    $product = Product::factory()->create(['price' => 100000]);

    $this->post(route('orders.store', $product->slug), suciOrderPayload())
        ->assertRedirect();

    $product->update(['price' => 999000]);

    $item = OrderItem::first();
    expect((float) $item->unit_price_snapshot)->toBe(100000.0);
});

test('produk harga via WhatsApp tetap tersimpan dengan total kosong', function () {
    $product = Product::factory()->priceOnRequest()->create();

    $this->post(route('orders.store', $product->slug), suciOrderPayload([
        'quantity' => 3,
    ]))->assertRedirect();

    $order = Order::first();
    $item = OrderItem::first();

    expect(Order::count())->toBe(1)
        ->and($order->total_amount)->toBeNull()
        ->and($item->unit_price_snapshot)->toBeNull()
        ->and($item->subtotal)->toBeNull()
        ->and($item->quantity)->toBe(3);
});

test('pesanan dibatalkan bila penyimpanan item gagal', function () {
    $product = Product::factory()->create();

    OrderItem::creating(function () {
        throw new RuntimeException('Gagal menyimpan item.');
    });

    try {
        expect(fn () => app(PlaceOrder::class)->handle($product, suciOrderPayload()))
            ->toThrow(RuntimeException::class);
    } finally {
        OrderItem::flushEventListeners();
    }

    expect(Customer::count())->toBe(0)
        ->and(Order::count())->toBe(0)
        ->and(OrderItem::count())->toBe(0);
});

test('lebih dari sepuluh kiriman per menit ditolak', function () {
    $product = Product::factory()->create();

    for ($attempt = 0; $attempt < 10; $attempt++) {
        $this->post(route('orders.store', $product->slug), [])
            ->assertRedirect();
    }

    $this->post(route('orders.store', $product->slug), [])
        ->assertStatus(429);
});

test('produk nonaktif tidak bisa dipesan', function () {
    $product = Product::factory()->inactive()->create();

    $this->post(route('orders.store', $product->slug), suciOrderPayload())
        ->assertNotFound();

    expect(Order::count())->toBe(0);
});
