<?php

use App\Models\Category;
use App\Models\Product;
use App\Support\PriceCategory;
use Database\Seeders\CatalogSeeder;

test('aturan kategori harga cocok dengan seluruh data katalog asli', function () {
    $this->seed(CatalogSeeder::class);

    Product::with('category')->get()->each(
        fn (Product $product) => expect($product->category->slug)
            ->toBe(PriceCategory::slugFor($product->price, $product->price_from), $product->slug),
    );
});

test('kategori pindah otomatis saat harga produk diubah', function () {
    $this->seed(CatalogSeeder::class);

    $product = Product::where('slug', 'buket-50rb-01')->firstOrFail();
    $product->update(['price' => 120000]);

    expect($product->fresh()->category->slug)->toBe('harga-di-atas-100rb');

    $product->update(['price' => null]);

    expect($product->fresh()->category->slug)->toBe('harga-premium');
});

test('produk baru masuk kategori sesuai harganya', function () {
    $this->seed(CatalogSeeder::class);

    $product = Product::factory()->create([
        'category_id' => Category::where('slug', 'harga-premium')->value('id'),
        'price' => 35000,
    ]);

    expect($product->fresh()->category->slug)->toBe('harga-di-bawah-50rb');
});

test('produk dengan kategori bukan kategori harga tidak dipindahkan', function () {
    $this->seed(CatalogSeeder::class);

    $lain = Category::factory()->create(['slug' => 'kategori-lain']);
    $product = Product::factory()->create(['category_id' => $lain->id, 'price' => 35000]);

    expect($product->fresh()->category_id)->toBe($lain->id);
});

test('batas harga kategori', function (?int $price, bool $from, string $slug) {
    expect(PriceCategory::slugFor($price, $from))->toBe($slug);
})->with([
    [null, false, 'harga-premium'],
    [15000, false, 'harga-di-bawah-50rb'],
    [49999, false, 'harga-di-bawah-50rb'],
    [50000, false, 'harga-50rb-75rb'],
    [75000, false, 'harga-50rb-75rb'],
    [80000, false, 'harga-80rb-100rb'],
    [100000, false, 'harga-80rb-100rb'],
    [100000, true, 'harga-di-atas-100rb'],
    [150000, false, 'harga-di-atas-100rb'],
]);
