<?php

namespace App\Http\Controllers\Admin;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderItem;
use App\Support\EnumOptions;
use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Daftar dan detail pesanan di panel admin (US-21).
 * Status pesanan diubah di US-22, pembayaran dicatat di US-26.
 */
class OrderController extends Controller
{
    public function index(Request $request): Response
    {
        $q = mb_substr(trim($request->string('q')->toString()), 0, 100);
        $q = $q === '' ? null : $q;

        $status = OrderStatus::tryFrom($request->string('status')->toString());
        $paymentStatus = PaymentStatus::tryFrom($request->string('pembayaran')->toString());
        $followUp = $request->boolean('tindak_lanjut');

        $orders = Order::query()
            ->with(['customer:id,name,phone', 'items:id,order_id,product_name_snapshot,quantity'])
            ->when($q !== null, fn (Builder $query) => $this->search($query, $q))
            ->when($status !== null, fn (Builder $query) => $query->where('order_status', $status))
            ->when($paymentStatus !== null, fn (Builder $query) => $query->where('payment_status', $paymentStatus))
            ->when($followUp, fn (Builder $query) => $query->needsFollowUp())
            ->latest()
            ->latest('id')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/orders/index', [
            'orders' => [
                'data' => $orders->getCollection()->map(fn (Order $order): array => self::row($order))->all(),
                'links' => $orders->toArray()['links'],
                'from' => $orders->firstItem(),
                'to' => $orders->lastItem(),
                'total' => $orders->total(),
            ],
            'statuses' => EnumOptions::from(OrderStatus::class),
            'paymentStatuses' => EnumOptions::from(PaymentStatus::class),
            'filters' => [
                'q' => $q ?? '',
                'status' => $status->value ?? '',
                'pembayaran' => $paymentStatus->value ?? '',
                'tindak_lanjut' => $followUp,
            ],
        ]);
    }

    public function show(Order $order): Response
    {
        $order->load(['customer', 'items.product:id,slug,is_active']);

        return Inertia::render('admin/orders/show', [
            'order' => [
                'orderNumber' => $order->order_number,
                'createdAt' => $order->created_at?->toIso8601String(),
                'neededAt' => self::date($order->needed_at),
                'notes' => $order->notes,
                'totalAmount' => self::money($order->total_amount),
                'status' => self::option($order->order_status),
                'paymentStatus' => self::option($order->payment_status),
                'needsFollowUp' => Order::query()->whereKey($order->getKey())->needsFollowUp()->exists(),
                'customer' => [
                    'id' => $order->customer->id,
                    'name' => $order->customer->name,
                    'phone' => $order->customer->phone,
                    'email' => $order->customer->email,
                ],
                'items' => $order->items->map(fn (OrderItem $item): array => [
                    'id' => $item->id,
                    'name' => $item->product_name_snapshot,
                    'unitPrice' => self::money($item->unit_price_snapshot),
                    'quantity' => $item->quantity,
                    'subtotal' => self::money($item->subtotal),
                    'productSlug' => $item->product?->slug,
                    'productActive' => $item->product?->is_active,
                ])->all(),
            ],
            'statuses' => EnumOptions::from(OrderStatus::class),
        ]);
    }

    /**
     * Baris tabel daftar pesanan; dipakai juga oleh dashboard (US-23).
     *
     * @return array<string, mixed>
     */
    public static function row(Order $order): array
    {
        $first = $order->items->first();
        $more = $order->items->count() - 1;

        return [
            'orderNumber' => $order->order_number,
            'createdAt' => $order->created_at?->toIso8601String(),
            'neededAt' => self::date($order->needed_at),
            'customerName' => $order->customer->name,
            'customerPhone' => $order->customer->phone,
            'itemsSummary' => $first === null
                ? '-'
                : $first->product_name_snapshot.' × '.$first->quantity.($more > 0 ? " (+{$more} lainnya)" : ''),
            'totalAmount' => self::money($order->total_amount),
            'status' => self::option($order->order_status),
            'paymentStatus' => self::option($order->payment_status),
        ];
    }

    /**
     * Cari berdasarkan nomor pesanan, nama pelanggan, atau nomor HP (0812… maupun 62812…).
     *
     * @param  Builder<Order>  $query
     */
    private function search(Builder $query, string $q): void
    {
        $like = '%'.addcslashes($q, '%_\\').'%';
        $digits = (string) preg_replace('/\D/', '', $q);

        $query->where(function (Builder $query) use ($like, $digits): void {
            $query->where('order_number', 'like', $like)
                ->orWhereHas('customer', function (Builder $customer) use ($like, $digits): void {
                    $customer->where('name', 'like', $like);

                    if (strlen($digits) >= 4) {
                        $customer->orWhere('phone', 'like', '%'.Customer::normalizePhone($digits).'%');
                    }
                });
        });
    }

    /**
     * @return array{value: string, label: string}
     */
    private static function option(mixed $status): array
    {
        return $status instanceof OrderStatus || $status instanceof PaymentStatus
            ? ['value' => $status->value, 'label' => $status->label()]
            : ['value' => (string) $status, 'label' => (string) $status];
    }

    private static function money(mixed $amount): ?int
    {
        return $amount === null ? null : (int) $amount;
    }

    private static function date(mixed $date): ?string
    {
        return $date instanceof CarbonInterface ? $date->toDateString() : null;
    }
}
