<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StockMovementRequest;
use App\Models\Product;
use App\Models\StockMovement;
use DateTimeInterface;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class StockController extends Controller
{
    public function index(Request $request): Response
    {
        $q = mb_substr(trim($request->string('q')->toString()), 0, 100);
        $q = $q === '' ? null : $q;

        $products = Product::query()
            ->with('category:id,name')
            ->when($q !== null, fn ($query) => $query->where('name', 'like', '%'.addcslashes($q, '%_\\').'%'))
            ->orderBy('name')
            ->paginate(15)
            ->withQueryString();

        $movements = StockMovement::query()
            ->with(['product:id,name', 'user:id,name'])
            ->latest()
            ->limit(20)
            ->get()
            ->map(fn (StockMovement $movement): array => [
                'id' => $movement->id,
                'productName' => $movement->product->name,
                'userName' => $movement->user?->name,
                'quantityChange' => $movement->quantity_change,
                'stockAfter' => $movement->stock_after,
                'reason' => $movement->reason,
                'createdAt' => $movement->created_at instanceof DateTimeInterface
                    ? $movement->created_at->format('Y-m-d H:i')
                    : '',
            ]);

        return Inertia::render('admin/stock/index', [
            'products' => [
                'data' => $products->getCollection()->map(fn (Product $product): array => [
                    'id' => $product->id,
                    'name' => $product->name,
                    'category' => $product->category->name,
                    'stock' => $product->stock,
                    'isActive' => $product->is_active,
                ])->all(),
                'links' => $products->toArray()['links'],
                'from' => $products->firstItem(),
                'to' => $products->lastItem(),
                'total' => $products->total(),
            ],
            'movements' => $movements->all(),
            'filters' => [
                'q' => $q ?? '',
            ],
        ]);
    }

    public function store(StockMovementRequest $request, Product $product): RedirectResponse
    {
        $quantityChange = (int) $request->integer('quantity_change');
        $reason = trim($request->string('reason')->toString());
        $userId = $request->user()?->getAuthIdentifier();

        DB::transaction(function () use ($product, $quantityChange, $reason, $userId): void {
            $lockedProduct = Product::query()
                ->whereKey($product->getKey())
                ->lockForUpdate()
                ->firstOrFail();

            $currentStock = $lockedProduct->stock ?? 0;
            $newStock = $currentStock + $quantityChange;

            if ($newStock < 0) {
                throw ValidationException::withMessages([
                    'quantity_change' => 'Stok tidak boleh negatif.',
                ]);
            }

            $lockedProduct->update(['stock' => $newStock]);

            StockMovement::create([
                'product_id' => $lockedProduct->getKey(),
                'user_id' => $userId,
                'quantity_change' => $quantityChange,
                'stock_after' => $newStock,
                'reason' => $reason,
            ]);
        });

        return back()->with('success', 'Stok diperbarui.');
    }
}
