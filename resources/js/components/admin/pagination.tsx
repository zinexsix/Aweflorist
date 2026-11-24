import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Paginated } from '@/types/admin';

function labelFor(label: string): React.ReactNode {
    if (label.includes('Previous')) {
        return <ChevronLeft className="size-4" aria-hidden="true" />;
    }

    if (label.includes('Next')) {
        return <ChevronRight className="size-4" aria-hidden="true" />;
    }

    return label.replace(/&laquo;|&raquo;/g, '').trim();
}

export default function Pagination({
    links,
}: {
    links: Paginated<unknown>['links'];
}) {
    if (links.length <= 1) {
        return null;
    }

    return (
        <nav
            aria-label="Paginasi"
            className="flex flex-wrap items-center gap-1"
        >
            {links.map((link, index) => {
                const content = labelFor(link.label);
                const className = cn(
                    buttonVariants({
                        variant: link.active ? 'default' : 'outline',
                        size: 'sm',
                    }),
                    'min-w-9',
                );

                if (!link.url) {
                    return (
                        <span
                            key={index}
                            aria-disabled="true"
                            className={cn(className, 'opacity-50')}
                        >
                            {content}
                        </span>
                    );
                }

                return (
                    <Link
                        key={index}
                        href={link.url}
                        aria-current={link.active ? 'page' : undefined}
                        className={className}
                    >
                        {content}
                    </Link>
                );
            })}
        </nav>
    );
}
