/**
 * Kontrak data halaman publik Florify.
 * Bentuknya mengikuti rancangan tabel di PRD bagian 9 (products, categories,
 * events) supaya mudah dipindah ke basis data pada Sprint 2.
 */

export type ProductCategorySlug = string;

export type OccasionSlug = string;

export type ProductCategory = {
    slug: ProductCategorySlug;
    name: string;
};

export type Occasion = {
    slug: OccasionSlug;
    name: string;
    description: string;
};

export type Product = {
    slug: string;
    name: string;
    category: ProductCategorySlug;
    occasions: OccasionSlug[];
    description: string;
    /** Harga dalam rupiah. `null` = harga dikonfirmasi admin via WhatsApp. */
    price: number | null;
    /** Tampilkan "Mulai dari" sebelum harga. */
    priceFrom?: boolean;
    /** Path dari folder public, mis. '/images/products/buket-mawar-merah-01.webp'. `null` = pakai placeholder. */
    image: string | null;
    featured?: boolean;
};

export type FaqItem = {
    question: string;
    answer: string;
};

export type OrderStep = {
    title: string;
    description: string;
};

export type Tone = 'blush' | 'cream' | 'sun' | 'sage' | 'lilac';

export type OrderSummary = {
    orderNumber: string;
    customerName: string;
    /** Nomor WhatsApp tersamar, mis. "6281****6789". */
    customerPhoneMasked: string;
    /** Tanggal dibutuhkan, format YYYY-MM-DD. */
    neededAt: string;
    notes: string | null;
    statusLabel: string;
    paymentStatusLabel: string;
    items: {
        name: string;
        quantity: number;
        unitPrice: number | null;
        subtotal: number | null;
    }[];
    /** `null` jika ada item berharga "via WhatsApp". */
    totalAmount: number | null;
    /** ISO 8601. */
    createdAt: string;
};

export type CustomRequestSummary = {
    requestNumber: string;
    customerName: string;
    bouquetType: string;
    budget: number;
    themeColor: string;
    /** Tanggal dibutuhkan, format YYYY-MM-DD. */
    neededAt: string;
    notes: string | null;
    referenceProductName: string | null;
    hasReferenceImage: boolean;
    statusLabel: string;
};
