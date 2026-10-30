import { Head } from '@inertiajs/react';
import { CustomBouquetForm } from '@/components/florify/custom-bouquet-form';
import { PageHeader } from '@/components/florify/page-header';
import { ProductGrid } from '@/components/florify/product-card';
import { ProductImage } from '@/components/florify/product-image';
import { CategoryBadge, PriceLabel } from '@/components/florify/product-meta';
import { Section, SectionHeading } from '@/components/florify/section';
import { WhatsAppButton } from '@/components/florify/whatsapp-button';
import { categoryName } from '@/data/catalog';
import { productOrderMessage } from '@/lib/whatsapp';
import { home } from '@/routes';
import { index as catalog } from '@/routes/catalog';
import type { Product } from '@/types';

/**
 * Halaman detail produk (pemilik: Latif). US-06, US-07, US-10.
 * Produk dan produk serupa dikirim CatalogController. Slug yang tidak ada
 * atau produk nonaktif sudah dijawab 404 oleh server.
 * TODO Latif: galeri beberapa foto, kolom catatan kartu ucapan yang ikut
 * masuk ke pesan WhatsApp (lihat doc/florify-html/detail.html).
 */
export default function ProductDetail({
    product,
    related,
}: {
    product: Product;
    related: Product[];
}) {
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
                        className="rounded-panel md:sticky md:top-24 md:self-start"
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
                        {product.category === 'buket-custom' ? (
                            <div className="flex w-full flex-col gap-3">
                                <h2 className="font-display text-h3 text-brand-900">
                                    Isi detail buket custom Anda
                                </h2>
                                <CustomBouquetForm reference={product.name} />
                                <p className="text-sm text-ink-subtle">
                                    Permintaan custom belum dianggap pesanan
                                    final sebelum Anda dan admin menyepakati
                                    detail dan harga.
                                </p>
                            </div>
                        ) : (
                            <>
                                <WhatsAppButton
                                    size="lg"
                                    message={productOrderMessage(product)}
                                    className="w-full sm:w-auto"
                                >
                                    Pesan Sekarang via WhatsApp
                                </WhatsAppButton>
                                <p className="text-sm text-ink-subtle">
                                    Pesanan dikonfirmasi setelah admin
                                    menyetujui detail dan harga.
                                </p>
                            </>
                        )}
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
