import { useEffect, useSyncExternalStore } from 'react';
import type * as React from 'react';
import { site } from '@/config/site';

/**
 * Pengganti kecil `@inertiajs/react` untuk build statis (Vercel), tanpa server Laravel.
 * Hanya menyediakan yang dipakai halaman publik: Link, Head, usePage, router.on('navigate').
 * Dipasang lewat alias di vite.static.config.ts; build Laravel biasa tidak terpengaruh.
 */

type Href = string | { url: string };

const urlListeners = new Set<() => void>();
const navigateListeners = new Set<() => void>();

const currentUrl = (): string =>
    window.location.pathname + window.location.search;

const notify = (): void => {
    urlListeners.forEach((listener) => listener());
    navigateListeners.forEach((listener) => listener());
};

const scrollToHash = (hash: string): void => {
    requestAnimationFrame(() => {
        const target = hash
            ? document.getElementById(decodeURIComponent(hash.slice(1)))
            : null;

        if (target) {
            target.scrollIntoView();
        } else {
            window.scrollTo(0, 0);
        }
    });
};

window.addEventListener('popstate', notify);

function visit(href: string): void {
    const url = new URL(href, window.location.origin);

    if (url.href !== window.location.href) {
        window.history.pushState({}, '', url.href);
        notify();
    }

    scrollToHash(url.hash);
}

export const router = {
    visit,
    on(event: 'navigate', callback: () => void): () => void {
        if (event !== 'navigate') {
            return () => {};
        }

        navigateListeners.add(callback);

        return () => {
            navigateListeners.delete(callback);
        };
    },
};

const subscribe = (callback: () => void) => {
    urlListeners.add(callback);

    return () => {
        urlListeners.delete(callback);
    };
};

export function useUrl(): string {
    return useSyncExternalStore(subscribe, currentUrl);
}

export function usePage(): { url: string } {
    return { url: useUrl() };
}

export function Head({
    title,
}: {
    title?: string;
    children?: React.ReactNode;
}) {
    useEffect(() => {
        document.title = title ? `${title} - ${site.name}` : site.name;
    }, [title]);

    return null;
}

type LinkProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
    href: Href;
    ref?: React.Ref<HTMLAnchorElement>;
    // Prop khusus Inertia diterima agar kode halaman tidak perlu diubah, tapi diabaikan.
    prefetch?: unknown;
    preserveScroll?: unknown;
    preserveState?: unknown;
    replace?: unknown;
};

export function Link({
    href,
    onClick,
    prefetch: _prefetch,
    preserveScroll: _preserveScroll,
    preserveState: _preserveState,
    replace: _replace,
    ...props
}: LinkProps) {
    const url = typeof href === 'string' ? href : href.url;

    const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        onClick?.(event);

        const isPlainLeftClick =
            event.button === 0 &&
            !event.metaKey &&
            !event.ctrlKey &&
            !event.shiftKey &&
            !event.altKey;
        const isInternal =
            new URL(url, window.location.origin).origin ===
            window.location.origin;

        if (
            event.defaultPrevented ||
            !isPlainLeftClick ||
            !isInternal ||
            (props.target && props.target !== '_self')
        ) {
            return;
        }

        event.preventDefault();
        visit(url);
    };

    return <a href={url} onClick={handleClick} {...props} />;
}
