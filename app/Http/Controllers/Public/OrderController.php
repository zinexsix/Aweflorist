<?php

namespace App\Http\Controllers\Public;

use App\Actions\PlaceOrder;
use App\Http\Controllers\Controller;
use App\Http\Requests\Public\StoreOrderRequest;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\URL;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Halaman formulir dan penyimpanan pesanan produk (US-12, US-13).
 * Bagian produk custom ditangani CustomRequestController (US-15).
 */
class OrderController extends Controller
{
    /**
     * Tampilkan formulir pemesanan untuk produk aktif.
     */
    public function create(Product $product): Response
    {
        abort_unless($product->is_active, 404);

        $product->load(['category', 'events']);

        return Inertia::render('public/order-create', [
            'product' => $product->toCatalogArray(),
        ]);
    }

    /**
     * Simpan pesanan lalu arahkan ke halaman konfirmasi bertanda tangan.
     */
    public function store(StoreOrderRequest $request, Product $product, PlaceOrder $placeOrder): RedirectResponse
    {
        abort_unless($product->is_active, 404);

        $order = $placeOrder->handle($product, $request->validated());

        return redirect()->to(URL::signedRoute('orders.confirmation', $order));
    }
}
