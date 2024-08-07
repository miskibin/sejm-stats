"use client";

import React, { useState, useEffect } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { DataTablePagination } from "./pagination";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./toggle";
import { DataTableFilter } from "./dataTableFilter";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filters?: {
    columnKey: string;
    title: string;
  }[];
  rowsPerPage?: number;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filters = [],
  rowsPerPage = 10,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [filterOptions, setFilterOptions] = useState<
    Record<string, { label: string; value: string }[]>
  >({});
  useEffect(() => {
    const options: Record<string, { label: string; value: string }[]> = {};
    filters.forEach((filter) => {
      const uniqueValues = Array.from(
        new Set(data.map((item: any) => item[filter.columnKey]))
      );
      options[filter.columnKey] = uniqueValues.map((value) => ({
        label: String(value),
        value: String(value),
      }));
    });
    setFilterOptions(options);
  }, [data, filters]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      globalFilter,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <div className="space-y-6 p-0 md:p-6 mx-auto max-w-7xl">
      <Card className="shadow-md">
        <CardContent className="flex py-3 flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <Input
            placeholder="Wpisz cokolwiek..."
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(String(event.target.value))}
            className="max-w-sm"
          />
          <div className="flex flex-wrap items-center gap-2">
            {filters.map((filter) => (
              <DataTableFilter
                key={filter.columnKey}
                column={table.getColumn(filter.columnKey)}
                title={filter.title}
                options={filterOptions[filter.columnKey] || []}
              />
            ))}
            <DataTableViewOptions table={table} />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md overflow-hidden ">
        <CardContent className="p-0">
          <div className="rounded-md border p-2 bg-white">
            <Table>
              <TableHeader className="bg-gray-100">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        colSpan={header.colSpan}
                        className="font-bold text-gray-700"
                      >
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
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row, index) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      Brak wyników.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardContent className="py-3">
          <DataTablePagination table={table}  rowsPerPage={rowsPerPage}/>
        </CardContent>
      </Card>
    </div>
  );
}
