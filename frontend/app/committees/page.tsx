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
  const { data, isLoading, error } = useFetchData<APIResponse<Committee[]>>(`/committees/`);
  if (isLoading) return <LoadingSpinner/>
  if (error) return <LoadableContainer>{error.message}</LoadableContainer>;
  if (!data) return null;

  const filters = [
    { columnKey: "type", title: "Typ" },
    { columnKey: "compositionDate", title: "Data powołania" },
  ];
  const columnsWithClickHandler = useColumnsWithClickHandler();

  return (
    <div className="mx-1">

    <LoadableContainer>
      {isLoading ? (
        <div>Ładowanie...</div>
      ) : error ? (
        <div>Błąd: {error}</div>
      ) : (
        <DataTable columns={columnsWithClickHandler} data={data.results} filters={filters} />
      )}
    </LoadableContainer>
      </div>
  );
}