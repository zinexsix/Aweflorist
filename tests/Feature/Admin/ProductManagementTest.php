<?php

use App\Models\Category;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Database\Seeders\CatalogSeeder;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->actingAs(User::factory()->create());
});

test('tamu diarahkan ke halaman login saat membuka kelola produk', function () {
    $this->app['auth']->forgetGuards();

    $this->get(route('admin.products.index'))
        ->assertRedirect(route('login'));

    $this->get(route('admin.products.create'))
        ->assertRedirect(route('login'));
});

test('daftar produk bisa dicari dan difilter', function () {
    $this->seed(CatalogSeeder::class);

    $categoryId = Category::where('slug', 'harga-di-bawah-50rb')->value('id');
    Product::factory()->create([
        'name' => 'Buket Unik Alpha',
        'category_id' => $categoryId,
        'price' => 35000,
    ]);
    Product::factory()->inactive()->create([
        'name' => 'Buket Unik Beta',
        'category_id' => $categoryId,
        'price' => 40000,
    ]);

    $this->get(route('admin.products.index', ['q' => 'Alpha']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/products/index')
            ->where('products.total', 1)
            ->where('products.data.0.name', 'Buket Unik Alpha'));

    $this->get(route('admin.products.index', ['status' => 'nonaktif']))
        ->assertInertia(fn (Assert $page) => $page->where('products.total', 1));

    $this->get(route('admin.products.index', ['kategori' => (string) $categoryId]))
        ->assertInertia(fn (Assert $page) => $page->where('filters.kategori', (string) $categoryId));
});

test('admin dapat menambah produk dengan gambar dan produk tampil di katalog publik', function () {
    Storage::fake('public');
    $this->seed(CatalogSeeder::class);

    $this->post(route('admin.products.store'), [
        'name' => 'Buket Uji Admin',
        'slug' => '',
        'category_id' => Category::where('slug', 'harga-50rb-75rb')->value('id'),
        'description' => 'Buket uji dari panel admin.',
        'price' => 55000,
        'price_from' => false,
        'is_featured' => false,
        'is_active' => true,
        'occasions' => [],
        'image' => UploadedFile::fake()->image('buket-uji.jpg', 200, 200),
    ])->assertRedirect(route('admin.products.index'));

    $product = Product::where('slug', 'buket-uji-admin')->firstOrFail();
    expect($product->category->slug)->toBe('harga-50rb-75rb');
    expect($product->image_path)->toStartWith('/storage/products/');
    Storage::disk('public')->assertExists(Str::after($product->image_path, '/storage/'));

    $this->get(route('catalog.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('public/catalog')
            ->where(
                'products',
                fn ($products) => $products->contains(fn (array $product) => $product['slug'] === 'buket-uji-admin'),
            ));
});

test('mengubah harga produk memindahkan kategori harga otomatis', function () {
    $this->seed(CatalogSeeder::class);
    $product = Product::where('slug', 'buket-50rb-01')->firstOrFail();

    $this->put(route('admin.products.update', $product), [
        'name' => $product->name,
        'slug' => $product->slug,
        'category_id' => $product->category_id,
        'description' => $product->description,
        'price' => 120000,
        'is_active' => true,
    ])->assertRedirect();

    expect($product->fresh()->category->slug)->toBe('harga-di-atas-100rb');
});

test('produk yang pernah dipesan hanya dinonaktifkan dan snapshot pesanan tetap utuh', function () {
    $product = Product::factory()->create(['name' => 'Buket Lama']);
    $item = OrderItem::factory()->create([
        'product_id' => $product->id,
        'product_name_snapshot' => 'Buket Snapshot Lama',
        'unit_price_snapshot' => 75000,
    ]);

    $this->delete(route('admin.products.destroy', $product))->assertRedirect();

    expect($product->fresh()->is_active)->toBeFalse();
    expect($item->fresh()->product_name_snapshot)->toBe('Buket Snapshot Lama');
});

test('produk baru-benar terhapus beserta gambar unggahannya', function () {
    Storage::fake('public');
    $this->seed(CatalogSeeder::class);

    $this->post(route('admin.products.store'), [
        'name' => 'Buket Segera Dihapus',
        'slug' => 'buket-segera-dihapus',
        'category_id' => Category::where('slug', 'harga-premium')->value('id'),
        'description' => 'Produk uji hapus.',
        'price' => null,
        'is_active' => true,
        'occasions' => [],
        'image' => UploadedFile::fake()->image('hapus.jpg'),
    ])->assertRedirect();

    $product = Product::where('slug', 'buket-segera-dihapus')->firstOrFail();
    $imagePath = Str::after($product->image_path, '/storage/');

    $this->delete(route('admin.products.destroy', $product))->assertRedirect();

    expect(Product::whereKey($product->id)->exists())->toBeFalse();
    Storage::disk('public')->assertMissing($imagePath);
});

test('validasi menolak slug ganda dan file bukan gambar', function () {
    $this->seed(CatalogSeeder::class);
    $existing = Product::factory()->create(['slug' => 'buket-sudah-ada']);

    $this->post(route('admin.products.store'), [
        'name' => 'Buket Baru',
        'slug' => $existing->slug,
        'category_id' => $existing->category_id,
        'description' => 'Deskripsi produk.',
        'price' => 50000,
        'is_active' => true,
    ])->assertSessionHasErrors('slug');

    $this->post(route('admin.products.store'), [
        'name' => 'Buket File Salah',
        'category_id' => $existing->category_id,
        'description' => 'Deskripsi produk.',
        'price' => 50000,
        'is_active' => true,
        'image' => UploadedFile::fake()->create('dokumen.txt', 10, 'text/plain'),
    ])->assertSessionHasErrors('image');
});

test('seeder tidak menghapus produk buatan admin', function () {
    $this->seed(CatalogSeeder::class);
    $product = Product::factory()->create([
        'name' => 'Buket Buatan Admin',
        'slug' => 'buket-buatan-admin',
    ]);

    $this->seed(CatalogSeeder::class);

    expect(Product::whereKey($product->id)->exists())->toBeTrue();
});
