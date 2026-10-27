<?php

use App\Models\CustomRequest;
use App\Models\Order;
use App\Support\ReferenceNumber;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

// ReferenceNumber mengecek database, jadi test ini butuh TestCase Laravel.
uses(TestCase::class, RefreshDatabase::class);

test('order number has the AWF format', function () {
    $number = ReferenceNumber::generate('AWF', Order::class, 'order_number');

    expect($number)->toMatch('/^AWF-\d{8}-[A-HJ-NP-Z2-9]{5}$/');
});

test('custom request number has the CST format', function () {
    $number = ReferenceNumber::generate('CST', CustomRequest::class, 'request_number');

    expect($number)->toMatch('/^CST-\d{8}-[A-HJ-NP-Z2-9]{5}$/');
});

test('reference number contains today\'s date', function () {
    $number = ReferenceNumber::generate('AWF', Order::class, 'order_number');

    expect($number)->toStartWith('AWF-'.now()->format('Ymd').'-');
});

test('generated numbers are different each time', function () {
    $numbers = collect(range(1, 20))
        ->map(fn () => ReferenceNumber::generate('AWF', Order::class, 'order_number'));

    expect($numbers->unique())->toHaveCount(20);
});
