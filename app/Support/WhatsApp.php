<?php

namespace App\Support;

use App\Models\CustomRequest;
use App\Models\Order;
use App\Models\OrderItem;
use Carbon\CarbonInterface;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;

/**
 * Tautan wa.me yang dibuka otomatis setelah pesanan atau permintaan custom
 * tersimpan di database. Pelanggan tinggal menekan "Kirim" di WhatsApp.
 * Nomor tujuan: config('florify.whatsapp_number') (VITE_WHATSAPP_NUMBER di .env).
 */
class WhatsApp
{
    public static function url(string $message): string
    {
        $number = (string) config('florify.whatsapp_number');
        $base = $number === '' ? 'https://wa.me/' : "https://wa.me/{$number}";

        return $base.'?text='.rawurlencode($message);
    }

    /**
     * Pesan untuk pesanan produk katalog (US-13).
     */
    public static function orderMessage(Order $order): string
    {
        $order->loadMissing(['customer', 'items.product']);

        $lines = [
            'Halo '.config('app.name').', saya baru mengirim pesanan nomor *'.$order->order_number.'*.',
            '• Nama: '.$order->customer->name,
            '• Tanggal dibutuhkan: '.self::date($order->needed_at),
        ];

        $priceFrom = false;

        foreach ($order->items as $item) {
            /** @var OrderItem $item */
            $priceFrom = $priceFrom || (bool) $item->product?->price_from;
            $amount = $item->subtotal === null ? 'harga dikonfirmasi admin' : self::rupiah($item->subtotal);
            $lines[] = '• Produk: '.$item->product_name_snapshot.' × '.$item->quantity.' ('.$amount.')';
        }

        if ($order->notes) {
            $lines[] = '• Catatan: '.$order->notes;
        }

        $lines[] = match (true) {
            $order->total_amount === null => '• Total: dikonfirmasi admin',
            $priceFrom => '• Total: mulai '.self::rupiah($order->total_amount).' (dikonfirmasi admin)',
            default => '• Total: '.self::rupiah($order->total_amount),
        };
        $lines[] = 'Detail pesanan: '.URL::signedRoute('orders.confirmation', $order);
        $lines[] = 'Mohon konfirmasi ketersediaan dan cara pembayarannya. Terima kasih.';

        return implode("\n", $lines);
    }

    /**
     * Pesan untuk permintaan buket custom (US-15, US-16).
     */
    public static function customRequestMessage(CustomRequest $customRequest): string
    {
        $customRequest->loadMissing(['customer', 'product']);

        $lines = [
            'Halo '.config('app.name').', saya baru mengirim permintaan buket custom nomor *'.$customRequest->request_number.'*.',
            '• Nama: '.$customRequest->customer->name,
            '• Jenis buket: '.$customRequest->bouquet_type,
            '• Anggaran: '.self::rupiah($customRequest->budget),
            '• Warna/tema: '.$customRequest->theme_color,
            '• Tanggal dibutuhkan: '.self::date($customRequest->needed_at),
        ];

        if ($customRequest->product !== null) {
            $lines[] = '• Model acuan: '.$customRequest->product->name;
        }

        if ($customRequest->reference_image_path !== null) {
            $lines[] = '• Gambar referensi: '.Storage::disk('public')->url($customRequest->reference_image_path);
        }

        if ($customRequest->notes) {
            $lines[] = '• Catatan: '.$customRequest->notes;
        }

        $lines[] = 'Detail permintaan: '.URL::signedRoute('custom.confirmation', $customRequest);
        $lines[] = 'Mohon dicek dan disetujui. Terima kasih.';

        return implode("\n", $lines);
    }

    private static function rupiah(mixed $amount): string
    {
        return 'Rp'.number_format((float) $amount, 0, ',', '.');
    }

    private static function date(mixed $date): string
    {
        return $date instanceof CarbonInterface
            ? $date->locale('id')->translatedFormat('j F Y')
            : (string) $date;
    }
}
