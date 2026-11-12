import { Skeleton } from '@/components/ui/skeleton';
import { TableCell, TableRow } from '@/components/ui/table';

interface TableSkeletonProps {
    columnsCount: number;
    rowsCount?: number;
}

export function TableSkeleton({ columnsCount, rowsCount = 15 }: TableSkeletonProps) {
    return (
        <>
            {Array.from({ length: rowsCount }).map((_, i) => (
                <TableRow key={i}>
                    {Array.from({ length: columnsCount }).map((_, j) => (
                        <TableCell key={j}>
                            <Skeleton className="h-6 w-full" />
                        </TableCell>
                    ))}
                </TableRow>
            ))}
        </>
    );
}