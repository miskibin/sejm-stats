"use client";

import { DataTableColumnHeader } from "@/components/columns";
import { Act, ColumnDefE } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDefE<Act>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tytuł" />
    ),
  },
  {
    accessorKey: "publisher",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Wydawca" />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "announcementDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Data ogłoszenia" />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "entryIntoForce",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Data wejścia w życie" />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
];

type RowType = {
  original: {
    url: string;
  };
  getValue: (accessorKey: string) => string;
};

export const getColumnsWithClickHandler = () => {
  return columns.map((column) => ({
    ...column,
    cell: ({ row }: { row: RowType }) => (
      <a
        href={row.original.url}
        target="_blank"
        rel="noopener noreferrer"
        className="cursor-pointer"
        onClick={(e) => {
          e.preventDefault();
          window.open(row.original.url, "_blank", "noopener,noreferrer");
        }}
      >
        {row.getValue(column.accessorKey as string)}
      </a>
    ),
  }));
};
