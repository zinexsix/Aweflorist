<?php

namespace App\Http\Requests\Public;

use App\Support\BouquetTypes;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Validasi formulir permintaan buket custom (US-15).
 * Semua pesan galat memakai Bahasa Indonesia (kontrak bagian 4.6).
 */
class StoreCustomRequestRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Buang spasi dan tanda hubung dari nomor WhatsApp sebelum divalidasi,
     * supaya "0812-3456-7890" dan "+62 812 3456 7890" sama-sama diterima.
     */
    protected function prepareForValidation(): void
    {
        $phone = $this->input('phone');

        if (is_string($phone)) {
            $this->merge([
                'phone' => (string) preg_replace('/[\s-]+/', '', trim($phone)),
            ]);
        }
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:100'],
            'phone' => ['required', 'string', 'regex:/^(\+62|62|0)8[0-9]{7,12}$/'],
            'bouquet_type' => ['required', 'string', Rule::in(BouquetTypes::all())],
            'budget' => ['required', 'integer', 'min:10000', 'max:100000000'],
            'theme_color' => ['required', 'string', 'max:100'],
            'needed_at' => ['required', 'date', 'after_or_equal:today'],
            'notes' => ['nullable', 'string', 'max:500'],
            'product' => [
                'nullable',
                'string',
                Rule::exists('products', 'slug')->where('is_active', true),
            ],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Nama wajib diisi.',
            'name.string' => 'Nama harus berupa teks.',
            'name.max' => 'Nama maksimal 100 huruf.',
            'phone.required' => 'Nomor WhatsApp wajib diisi.',
            'phone.string' => 'Nomor WhatsApp harus berupa teks.',
            'phone.regex' => 'Nomor WhatsApp tidak valid. Contoh: 0812-3456-7890.',
            'bouquet_type.required' => 'Pilih jenis buket.',
            'bouquet_type.string' => 'Jenis buket tidak valid.',
            'bouquet_type.in' => 'Pilih jenis buket dari daftar yang tersedia.',
            'budget.required' => 'Anggaran wajib diisi.',
            'budget.integer' => 'Anggaran harus berupa angka.',
            'budget.min' => 'Anggaran minimal Rp 10.000.',
            'budget.max' => 'Anggaran maksimal Rp 100.000.000.',
            'theme_color.required' => 'Tulis warna atau tema yang diinginkan.',
            'theme_color.string' => 'Warna atau tema harus berupa teks.',
            'theme_color.max' => 'Warna atau tema maksimal 100 huruf.',
            'needed_at.required' => 'Tanggal dibutuhkan wajib diisi.',
            'needed_at.date' => 'Tanggal dibutuhkan tidak valid.',
            'needed_at.after_or_equal' => 'Tanggal dibutuhkan tidak boleh sebelum hari ini.',
            'notes.string' => 'Catatan harus berupa teks.',
            'notes.max' => 'Catatan maksimal 500 huruf.',
            'product.string' => 'Model acuan tidak valid.',
            'product.exists' => 'Model acuan tidak ditemukan atau sudah tidak tersedia.',
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'name' => 'nama',
            'phone' => 'nomor WhatsApp',
            'bouquet_type' => 'jenis buket',
            'budget' => 'anggaran',
            'theme_color' => 'warna atau tema',
            'needed_at' => 'tanggal dibutuhkan',
            'notes' => 'catatan',
            'product' => 'model acuan',
        ];
    }
}
