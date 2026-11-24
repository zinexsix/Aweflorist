import { Head, Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';
import type { BreadcrumbItem } from '@/types';

type AdminPageProps = {
    title: string;
    description?: string;
    breadcrumbs?: BreadcrumbItem[];
    actions?: ReactNode;
    children: ReactNode;
};

export default function AdminPage({
    title,
    description,
    breadcrumbs = [],
    actions,
    children,
}: AdminPageProps) {
    return (
        <>
            <Head title={title} />

            <div className="flex w-full min-w-0 flex-col gap-6 p-4 md:p-6">
                {breadcrumbs.length > 0 && (
                    <nav aria-label="Breadcrumb">
                        <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
                            {breadcrumbs.map((breadcrumb, index) => {
                                const isLast = index === breadcrumbs.length - 1;

                                return (
                                    <li
                                        key={`${breadcrumb.title}-${index}`}
                                        className="flex items-center gap-1"
                                    >
                                        {index > 0 && (
                                            <ChevronRight
                                                className="size-3.5"
                                                aria-hidden="true"
                                            />
                                        )}
                                        <Link
                                            href={breadcrumb.href}
                                            aria-current={
                                                isLast ? 'page' : undefined
                                            }
                                            className={
                                                isLast
                                                    ? 'font-medium text-foreground'
                                                    : 'hover:text-foreground'
                                            }
                                        >
                                            {breadcrumb.title}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ol>
                    </nav>
                )}

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0 space-y-1">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            {title}
                        </h1>
                        {description && (
                            <p className="text-sm text-muted-foreground">
                                {description}
                            </p>
                        )}
                    </div>
                    {actions && (
                        <div className="flex flex-wrap gap-2">{actions}</div>
                    )}
                </div>

                {children}
            </div>
        </>
    );
}
