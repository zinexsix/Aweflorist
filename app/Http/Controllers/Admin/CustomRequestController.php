<?php

namespace App\Http\Controllers\Admin;

use App\Enums\CustomRequestApproval;
use App\Enums\CustomRequestStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\CustomRequestApprovalRequest;
use App\Models\Customer;
use App\Models\CustomRequest;
use App\Support\EnumOptions;
use Carbon\CarbonInterface;
use DateTimeInterface;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class CustomRequestController extends Controller
{
    public function index(Request $request): Response
    {
        $q = mb_substr(trim($request->string('q')->toString()), 0, 100);
        $q = $q === '' ? null : $q;

        $approval = CustomRequestApproval::tryFrom($request->string('persetujuan')->toString());

        $requests = CustomRequest::query()
            ->with('customer:id,name,phone')
            ->when($q !== null, function ($query) use ($q): void {
                $term = '%'.addcslashes($q, '%_\\').'%';

                $query->where('request_number', 'like', $term)
                    ->orWhereHas('customer', fn ($query) => $query->where('name', 'like', $term));
            })
            ->when($approval !== null, fn ($query) => $query->where('approval_status', $approval->value))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/custom-requests/index', [
            'requests' => [
                'data' => $requests->getCollection()->map(fn (CustomRequest $customRequest): array => [
                    'id' => $customRequest->id,
                    'requestNumber' => $customRequest->request_number,
                    'customerName' => $customRequest->customer->name,
                    'bouquetType' => $customRequest->bouquet_type,
                    'budget' => (int) $customRequest->budget,
                    'neededAt' => $this->dateValue($customRequest->needed_at),
                    'createdAt' => $this->dateValue($customRequest->created_at),
                    'approvalStatus' => $this->approvalValue($customRequest->approval_status),
                    'approvalLabel' => $this->approvalLabel($customRequest->approval_status),
                ])->all(),
                'links' => $requests->toArray()['links'],
                'from' => $requests->firstItem(),
                'to' => $requests->lastItem(),
                'total' => $requests->total(),
            ],
            'approvals' => EnumOptions::from(CustomRequestApproval::class),
            'filters' => [
                'q' => $q ?? '',
                'persetujuan' => $approval?->value ?? '',
            ],
        ]);
    }

    public function show(CustomRequest $customRequest): Response
    {
        $customRequest->load(['customer', 'product']);

        $customerName = $customRequest->customer->name;
        $phone = Customer::normalizePhone($customRequest->customer->phone);
        $message = 'Halo '.$customerName.', saya menghubungi Anda terkait permintaan buket custom nomor '.$customRequest->request_number.'.';
        $approvedAt = $customRequest->approved_at;

        return Inertia::render('admin/custom-requests/show', [
            'request' => [
                'requestNumber' => $customRequest->request_number,
                'customerName' => $customerName,
                'customerPhone' => $customRequest->customer->phone,
                'customerEmail' => $customRequest->customer->email,
                'whatsappUrl' => 'https://wa.me/'.$phone.'?text='.rawurlencode($message),
                'bouquetType' => $customRequest->bouquet_type,
                'budget' => (int) $customRequest->budget,
                'themeColor' => $customRequest->theme_color,
                'neededAt' => $this->dateValue($customRequest->needed_at),
                'notes' => $customRequest->notes,
                'productName' => $customRequest->product?->name,
                'referenceImageUrl' => $customRequest->reference_image_path === null
                    ? null
                    : Storage::disk('public')->url($customRequest->reference_image_path),
                'status' => $this->statusValue($customRequest->status),
                'statusLabel' => $this->statusLabel($customRequest->status),
                'approvalStatus' => $this->approvalValue($customRequest->approval_status),
                'approvalLabel' => $this->approvalLabel($customRequest->approval_status),
                'approvedAt' => $approvedAt instanceof CarbonInterface
                    ? $approvedAt->locale('id')->translatedFormat('j F Y H:i')
                    : null,
                'approvalNote' => $customRequest->approval_note,
            ],
        ]);
    }

    public function approval(CustomRequestApprovalRequest $request, CustomRequest $customRequest): RedirectResponse
    {
        $decision = CustomRequestApproval::from($request->string('approval_status')->toString());
        $note = trim($request->string('approval_note')->toString());

        $customRequest->update([
            'approval_status' => $decision,
            'approval_note' => $note === '' ? null : $note,
            'approved_at' => $decision === CustomRequestApproval::Disetujui ? now() : null,
            'status' => $decision === CustomRequestApproval::Disetujui
                ? CustomRequestStatus::Disepakati
                : CustomRequestStatus::Dibatalkan,
        ]);

        return back()->with(
            'success',
            $decision === CustomRequestApproval::Disetujui
                ? 'Permintaan disetujui.'
                : 'Permintaan ditolak.',
        );
    }

    private function dateValue(mixed $value): string
    {
        if ($value instanceof DateTimeInterface) {
            return $value->format('Y-m-d');
        }

        return is_string($value) ? substr($value, 0, 10) : '';
    }

    private function approvalValue(mixed $value): string
    {
        if ($value instanceof CustomRequestApproval) {
            return $value->value;
        }

        return is_string($value) ? $value : CustomRequestApproval::Menunggu->value;
    }

    private function approvalLabel(mixed $value): string
    {
        $approval = $value instanceof CustomRequestApproval
            ? $value
            : (is_string($value) ? CustomRequestApproval::tryFrom($value) : null);

        return $approval?->label() ?? CustomRequestApproval::Menunggu->label();
    }

    private function statusValue(mixed $value): string
    {
        if ($value instanceof CustomRequestStatus) {
            return $value->value;
        }

        return is_string($value) ? $value : CustomRequestStatus::Baru->value;
    }

    private function statusLabel(mixed $value): string
    {
        $status = $value instanceof CustomRequestStatus
            ? $value
            : (is_string($value) ? CustomRequestStatus::tryFrom($value) : null);

        return $status?->label() ?? CustomRequestStatus::Baru->label();
    }
}
