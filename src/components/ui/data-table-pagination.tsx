import { Table } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ButtonGroup } from './button-group';
import { ChevronFirstIcon, ChevronLastIcon, ChevronLeftIcon, ChevronRight, ChevronRightIcon } from 'lucide-react';

interface DataTablePaginationProps<TData> {
    table: Table<TData>;
}

export function DataTablePagination<TData>({ table }: DataTablePaginationProps<TData>) {
    const totalRows = table.getFilteredRowModel().rows.length;

    return (
        <div className="flex justify-center items-center px-2 py-4">
            <div className="flex min-w-full justify-between items-center lg:space-x-8">
                <div className="flex justify-start items-center space-x-2">
                    <ButtonGroup>
                        <Button variant="outline">Por página</Button>
                        <Select
                            value={`${table.getState().pagination.pageSize}`}
                            onValueChange={(value) => {
                                table.setPageSize(Number(value));
                            }}
                        >
                            <SelectTrigger className="h-8 w-[70px]">
                                <SelectValue placeholder={table.getState().pagination.pageSize} />
                            </SelectTrigger>
                            <SelectContent side="top">
                                {[5, 10, 15, 20, 30, 40, 50].map((pageSize) => (
                                    <SelectItem key={pageSize} value={`${pageSize}`}>
                                        {pageSize}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </ButtonGroup>
                    {/* <p className="text-sm font-medium">Por página</p> */}

                </div>
                <div className="flex w-[80px] md:w-[150px] items-center justify-center text-sm font-medium">
                    <span className='sr-only md:not-sr-only'>Página&nbsp;</span> {table.getState().pagination.pageIndex + 1} <span className='md:sr-only'> {'/'} </span><span className='sr-only md:not-sr-only'>&nbsp;de&nbsp;</span>{table.getPageCount()}
                </div>
                <div className="flex justify-end items-center space-x-2">
                    <ButtonGroup>
                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <ChevronFirstIcon />
                        </Button>
                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <ChevronLeftIcon />
                        </Button>
                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            <ChevronRightIcon />
                        </Button>
                        <Button
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                            disabled={!table.getCanNextPage()}
                        >
                            <ChevronLastIcon />
                        </Button>
                    </ButtonGroup>
                </div>
            </div>
        </div>
    );
}