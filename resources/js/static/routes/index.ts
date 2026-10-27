/**
 * Pengganti `@/routes` (hasil Wayfinder) untuk build statis, karena Wayfinder butuh PHP.
 * Hanya route halaman publik. Jika ada route publik baru di routes/web.php, tambahkan juga di sini.
 */

export type RouteQueryOptions = {
    query?: Record<string, string | number | undefined>;
};

export function withQuery(path: string, options?: RouteQueryOptions): string {
    const params = new URLSearchParams();

    Object.entries(options?.query ?? {}).forEach(([key, value]) => {
        if (value !== undefined) {
            params.set(key, String(value));
        }
    });

    const query = params.toString();

    return query ? `${path}?${query}` : path;
}

export function staticRoute(path: string) {
    const url = (options?: RouteQueryOptions) => withQuery(path, options);
    const route = (options?: RouteQueryOptions) => ({
        url: url(options),
        method: 'get' as const,
    });

    return Object.assign(route, { url });
}

export const home = staticRoute('/');
export const custom = staticRoute('/buket-custom');
export const info = staticRoute('/informasi');
