<?php

use App\Enums\CustomRequestApproval;
use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\CustomRequest;
use App\Models\Order;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->actingAs(User::factory()->create());
});

test('tamu diarahkan ke halaman login saat membuka dashboard', function () {
    $this->app['auth']->forgetGuards();

    $this->get(route('admin.dashboard'))->assertRedirect(route('login'));
});

test('dashboard kosong tetap tampil dengan angka nol untuk semua status', function () {
    $this->get(route('admin.dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/dashboard')
            ->has('stats.ordersByStatus', 7)
            ->where('stats.ordersByStatus.0', ['value' => 'baru', 'label' => 'Baru', 'count' => 0])
            ->where('stats.needsFollowUp', 0)
            ->where('stats.unpaid', 0)
            ->where('stats.customPending', 0)
            ->where('stats.ordersThisMonth', 0)
            ->has('followUps', 0)
        );
});

test('jumlah pesanan per status dihitung benar', function () {
    Order::factory()->count(3)->create(['order_status' => OrderStatus::MenungguKonfirmasi]);
    Order::factory()->count(2)->create(['order_status' => OrderStatus::Diproses]);
    Order::factory()->create(['order_status' => OrderStatus::Selesai, 'payment_status' => PaymentStatus::Lunas]);

    $this->get(route('admin.dashboard'))
        ->assertInertia(fn (Assert $page) => $page
            ->where('stats.ordersByStatus', fn ($rows) => collect($rows)->pluck('count', 'value')->all() === [
                'baru' => 0,
                'menunggu_konfirmasi' => 3,
                'dikonfirmasi' => 0,
                'diproses' => 2,
                'siap' => 0,
                'selesai' => 1,
                'dibatalkan' => 0,
            ])
        );
});

test('angka tindak lanjut sama dengan hasil filter di daftar pesanan', function () {
    Order::factory()->create(['order_status' => OrderStatus::Baru, 'payment_status' => PaymentStatus::Lunas]);
    Order::factory()->create(['order_status' => OrderStatus::Diproses, 'payment_status' => PaymentStatus::Dp]);
    Order::factory()->create(['order_status' => OrderStatus::Diproses, 'payment_status' => PaymentStatus::Lunas]);
    Order::factory()->create(['order_status' => OrderStatus::Selesai, 'payment_status' => PaymentStatus::BelumDibayar]);

    $this->get(route('admin.dashboard'))
        ->assertInertia(fn (Assert $page) => $page->where('stats.needsFollowUp', 2));

    $this->get(route('admin.orders.index', ['tindak_lanjut' => 1]))
        ->assertInertia(fn (Assert $page) => $page->where('orders.total', 2));
});

test('belum lunas menghitung belum dibayar dan DP kecuali pesanan dibatalkan', function () {
    Order::factory()->create(['order_status' => OrderStatus::Diproses, 'payment_status' => PaymentStatus::BelumDibayar]);
    Order::factory()->create(['order_status' => OrderStatus::Selesai, 'payment_status' => PaymentStatus::Dp]);
    Order::factory()->create(['order_status' => OrderStatus::Dibatalkan, 'payment_status' => PaymentStatus::BelumDibayar]);
    Order::factory()->create(['order_status' => OrderStatus::Diproses, 'payment_status' => PaymentStatus::Lunas]);

    $this->get(route('admin.dashboard'))
        ->assertInertia(fn (Assert $page) => $page->where('stats.unpaid', 2));
});

test('permintaan custom yang menunggu persetujuan dihitung', function () {
    CustomRequest::factory()->count(2)->create();
    CustomRequest::factory()->create(['approval_status' => CustomRequestApproval::Disetujui]);
    CustomRequest::factory()->create(['approval_status' => CustomRequestApproval::Ditolak]);

    $this->get(route('admin.dashboard'))
        ->assertInertia(fn (Assert $page) => $page->where('stats.customPending', 2));
});

test('pesanan bulan ini tidak menghitung pesanan bulan lalu', function () {
    Order::factory()->count(2)->create();
    Order::factory()->create(['created_at' => now()->startOfMonth()->subDay()]);

    $this->get(route('admin.dashboard'))
        ->assertInertia(fn (Assert $page) => $page->where('stats.ordersThisMonth', 2));
});

test('daftar tindak lanjut berisi maksimal 5 pesanan dengan tanggal dibutuhkan terdekat', function () {
    $orders = collect(range(1, 7))->map(fn (int $day) => Order::factory()->create([
        'order_status' => OrderStatus::MenungguKonfirmasi,
        'needed_at' => now()->addDays(8 - $day)->toDateString(),
    ]));
    Order::factory()->create([
        'order_status' => OrderStatus::Selesai,
        'payment_status' => PaymentStatus::Lunas,
        'needed_at' => now()->toDateString(),
    ]);

    $expected = $orders->sortBy('needed_at')->take(5)->pluck('order_number')->values()->all();

    $this->get(route('admin.dashboard'))
        ->assertInertia(fn (Assert $page) => $page
            ->has('followUps', 5)
            ->where('followUps', fn ($rows) => collect($rows)->pluck('orderNumber')->all() === $expected)
            ->where('followUps.0.status.label', 'Menunggu Konfirmasi')
        );
});

test('tautan kelola custom kosong sampai halaman US-24 tersedia', function () {
    $this->get(route('admin.dashboard'))
        ->assertInertia(fn (Assert $page) => $page->where(
            'customRequestsUrl',
            Route::has('admin.custom-requests.index')
                ? route('admin.custom-requests.index', ['persetujuan' => 'menunggu'])
                : null,
        ));
});
