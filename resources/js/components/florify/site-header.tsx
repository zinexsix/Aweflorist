import { Link, router } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';
import { useEffect, useId, useState } from 'react';
import { Logo } from '@/components/florify/logo';
import { Container } from '@/components/florify/section';
import { WhatsAppButton } from '@/components/florify/whatsapp-button';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn } from '@/lib/utils';
import { custom, home, info } from '@/routes';
import { index as catalog } from '@/routes/catalog';

type NavItem = {
    label: string;
    href: string;
    /** Path yang membuat item ini aktif. Kosong = tidak pernah aktif (link anchor). */
    activePath?: string;
};

const navItems: NavItem[] = [
    { label: 'Beranda', href: home.url(), activePath: home.url() },
    { label: 'Katalog', href: catalog.url(), activePath: catalog.url() },
    { label: 'Kategori', href: `${home.url()}#kategori` },
    { label: 'Buket Custom', href: custom.url(), activePath: custom.url() },
    {
        label: 'Cara Pemesanan',
        href: `${info.url()}#cara-pesan`,
        activePath: info.url(),
    },
    { label: 'Kontak', href: `${info.url()}#kontak` },
];

export function SiteHeader() {
    const [open, setOpen] = useState(false);
    const menuId = useId();
    const { isCurrentUrl, isCurrentOrParentUrl } = useCurrentUrl();

    const isActive = (item: NavItem) =>
        item.activePath !== undefined &&
        (item.activePath === home.url()
            ? isCurrentUrl(item.activePath)
            : isCurrentOrParentUrl(item.activePath));

    useEffect(() => router.on('navigate', () => setOpen(false)), []);

    useEffect(() => {
        if (!open) {
            return;
        }

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setOpen(false);
            }
        };

        window.addEventListener('keydown', onKeyDown);

        return () => window.removeEventListener('keydown', onKeyDown);
    }, [open]);

    return (
        <header className="sticky top-0 z-40 border-b border-line bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/85">
            <Container className="flex h-18 items-center justify-between gap-4">
                <Link
                    href={home()}
                    className="rounded-md outline-none focus-visible:ring-4 focus-visible:ring-brand-700/30"
                    aria-label="AweFlorist — Beranda"
                >
                    <Logo />
                </Link>

                <nav aria-label="Navigasi utama" className="hidden lg:block">
                    <ul className="flex items-center gap-1">
                        {navItems.map((item) => (
                            <li key={item.label}>
                                <Link
                                    href={item.href}
                                    aria-current={
                                        isActive(item) ? 'page' : undefined
                                    }
                                    className={cn(
                                        'relative inline-flex min-h-tap items-center rounded-full px-4 text-[0.9375rem] font-medium text-ink transition-colors duration-200 outline-none hover:text-brand-700 focus-visible:ring-4 focus-visible:ring-brand-700/30',
                                        'after:absolute after:inset-x-4 after:bottom-2 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-brand-700 after:transition-transform after:duration-200 motion-reduce:after:transition-none',
                                        'aria-[current=page]:text-brand-700 aria-[current=page]:after:scale-x-100',
                                    )}
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="flex items-center gap-2">
                    <WhatsAppButton className="hidden sm:inline-flex">
                        Pesan Sekarang
                    </WhatsAppButton>
                    <button
                        type="button"
                        className="inline-flex size-tap items-center justify-center rounded-full text-brand-900 transition-colors outline-none hover:bg-brand-100 focus-visible:ring-4 focus-visible:ring-brand-700/30 lg:hidden"
                        aria-expanded={open}
                        aria-controls={menuId}
                        onClick={() => setOpen((value) => !value)}
                    >
                        {open ? (
                            <X className="size-6" />
                        ) : (
                            <Menu className="size-6" />
                        )}
                        <span className="sr-only">
                            {open ? 'Tutup menu' : 'Buka menu'}
                        </span>
                    </button>
                </div>
            </Container>

            <div
                id={menuId}
                hidden={!open}
                className="border-t border-line bg-surface lg:hidden"
            >
                <Container className="py-3">
                    <nav aria-label="Navigasi utama (mobile)">
                        <ul className="flex flex-col">
                            {navItems.map((item) => (
                                <li key={item.label}>
                                    <Link
                                        href={item.href}
                                        aria-current={
                                            isActive(item) ? 'page' : undefined
                                        }
                                        onClick={() => setOpen(false)}
                                        className="flex min-h-12 items-center rounded-xl px-3 text-base font-medium text-ink transition-colors outline-none hover:bg-brand-50 focus-visible:ring-4 focus-visible:ring-brand-700/30 aria-[current=page]:bg-brand-100 aria-[current=page]:text-brand-700"
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                    <WhatsAppButton className="mt-3 w-full sm:hidden">
                        Pesan Sekarang
                    </WhatsAppButton>
                </Container>
            </div>
        </header>
    );
}
