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

// US-20 Latif: kategori & acara
export type AdminCategoryRow = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    productsCount: number;
    isPriceCategory: boolean;
};

export type AdminEventRow = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    productsCount: number;
};

// US-21 Suci: pesanan

// US-22 Nabila: status pesanan

// US-23 Suci: dashboard

// US-24 Prety: permintaan custom
export type AdminCustomRequestRow = {
    id: number;
    requestNumber: string;
    customerName: string;
    bouquetType: string;
    budget: number;
    neededAt: string;
    createdAt: string;
    approvalStatus: string;
    approvalLabel: string;
};

export type AdminCustomRequestDetail = {
    requestNumber: string;
    customerName: string;
    customerPhone: string;
    customerEmail: string | null;
    whatsappUrl: string;
    bouquetType: string;
    budget: number;
    themeColor: string;
    neededAt: string;
    notes: string | null;
    productName: string | null;
    referenceImageUrl: string | null;
    status: string;
    statusLabel: string;
    approvalStatus: string;
    approvalLabel: string;
    approvedAt: string | null;
    approvalNote: string | null;
};

// US-25 Prety: stok
export type AdminStockRow = {
    id: number;
    name: string;
    category: string;
    stock: number | null;
    isActive: boolean;
};

export type AdminStockMovement = {
    id: number;
    productName: string;
    userName: string | null;
    quantityChange: number;
    stockAfter: number;
    reason: string;
    createdAt: string;
};

// US-26 Nabila: pembayaran

// US-27 Nabila: pelanggan
