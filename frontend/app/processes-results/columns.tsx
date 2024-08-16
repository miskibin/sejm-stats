"use client";

import { DataTableColumnHeader } from "@/components/columns";
import { ColumnDefE } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";

export const columns: ColumnDefE<any>[] = [
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
    cell: ({ row }) => row.original.createdBy || "Nieznany",

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

export const useColumnsWithClickHandler = () => {
  const router = useRouter();

  return columns.map((column) => ({
    ...column,
    cell: ({
      row,
    }: {
      row: {
        original: any;
        getValue: (accessorKey: string) => string;
      };
    }) => (
      <div
        onClick={() => router.push(`/processes/${row.original.id}`)}
        className="cursor-pointer"
      >
        {row.getValue(column.accessorKey as string)}
      </div>
    ),
  }));
};
