"use client";

import { DataTableColumnHeader } from "@/components/dataTable/columns";
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
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Opis" />
    ),
  },

  {
    accessorKey: "kind",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Rodzaj" />
    ),
  },

  {
    accessorKey: "sitting",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Posiedzenie" />
    ),
    filterFn: (row, id, value) => {
      const rowValue = row.getValue(id);
        return value.some((v: any) => Number(v) === rowValue);
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
        onClick={() => router.push(`/votings/${row.original.id}`)}
        className="cursor-pointer"
      >
        {row.getValue(column.accessorKey as string)}
      </div>
    ),
  }));
};
