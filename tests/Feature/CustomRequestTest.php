<?php

use App\Enums\CustomRequestApproval;
use App\Enums\CustomRequestStatus;
use App\Models\Customer;
use App\Models\CustomRequest;
use App\Models\Product;
use App\Support\BouquetTypes;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;
use Inertia\Testing\AssertableInertia as Assert;

/**
 * @param  array<string, mixed>  $overrides
 * @return array<string, mixed>
 */
function customRequestPayload(array $overrides = []): array
{
    return array_merge([
        'name' => 'Prety',
        'phone' => '0812-3456-7890',
        'bouquet_type' => 'Wisuda',
        'budget' => 250000,
        'theme_color' => 'Biru pastel',
        'needed_at' => now()->addDays(5)->toDateString(),
        'notes' => 'Tema wisuda',
    ], $overrides);
}

test('halaman buket custom hanya menawarkan Wisuda dan Other Occasion', function () {
    $this->get(route('custom'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/custom-bouquet')
            ->where('bouquetTypes', ['Wisuda', 'Other Occasion'])
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

test('data valid menyimpan permintaan custom menunggu persetujuan lalu langsung ke WhatsApp', function () {
    $response = $this->post(route('custom.store'), customRequestPayload());

    $message = whatsappMessageFrom($response);

    $customRequest = CustomRequest::sole();

    expect($customRequest->request_number)->toMatch('/^CST-\d{8}-[A-HJ-NP-Z2-9]{5}$/')
        ->and($customRequest->status)->toBe(CustomRequestStatus::Baru)
        ->and($customRequest->approval_status)->toBe(CustomRequestApproval::Menunggu)
        ->and($customRequest->approved_at)->toBeNull()
        ->and($customRequest->bouquet_type)->toBe('Wisuda')
        ->and((int) $customRequest->budget)->toBe(250000)
        ->and($customRequest->theme_color)->toBe('Biru pastel')
        ->and($customRequest->needed_at->toDateString())->toBe(now()->addDays(5)->toDateString())
        ->and($customRequest->notes)->toBe('Tema wisuda')
        ->and($customRequest->product_id)->toBeNull()
        ->and($customRequest->customer->phone)->toBe('6281234567890')
        ->and($customRequest->customer->name)->toBe('Prety');

    expect($message)->toContain('nomor *'.$customRequest->request_number.'*')
        ->toContain('• Jenis buket: Wisuda')
        ->toContain('• Anggaran: Rp250.000')
        ->toContain('• Warna/tema: Biru pastel')
        ->toContain('/buket-custom/terkirim/'.$customRequest->request_number.'?signature=');
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
    $this->post(route('custom.store'), customRequestPayload(['bouquet_type' => 'Ulang Tahun']))
        ->assertSessionHasErrors(['bouquet_type' => 'Pilih jenis buket dari daftar yang tersedia.']);

    expect(CustomRequest::count())->toBe(0);
});

test('pilihan Other Occasion diterima', function () {
    $this->post(route('custom.store'), customRequestPayload(['bouquet_type' => BouquetTypes::OTHER]))
        ->assertRedirect();

    expect(CustomRequest::sole()->bouquet_type)->toBe(BouquetTypes::OTHER);
});

test('model acuan dari halaman detail ikut tersimpan', function () {
    $product = Product::factory()->create(['slug' => 'buket-custom-foto']);

    $message = whatsappMessageFrom(
        $this->post(route('custom.store'), customRequestPayload(['product' => 'buket-custom-foto'])),
    );

    expect(CustomRequest::sole()->product_id)->toBe($product->id)
        ->and($message)->toContain('• Model acuan: '.$product->name);
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
        'bouquet_type' => 'Other Occasion',
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
            ->where('customRequest.approvalLabel', 'Menunggu persetujuan admin')
        );
});

test('konfirmasi menampilkan persetujuan yang diubah admin', function () {
    $customRequest = CustomRequest::factory()->create([
        'approval_status' => CustomRequestApproval::Disetujui,
        'approved_at' => now(),
    ]);

    $this->get(URL::signedRoute('custom.confirmation', $customRequest))
        ->assertInertia(fn (Assert $page) => $page->where('customRequest.approvalLabel', 'Disetujui')->etc());
});

test('halaman konfirmasi tanpa tanda tangan ditolak', function () {
    $customRequest = CustomRequest::factory()->create();

    $this->get(route('custom.confirmation', $customRequest))->assertForbidden();
});

test('gambar referensi valid tersimpan dengan nama acak', function () {
    Storage::fake('public');

    $message = whatsappMessageFrom($this->post(route('custom.store'), customRequestPayload([
        'reference_image' => UploadedFile::fake()->image('foto saya.jpg', 800, 1000)->size(500),
    ])));

    $path = CustomRequest::sole()->reference_image_path;

    expect($path)->toStartWith('custom-references/')
        ->and($path)->not->toContain('foto saya')
        ->and($message)->toContain('• Gambar referensi: ')
        ->and($message)->toContain($path);

    Storage::disk('public')->assertExists($path);
});

test('gambar referensi format webp dan png diterima', function (string $file) {
    Storage::fake('public');

    $this->post(route('custom.store'), customRequestPayload([
        'reference_image' => UploadedFile::fake()->image($file),
    ]))->assertRedirect();

    expect(CustomRequest::sole()->reference_image_path)->not->toBeNull();
})->with(['ref.png', 'ref.webp']);

test('gambar referensi lebih dari 2 MB ditolak', function () {
    Storage::fake('public');

    $this->post(route('custom.store'), customRequestPayload([
        'reference_image' => UploadedFile::fake()->image('besar.jpg')->size(2049),
    ]))->assertSessionHasErrors(['reference_image' => 'Ukuran gambar referensi maksimal 2 MB.']);

    expect(CustomRequest::count())->toBe(0);
    expect(Storage::disk('public')->allFiles())->toBe([]);
});

test('file PDF ditolak sebagai gambar referensi', function () {
    Storage::fake('public');

    $this->post(route('custom.store'), customRequestPayload([
        'reference_image' => UploadedFile::fake()->create('ref.pdf', 100, 'application/pdf'),
    ]))->assertSessionHasErrors('reference_image');

    expect(CustomRequest::count())->toBe(0);
});

test('file berekstensi jpg yang bukan gambar ditolak', function () {
    Storage::fake('public');

    // File sungguhan (bukan UploadedFile::fake) supaya tipe dibaca dari isi file, bukan dari nama.
    $path = tempnam(sys_get_temp_dir(), 'palsu');
    file_put_contents($path, 'ini bukan gambar');

    $this->post(route('custom.store'), customRequestPayload([
        'reference_image' => new UploadedFile($path, 'palsu.jpg', 'image/jpeg', null, true),
    ]))->assertSessionHasErrors('reference_image');

    unlink($path);

    expect(CustomRequest::count())->toBe(0);
});

test('permintaan tanpa gambar referensi tetap tersimpan', function () {
    Storage::fake('public');

    $this->post(route('custom.store'), customRequestPayload())->assertRedirect();

    expect(CustomRequest::sole()->reference_image_path)->toBeNull();
});

test('konfirmasi menandai gambar referensi terlampir', function () {
    $customRequest = CustomRequest::factory()->create([
        'reference_image_path' => 'custom-references/contoh.jpg',
    ]);

    $this->get(URL::signedRoute('custom.confirmation', $customRequest))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->where('customRequest.hasReferenceImage', true)->etc());
});
