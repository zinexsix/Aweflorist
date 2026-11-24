export type Option = {
    value: string;
    label: string;
};

export type Paginated<T> = {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
    from: number | null;
    to: number | null;
    total: number;
};

// US-19 Latif: produk

// US-20 Latif: kategori & acara

// US-21 Suci: pesanan

// US-22 Nabila: status pesanan

// US-23 Suci: dashboard

// US-24 Prety: permintaan custom

// US-25 Prety: stok

// US-26 Nabila: pembayaran

// US-27 Nabila: pelanggan

// US-19 Latif: produk
export type AdminProductRow = {
    id: number;
    name: string;
    slug: string;
    category: string;
    price: number | null;
    priceFrom: boolean;
    image: string | null;
    isActive: boolean;
    isFeatured: boolean;
    canDelete: boolean;
};

export type AdminProductForm = {
    id: number;
    name: string;
    slug: string;
    category_id: string;
    description: string;
    price: string | null;
    price_from: boolean;
    image: string | null;
    is_featured: boolean;
    is_active: boolean;
    occasions: string[];
};
