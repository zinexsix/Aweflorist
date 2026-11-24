import type { ReactNode } from 'react';

export type AdminTableColumn<T> = {
    header: ReactNode;
    cell: (row: T) => ReactNode;
    headerClassName?: string;
    cellClassName?: string;
};

type AdminTableProps<T> = {
    columns: AdminTableColumn<T>[];
    rows: T[];
    emptyText?: string;
    rowKey?: (row: T, index: number) => string | number;
};

export default function AdminTable<T>({
    columns,
    rows,
    emptyText = 'Belum ada data.',
    rowKey,
}: AdminTableProps<T>) {
    return (
        <div className="w-full overflow-x-auto rounded-lg border border-border">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                <thead className="bg-muted/50 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    <tr>
                        {columns.map((column, index) => (
                            <th
                                key={index}
                                scope="col"
                                className={[
                                    'px-4 py-3 whitespace-nowrap',
                                    column.headerClassName,
                                ]
                                    .filter(Boolean)
                                    .join(' ')}
                            >
                                {column.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-border bg-background">
                    {rows.length === 0 ? (
                        <tr>
                            <td
                                colSpan={columns.length}
                                className="px-4 py-10 text-center text-muted-foreground"
                            >
                                {emptyText}
                            </td>
                        </tr>
                    ) : (
                        rows.map((row, rowIndex) => (
                            <tr
                                key={rowKey ? rowKey(row, rowIndex) : rowIndex}
                                className="hover:bg-muted/40"
                            >
                                {columns.map((column, columnIndex) => (
                                    <td
                                        key={columnIndex}
                                        className={[
                                            'px-4 py-3 align-middle',
                                            column.cellClassName,
                                        ]
                                            .filter(Boolean)
                                            .join(' ')}
                                    >
                                        {column.cell(row)}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
