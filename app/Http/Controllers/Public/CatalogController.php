<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Event;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CatalogController extends Controller
{
    /**
     * Katalog produk aktif, bisa difilter ?kategori=<slug>, ?acara=<slug>,
     * dan dicari berdasarkan nama lewat ?q=<kata> (US-11).
     */
    public function index(Request $request): Response
    {
        $categories = Category::query()->orderBy('id')->get();
        $occasions = Event::query()->orderBy('id')->get();

        // Slug yang tidak dikenal diabaikan, sama seperti versi Sprint 1.
        $kategori = $categories->firstWhere('slug', $request->string('kategori')->toString())?->slug;
        $acara = $occasions->firstWhere('slug', $request->string('acara')->toString())?->slug;

        // Kata pencarian dibatasi 100 karakter; kosong berarti tidak mencari.
        $q = mb_substr(trim($request->string('q')->toString()), 0, 100);
        $q = $q === '' ? null : $q;

        $products = Product::active()
            ->with(['category', 'events'])
            ->when($kategori !== null, fn ($query) => $query->whereHas('category', fn ($q) => $q->where('slug', $kategori)))
            ->when($acara !== null, fn ($query) => $query->whereHas('events', fn ($q) => $q->where('slug', $acara)))
            ->when($q !== null, fn ($query) => $query->where('name', 'like', '%'.$q.'%'))
            ->orderBy('id')
            ->get();

        return Inertia::render('public/catalog', [
            'products' => $products->map(fn (Product $product) => $product->toCatalogArray()),
            'categories' => $categories->map(fn (Category $category) => [
                'slug' => $category->slug,
                'name' => $category->name,
            ]),
            'occasions' => $occasions->map(fn (Event $event) => [
                'slug' => $event->slug,
                'name' => $event->name,
                'description' => $event->description ?? '',
            ]),
            'filters' => [
                'kategori' => $kategori,
                'acara' => $acara,
                'q' => $q,
            ],
        ]);
    }

    /**
     * Detail produk aktif + maksimal 3 produk serupa dari kategori yang sama.
     */
    public function show(Product $product): Response
    {
        abort_unless($product->is_active, 404);

        $product->load(['category', 'events']);

        $related = Product::active()
            ->with(['category', 'events'])
            ->where('category_id', $product->category_id)
            ->whereKeyNot($product->getKey())
            ->orderBy('id')
            ->limit(3)
            ->get();

        return Inertia::render('public/product-detail', [
            'product' => $product->toCatalogArray(),
            'related' => $related->map(fn (Product $item) => $item->toCatalogArray()),
        ]);
    }
}
