<?php

use App\Http\Controllers\Public\CatalogController;
use App\Http\Controllers\Public\CustomRequestController;
use App\Http\Controllers\Public\HomeController;
use App\Http\Controllers\Public\OrderConfirmationController;
use App\Http\Controllers\Public\OrderController;
use Illuminate\Support\Facades\Route;

// Halaman publik Florify (Sprint 1: data produk masih statis di resources/js/data).
Route::inertia('informasi', 'public/info')->name('info');

// --- US-10 Latif: beranda & katalog dari database ---
Route::get('/', HomeController::class)->name('home');
Route::get('katalog', [CatalogController::class, 'index'])->name('catalog.index');
Route::get('katalog/{product:slug}', [CatalogController::class, 'show'])->name('catalog.show');

// --- US-12 Suci: simpan pesanan ---
Route::post('pesan/{product:slug}', [OrderController::class, 'store'])
    ->middleware('throttle:10,1')
    ->name('orders.store');

// --- US-13 Suci: formulir pesanan ---
Route::get('pesan/{product:slug}', [OrderController::class, 'create'])->name('orders.create');

// --- US-14 Nabila: konfirmasi pesanan ---
Route::get('pesanan/{order:order_number}', OrderConfirmationController::class)
    ->middleware('signed')
    ->name('orders.confirmation');

// --- US-15 Prety: buket custom ---
Route::get('buket-custom', [CustomRequestController::class, 'create'])->name('custom');
Route::post('buket-custom', [CustomRequestController::class, 'store'])
    ->middleware('throttle:10,1')
    ->name('custom.store');
Route::get('buket-custom/terkirim/{customRequest:request_number}', [CustomRequestController::class, 'confirmation'])
    ->middleware('signed')
    ->name('custom.confirmation');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

require __DIR__.'/settings.php';
