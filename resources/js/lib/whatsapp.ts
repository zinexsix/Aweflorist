import { site } from '@/config/site';
import type { Product } from '@/types';
import { formatPrice, formatRupiah } from '@/lib/format';

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

export type CustomRequest = {
    /** Nama produk/model acuan (opsional), mis. dari halaman detail. */
    reference?: string;
    bouquetType: string;
    budget: number;
    themeColor: string;
    neededAt: string; // YYYY-MM-DD
    notes: string;
};

/** Pesan WhatsApp dari formulir buket custom (/buket-custom). */
export function customRequestMessage(request: CustomRequest): string {
    const date = new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'long',
    }).format(new Date(`${request.neededAt}T00:00:00`));

    const lines = [
        `Halo ${site.name}, saya ingin memesan buket custom:`,
        ...(request.reference ? [`• Model acuan: ${request.reference}`] : []),
        `• Jenis buket: ${request.bouquetType}`,
        `• Anggaran: ${formatRupiah(request.budget)}`,
        `• Warna/tema: ${request.themeColor}`,
        `• Tanggal dibutuhkan: ${date}`,
    ];

    if (request.notes) {
        lines.push(`• Catatan: ${request.notes}`);
    }

    lines.push('Mohon info ketersediaan dan harga akhirnya. Terima kasih.');

    return lines.join('\n');
}
