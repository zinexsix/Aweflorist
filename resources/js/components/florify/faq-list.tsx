import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FaqItem } from '@/types';

/**
 * Daftar FAQ berbasis <details>/<summary>: bisa dipakai dengan keyboard,
 * dibaca screen reader, dan tetap berfungsi tanpa JavaScript.
 */
export function FaqList({
    items,
    className,
}: {
    items: FaqItem[];
    className?: string;
}) {
    return (
        <div className={cn('flex flex-col gap-3', className)}>
            {items.map((item, index) => (
                <details
                    key={item.question}
                    open={index === 0}
                    className="group rounded-card border border-line bg-surface transition-colors open:border-brand-300"
                >
                    <summary className="flex min-h-tap cursor-pointer list-none items-center justify-between gap-4 rounded-card px-5 py-4 text-left font-semibold text-ink outline-none focus-visible:ring-4 focus-visible:ring-brand-700/30 md:px-6 [&::-webkit-details-marker]:hidden">
                        <span>{item.question}</span>
                        <span
                            aria-hidden="true"
                            className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700 transition-transform duration-200 group-open:rotate-45 motion-reduce:transition-none"
                        >
                            <Plus className="size-4" />
                        </span>
                    </summary>
                    <p className="px-5 pb-5 text-[0.9375rem] leading-relaxed text-ink-muted md:px-6">
                        {item.answer}
                    </p>
                </details>
            ))}
        </div>
    );
}
