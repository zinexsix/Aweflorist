import { Link } from '@inertiajs/react';
import { ArrowUpRight } from 'lucide-react';
import { BrandButton } from '@/components/florify/brand-button';
import { ProductImage } from '@/components/florify/product-image';
import { CategoryBadge } from '@/components/florify/product-meta';
import { Container } from '@/components/florify/section';
import { WhatsAppButton } from '@/components/florify/whatsapp-button';
import { site } from '@/config/site';
import { index as catalog } from '@/routes/catalog';

/** Pemilik: Rofiq. US-01 — hero dengan tagline dan tombol ajakan. */
export function HeroSection() {
    return (
        <section aria-labelledby="hero-title" className="pt-6 md:pt-10">
            <Container>
                <div className="grid items-center gap-10 rounded-panel bg-brand-100 px-5 py-10 sm:px-10 md:py-14 lg:grid-cols-[1.1fr_1fr] lg:gap-12 lg:px-14">
                    <div className="flex min-w-0 flex-col items-start gap-6">
                        <CategoryBadge variant="pill" className="bg-surface">
                            Florist · Buket untuk setiap momen
                        </CategoryBadge>
                        <h1
                            id="hero-title"
                            className="font-display text-[2.5rem] leading-[1.08] font-normal text-balance text-brand-900 sm:text-[3.25rem] xl:text-display"
                        >
                            Rangkaian bunga untuk setiap momen berharga
                        </h1>
                        <p className="max-w-xl text-base leading-relaxed text-pretty text-ink-muted sm:text-lg">
                            Buket bunga segar, buket uang, dan buket custom
                            untuk wisuda, ulang tahun, hingga anniversary. Pilih
                            di katalog, lalu pesan lewat WhatsApp.
                        </p>
                        <div className="flex w-full flex-col gap-3 min-[420px]:w-auto min-[420px]:flex-row min-[420px]:flex-wrap">
                            <BrandButton asChild size="lg">
                                <Link href={catalog()}>
                                    Lihat Katalog
                                    <ArrowUpRight />
                                </Link>
                            </BrandButton>
                            <WhatsAppButton variant="secondary" size="lg">
                                Pesan Sekarang
                            </WhatsAppButton>
                        </div>
                    </div>

                    <div className="grid min-w-0 gap-3 motion-safe:animate-in motion-safe:duration-700 motion-safe:fade-in sm:grid-cols-[3fr_2fr] sm:gap-4">
                        <ProductImage
                            src={site.images.hero}
                            alt="Florist AweFlorist merangkai buket"
                            tone="blush"
                            priority
                            className="aspect-[4/3] rounded-card sm:aspect-[4/5]"
                        />
                        <div className="hidden grid-rows-2 gap-3 sm:grid sm:gap-4">
                            <ProductImage
                                src={site.images.heroSecondary}
                                alt="Buket pilihan AweFlorist"
                                ratio="square"
                                tone="cream"
                                priority
                                className="aspect-auto h-full min-h-28 rounded-card bg-surface"
                            />
                            <div className="flex flex-col justify-end gap-1 rounded-card bg-brand-700 p-3.5 text-white sm:gap-1.5 sm:p-5">
                                <span className="font-display text-base leading-snug sm:text-[1.375rem]">
                                    Pesan mudah lewat WhatsApp
                                </span>
                                <span className="text-xs text-brand-100 sm:text-[0.8125rem]">
                                    Detail dan harga dikonfirmasi admin
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}
