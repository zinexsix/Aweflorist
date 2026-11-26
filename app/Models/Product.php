<?php

namespace App\Models;

use App\Support\PriceCategory;
use Database\Factories\ProductFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['category_id', 'name', 'slug', 'description', 'price', 'price_from', 'image_path', 'is_featured', 'is_active', 'stock'])]
class Product extends Model
{
    /** @use HasFactory<ProductFactory> */
    use HasFactory;

    /**
     * Kategori harga mengikuti harga produk secara otomatis setiap kali harga
     * disimpan, selama produk memakai kategori harga (lihat PriceCategory).
     */
    protected static function booted(): void
    {
        static::saving(function (Product $product): void {
            if (! $product->isDirty(['price', 'price_from', 'category_id'])) {
                return;
            }

            $priceCategories = Category::query()->whereIn('slug', PriceCategory::SLUGS)->pluck('id', 'slug');

            if (! $priceCategories->contains($product->category_id)) {
                return;
            }

            $categoryId = $priceCategories->get(PriceCategory::slugFor($product->price, (bool) $product->price_from));

            if ($categoryId !== null) {
                $product->category_id = $categoryId;
            }
        });
    }

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'price_from' => 'boolean',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
            'stock' => 'integer',
        ];
    }

    /**
     * @return BelongsTo<Category, $this>
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * @return BelongsToMany<Event, $this>
     */
    public function events(): BelongsToMany
    {
        return $this->belongsToMany(Event::class);
    }

    /**
     * @return HasMany<StockMovement, $this>
     */
    public function stockMovements(): HasMany
    {
        return $this->hasMany(StockMovement::class);
    }

    /**
     * @param  Builder<Product>  $query
     */
    #[Scope]
    protected function active(Builder $query): void
    {
        $query->where('is_active', true);
    }

    /**
     * @param  Builder<Product>  $query
     */
    #[Scope]
    protected function featured(Builder $query): void
    {
        $query->where('is_featured', true);
    }

    /**
     * Bentuk data yang sama dengan tipe Product di resources/js/types/florify.ts.
     * Muat relasi dengan with(['category', 'events']) sebelum memanggil method ini.
     *
     * @return array<string, mixed>
     */
    public function toCatalogArray(): array
    {
        return [
            'slug' => $this->slug,
            'name' => $this->name,
            'category' => $this->category->slug,
            'categoryName' => $this->category->name,
            'occasions' => $this->events->pluck('slug')->all(),
            'description' => $this->description,
            'price' => $this->price === null ? null : (int) $this->price,
            'priceFrom' => $this->price_from,
            'image' => $this->image_path,
            'featured' => $this->is_featured,
        ];
    }
}
