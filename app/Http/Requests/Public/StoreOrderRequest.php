<?php

namespace App\Http\Requests\Public;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Validasi formulir pemesanan produk (US-12, US-13).
 * Semua pesan galat memakai Bahasa Indonesia (kontrak bagian 4.6).
 */
class StoreOrderRequest extends FormRequest
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
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:100'],
            'phone' => ['required', 'string', 'regex:/^(\+62|62|0)8[0-9]{7,12}$/'],
            'quantity' => ['required', 'integer', 'min:1', 'max:50'],
            'needed_at' => ['required', 'date', 'after_or_equal:today'],
            'notes' => ['nullable', 'string', 'max:500'],
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
            'quantity.required' => 'Jumlah wajib diisi.',
            'quantity.integer' => 'Jumlah harus berupa angka.',
            'quantity.min' => 'Jumlah minimal 1.',
            'quantity.max' => 'Jumlah maksimal 50.',
            'needed_at.required' => 'Tanggal dibutuhkan wajib diisi.',
            'needed_at.date' => 'Tanggal dibutuhkan tidak valid.',
            'needed_at.after_or_equal' => 'Tanggal dibutuhkan tidak boleh sebelum hari ini.',
            'notes.string' => 'Catatan harus berupa teks.',
            'notes.max' => 'Catatan maksimal 500 huruf.',
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
            'quantity' => 'jumlah',
            'needed_at' => 'tanggal dibutuhkan',
            'notes' => 'catatan',
        ];
    }
}
