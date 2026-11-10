<?php

use App\Models\Product;
use Inertia\Testing\AssertableInertia as Assert;

test('halaman formulir pesanan menampilkan produk aktif', function () {
    $product = Product::factory()->create([
        'name' => 'Buket Tulip',
        'slug' => 'buket-tulip',
        'price' => 120000,
    ]);

    $this->get(route('orders.create', $product->slug))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/order-create')
            ->where('product.slug', 'buket-tulip')
            ->where('product.name', 'Buket Tulip')
            ->where('product.price', 120000));
});

test('halaman formulir pesanan menolak produk nonaktif', function () {
    $product = Product::factory()->inactive()->create();

    $this->get(route('orders.create', $product->slug))->assertNotFound();
});

test('halaman formulir pesanan menolak slug yang tidak ada', function () {
    $this->get('/pesan/tidak-ada')->assertNotFound();
});
