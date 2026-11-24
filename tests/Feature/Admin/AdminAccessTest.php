<?php

use App\Enums\OrderStatus;
use App\Models\User;
use App\Support\EnumOptions;
use Inertia\Testing\AssertableInertia as Assert;

test('halaman dan aksi pendaftaran publik tidak tersedia', function () {
    $this->get('/register')->assertNotFound();
    $this->post('/register', [])->assertNotFound();
});

test('tamu yang membuka area admin diarahkan ke halaman login', function () {
    $this->get(route('admin.dashboard'))
        ->assertRedirect(route('login'));
});

test('admin yang sudah login dapat membuka dashboard admin', function () {
    $this->actingAs(User::factory()->create())
        ->get(route('admin.dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('admin/dashboard'));
});

test('rute dashboard lama mengarah ke area admin', function () {
    $this->get(route('dashboard'))
        ->assertRedirect('/admin');
});

test('EnumOptions menghasilkan opsi status pesanan berbahasa Indonesia', function () {
    expect(EnumOptions::from(OrderStatus::class))->toBe([
        ['value' => 'baru', 'label' => 'Baru'],
        ['value' => 'menunggu_konfirmasi', 'label' => 'Menunggu Konfirmasi'],
        ['value' => 'dikonfirmasi', 'label' => 'Dikonfirmasi'],
        ['value' => 'diproses', 'label' => 'Diproses'],
        ['value' => 'siap', 'label' => 'Siap Diambil/Dikirim'],
        ['value' => 'selesai', 'label' => 'Selesai'],
        ['value' => 'dibatalkan', 'label' => 'Dibatalkan'],
    ]);
});

test('notifikasi flash dibagikan ke halaman Inertia', function () {
    $this->withSession(['success' => 'Produk disimpan.'])
        ->actingAs(User::factory()->create())
        ->get(route('admin.dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/dashboard')
            ->where('flash.success', 'Produk disimpan.'));
});
