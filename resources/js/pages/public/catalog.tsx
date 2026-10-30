import { Head, Link } from '@inertiajs/react';
import { BrandButton } from '@/components/florify/brand-button';
import { EmptyState, Notice } from '@/components/florify/empty-state';
import { PageHeader } from '@/components/florify/page-header';
import { ProductGrid } from '@/components/florify/product-card';
import { Section } from '@/components/florify/section';
import { site } from '@/config/site';
import { home } from '@/routes';
import { index as catalog } from '@/routes/catalog';
import type { Occasion, Product, ProductCategory } from '@/types';

type CatalogProps = {
    products: Product[];
    categories: ProductCategory[];
    occasions: Occasion[];
    filters: {
        kategori: string | null;
        acara: string | null;
        q: string | null;
    };
};

/**
 * Halaman katalog (pemilik: Latif). US-04, US-05, US-10.
 * Produk sudah difilter server: /katalog?kategori=buket-uang atau ?acara=wisuda.
 * TODO Latif (US-11): chip filter kategori dan pencarian nama (FR-07).
 */
export default function Catalog({
    products,
    categories,
    occasions,
    filters,
}: CatalogProps) {
    const category = categories.find((item) => item.slug === filters.kategori);
    const occasion = occasions.find((item) => item.slug === filters.acara);
    const activeFilter = category?.name ?? occasion?.name;

    return (
        <>
            <Head title="Katalog" />
            <PageHeader
                breadcrumbs={[
                    { label: 'Beranda', href: home.url() },
                    { label: 'Katalog' },
                ]}
                title={
                    activeFilter ? `Katalog · ${activeFilter}` : 'Katalog Bunga'
                }
                description="Pilih rangkaian sesuai momen. Klik produk untuk melihat detail, lalu pesan langsung lewat WhatsApp."
            />
            <Section flush aria-label="Daftar produk">
                {site.isSampleData && (
                    <Notice className="mb-6">
                        Produk dan harga masih data contoh Sprint 1, belum harga
                        resmi {site.name}.
                    </Notice>
                )}
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                    <p
                        className="text-[0.9375rem] text-ink-muted"
                        aria-live="polite"
                    >
                        Menampilkan {products.length} produk
                        {activeFilter && ` untuk ${activeFilter}`}
                    </p>
                    {activeFilter && (
                        <BrandButton asChild variant="outline">
                            <Link href={catalog()}>Tampilkan semua</Link>
                        </BrandButton>
                    )}
                </div>
                {products.length > 0 ? (
                    <ProductGrid products={products} />
                ) : (
                    <EmptyState
                        title="Produk belum tersedia"
                        description="Belum ada produk untuk pilihan ini. Coba lihat seluruh katalog."
                        action={
                            <BrandButton asChild>
                                <Link href={catalog()}>Lihat semua produk</Link>
                            </BrandButton>
                        }
                    />
                )}
            </Section>
        </>
    );
}
