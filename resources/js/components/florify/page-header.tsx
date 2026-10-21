import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import type * as React from 'react';
import { Container } from '@/components/florify/section';

export type Crumb = { label: string; href?: string };

/** Judul halaman dalam (katalog, detail, informasi) + breadcrumb. */
export function PageHeader({
    title,
    description,
    breadcrumbs,
    children,
}: {
    title?: string;
    description?: string;
    breadcrumbs: Crumb[];
    children?: React.ReactNode;
}) {
    return (
        <div className="pt-8 pb-8 md:pt-12 md:pb-10">
            <Container className="flex flex-col gap-4">
                <nav aria-label="Breadcrumb">
                    <ol className="flex flex-wrap items-center gap-1 text-sm text-ink-subtle">
                        {breadcrumbs.map((crumb, index) => (
                            <li
                                key={crumb.label}
                                className="flex items-center gap-1"
                            >
                                {index > 0 && (
                                    <ChevronRight
                                        className="size-3.5"
                                        aria-hidden="true"
                                    />
                                )}
                                {crumb.href ? (
                                    <Link
                                        href={crumb.href}
                                        className="rounded-sm text-brand-700 underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-brand-700/40 focus-visible:outline-none"
                                    >
                                        {crumb.label}
                                    </Link>
                                ) : (
                                    <span aria-current="page">
                                        {crumb.label}
                                    </span>
                                )}
                            </li>
                        ))}
                    </ol>
                </nav>
                {title && (
                    <h1 className="font-display text-[2.25rem] leading-tight font-normal text-balance text-brand-900 md:text-h1">
                        {title}
                    </h1>
                )}
                {description && (
                    <p className="max-w-2xl text-base leading-relaxed text-ink-muted md:text-[1.0625rem]">
                        {description}
                    </p>
                )}
                {children}
            </Container>
        </div>
    );
}
