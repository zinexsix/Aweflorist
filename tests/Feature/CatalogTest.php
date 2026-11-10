<?php

use App\Models\Product;
use Database\Seeders\CatalogSeeder;
use Inertia\Testing\AssertableInertia as Assert;

test('home page sends four featured products from the database', function () {
    $this->seed(CatalogSeeder::class);

    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/home')
            ->has('featuredProducts', 4)
            ->where('featuredProducts.0.slug', 'buket-mulai-100rb-01')
            ->where('featuredProducts.0.price', 100000)
            ->where('featuredProducts.0.priceFrom', true));
});

test('home page hides inactive featured products', function () {
    Product::factory()->featured()->create();
    Product::factory()->featured()->inactive()->create();

    $this->get(route('home'))
        ->assertInertia(fn (Assert $page) => $page->has('featuredProducts', 1));
});

test('product names are based on price, not flower names', function () {
    $this->seed(CatalogSeeder::class);

    $names = Product::pluck('name');

    expect($names)->each->toStartWith('Buket ')
        ->and($names->filter(fn (string $name) => preg_match('/mawar|tulip|lily|sunflower|baby breath/i', $name)))->toBeEmpty();
});

test('catalog only sends active products', function () {
    $this->seed(CatalogSeeder::class);
    Product::where('slug', 'buket-50rb-01')->update(['is_active' => false]);

    $this->get(route('catalog.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/catalog')
            ->has('products', 66)
            ->has('categories', 5)
            ->has('occasions', 2)
            ->where('filters.kategori', null)
            ->where('filters.acara', null)
            ->where('filters.q', null));
});

test('catalog filters products by category', function () {
    $this->seed(CatalogSeeder::class);

    $this->get(route('catalog.index', ['kategori' => 'harga-di-bawah-50rb']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('products', 2)
            ->where('products.0.slug', 'buket-15rb-01')
            ->where('products.0.price', 15000)
            ->where('products.1.price', 35000)
            ->where('filters.kategori', 'harga-di-bawah-50rb'));
});

test('catalog filters products by occasion', function () {
    $this->seed(CatalogSeeder::class);

    $expected = Product::active()
        ->whereHas('events', fn ($query) => $query->where('slug', 'wisuda'))
        ->count();

    $this->get(route('catalog.index', ['acara' => 'wisuda']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('products', $expected)
            ->where('filters.acara', 'wisuda'));
});

test('unknown category filter is ignored', function () {
    $this->seed(CatalogSeeder::class);

    $this->get(route('catalog.index', ['kategori' => 'tidak-ada']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('products', 67)
            ->where('filters.kategori', null));
});

test('product detail shows an active product with related products', function () {
    $this->seed(CatalogSeeder::class);

    $this->get(route('catalog.show', 'buket-50rb-01'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/product-detail')
            ->where('product.slug', 'buket-50rb-01')
            ->where('product.category', 'harga-50rb-75rb')
            ->where('product.price', 50000)
            ->has('related', 3));
});

test('related products do not include the product itself', function () {
    $this->seed(CatalogSeeder::class);

    $this->get(route('catalog.show', 'buket-50rb-01'))
        ->assertInertia(fn (Assert $page) => $page
            ->where('related', fn ($related) => ! collect($related)
                ->pluck('slug')
                ->contains('buket-50rb-01')));
});

test('product detail returns 404 for an unknown slug', function () {
    $this->get('/katalog/tidak-ada')->assertNotFound();
});

test('product detail returns 404 for an inactive product', function () {
    $product = Product::factory()->inactive()->create();

    $this->get(route('catalog.show', $product->slug))->assertNotFound();
});

test('catalog searches products by name', function () {
    $this->seed(CatalogSeeder::class);

    $this->get(route('catalog.index', ['q' => 'premium']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('products', 8)
            ->where('filters.q', 'premium'));
});

test('catalog search is case insensitive', function () {
    $this->seed(CatalogSeeder::class);

    $this->get(route('catalog.index', ['q' => 'PREMIUM']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->has('products', 8));
});

test('catalog search can be combined with a category filter', function () {
    $this->seed(CatalogSeeder::class);

    $this->get(route('catalog.index', ['q' => 'Rp75', 'kategori' => 'harga-50rb-75rb']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('products', 7)
            ->where('products.0.slug', 'buket-75rb-01')
            ->where('filters.q', 'Rp75')
            ->where('filters.kategori', 'harga-50rb-75rb'));

    $this->get(route('catalog.index', ['q' => 'Rp75', 'kategori' => 'harga-premium']))
        ->assertInertia(fn (Assert $page) => $page->has('products', 0));
});

test('catalog search without results returns an empty list', function () {
    $this->seed(CatalogSeeder::class);

    $this->get(route('catalog.index', ['q' => 'xyz']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->has('products', 0));
});

test('search longer than 100 characters does not cause an error', function () {
    $this->seed(CatalogSeeder::class);

    $this->get(route('catalog.index', ['q' => str_repeat('a', 150)]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('filters.q', str_repeat('a', 100)));
});

test('blank search shows all products', function () {
    $this->seed(CatalogSeeder::class);

    $this->get(route('catalog.index', ['q' => '   ']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('products', 67)
            ->where('filters.q', null));
});
