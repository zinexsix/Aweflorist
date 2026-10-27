<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<OrderItem>
 */
class OrderItemFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'order_id' => Order::factory(),
            'product_id' => Product::factory(),
            'product_name_snapshot' => 'Buket '.fake()->words(2, true),
            'unit_price_snapshot' => fake()->numberBetween(3, 50) * 10000,
            'quantity' => fake()->numberBetween(1, 5),
            'subtotal' => fn (array $attributes) => $attributes['unit_price_snapshot'] === null
                ? null
                : $attributes['unit_price_snapshot'] * $attributes['quantity'],
        ];
    }
}
