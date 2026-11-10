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
            ->where('featuredProducts.0.slug', 'buket-mawar-merah'));
});

test('home page hides inactive featured products', function () {
    Product::factory()->featured()->create();
    Product::factory()->featured()->inactive()->create();

    $this->get(route('home'))
        ->assertInertia(fn (Assert $page) => $page->has('featuredProducts', 1));
});

test('catalog only sends active products', function () {
    $this->seed(CatalogSeeder::class);
    Product::where('slug', 'buket-mawar-merah')->update(['is_active' => false]);

    $this->get(route('catalog.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/catalog')
            ->has('products', 15)
            ->has('categories', 4)
            ->has('occasions', 3)
            ->where('filters.kategori', null)
            ->where('filters.acara', null)
            ->where('filters.q', null));
});

test('catalog filters products by category', function () {
    $this->seed(CatalogSeeder::class);

    $this->get(route('catalog.index', ['kategori' => 'buket-uang']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('products', 3)
            ->where('products.0.category', 'buket-uang')
            ->where('filters.kategori', 'buket-uang'));
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
            ->has('products', 16)
            ->where('filters.kategori', null));
});

test('product detail shows an active product with related products', function () {
    $this->seed(CatalogSeeder::class);

    $this->get(route('catalog.show', 'buket-mawar-merah'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/product-detail')
            ->where('product.slug', 'buket-mawar-merah')
            ->where('product.category', 'buket-bunga')
            ->has('related', 3));
});

test('related products do not include the product itself', function () {
    $this->seed(CatalogSeeder::class);

    $this->get(route('catalog.show', 'buket-mawar-merah'))
        ->assertInertia(fn (Assert $page) => $page
            ->where('related', fn ($related) => ! collect($related)
                ->pluck('slug')
                ->contains('buket-mawar-merah')));
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

    $this->get(route('catalog.index', ['q' => 'mawar']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('products', 4)
            ->where('filters.q', 'mawar'));
});

test('catalog search is case insensitive', function () {
    $this->seed(CatalogSeeder::class);

    $this->get(route('catalog.index', ['q' => 'MAWAR']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->has('products', 4));
});

test('catalog search can be combined with a category filter', function () {
    $this->seed(CatalogSeeder::class);

    $this->get(route('catalog.index', ['q' => 'mawar', 'kategori' => 'buket-uang']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('products', 1)
            ->where('products.0.slug', 'buket-uang-mawar')
            ->where('filters.q', 'mawar')
            ->where('filters.kategori', 'buket-uang'));
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
            ->has('products', 16)
            ->where('filters.q', null));
});
