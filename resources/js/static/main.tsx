import './app.css';
import { StrictMode } from 'react';
import type * as React from 'react';
import { createRoot } from 'react-dom/client';
import { BrandButton } from '@/components/florify/brand-button';
import { EmptyState } from '@/components/florify/empty-state';
import { Section } from '@/components/florify/section';
import PublicLayout from '@/layouts/public-layout';
import Catalog from '@/pages/public/catalog';
import CustomBouquet from '@/pages/public/custom-bouquet';
import Home from '@/pages/public/home';
import Info from '@/pages/public/info';
import ProductDetail from '@/pages/public/product-detail';
import { Head, Link, useUrl } from './inertia';

/**
 * Entry build statis (Vercel): hanya halaman publik Florify, tanpa backend Laravel.
 * Daftar route di bawah harus sama dengan halaman publik di routes/web.php.
 */

function NotFound() {
    return (
        <>
            <Head title="Halaman tidak ditemukan" />
            <Section aria-label="Halaman tidak ditemukan">
                <EmptyState
                    title="Halaman tidak ditemukan"
                    description="Alamat yang Anda buka tidak tersedia."
                    action={
                        <BrandButton asChild>
                            <Link href="/">Kembali ke beranda</Link>
                        </BrandButton>
                    }
                />
            </Section>
        </>
    );
}

function resolvePage(path: string): React.ReactNode {
    const productSlug = path.match(/^\/katalog\/([a-z0-9-]+)$/)?.[1];

    if (productSlug) {
        return <ProductDetail slug={productSlug} />;
    }

    switch (path) {
        case '/':
            return <Home />;
        case '/katalog':
            return <Catalog />;
        case '/buket-custom':
            return <CustomBouquet />;
        case '/informasi':
            return <Info />;
        default:
            return <NotFound />;
    }
}

function App() {
    const url = useUrl();
    const path =
        new URL(url, window.location.origin).pathname.replace(/\/+$/, '') ||
        '/';

    return (
        <PublicLayout>
            <div key={path} className="contents">
                {resolvePage(path)}
            </div>
        </PublicLayout>
    );
}

createRoot(document.getElementById('app')!).render(
    <StrictMode>
        <App />
    </StrictMode>,
);
