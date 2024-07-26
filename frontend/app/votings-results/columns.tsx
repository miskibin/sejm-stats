"use client";

import { DataTableColumnHeader } from "@/components/columns";
import { Voting } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Voting>[] = [

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
      accessorKey: "yes",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Za" />
      ),
      cell: ({ row }) => {
        const yes = row.original.yes;
        return `${yes}`;
      },
    },
    {
      accessorKey: "no",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Przeciw" />
      ),
      cell: ({ row }) => {
        const no = row.original.no;
        return `${no}`;
      },
    },
   
  {
    accessorKey: "success",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      return row.original.success ? "Przyjęto" : "Odrzucono";
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
];