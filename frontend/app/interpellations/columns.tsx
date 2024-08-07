"use client";

import { DataTableColumnHeader } from "@/components/columns";
import { ColumnDefE, Interpellation } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDefE<Interpellation>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tytuł" />
    ),
  },
  {
    accessorKey: "member",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Autor" />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "sentDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Data wysłania" />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
];

export const getColumnsWithClickHandler = () => {
  return columns.map((column) => ({
    ...column,
    cell: ({
      row,
    }: {
      row: {
        original: Interpellation;
        getValue: (accessorKey: string) => string;
      };
    }) => (
      <a
        href={row.original.bodyLink}
        target="_blank"
        rel="noopener noreferrer"
        className="cursor-pointer"
        onClick={(e) => {
          e.preventDefault();
          window.open(row.original.bodyLink, "_blank", "noopener,noreferrer");
        }}
      >
        {row.getValue(column.accessorKey as string)}
      </a>
    ),
  }));
};
