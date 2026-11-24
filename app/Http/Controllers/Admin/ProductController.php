<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ProductRequest;
use App\Models\Category;
use App\Models\CustomRequest;
use App\Models\Event;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(Request $request): Response
    {
        $categories = Category::query()->orderBy('name')->get(['id', 'name']);

        $q = mb_substr(trim($request->string('q')->toString()), 0, 100);
        $q = $q === '' ? null : $q;

        $categoryId = $categories->firstWhere('id', (int) $request->input('kategori'))?->id;

        $status = $request->string('status')->toString();
        $status = in_array($status, ['aktif', 'nonaktif'], true) ? $status : null;

        $usedProductIds = OrderItem::query()
            ->whereNotNull('product_id')
            ->pluck('product_id')
            ->merge(CustomRequest::query()->whereNotNull('product_id')->pluck('product_id'))
            ->unique();

        $products = Product::query()
            ->with('category:id,name')
            ->when($q !== null, fn ($query) => $query->where('name', 'like', '%'.addcslashes($q, '%_\\').'%'))
            ->when($categoryId !== null, fn ($query) => $query->where('category_id', $categoryId))
            ->when($status === 'aktif', fn ($query) => $query->where('is_active', true))
            ->when($status === 'nonaktif', fn ($query) => $query->where('is_active', false))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/products/index', [
            'products' => [
                'data' => $products->getCollection()->map(fn (Product $product): array => [
                    'id' => $product->id,
                    'name' => $product->name,
                    'slug' => $product->slug,
                    'category' => $product->category->name,
                    'price' => $product->price === null ? null : (int) $product->price,
                    'priceFrom' => $product->price_from,
                    'image' => $product->image_path,
                    'isActive' => $product->is_active,
                    'isFeatured' => $product->is_featured,
                    'canDelete' => ! $usedProductIds->contains($product->id),
                ])->all(),
                'links' => $products->toArray()['links'],
                'from' => $products->firstItem(),
                'to' => $products->lastItem(),
                'total' => $products->total(),
            ],
            'categories' => $categories->map(fn (Category $category): array => [
                'value' => (string) $category->id,
                'label' => $category->name,
            ])->all(),
            'filters' => [
                'q' => $q ?? '',
                'kategori' => $categoryId !== null ? (string) $categoryId : '',
                'status' => $status ?? '',
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/products/form', [
            'product' => null,
            'categories' => $this->categoryOptions(),
            'occasions' => $this->occasionOptions(),
        ]);
    }

    public function store(ProductRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $imagePath = $request->hasFile('image')
            ? '/storage/'.$request->file('image')->store('products', 'public')
            : null;

        $product = Product::create([
            'name' => $validated['name'],
            'slug' => $validated['slug'],
            'category_id' => $validated['category_id'],
            'description' => $validated['description'],
            'price' => $validated['price'] ?? null,
            'price_from' => $request->boolean('price_from'),
            'image_path' => $imagePath,
            'is_featured' => $request->boolean('is_featured'),
            'is_active' => $request->boolean('is_active', true),
        ]);

        $product->events()->sync($this->occasionIds($validated['occasions'] ?? []));

        return redirect()->route('admin.products.index')->with('success', 'Produk ditambahkan.');
    }

    public function edit(Product $product): Response
    {
        $product->load('events');

        return Inertia::render('admin/products/form', [
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'category_id' => (string) $product->category_id,
                'description' => $product->description,
                'price' => $product->price === null ? null : (int) $product->price,
                'price_from' => $product->price_from,
                'image' => $product->image_path,
                'is_featured' => $product->is_featured,
                'is_active' => $product->is_active,
                'occasions' => $product->events->pluck('id')->map(fn (int $id): string => (string) $id)->all(),
            ],
            'categories' => $this->categoryOptions(),
            'occasions' => $this->occasionOptions(),
        ]);
    }

    public function update(ProductRequest $request, Product $product): RedirectResponse
    {
        $validated = $request->validated();

        if ($request->hasFile('image')) {
            $this->deleteUploadedImage($product->image_path);
            $validated['image_path'] = '/storage/'.$request->file('image')->store('products', 'public');
        }

        $product->update([
            'name' => $validated['name'],
            'slug' => $validated['slug'],
            'category_id' => $validated['category_id'],
            'description' => $validated['description'],
            'price' => $validated['price'] ?? null,
            'price_from' => $request->boolean('price_from'),
            'image_path' => $validated['image_path'] ?? $product->image_path,
            'is_featured' => $request->boolean('is_featured'),
            'is_active' => $request->boolean('is_active'),
        ]);

        $product->events()->sync($this->occasionIds($validated['occasions'] ?? []));

        return back()->with('success', 'Produk diperbarui.');
    }

    public function destroy(Product $product): RedirectResponse
    {
        $used = OrderItem::query()->where('product_id', $product->id)->exists()
            || CustomRequest::query()->where('product_id', $product->id)->exists();

        if ($used) {
            $product->update(['is_active' => false]);

            return back()->with('success', 'Produk sudah pernah digunakan dan hanya dinonaktifkan.');
        }

        $product->events()->detach();
        $this->deleteUploadedImage($product->image_path);
        $product->delete();

        return back()->with('success', 'Produk dihapus.');
    }

    /**
     * @return list<array{value: string, label: string}>
     */
    private function categoryOptions(): array
    {
        $options = [];

        $categories = Category::query()
            ->orderBy('name')
            ->get(['id', 'name']);

        foreach ($categories as $category) {
            $options[] = [
                'value' => sprintf('%s', $category->id),
                'label' => $category->name,
            ];
        }

        return $options;
    }

    /**
     * @return list<array{value: string, label: string}>
     */
    private function occasionOptions(): array
    {
        $options = [];

        $events = Event::query()
            ->orderBy('name')
            ->get(['id', 'name']);

        foreach ($events as $event) {
            $options[] = [
                'value' => sprintf('%s', $event->id),
                'label' => $event->name,
            ];
        }

        return $options;
    }

    /**
     * @param  array<mixed>  $occasions
     * @return list<int>
     */
    private function occasionIds(array $occasions): array
    {
        return array_values(array_map('intval', $occasions));
    }

    private function deleteUploadedImage(?string $imagePath): void
    {
        if ($imagePath !== null && Str::startsWith($imagePath, '/storage/products/')) {
            Storage::disk('public')->delete(Str::after($imagePath, '/storage/'));
        }
    }
}
