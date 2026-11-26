<?php

use App\Models\Product;
use App\Models\StockMovement;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->actingAs(User::factory()->create());
});

test('tamu diarahkan ke halaman login saat membuka kelola stok', function () {
    $this->app['auth']->forgetGuards();

    $product = Product::factory()->create();

    $this->get(route('admin.stock.index'))
        ->assertRedirect(route('login'));

    $this->post(route('admin.stock.store', $product), [
        'quantity_change' => 1,
        'reason' => 'Restok',
    ])->assertRedirect(route('login'));
});

test('admin dapat menambah stok yang belum dikelola', function () {
    $product = Product::factory()->create(['stock' => null]);

    $this->post(route('admin.stock.store', $product), [
        'quantity_change' => 10,
        'reason' => 'Restok',
    ])->assertRedirect()->assertSessionHas('success', 'Stok diperbarui.');

    expect($product->fresh()->stock)->toBe(10);

    $movement = StockMovement::sole();

    expect($movement->quantity_change)->toBe(10)
        ->and($movement->stock_after)->toBe(10)
        ->and($movement->reason)->toBe('Restok')
        ->and($movement->user_id)->toBe(auth()->id());
});

test('admin dapat mengurangi stok dan riwayat mencatat stok setelah perubahan', function () {
    $user = User::factory()->create(['name' => 'Admin Uji']);
    $this->actingAs($user);

    $product = Product::factory()->create([
        'name' => 'Buket Stok Uji',
        'stock' => 15,
    ]);

    $this->post(route('admin.stock.store', $product), [
        'quantity_change' => -4,
        'reason' => 'Terjual',
    ])->assertRedirect();

    expect($product->fresh()->stock)->toBe(11);

    $movement = StockMovement::sole();

    expect($movement->quantity_change)->toBe(-4)
        ->and($movement->stock_after)->toBe(11)
        ->and($movement->reason)->toBe('Terjual');

    $this->get(route('admin.stock.index', ['q' => 'Stok Uji']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/stock/index')
            ->where('products.total', 1)
            ->where('products.data.0.stock', 11)
            ->where('movements.0.productName', 'Buket Stok Uji')
            ->where('movements.0.userName', 'Admin Uji')
            ->where('movements.0.stockAfter', 11));
});

test('stok tidak boleh menjadi negatif', function () {
    $product = Product::factory()->create(['stock' => 2]);

    $this->post(route('admin.stock.store', $product), [
        'quantity_change' => -3,
        'reason' => 'Rusak',
    ])->assertSessionHasErrors([
        'quantity_change' => 'Stok tidak boleh negatif.',
    ]);

    expect($product->fresh()->stock)->toBe(2)
        ->and(StockMovement::count())->toBe(0);
});

test('jumlah perubahan nol dan alasan kosong ditolak', function () {
    $product = Product::factory()->create(['stock' => 5]);

    $this->post(route('admin.stock.store', $product), [
        'quantity_change' => 0,
        'reason' => '',
    ])->assertSessionHasErrors(['quantity_change', 'reason']);

    expect(StockMovement::count())->toBe(0);
});
