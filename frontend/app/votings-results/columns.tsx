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
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Kategoria" />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Data głosowania" />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  // {
  //   accessorKey: "success",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Sukces" />
  //   ),
  //   filterFn: (row, id, value) => {
  //     return value.includes(row.getValue(id));
  //   },
  // },
];

export const useColumnsWithClickHandler = () => {
  const router = useRouter();

  return columns.map(column => ({
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
        onClick={() => router.push(`/votings/${row.original.id}`)}
        className="cursor-pointer"
      >
        {row.getValue(column.accessorKey as string)}
      </div>
    ),
  }));
};