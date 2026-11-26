<?php

namespace App\Http\Requests\Admin;

use App\Enums\CustomRequestApproval;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CustomRequestApprovalRequest extends FormRequest
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
        return [
            'approval_status' => [
                'required',
                Rule::in([
                    CustomRequestApproval::Disetujui->value,
                    CustomRequestApproval::Ditolak->value,
                ]),
            ],
            'approval_note' => [
                'nullable',
                'string',
                'max:500',
                'required_if:approval_status,'.CustomRequestApproval::Ditolak->value,
            ],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'approval_status' => 'keputusan',
            'approval_note' => 'catatan persetujuan',
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'approval_status.required' => 'Pilih keputusan persetujuan.',
            'approval_status.in' => 'Pilih Disetujui atau Ditolak.',
            'approval_note.required_if' => 'Tulis alasan penolakan.',
            'approval_note.max' => 'Alasan penolakan maksimal 500 karakter.',
        ];
    }
}
