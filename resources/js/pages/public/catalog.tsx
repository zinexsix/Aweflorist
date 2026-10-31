import { Head, Link } from '@inertiajs/react';
import { BrandButton } from '@/components/florify/brand-button';
import { EmptyState, Notice } from '@/components/florify/empty-state';
import { FormField } from '@/components/florify/form-field';
import { PageHeader } from '@/components/florify/page-header';
import { ProductGrid } from '@/components/florify/product-card';
import { Section } from '@/components/florify/section';
import { site } from '@/config/site';
import { home } from '@/routes';
import { index as catalog } from '@/routes/catalog';
import type { Occasion, Product, ProductCategory } from '@/types';

type CatalogFilters = {
    kategori: string | null;
    acara: string | null;
    q: string | null;
};

type CatalogProps = {
    products: Product[];
    categories: ProductCategory[];
    occasions: Occasion[];
    filters: CatalogFilters;
};

/** URL katalog yang hanya membawa filter yang terisi. */
function catalogUrl(filters: Partial<CatalogFilters>): string {
    const query: Record<string, string> = {};

    for (const [key, value] of Object.entries(filters)) {
        if (value) {
            query[key] = value;
        }
    }

    return catalog.url({ query });
}

/**
 * Halaman katalog (pemilik: Latif). US-04, US-05, US-10, US-11.
 * Produk difilter server lewat ?kategori=, ?acara=, dan pencarian nama ?q=.
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
    const hasFilter = Boolean(filters.kategori || filters.acara || filters.q);

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
                <form
                    method="get"
                    action={catalog.url()}
                    role="search"
                    className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end"
                >
                    {filters.kategori && (
                        <input
                            type="hidden"
                            name="kategori"
                            value={filters.kategori}
                        />
                    )}
                    {filters.acara && (
                        <input
                            type="hidden"
                            name="acara"
                            value={filters.acara}
                        />
                    )}
                    <FormField label="Cari produk" className="flex-1">
                        {(field) => (
                            <input
                                {...field}
                                type="search"
                                name="q"
                                defaultValue={filters.q ?? ''}
                                maxLength={100}
                                placeholder="Contoh: mawar"
                            />
                        )}
                    </FormField>
                    <BrandButton type="submit" size="lg">
                        Cari
                    </BrandButton>
                </form>
                <nav
                    aria-label="Filter kategori"
                    className="mb-6 flex flex-wrap gap-2"
                >
                    <BrandButton
                        asChild
                        variant={filters.kategori ? 'outline' : 'primary'}
                    >
                        <Link
                            href={catalogUrl({
                                acara: filters.acara,
                                q: filters.q,
                            })}
                            aria-current={filters.kategori ? undefined : 'true'}
                        >
                            Semua
                        </Link>
                    </BrandButton>
                    {categories.map((item) => {
                        const active = item.slug === filters.kategori;

                        return (
                            <BrandButton
                                key={item.slug}
                                asChild
                                variant={active ? 'primary' : 'outline'}
                            >
                                <Link
                                    href={catalogUrl({
                                        kategori: item.slug,
                                        acara: filters.acara,
                                        q: filters.q,
                                    })}
                                    aria-current={active ? 'true' : undefined}
                                >
                                    {item.name}
                                </Link>
                            </BrandButton>
                        );
                    })}
                </nav>
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                    <p
                        className="text-[0.9375rem] text-ink-muted"
                        aria-live="polite"
                    >
                        Menampilkan {products.length} produk
                        {activeFilter && ` untuk ${activeFilter}`}
                        {filters.q && ` dengan kata "${filters.q}"`}
                    </p>
                    {hasFilter && (
                        <BrandButton asChild variant="outline">
                            <Link href={catalog()}>Tampilkan semua</Link>
                        </BrandButton>
                    )}
                </div>
                {products.length > 0 ? (
                    <ProductGrid products={products} />
                ) : (
                    <EmptyState
                        title={
                            filters.q
                                ? `Tidak ada produk untuk "${filters.q}"`
                                : 'Produk belum tersedia'
                        }
                        description="Coba kata lain atau lihat seluruh katalog."
                        action={
                            <BrandButton asChild>
                                <Link href={catalog()}>Tampilkan semua</Link>
                            </BrandButton>
                        }
                    />
                )}
            </Section>
        </>
    );
}
