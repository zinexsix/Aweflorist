<?php

use App\Models\Category;
use App\Models\Event;
use App\Models\Product;
use App\Models\User;
use Database\Seeders\CatalogSeeder;
use Illuminate\Support\Facades\DB;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->actingAs(User::factory()->create());
});

test('tamu diarahkan ke login saat membuka kelola kategori dan acara', function () {
    $this->app['auth']->forgetGuards();

    $this->get(route('admin.categories.index'))
        ->assertRedirect(route('login'));

    $this->get(route('admin.events.index'))
        ->assertRedirect(route('login'));
});

test('admin dapat menambah kategori dan acara dengan slug otomatis', function () {
    $this->post(route('admin.categories.store'), [
        'name' => 'Buket Musim Semi',
        'description' => 'Koleksi musim semi.',
    ])->assertRedirect();

    $category = Category::where('slug', 'buket-musim-semi')->firstOrFail();
    expect($category->name)->toBe('Buket Musim Semi');

    $this->post(route('admin.events.store'), [
        'name' => 'Ulang Tahun',
        'description' => 'Acara ulang tahun.',
    ])->assertRedirect();

    $event = Event::where('slug', 'ulang-tahun')->firstOrFail();
    expect($event->name)->toBe('Ulang Tahun');
});

test('nama kategori dan acara ganda ditolak', function () {
    $category = Category::factory()->create(['name' => 'Kategori Unik']);
    $event = Event::factory()->create(['name' => 'Acara Unik']);

    $this->post(route('admin.categories.store'), [
        'name' => $category->name,
    ])->assertSessionHasErrors('name');

    $this->post(route('admin.events.store'), [
        'name' => $event->name,
    ])->assertSessionHasErrors('name');
});

test('nama kategori dan acara yang diubah langsung tampil di beranda dan katalog', function () {
    $category = Category::factory()->create(['name' => 'Kategori Lama']);
    $event = Event::factory()->create(['name' => 'Acara Lama']);

    $this->put(route('admin.categories.update', $category), [
        'name' => 'Kategori Baru',
        'description' => 'Deskripsi baru.',
    ])->assertRedirect();

    $this->put(route('admin.events.update', $event), [
        'name' => 'Acara Baru',
        'description' => 'Deskripsi baru.',
    ])->assertRedirect();

    expect($category->fresh()->slug)->toBe($category->slug);
    expect($event->fresh()->slug)->toBe($event->slug);

    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('categories', fn ($categories) => $categories->contains(fn (array $item) => $item['name'] === 'Kategori Baru'))
            ->where('occasions', fn ($occasions) => $occasions->contains(fn (array $item) => $item['name'] === 'Acara Baru')));

    $this->get(route('catalog.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('categories', fn ($categories) => $categories->contains(fn (array $item) => $item['name'] === 'Kategori Baru'))
            ->where('occasions', fn ($occasions) => $occasions->contains(fn (array $item) => $item['name'] === 'Acara Baru')));
});

test('kategori kosong boleh dihapus', function () {
    $category = Category::factory()->create();

    $this->delete(route('admin.categories.destroy', $category))->assertRedirect();

    expect(Category::whereKey($category->id)->exists())->toBeFalse();
});

test('kategori yang masih memiliki produk tidak bisa dihapus', function () {
    $category = Category::factory()->create();
    Product::factory()->create(['category_id' => $category->id]);

    $this->delete(route('admin.categories.destroy', $category))
        ->assertRedirect()
        ->assertSessionHas('error', 'Kategori masih digunakan oleh produk dan tidak bisa dihapus.');

    expect(Category::whereKey($category->id)->exists())->toBeTrue();
});

test('kategori harga bawaan tidak bisa dihapus dan slug-nya tidak berubah', function () {
    $this->seed(CatalogSeeder::class);
    $category = Category::where('slug', 'harga-premium')->firstOrFail();

    $this->put(route('admin.categories.update', $category), [
        'name' => 'Harga Premium Ubah',
    ])->assertRedirect();

    expect($category->fresh()->slug)->toBe('harga-premium');
    expect($category->fresh()->name)->toBe('Harga Premium Ubah');

    $this->delete(route('admin.categories.destroy', $category))
        ->assertRedirect()
        ->assertSessionHas('error', 'Kategori harga bawaan tidak bisa dihapus.');

    expect(Category::whereKey($category->id)->exists())->toBeTrue();
});

test('acara dapat dihapus beserta hubungannya dengan produk', function () {
    $event = Event::factory()->create();
    $product = Product::factory()->create();
    $event->products()->attach($product);

    expect(DB::table('event_product')->where('event_id', $event->id)->exists())->toBeTrue();

    $this->delete(route('admin.events.destroy', $event))
        ->assertRedirect()
        ->assertSessionHas('success', 'Acara dihapus.');

    expect(Event::whereKey($event->id)->exists())->toBeFalse();
    expect(DB::table('event_product')->where('event_id', $event->id)->exists())->toBeFalse();
    expect(Product::whereKey($product->id)->exists())->toBeTrue();
});
