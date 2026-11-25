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
export type AdminOrderRow = {
    orderNumber: string;
    /** ISO 8601 */
    createdAt: string | null;
    /** YYYY-MM-DD */
    neededAt: string | null;
    customerName: string;
    customerPhone: string;
    itemsSummary: string;
    /** `null` = harga dikonfirmasi admin */
    totalAmount: number | null;
    status: Option;
    paymentStatus: Option;
};

export type AdminOrderItem = {
    id: number;
    name: string;
    unitPrice: number | null;
    quantity: number;
    subtotal: number | null;
    productSlug: string | null;
    productActive: boolean | null;
};

export type AdminOrderDetail = {
    orderNumber: string;
    createdAt: string | null;
    neededAt: string | null;
    notes: string | null;
    totalAmount: number | null;
    status: Option;
    paymentStatus: Option;
    needsFollowUp: boolean;
    customer: {
        id: number;
        name: string;
        phone: string;
        email: string | null;
    };
    items: AdminOrderItem[];
};

// US-22 Nabila: status pesanan

// US-23 Suci: dashboard
export type AdminDashboardStats = {
    ordersByStatus: (Option & { count: number })[];
    needsFollowUp: number;
    unpaid: number;
    customPending: number;
    ordersThisMonth: number;
};

// US-24 Prety: permintaan custom

// US-25 Prety: stok

// US-26 Nabila: pembayaran

// US-27 Nabila: pelanggan
