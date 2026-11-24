<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\CategoryRequest;
use App\Models\Category;
use App\Support\PriceCategory;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function index(): Response
    {
        $categories = Category::withCount('products')
            ->orderBy('id')
            ->get()
            ->map(fn (Category $category) => [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'description' => $category->description,
                'productsCount' => $category->products_count,
                'isPriceCategory' => in_array($category->slug, PriceCategory::SLUGS, true),
            ]);

        return Inertia::render('admin/categories/index', [
            'categories' => $categories,
        ]);
    }

    public function store(CategoryRequest $request): RedirectResponse
    {
        Category::create($request->validated());

        return back()->with('success', 'Kategori ditambahkan.');
    }

    public function update(
        CategoryRequest $request,
        Category $category
    ): RedirectResponse {
        $category->update([
            'name' => $request->validated('name'),
            'description' => $request->validated('description'),
        ]);

        return back()->with('success', 'Kategori diperbarui.');
    }

    public function destroy(Category $category): RedirectResponse
    {
        if (in_array($category->slug, PriceCategory::SLUGS, true)) {
            return back()->with('error', 'Kategori harga bawaan tidak bisa dihapus.');
        }

        if ($category->products()->exists()) {
            return back()->with('error', 'Kategori masih digunakan oleh produk dan tidak bisa dihapus.');
        }

        $category->delete();

        return back()->with('success', 'Kategori dihapus.');
    }
}
