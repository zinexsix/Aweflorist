import { useId } from 'react';
import type * as React from 'react';
import { cn } from '@/lib/utils';

/** Gaya dasar input/select/textarea halaman publik. Selalu pakai bersama <FormField>. */
export const fieldClass =
    'block w-full min-h-12 rounded-xl border border-brand-300 bg-surface px-4 py-3 text-base text-ink placeholder:text-ink-subtle/70 transition-[border-color,box-shadow] duration-200 outline-none focus-visible:border-brand-700 focus-visible:ring-4 focus-visible:ring-brand-700/20 aria-invalid:border-red-600 aria-invalid:ring-red-600/15';

type FormFieldProps = {
    label: string;
    /** Render-prop: terima props a11y (id, aria-*) dan tempelkan ke input. */
    children: (props: {
        id: string;
        'aria-invalid': boolean;
        'aria-describedby': string | undefined;
        className: string;
    }) => React.ReactNode;
    hint?: string;
    error?: string;
    required?: boolean;
    className?: string;
};

/** Label + kontrol + petunjuk + pesan galat, dengan atribut aksesibilitas otomatis. */
export function FormField({
    label,
    children,
    hint,
    error,
    required = false,
    className,
}: FormFieldProps) {
    const id = useId();
    const hintId = `${id}-hint`;
    const errorId = `${id}-error`;
    const describedBy =
        [hint && hintId, error && errorId].filter(Boolean).join(' ') ||
        undefined;

    return (
        <div className={cn('flex flex-col gap-2', className)}>
            <label htmlFor={id} className="text-sm font-semibold text-ink">
                {label}
                {required ? (
                    <span className="text-brand-700" aria-hidden="true">
                        {' '}
                        *
                    </span>
                ) : (
                    <span className="font-normal text-ink-subtle">
                        {' '}
                        (opsional)
                    </span>
                )}
            </label>
            {children({
                id,
                'aria-invalid': Boolean(error),
                'aria-describedby': describedBy,
                className: fieldClass,
            })}
            {hint && (
                <p id={hintId} className="text-sm text-ink-subtle">
                    {hint}
                </p>
            )}
            {error && (
                <p
                    id={errorId}
                    role="alert"
                    className="text-sm font-medium text-red-700"
                >
                    {error}
                </p>
            )}
        </div>
    );
}
