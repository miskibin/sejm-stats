"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { DataTable } from "@/components/dataTable/dataTable";
import LoadableContainer from "@/components/loadableContainer";
import { Act, APIResponse } from "@/lib/types";
import { getColumnsWithClickHandler } from "./columns";
import { useFetchData } from "@/lib/api";
import { LoadingSpinner } from "@/components/ui/spinner";

export default function ActsResultsPage() {
  const searchParams = useSearchParams();
  const { data, isLoading, error } = useFetchData<APIResponse<Act>>(
    `/acts/?${searchParams?.toString()}`
  );
  if (isLoading) return <LoadingSpinner />;
  if (error) return <LoadableContainer>{error.message}</LoadableContainer>;
  if (!data) return null;

  const filters = [
    { columnKey: "publisher", title: "Wydawca" },
    { columnKey: "status", title: "Status" },
    { columnKey: "announcementDate", title: "Data ogłoszenia" },
    { columnKey: "entryIntoForce", title: "Data wejścia w życie" },
  ];

  return (
    <div className="mx-1">
    
          <DataTable
            columns={getColumnsWithClickHandler()}
            data={data.results}
            filters={filters}
          />
    </div>
  );
}
