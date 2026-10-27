<?php

namespace Database\Factories;

use App\Enums\CustomRequestStatus;
use App\Models\Customer;
use App\Models\CustomRequest;
use App\Support\ReferenceNumber;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<CustomRequest>
 */
class CustomRequestFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'request_number' => ReferenceNumber::generate('CST', CustomRequest::class, 'request_number'),
            'customer_id' => Customer::factory(),
            'product_id' => null,
            'budget' => fake()->numberBetween(10, 100) * 10000,
            'theme_color' => fake()->safeColorName(),
            'bouquet_type' => 'Buket Bunga Segar',
            'needed_at' => fake()->dateTimeBetween('+1 day', '+30 days'),
            'reference_image_path' => null,
            'notes' => null,
            'status' => CustomRequestStatus::Baru,
        ];
    }
}
