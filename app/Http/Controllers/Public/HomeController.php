<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    /**
     * Beranda: maksimal 4 produk unggulan yang aktif.
     */
    public function __invoke(): Response
    {
        $featuredProducts = Product::active()
            ->featured()
            ->with(['category', 'events'])
            ->orderBy('id')
            ->limit(4)
            ->get();

        return Inertia::render('public/home', [
            'featuredProducts' => $featuredProducts->map(fn (Product $product) => $product->toCatalogArray()),
        ]);
    }
}
