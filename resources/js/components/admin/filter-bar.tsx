import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type FilterBarProps = {
    action?: string;
    q?: string | null;
    placeholder?: string;
    children?: ReactNode;
};

export default function FilterBar({
    action,
    q = '',
    placeholder = 'Cari...',
    children,
}: FilterBarProps) {
    return (
        <form
            method="get"
            action={action}
            className="grid gap-3 rounded-lg border border-border bg-card p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end"
        >
            <div className="grid gap-2">
                <Label htmlFor="filter-q" className="sr-only">
                    Pencarian
                </Label>
                <Input
                    id="filter-q"
                    type="search"
                    name="q"
                    defaultValue={q ?? ''}
                    placeholder={placeholder}
                />
            </div>

            <div className="flex flex-wrap items-end gap-2">
                {children}
                <Button type="submit">Terapkan</Button>
            </div>
        </form>
    );
}
