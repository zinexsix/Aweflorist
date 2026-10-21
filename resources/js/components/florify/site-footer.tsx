import { Link } from '@inertiajs/react';
import { Logo } from '@/components/florify/logo';
import { Container } from '@/components/florify/section';
import { site } from '@/config/site';
import { generalInquiryMessage, whatsappUrl } from '@/lib/whatsapp';
import { home, info } from '@/routes';
import { index as catalog } from '@/routes/catalog';

const linkClass =
    'rounded-sm text-brand-100 underline-offset-4 transition-colors hover:text-white hover:underline focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none';

export function SiteFooter() {
    const socials = [
        site.instagram && {
            label: `Instagram ${site.instagram}`,
            href: `https://instagram.com/${site.instagram.replace('@', '')}`,
        },
        site.tiktok && {
            label: `TikTok ${site.tiktok}`,
            href: `https://www.tiktok.com/@${site.tiktok.replace('@', '')}`,
        },
    ].filter((item): item is { label: string; href: string } => Boolean(item));

    return (
        <footer className="bg-brand-900 text-brand-100">
            <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
                <div className="flex flex-col gap-4">
                    <Logo tone="light" />
                    <p className="max-w-xs text-[0.9375rem] leading-relaxed">
                        {site.tagline}.
                    </p>
                </div>

                <div className="flex flex-col gap-3 text-[0.9375rem]">
                    <h2 className="font-bold text-white">Halaman</h2>
                    <Link href={home()} className={linkClass}>
                        Beranda
                    </Link>
                    <Link href={catalog()} className={linkClass}>
                        Katalog
                    </Link>
                    <Link
                        href={`${info.url()}#cara-pesan`}
                        className={linkClass}
                    >
                        Cara Pemesanan
                    </Link>
                    <Link href={`${info.url()}#faq`} className={linkClass}>
                        FAQ
                    </Link>
                </div>

                <div className="flex flex-col gap-3 text-[0.9375rem]">
                    <h2 className="font-bold text-white">Kontak</h2>
                    <a
                        href={whatsappUrl(generalInquiryMessage)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={linkClass}
                    >
                        WhatsApp
                        {site.whatsappNumber && ` · +${site.whatsappNumber}`}
                    </a>
                    {site.address && <span>{site.address}</span>}
                    {site.openingHours && (
                        <span>Buka: {site.openingHours}</span>
                    )}
                    {socials.map((social) => (
                        <a
                            key={social.href}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={linkClass}
                        >
                            {social.label}
                        </a>
                    ))}
                </div>
            </Container>
            <div className="border-t border-white/10">
                <Container className="py-5 text-center text-[0.8125rem] text-brand-200">
                    © {new Date().getFullYear()} {site.name} · {site.product}{' '}
                    dikembangkan oleh CodeHive
                </Container>
            </div>
        </footer>
    );
}
