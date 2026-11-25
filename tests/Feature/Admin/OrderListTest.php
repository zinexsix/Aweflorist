<?php

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->actingAs(User::factory()->create());
});

test('tamu diarahkan ke halaman login saat membuka pesanan', function () {
    $order = Order::factory()->create();
    $this->app['auth']->forgetGuards();

    $this->get(route('admin.orders.index'))->assertRedirect(route('login'));
    $this->get(route('admin.orders.show', $order))->assertRedirect(route('login'));
});

test('daftar pesanan terurut dari yang terbaru', function () {
    $lama = Order::factory()->create(['created_at' => now()->subDays(2)]);
    $baru = Order::factory()->create(['created_at' => now()]);

    $this->get(route('admin.orders.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/orders/index')
            ->has('orders.data', 2)
            ->where('orders.data.0.orderNumber', $baru->order_number)
            ->where('orders.data.1.orderNumber', $lama->order_number)
            ->where('orders.total', 2)
            ->has('statuses', 7)
            ->has('paymentStatuses', 5)
        );
});

test('baris pesanan berisi pelanggan, ringkasan produk, dan label status', function () {
    $order = Order::factory()->create(['total_amount' => 150000]);
    OrderItem::factory()->for($order)->create(['product_name_snapshot' => 'Buket Rp50.000 · 01', 'quantity' => 3]);
    OrderItem::factory()->for($order)->create();

    $this->get(route('admin.orders.index'))
        ->assertInertia(fn (Assert $page) => $page
            ->where('orders.data.0.customerName', $order->customer->name)
            ->where('orders.data.0.itemsSummary', 'Buket Rp50.000 · 01 × 3 (+1 lainnya)')
            ->where('orders.data.0.totalAmount', 150000)
            ->where('orders.data.0.status', ['value' => 'menunggu_konfirmasi', 'label' => 'Menunggu Konfirmasi'])
            ->where('orders.data.0.paymentStatus', ['value' => 'belum_dibayar', 'label' => 'Belum Dibayar'])
        );
});

test('pesanan bisa dicari dengan nomor pesanan, nama, dan nomor HP', function () {
    $sari = Customer::factory()->create(['name' => 'Sari Wulandari', 'phone' => '6281234567890']);
    $target = Order::factory()->for($sari)->create();
    Order::factory()->count(2)->create();

    $cari = fn (string $q) => $this->get(route('admin.orders.index', ['q' => $q]))
        ->assertInertia(fn (Assert $page) => $page
            ->has('orders.data', 1)
            ->where('orders.data.0.orderNumber', $target->order_number)
            ->where('filters.q', $q)
        );

    $cari($target->order_number);
    $cari('wulandari');
    $cari('0812-3456-7890');
    $cari('6281234567890');
});

test('filter status pesanan, status pembayaran, dan pencarian bisa digabung', function () {
    $ani = Customer::factory()->create(['name' => 'Ani']);
    $cocok = Order::factory()->for($ani)->create([
        'order_status' => OrderStatus::Diproses,
        'payment_status' => PaymentStatus::Dp,
    ]);
    Order::factory()->for($ani)->create(['order_status' => OrderStatus::Diproses, 'payment_status' => PaymentStatus::Lunas]);
    Order::factory()->create(['order_status' => OrderStatus::Diproses, 'payment_status' => PaymentStatus::Dp]);

    $this->get(route('admin.orders.index', ['q' => 'Ani', 'status' => 'diproses', 'pembayaran' => 'dp']))
        ->assertInertia(fn (Assert $page) => $page
            ->has('orders.data', 1)
            ->where('orders.data.0.orderNumber', $cocok->order_number)
            ->where('filters.status', 'diproses')
            ->where('filters.pembayaran', 'dp')
        );
});

test('filter tidak dikenal diabaikan', function () {
    Order::factory()->count(2)->create();

    $this->get(route('admin.orders.index', ['status' => 'ngawur', 'pembayaran' => 'ngawur']))
        ->assertInertia(fn (Assert $page) => $page
            ->has('orders.data', 2)
            ->where('filters.status', '')
            ->where('filters.pembayaran', '')
        );
});

