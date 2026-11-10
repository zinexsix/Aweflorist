<?php

use App\Enums\CustomRequestApproval;
use App\Models\Customer;
use App\Models\CustomRequest;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Support\Facades\Route;
use Inertia\Testing\AssertableInertia as Assert;

/**
 * @param  array<string, mixed>  $overrides
 * @return array<string, mixed>
 */
function sprint2OrderPayload(array $overrides = []): array
{
    return array_merge([
        'name' => 'Nabila',
        'phone' => '0812-3456-7890',
        'quantity' => 1,
        'needed_at' => now()->addDays(3)->toDateString(),
        'notes' => null,
    ], $overrides);
}

test('pengunjung memesan produk dari katalog, tersimpan, lalu langsung ke WhatsApp', function () {
    $product = Product::factory()->create([
        'name' => 'Buket Mawar Merah',
        'slug' => 'buket-mawar-merah',
        'price' => 150000,
    ]);

    $this->get(route('catalog.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/catalog')
            ->has('products', 1)
            ->etc()
        );

    $this->get(route('catalog.show', $product->slug))->assertOk();

    $this->get(route('orders.create', $product->slug))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/order-create')
            ->where('product.slug', 'buket-mawar-merah')
            ->etc()
        );

    $response = $this->post(
        route('orders.store', $product->slug),
        sprint2OrderPayload(['quantity' => 2]),
    );

    $message = whatsappMessageFrom($response);

    $order = Order::sole();

    expect($message)->toContain($order->order_number);

    $this->get(confirmationLinkFrom($message))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/order-confirmation')
            ->where('order.orderNumber', $order->order_number)
            ->where('order.customerName', 'Nabila')
            ->has('order.items', 1)
            ->where('order.items.0.quantity', 2)
            ->etc()
        );
});

test('permintaan buket custom tersimpan menunggu persetujuan lalu langsung ke WhatsApp', function () {
    if (! Route::has('custom.store') || ! Route::has('custom.confirmation')) {
        $this->markTestSkipped('Menunggu US-15 (Prety) di-merge.');
    }

    $response = $this->post(route('custom.store'), [
        'name' => 'Nabila',
        'phone' => '0812-3456-7890',
        'bouquet_type' => 'Wisuda',
        'budget' => 250000,
        'theme_color' => 'Biru pastel',
        'needed_at' => now()->addDays(5)->toDateString(),
        'notes' => 'Tema wisuda',
    ]);

    $message = whatsappMessageFrom($response);

    $customRequest = CustomRequest::sole();

    expect($customRequest->request_number)->toStartWith('CST-')
        ->and($customRequest->customer->phone)->toBe('6281234567890')
        ->and($customRequest->approval_status)->toBe(CustomRequestApproval::Menunggu)
        ->and($message)->toContain($customRequest->request_number);

    $this->get(confirmationLinkFrom($message))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/custom-confirmation')
            ->where(
                'customRequest.requestNumber',
                $customRequest->request_number,
            )
            ->etc()
        );
});

test('input tidak valid tidak menyimpan pesanan apa pun', function () {
    $product = Product::factory()->create();

    $before = [
        Customer::count(),
        Order::count(),
        OrderItem::count(),
    ];

    $this->from(route('orders.create', $product->slug))
        ->post(route('orders.store', $product->slug), [
            'name' => '',
            'phone' => '123',
            'quantity' => 0,
            'needed_at' => now()->subDay()->toDateString(),
        ])
        ->assertRedirect(route('orders.create', $product->slug))
        ->assertSessionHasErrors(['name', 'phone', 'quantity', 'needed_at']);

    expect([
        Customer::count(),
        Order::count(),
        OrderItem::count(),
    ])->toBe($before);
});

test('dua pesanan berturut-turut mendapat nomor berbeda', function () {
    $product = Product::factory()->create();

    $this->post(route('orders.store', $product->slug), sprint2OrderPayload())
        ->assertRedirect();
    $this->post(route('orders.store', $product->slug), sprint2OrderPayload())
        ->assertRedirect();

    $numbers = Order::query()->pluck('order_number');

    expect($numbers)->toHaveCount(2)
        ->and($numbers->unique())->toHaveCount(2);
});
