import React from "react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CaretSortIcon,
  EyeNoneIcon,
  EyeOpenIcon,
} from "@radix-ui/react-icons";
import { Column } from "@tanstack/react-table";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  const handleSort = () => {
      column.toggleSorting(column.getIsSorted() === "asc");
  };

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <span className="font-medium">{title}</span>
      {column.getCanSort() && (
        <Button
          variant="ghost"
          size="sm"
          className="-ml-3 h-8 w-8 p-0"
          onClick={handleSort}
        >
          {column.getIsSorted() === "desc" ? (
            <ArrowDownIcon className="h-4 w-4" />
          ) : column.getIsSorted() === "asc" ? (
            <ArrowUpIcon className="h-4 w-4" />
          ) : (
            <CaretSortIcon className="h-4 w-4" />
          )}
        </Button>
      )}
    </div>
  );
}