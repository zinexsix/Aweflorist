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
import type { Product } from '@/types';

/**
 * Landing page (pemilik: Rofiq). File ini hanya MENYUSUN section.
 * Isi tiap section diubah di resources/js/components/home/*.
 * Produk unggulan dikirim server lewat HomeController (US-10).
 */
export default function Home({
    featuredProducts,
}: {
    featuredProducts: Product[];
}) {
    return (
        <>
            <Head title="Beranda">
                <meta
                    name="description"
                    content="AweFlorist — buket bunga segar, buket uang, dan buket custom untuk wisuda, ulang tahun, dan anniversary. Pesan mudah lewat WhatsApp."
                />
            </Head>
            <HeroSection />
            <AboutSection />
            <FeaturedProductsSection products={featuredProducts} />
            <OccasionsSection />
            <PromoSection />
            <OrderStepsSection />
            <FaqSection />
            <ContactCtaSection />
        </>
    );
}
