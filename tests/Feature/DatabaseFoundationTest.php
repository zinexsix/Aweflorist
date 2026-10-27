<?php

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Category;
use App\Models\Customer;
use App\Models\Event;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Database\Seeders\CatalogSeeder;
use Illuminate\Database\UniqueConstraintViolationException;

test('catalog seeder creates categories, events, and products', function () {
    $this->seed(CatalogSeeder::class);

    expect(Category::count())->toBe(4)
        ->and(Event::count())->toBe(3)
        ->and(Product::count())->toBe(16)
        ->and(Product::featured()->count())->toBe(4);
});

test('catalog seeder can run twice without duplicating data', function () {
    $this->seed(CatalogSeeder::class);
    $this->seed(CatalogSeeder::class);

    expect(Product::count())->toBe(16);
});

test('product catalog array matches the frontend Product type', function () {
    $this->seed(CatalogSeeder::class);

    $product = Product::active()
        ->with(['category', 'events'])
        ->where('slug', 'buket-mawar-merah')
        ->firstOrFail();

    expect($product->toCatalogArray())->toBe([
        'slug' => 'buket-mawar-merah',
        'name' => 'Buket Mawar Merah',
        'category' => 'buket-bunga',
        'occasions' => $product->events->pluck('slug')->all(),
        'description' => 'Rangkaian mawar merah segar dengan wrapping elegan, cocok untuk ungkapan sayang.',
        'price' => 250000,
        'priceFrom' => false,
        'image' => '/images/products/buket-custom-tema-warna-01.webp',
        'featured' => true,
    ])->and($product->events->pluck('slug')->sort()->values()->all())
        ->toBe(['anniversary', 'ulang-tahun']);
});

test('product without price returns null price', function () {
    $product = Product::factory()->priceOnRequest()->create();

    expect($product->load(['category', 'events'])->toCatalogArray()['price'])->toBeNull();
});

test('active scope hides inactive products', function () {
    Product::factory()->create();
    Product::factory()->inactive()->create();

    expect(Product::active()->count())->toBe(1);
});

test('order number must be unique', function () {
    Order::factory()->create(['order_number' => 'AWF-20261029-AAAAA']);

    expect(fn () => Order::factory()->create(['order_number' => 'AWF-20261029-AAAAA']))
        ->toThrow(UniqueConstraintViolationException::class);
});

test('order factory creates an order with items and default statuses', function () {
    $order = Order::factory()
        ->has(OrderItem::factory()->count(2), 'items')
        ->create();

    expect($order->items)->toHaveCount(2)
        ->and($order->order_status)->toBe(OrderStatus::MenungguKonfirmasi)
        ->and($order->payment_status)->toBe(PaymentStatus::BelumDibayar)
        ->and($order->getRouteKey())->toBe($order->order_number);
});

test('phone numbers are normalized to the 62 format', function (string $input) {
    expect(Customer::normalizePhone($input))->toBe('6281234567890');
})->with([
    '0812-3456-7890',
    '0812 3456 7890',
    '+62 812 3456 7890',
    '6281234567890',
]);
