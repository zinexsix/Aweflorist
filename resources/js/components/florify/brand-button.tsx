import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import type { VariantProps } from 'class-variance-authority';
import type * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Tombol halaman publik Florify.
 * - primary   : aksi utama (maks. 1 per area), mis. "Lihat Katalog".
 * - secondary : aksi pendamping di atas latar terang.
 * - outline   : aksi tersier/"lihat semua".
 * - inverse   : tombol putih di atas panel maroon.
 * - ghost     : aksi ringan di navbar/menu.
 */
export const brandButtonVariants = cva(
    'inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-[background-color,color,border-color,box-shadow,transform] duration-200 ease-soft outline-none select-none focus-visible:ring-4 focus-visible:ring-brand-700/30 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none motion-reduce:active:scale-100 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4.5',
    {
        variants: {
            variant: {
                primary:
                    'bg-brand-700 text-white shadow-card hover:bg-brand-800 hover:shadow-lift',
                secondary:
                    'border-[1.5px] border-brand-700 bg-surface text-brand-700 hover:bg-brand-100',
                outline:
                    'border border-brand-300 bg-surface text-brand-700 hover:border-brand-700',
                inverse:
                    'bg-surface text-brand-700 hover:bg-brand-100 focus-visible:ring-white/50',
                ghost: 'text-ink hover:bg-brand-100 hover:text-brand-700',
            },
            size: {
                md: 'min-h-tap px-5 text-[0.9375rem]',
                lg: 'min-h-13 px-7 text-base',
            },
        },
        defaultVariants: {
            variant: 'primary',
            size: 'md',
        },
    },
);

export type BrandButtonProps = React.ComponentProps<'button'> &
    VariantProps<typeof brandButtonVariants> & {
        /** true = gaya tombol diterapkan ke child, mis. <Link> atau <a>. */
        asChild?: boolean;
    };

export function BrandButton({
    className,
    variant,
    size,
    asChild = false,
    ...props
}: BrandButtonProps) {
    const Comp = asChild ? Slot : 'button';

    return (
        <Comp
            data-slot="brand-button"
            className={cn(brandButtonVariants({ variant, size, className }))}
            {...props}
        />
    );
}
