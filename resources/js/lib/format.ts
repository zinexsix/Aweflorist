import type { Product } from '@/types';

const rupiah = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
});

export function formatPrice(
    product: Pick<Product, 'price' | 'priceFrom'>,
): string {
    if (product.price === null) {
        return 'Harga via WhatsApp';
    }

    const amount = rupiah.format(product.price);

    return product.priceFrom ? `Mulai ${amount}` : amount;
}
