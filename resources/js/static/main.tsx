import './app.css';
import { StrictMode } from 'react';
import type * as React from 'react';
import { createRoot } from 'react-dom/client';
import { BrandButton } from '@/components/florify/brand-button';
import { EmptyState } from '@/components/florify/empty-state';
import { Section } from '@/components/florify/section';
import { categories, occasions } from '@/data/catalog';
import { featuredProducts, findProduct, products } from '@/data/products';
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
 * Karena tidak ada server, props diisi dari resources/js/data dengan aturan
 * yang sama seperti HomeController dan CatalogController.
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

function catalogPage(params: URLSearchParams): React.ReactNode {
    const kategori =
        categories.find((item) => item.slug === params.get('kategori'))?.slug ??
        null;
    const acara =
        occasions.find((item) => item.slug === params.get('acara'))?.slug ??
        null;
    const q = (params.get('q') ?? '').trim().slice(0, 100) || null;
    const visibleProducts = products.filter(
        (product) =>
            (!kategori || product.category === kategori) &&
            (!acara || product.occasions.includes(acara)) &&
            (!q || product.name.toLowerCase().includes(q.toLowerCase())),
    );

    return (
        <Catalog
            products={visibleProducts}
            categories={categories}
            occasions={occasions}
            filters={{ kategori, acara, q }}
        />
    );
}

function productPage(slug: string): React.ReactNode {
    const product = findProduct(slug);

    if (!product) {
        return <NotFound />;
    }

    const related = products
        .filter(
            (item) =>
                item.slug !== product.slug &&
                item.category === product.category,
        )
        .slice(0, 3);

    return <ProductDetail product={product} related={related} />;
}

function resolvePage(path: string, params: URLSearchParams): React.ReactNode {
    const productSlug = path.match(/^\/katalog\/([a-z0-9-]+)$/)?.[1];

    if (productSlug) {
        return productPage(productSlug);
    }

    switch (path) {
        case '/':
            return <Home featuredProducts={featuredProducts.slice(0, 4)} />;
        case '/katalog':
            return catalogPage(params);
        case '/buket-custom':
            return <CustomBouquet />;
        case '/informasi':
            return <Info />;
        default:
            return <NotFound />;
    }
}

function App() {
    const url = new URL(useUrl(), window.location.origin);
    const path = url.pathname.replace(/\/+$/, '') || '/';

    return (
        <PublicLayout>
            <div key={path} className="contents">
                {resolvePage(path, url.searchParams)}
            </div>
        </PublicLayout>
    );
}

createRoot(document.getElementById('app')!).render(
    <StrictMode>
        <App />
    </StrictMode>,
);
