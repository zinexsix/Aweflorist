import { staticRoute, withQuery } from './index';
import type { RouteQueryOptions } from './index';

/** Pengganti `@/routes/catalog` untuk build statis. */

type SlugArgs = string | { slug: string };

const slugOf = (args: SlugArgs): string =>
    typeof args === 'string' ? args : args.slug;

export const index = staticRoute('/katalog');

const showUrl = (args: SlugArgs, options?: RouteQueryOptions) =>
    withQuery(`/katalog/${slugOf(args)}`, options);

export const show = Object.assign(
    (args: SlugArgs, options?: RouteQueryOptions) => ({
        url: showUrl(args, options),
        method: 'get' as const,
    }),
    { url: showUrl },
);
