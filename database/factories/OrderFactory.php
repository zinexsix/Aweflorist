<?php

namespace Database\Factories;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Customer;
use App\Models\Order;
use App\Support\ReferenceNumber;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Order>
 */
class OrderFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'order_number' => ReferenceNumber::generate('AWF', Order::class, 'order_number'),
            'customer_id' => Customer::factory(),
            'order_status' => OrderStatus::MenungguKonfirmasi,
            'payment_status' => PaymentStatus::BelumDibayar,
            'needed_at' => fake()->dateTimeBetween('+1 day', '+30 days'),
            'notes' => null,
            'total_amount' => fake()->numberBetween(5, 50) * 10000,
        ];
    }
}