test('filter tindak lanjut sesuai definisi kontrak', function () {
    $perlu = [
        Order::factory()->create(['order_status' => OrderStatus::Baru, 'payment_status' => PaymentStatus::Lunas]),
        Order::factory()->create(['order_status' => OrderStatus::MenungguKonfirmasi, 'payment_status' => PaymentStatus::Lunas]),
        Order::factory()->create(['order_status' => OrderStatus::Diproses, 'payment_status' => PaymentStatus::BelumDibayar]),
        Order::factory()->create(['order_status' => OrderStatus::SiapDiambilDikirim, 'payment_status' => PaymentStatus::Dp]),
    ];
    Order::factory()->create(['order_status' => OrderStatus::Diproses, 'payment_status' => PaymentStatus::Lunas]);
    Order::factory()->create(['order_status' => OrderStatus::Selesai, 'payment_status' => PaymentStatus::BelumDibayar]);
    Order::factory()->create(['order_status' => OrderStatus::Dibatalkan, 'payment_status' => PaymentStatus::Dp]);

    expect(Order::needsFollowUp()->pluck('order_number')->sort()->values()->all())
        ->toBe(collect($perlu)->pluck('order_number')->sort()->values()->all());

    $this->get(route('admin.orders.index', ['tindak_lanjut' => 1]))
        ->assertInertia(fn (Assert $page) => $page
            ->has('orders.data', 4)
            ->where('filters.tindak_lanjut', true)
        );
});

test('filter tetap terbawa saat pindah halaman', function () {
    Order::factory()->count(16)->create(['order_status' => OrderStatus::Diproses]);

    $this->get(route('admin.orders.index', ['status' => 'diproses']))
        ->assertInertia(fn (Assert $page) => $page
            ->has('orders.data', 15)
            ->where('orders.total', 16)
            ->where('orders.links', fn ($links) => collect($links)
                ->pluck('url')
                ->filter()
                ->every(fn (string $url) => str_contains($url, 'status=diproses')))
        );
});

test('detail pesanan memakai nama dan harga snapshot, bukan data produk sekarang', function () {
    $product = Product::factory()->create(['name' => 'Buket Rp50.000 · 01', 'price' => 50000]);
    $order = Order::factory()->create(['total_amount' => 100000, 'notes' => 'Kartu ucapan wisuda']);
    OrderItem::factory()->for($order)->for($product)->create([
        'product_name_snapshot' => 'Buket Rp50.000 · 01',
        'unit_price_snapshot' => 50000,
        'quantity' => 2,
        'subtotal' => 100000,
    ]);

    $product->update(['name' => 'Nama Baru', 'price' => 90000]);

    $this->get(route('admin.orders.show', $order))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/orders/show')
            ->where('order.orderNumber', $order->order_number)
            ->where('order.customer.phone', $order->customer->phone)
            ->where('order.items.0.name', 'Buket Rp50.000 · 01')
            ->where('order.items.0.unitPrice', 50000)
            ->where('order.items.0.subtotal', 100000)
            ->where('order.totalAmount', 100000)
            ->where('order.notes', 'Kartu ucapan wisuda')
            ->where('order.needsFollowUp', true)
            ->has('statuses', 7)
        );
});

test('pesanan dengan harga dikonfirmasi admin tetap tampil', function () {
    $order = Order::factory()->create(['total_amount' => null]);
    OrderItem::factory()->for($order)->create(['unit_price_snapshot' => null, 'subtotal' => null]);

    $this->get(route('admin.orders.show', $order))
        ->assertInertia(fn (Assert $page) => $page
            ->where('order.totalAmount', null)
            ->where('order.items.0.unitPrice', null)
        );
});

test('item dari produk yang sudah dihapus tetap terbaca', function () {
    $order = Order::factory()->create();
    $item = OrderItem::factory()->for($order)->create(['product_name_snapshot' => 'Buket Lama']);
    $item->product->delete();

    $this->get(route('admin.orders.show', $order))
        ->assertInertia(fn (Assert $page) => $page
            ->where('order.items.0.name', 'Buket Lama')
            ->where('order.items.0.productSlug', null)
        );
});

test('nomor pesanan yang tidak ada menghasilkan 404', function () {
    $this->get('/admin/pesanan/AWF-20260101-XXXXX')->assertNotFound();
});
