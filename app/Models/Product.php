<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

#[Fillable(['category_id', 'name', 'slug', 'description', 'price', 'price_from', 'image_path', 'is_featured', 'is_active'])]
class Product extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'price_from' => 'boolean',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function events(): BelongsToMany
    {
        return $this->belongsToMany(Event::class);
    }

    #[Scope]
    protected function active(Builder $query): void
    {
        $query->where('is_active', true);
    }

    #[Scope]
    protected function featured(Builder $query): void
    {
        $query->where('is_featured', true);
    }

    /**
     * Bentuk data yang sama dengan tipe Product di resources/js/types/florify.ts.
     * Muat relasi dengan with(['category', 'events']) sebelum memanggil method ini.
     */
    public function toCatalogArray(): array
    {
        return [
            'slug' => $this->slug,
            'name' => $this->name,
            'category' => $this->category->slug,
            'occasions' => $this->events->pluck('slug')->all(),
            'description' => $this->description,
            'price' => $this->price === null ? null : (int) $this->price,
            'priceFrom' => $this->price_from,
            'image' => $this->image_path,
            'featured' => $this->is_featured,
        ];
    }
}
