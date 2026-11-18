import { Head } from '@inertiajs/react';
import { AboutSection } from '@/components/home/about-section';
import { FeaturedProductsSection } from '@/components/home/featured-products-section';
import { HeroSection } from '@/components/home/hero-section';
import { OccasionsSection } from '@/components/home/occasions-section';
import {
    ContactCtaSection,
    FaqSection,
    OrderStepsSection,
} from '@/components/home/order-info-section';
import { PromoSection } from '@/components/home/promo-section';
import type { Occasion, Product, ProductCategory } from '@/types';

/**
 * Landing page (pemilik: Rofiq). File ini hanya MENYUSUN section.
 * Isi tiap section diubah di resources/js/components/home/*.
 * Produk unggulan, kategori harga, dan acara dikirim server lewat HomeController.
 */
export default function Home({
    featuredProducts,
    categories,
    occasions,
}: {
    featuredProducts: Product[];
    categories: ProductCategory[];
    occasions: Occasion[];
}) {
    return (
        <>
            <Head title="Beranda">
                <meta
                    name="description"
                    content="AweFlorist — buket mulai Rp15.000 dan buket custom untuk wisuda dan momen lainnya. Pesan mudah lewat WhatsApp."
                />
            </Head>
            <HeroSection />
            <AboutSection />
            <FeaturedProductsSection products={featuredProducts} />
            <OccasionsSection categories={categories} />
            <PromoSection occasions={occasions} />
            <OrderStepsSection />
            <FaqSection />
            <ContactCtaSection />
        </>
    );
}
