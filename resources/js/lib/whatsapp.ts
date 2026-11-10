import { site } from '@/config/site';
import type { CustomRequestSummary, OrderSummary, Product } from '@/types';
import { formatPrice, formatRupiah } from '@/lib/format';

function formatIndoDate(isoDate: string): string {
    return new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'long',
    }).format(new Date(`${isoDate}T00:00:00`));
}

/**
 * Membuat tautan wa.me dengan pesan awal.
 * Tanpa nomor (VITE_WHATSAPP_NUMBER kosong) WhatsApp tetap terbuka dan
 * pengguna memilih kontak sendiri.
 */
export function whatsappUrl(message: string): string {
    const base = site.whatsappNumber
        ? `https://wa.me/${site.whatsappNumber}`
        : 'https://wa.me/';

    return `${base}?text=${encodeURIComponent(message)}`;
}

export const generalInquiryMessage = `Halo ${site.name}, saya ingin bertanya tentang rangkaian bunga.`;

export const customBouquetMessage = `Halo ${site.name}, saya ingin konsultasi buket custom.\n• Acara:\n• Warna/tema:\n• Anggaran:\n• Tanggal kebutuhan:`;

export function productOrderMessage(product: Product, note?: string): string {
    const lines = [
        `Halo ${site.name}, saya ingin memesan:`,
        `• Produk: ${product.name}`,
        `• Harga di katalog: ${formatPrice(product)}`,
    ];

    if (note) {
        lines.push(`• Catatan: ${note}`);
    }

    lines.push('Mohon info ketersediaan dan total harganya. Terima kasih.');

    return lines.join('\n');
}

/** Pesan WhatsApp lanjutan dari halaman konfirmasi pesanan (US-14). */
export function orderFollowUpMessage(order: OrderSummary): string {
    const lines = [
        `Halo ${site.name}, saya sudah mengirim pesanan nomor ${order.orderNumber}.`,
        `• Nama: ${order.customerName}`,
        `• Tanggal dibutuhkan: ${formatIndoDate(order.neededAt)}`,
    ];

    if (order.items.length > 0) {
        lines.push('• Rincian pesanan:');

        for (const item of order.items) {
            const amount =
                item.subtotal === null
                    ? 'Harga via WhatsApp'
                    : formatRupiah(item.subtotal);

            lines.push(`  - ${item.name} × ${item.quantity} (${amount})`);
        }
    }

    lines.push(
        order.totalAmount === null
            ? '• Total: dikonfirmasi admin'
            : `• Total: ${formatRupiah(order.totalAmount)}`,
    );
    lines.push('Mohon konfirmasi detail dan harganya. Terima kasih.');

    return lines.join('\n');
}

/** Pesan WhatsApp lanjutan dari halaman konfirmasi buket custom (US-15). */
export function customRequestFollowUpMessage(
    request: CustomRequestSummary,
): string {
    const lines = [
        `Halo ${site.name}, saya sudah mengirim permintaan buket custom nomor ${request.requestNumber}.`,
        `• Nama: ${request.customerName}`,
        ...(request.referenceProductName
            ? [`• Model acuan: ${request.referenceProductName}`]
            : []),
        `• Jenis buket: ${request.bouquetType}`,
        `• Anggaran: ${formatRupiah(request.budget)}`,
        `• Warna/tema: ${request.themeColor}`,
        `• Tanggal dibutuhkan: ${formatIndoDate(request.neededAt)}`,
    ];

    if (request.notes) {
        lines.push(`• Catatan: ${request.notes}`);
    }

    lines.push('Mohon info ketersediaan dan harganya. Terima kasih.');

    return lines.join('\n');
}
