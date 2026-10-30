<?php

use App\Http\Controllers\Public\CatalogController;
use App\Http\Controllers\Public\HomeController;
use Illuminate\Support\Facades\Route;

// Halaman publik Florify (Sprint 1: data produk masih statis di resources/js/data).
Route::inertia('buket-custom', 'public/custom-bouquet')->name('custom');
Route::inertia('informasi', 'public/info')->name('info');

// --- US-10 Latif: beranda & katalog dari database ---
Route::get('/', HomeController::class)->name('home');
Route::get('katalog', [CatalogController::class, 'index'])->name('catalog.index');
Route::get('katalog/{product:slug}', [CatalogController::class, 'show'])->name('catalog.show');

// --- US-12 Suci: simpan pesanan ---

// --- US-13 Suci: formulir pesanan ---

// --- US-14 Nabila: konfirmasi pesanan ---

// --- US-15 Prety: buket custom ---

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

require __DIR__.'/settings.php';
