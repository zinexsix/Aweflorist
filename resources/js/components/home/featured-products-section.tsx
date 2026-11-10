import { Link } from '@inertiajs/react';
import { BrandButton } from '@/components/florify/brand-button';
import { EmptyState } from '@/components/florify/empty-state';
import { ProductGrid } from '@/components/florify/product-card';
import { Section, SectionHeading } from '@/components/florify/section';
import { index as catalog } from '@/routes/catalog';
import type { Product } from '@/types';

/** Pemilik: Latif. US-02, US-10 — produk unggulan dari server. */
export function FeaturedProductsSection({ products }: { products: Product[] }) {
    return (
        <Section id="produk" aria-labelledby="produk-title" flush>
            <SectionHeading
                id="produk-title"
                eyebrow="Produk unggulan"
                title="Buket sorotan"
                description="Pilihan mulai Rp100.000 yang bisa langsung Anda pesan."
                action={
                    <BrandButton asChild variant="outline">
                        <Link href={catalog()}>Lihat semua produk</Link>
                    </BrandButton>
                }
            />
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
