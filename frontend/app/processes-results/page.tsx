"use client";
import { useSearchParams } from "next/navigation";
import { DataTable } from "@/components/dataTable/dataTable";
import { useColumnsWithClickHandler } from "./columns";
import { useFetchData } from "@/lib/api";
import { SkeletonComponent } from "@/components/ui/skeleton-page";

export default function ProcessesResultsPage() {
  const searchParams = useSearchParams();
  const {
    data: processes,
    isLoading,
    error,
  } = useFetchData<any>(`/processes/?${searchParams?.toString()}`);

  const filters = [
    { columnKey: "documentType", title: "Typ dokumentu" },
    { columnKey: "createdBy", title: "Autorzy" },
    { columnKey: "length_tag", title: "Długość" },
  ];

  const columnsWithClickHandler = useColumnsWithClickHandler();

  if (isLoading) return <SkeletonComponent />;
  if (error) return <>{error.message}</>;
  if (!processes) return null;

  return (
    <DataTable
      columns={columnsWithClickHandler}
      data={processes.results}
      filters={filters}
    />
  );
}
