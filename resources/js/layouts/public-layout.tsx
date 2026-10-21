import type * as React from 'react';
import { SiteFooter } from '@/components/florify/site-footer';
import { SiteHeader } from '@/components/florify/site-header';

/** Layout semua halaman publik (pages/public/*). Dipasang otomatis di app.tsx. */
export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col bg-brand-50 font-sans text-ink antialiased [color-scheme:light]">
            <a
                href="#konten"
                className="sr-only z-50 rounded-full bg-brand-700 px-5 py-3 font-semibold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
            >
                Lewati ke konten
            </a>
            <SiteHeader />
            <main id="konten" className="flex-1">
                {children}
            </main>
            <SiteFooter />
        </div>
    );
}
