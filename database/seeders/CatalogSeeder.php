<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Event;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use RuntimeException;

/**
 * Katalog asli AweFlorist: foto dan harga dari Google Drive pemilik (10 Nov 2026).
 *
 * Sumber datanya satu file: resources/js/data/catalog.json (dipakai juga oleh
 * build statis Vercel). Kategori dikelompokkan berdasarkan harga; acara hanya
 * "Wisuda" dan "Other Occasion".
 *
 * Seeder ini aman dijalankan berulang. Produk, kategori, dan acara yang tidak
 * ada lagi di catalog.json (mis. data contoh Sprint 1) dihapus. Riwayat pesanan
 * tetap utuh karena nama dan harga produk disimpan sebagai snapshot.
 */
class CatalogSeeder extends Seeder
{
    public function run(): void
    {
        $data = self::data();

        DB::transaction(function () use ($data): void {
            foreach ($data['categories'] as $category) {
                Category::updateOrCreate(['slug' => $category['slug']], $category);
            }

            foreach ($data['occasions'] as $occasion) {
                Event::updateOrCreate(['slug' => $occasion['slug']], $occasion);
            }

            $categoryIds = Category::pluck('id', 'slug');
            $eventIds = Event::pluck('id', 'slug');

            foreach ($data['products'] as $item) {
                $product = Product::updateOrCreate(
                    ['slug' => $item['slug']],
                    [
                        'category_id' => $categoryIds[$item['category']],
                        'name' => $item['name'],
                        'description' => $item['description'],
                        'price' => $item['price'],
                        'price_from' => $item['priceFrom'],
                        'image_path' => $item['image'],
                        'is_featured' => $item['featured'],
                        'is_active' => true,
                    ],
                );

                $product->events()->sync($eventIds->only($item['occasions'])->all());
            }

            Product::whereNotIn('slug', array_column($data['products'], 'slug'))->delete();
            Event::whereNotIn('slug', array_column($data['occasions'], 'slug'))->delete();
            Category::whereNotIn('slug', array_column($data['categories'], 'slug'))->delete();
        });
    }

    /**
     * @return array{
     *     categories: list<array{slug: string, name: string, description: string}>,
     *     occasions: list<array{slug: string, name: string, description: string}>,
     *     products: list<array{slug: string, name: string, category: string, occasions: list<string>, description: string, price: int|null, priceFrom: bool, image: string, featured: bool}>
     * }
     */
    public static function data(): array
    {
        $path = resource_path('js/data/catalog.json');
        $data = json_decode((string) file_get_contents($path), true);

        if (! is_array($data) || ! isset($data['categories'], $data['occasions'], $data['products'])) {
            throw new RuntimeException("Data katalog tidak valid: {$path}");
        }

        unset($data['_catatan']);

        return $data;
    }
}
