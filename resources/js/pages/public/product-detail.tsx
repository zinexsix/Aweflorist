import { Head, Link } from '@inertiajs/react';
import { BrandButton } from '@/components/florify/brand-button';
import { EmptyState } from '@/components/florify/empty-state';
import { PageHeader } from '@/components/florify/page-header';
import { ProductGrid } from '@/components/florify/product-card';
import { ProductImage } from '@/components/florify/product-image';
import { CategoryBadge, PriceLabel } from '@/components/florify/product-meta';
import { Section, SectionHeading } from '@/components/florify/section';
import { WhatsAppButton } from '@/components/florify/whatsapp-button';
import { categoryName } from '@/data/catalog';
import { findProduct, products } from '@/data/products';
import { productOrderMessage } from '@/lib/whatsapp';
import { home } from '@/routes';
import { index as catalog } from '@/routes/catalog';

/**
 * Halaman detail produk (pemilik: Latif). US-06, US-07.
 * TODO Latif: galeri beberapa foto, kolom catatan kartu ucapan yang ikut
 * masuk ke pesan WhatsApp (lihat doc/florify-html/detail.html).
 */
export default function ProductDetail({ slug }: { slug: string }) {
    const product = findProduct(slug);

    if (!product) {
        return (
            <>
                <Head title="Produk tidak ditemukan" />
                <PageHeader
                    breadcrumbs={[
                        { label: 'Beranda', href: home.url() },
                        { label: 'Katalog', href: catalog.url() },
                        { label: 'Tidak ditemukan' },
                    ]}
                />
                <Section flush aria-label="Produk tidak ditemukan">
                    <EmptyState
                        title="Produk tidak ditemukan"
                        description="Produk mungkin sudah tidak tersedia atau alamatnya salah."
                        action={
                            <BrandButton asChild>
                                <Link href={catalog()}>Kembali ke katalog</Link>
                            </BrandButton>
                        }
                    />
                </Section>
            </>
        );
    }

    const related = products
        .filter(
            (item) =>
                item.slug !== product.slug &&
                item.category === product.category,
        )
        .slice(0, 3);

    return (
        <>
            <Head title={product.name} />
            <PageHeader
                breadcrumbs={[
                    { label: 'Beranda', href: home.url() },
                    { label: 'Katalog', href: catalog.url() },
                    { label: product.name },
                ]}
            />
            <Section flush aria-labelledby="produk-nama">
                <div className="grid gap-8 md:grid-cols-2 lg:gap-14">
                    <ProductImage
                        src={product.image}
                        alt={product.name}
                        priority
                        className="rounded-panel"
                    />
                    <div className="flex min-w-0 flex-col items-start gap-5">
                        <CategoryBadge variant="pill">
                            {categoryName(product.category)}
                        </CategoryBadge>
                        <h1
                            id="produk-nama"
                            className="font-display text-[2.25rem] leading-tight font-normal text-balance text-brand-900 md:text-h1"
                        >
                            {product.name}
                        </h1>
                        <PriceLabel product={product} size="lg" />
                        <p className="text-base leading-relaxed text-ink-muted md:text-[1.0625rem]">
                            {product.description}
                        </p>
                        <WhatsAppButton
                            size="lg"
                            message={productOrderMessage(product)}
                            className="w-full sm:w-auto"
                        >
                            Pesan Sekarang via WhatsApp
                        </WhatsAppButton>
                        <p className="text-sm text-ink-subtle">
                            Pesanan dikonfirmasi setelah admin menyetujui detail
                            dan harga.
                        </p>
                    </div>
                </div>
            </Section>
            {related.length > 0 && (
                <Section flush aria-labelledby="serupa-title">
                    <SectionHeading id="serupa-title" title="Produk serupa" />
                    <ProductGrid products={related} />
                </Section>
            )}
        </>
    );
}
