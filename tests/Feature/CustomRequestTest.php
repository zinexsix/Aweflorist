<?php

use App\Enums\CustomRequestStatus;
use App\Models\Category;
use App\Models\Customer;
use App\Models\CustomRequest;
use App\Models\Product;
use App\Support\BouquetTypes;
use Illuminate\Support\Facades\URL;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    Category::factory()->create(['slug' => 'buket-bunga', 'name' => 'Buket Bunga Segar']);
    Category::factory()->create(['slug' => 'buket-custom', 'name' => 'Buket Custom']);
});

/**
 * @param  array<string, mixed>  $overrides
 * @return array<string, mixed>
 */
function customRequestPayload(array $overrides = []): array
{
    return array_merge([
        'name' => 'Prety',
        'phone' => '0812-3456-7890',
        'bouquet_type' => 'Buket Bunga Segar',
        'budget' => 250000,
        'theme_color' => 'Biru pastel',
        'needed_at' => now()->addDays(5)->toDateString(),
        'notes' => 'Tema wisuda',
    ], $overrides);
}

test('halaman buket custom mengirim pilihan jenis buket tanpa kategori custom', function () {
    $this->get(route('custom'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/custom-bouquet')
            ->where('bouquetTypes', ['Buket Bunga Segar', BouquetTypes::OTHER])
            ->where('reference', null)
        );
});

test('halaman buket custom menampilkan model acuan dari produk aktif', function () {
    $product = Product::factory()->create([
        'name' => 'Buket Custom Tema Warna',
        'slug' => 'buket-custom-tema-warna',
    ]);

    $this->get(route('custom', ['produk' => $product->slug]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('reference.slug', 'buket-custom-tema-warna')
            ->where('reference.name', 'Buket Custom Tema Warna')
            ->etc()
        );
});

test('model acuan dari produk nonaktif diabaikan', function () {
    $product = Product::factory()->create(['is_active' => false]);

    $this->get(route('custom', ['produk' => $product->slug]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->where('reference', null)->etc());
});

test('data valid menyimpan permintaan custom lalu mengarah ke konfirmasi', function () {
    $response = $this->post(route('custom.store'), customRequestPayload());

    $response->assertRedirectContains('/buket-custom/terkirim/CST-');

    $customRequest = CustomRequest::sole();

    expect($customRequest->request_number)->toMatch('/^CST-\d{8}-[A-HJ-NP-Z2-9]{5}$/')
        ->and($customRequest->status)->toBe(CustomRequestStatus::Baru)
        ->and($customRequest->bouquet_type)->toBe('Buket Bunga Segar')
        ->and((int) $customRequest->budget)->toBe(250000)
        ->and($customRequest->theme_color)->toBe('Biru pastel')
        ->and($customRequest->needed_at->toDateString())->toBe(now()->addDays(5)->toDateString())
        ->and($customRequest->notes)->toBe('Tema wisuda')
        ->and($customRequest->product_id)->toBeNull()
        ->and($customRequest->customer->phone)->toBe('6281234567890')
        ->and($customRequest->customer->name)->toBe('Prety');
});

test('data tidak valid kembali ke formulir dan tidak menyimpan apa pun', function () {
    $this->from(route('custom'))
        ->post(route('custom.store'), [
            'name' => '',
            'phone' => '123',
            'bouquet_type' => '',
            'budget' => 5000,
            'theme_color' => '',
            'needed_at' => now()->subDay()->toDateString(),
        ])
        ->assertRedirect(route('custom'))
        ->assertSessionHasErrors([
            'name' => 'Nama wajib diisi.',
            'phone' => 'Nomor WhatsApp tidak valid. Contoh: 0812-3456-7890.',
            'bouquet_type' => 'Pilih jenis buket.',
            'budget' => 'Anggaran minimal Rp 10.000.',
            'theme_color' => 'Tulis warna atau tema yang diinginkan.',
            'needed_at' => 'Tanggal dibutuhkan tidak boleh sebelum hari ini.',
        ]);

    expect(CustomRequest::count())->toBe(0)
        ->and(Customer::count())->toBe(0);
});

test('jenis buket di luar daftar ditolak', function () {
    $this->post(route('custom.store'), customRequestPayload(['bouquet_type' => 'Buket Custom']))
        ->assertSessionHasErrors(['bouquet_type' => 'Pilih jenis buket dari daftar yang tersedia.']);

    expect(CustomRequest::count())->toBe(0);
});

test('pilihan lainnya diterima', function () {
    $this->post(route('custom.store'), customRequestPayload(['bouquet_type' => BouquetTypes::OTHER]))
        ->assertRedirect();

    expect(CustomRequest::sole()->bouquet_type)->toBe(BouquetTypes::OTHER);
});

test('model acuan dari halaman detail ikut tersimpan', function () {
    $product = Product::factory()->create(['slug' => 'buket-custom-foto']);

    $this->post(route('custom.store'), customRequestPayload(['product' => 'buket-custom-foto']))
        ->assertRedirect();

    expect(CustomRequest::sole()->product_id)->toBe($product->id);
});

test('model acuan yang nonaktif ditolak', function () {
    Product::factory()->create(['slug' => 'buket-lama', 'is_active' => false]);

    $this->post(route('custom.store'), customRequestPayload(['product' => 'buket-lama']))
        ->assertSessionHasErrors('product');

    expect(CustomRequest::count())->toBe(0);
});

test('nomor WhatsApp yang sama memakai customer yang sudah ada tanpa menimpa nama', function () {
    $this->post(route('custom.store'), customRequestPayload(['name' => 'Prety']));
    $this->post(route('custom.store'), customRequestPayload([
        'name' => 'Nama Lain',
        'phone' => '+62 812 3456 7890',
    ]));

    expect(Customer::count())->toBe(1)
        ->and(Customer::sole()->name)->toBe('Prety')
        ->and(CustomRequest::count())->toBe(2);
});

test('lebih dari sepuluh kiriman per menit ditolak', function () {
    foreach (range(1, 10) as $attempt) {
        $this->post(route('custom.store'), customRequestPayload())->assertRedirect();
    }

    $this->post(route('custom.store'), customRequestPayload())->assertTooManyRequests();
});

test('halaman konfirmasi bertanda tangan menampilkan ringkasan permintaan', function () {
    $product = Product::factory()->create(['name' => 'Buket Custom Tema Warna']);
    $customRequest = CustomRequest::factory()->create([
        'product_id' => $product->id,
        'budget' => 300000,
        'theme_color' => 'Merah muda',
        'bouquet_type' => 'Buket Bunga Segar',
    ]);

    $this->get(URL::signedRoute('custom.confirmation', $customRequest))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/custom-confirmation')
            ->where('customRequest.requestNumber', $customRequest->request_number)
            ->where('customRequest.customerName', $customRequest->customer->name)
            ->where('customRequest.budget', 300000)
            ->where('customRequest.themeColor', 'Merah muda')
            ->where('customRequest.referenceProductName', 'Buket Custom Tema Warna')
            ->where('customRequest.hasReferenceImage', false)
            ->where('customRequest.statusLabel', 'Baru')
        );
});

test('halaman konfirmasi tanpa tanda tangan ditolak', function () {
    $customRequest = CustomRequest::factory()->create();

    $this->get(route('custom.confirmation', $customRequest))->assertForbidden();
});
