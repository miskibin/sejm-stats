"use client";
import { DataTable } from "@/components/dataTable/dataTable";
import { columns, getColumnsWithClickHandler } from "./columns";
import LoadableContainer from "@/components/loadableContainer";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { APIResponse, Interpellation } from "@/lib/types";
import { useFetchData } from "@/lib/api";
import { LoadingSpinner } from "@/components/ui/spinner";

async function InterpellationsTable() {
  const searchParams = useSearchParams();
  const { data, isLoading, error } = useFetchData<APIResponse<Interpellation>>(
    `/interpellations/?${searchParams?.toString()}`
  );
  if (isLoading) return <LoadingSpinner />;
  if (error) return <LoadableContainer>{error.message}</LoadableContainer>;
  if (!data) return null;

  const filters = [
    { columnKey: "member", title: "Autor" },
    { columnKey: "sentDate", title: "Data wysłania" },
  ];
  return (
    <>
      {isLoading && <p className="text-center mt-4">Ładowanie...</p>}
      <DataTable
        columns={getColumnsWithClickHandler()}
        data={data.results}
        filters={filters}
      />
      ;
    </>
  );
}

export default function InterpellationsPage() {
  return (
    <div className="mx-1">
      <LoadableContainer>
        <InterpellationsTable />
      </LoadableContainer>
    </div>
  );
}
