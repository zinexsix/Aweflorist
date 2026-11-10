import { withQuery } from './index';
import type { RouteQueryOptions } from './index';

/**
 * Pengganti `@/routes/orders` untuk build statis.
 * Formulir pesanan tetap tampil, tapi tidak bisa dikirim karena tidak ada server.
 */

type SlugArgs = string | { product: string };

const slugOf = (args: SlugArgs): string =>
    typeof args === 'string' ? args : args.product;

const orderUrl = (args: SlugArgs, options?: RouteQueryOptions) =>
    withQuery(`/pesan/${slugOf(args)}`, options);

export const create = Object.assign(
    (args: SlugArgs, options?: RouteQueryOptions) => ({
        url: orderUrl(args, options),
        method: 'get' as const,
    }),
    { url: orderUrl },
);

export const store = Object.assign(
    (args: SlugArgs, options?: RouteQueryOptions) => ({
        url: orderUrl(args, options),
        method: 'post' as const,
    }),
    {
        url: orderUrl,
        form: (args: SlugArgs, options?: RouteQueryOptions) => ({
            action: orderUrl(args, options),
            method: 'post' as const,
        }),
    },
);
