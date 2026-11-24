<?php

use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\EventController;
use App\Http\Controllers\Admin\ProductController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    // --- US-23 Suci: dashboard ---
    // Diisi oleh US-23.

    // --- US-19 Latif: produk ---
    Route::get('produk', [ProductController::class, 'index'])->name('products.index');
    Route::get('produk/tambah', [ProductController::class, 'create'])->name('products.create');
    Route::post('produk', [ProductController::class, 'store'])->name('products.store');
    Route::get('produk/{product}/ubah', [ProductController::class, 'edit'])->name('products.edit');
    Route::put('produk/{product}', [ProductController::class, 'update'])->name('products.update');
    Route::delete('produk/{product}', [ProductController::class, 'destroy'])->name('products.destroy');

    // --- US-20 Latif: kategori & acara ---
    Route::get('kategori', [CategoryController::class, 'index'])->name('categories.index');
    Route::post('kategori', [CategoryController::class, 'store'])->name('categories.store');
    Route::put('kategori/{category}', [CategoryController::class, 'update'])->name('categories.update');
    Route::delete('kategori/{category}', [CategoryController::class, 'destroy'])->name('categories.destroy');
    Route::get('acara', [EventController::class, 'index'])->name('events.index');
    Route::post('acara', [EventController::class, 'store'])->name('events.store');
    Route::put('acara/{event}', [EventController::class, 'update'])->name('events.update');
    Route::delete('acara/{event}', [EventController::class, 'destroy'])->name('events.destroy');

    // --- US-21 Suci: pesanan ---

    // --- US-22 Nabila: status pesanan ---

    // --- US-26 Nabila: pembayaran ---

    // --- US-24 Prety: permintaan custom ---

    // --- US-27 Nabila: pelanggan ---

    // --- US-25 Prety: stok ---

    Route::get('/', DashboardController::class)->name('dashboard');
});
