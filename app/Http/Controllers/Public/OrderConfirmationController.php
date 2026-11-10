<?php

namespace App\Http\Controllers\Public;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Http\Controllers\Controller;
use App\Models\Order;
use DateTimeInterface;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Halaman konfirmasi pesanan produk (US-14).
 * Rute memakai middleware "signed" supaya data pelanggan tidak bisa ditebak.
 */
class OrderConfirmationController extends Controller
{
    public function __invoke(Order $order): Response
    {
        $order->load(['customer', 'items']);

        return Inertia::render('public/order-confirmation', [
            'order' => [
                'orderNumber' => $order->order_number,
                'customerName' => $order->customer->name,
                'customerPhoneMasked' => $this->maskPhone($order->customer->phone),
                'neededAt' => $this->dateValue($order->needed_at),
                'notes' => $order->notes,
                'statusLabel' => $this->orderStatusLabel($order->order_status),
                'paymentStatusLabel' => $this->paymentStatusLabel($order->payment_status),
                'items' => $order->items->map(fn ($item): array => [
                    'name' => $item->product_name_snapshot,
                    'quantity' => $item->quantity,
                    'unitPrice' => $item->unit_price_snapshot === null
                        ? null
                        : (int) $item->unit_price_snapshot,
                    'subtotal' => $item->subtotal === null
                        ? null
                        : (int) $item->subtotal,
                ])->all(),
                'totalAmount' => $order->total_amount === null
                    ? null
                    : (int) $order->total_amount,
                'createdAt' => $order->created_at?->toIso8601String()
                    ?? now()->toIso8601String(),
            ],
        ]);
    }

    /**
     * Samarkan nomor WhatsApp: 4 digit awal + **** + 4 digit akhir.
     */
    private function maskPhone(string $phone): string
    {
        if (strlen($phone) <= 8) {
            return '****';
        }

        return substr($phone, 0, 4).'****'.substr($phone, -4);
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

    private function orderStatusLabel(mixed $value): string
    {
        if ($value instanceof OrderStatus) {
            return $value->label();
        }

        return is_string($value)
            ? (OrderStatus::tryFrom($value)?->label() ?? $value)
            : '';
    }

    private function paymentStatusLabel(mixed $value): string
    {
        if ($value instanceof PaymentStatus) {
            return $value->label();
        }

        return is_string($value)
            ? (PaymentStatus::tryFrom($value)?->label() ?? $value)
            : '';
    }
}
