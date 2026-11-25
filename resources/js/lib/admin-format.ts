/** Format tampilan panel admin (tanggal dan rupiah Indonesia). */

export function adminRupiah(amount: number | null): string {
    if (amount === null) {
        return 'Dikonfirmasi admin';
    }

    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(amount);
}

/** `YYYY-MM-DD` → "12 Nov 2026". */
export function adminDate(isoDate: string | null): string {
    if (!isoDate) {
        return '-';
    }

    return new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(
        new Date(`${isoDate.slice(0, 10)}T00:00:00`),
    );
}

/** ISO 8601 → "12 Nov 2026, 14.05". */
export function adminDateTime(isoDateTime: string | null): string {
    if (!isoDateTime) {
        return '-';
    }

    return new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(isoDateTime));
}

/** Tautan chat WhatsApp ke pelanggan (nomor format 628xxx). */
export function customerWhatsappUrl(phone: string, message = ''): string {
    const base = `https://wa.me/${phone.replace(/\D/g, '')}`;

    return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
