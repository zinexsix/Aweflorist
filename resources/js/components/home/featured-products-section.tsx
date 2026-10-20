import { Link } from '@inertiajs/react';
import { BrandButton } from '@/components/florify/brand-button';
import { EmptyState, Notice } from '@/components/florify/empty-state';
import { ProductGrid } from '@/components/florify/product-card';
import { Section, SectionHeading } from '@/components/florify/section';
import { site } from '@/config/site';
import { featuredProducts } from '@/data/products';
import { index as catalog } from '@/routes/catalog';

/** Pemilik: Latif. US-02 — produk unggulan di landing page. */
export function FeaturedProductsSection() {
    return (
        <Section id="produk" aria-labelledby="produk-title" flush>
            <SectionHeading
                id="produk-title"
                eyebrow="Produk unggulan"
                title="Pilihan favorit pelanggan"
                description="Beberapa rangkaian yang bisa langsung Anda pesan."
                action={
                    <BrandButton asChild variant="outline">
                        <Link href={catalog()}>Lihat semua produk</Link>
                    </BrandButton>
                }
            />
            {site.isSampleData && (
                <Notice className="mb-6">
                    Produk dan harga di bawah masih data contoh Sprint 1, belum
                    harga resmi {site.name}.
                </Notice>
            )}
            {featuredProducts.length > 0 ? (
                <ProductGrid products={featuredProducts} />
            ) : (
                <EmptyState
                    title="Produk unggulan belum tersedia"
                    description="Silakan lihat seluruh katalog kami."
                />
            )}
        </Section>
    );
}
