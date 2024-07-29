"use client";

import { DataTableColumnHeader } from "@/components/columns";
import { Act } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Act>[] = [
  {
    accessorKey: "ELI",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ELI" />
    ),
  },
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

export const getColumnsWithClickHandler = () => {
  return columns.map((column) => ({
    ...column,
    cell: ({ row }) => (
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
