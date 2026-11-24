<?php

namespace App\Http\Requests\Admin;

use App\Models\Event;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class EventRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $event = $this->route('event');
        $id = $event instanceof Event ? $event->id : null;

        return [
            'name' => [
                'required',
                'string',
                'max:100',
                Rule::unique('events', 'name')->ignore($id),
            ],
            'slug' => [
                'nullable',
                'string',
                'max:100',
                'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/',
                Rule::unique('events', 'slug')->ignore($id),
            ],
            'description' => ['nullable', 'string'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'name' => 'nama acara',
            'slug' => 'slug',
            'description' => 'deskripsi',
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Nama acara wajib diisi.',
            'name.unique' => 'Nama acara sudah digunakan.',
            'slug.unique' => 'Slug acara sudah digunakan.',
            'slug.regex' => 'Slug hanya boleh huruf kecil, angka, dan tanda hubung.',
        ];
    }

    protected function prepareForValidation(): void
    {
        $event = $this->route('event');

        $this->merge([
            'slug' => $event instanceof Event
                ? $event->slug
                : Str::slug((string) $this->input('name')),
        ]);
    }
}
