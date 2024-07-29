"use client";

import { DataTableColumnHeader } from "@/components/columns";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tytuł" />
    ),
  },
  {
    accessorKey: "createdBy",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Złożono przez" />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "documentDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Data rozpoczęcia" />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "length_tag",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Długość" />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
];

export const getColumnsWithClickHandler = () => {
  const router = useRouter();
  
  return columns.map(column => ({
    ...column,
    cell: ({ row }) => (
      <div
        onClick={() => router.push(`/processes/${row.original.id}`)}
        className="cursor-pointer"
      >
        {row.getValue(column.accessorKey as string)}
      </div>
    ),
  }));
};