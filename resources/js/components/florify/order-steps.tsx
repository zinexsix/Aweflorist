import { cn } from '@/lib/utils';
import type { OrderStep } from '@/types';

/** Langkah pemesanan bernomor: 1 kolom (mobile) → 2 → 4 kolom (desktop). */
export function OrderSteps({
    steps,
    className,
}: {
    steps: OrderStep[];
    className?: string;
}) {
    return (
        <ol
            className={cn(
                'grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6',
                className,
            )}
        >
            {steps.map((step, index) => (
                <li
                    key={step.title}
                    className="flex flex-col gap-3 rounded-card border border-line bg-surface p-6"
                >
                    <span className="inline-flex size-11 items-center justify-center rounded-full bg-brand-700 font-display text-xl text-white">
                        {index + 1}
                    </span>
                    <h3 className="text-lg font-semibold text-ink">
                        {step.title}
                    </h3>
                    <p className="text-[0.9375rem] leading-relaxed text-ink-muted">
                        {step.description}
                    </p>
                </li>
            ))}
        </ol>
    );
}
