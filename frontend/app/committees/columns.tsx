"use client";

import { DataTableColumnHeader } from "@/components/columns";
import { Committee } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
export const columns: ColumnDef<Committee>[] = [
  {
    accessorKey: "code",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Kod" />
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nazwa" />
    ),
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Typ" />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },

  {
    accessorKey: "compositionDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Data powołania" />
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
        onClick={() => router.push(`/committees/${row.original.code}`)}
        className="cursor-pointer"
      >
        {row.getValue(column.accessorKey as string)}
      </div>
    ),
  }));
};