<?php

namespace App\Http\Controllers\Public;

use App\Enums\CustomRequestStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Public\StoreCustomRequestRequest;
use App\Models\Customer;
use App\Models\CustomRequest;
use App\Models\Product;
use App\Support\BouquetTypes;
use App\Support\ReferenceNumber;
use DateTimeInterface;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

/**
 * Permintaan buket custom (US-15): formulir, penyimpanan, dan konfirmasi.
 * Permintaan custom belum menjadi pesanan final sampai detail dan harga
 * disepakati admin dan pelanggan (PRD §6 no.6).
 */
class CustomRequestController extends Controller
{
    /**
     * Formulir buket custom. ?produk=<slug> mengisi "model acuan" dari halaman detail.
     */
    public function create(Request $request): Response
    {
        $reference = $request->filled('produk')
            ? Product::active()->where('slug', $request->string('produk')->toString())->first()
            : null;

        return Inertia::render('public/custom-bouquet', [
            'bouquetTypes' => BouquetTypes::all(),
            'reference' => $reference === null ? null : [
                'slug' => $reference->slug,
                'name' => $reference->name,
            ],
        ]);
    }

    /**
     * Simpan permintaan lalu arahkan ke halaman konfirmasi bertanda tangan.
     */
    public function store(StoreCustomRequestRequest $request): RedirectResponse
    {
        $data = $request->validated();

        // Nama file dibuat acak oleh Laravel, bukan memakai nama asli dari pelanggan (US-16).
        $imagePath = $request->file('reference_image')?->store('custom-references', 'public') ?: null;

        try {
            $customRequest = $this->saveRequest($data, $imagePath);
        } catch (Throwable $exception) {
            if ($imagePath !== null) {
                Storage::disk('public')->delete($imagePath);
            }

            throw $exception;
        }

        return redirect()->to(URL::signedRoute('custom.confirmation', $customRequest));
    }

    /**
     * Simpan customer dan permintaan dalam satu transaksi.
     *
     * @param  array<string, mixed>  $data
     */
    private function saveRequest(array $data, ?string $imagePath): CustomRequest
    {
        return DB::transaction(function () use ($data, $imagePath): CustomRequest {
            // Nomor yang sama memakai customer yang sudah ada; nama lama tidak ditimpa.
            $customer = Customer::query()->firstOrCreate(
                ['phone' => Customer::normalizePhone((string) $data['phone'])],
                ['name' => (string) $data['name']],
            );

            $productId = empty($data['product'])
                ? null
                : Product::query()->where('slug', $data['product'])->value('id');

            return CustomRequest::query()->create([
                'request_number' => ReferenceNumber::generate('CST', CustomRequest::class, 'request_number'),
                'customer_id' => $customer->getKey(),
                'product_id' => $productId,
                'budget' => (int) $data['budget'],
                'theme_color' => (string) $data['theme_color'],
                'bouquet_type' => (string) $data['bouquet_type'],
                'needed_at' => (string) $data['needed_at'],
                'reference_image_path' => $imagePath,
                'notes' => $data['notes'] ?? null,
                'status' => CustomRequestStatus::Baru,
            ]);
        });
    }

    /**
     * Halaman konfirmasi. Rute memakai middleware "signed" supaya data pelanggan tidak bisa ditebak.
     */
    public function confirmation(CustomRequest $customRequest): Response
    {
        $customRequest->load(['customer', 'product']);

        return Inertia::render('public/custom-confirmation', [
            'customRequest' => [
                'requestNumber' => $customRequest->request_number,
                'customerName' => $customRequest->customer->name,
                'bouquetType' => $customRequest->bouquet_type,
                'budget' => (int) $customRequest->budget,
                'themeColor' => $customRequest->theme_color,
                'neededAt' => $this->dateValue($customRequest->needed_at),
                'notes' => $customRequest->notes,
                'referenceProductName' => $customRequest->product?->name,
                'hasReferenceImage' => $customRequest->reference_image_path !== null,
                'statusLabel' => $this->statusLabel($customRequest->status),
            ],
        ]);
    }

    /**
     * Tanggal dari cast model bisa berupa objek tanggal atau teks mentah.
     */
    private function dateValue(mixed $value): string
    {
        if ($value instanceof DateTimeInterface) {
            return $value->format('Y-m-d');
        }

        return is_string($value) ? substr($value, 0, 10) : '';
    }

    private function statusLabel(mixed $value): string
    {
        if ($value instanceof CustomRequestStatus) {
            return $value->label();
        }

        return is_string($value)
            ? (CustomRequestStatus::tryFrom($value)?->label() ?? $value)
            : '';
    }
}
