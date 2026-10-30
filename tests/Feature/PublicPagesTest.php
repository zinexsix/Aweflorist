<?php

use Database\Seeders\CatalogSeeder;
use Inertia\Testing\AssertableInertia as Assert;

test('landing page renders the public home component', function () {
    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('public/home'));
});

test('catalog page is accessible without login', function () {
    $this->get(route('catalog.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('public/catalog'));
});

test('product detail page receives the product', function () {
    $this->seed(CatalogSeeder::class);

    $this->get(route('catalog.show', 'buket-mawar-merah'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/product-detail')
            ->where('product.slug', 'buket-mawar-merah'));
});

test('product detail rejects invalid slugs', function () {
    $this->get('/katalog/Bukan_Slug!')->assertNotFound();
});

test('info page is accessible without login', function () {
    $this->get(route('info'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('public/info'));
});

test('custom bouquet form page is accessible without login', function () {
    $this->get(route('custom'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('public/custom-bouquet'));
});
