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

    expect(Category::count())->toBe(5)
        ->and(Event::pluck('name')->all())->toBe(['Wisuda', 'Other Occasion'])
        ->and(Product::count())->toBe(67)
        ->and(Product::featured()->count())->toBe(10)
        ->and(Product::whereNull('price')->count())->toBe(8);
});

test('catalog seeder removes old sample data but keeps order history', function () {
    $old = Product::factory()->create(['slug' => 'buket-mawar-merah', 'name' => 'Buket Mawar Merah']);
    $item = OrderItem::factory()->create(['product_id' => $old->id, 'product_name_snapshot' => 'Buket Mawar Merah']);

    $this->seed(CatalogSeeder::class);

    expect(Product::where('slug', 'buket-mawar-merah')->exists())->toBeFalse()
        ->and($item->fresh()->product_id)->toBeNull()
        ->and($item->fresh()->product_name_snapshot)->toBe('Buket Mawar Merah');
});

test('every seeded product image exists in public folder', function () {
    $this->seed(CatalogSeeder::class);

    Product::pluck('image_path')->each(
        fn (string $path) => expect(public_path(ltrim($path, '/')))->toBeFile(),
    );
});

test('catalog seeder can run twice without duplicating data', function () {
    $this->seed(CatalogSeeder::class);
    $this->seed(CatalogSeeder::class);

    expect(Product::count())->toBe(67);
});

test('product catalog array matches the frontend Product type', function () {
    $this->seed(CatalogSeeder::class);

    $product = Product::active()
        ->with(['category', 'events'])
        ->where('slug', 'buket-mulai-100rb-01')
        ->firstOrFail();

    expect($product->toCatalogArray())->toBe([
        'slug' => 'buket-mulai-100rb-01',
        'name' => 'Buket Pilihan Rp100.000+ · 01',
        'category' => 'harga-di-atas-100rb',
        'occasions' => $product->events->pluck('slug')->all(),
        'description' => 'Buket pilihan seperti pada foto, mulai Rp100.000. Harga akhir dan ketersediaan dikonfirmasi admin lewat WhatsApp.',
        'price' => 100000,
        'priceFrom' => true,
        'image' => '/images/products/buket-mulai-100rb-01.webp',
        'featured' => true,
    ])->and($product->events->pluck('slug')->sort()->values()->all())
        ->toBe(['other-occasion', 'wisuda']);
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
