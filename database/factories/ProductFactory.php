<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = 'Buket '.fake()->unique()->words(3, true);

        return [
            'category_id' => Category::factory(),
            'name' => Str::title($name),
            'slug' => Str::slug($name),
            'description' => fake()->sentence(12),
            'price' => fake()->numberBetween(3, 50) * 10000,
            'price_from' => false,
            'image_path' => null,
            'is_featured' => false,
            'is_active' => true,
        ];
    }

    /** Produk unggulan beranda. */
    public function featured(): static
    {
        return $this->state(['is_featured' => true]);
    }

    /** Produk nonaktif (tidak boleh tampil di website). */
    public function inactive(): static
    {
        return $this->state(['is_active' => false]);
    }

    /** Produk "Harga via WhatsApp". */
    public function priceOnRequest(): static
    {
        return $this->state(['price' => null]);
    }
}
