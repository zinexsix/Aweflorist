<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Event;
use App\Models\Product;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    /**
     * Beranda: maksimal 4 produk unggulan yang aktif, kategori harga, dan acara.
     * Semuanya dari database, bukan dari file frontend.
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
            'categories' => Category::query()->orderBy('id')->get()->map(fn (Category $category) => [
                'slug' => $category->slug,
                'name' => $category->name,
                'description' => $category->description ?? '',
            ]),
            'occasions' => Event::query()->orderBy('id')->get()->map(fn (Event $event) => [
                'slug' => $event->slug,
                'name' => $event->name,
                'description' => $event->description ?? '',
            ]),
        ]);
    }
}
