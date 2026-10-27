<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Event;
use App\Models\Product;
use Illuminate\Database\Seeder;

/**
 * Data katalog awal, sama persis dengan resources/js/data/catalog.ts dan products.ts.
 * DATA CONTOH SPRINT 1: ganti dengan data asli toko setelah dikonfirmasi Product Owner.
 */
class CatalogSeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['slug' => 'buket-bunga', 'name' => 'Buket Bunga Segar'],
            ['slug' => 'buket-uang', 'name' => 'Buket Uang'],
            ['slug' => 'buket-satu-tangkai', 'name' => 'Buket Satu Tangkai'],
            ['slug' => 'buket-custom', 'name' => 'Buket Custom'],
        ];

        foreach ($categories as $category) {
            Category::updateOrCreate(['slug' => $category['slug']], $category);
        }

        $events = [
            ['slug' => 'wisuda', 'name' => 'Wisuda', 'description' => 'Ucapan selamat untuk momen kelulusan.'],
            ['slug' => 'ulang-tahun', 'name' => 'Ulang Tahun', 'description' => 'Kejutan manis di hari spesial.'],
            ['slug' => 'anniversary', 'name' => 'Anniversary', 'description' => 'Rayakan perjalanan bersama orang tersayang.'],
        ];

        foreach ($events as $event) {
            Event::updateOrCreate(['slug' => $event['slug']], $event);
        }

        $categoryIds = Category::pluck('id', 'slug');
        $eventIds = Event::pluck('id', 'slug');

        foreach ($this->products() as $data) {
            $product = Product::updateOrCreate(
                ['slug' => $data['slug']],
                [
                    'category_id' => $categoryIds[$data['category']],
                    'name' => $data['name'],
                    'description' => $data['description'],
                    'price' => $data['price'],
                    'price_from' => $data['price_from'] ?? false,
                    'image_path' => $data['image'],
                    'is_featured' => $data['featured'] ?? false,
                    'is_active' => true,
                ],
            );

            $product->events()->sync($eventIds->only($data['occasions'])->all());

        }
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function products(): array
    {
        return [
            [
                'slug' => 'buket-mawar-merah',
                'name' => 'Buket Mawar Merah',
                'category' => 'buket-bunga',
                'occasions' => ['anniversary', 'ulang-tahun'],
                'description' => 'Rangkaian mawar merah segar dengan wrapping elegan, cocok untuk ungkapan sayang.',
                'price' => 250000,
                'image' => '/images/products/buket-custom-tema-warna-01.webp',
                'featured' => true,
            ],
            [
                'slug' => 'buket-mawar-pink',
                'name' => 'Buket Mawar Pink',
                'category' => 'buket-bunga',
                'occasions' => ['ulang-tahun', 'anniversary'],
                'description' => 'Mawar pink lembut dengan aksen daun hijau untuk kejutan yang manis.',
                'price' => 230000,
                'image' => '/images/products/buket-mawar-pink-01.webp',
            ],
            [
                'slug' => 'buket-tulip-mix',
                'name' => 'Buket Tulip Mix',
                'category' => 'buket-bunga',
                'occasions' => ['ulang-tahun'],
                'description' => 'Perpaduan tulip warna-warni dalam rangkaian yang ceria.',
                'price' => 320000,
                'image' => '/images/products/buket-tulip-mix-01.webp',
            ],
            [
                'slug' => 'buket-baby-breath',
                'name' => 'Buket Baby Breath',
                'category' => 'buket-bunga',
                'occasions' => ['wisuda', 'ulang-tahun'],
                'description' => 'Baby breath putih yang ringan dan manis, mudah dipadukan.',
                'price' => 150000,
                'image' => '/images/products/buket-ulang-tahun-pastel-01.webp',
            ],
            [
                'slug' => 'buket-wisuda-sunflower',
                'name' => 'Buket Wisuda Sunflower',
                'category' => 'buket-bunga',
                'occasions' => ['wisuda'],
                'description' => 'Bunga matahari cerah sebagai simbol semangat untuk sang wisudawan.',
                'price' => 180000,
                'image' => '/images/products/buket-wisuda-sunflower-01.webp',
                'featured' => true,
            ],
            [
                'slug' => 'buket-wisuda-boneka',
                'name' => 'Buket Wisuda Boneka',
                'category' => 'buket-bunga',
                'occasions' => ['wisuda'],
                'description' => 'Buket bunga dengan boneka wisuda kecil sebagai kenang-kenangan.',
                'price' => 210000,
                'image' => '/images/products/buket-mawar-pink-01.webp',
            ],
            [
                'slug' => 'buket-lily-putih',
                'name' => 'Buket Lily Putih',
                'category' => 'buket-bunga',
                'occasions' => ['anniversary'],
                'description' => 'Lily putih yang anggun dengan wangi lembut.',
                'price' => 280000,
                'image' => '/images/products/buket-lily-putih-01.webp',
            ],
            [
                'slug' => 'buket-ulang-tahun-pastel',
                'name' => 'Buket Ulang Tahun Pastel',
                'category' => 'buket-bunga',
                'occasions' => ['ulang-tahun'],
                'description' => 'Kombinasi bunga bernuansa pastel untuk hari spesial.',
                'price' => 200000,
                'price_from' => true,
                'image' => '/images/products/buket-ulang-tahun-pastel-01.webp',
                'featured' => true,
            ],
            [
                'slug' => 'buket-uang-kipas',
                'name' => 'Buket Uang Kipas',
                'category' => 'buket-uang',
                'occasions' => ['wisuda', 'ulang-tahun'],
                'description' => 'Uang dilipat membentuk kipas dan dirangkai bersama bunga. Nominal uang sesuai permintaan.',
                'price' => null,
                'image' => '/images/products/buket-lily-putih-01.webp',
                'featured' => true,
            ],
            [
                'slug' => 'buket-uang-mawar',
                'name' => 'Buket Uang Mawar',
                'category' => 'buket-uang',
                'occasions' => ['anniversary', 'ulang-tahun'],
                'description' => 'Uang dilipat menyerupai kelopak mawar. Nominal uang sesuai permintaan.',
                'price' => null,
                'image' => '/images/products/buket-custom-tema-warna-01.webp',
            ],
            [
                'slug' => 'buket-uang-wisuda',
                'name' => 'Buket Uang Wisuda',
                'category' => 'buket-uang',
                'occasions' => ['wisuda'],
                'description' => 'Buket uang dengan aksen toga untuk hadiah kelulusan. Nominal uang sesuai permintaan.',
                'price' => null,
                'image' => '/images/products/buket-wisuda-sunflower-01.webp',
            ],
            [
                'slug' => 'mawar-satu-tangkai',
                'name' => 'Mawar Satu Tangkai',
                'category' => 'buket-satu-tangkai',
                'occasions' => ['anniversary', 'wisuda'],
                'description' => 'Satu tangkai mawar dengan wrapping sederhana dan pita.',
                'price' => 35000,
                'image' => '/images/products/buket-tulip-mix-01.webp',
            ],
            [
                'slug' => 'sunflower-satu-tangkai',
                'name' => 'Sunflower Satu Tangkai',
                'category' => 'buket-satu-tangkai',
                'occasions' => ['wisuda'],
                'description' => 'Satu tangkai bunga matahari yang cerah dan ringkas.',
                'price' => 45000,
                'image' => '/images/products/buket-ulang-tahun-pastel-01.webp',
            ],
            [
                'slug' => 'tulip-satu-tangkai',
                'name' => 'Tulip Satu Tangkai',
                'category' => 'buket-satu-tangkai',
                'occasions' => ['ulang-tahun'],
                'description' => 'Satu tangkai tulip dengan wrapping kertas korea.',
                'price' => 55000,
                'image' => '/images/products/buket-mawar-pink-01.webp',
            ],
            [
                'slug' => 'buket-custom-tema-warna',
                'name' => 'Buket Custom Tema Warna',
                'category' => 'buket-custom',
                'occasions' => ['wisuda', 'ulang-tahun', 'anniversary'],
                'description' => 'Pilih warna, tema, dan anggaran. Detail dan harga dikonfirmasi admin melalui WhatsApp.',
                'price' => null,
                'image' => '/images/products/buket-custom-tema-warna-01.webp',
            ],
            [
                'slug' => 'buket-custom-foto',
                'name' => 'Buket Custom dengan Foto',
                'category' => 'buket-custom',
                'occasions' => ['wisuda', 'ulang-tahun', 'anniversary'],
                'description' => 'Buket dengan sisipan foto kenangan. Detail dan harga dikonfirmasi admin melalui WhatsApp.',
                'price' => null,
                'image' => '/images/products/buket-lily-putih-01.webp',
            ],
        ];
    }
}
