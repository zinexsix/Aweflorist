
<?php

use App\Http\Controllers\Admin\DashboardController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    // --- US-23 Suci: dashboard ---
    // Diisi oleh US-23.

    // --- US-19 Latif: produk ---

    // --- US-20 Latif: kategori & acara ---

    // --- US-21 Suci: pesanan ---

    // --- US-22 Nabila: status pesanan ---

    // --- US-26 Nabila: pembayaran ---

    // --- US-24 Prety: permintaan custom ---

    // --- US-27 Nabila: pelanggan ---

    // --- US-25 Prety: stok ---

    Route::get('/', DashboardController::class)->name('dashboard');
});
