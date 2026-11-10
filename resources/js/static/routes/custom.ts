import { withQuery } from './index';
import type { RouteQueryOptions } from './index';

/**
 * Pengganti `@/routes/custom` untuk build statis.
 * Formulir buket custom tetap tampil, tapi tidak bisa dikirim karena tidak ada server.
 */

const customUrl = (options?: RouteQueryOptions) =>
    withQuery('/buket-custom', options);

export const store = Object.assign(
    (options?: RouteQueryOptions) => ({
        url: customUrl(options),
        method: 'post' as const,
    }),
    {
        url: customUrl,
        form: (options?: RouteQueryOptions) => ({
            action: customUrl(options),
            method: 'post' as const,
        }),
    },
);
