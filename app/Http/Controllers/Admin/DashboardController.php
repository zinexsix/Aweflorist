<?php

namespace App\Http\Controllers\Admin;

use App\Enums\CustomRequestApproval;
use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Http\Controllers\Controller;
use App\Models\CustomRequest;
use App\Models\Order;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Dashboard ringkas dan daftar tindak lanjut (US-23).
 * Angka di sini sama dengan hasil filter di daftar pesanan (US-21).
 */
class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        $countsByStatus = Order::query()
            ->selectRaw('order_status, COUNT(*) as total')
            ->groupBy('order_status')
            ->pluck('total', 'order_status');

        $followUps = Order::query()
            ->needsFollowUp()
            ->with(['customer:id,name,phone', 'items:id,order_id,product_name_snapshot,quantity'])
            ->orderBy('needed_at')
            ->orderBy('id')
            ->limit(5)
            ->get();

        return Inertia::render('admin/dashboard', [
            'stats' => [
                'ordersByStatus' => array_map(fn (OrderStatus $status): array => [
                    'value' => $status->value,
                    'label' => $status->label(),
                    'count' => (int) ($countsByStatus[$status->value] ?? 0),
                ], OrderStatus::cases()),
                'needsFollowUp' => Order::query()->needsFollowUp()->count(),
                'unpaid' => Order::query()
                    ->whereIn('payment_status', [PaymentStatus::BelumDibayar, PaymentStatus::Dp])
                    ->where('order_status', '!=', OrderStatus::Dibatalkan)
                    ->count(),
                'customPending' => CustomRequest::query()
                    ->where('approval_status', CustomRequestApproval::Menunggu)
                    ->count(),
                'ordersThisMonth' => Order::query()
                    ->where('created_at', '>=', now()->startOfMonth())
                    ->count(),
            ],
            'followUps' => $followUps->map(fn (Order $order): array => OrderController::row($order))->all(),
            // Halaman kelola buket custom dibuat di US-24; tautan aktif otomatis setelah rutenya ada.
            'customRequestsUrl' => Route::has('admin.custom-requests.index')
                ? route('admin.custom-requests.index', ['persetujuan' => CustomRequestApproval::Menunggu->value])
                : null,
        ]);
    }
}
