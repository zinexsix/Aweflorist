<?php

namespace App\Http\Requests\Admin;

use App\Models\Product;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class ProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if (filled($this->input('slug'))) {
            return;
        }

        $product = $this->route('product');

        if ($product instanceof Product) {
            $this->merge(['slug' => $product->slug]);

            return;
        }

        if (filled($this->input('name'))) {
            $this->merge(['slug' => Str::slug($this->string('name')->toString())]);
        }
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $product = $this->route('product');
        $productId = $product instanceof Product ? $product->getKey() : null;

        return [
            'name' => ['required', 'string', 'max:150'],
            'slug' => [
                'nullable',
                'string',
                'max:150',
                'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/',
                Rule::unique('products', 'slug')->ignore($productId),
            ],
            'category_id' => ['required', 'exists:categories,id'],
            'description' => ['required', 'string'],
            'price' => ['nullable', 'integer', 'min:1000', 'max:100000000'],
            'price_from' => ['sometimes', 'boolean'],
            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'is_featured' => ['sometimes', 'boolean'],
            'is_active' => ['sometimes', 'boolean'],
            'occasions' => ['nullable', 'array'],
            'occasions.*' => ['exists:events,id'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'name' => 'nama produk',
            'slug' => 'slug',
            'category_id' => 'kategori',
            'description' => 'deskripsi',
            'price' => 'harga',
            'price_from' => 'harga mulai',
            'image' => 'gambar',
            'is_featured' => 'produk unggulan',
            'is_active' => 'status aktif',
            'occasions' => 'acara',
            'occasions.*' => 'acara',
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'slug.regex' => 'Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung.',
            'slug.unique' => 'Slug sudah digunakan produk lain.',
            'price.min' => 'Harga minimal Rp1.000.',
            'price.max' => 'Harga maksimal Rp100.000.000.',
            'image.image' => 'File harus berupa gambar.',
            'image.mimes' => 'Gambar harus berformat JPG, PNG, atau WebP.',
            'image.max' => 'Ukuran gambar tidak boleh lebih dari 2 MB.',
        ];
    }
}
