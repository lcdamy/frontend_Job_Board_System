"use client"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { Button } from "@/components/ui/button"
import React from "react"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    page: number
    pageSize: number
    total: number
    setPage: (page: number) => void
    setPageSize: (size: number) => void
}

export function DataTable<TData, TValue>({
    columns,
    data,
    page,
    pageSize,
    total,
    setPage,
    setPageSize,
}: DataTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        pageCount: Math.ceil(total / pageSize),
        state: {
            pagination: {
                pageIndex: page - 1,
                pageSize,
            },
        },
        onPaginationChange: updater => {
            if (typeof updater === "function") {
                const newState = updater({ pageIndex: page - 1, pageSize });
                setPage(newState.pageIndex + 1);
                setPageSize(newState.pageSize);
            } else {
                setPage(updater.pageIndex + 1);
                setPageSize(updater.pageSize);
            }
        },
    });

    return (
        <div>
            <div className="rounded-md border">
                <Table className="bg-[#F3F8FF]">
                    <TableHeader >
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="hover:bg-transparent">
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="text-[#071C50]/50 font-[400]">
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {data.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className="group hover:bg-[#E7F1FF]"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="text-xs">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-between space-x-2 py-4">
                <div className="flex items-center space-x-2">
                    <span className="text-xs">
                        Page {page} of {Math.max(1, Math.ceil(total / pageSize))}
                    </span>
                    <select
                        className="border rounded px-2 py-1 text-xs"
                        value={pageSize}
                        onChange={e => {
                            setPageSize(Number(e.target.value));
                            setPage(1);
                        }}
                    >
                        {[5, 10, 20, 50].map(size => (
                            <option key={size} value={size}>
                                Show {size}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <Button
                        variant="default"
                        className="hover:bg-accent-foreground cursor-pointer mr-2"
                        size="sm"
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="default"
                        className="hover:bg-accent-foreground cursor-pointer"
                        size="sm"
                        onClick={() => setPage(page + 1)}
                        disabled={page >= Math.ceil(total / pageSize)}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}