import { Link } from '@inertiajs/react';
import { BrandButton } from '@/components/florify/brand-button';
import { EmptyState, Notice } from '@/components/florify/empty-state';
import { ProductGrid } from '@/components/florify/product-card';
import { Section, SectionHeading } from '@/components/florify/section';
import { site } from '@/config/site';
import { index as catalog } from '@/routes/catalog';
import type { Product } from '@/types';

/** Pemilik: Latif. US-02, US-10 — produk unggulan dari server. */
export function FeaturedProductsSection({ products }: { products: Product[] }) {
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
            {products.length > 0 ? (
                <ProductGrid products={products} />
            ) : (
                <EmptyState
                    title="Produk unggulan belum tersedia"
                    description="Silakan lihat seluruh katalog kami."
                />
            )}
        </Section>
    );
}
