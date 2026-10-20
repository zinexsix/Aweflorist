<?php

use Illuminate\Support\Facades\Route;

// Halaman publik Florify (Sprint 1: data produk masih statis di resources/js/data).
Route::inertia('/', 'public/home')->name('home');
Route::inertia('katalog', 'public/catalog')->name('catalog.index');
Route::get('katalog/{slug}', fn (string $slug) => inertia('public/product-detail', ['slug' => $slug]))
    ->where('slug', '[a-z0-9-]+')
    ->name('catalog.show');
Route::inertia('informasi', 'public/info')->name('info');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

require __DIR__.'/settings.php';
