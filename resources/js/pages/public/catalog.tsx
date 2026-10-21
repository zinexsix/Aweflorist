import { Head, Link, usePage } from '@inertiajs/react';
import { BrandButton } from '@/components/florify/brand-button';
import { EmptyState, Notice } from '@/components/florify/empty-state';
import { PageHeader } from '@/components/florify/page-header';
import { ProductGrid } from '@/components/florify/product-card';
import { Section } from '@/components/florify/section';
import { site } from '@/config/site';
import { categories, occasions } from '@/data/catalog';
import { products } from '@/data/products';
import { home } from '@/routes';
import { index as catalog } from '@/routes/catalog';

/**
 * Halaman katalog (pemilik: Latif). US-04, US-05.
 * Sudah mendukung filter lewat URL: /katalog?kategori=buket-uang atau ?acara=wisuda.
 * TODO Latif: chip filter kategori, pencarian nama (FR-07), urutan harga.
 */
export default function Catalog() {
    const { url } = usePage();
    const params = new URLSearchParams(url.split('?')[1] ?? '');
    const category = categories.find(
        (item) => item.slug === params.get('kategori'),
    );
    const occasion = occasions.find(
        (item) => item.slug === params.get('acara'),
    );

    const visibleProducts = products.filter(
        (product) =>
            (!category || product.category === category.slug) &&
            (!occasion || product.occasions.includes(occasion.slug)),
    );

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
                        Menampilkan {visibleProducts.length} produk
                        {activeFilter && ` untuk ${activeFilter}`}
                    </p>
                    {activeFilter && (
                        <BrandButton asChild variant="outline">
                            <Link href={catalog()}>Tampilkan semua</Link>
                        </BrandButton>
                    )}
                </div>
                {visibleProducts.length > 0 ? (
                    <ProductGrid products={visibleProducts} />
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
