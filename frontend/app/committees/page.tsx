"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { DataTable } from "@/components/dataTable/dataTable";
import LoadableContainer from "@/components/loadableContainer";
import { columns, useColumnsWithClickHandler } from "./columns";
import { useFetchData } from "@/lib/api";
import { APIResponse, Committee, Interpellation } from "@/lib/types";
import { LoadingSpinner } from "@/components/ui/spinner";

export default function CommitteesPage() {
  const { data, isLoading, error } =
    useFetchData<APIResponse<Committee>>(`/committees/`);
  const columnsWithClickHandler = useColumnsWithClickHandler();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <LoadableContainer>{error.message}</LoadableContainer>;
  if (!data) return null;

  const filters = [
    { columnKey: "type", title: "Typ" },
    { columnKey: "compositionDate", title: "Data powołania" },
  ];

  return (
    <div className="mx-1">
          <DataTable
            columns={columnsWithClickHandler}
            data={data.results}
            filters={filters}
          />
    </div>
  );
}
